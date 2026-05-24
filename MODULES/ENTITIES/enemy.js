import { ctx } from "../../main.js";
import { darkenRGB } from "../functions.js";

export class Enemy {
    constructor(x, y, size, health, damage) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.health = health;
        this.damage = damage;
        this.color = "rgb(0, 160, 0)"
        this.ability = []
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.lineWidth = 3
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}