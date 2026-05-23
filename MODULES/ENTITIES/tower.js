import {darkenRGB, degreesToRads, minMax} from "../functions.js"
import { ctx } from "../../main.js";

export class Tower {
    constructor(x, y, name, color, size, turrets) {
        this.x = x;
        this.y = y;
        this.name = name ?? "Placeholder"
        this.size = size;
        this.turrets = turrets
        this.color = color;
    }
    update() {
        this.turrets.forEach((tur) => {
            tur.ANGLE += 360*0.003
            if (tur.ANGLE > 360) {
                tur.ANGLE = 0
            }
            console.log(tur.ANGLE)
        })
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        this.turrets.forEach((tur) => {
            let turPos = [this.x+tur.POSITION[0], this.y+tur.POSITION[1]]
            ctx.save()
            ctx.translate(turPos[0], turPos[1])
            ctx.rotate(-Math.PI/2+degreesToRads(tur.ANGLE))

            // turret gun
            ctx.beginPath()
            ctx.fillStyle = tur.GUN_COL
            ctx.strokeStyle = darkenRGB(tur.GUN_COL, 20)
            ctx.lineJoin = "round"
            ctx.roundRect(0-(tur.WIDTH/2)*(tur.SIZE/10), 0, tur.WIDTH*(tur.SIZE/10), tur.HEIGHT*(tur.SIZE/10))
            ctx.fill()
            ctx.stroke()
            ctx.closePath()

            // turret body
            ctx.beginPath()
            ctx.fillStyle = tur.COLOR
            ctx.strokeStyle = darkenRGB(tur.COLOR, 20)
            ctx.arc(0, 0, tur.SIZE, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
            ctx.restore()

            
        })
    }
}