import { ctx, world } from "../../main.js"
import { darkenRGB, removeElement } from "../functions.js";

export class Bullet {
    constructor(x, y, size, vel, damage, color) {
        this.x = x;
        this.y = y;
        this.vel = vel,
        this.damage = damage;
        this.size = size;
        this.type = "bullet"
        this.lifeTime = 180;
        this.id = 0;
        this.color = color ?? "rgb(255, 0, 0)";
    }
    update() {
        this.lifeTime--
        if (this.lifeTime <= 0) {
            removeElement(this, world.BULLETS)
        }
        this.x += this.vel.x
        this.y += this.vel.y
    }
    draw() {
        ctx.beginPath()
        ctx.lineJoin = 3
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}

export class Shockwave {
    constructor(x, y, minSize, maxSize) {
        this.x = x;
        this.y = y;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.type = "bullet"
        this.sizeDifference = maxSize - minSize
        this.t = 0;
    }
    update() {
        if (this.t < 1) {
            this.t += 0.07
        }
        if (this.t >= 1) {
            world.BULLETS.splice(world.BULLETS.indexOf(this), 1)
        }
    }
    draw() {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${1-this.t})`
        ctx.lineWidth = (1-this.t) * 10
        ctx.arc(this.x, this.y, this.minSize + this.sizeDifference*this.t, 0, Math.PI * 2)
        ctx.stroke()
        ctx.closePath()
    }
}