<script>
  import { onMount } from 'svelte'
  import _ from 'lodash'
  import * as d3 from 'd3'
  import '$lib/styles/global.scss';

  import dataGraph from "./data/graph_all.json"
  import dataKanjiLevels from "./data/kanji_levels.json"

  import { filterKanjiDataByCategory } from './helperFunctions.js'
  import KanjiGraph from './KanjiGraph.js'

  ////////////////////////////
  ///// Graph properties /////
  ////////////////////////////
  // Width and height of the graph container (read-only variables)
  let w 
  let h
  // Properties based on the width and height of the container
  $: aspectRatio = w / h
  $: aspectRatioHorizontal = aspectRatio > 1
  // How much to leave around outer circle of kanji so that they comfortably fit
  $: marginForOuterCircle = w >= 1300 ? 200 : w >= 1200 ? 300 : aspectRatioHorizontal ? 400 : 50
  $: radiusGroups = Math.min(w, h) - marginForOuterCircle // Radius for the kanji around the radicals
  $: widthKanjiBox = w >= 800 ? 26 : 20 // Size of the kanji squares (or circles) depending on width
  // Things that depend on the filtered data
  $: links = dataGraphFiltered.links.map(d => Object.create(d));
  $: nodes = dataGraphFiltered.nodes.map(d => Object.create(d));
  $: subcategories = _.uniqBy(nodes, d => d.subcategory).map(d => d.subcategory).filter(d => d !== 0)
  $: console.log('subcategories', subcategories)
  // Constant props 
  const grades = ['1', '2', '3', '4', '5', '6', 'S']
  const colours = {
      colBg: '#f7ede2',//'#f7ede2', //'#352d39',
      colLinks: "#fff",      
      colRadicals: '#fff' ,//'#f7ede2', 
      colRadicalsText: '#251926',
      colStrokeRadicals: "#251926",  
      colKanjiText: '#fff',
      colStrokeKanji: "#251926",
      //colLevels: ['#cce3de', '#a4c3b2', '#6b9080', '#d1b3c4', '#b392ac', '#735d78', '#fe6d73'],
      //colLevels: ['#b9c1cd', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2', '#844588', '#8dcaab'],
      colLevels: ['#8dcaab', '#9fcfc0', '#bdb7cc', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2'],
      colMissingKanji: '#4d5054',
      
    }
  const scaleFactorDeg = 0.04 // Scale factor for the degree of the nodes of the radicals

  // The graph props are reactive as they depend on other reactive declarations or variable
	$: props = {
		width: w,
		height: h,
    aspectRatioHorizontal,
    graphProps: {
      marginForOuterCircle,
      radiusGroups,
      widthKanjiBox,
      scaleFactorDeg
    },
    colours,
    grades,
    selectedCategory
	}

  ////////////////////////////
  /// Interactive Elements ///
  ////////////////////////////
  const categories = _.uniqBy(dataGraph.nodes, d => d.category).map(d => d.category).filter(d => d !== 0)
  let selectedCategory // To store the kanji category selected 
  $: dataGraphFiltered = filterKanjiDataByCategory(dataGraph, selectedCategory) // Filter the data based on selected categoty
  // Get a clean copy of the nodes and links of the graph for the selected category 
  $: nodesCopy = _.cloneDeep(dataGraphFiltered.nodes)
  $: linksCopy = _.cloneDeep(dataGraphFiltered.links)

  ////////////////////////////
  //////// Draw Graph ////////
  ////////////////////////////
  let graphContainer
  const kanjiGraph = new KanjiGraph()

  $: if (graphContainer) {  
    console.log('drawing graph from reactive')
    //d3.selectAll('.kanji-graph-svg').remove()
    kanjiGraph
				.selection(graphContainer)
				.data({ nodes, links, nodesCopy, linksCopy, subcategories, dataKanjiLevels })
				.props(props)
				.draw()	
    
	}

</script>


<section id='kanji-graph-section'>

  <div class='kanji-category-selector-container'>
    <label for="kanji-categories">Select a kanji category</label>
    <select name="kanji-categories" id="kanji-categories" bind:value={selectedCategory}>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>

  <div
    id='kanji-graph-container'
    bind:this={graphContainer}
    bind:clientHeight={h}
    bind:clientWidth={w}
  >
  </div>

</section>


<style lang='scss'>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700&display=swap');
  #kanji-graph-section {
    width: 100vw;
    //background-color: red;
  }
  #kanji-graph-container {
    background-color: red;
    margin: auto;
    height: 1100px; // Should be a fixed number rather than in vh as that will keep changing if height of window changes and thus re-draw the whole graph
    width: 100%;
  }
  :global {
        text.node-text {
        }
        text.radical-text {
          font-weight: 300;
          //font-family:'Times New Roman', Times, serif;
          font-family: 'Noto Sans JP', sans-serif;
        }
        text.kanji-text {
          font-weight: 300;
          font-family: 'Noto Sans JP', sans-serif;
        }
  }
</style>