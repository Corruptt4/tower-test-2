import { Enemy } from "../ENTITIES/enemy.js";
import { ctx, canvas } from "../../main.js";
import { darkenRGB } from "../functions.js";

export class NormalEnemy extends Enemy {
    constructor(x, y, size, health, damage) {
        super(x, y, size, health, damage)
        this.color = "rgb(0, 130, 0)"
        this.knockbackResistance = 0
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}
export class BigEnemy extends Enemy {
    constructor(x, y, size, health, damage) {
        super(x, y, size, health, damage)
        this.color = "rgb(0, 100, 0)"
        this.knockbackResistance = 0.4 // 40%
        this.extraRewardFactor = 1.85
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}

export class ArmoredEnemy extends Enemy {
    constructor(x, y, size, health, damage) {
        super(x, y, size, health, damage)
        this.color = "rgb(0, 130, 0)"
        this.armorColor = "rgb(140, 140, 140)"
        this.knockbackResistance = 0.3 // 30%
        this.extraRewardFactor = 1.5
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.armorColor
        ctx.strokeStyle = darkenRGB(this.armorColor)
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*1.5)
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y-this.size)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}
export class ExplosiveEnemy extends Enemy {
    constructor(x, y, size, health, damage) {
        super(x, y, size, health, damage)
        this.speed = 0.4
        this.color = "rgb(180, 180, 0)"
        this.knockbackResistance = 0
    }
    onDeath(world) {
        for (let i = 0, s = 6; i < s; i++) {
            let ang = ((Math.PI*2)/s)*i
            let enemy = new NormalEnemy(this.x, this.y, this.size, this.maxHealth/2, this.damage)
            enemy.vel.x = 8 * Math.cos(ang)
            enemy.vel.y = 8 * Math.sin(ang)
            enemy.towers = world.TOWERS
            enemy.reward = 0
            world.ENEMIES.push(enemy)
        }
    }
    draw() {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}
export let enemyStorage = [
    [new NormalEnemy(0, 0, 30, 100, 10), 1, 0],
    [new ArmoredEnemy(0, 0, 30, 200, 5), 0.2, 10],
    [new BigEnemy(0, 0, 45, 500, 5), 0.08, 20],
    [new ExplosiveEnemy(0, 0, 20, 80, 20), 0.1, 15]
]