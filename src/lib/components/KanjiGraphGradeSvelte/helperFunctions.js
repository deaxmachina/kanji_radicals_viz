import _ from 'lodash'

// Filter the data passed into the graph to just secondary school
const getDataFilteredS = (data) => {
  const selectedGrade = 'S'
  const dataFiltered = {}
  // Filter just the nodes for the selected category
  const kanjiFiltered = data.nodes.filter(n => n.type === 'kanji' && n.Grade === selectedGrade)
  // Find all the radicals that appear in these kanji 
  const radicalsForKanji = _.uniq(_.flatten(kanjiFiltered.map(n => n.radicals)))
  // Get all the kanji and radicals we want to leave 
  const nodesFiltered = data.nodes.filter(n => 
    (n.type === 'kanji' && n.Grade === selectedGrade) ||
    (n.type === 'radical' && radicalsForKanji.includes(n.id.split('-')[0]))
  )
  // Get just the kanji left over so that we can find the links for them
  const kanjiLeftOver = _.uniqBy(kanjiFiltered, n => n.id).map(d => d.id)
  const linksFiltered = data.links.filter(l => kanjiLeftOver.includes(l.target))
  dataFiltered.nodes = nodesFiltered
  dataFiltered.links = linksFiltered
  return dataFiltered
}


// Filter the data passed into the graph to just the primary school grades 
const getDataFilteredP = (data) => {
  const selectedGrades = ['1', '2', '3', '4', '5', '6']
  const dataFiltered = {}
  // Filter just the nodes for the selected category
  const kanjiFiltered = data.nodes.filter(n =>  n.type === 'kanji' && selectedGrades.includes(n.Grade))
  // Find all the radicals that appear in these kanji 
  const radicalsForKanji = _.uniq(_.flatten(kanjiFiltered.map(n => n.radicals)))
  // Get all the kanji and radicals we want to leave 
  const nodesFiltered = data.nodes.filter(n => 
        (n.type === 'kanji' && selectedGrades.includes(n.Grade)) || 
        (n.type === 'radical' && radicalsForKanji.includes(n.id.split('-')[0]))
    )
  // Get just the kanji left over so that we can find the links for them
  const kanjiLeftOver = _.uniqBy(kanjiFiltered, n => n.id).map(d => d.id)
  const linksFiltered = data.links.filter(l => kanjiLeftOver.includes(l.target))
  dataFiltered.nodes = nodesFiltered
  dataFiltered.links = linksFiltered
  return dataFiltered
}

export { getDataFilteredS, getDataFilteredP }