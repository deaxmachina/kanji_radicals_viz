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
    mobile: {
      verticalScaleFactor: 1.8,
      yOffsetForKanjiStart: 450
    }
  }
	
	draw() {
    const { nodes, links, nodesCopy, linksCopy, } = this.data();
    const 
    {	width, height, mobileCondition, aspectRatioHorizontal, selectedLevel, graphProps, colours, grades} = this.props()
    //let simulation

    ////////////////////////////////
    ////////// Container ///////////
    ////////////////////////////////
		const svg = this.selection()
      .appendSelect('svg')
      .attr('width', width)
      .attr('height', width)
      .classed('kanji-graph-svg', true)
      .style('background-color', colours.colBg)

    const g = svg.appendSelect('g')
      .classed('group', true)
      .attr('transform', `translate(${ 
        width*0.5
      }, ${
        width*0.5
      })`)


    ////////////////////////////////
    //////////// Scales ////////////
    ////////////////////////////////
    // For radial positioning 
    const subcategoryRadialScale = d3.scaleBand()
      .domain(grades)
      .range([0, 2*Math.PI])

    // Colour scale for kanji by level (grade)
    const colourByGradeScale = d3.scaleOrdinal()
      .domain(grades)
      .range(colours.colLevels)

    // Find the max degree 
    const maxDegreeRadicalNode = _.chain(linksCopy)
    .countBy('source')
    .toArray()
    .max()
    .value();
    const radicalNodeSizeScale = d3.scaleSqrt()
      .domain([1, maxDegreeRadicalNode])
      .range([0.9, 2.8])

    /////////////////////////////////////////////////
    ///////////// Simulation Definition /////////////
    /////////////////////////////////////////////////
    const scaleFunction = d => d.type === 'radical' ? radicalNodeSizeScale(linksCopy.filter(l => l.source === d.id).length) : 1
    const scaleFunctionNodes = d => `scale(${scaleFunction(d)})`
    //const radiusCollide = d => graphProps.widthKanjiBox * 0.7 * scaleFunction(d)
    const radiusCollide = d => d.type === 'radical' 
        ? graphProps.widthKanjiBox * 0.62 * scaleFunction(d)
        : graphProps.widthKanjiBox*0.7
    const collideForce = d3.forceCollide().radius(radiusCollide).iterations(2).strength(1)
    const radialForceP = d3.forceRadial(d => d.type === 'kanji' ? graphProps.levelsRadial[d.Grade] : 0).strength(2.5)
    const radialForceS = d3.forceRadial(d => d.type === 'kanji' ? graphProps.radiusGroups : 0).strength(2)
    const radialForce = selectedLevel === 'Primary school' ? radialForceP : radialForceS
    const linkForce = d3.forceLink(links).id(d => d.id)//.strength(2)

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", linkForce)
      .force("collide", collideForce)
      .force("radial", radialForce)
      // .force("x", xForceRadial)
      // .force("y", yForceRadial)

    ////////////////////////////////
    /////////// Links //////////////
    ////////////////////////////////
    const linkG = g.appendSelect("g.g-links")
      .attr('class', 'g-links')
      .style("stroke", colours.colLinks)
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.4)
        .selectAll(".link")
        .data(links)
        .join("line")
        .classed('link', true)
        // .attr("x1", d => d.source.x)
        // .attr("y1", d => d.source.y)
        // .attr("x2", d => d.target.x)
        // .attr("y2", d => d.target.y)

    ////////////////////////////////
    /////////// Nodes //////////////
    ////////////////////////////////
    const nodeG = g.appendSelect("g.g-nodes")
      .attr('class', 'g-nodes')

    // One group for each node to include node box and kanji 
    const nodesG = nodeG
    .selectAll('.node-g')
    .data(nodes)
    .join('g')
      .classed('node-g', true)
      .style('cursor', 'pointer')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    const nodeBox = nodesG
      .selectAll('rect')
      .data(d => [d])
      .join('rect')
      .attr('x', -12)
      .attr('y', -12)
      .attr('width', 24)
      .attr('height', 24)
      .attr('transform', d => scaleFunctionNodes(d))
      .style('stroke-width', 1)
      .style("fill", d => d.type === 'kanji' ? colourByGradeScale(d.Grade) : colours.colRadicals)
      .style("stroke", d => d.type === 'kanji' ? colourByGradeScale(d.Grade) : colours.colStrokeRadicals)
      .style('stroke-width', d => d.type === 'kanji' ? 4 : 2)
      .style("stroke-opacity", d => d.type === 'kanji' ? 0.9 : 1)
      .style('rx', d => d.type === 'kanji' ? 0 : 10)

    const nodeText = nodesG.selectAll("text")
      .data(d => [d])
      .join("text")
        .classed('node-text', true)
        .classed('kanji-text', d => d.type === 'kanji')
        .classed('radical-text', d => d.type === 'radical')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', `${graphProps.widthKanjiBox * 0.75}px`)
        .style('stroke', 'none')
        .style('fill', d => d.type === 'radical' ? colours.colRadicalsText : colours.colKanjiText)
        .attr('transform',  d => scaleFunctionNodes(d))
        .text(d => d.id.split('-')[0])



    
    simulation.on("tick", () => {
      linkG
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
    
      nodesG
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
      });


    return this;
  }  
}
  
export default KanjiGraph