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