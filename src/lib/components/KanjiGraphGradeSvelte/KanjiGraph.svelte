<script>
  import * as d3 from 'd3'
  import _ from 'lodash'
  import '$lib/styles/global.scss';
  import { getDataFilteredS, getDataFilteredP } from './helperFunctions'
  import { selectedLevel, selectedKanji } from '$lib/stores.js'
  import KanjiPopup from '../KanjiPopup/KanjiPopup.svelte'

  // Props passed down 
  export let dataGraph

  ////////////////////////////////////////////////////////
  /////////////////// Graph properties ///////////////////
  ////////////////////////////////////////////////////////
  // Width and height of the graph container (read-only variables)
  let width
  let height
  // Resposive markers
  $: small = width < 900
  $: medium = width >= 900 && width < 1300
  $: large = width >= 1300
  $: screenSize = small ? 'small' : medium ? 'medium' : large ? 'large' : undefined
  // Responsive sizes 
  $: marginForOuterCircle = 200 // How much to leave around outer circle of kanji so that they comfortably fit - for secondary level only
  $: radiusSecondary = width/2 - marginForOuterCircle // Radius for the kanji around the radicals - for secondar level only
  $: widthKanjiBox = large ? 24 : 20 // Size of the kanji squares (or circles) depending on width
  
  /// Constant Props ///
  // The radius that each grade should be at if selected level is primary school
  // For big screens
  //const levelsRadialLarge = ({ '1': 350, '2': 440, '3': 530, '4': 620, '5': 710, '6': 800 })
  const levelsRadialLarge = ({ '1': 350, '2': 450, '3': 550, '4': 650, '5': 750, '6': 850 })
  // For medium screens
  const levelsRadialMedium = ({ '1': 250, '2': 300, '3': 350, '4': 400, '5': 450, '6': 500 })
  // Other positioning constants for different screen sizes
  const smallSizeProps = {
    height: 3000,
    verticalScaleFactor: 2.5,
    yOffsetForKanjiStart: 700
  }
  const mediumSizeProps = {
    height: 2000,
    yOffsetForKanjiStart: 500
  }
  const grades = ['1', '2', '3', '4', '5', '6', 'S']
  const colours = {
      colBg: '#f7ede2',//'#f7ede2', //'#352d39',
      colLinks: "#fff",      
      colRadicals: '#fff' ,//'#f7ede2', 
      colSubcategoriesNodes: '#fff',
      colRadicalsText: '#251926',
      colStrokeRadicals: "#251926",  
      colKanjiText: '#fff',
      colStrokeKanji: "#251926",
      colLevels: ['#8dcaab', '#9fcfc0', '#bdb7cc', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2'],
      colMissingKanji: '#4d5054',
      colText: '#4d5054',  
      colAccent: '#c170ab'
    }

  ////////////////////////////////////////////////////////
  /////////////////// Data Computations //////////////////
  ////////////////////////////////////////////////////////
  $: dataFilteredP = getDataFilteredP(dataGraph)
  $: dataFilteredS = getDataFilteredS(dataGraph)
  $: dataFiltered = $selectedLevel === 'Primary school' ? dataFilteredP : dataFilteredS
  // Get a clean copy of the nodes and links of the graph for the selected level 
  $: nodesCopy = _.cloneDeep(dataFiltered.nodes)
  $: linksCopy = _.cloneDeep(dataFiltered.links)
  // Get a copy of links and nodes which we'll modify with forces
  // $: links = dataFiltered.links.map(d => Object.create(d));
  // $: nodes = dataFiltered.nodes.map(d => Object.create(d));
  let nodes 
  let links

  ////////////////////////////////////////////////////////
  /////////////////////// Scales  ////////////////////////
  ////////////////////////////////////////////////////////
  // Scale for mobile to position vertically 
  $: subcategoryVerticalScale = d3.scalePoint()
    .domain(['1', '2', '3', '4', '5', '6'])
    .range([smallSizeProps.yOffsetForKanjiStart, smallSizeProps.height + 200])

  // Colour scale for kanji by level (grade)
  const colourByGradeScale = d3.scaleOrdinal()
    .domain(grades)
    .range(colours.colLevels)

  // Find the max degree 
  $: maxDegreeRadicalNode = _.chain(linksCopy)
    .countBy('source')
    .toArray()
    .max()
    .value();
  
  // Scale radical nodes by their out degree
  $: radicalNodeSizeScale = d3.scaleSqrt()
    .domain([1, maxDegreeRadicalNode])
    .range([0.9, 2.8])
  

  ////////////////////////////////////////////////////////
  ///////////////////// Simulation ///////////////////////
  ////////////////////////////////////////////////////////
  $: scaleFunction = d => d.type === 'radical' ? radicalNodeSizeScale(linksCopy.filter(l => l.source === d.id).length) : 1
  $: scaleFunctionNodes = d => `scale(${scaleFunction(d)})`
  $: radiusCollide = d => d.type === 'radical' ? widthKanjiBox * 0.55 * scaleFunction(d) : widthKanjiBox*0.65
  $: collideForce = d3.forceCollide().radius(radiusCollide).iterations(2).strength(1)
  //$: radialForceP = d3.forceRadial(d => d.type === 'kanji' ? levelsRadialLarge[d.Grade] : 0).strength(2.5)
  $: radialForceP = d3.forceRadial(d => d.type === 'kanji' ?  
      medium ? levelsRadialMedium[d.Grade] : large ? levelsRadialLarge[d.Grade] : 0
    : 0
  ).strength(2.3)
  $: radialForceS = d3.forceRadial(d => d.type === 'kanji' ? radiusSecondary : 0).strength(0.9)
  $: radialForce = $selectedLevel === 'Primary school' ? radialForceP : radialForceS
  //$: linkForce = d3.forceLink(links).id(d => d.id)//.strength(1.2)
  // Vertically position 
  $: yForce = $selectedLevel === 'Primary school' 
    ? d3.forceY(d => (d.type === 'kanji') ? subcategoryVerticalScale(d.Grade) : 0).strength(3)
    : d3.forceY((d, i) => (d.type === 'kanji') ? i%5 * 1000 + 500 : -200).strength(0.8)
  $: xForce = d3.forceX(d => 0).strength(3)

  // Define different simulation based on the screen size
  let simulation 
  $: if (screenSize === 'small') {
    console.log('screen is small')
    nodes = dataFiltered.nodes.map(d => Object.create(d));
    links = dataFiltered.links.map(d => Object.create(d));
    simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("collide", collideForce)
      .force('xForce', xForce)
      .force('yForce', yForce)
      .force("radial", null)
  }
  $: if (screenSize === 'large' || screenSize === 'medium') {
    console.log(`screen is ${screenSize}`)
    nodes = dataFiltered.nodes.map(d => Object.create(d));
    links = dataFiltered.links.map(d => Object.create(d));
    simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("collide", collideForce)
      .force("radial", radialForce)
      .force("xForce", null)
      .force("yForce", null)
  }

  let simulationFinished = false
  const NUM_ITERATIONS = 400;
  // ***Important***
  // We need to store the nodes and links in separate variables and update them with '='
  // Then loop over these variables when rendering the nodes and links in DOM
  // This is so that svelte knows there has been an update and it should re-render the dom 
  // Since the d3 force simulation updates the nodes and links props without re-assigning these (which is what svelte needs to see)
  let nodesSimulation = undefined
  let linksSimulation = undefined
  // // Option 1: With simulation movemenet visible
  // $: if (simulation) {
  //   simulation.restart()
  //   simulation.on('tick', d => {
  //     // console.log('tick') // Uncomment to see the ticks
  //     nodesSimulation = nodes
  //     linksSimulation = links
  //   })
  //   setTimeout(() => {
  //     simulationFinished = true
  //   }, 50);
  // }

  //Option 2: Render the final position of the graph after NUM_ITERATIONS number of ticks
  $: if (simulation) {
    simulation.tick(NUM_ITERATIONS)
    simulation.stop()
    nodesSimulation = [...nodes]
    linksSimulation = [...links]
    simulationFinished = true
  }

  // Interactivity
  let nodesToHighlightIds = [] // Store the ids of the nodes we want to highlight on hover

</script>


<section id='kanji-graph-section'>
  {#if $selectedKanji}
    <KanjiPopup />
  {/if}
  <div
    id='kanji-graph-container'
    bind:clientHeight={height}
    bind:clientWidth={width}
  >
  {#if simulationFinished && typeof(nodesSimulation) !== undefined && typeof(linksSimulation) !== undefined}
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <svg 
    width={width} height={small ? smallSizeProps.height : width * 0.9}
    on:mouseover|self={() => { nodesToHighlightIds = [] }}

  >
    <g class='g-kanji-graph' transform='translate({width*0.5}, {small ? 0 : width*0.45})'>
      <!-- <g class='g-links' stroke={colours.colLinks}>
        {#each linksSimulation as link}
          <line 
            class='link'
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
          ></line>
        {/each}
      </g> -->
      <g class='g-nodes'>
        {#each nodesSimulation as node}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <g 
            class='node-g' 
            transform='translate({node.x}, {node.y})'
            on:click={(e) => {
              if (node.type === 'kanji') {
                const kanjiData = { 
                  kanji: node.id.split('-')[0], 
                  radicals: node.radicals, 
                  kun_readings: node.kun_readings, 
                  on_readings: node.on_readings, 
                  meanings: node.meanings, 
                  grade: node.Grade
                }
                selectedKanji.set(kanjiData)
              }
            }}
            on:mouseenter={(e) => {
              // All the target nodes for selected node
              const targetNodesIds = linksCopy.filter(l => l.target === node.id).map(l => l.source)
              const sourceNodesIds = linksCopy.filter(l => l.source === node.id).map(l => l.target)
              // The selected node itself 
              const hoveredNode = node.id
              // Add the nodes that we want to highlight
              nodesToHighlightIds = [...targetNodesIds, ...sourceNodesIds, hoveredNode]
            }}
            style='opacity: { nodesToHighlightIds.length > 0 ? nodesToHighlightIds.includes(node.id) ? 1 : 0.1 : 1 }'
          >
            <rect
              class='node-rect-grade'
              x={-widthKanjiBox/2}
              y={-widthKanjiBox/2}
              width={widthKanjiBox}
              height={widthKanjiBox}
              transform={scaleFunctionNodes(node)}
              fill={node.type === 'kanji' ? colourByGradeScale(node.Grade) : colours.colRadicals}
              stroke={node.type === 'kanji' ? colourByGradeScale(node.Grade) : colours.colStrokeRadicals}
              style='
                stroke-width: {node.type === 'kanji' ? 4 : 2.4}; 
                stroke-opacity: {node.type === 'kanji' ? 0.95 : 1};
              '
              rx={node.type === 'kanji' ? 0 : 10}
            >
            </rect>
            <text
              class='node-text-grade'
              class:kanji-text-grade={node.type === 'kanji'}
              class:radical-text-grade={node.type === 'radical'}
              dy='0.35em'
              fontSize={`${widthKanjiBox * 0.75}px`}
              stroke='none'
              fill={node.type === 'radical' ? colours.colRadicalsText : colours.colKanjiText}
              transform={scaleFunctionNodes(node)}
            >
              {node.id.split('-')[0]}
            </text>
          </g>
        {/each}
      </g>
    </g>
  </svg>
  {/if}
  </div>
</section>


<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  @import url("https://use.typekit.net/pso5rde.css");
  #kanji-graph-section {
    width: 100%;
    margin: auto;
    position: relative;
  }
  #kanji-graph-container {
    margin: auto;
    //height: 100vh;
    width: 100%;
  }

  g.g-links {
    stroke-opacity: 0.5;
    stroke-width: 0.4;
  }

  g.g-nodes {
    g.node-g {
      cursor: pointer;
      transition: all 0.5s ease;
    }
  }

  text.node-text-grade {
    text-anchor: middle;
  }
  text.radical-text-grade {
    font-weight: 300;
    font-family: 'Noto Sans JP', sans-serif;
  }
  text.kanji-text-grade {
    font-weight: 300;
    font-family: 'Noto Sans JP', sans-serif;
  }

</style>