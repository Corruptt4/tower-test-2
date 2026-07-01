import { world, ctx, mapSize } from "../main.js";
import { Enemy } from "./ENTITIES/enemy.js";
import { randomElement } from "./functions.js";
import { enemyStorage } from "./STORAGE/enemies.js"

export class WaveHandler {
    constructor(startWave) {
        this.x = 100
        this.y = 130
        this.ringSize = 80
        this.wave = startWave
        this.waveMaxTimer = 60*15
        this.waveTimer = 0
        this.enemiesToSpawn = []
        this.spawnTickDelay = 1
        this.enemyTickSpawn = 0
    }
    startWave() {
        this.waveTimer = 0
        this.enemiesToSpawn = []
        // for (let i = 0; i < 10+3*(this.wave); i++) {
        //     let enemy = new Enemy(Math.random()*mapSize, Math.random()*mapSize, 30, 100*(1.5*(this.wave)), 10*(1.5*(this.wave)))
        //     enemy.towers = world.TOWERS
        //     enemy.reward = 10+(10*2*(this.wave-1))
        //     this.enemiesToSpawn.push(enemy)
        // }
        for (let i = 0; i < 10+3*(this.wave); i++) {
            let specificEnemy = enemyStorage[randomElement(enemyStorage)]
            let enemy = new enemyStorage[randomElement(enemyStorage)].constructor(
                Math.random()*mapSize, Math.random()*mapSize,
                specificEnemy.size,
                specificEnemy.health*(1.5*(this.wave)),
                specificEnemy.damage*(1.5*(this.wave))
            )
            enemy.towers = world.TOWERS
            enemy.reward = (10*enemy.extraRewardFactor)+(10*2*(this.wave-1))
            this.enemiesToSpawn.push(enemy)
        }

        this.enemyTickSpawn = this.enemiesToSpawn.length/2
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 15
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.ringSize, Math.PI/2, Math.PI/2 + Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.strokeStyle = "rgba(185, 185, 185)"
        ctx.lineWidth = 3
        ctx.arc(this.x, this.y, this.ringSize, Math.PI/2, Math.PI/2 + Math.PI * 2)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        ctx.lineWidth = 15
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.ringSize, Math.PI/2, Math.PI/2 + Math.PI * 2 * (this.waveTimer/this.waveMaxTimer))
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.strokeStyle = "rgb(185, 185, 185)"
        ctx.lineWidth = 15
        ctx.arc(this.x, this.y, this.ringSize, Math.PI/2, Math.PI/2 + Math.PI * 2 * (this.waveTimer/this.waveMaxTimer))
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.lineWidth = 8
        ctx.lineJoin = "round"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "35px Arial"
        ctx.textAlign = "center"
        ctx.strokeText(this.wave, this.x, this.y+35/3)
        ctx.fillText(this.wave, this.x, this.y+35/3)
        ctx.closePath()
        
        ctx.beginPath()
        ctx.lineWidth = 8
        ctx.lineJoin = "round"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "25px Arial"
        ctx.textAlign = "center"
        ctx.strokeText("Wave", this.x, this.y-this.ringSize-20)
        ctx.fillText("Wave", this.x, this.y-this.ringSize-20)
        ctx.closePath()
    }
    update() {
        if (this.waveMaxTimer > this.waveTimer && world.TOWERS.length > 0) {
            this.waveTimer++
        }
        if (this.waveTimer >= this.waveMaxTimer) {
            this.wave++
            this.startWave()
            world.ENEMIES.push(...this.enemiesToSpawn)
        }
    }
}