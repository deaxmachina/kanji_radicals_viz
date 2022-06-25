import * as d3 from 'd3';
import { appendSelect } from 'd3-appendselect';
import _ from 'lodash';
import { selectedKanji } from '$lib/stores.js'
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
    const { width, height, aspectRatioHorizontal, colours, graphProps, grades, mobile, selectedCategory, linkForceByCategory, mobileCondition } = this.props();

    let simulation

    ////////////////////////////////
    ////////// Container ///////////
    ////////////////////////////////
		const svg = this.selection()
      .appendSelect('svg')
      .attr('width', width)
      .attr('height', aspectRatioHorizontal ? height*1 : height * mobile.verticalScaleFactor)
      .classed('kanji-graph-svg', true)
      .style('background-color', colours.colBg)

    const g = svg.appendSelect('g')
      .classed('group', true)
      .attr('transform', `translate(${ 
        width*0.5
      }, ${
        aspectRatioHorizontal ? height*0.1 : height*0.1
      })`)

    ////////////////////////////////
    /////////// Filters ////////////
    ////////////////////////////////
    const defs = svg.appendSelect("defs")
    const noiseFilter = defs.append("filter")
    .attr("id", "noise")
    .appendSelect("feTurbulence")
      .attr('type', 'fractalNoise')
      .attr('baseFrequency', '1.2')
      .attr('numOctaves', '2')
      .attr('result', 'noisy')
    .appendSelect("feColorMatrix")
      .attr('type', 'saturate')
      .attr('values', 0)
    .appendSelect("feBlend")
      .attr('in', 'SourceGraphic')
      .attr('in2', 'noisy')
      .attr('mode', 'multiply')

    const blurFilter = defs.append("filter")
      .attr("id", "blur")
      .append("feGaussianBlur")
      .attr("stdDeviation", 10);


    ////////////////////////////////
    /////////// Scales /////////////
    ////////////////////////////////
    // Scale for desktop to position in a circle
    const subcategoryRadialScale = d3.scaleBand()
      .domain(subcategories)
      .range([Math.PI*1.5, Math.PI*0.5])
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
      : graphProps.widthKanjiBox*0.7

    // Forces 
    const linkForce = d3.forceLink(links).id(d => d.id).strength(linkForceByCategory[selectedCategory])
    const collideForce = d3.forceCollide().radius(radiusCollide).iterations(2).strength(1)
    // Radically position around a circle
    const xForceRadial = d3.forceX(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? d3.pointRadial(subcategoryRadialScale(d.subcategory), graphProps.radiusGroups)[0]
      : 0
    ).strength(1.9)
    const yForceRadial = d3.forceY(d => (d.type === 'kanji' && d.subcategory !== 0)
      ? d3.pointRadial(subcategoryRadialScale(d.subcategory), graphProps.radiusGroups)[1]
      : 0
    ).strength(1.8)
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
      
    const linksLine = linkG.selectAll(".link")
        .data(links)
        .join("line")
        .classed('link', true)
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .style("stroke-opacity", 0.3)
        .style("stroke-width", 0.4)

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
      .text((d, i) => i + 1)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')

    ///////////////////////////////////////
    //////// Subcategories List ///////////
    ///////////////////////////////////////
    //const mobileCondition = width <= 800

    const subcategoriesListG = svg.appendSelect("g.subcategories-list-g")
      .attr('class', 'subcategories-list-g')
      .attr('transform', (d, i) => `translate(${50}, ${0})`)

    // Background 
    const drawSubcategoriesBg = () => {
      const subcategoriesListBg = subcategoriesListG.appendSelect("rect.subcategories-list-bg")
        .attr('y', 30)
        .attr('x', mobileCondition ? -100 : -30)
        .attr('width',mobileCondition ? width + 100 : 380)
        .attr('height', (subcategories.length + 1)*35 + 20)
        .style('fill', colours.colBg)
        .style('opacity', d => mobileCondition ? 1 : 0.8) // on small screens, opaque by defaul
        .style('rx', 10)
        .style("filter", "url(#blur)")
    }

    // Draw the subcateogires list 
    const drawSubcategoriesList = (radicalData) => {
      const subcategoriesEntryG = subcategoriesListG.selectAll('.subcategory-entry-g')
        .data(subcategories)
        .join('g')
        .classed('subcategory-entry-g', true)
        .style('opacity', 0)
        .attr('transform', (d, i) => `translate(${0}, ${i*35 + 60})`)

      const subcategoriesEntriesBox = subcategoriesEntryG.appendSelect('circle.subcategories-entries-box')
        .attr('r', 14)
        .style('fill', colours.colSubcategoriesNodes)
        .style('stroke-dasharray', '2 2')
        .style('stroke', colours.colText)

      const subcategoriesEntriesNum = subcategoriesEntryG.appendSelect('text.subcategories-entries-num')
        .text((d, i) => i + 1)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')

      const subcategoriesEntriesText = subcategoriesEntryG.appendSelect('text.subcategories-entries-text')
        .text((d, i) => d)
        .attr('dy', '0.35em')
        .attr('dx', '25px')
        .style('text-anchor', 'start')

      subcategoriesEntryG.transition().delay((d, i) => i * 100)
        .style('opacity', 1)
        .attr('transform', (d, i) => `translate(${0}, ${i*35 + 60})`)
    }

    // Label 'Subcategories'
    const subcategoriesLabel = subcategoriesListG.appendSelect('text.subcategories-label')
        .attr('dy', 20)
        .attr('dx', -10)
        .style('text-anchor', 'start')
        .text('Subcategories')
    let expanded = true // Whether to start with the menu expanded or not 
    if (mobileCondition) {
      expanded = false
    } 
    const pathMinusBtn = "M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"
    const pathPlusBtn = "M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
    const subcategoriesExpandBtn = subcategoriesListG.appendSelect('g.subcategories-expand-btn')
        .attr('transform', `translate(${130}, ${0})scale(0.05)`)
        .style('fill', colours.colAccent)
        .style('cursor', 'pointer')

      const subcategoriesExpandBtnBg = subcategoriesExpandBtn.appendSelect('rect.subcategories-expand-btn-bg')
        .attr('width', 600)
        .attr('height', 600)
        .style('opacity', 0.01)
        .style('cursor', 'pointer')
        .on('click', function(e, d){ 
          if (!expanded) {
            drawSubcategoriesBg()
            drawSubcategoriesList()
            subcategoriesExpandBtnSymbol.attr('d', pathMinusBtn)
          }
          if (expanded) {
            subcategoriesListG.selectAll('.subcategory-entry-g')
              .transition().delay((d, i) => (subcategories.length - i) * 70)
              .style('opacity', 0)
              .remove()
            subcategoriesExpandBtnSymbol.attr('d', pathPlusBtn)
            d3.selectAll("rect.subcategories-list-bg")
              .transition().duration(1000)
              .style('opacity', 0)
              .remove()
          }
          expanded = !expanded
      })

    const subcategoriesExpandBtnSymbol = subcategoriesExpandBtn.appendSelect('path.subcategories-expand-btn-symbol')
      .attr('d', () => !mobileCondition ? pathMinusBtn : pathPlusBtn)
      .style('pointer-events', 'none')

    if (expanded) {
      drawSubcategoriesBg()
      drawSubcategoriesList()
    }


    /////////////////////////////////////////////////
    //////////////////// Events /////////////////////
    /////////////////////////////////////////////////
    const getCountOfKanjiCatPerRadical = (selectedRadical) => {
      //const selectedRadical = '木'
      const kanjiForRadical = _.uniq(linksCopy.filter(l => l.source === `${selectedRadical}`).map(d => d.target))
      const kanjiData = nodesCopy.filter(n => kanjiForRadical.includes(n.id))
      const kanjiPerCategory = _.countBy(kanjiData, d => d.subcategory)
      // Transform to array so we can iterate over it later
      const kanjiPerCategoryArr = []
      for (const category in kanjiPerCategory) {
        kanjiPerCategoryArr.push({ 'category': category, 'count': kanjiPerCategory[category] })
      }
      return kanjiPerCategoryArr
    }
    nodesG
      .on('click', (e, d) => {
        // Send the kanji up along the store
        if (d.type === 'kanji') {
          const grade = _.find(dataKanjiLevels, e => e.kanji === d.kanji) ? _.find(dataKanjiLevels, e => e.kanji === d.kanji).Grade : 'none'
          const kanjiData = { 
            kanji: d.kanji, radicals: d.radicals, kun_readings: d.kun_readings, on_readings: d.on_readings, meanings: d.meanings, grade: grade
          }
          selectedKanji.set(kanjiData)
        }
      })
      .on("mouseenter", (e, d) => {
          // All the target nodes for selected node
          const targetNodesIds = linksCopy.filter(l => l.target === d.id).map(l => l.source)
          const sourceNodesIds = linksCopy.filter(l => l.source === d.id).map(l => l.target)
          const nodesToHighlightIds = [...targetNodesIds, ...sourceNodesIds]
          // Highlight the selected links
          linksLine
            .transition().duration(500)
            .style('stroke-opacity', l => l.source.id === d.id || l.target.id === d.id ? 1 : 0)
            .style("stroke-width", l => l.source.id === d.id || l.target.id === d.id ? 2 : 0.3)
          // Highlight the connected nodes
          nodesG
            .transition().duration(500)
            .style('opacity', n => n.id === d.id || nodesToHighlightIds.includes(n.id) ? 1 : 0.1)
          // Update the count of kanji per category for the hovered radical
          if (d.type === 'radical') {
            const radicalData = getCountOfKanjiCatPerRadical(d.id)
            const subcategoriesEntriesRadicals = subcategoriesListG
              .selectAll('.subcategory-entry-g')
                .appendSelect('text.subcategories-entries-radicals')
                .text((d, i) => radicalData.filter(el => el.category === d).length > 0 ? radicalData.filter(el => el.category === d)[0].count : '')
                .attr('dy', '0.35em')
                .attr('dx', '-20px')
                .style('text-anchor', 'end')
                .style('fill', colours.colAccent)
          }
      })
      .on("mouseleave", (evt, d) => {
        // Restore original graph
        linksLine
          .transition().duration(500)
          .style('stroke-opacity', 0.3)
          .style("stroke-width", 0.4)
        nodesG
          .transition().duration(500)
          .style('opacity', 1)
          // Remove any kanji per category text
          d3.selectAll('text.subcategories-entries-radicals').remove()
      })

      // Unselect kanji when click on svg outside the graph
      // svg.on("click", function(e, datum){
      //   if (this == e.target) {
      //     selectedKanji.set('')
      //   }
      // });

		return this;
	}
	
}

export default KanjiGraph
