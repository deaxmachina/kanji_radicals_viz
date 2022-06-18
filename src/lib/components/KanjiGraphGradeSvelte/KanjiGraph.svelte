<script>
  import * as d3 from 'd3'
  import _ from 'lodash'
  import { beforeUpdate } from 'svelte';
  import '$lib/styles/global.scss';
  import { getDataFilteredS, getDataFilteredP } from './helperFunctions'
  import { selectedLevel } from '$lib/stores.js'

  // Props passed down 
  export let dataGraph

  ////////////////////////////
  ///// Graph properties /////
  ////////////////////////////
  // Width and height of the graph container (read-only variables)
  let width
  let height
  // Responsive variables 
  $: small = width < 900
  $: medium = width >= 900 && width < 1200
  // Properties based on the width and height of the container
  $: marginForOuterCircle = width >= 1200 ? 300 : 100 // How much to leave around outer circle of kanji so that they comfortably fit - for secondary level only
  $: radiusSecondary = Math.min(width, height) - marginForOuterCircle // Radius for the kanji around the radicals - for secondar level only
  $: widthKanjiBox = width >= 1200 ? 22 : 18 // Size of the kanji squares (or circles) depending on width
  const scaleFactorDeg = 0.02 // Scale factor for the degree of the nodes of the radicals
  // The radius that each grade should be at if selected level is primary school
  // For big screens
  const levelsRadial = ({
    '1': 300,
    '2': 400,
    '3': 500,
    '4': 600,
    '5': 700,
    '6': 800
  })
  // For medium screens
  const levelsRadialMid = ({
    '1': 250,
    '2': 300,
    '3': 350,
    '4': 400,
    '5': 450,
    '6': 500
  })
  const midSize = {
    height: 2000,
    yOffsetForKanjiStart: 500
  }
  const smallSize = {
    height: 3000,
    verticalScaleFactor: 2.5,
    yOffsetForKanjiStart: 700
  }
  // Constant props 
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

  ////////////////////////////
  /// Interactive Elements ///
  ////////////////////////////
  //let selectedLevel = 'Primary school'
  $: dataFilteredP = getDataFilteredP(dataGraph)
  $: dataFilteredS = getDataFilteredS(dataGraph)
  $: dataFiltered = $selectedLevel === 'Primary school' ? dataFilteredP : dataFilteredS
  // Get a clean copy of the nodes and links of the graph for the selected level 
  $: nodesCopy = _.cloneDeep(dataFiltered.nodes)
  $: linksCopy = _.cloneDeep(dataFiltered.links)

  // Things that depend on the filtered data
  $: links = dataFiltered.links.map(d => Object.create(d));
  $: nodes = dataFiltered.nodes.map(d => Object.create(d));

  let graphContainer

  ////////////////////////////////
  //////////// Scales ////////////
  ////////////////////////////////

  // Scale for mobile to position vertically 
  $: subcategoryVerticalScale = d3.scalePoint()
    .domain(['1', '2', '3', '4', '5', '6'])
    .range([smallSize.yOffsetForKanjiStart, smallSize.height + 200])

  // Colour scale for kanji by level (grade)
  $: colourByGradeScale = d3.scaleOrdinal()
    .domain(grades)
    .range(colours.colLevels)

  // Find the max degree 
  $: maxDegreeRadicalNode = _.chain(linksCopy)
    .countBy('source')
    .toArray()
    .max()
    .value();
  $: radicalNodeSizeScale = d3.scaleSqrt()
    .domain([1, maxDegreeRadicalNode])
    .range([0.9, 2.8])


  /////////////////////////////////////////////////
  ///////////// Simulation Definition /////////////
  /////////////////////////////////////////////////
  $: scaleFunction = d => d.type === 'radical' ? radicalNodeSizeScale(linksCopy.filter(l => l.source === d.id).length) : 1
  $: scaleFunctionNodes = d => `scale(${scaleFunction(d)})`
  $: radiusCollide = d => d.type === 'radical' ? widthKanjiBox * 0.62 * scaleFunction(d) : widthKanjiBox*0.7
  $: collideForce = d3.forceCollide().radius(radiusCollide).iterations(2).strength(1)
  $:radialForceP = d3.forceRadial(d => d.type === 'kanji' 
      ?  medium ? levelsRadialMid[d.Grade] : levelsRadial[d.Grade] 
      : 0
    ).strength(2.5)
  //$: radialForceP = d3.forceRadial(0).strength(2.5)
  $: radialForceS = d3.forceRadial(d => d.type === 'kanji' ? radiusSecondary : 0).strength(2.5)
  $: radialForce = $selectedLevel === 'Primary school' ? radialForceP : radialForceS
  $: linkForce = d3.forceLink(links).id(d => d.id)//.strength(1.2)
  // Vertically position 
  $: yForce = d3.forceY(d => (d.type === 'kanji') ? subcategoryVerticalScale(d.Grade) : 0).strength(3)
  $: xForce = d3.forceX(d => 0).strength(2)

  let simulation 
  $: if (nodes && linkForce && collideForce && xForce && yForce) {
      simulation = d3.forceSimulation(nodes)
      .force("link", linkForce)
      .force("collide", collideForce)
      .force("radial", radialForce)
  }


  let linkG
  let nodesG
  let simulationFinished = false
  beforeUpdate(() => {
    if (simulation) {
      const NUM_ITERATIONS = 100;
      for (let i = 0; i < NUM_ITERATIONS; ++i) {
        simulation.tick();
      };
      simulation.stop();
      simulationFinished = true
    }
  })


  $: console.log('nodes', nodes)


</script>


<section id='kanji-graph-section'>
  <div
    id='kanji-graph-container'
    bind:this={graphContainer}
    bind:clientHeight={height}
    bind:clientWidth={width}
  >
  {#if simulationFinished}
  <svg width={width} height={small ? smallSize.height : width }>
    <g class='g-kanji-graph' transform='translate({width*0.5}, {small ? 0 : width*0.5})'>
      <g class='g-links' stroke={colours.colLinks} bind:this={linkG}>
        {#each links as link}
          <line 
            class='link'
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
          ></line>
        {/each}
      </g>
      <g class='g-nodes'>
        {#each nodes as node}
          <g class='node-g' transform='translate({node.x}, {node.y})'>
            <rect
              x={-widthKanjiBox/2}
              y={-widthKanjiBox/2}
              width={widthKanjiBox}
              height={widthKanjiBox}
              transform={scaleFunctionNodes(node)}
              fill={node.type === 'kanji' ? colourByGradeScale(node.Grade) : colours.colRadicals}
              stroke={node.type === 'kanji' ? colourByGradeScale(node.Grade) : colours.colStrokeRadicals}
            >
            </rect>
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
    }
  }


  :global {
        text.node-text {
        }
        text.radical-text {
          font-weight: 300;
          font-family: 'Noto Sans JP', sans-serif;
        }
        text.kanji-text {
          font-weight: 300;
          font-family: 'Noto Sans JP', sans-serif;
        }
        text.subcategories-nodes-label, text.subcategories-entries-num, text.subcategories-entries-text {
          font-size: 14px;
          fill: #4d5054;
          font-family: 'houschka-rounded', sans-serif;
          font-weight: 600;
        }
        text.subcategories-entries-text {
          font-size: 16px;
          font-weight: 300;
        }
        text.subcategories-label {
          font-size: 20px;
          fill: #4d5054;
          font-family: 'houschka-rounded', sans-serif;
          font-weight: 600;
        }
  }
</style>