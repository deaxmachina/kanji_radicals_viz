<script>
  import _ from 'lodash'
  import '$lib/styles/global.scss';
  import HeaderFullPage from '$lib/components/HeaderFullPage/index.svelte'
  import KanjiGraphCategory from '$lib/components/KanjiGraphCategory/KanjiGraph.svelte'
  import KanjiGraphGrade from '$lib/components/KanjiGraphGradeSvelteNotResponsive/KanjiGraph.svelte'
  //import KanjiGraphGrade from '$lib/components/KanjiGraphGradeCanvas/KanjiGraph.svelte'
  import Dropdown from '$lib/components/Dropdown/index.svelte'
  import Footer from '$lib/components/Footer/index.svelte'
  import GradeLegend from '$lib/components/GradeLegend/index.svelte'
  import dataGraphCategory from "./data/graph_categories_all.json"
  import dataGraphGrades from "./data/graph_grades_all.json"
  import dataKanjiLevels from "./data/kanji_levels.json"
  import SEO from '$lib/components/SEO/index.svelte'

  // Default order 
  // const categories = _.uniqBy(dataGraphCategory.nodes, d => d.category).map(d => d.category).filter(d => d !== 0)
  // Hand-picked order
  const categories = ["Nature", "Physical Attributes and Properties", "artificial structures and products", "people (人)", "emotions and senses (感)", "human activities", "body (身)"]

  // Which view of the data to see - by topic or by grade
  let view = 'topic'
  const setView = (e) => {
    view = e.detail.text
  }
</script>

<SEO 
  pageTitle='˚ʚ♡ɞ˚ Kanji + radicals ₊˚ʚ ᗢ₊˚✧ ﾟ.'
  faviconPngUrl=''
  faviconIcoUrl=''
  siteUrl='https://kanjiviz.netlify.app/'
  shareTitle='Kanji with radicals'
  description='Interactive graphs of kanji by their constituent radicals, grouped by topic and school grade. Explore and find patterns for easier kanji memorisation ~⋆˙⟡♡!'
  shareImgUrl="https://live.staticflickr.com/65535/52196710227_eebccf6157_h.jpg"
  shareImgAltText="Image containing the words 'kanji with radicals'"
/>
<div class='wrapper'>
  <HeaderFullPage on:view={setView} />
  <Dropdown {categories} {view} />
  <GradeLegend {view}/>
  {#if view === 'topic'}
    <KanjiGraphCategory dataGraph={dataGraphCategory} {dataKanjiLevels} {categories} />
  {:else if view === 'grade'}
    <KanjiGraphGrade dataGraph={dataGraphGrades} />
  {:else}
    <div></div>
  {/if}
</div>

<Footer />

<style lang='scss'>
  @import './styles/global.scss';
  .wrapper {
    max-width: 1800px;
    margin: auto;
  }
</style>