import { ctx, uranium } from "../../main.js"
import { abbreviate, darkenRGB } from "../functions.js";

export class PointText {
    constructor(x, y, width, height, type, points) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.points = points;
        this.type = type;
        this.color = ""
    }
    draw() {
        ctx.beginPath()
        if (this.type == "Uranium") {
            this.color = "rgb(0, 255, 0)"
        }
        ctx.lineWidth = 5
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.roundRect(this.x-2, this.y-this.height/2, this.width, this.height)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.textAlign = "center"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "15px Arial"
        ctx.strokeText(this.type, this.x+this.width/2, this.y-this.height/2+20)
        ctx.fillText(this.type, this.x+this.width/2, this.y-this.height/2+20)
        ctx.font = "20px Arial"
        ctx.strokeText(abbreviate(this.points), this.x+this.width/2, this.y-this.height/2+50)
        ctx.fillText(abbreviate(this.points), this.x+this.width/2, this.y-this.height/2+50)
        ctx.closePath()
    }
}