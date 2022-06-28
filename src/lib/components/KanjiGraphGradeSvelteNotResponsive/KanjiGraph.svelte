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
  const width = 1400;
  const height = width
  const marginForOuterCircle = 100 // How much to leave around outer circle of kanji so that they comfortably fit - for secondary level only
  const radiusSecondary = width/2 - marginForOuterCircle // Radius for the kanji around the radicals - for secondar level only
  const widthKanjiBox = 24
  //const levelsRadial = ({ '1': 350, '2': 450, '3': 550, '4': 650, '5': 750, '6': 850 })
  const levelsRadial = ({ '1': 350, '2': 420, '3': 490, '4': 560, '5': 630, '6': 700 })
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
  $: radialForceP = d3.forceRadial(d => d.type === 'kanji' ? levelsRadial[d.Grade] : 0).strength(2.3)
  $: radialForceS = d3.forceRadial(d => d.type === 'kanji' ? radiusSecondary : 0).strength(0.9)
  $: radialForce = $selectedLevel === 'Primary school' ? radialForceP : radialForceS

  let simulation 
  $: {
    nodes = dataFiltered.nodes.map(d => Object.create(d));
    links = dataFiltered.links.map(d => Object.create(d));
    simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).strength(0.1))
      .force("collide", collideForce)
      .force("radial", radialForce)
      .force("xForce", null)
      .force("yForce", null)
  }

  let simulationFinished = false
  const NUM_ITERATIONS = 300;
  // ***Important***
  // We need to store the nodes and links in separate variables and update them with '='
  // Then loop over these variables when rendering the nodes and links in DOM
  // This is so that svelte knows there has been an update and it should re-render the dom 
  // Since the d3 force simulation updates the nodes and links props without re-assigning these (which is what svelte needs to see)
  let nodesSimulation = undefined
  let linksSimulation = undefined
  // Option 1: With simulation movemenet visible
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
  >
  {#if simulationFinished && typeof(nodesSimulation) !== undefined && typeof(linksSimulation) !== undefined}
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <svg 
    width={width} height={height}
    on:mouseover|self={() => { nodesToHighlightIds = [] }}
  >
    <g class='g-kanji-graph' transform='translate({width*0.5}, {width*0.5})'>
      <!-- <g class='g-links' stroke={colours.colLinks}>
        {#each linksSimulation as link}
          <line 
            class='link'
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            style='stroke-width: { nodesToHighlightIds.length > 0 ? (nodesToHighlightIds.includes(link.source) || nodesToHighlightIds.includes(link.target)) ? 10 : 0.1 : 1 }'
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
  {:else if !simulationFinished}
    <h1>Wait</h1>
  {:else}
    <div></div>
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
    width: 100%;
    overflow: auto;
  }

  svg {
    display: block;
    margin: auto;
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