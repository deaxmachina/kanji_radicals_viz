import _ from 'lodash'
  
// Filter the data passed into the graph to just the selected category
const filterKanjiDataByCategory = (data, selectedCategory) => {
    const dataFiltered = {}
    // Filter just the nodes for the selected category
    const kanjiFiltered = data.nodes.filter(n => n.category === selectedCategory)
    // Find all the radicals that appear in these kanji 
    const radicalsForKanji = _.uniq(_.flatten(kanjiFiltered.map(n => n.radicals)))
    // Get all the kanji and radicals we want to leave 
    const nodesFiltered = data.nodes.filter(n => n.category === selectedCategory || (n.type === 'radical' && radicalsForKanji.includes(n.kanji)))
    // Get just the kanji left over so that we can find the links for them
    const kanjiLeftOver = _.uniqBy(kanjiFiltered, n => n.id).map(d => d.id)
    const linksFiltered = data.links.filter(l => kanjiLeftOver.includes(l.target))
    dataFiltered.nodes = nodesFiltered
    dataFiltered.links = linksFiltered
    return dataFiltered
}

export { filterKanjiDataByCategory }