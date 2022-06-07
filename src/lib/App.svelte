<script>
  import _ from 'lodash'
  import '$lib/styles/global.scss';
  import KanjiGraph from '$lib/components/KanjiGraph/KanjiGraph.svelte'
  import Dropdown from '$lib/components/Dropdown/index.svelte'
  import dataGraph from "./data/graph_all.json"
  import dataKanjiLevels from "./data/kanji_levels.json"

  const categories = _.uniqBy(dataGraph.nodes, d => d.category).map(d => d.category).filter(d => d !== 0)
</script>

<Dropdown {categories} />
<KanjiGraph {dataGraph} {dataKanjiLevels} {categories} />

<style lang='scss'>
  @import './styles/global.scss';
</style>