<script>
  import _ from 'lodash'
  import '$lib/styles/global.scss';
  import Header from '$lib/components/Header/index.svelte'
  import KanjiGraph from '$lib/components/KanjiGraph/KanjiGraph.svelte'
  import Dropdown from '$lib/components/Dropdown/index.svelte'
  import GradeLegend from '$lib/components/GradeLegend/index.svelte'
  import dataGraph from "./data/graph_all.json"
  import dataKanjiLevels from "./data/kanji_levels.json"

  const categories = _.uniqBy(dataGraph.nodes, d => d.category).map(d => d.category).filter(d => d !== 0)
</script>

<div class='wrapper'>
  <Header />
  <Dropdown {categories} />
  <GradeLegend />
  <KanjiGraph {dataGraph} {dataKanjiLevels} {categories} />
</div>

<style lang='scss'>
  @import './styles/global.scss';
  .wrapper {
    max-width: 1800px;
    margin: auto;
  }
</style>