import {darkenRGB, degreesToRads, getAngle, getDist, minMax, randomElement} from "../functions.js"
import { ctx, world } from "../../main.js";
import { Bullet, Shockwave } from "./bullet.js";
import { Drone } from "./drone.js";

export class Tower {
    constructor(x, y, name, color, size, turrets) {
        this.x = x
        this.y = y
        this.name = name ?? "Placeholder"
        this.size = size
        this.health = 1500
        this.turrets = turrets
        this.type = "tower"
        this.color = color
        this.target = null
        this.canshoot = false
        this.showAura = true;
        this.blastMaxReload = 0
        this.blastReload = 0
        this.blastDamage = 0
        this.blastRadius = 0;
        this.blastPush = 0;
        this.targets = []
        this.drones = []
        this.droneSpawner = {
            canSpawn: false,
            maxDrones: 0,
            maxInterval: 100,
            interval: 100, // ms
            droneStats: [ 30, 12, 1500, 15, 35 ] // [ damage, bullet speed, drone health, drone damage]
        }
        this.t = 0
        this.description = "Placeholder placeholder: [Object object]"
        this.uraniumProd = {
            canProduce: false,
            amount: 0 // PER TICK. 0.05 * 60 = 3/s
        }
        this.availableTargets = []
        this.turrets.forEach((tur) => {
            tur.TARGET = null
            tur.TARGETS = []
            tur.AVAILABLE_TARGETS = []
            tur.SIZE *= (this.size/10)
        })
    }
    miscUpdate(uran) {
        uran += this.uraniumProd.amount
    }
    update() {
        if (this.droneSpawner.canSpawn) {
            if (this.drones.length < this.droneSpawner.maxDrones) {
                this.droneSpawner.interval--
            }
            if (this.droneSpawner.interval == 0) {
                this.droneSpawner.interval = this.droneSpawner.maxInterval
                let drone = new Drone(this.x, this.y, 25, this)
                this.drones.push(drone)
                world.DRONES.push(drone)
            }
        }
        if (this.blastMaxReload > 0) {
            this.blastReload++
            if (this.blastReload >= this.blastMaxReload) {
                this.blastReload = 0
                let shockwave = new Shockwave(this.x, this.y, this.size, this.size*this.blastRadius)
                world.BULLETS.push(shockwave)
                world.ENEMIES.forEach((e) => {
                    let dx = e.x - this.x
                    let dy = e.y - this.y
                    let blastSize = this.size*this.blastRadius
                    let r = e.size + blastSize
                    let dist = dx*dx+dy*dy
                    let angle = Math.atan2(dy, dx)
                    if (dist <= r*r) {
                        e.vel.x += (this.blastPush) * Math.cos(angle)
                        e.vel.y += (this.blastPush) * Math.sin(angle)
                        e.health -= this.blastDamage
                    }
                })
            }
        }
        this.t += 0.03
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
        if (this.uraniumProd.canProduce && this.showAura) {
            ctx.beginPath()
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
            ctx.strokeStyle = "rgb(0, 255, 0)"
            ctx.lineWidth = 3
            ctx.arc(this.x, this.y, this.size*2 + this.size*Math.sin(this.t), 0, Math.PI*2)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        }

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
        ctx.arc(this.x, this.y, this.size*1.3, 0, Math.PI * 2 * (this.blastReload/this.blastMaxReload))
        ctx.stroke()
        ctx.closePath()

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

export class TowerPlaceholder {
    constructor(x, y, name, color, size, turrets) {
        this.x = x;
        this.y = y;
        this.name = name ?? "Placeholder"
        this.size = size;
        this.health = 1500
        this.turrets = turrets
        this.canPlace = true
        this.color = "rgb(0, 255, 0)";
        this.savedColor = "rgb(130, 130, 130)";
        this.savedTurretData = []
        this.turrets.forEach((tur) => {
            tur.TARGET = null
            tur.TARGETS = []
            tur.AVAILABLE_TARGETS = []
            tur.SIZE *= (this.size/20)
            tur.POSITION[0] *= (this.size/20)
            tur.POSITION[1] *= (this.size/20)
        })
    }
    update() {
        this.turrets.forEach((tur) => {
            tur.ANGLE += 360*0.003
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