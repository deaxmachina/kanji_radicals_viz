<script>
  import _ from 'lodash'
  import '$lib/styles/global.scss';
  import { getDataFilteredS, getDataFilteredP } from './helperFunctions'
  import { selectedLevel } from '$lib/stores.js'
  import KanjiGraph from './KanjiGraph.js'

  // Props passed down 
  export let dataGraph

  ////////////////////////////
  ///// Graph properties /////
  ////////////////////////////
  // Width and height of the graph container (read-only variables)
  let w 
  let h
  // Responsive variables 
  $: small = w < 900
  $: medium = w >= 900 && w < 1200
  // Properties based on the width and height of the container
  $: marginForOuterCircle = w >= 1200 ? 300 : 100 // How much to leave around outer circle of kanji so that they comfortably fit - for secondary level only
  $: radiusSecondary = Math.min(w, h) - marginForOuterCircle // Radius for the kanji around the radicals - for secondar level only
  $: widthKanjiBox = w >= 1200 ? 22 : 18 // Size of the kanji squares (or circles) depending on width
  const scaleFactorDeg = 0.02 // Scale factor for the degree of the nodes of the radicals
  // The radius that each grade should be at if selected level is primary school
  // For big screens
  $: levelsRadial = ({
    '1': 300,
    '2': 400,
    '3': 500,
    '4': 600,
    '5': 700,
    '6': 800
  })
  // For medium screens
  $: levelsRadialMid = ({
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

  ////////////////////////////
  //////// Draw Graph ////////
  ////////////////////////////
  // The graph props are reactive as they depend on other reactive declarations or variable
	$: props = {
		width: w,
		height: h,
    small: small,
    medium: medium,
    midSize: midSize,
    smallSize: smallSize,
    selectedLevel: $selectedLevel,
    graphProps: {
      marginForOuterCircle,
      radiusSecondary,
      widthKanjiBox,
      scaleFactorDeg,
      levelsRadial,
      levelsRadialMid
    },
    colours,
    grades,
	}
  let graphContainer
  const kanjiGraph = new KanjiGraph()

  $: if (graphContainer) {  
    kanjiGraph
				.selection(graphContainer)
				.data({ links, nodes, nodesCopy, linksCopy })
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
    //height: 100vh;
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