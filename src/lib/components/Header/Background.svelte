<script>
  import '$lib/styles/colors.scss'
  import { onMount } from 'svelte'
  import * as d3 from 'd3'
  import _ from 'lodash'

  let w
  let h
  let canvasEl

  let scale = 2 
  //$: if (typeof window !== 'undefined') { scale = Math.max(2, window.devicePixelRatio) }
  let mouse = {
    x: undefined,
    y: undefined
  }
  const setMouse = (e) => {
    mouse = {
      x: e.clientX,
      y: e.clientY
    }
  }

  $: console.log('mouse', mouse)


  $: if (canvasEl) {
  //onMount(() => {
    if (typeof window !== 'undefined') scale = Math.max(2, window.devicePixelRatio) 
    const width = scale * w
    const height = scale * h
    canvasEl.width = width
    canvasEl.height = height
    const ctx = canvasEl.getContext('2d');

    const cellSize = 40 
    const numCols = Math.ceil(width / cellSize) 
    const numRows = Math.ceil(height / cellSize)

    // Create a strcutre of dims numCols x numRows with rects
    const xScale = d3.scaleBand()
      .domain(_.range(numCols))
      .range([0, width])

    const yScale = d3.scaleBand()
      .domain(_.range(numRows))
      .range([0, height])

    ////////////////////////////////////////////////
    //////////////// Drawing logic /////////////////
    ////////////////////////////////////////////////
    const opacityCondition = (x, y) => ((mouse.x - x) > 100) ? 1 : 0.1
    const computeCells = () => {
      const cells = []
      let count = 0
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const entry = {
              x: xScale(j),
              y: yScale(i),
              fill: '#ce8cbd',
              opacity: opacityCondition(xScale(j), yScale(i))
            }
            cells.push(entry)
        }
      }
      return cells
    }

    // Draw cells on the grid 
    const draw = () => {
      const cells = computeCells()
      const padding = 1
      for (const { x, y, fill, opacity } of cells) {
            ctx.beginPath()
            ctx.rect(x, y, cellSize - padding, cellSize - padding)
            ctx.fillStyle = fill 
            ctx.globalAlpha = opacity;
            ctx.fill()
        }
      }

    /// Animate
    function animate() {
      // clear the canvas 
      ctx.clearRect(0, 0, width, height)
      // this will start the animation 
      requestAnimationFrame(animate)
      // this is what we want to animate - the circles
    }

    draw()

  //})
  }

</script>

<div class='background-wrapper' bind:clientWidth={w} bind:clientHeight={h} on:mousemove={setMouse}>
  <canvas 
    bind:this={canvasEl} 
    id='canvas'   
    style='width:{w}px; height:{h}px'
  ></canvas>
</div>

<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  .background-wrapper {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 400px;
    //border: 5px solid blue;
    background-color: transparent;
    //z-index: 100;
  }

  canvas {
    z-index: 101;
		//background-color: #666;
  }
</style>