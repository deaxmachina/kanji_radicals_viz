<script>
  import { onMount } from 'svelte'
  import * as d3 from 'd3'
  import _ from 'lodash'
  import '$lib/styles/global.scss';
  import { getDataFilteredS, getDataFilteredP } from './helperFunctions'
  import { selectedLevel, selectedKanji } from '$lib/stores.js'
  import KanjiPopup from '../KanjiPopup/KanjiPopup.svelte'

  // Props passed down 
  export let dataGraph
  let wrapperEl
  let canvasEl

  ////////////////////////////////////////////////////////
  /////////////////// Graph properties ///////////////////
  ////////////////////////////////////////////////////////
  // Width and height of the graph container (read-only variables)
  let width
  let height
	let resizeOcurred = false // Just to keep track if a resize event has happened even once
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
  $: links = dataFiltered.links.map(d => Object.create(d));
  $: nodes = dataFiltered.nodes.map(d => Object.create(d));


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
  $: radialForceP = d3.forceRadial(d => d.type === 'kanji' ?  
      medium ? levelsRadialMedium[d.Grade] : large ? levelsRadialLarge[d.Grade] : 0
    : 0
  ).strength(2.3)
  $: radialForceS = d3.forceRadial(d => d.type === 'kanji' ? radiusSecondary : 0).strength(0.9)
  $: radialForce = $selectedLevel === 'Primary school' ? radialForceP : radialForceS

  $: simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("collide", collideForce)
      .force("radial", radialForce)
      .alpha(resizeOcurred ? 0.3 : 1) // So that forces don't go crazy
      .restart()
      //.force('center', centerForce)


  let ctx
  let scale = 1
  onMount(() => {
    ctx = canvasEl.getContext('2d');
    //const scale = window.devicePixelRatio;
    // ctx.canvas.width = width * scale;
    // ctx.canvas.height = height * scale;
    // ctx.scale(scale, scale);
  })

  $: if (ctx) {
    ctx.canvas.width = width * scale;
    ctx.canvas.height = height * scale;
  }
  $: resize = () => {
    resizeOcurred = true
    ctx.canvas.width = width * scale;
    ctx.canvas.height = height * scale;
    // ctx.scale(scale, scale);
  }

  const widthN = 5
  $: simulation.on('tick', () => { 
      ctx.clearRect(0, 0, width, height)
      ctx.save();
      for (const [i, node] of nodes.entries()) {
        ctx.beginPath();
        ctx.moveTo(width/2 + node.x + widthN, height/2 + node.y);
        ctx.arc(width/2 + node.x, height/2 + node.y, widthN, 0, 2 * Math.PI);
        ctx.fillStyle = 'green'
        ctx.strokeStyle = 'blue'
        ctx.fill()
        ctx.stroke()
      }
      ctx.restore()
    })



</script>

<svelte:window on:resize={resize}/>

<section id='kanji-graph-section'>
  {#if $selectedKanji}
    <KanjiPopup />
  {/if}
  <div
    bind:this={wrapperEl}
    id='kanji-graph-container'
    bind:clientHeight={height}
    bind:clientWidth={width}
  >
    <canvas 
      bind:this={canvasEl} 
    ></canvas>
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
    height: 100vh;
    width: 100%;
  }

  canvas {
    box-sizing: border-box;
    width: 100%;
		height: 100%;
    border: 5px solid red;
    background-color: pink;
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