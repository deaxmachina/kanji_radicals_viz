<script>
  import { onMount } from 'svelte'
  import _ from 'lodash'
  import '$lib/styles/global.scss';

  import dataGraph from "$lib/assets/graph_all.json"
  import dataKanjiLevels from "$lib/assets/kanji_levels.json"

  import { filterKanjiDataByCategory } from './helperFunctions'
  import KanjiGraph from './KanjiGraph'

  ////////////////////////////
  ///// Graph properties /////
  ////////////////////////////
  // Width and height of the window
  let innerWidth 
  let innerHeight
  $: minDimWindow = Math.max(innerWidth, innerHeight) // Width and height of graph container will be set based on this

  // Width and height of the graph container (read-only variables)
  $: w = minDimWindow
  $: h = innerHeight
  const margin = { top: 0, right: 0, bottom: 0, left: 0 }
  $: boundedWidth = w - margin.left - margin.right
	$: boundedHeight = h - margin.top - margin.bottom
  const marginForOuterCircle = 0 // How much to leave around outer circle of kanji so that they comfortably fit
  $: radiusGroups = Math.min(boundedWidth, boundedHeight) - marginForOuterCircle // Radius for the kanji around the radicals
  $: widthKanjiBox = w >= 800 ? 24 : 10 // Size of the kanji squares (or circles) depending on width
  // Things that depend on the filtered data
  $: links = dataGraphFiltered.links.map(d => Object.create(d));
  $: nodes = dataGraphFiltered.nodes.map(d => Object.create(d));
  $: subcategories = _.uniqBy(nodes, d => d.subcategory).map(d => d.subcategory).filter(d => d !== 0)

  // The graph props are reactive as they depend on other reactive declarations or variable
	$: props = {
		width: w,
		height: h,
		margin: margin,
		boundedWidth: boundedWidth,
		boundedHeight: boundedHeight,
    graphProps: {
      marginForOuterCircle,
      radiusGroups,
      widthKanjiBox
    }
	}

  ////////////////////////////
  /// Interactive Elements ///
  ////////////////////////////
  const grades = ['1', '2', '3', '4', '5', '6', 'S']
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
  // // Set up and draw the graph for the first time - doesn't work when the svelte window is involved
  // onMount(() => {
  //   console.log('drawing a graph for the first time')
  //   if (innerWidth && innerHeight && minDimWindow) {
  //     kanjiGraph
	// 			.selection(graphContainer)
	// 			.data({ dataGraphFiltered, nodesCopy, linksCopy, dataKanjiLevels })
	// 			.props(props)
	// 			.draw()	
  //   }
  // })

  $: if (graphContainer && innerWidth && innerHeight && minDimWindow) {  
    console.log('drawing graph from reactive')
    kanjiGraph
				.selection(graphContainer)
				.data({ dataGraphFiltered, nodes, links, nodesCopy, linksCopy, subcategories, dataKanjiLevels })
				.props(props)
				.draw()	
    
	}

</script>


<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>
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
    style='width: {minDimWindow}px; height: {innerHeight}px;'
  >
  </div>

</section>

<style lang='scss'>
  #kanji-graph-container {
    background-color: red;
    margin: auto;
  }
</style>