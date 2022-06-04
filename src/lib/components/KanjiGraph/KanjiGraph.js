import * as d3 from 'd3';
import { appendSelect } from 'd3-appendselect';
import _ from 'lodash';
d3.selection.prototype.appendSelect = appendSelect;

class KanjiGraph {
  selection(selector) {
    if (!selector) return this._selection;
    this._selection = d3.select(selector);
    return this;
  }

  data(newData) {
    if (!newData) return this._data || this.defaultData;
    this._data = newData;
    return this;
  }

  props(newProps) {
    if (!newProps) return this._props || this.defaultProps;
    this._props = _.merge(this._props || this.defaultProps, newProps);
    return this;
  }

  defaultData = [];
  defaultProps = {
    colours: {
      colourMissingKanji: '#111111',
      colourRadicals: '#f7ede2', //'#5e6472'
      colBg: '#352d39',
      colLevels: ['#cce3de', '#a4c3b2', '#6b9080', '#d1b3c4', '#b392ac', '#735d78', '#fe6d73'],
      colLinks: "#b1a7a6"
    },
  }
	
	draw() {
    const { dataGraphFiltered, nodes, links, nodesCopy, linksCopy, subcategories, dataKanjiLevels } = this.data();
    const { width, height, margin, boundedWidth, boundedHeight, colours, graphProps } = this.props();
    console.log('nodes, links,', nodes, links)


    ////////////////////////////////
    ////////// Container ///////////
    ////////////////////////////////
		const svg = this.selection()
      .appendSelect('svg')
      .attr('width', width)
      .attr('height', height)
      .classed('kanji-graph-svg', true)
      .style('background-color', colours.colBg)

    const g = svg.appendSelect('g')
      .classed('group', true)
      .attr('transform', `translate(${width*0.5}, ${height*0.1})`)

    ////////////////////////////////
    /////////// Scales /////////////
    ////////////////////////////////
    // For radial positioning 
    const subcategoryRadialScale = d3.scaleBand()
      .domain(subcategories)
      .range([Math.PI*3/2, Math.PI*0.5])

    // Colour scales for kanji by level (grade)
    const colourByGradeScale = d3.scaleOrdinal()
      .domain(['1', '2', '3', '4', '5', '6', 'S'])
      .range(colours.colLevels)


    /////////////////////////////////////////////////
    ///////////// Simulation Definition /////////////
    /////////////////////////////////////////////////
    const scaleFactorDeg = 0.06 // Scale factor for the degree of the nodes of the radicals
    const scaleFunction = d => d.type === 'radical' ? 1 + linksCopy.filter(l => l.source === d.id).length * scaleFactorDeg : 1
    const scaleFunctionNodes = d => `scale(${scaleFunction(d)})`
    //const radiusCollide = d => graphProps.widthKanjiBox * 0.6 * scaleFunction(d) // Needs a fix 
    const radiusCollide = d => d.type === 'radical' 
      ? graphProps.widthKanjiBox*0.3 + graphProps.widthKanjiBox * (linksCopy.filter(l => l.source === d.id).length * scaleFactorDeg) 
      : graphProps.widthKanjiBox*0.65

    // Forces 
    const linkForce = d3.forceLink(links).id(d => d.id)
    const collideForce = d3.forceCollide().radius(radiusCollide).iterations(2).strength(1)
    const radialForce = d3.forceRadial(0).strength(0.4)

    const xForceRadial = d3.forceX(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? d3.pointRadial(subcategoryRadialScale(d.subcategory), graphProps.radiusGroups)[0]
      : 0
    ).strength(1)
    const yForceRadial = d3.forceY(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? d3.pointRadial(subcategoryRadialScale(d.subcategory), graphProps.radiusGroups)[1]
      : 0
    ).strength(1)

    // Simulation with forces 
    const simulation = d3.forceSimulation(nodes)
      .force('link', linkForce)
      .force('collide', collideForce)
      .force('x', xForceRadial)
      .force('y', yForceRadial)


    ////////////////////////////////
    /////////// Links //////////////
    ////////////////////////////////
    const link = g.appendSelect("g")
      .attr('class', 'g-links')
      .style("stroke", colours.colLinks)
      .style("stroke-opacity", 0.2)
      .style("stroke-width", 0.3)
      .selectAll(".link")
        .data(links)
        .join("line")
        .classed('link', true)

    ////////////////////////////////
    /////////// Nodes //////////////
    ////////////////////////////////
    const nodeG = g.appendSelect("g")
      .attr('class', 'g-nodes')
      .style("stroke", "#fff")

    // One group for each node to include node box and kanji 
    const nodesG = nodeG
    .selectAll('.node-g')
    .data(nodes)
    .join('g')
      .classed('node-g', true)
      .style('cursor', 'pointer')

    const nodeBox = nodesG.selectAll('.node-box')
      .data(d => [d])
      .join('rect')
        .classed('node-box', true)
        .attr('x', -graphProps.widthKanjiBox/2)
        .attr('y', -graphProps.widthKanjiBox/2)
        .attr('width', graphProps.widthKanjiBox)
        .attr('height', graphProps.widthKanjiBox)
        .attr('transform', d => scaleFunctionNodes(d))
        .style('stroke', '#fff')
        .style('stroke-width', 1)
        .style("stroke-opacity", 1)
        .style("fill", d => d.type === 'kanji' 
              ? _.find(dataKanjiLevels, e => e.kanji === d.kanji)
                ? colourByGradeScale( _.find(dataKanjiLevels, e => e.kanji === d.kanji).Grade )
                : colours.colourMissingKanji
              : colours.colourRadicals
              )

    const nodeText = nodesG.selectAll(".node-text")
      .data(d => [d])
      .join("text")
        .classed('node-text', true)
        .text(d => d.kanji)
        .classed('kanji-text', true)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', `${graphProps.widthKanjiBox*3/4}px`)
        //.style('font-weight', 'lighter')
        .style('stroke', 'none')
        .style('fill', d => d.type === 'radical' ? colours.colBg : 'white')
        .attr('transform',  d => scaleFunctionNodes(d))

    ////////////////////////////////
    /////// Simulation Start ///////
    ////////////////////////////////
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      nodesG
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        //.attr("stroke", d => (d.fx ? "#333" : "#fff"));
    });
  
    //invalidation.then(() => simulation.stop());

			
		return this;
	}
	
}

export default KanjiGraph
