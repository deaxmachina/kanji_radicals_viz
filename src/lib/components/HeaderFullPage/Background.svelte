<script>
  import '$lib/styles/colors.scss'
  import { onMount } from 'svelte'
  import _ from 'lodash'
  import Rect from './Rect'

  const colLevels = ['#8dcaab', '#9fcfc0', '#bdb7cc', '#cfa1cb', '#ce8cbd', '#c170ab', '#a15da2']

  let canvasEl
  let wrapperEl
  let mouse = {
    x: undefined, 
    y: undefined
  }

  const drawOnMountAndResize = () => {
    // Select the container with simple DOM selection 
    const container = wrapperEl
    const { width, height } = container.getBoundingClientRect()
    const ctx = canvasEl.getContext('2d');
    // Set dimensions
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    let scale = 1;
    if (window) {
        scale = window.devicePixelRatio;
        ctx.canvas.style.width = `${width}px`;
        ctx.canvas.style.height = `${height}px`;
        ctx.canvas.width = width * scale;
        ctx.canvas.height = height * scale;
        ctx.scale(scale, scale);
    }

    // The num rects depends on screen real estate 
    const numRects = Math.floor(width*1.5)

    // Create the rects
    const rects = []
    for (let i = 0; i <= numRects; i ++) {
      const radius = Math.max(5, Math.random()*30)
      const x = Math.random() * (width - radius * 2) + radius
      const y = Math.random() * (height - radius * 2) + radius
      const dx = (Math.random() - 0.5) * 1
      const dy = (Math.random() - 0.5) * 1
      const colour = colLevels[Math.floor(Math.random() * colLevels.length)]
      const rect = new Rect(x, y, dx, dy, radius, colour, width, height, ctx, mouse)
      rects.push(rect)
    }

    // Animate
    let frame = requestAnimationFrame(loop);
    function loop(t) {
      frame = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, width, height)
      for (const rect of rects){
        rect.draw()
        rect.update()
      } 
    }

  }

const resize = () => {
  drawOnMountAndResize()
}

// On reize, re-drew the whole thing with new dimensions 
// On mousemove, don't call the whole drawOnMountAndResize function 
// just update the mouse position and it will get passed onto the rects
onMount(() => {
  drawOnMountAndResize()
  if (window) {
    window.addEventListener('resize', resize);
    wrapperEl.addEventListener('mousemove', e => {
      mouse.x = e.clientX,
      mouse.y = e.clientY
    })
  }
  return () => {
    window.removeEventListener('resize', resize);
	};
})

</script>

<div bind:this={wrapperEl} class='background-wrapper'>
  <canvas bind:this={canvasEl} ></canvas>
</div>

<style lang='scss'>
  @import '../../../lib/styles/global.scss';
  .background-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: transparent;
  }

  canvas {
    // width: 100%;
    // height: 100%;
    cursor: crosshair;
    //pointer-events: none;
  }
</style>