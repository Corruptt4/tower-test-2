import { canvas, ctx, frictionFactor, world } from "../../main.js";
import { darkenRGB, degreesToRads, drawPolygon, getDist, minMax, radsToDegrees, getAngle } from "../functions.js";
import { Bullet } from "./bullet.js";

export class Drone {
    constructor(x, y, size, host) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.host = host;
        this.type = "drone"
        this.angle = 0; // in degrees
        this.speed = 0.2;
        this.t = 0
        this.maxHealth = 1500
        this.health = 1500
        this.bodyDamage = 10
        this.turret = {
            POSITION: [0, 0],
            SIZE: 6,
            STATS: [ 80, 12 ],
            ANGLE: 0,
            COLOR: "rgb(110, 110, 110)",
            GUN_COL: "rgb(100, 100, 100)",
            WIDTH: 6,
            HEIGHT: 12,
            CAN_SHOOT: false,
            BULLET_COL: "rgb(120, 120, 120)",
            MAX_RELOAD: 70,
            RELOAD: 0
        }
        this.targets = []
        this.target = null;
        this.returning = false
        this.vel = {
            x: 2 * Math.cos(Math.PI * 2 * Math.random()),
            y: 2 * Math.sin(Math.PI * 2 * Math.random())
        }
        this.color = darkenRGB(host.color, 25);
    }
    update() {
        let targets = []
        this.targets.forEach((target) => {
            let dist = getDist(this, target)
            targets.push([target, dist])
        })
        targets.sort((a, b) => a[1]-b[1])
        if (targets.length > 0) {
            this.target = targets[0][0]
        }
        if (targets.length == 0) {
            this.target = null
        }
        if (this.target) {
            this.turret.CAN_SHOOT = true
            let dx = this.x-this.target.x
            let dy = this.y-this.target.y
            this.turret.ANGLE = radsToDegrees(getAngle(dx, dy))
        }
        if (!this.target) {
            this.turret.CAN_SHOOT = false
            this.turret.ANGLE = this.angle
        }
        if (this.turret.ANGLE > 360) {
            this.turret.ANGLE = 0
        }
        if (this.turret.RELOAD < this.turret.MAX_RELOAD) {
            this.turret.RELOAD++
        }
        if (this.turret.CAN_SHOOT && this.turret.RELOAD >= this.turret.MAX_RELOAD) {
            this.turret.RELOAD = 0
            let velocity = {
                x: -this.turret.STATS[1] * Math.cos(degreesToRads(this.turret.ANGLE)),
                y: -this.turret.STATS[1] * Math.sin(degreesToRads(this.turret.ANGLE))
            }
            let bullet = new Bullet(
                this.x+this.turret.POSITION[0], 
                this.y+this.turret.POSITION[1],
                this.turret.WIDTH/2*(this.size/10),
                velocity,
                this.turret.STATS[0],
                this.turret.BULLET_COL
            )
            world.BULLETS.push(bullet)
        }

        this.t += 0.02
        let dist = getDist(this, this.host)
        let orbitSize = 190
        let actualPos = {
            x: this.host.x + orbitSize * Math.cos(this.t),
            y: this.host.y + orbitSize * Math.sin(this.t)
        }
        let dx = this.x - actualPos.x
        let dy = this.y - actualPos.y
        this.angle = radsToDegrees(getAngle(dx, dy))
        this.vel.x += -this.speed * Math.cos(degreesToRads(this.angle))
        this.vel.y += -this.speed * Math.sin(degreesToRads(this.angle))

        this.x += this.vel.x
        this.y += this.vel.y

        this.vel.x *= frictionFactor
        this.vel.y *= frictionFactor
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(degreesToRads(this.angle))
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.lineJoin = "round"
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        drawPolygon(0, 0, this.size, 4, ctx)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()

        
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(Math.PI/2+degreesToRads(this.turret.ANGLE))
        ctx.beginPath()
        ctx.fillStyle = this.turret.GUN_COL
        ctx.strokeStyle = darkenRGB(this.turret.GUN_COL)
        ctx.lineWidth = 3
        ctx.roundRect((-this.turret.WIDTH*(this.size/10))/2, 0, this.turret.WIDTH*(this.size/10), this.turret.HEIGHT*(this.size/10))
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = this.turret.COLOR
        ctx.strokeStyle = darkenRGB(this.turret.COLOR)
        ctx.lineWidth = 3
        ctx.arc(0, 0, this.turret.SIZE * (this.size/10), 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.roundRect(-this.size, this.size+10, this.size*2, 5, 5)
        ctx.fill()
        ctx.closePath()
        
        ctx.beginPath()
        ctx.fillStyle = "rgb(0, 255, 0)"
        ctx.roundRect(-this.size, this.size+10, this.size*2*(this.health/this.maxHealth), 5, 5)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.roundRect(-this.size, this.size+10, this.size*2, 5, 5)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}