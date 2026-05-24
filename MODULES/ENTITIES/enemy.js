import { ctx, frictionFactor } from "../../main.js";
import { darkenRGB, getAngle, getDist } from "../functions.js";

export class Enemy {
    constructor(x, y, size, health, damage) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.maxHealth = health;
        this.health = health;
        this.oldHealth = health;
        this.damage = damage;
        this.color = "rgb(0, 110, 0)";
        this.type = "enemy";
        this.isBoss = false;
        this.speed = 0.2;
        this.vel = {
            x: 0,
            y: 0
        }
        this.ability = [];
        this.towers = []
        this.targets = []
    }

    update() {
        this.target = null
        this.targets = []
        this.towers.forEach((tow) => {
            this.targets.push([tow, getDist(tow, this)])
        })
        this.targets.sort((a, b) => a[1]-b[1])
        let target = this.targets[0][0]
        let dx = target.x-this.x
        let dy = target.y-this.y
        let angle = Math.atan2(dy, dx)

        this.vel.x += this.speed * Math.cos(angle)
        this.vel.y += this.speed * Math.sin(angle)

        this.x += this.vel.x
        this.y += this.vel.y
        this.vel.x *= frictionFactor
        this.vel.y *= frictionFactor
    }

    draw() {
        this.oldHealth += (this.health - this.oldHealth)*0.03
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.lineWidth = 3
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        ctx.roundRect(this.x-this.size, this.y+this.size+15, this.size*2, 10, 10)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.lineWidth = 3
        ctx.roundRect(this.x-this.size, this.y+this.size+15, this.size*2, 10, 10)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "red"
        ctx.lineWidth = 3
        ctx.roundRect(this.x-this.size, this.y+this.size+15, this.size*2*(this.oldHealth/this.maxHealth), 10, 10)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = "green"
        ctx.lineWidth = 3
        ctx.roundRect(this.x-this.size, this.y+this.size+15, this.size*2*(this.health/this.maxHealth), 10, 10)
        ctx.fill()
        ctx.closePath()
    }
}