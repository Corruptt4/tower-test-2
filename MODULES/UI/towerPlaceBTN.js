import { ctx, world } from "../../main.js"
import { darkenRGB } from "../functions.js";

export class TowerButton {
    constructor(x, y, size, tower, cost) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tower = tower;
        this.cost = cost;
        this.turretAngle = 0
        this.clonedTower = new this.tower.constructor(this.x, this.y, 15, this.tower.color, 20, this.tower.turrets)
    }
    update() {
        this.turretAngle += 1
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 10
        ctx.strokeStyle = darkenRGB("rgb(90, 90, 90)")
        ctx.roundRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size, 0)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "rgb(90, 90, 90)"
        ctx.roundRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size, 0)
        ctx.fill()
        ctx.closePath()
        ctx.clip()

        this.clonedTower.turrets.forEach((tur) => {
            tur.ANGLE = this.turretAngle
        })
        this.clonedTower.x = this.x
        this.clonedTower.y = this.y-this.size/3+15
        this.clonedTower.draw()

        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.strokeText(this.clonedTower.name, this.x, this.y+this.size/3)
        ctx.fillText(this.clonedTower.name, this.x, this.y+this.size/3)
        ctx.closePath()
        ctx.restore()
    }
}