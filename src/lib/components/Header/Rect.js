import hexRgb from 'hex-rgb';

class Rects {
  constructor(x, y, dx, dy, radius, colour, width, height, ctx, mouse) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.colour = colour;
    this.getColRgba()

    this.width = width
    this.height = height
    this.ctx = ctx
    this.mouse = mouse
    this.maxRadius = 30 // max radius a circle can grow to 
    this.minRadius = 2 // min radius the circle can shrink to
    this.radiusAroundMouse = 50 // how much around the mouse should the elements be affected
  }

  // Helper function to get colour 
  getColRgba() {
    const { red, green, blue } = hexRgb(this.colour)
    this.colourRgbaTransparent = `rgba(${red}, ${green}, ${blue}, 0)`
    this.colourRgbaOpaque = `rgba(${red}, ${green}, ${blue}, 0.9)`
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.rect(this.x, this.y, this.radius, this.radius)
    this.ctx.fillStyle = this.colourRgbaTransparent
    this.ctx.fill()
    // this.ctx.strokeStyle = this.colourRgbaTransparent
    // this.ctx.stroke()
  }

  update() {
    if (this.x + this.radius > this.width || this.x - this.radius < 0) {
      this.dx = -this.dx
    }
    if (this.y + this.radius > this.height || this.y - this.radius < 0) {
      this.dy = -this.dy
    }
    this.x += this.dx
    this.y += this.dy

    // Interactivity 
    if (
      this.mouse.x - this.x < this.radiusAroundMouse && 
      this.mouse.x - this.x > -this.radiusAroundMouse && 
      this.mouse.y - this.y < this.radiusAroundMouse && 
      this.mouse.y - this.y > -this.radiusAroundMouse
      ) {
      // if (this.radius < this.maxRadius) {
      //   this.radius += 1;
      // }
      this.ctx.fillStyle = this.colourRgbaOpaque
      this.ctx.fill()
      // this.ctx.strokeStyle = this.colourRgbaOpaque
      // this.ctx.stroke()
    } else if (this.radius > this.minRadius) {
      //this.radius -= 1; // decrease back in size when we move the mouse
      this.ctx.fillStyle = this.colourRgbaTransparent
      this.ctx.fill()
      // this.ctx.strokeStyle = this.colourRgbaTransparent
      // this.ctx.stroke()
    }

    // Draw the circle with the new params 
    this.draw()
  }
}

export default Rects;