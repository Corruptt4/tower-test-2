import {darkenRGB, degreesToRads, getAngle, getDist, minMax, randomElement} from "../functions.js"
import { ctx, world } from "../../main.js";
import { Bullet } from "./bullet.js";

export class Tower {
    constructor(x, y, name, color, size, turrets) {
        this.x = x;
        this.y = y;
        this.name = name ?? "Placeholder"
        this.size = size;
        this.health = 1500
        this.turrets = turrets
        this.type = "tower"
        this.bulletID = 0;
        this.color = color;
        this.target = null
        this.canshoot = false
        this.targets = []
        this.availableTargets = []
        this.turrets.forEach((tur) => {
            tur.TARGET = null
            tur.TARGETS = []
            tur.AVAILABLE_TARGETS = []
        })
    }
    update() {
        this.targets = world.ENEMIES
        this.turrets.forEach((tur) => {
            tur.TARGETS = this.targets
            tur.AVAILABLE_TARGETS = tur.TARGETS.filter((a) => Math.sqrt(getDist(a, this)) < 700)
            if (tur.TARGET == null) {
                tur.TARGET = tur.AVAILABLE_TARGETS[randomElement(tur.AVAILABLE_TARGETS)]
            }
            if (tur.TARGET != null) {
                if (tur.TARGET.health <= 0) {
                    tur.TARGET = null
                }
            }
            if (!tur.TARGET) {
                tur.CAN_SHOOT = false
            }
            if (tur.AVAILABLE_TARGETS.length <= 0) {
                tur.TARGET = null
            }
            if (tur.TARGET) {
                tur.CAN_SHOOT = true
            }
        })
        this.turrets.forEach((tur) => {
            if (!tur.TARGET) tur.ANGLE += 360*0.003
            if (tur.TARGET) {
                let dx = tur.TARGET.x - (this.x+tur.POSITION[0])
                let dy = tur.TARGET.y - (this.y+tur.POSITION[1])
                let ang = getAngle(dx, dy)
                tur.ANGLE = ang * (180/Math.PI)
            }
            if (tur.ANGLE > 360) {
                tur.ANGLE = 0
            }

            tur.RELOAD--
            if (tur.RELOAD <= 0 && tur.CAN_SHOOT) {
                tur.RELOAD = tur.MAX_RELOAD
                let velocity = {
                    x: tur.STATS[1] * Math.cos(degreesToRads(tur.ANGLE)),
                    y: tur.STATS[1] * Math.sin(degreesToRads(tur.ANGLE))
                }
                let bullet = new Bullet(this.x+tur.POSITION[0], this.y+tur.POSITION[1], tur.WIDTH/2*(tur.SIZE/10), velocity, tur.STATS[0], tur.BULLET_COL)
                world.BULLETS.push(bullet)
            }
        })
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
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
            ctx.strokeStyle = darkenRGB(tur.GUN_COL)
            ctx.lineJoin = "round"
            ctx.roundRect(0-(tur.WIDTH/2)*(tur.SIZE/10), 0, tur.WIDTH*(tur.SIZE/10), tur.HEIGHT*(tur.SIZE/10))
            ctx.fill()
            ctx.stroke()
            ctx.closePath()

            // turret body
            ctx.beginPath()
            ctx.fillStyle = tur.COLOR
            ctx.strokeStyle = darkenRGB(tur.COLOR)
            ctx.arc(0, 0, tur.SIZE, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
            
        })
    }
}