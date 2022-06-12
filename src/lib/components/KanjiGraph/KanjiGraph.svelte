<script>
  import { onMount } from 'svelte'
  import _ from 'lodash'
  import * as d3 from 'd3'
  import '$lib/styles/global.scss';
  import { selectedCategory } from '$lib/stores.js'

  import { filterKanjiDataByCategory } from './helperFunctions.js'
  import KanjiGraph from './KanjiGraph.js'

  // Props passed down 
  export let dataGraph
  export let dataKanjiLevels
  export let categories

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
  $: marginForOuterCircle = w >= 1300 ? 300 : w >= 1200 ? 300 : aspectRatioHorizontal ? 400 : 50
  $: radiusGroups = Math.min(w, h) - marginForOuterCircle // Radius for the kanji around the radicals
  $: widthKanjiBox = w >= 800 ? 22 : 20 // Size of the kanji squares (or circles) depending on width
  // Things that depend on the filtered data
  $: links = dataGraphFiltered.links.map(d => Object.create(d));
  $: nodes = dataGraphFiltered.nodes.map(d => Object.create(d));
  $: subcategories = _.uniqBy(nodes, d => d.subcategory).map(d => d.subcategory).filter(d => d !== 0)
  $: mobileCondition = w <= 800
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
      //colLevels: ['#cce3de', '#a4c3b2', '#6b9080', '#d1b3c4', '#b392ac', '#735d78', '#fe6d73'],
      //colLevels: ['#b9c1cd', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2', '#844588', '#8dcaab'],
      colLevels: ['#8dcaab', '#9fcfc0', '#bdb7cc', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2'],
      colMissingKanji: '#4d5054',
      colText: '#4d5054',  
      colAccent: '#c170ab'
    }
  const scaleFactorDeg = 0.04 // Scale factor for the degree of the nodes of the radicals
  const linkForceByCategory = {
      "Physical Attributes and Properties": 0.35,
      "Nature": 0.4,
      "artificial structures and products": 0.5,
      "people (人)": 0.9,
      "emotions and senses (感)": 0.55,
      "human activities": 0.65,
      "body (身)": 0.8
    }

  // The graph props are reactive as they depend on other reactive declarations or variable
	$: props = {
		width: w,
		height: h,
    mobileCondition,
    aspectRatioHorizontal,
    graphProps: {
      marginForOuterCircle,
      radiusGroups,
      widthKanjiBox,
      scaleFactorDeg
    },
    colours,
    grades,
    selectedCategory: $selectedCategory,
    linkForceByCategory
	}

  ////////////////////////////
  /// Interactive Elements ///
  ////////////////////////////
  //let selectedCategory // To store the kanji category selected 
  $: dataGraphFiltered = filterKanjiDataByCategory(dataGraph, $selectedCategory) // Filter the data based on selected categoty
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
  <div
    id='kanji-graph-container'
    bind:this={graphContainer}
    bind:clientHeight={h}
    bind:clientWidth={w}
  >
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
    height: 1100px;
    width: 100%;
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