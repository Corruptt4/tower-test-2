import { ctx, world } from "../../main.js"
import { abbreviate, darkenRGB } from "../functions.js";

export class TowerButton {
    constructor(x, y, size, tower, cost) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tower = tower;
        this.cost = cost;
        this.hovered = false;
        this.turretAngle = 0;
        this.tabWidth = 500
        this.tabHeight = 250
        this.clonedTower = new this.tower.constructor(this.x, this.y, 15, this.tower.color, 20, this.tower.turrets)
        this.clonedTower.showAura = false;
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

        if (this.hovered) {
            let tabX = this.x - this.tabWidth/2
            let tabY = this.y - this.tabHeight-this.size/2-20
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
            ctx.roundRect(tabX, tabY, this.tabWidth, this.tabHeight, this.tabHeight/20)
            ctx.fill()

            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.strokeStyle = "rgb(0, 0, 0)"
            ctx.font = "25px Arial"
            ctx.textAlign = "left"
            ctx.strokeText(this.clonedTower.name, tabX+10, tabY+30)
            ctx.fillText(this.clonedTower.name, tabX+10, tabY+30)
            ctx.font = "15px Arial"
            ctx.strokeText(this.clonedTower.description, tabX+10, tabY+30+30)
            ctx.fillText(this.clonedTower.description, tabX+10, tabY+30+30)
            ctx.font = "18px Arial"
            let averageDamage = 0
            if (this.clonedTower.turrets.length > 0) {
                this.clonedTower.turrets.forEach((t) => {
                    averageDamage += t.STATS[0]
                })
                averageDamage /= this.clonedTower.turrets.length
            }
            if (this.clonedTower.blastDamage > 0) {
                averageDamage = this.clonedTower.blastDamage
            }
            ctx.fillStyle = "rgb(255, 50, 50)"
            if (!this.clonedTower.droneSpawner.canSpawn) {
                ctx.strokeText(this.clonedTower.blastDamage > 0 ? "Blast Damage: " + averageDamage : "Avg. Damage: " + averageDamage, tabX+10, tabY+this.tabHeight-15)
                ctx.fillText(this.clonedTower.blastDamage > 0 ? "Blast Damage: " + averageDamage : "Avg. Damage: " + averageDamage, tabX+10, tabY+this.tabHeight-15)
            }
            if (this.clonedTower.droneSpawner.canSpawn) {
                ctx.strokeText("Drone Bullet Damage: " + this.clonedTower.droneSpawner.droneStats[0], tabX+10, tabY+this.tabHeight-15)
                ctx.fillText("Drone Bullet Damage: " + this.clonedTower.droneSpawner.droneStats[0], tabX+10, tabY+this.tabHeight-15)
                ctx.strokeText("Drone Body Damage: " + this.clonedTower.droneSpawner.droneStats[3], tabX+10, tabY+this.tabHeight-40)
                ctx.fillText("Drone Body Damage: " + this.clonedTower.droneSpawner.droneStats[3], tabX+10, tabY+this.tabHeight-40)
                ctx.fillStyle = "rgb(50, 255, 50)"
                ctx.strokeText("Drone Health: " + this.clonedTower.droneSpawner.droneStats[2], tabX+10, tabY+this.tabHeight-65)
                ctx.fillText("Drone Health: " + this.clonedTower.droneSpawner.droneStats[2], tabX+10, tabY+this.tabHeight-65)
                ctx.fillStyle = "rgb(255, 255, 255)"
                ctx.strokeText("Drone Reload: " + (this.clonedTower.droneSpawner.droneStats[4]/60).toFixed(3)+"s", tabX+10, tabY+this.tabHeight-90)
                ctx.fillText("Drone Reload: " + (this.clonedTower.droneSpawner.droneStats[4]/60).toFixed(3)+"s", tabX+10, tabY+this.tabHeight-90)
            }
            
            let averageReload = 0
            if (this.clonedTower.turrets.length > 0) {
                this.clonedTower.turrets.forEach((t) => {
                    averageReload += t.MAX_RELOAD
                })
                averageReload /= this.clonedTower.turrets.length
            }
            if (this.clonedTower.blastMaxReload > 0) {
                averageReload = this.clonedTower.blastMaxReload
            }
            if (this.clonedTower.droneSpawner.canSpawn) {
                averageReload = this.clonedTower.droneSpawner.maxInterval
            }
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.font = "20px Arial"
            ctx.textAlign = "right"
            if (!this.clonedTower.droneSpawner.canSpawn) {
                ctx.strokeText(this.clonedTower.blastMaxReload > 0 ? "Blast Cooldown: " + (averageReload/60).toFixed(3) + "s" : "Avg. Reload: " + (averageReload/60).toFixed(3) + "s", tabX+this.tabWidth-10, tabY+30)
                ctx.fillText(this.clonedTower.blastMaxReload > 0 ? "Blast Cooldown: " + (averageReload/60).toFixed(3) + "s" : "Avg. Reload: " + (averageReload/60).toFixed(3) + "s", tabX+this.tabWidth-10, tabY+30)
            }
            if (this.clonedTower.droneSpawner.canSpawn) {
                ctx.strokeText("Drone Spawnrate: " + (averageReload/60).toFixed(3) + "s", tabX+this.tabWidth-10, tabY+30)
                ctx.fillText("Drone Spawnrate: " + (averageReload/60).toFixed(3) + "s", tabX+this.tabWidth-10, tabY+30)
                ctx.font = "15px Arial"
                ctx.strokeText("Max Drones: " + this.clonedTower.droneSpawner.maxDrones, tabX+this.tabWidth-10, tabY+50)
                ctx.fillText("Max Drones: " + this.clonedTower.droneSpawner.maxDrones, tabX+this.tabWidth-10, tabY+50)
            }
            ctx.font = "15px Arial"
            ctx.fillStyle = "rgb(0, 255, 0)"
            ctx.strokeText(this.cost + " Uranium", tabX+this.tabWidth-10, tabY+this.tabHeight-10)
            ctx.fillText(this.cost + " Uranium", tabX+this.tabWidth-10, tabY+this.tabHeight-10)
            if (this.clonedTower.blastPush > 0) {
                ctx.font = "15px Arial"
                ctx.fillStyle = "rgb(255, 255, 255)"
                ctx.strokeText("Blast Push: " + abbreviate(this.clonedTower.blastPush), tabX+this.tabWidth-10, tabY+this.tabHeight-30)
                ctx.fillText("Blast Push: " + abbreviate(this.clonedTower.blastPush), tabX+this.tabWidth-10, tabY+this.tabHeight-30)
            }
            ctx.closePath()
        }
    }
}