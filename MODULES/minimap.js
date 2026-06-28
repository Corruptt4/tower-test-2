import { canvas, ctx, mapSize, shownFPS } from "../main.js"

export class MiniMap {
    constructor(size) {
        this.x = canvas.width-size-10
        this.y = 10
        this.size = size
        this.downScale = size/mapSize
        this.entities = []
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        ctx.roundRect(this.x, this.y, this.size, this.size)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "20px Arial"
        ctx.textAlign = "right"
        ctx.strokeText("FPS: " + shownFPS, this.x+this.size, this.y+this.size+20)
        ctx.fillText("FPS: " + shownFPS, this.x+this.size, this.y+this.size+20)
        ctx.closePath()

        this.entities.filter((a) => a.type != "bullet").filter((a) => a.type !="drone").forEach((entity) => {
            ctx.beginPath()
            ctx.fillStyle = entity.color
            ctx.arc(this.x+entity.x*this.downScale, this.y+entity.y*this.downScale, 2, 0, Math.PI*2)
            ctx.fill()
            ctx.closePath()
        })
    }
}