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
    const { nodes, links, nodesCopy, linksCopy, subcategories, dataKanjiLevels } = this.data();
    const { width, height, aspectRatioHorizontal, colours, graphProps, grades, mobile, selectedCategory, linkForceByCategory } = this.props();

    let simulation

    ////////////////////////////////
    ////////// Container ///////////
    ////////////////////////////////
		const svg = this.selection()
      .appendSelect('svg')
      .attr('width', width)
      .attr('height', aspectRatioHorizontal ? height*1.05 : height * mobile.verticalScaleFactor)
      .classed('kanji-graph-svg', true)
      .style('background-color', colours.colBg)

    const g = svg.appendSelect('g')
      .classed('group', true)
      .attr('transform', `translate(${ 
        width*0.5
      }, ${
        aspectRatioHorizontal ? height*0.17 : height*0.1
      })`)

    ////////////////////////////////
    /////////// Filters ////////////
    ////////////////////////////////
    const defs = svg.appendSelect("defs")
    defs.appendSelect("filter")
    .attr("id", "noise")
    .appendSelect("feTurbulence")
      .attr('type', 'fractalNoise')
      .attr('baseFrequency', '1.29')
      .attr('numOctaves', '2')
      .attr('result', 'noisy')
    .appendSelect("feColorMatrix")
      .attr('type', 'saturate')
      .attr('values', 0)
    .appendSelect("feBlend")
      .attr('in', 'SourceGraphic')
      .attr('in2', 'noisy')
      .attr('mode', 'multiply')

      // const bg = g.appendSelect('rect.bg-rect')
      // .attr('x', -width/2)
      // .attr('y', -height*0.1)
      // .attr('width', width)
      // .attr('height', height)
      // .style('fill', colours.colBg)
      // .style("filter", "url(#noise)")
      // .style('opacity', 0.3)


    ////////////////////////////////
    /////////// Scales /////////////
    ////////////////////////////////
    // Scale for desktop to position in a circle
    const subcategoryRadialScale = d3.scaleBand()
      .domain(subcategories)
      .range([Math.PI*1.5, Math.PI*0.45])
    // Scale for mobile to position vertically 
    const subcategoryVerticalScale = d3.scaleBand()
      .domain(subcategories)
      .range([mobile.yOffsetForKanjiStart, height * mobile.verticalScaleFactor])
    // Colour scale for kanji by level (grade)
    const colourByGradeScale = d3.scaleOrdinal()
      .domain(grades)
      .range(colours.colLevels)

    /////////////////////////////////////////////////
    ///////////// Simulation Definition /////////////
    /////////////////////////////////////////////////
    const scaleFunction = d => d.type === 'radical' ? 1 + linksCopy.filter(l => l.source === d.id).length * graphProps.scaleFactorDeg : 1
    const scaleFunctionNodes = d => `scale(${scaleFunction(d)})`
    //const radiusCollide = d => graphProps.widthKanjiBox * 0.6 * scaleFunction(d)
    const radiusCollide = d => d.type === 'radical' 
      ? graphProps.widthKanjiBox*0.45 + graphProps.widthKanjiBox * 0.9 * (linksCopy.filter(l => l.source === d.id).length * graphProps.scaleFactorDeg) 
      : graphProps.widthKanjiBox*0.66

    // Forces 
    const linkForce = d3.forceLink(links).id(d => d.id).strength(linkForceByCategory[selectedCategory])
    const collideForce = d3.forceCollide().radius(radiusCollide).iterations(2).strength(1)
    // Radically position around a circle
    const xForceRadial = d3.forceX(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? d3.pointRadial(subcategoryRadialScale(d.subcategory), graphProps.radiusGroups)[0]
      : 0
    ).strength(1.4)
    const yForceRadial = d3.forceY(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? d3.pointRadial(subcategoryRadialScale(d.subcategory), graphProps.radiusGroups)[1]
      : 0
    ).strength(1.4)
    // Vertically position 
    const yForce = d3.forceY(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? subcategoryVerticalScale(d.subcategory)
      : 40
    ).strength(5)
    const xForce = d3.forceX(d => 0).strength(2)

    // Simulation with forces 
    if (aspectRatioHorizontal) {
      simulation = d3.forceSimulation(nodes)
        .force('link', linkForce)
        .force('collide', collideForce)
        .force('xForceRadial', xForceRadial)
        .force('yForceRadial', yForceRadial)
        simulation.force("xForce", null)
        simulation.force("yForce", null)
    } else {
      simulation = d3.forceSimulation(nodes)
        .force('link', linkForce)
        .force('collide', collideForce)
        .force('xForce', xForce)
        .force('yForce', yForce)
        simulation.force("xForceRadial", null)
        simulation.force("yForceRadial", null)
    }

    // First run the simulation to compute the final layout and then use the computed layout properties to 
    // pass into the logic for drawing the graph below
    const NUM_ITERATIONS = 400;
    for (let i = 0; i < NUM_ITERATIONS; ++i) {
      simulation.tick();
    };
    simulation.stop();


    ////////////////////////////////
    /////////// Links //////////////
    ////////////////////////////////
    const linkG = g.appendSelect("g.g-links")
      .attr('class', 'g-links')
      .style("stroke", colours.colLinks)
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.4)
      
    const linksLine = linkG.selectAll(".link")
        .data(links)
        .join("line")
        .classed('link', true)
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

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

    const nodeBox = nodesG.selectAll('.node-box')
      .data(d => [d])
      .join('rect')
        .classed('node-box', true)
        .attr('x', -graphProps.widthKanjiBox/2)
        .attr('y', -graphProps.widthKanjiBox/2)
        .attr('width', graphProps.widthKanjiBox)
        .attr('height', graphProps.widthKanjiBox)
        .attr('transform', d => scaleFunctionNodes(d))
        .style('stroke', d => d.type === 'kanji' 
          //? colours.colStrokeKanji 
            ? _.find(dataKanjiLevels, e => e.kanji === d.kanji)
            ? colourByGradeScale( _.find(dataKanjiLevels, e => e.kanji === d.kanji).Grade )
            : colours.colMissingKanji
          : colours.colStrokeRadicals
        )
        .style('stroke-width', d => d.type === 'kanji' ? 4 : 2)
        .style("stroke-opacity", d => d.type === 'kanji' ? 0.9 : 1)
        .style("fill", d => d.type === 'kanji' 
              ? _.find(dataKanjiLevels, e => e.kanji === d.kanji)
                ? colourByGradeScale( _.find(dataKanjiLevels, e => e.kanji === d.kanji).Grade )
                : colours.colMissingKanji
              : colours.colRadicals
              )
        .style('rx', d => d.type === 'kanji' ? 0 : 10)

    const nodeText = nodesG.selectAll(".node-text")
      .data(d => [d])
      .join("text")
        .classed('node-text', true)
        .classed('kanji-text', d => d.type === 'kanji')
        .classed('radical-text', d => d.type === 'radical')
        .text(d => d.kanji)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', `${graphProps.widthKanjiBox * 0.75}px`)
        //.style('font-weight', 'lighter')
        .style('stroke', 'none')
        .style('fill', d => d.type === 'radical' ? colours.colRadicalsText : colours.colKanjiText)
        .attr('transform',  d => scaleFunctionNodes(d))

    ///////////////////////////////////////
    //////// Subcategories Nodes //////////
    ///////////////////////////////////////
    const subcategoriesNodesG = g.appendSelect("g.subcategories-nodes-g")
      .attr('class', 'subcategories-nodes-g')
    const subcategoriesNodeG = subcategoriesNodesG.selectAll('.subcategory-node-g')
      .data(subcategories)
      .join('g')
      .classed('subcategory-node-g', true)
      .attr('transform', d => 
        aspectRatioHorizontal 
          ? `translate(${
            d3.pointRadial(subcategoryRadialScale(d), graphProps.radiusGroups/2)[0]
          }, ${
            d3.pointRadial(subcategoryRadialScale(d), graphProps.radiusGroups/2)[1]
          })`
          : `translate(${150}, ${subcategoryVerticalScale(d) - subcategoryVerticalScale.bandwidth()/2})`
        )
      .style('cursor', 'pointer')

    const subcategoriesNodesBox = subcategoriesNodeG.appendSelect('circle.subcategories-nodes-box')
      .attr('r', 14)
      .style('fill', colours.colSubcategoriesNodes)
      .style('stroke-dasharray', '2 2')
      .style('stroke', colours.colText)

    const subcategoriesNodesLabel = subcategoriesNodeG.appendSelect('text.subcategories-nodes-label')
      .text((d, i) => subcategories.length - i)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')

        


		return this;
	}
	
}

export default KanjiGraph
