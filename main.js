import { Camera } from "./MODULES/camera.js"
import { Enemy } from "./MODULES/ENTITIES/enemy.js"
import { Tower, TowerPlaceholder } from "./MODULES/ENTITIES/tower.js"
import { getAngle, mouseRectCollision, removeElement } from "./MODULES/functions.js"
import { MiniMap } from "./MODULES/minimap.js"
import { SpatialHash } from "./MODULES/PHYSICS/spatialHash.js"
import { WaveHandler } from "./MODULES/wave.js"
import { towers } from "./MODULES/STORAGE/towers.js"
import { TowerButton } from "./MODULES/UI/towerPlaceBTN.js"
import { PointText } from "./MODULES/UI/pointText.js"
import { settings } from "./MODULES/settings.js"
import { Drone } from "./MODULES/ENTITIES/drone.js"
import { makeGrid } from "./MODULES/grid.js"

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
const SPEED = settings.cameraSpeed
let keys = {}
let fps = 0
let mx = 0
let my = 0
let wmx = 0
let wmy = 0
export var uranium = settings.uraniumPoints
export let shownFPS = 0

export let mapSize = settings.mapSize
export const canvas = document.getElementById("canv"),
            ctx = canvas.getContext("2d")
resize()
export let world = {
    ENTITIES: [],
    TOWERS: [],
    ENEMIES: [],
    BULLETS: [],
    DRONES: [],
    PLACEHOLDER: []
}
export const frictionFactor = settings.frictionFactor

let towerButtons = []
let pointTexts = []

pointTexts.push(new PointText(0, canvas.height/2, 125, 65, "Uranium", uranium))

towers.forEach((struct) => {
    let [tower, cost] = struct
    let tBTN = new TowerButton(100, 100, 80, tower, cost)
    towerButtons.push(tBTN)
})

let spatialHash = new SpatialHash(16, mapSize)
spatialHash.innitiateGrid()

let wave = new WaveHandler(settings.startingWave)

let minimap = new MiniMap(250)

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true
    if (e.keyCode == 84 && world.PLACEHOLDER.length > 0) {
        world.PLACEHOLDER.splice(0, 1)
    }
})
document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false
})

// no stupid context menus when you right click ig
window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})
document.addEventListener("mousemove", (e) => {
    mx = e.clientX
    my = e.clientY

    towerButtons.forEach((b) => {
        b.hovered = false
        if (mouseRectCollision(mx, my, b.x, b.y, b.size/2)) {
            b.hovered = true
            canvas.style.cursor = "pointer"
        }
    })
    canvas.style.cursor = "default"
})
document.addEventListener("mousedown", (e) => {
    world.TOWERS.forEach((tow) => {
        let dx = tow.x-wmx
        let dy = tow.y-wmy
        let size = tow.size*tow.size
        let dist = dx*dx+dy*dy
        if (dist < size) {
            tow.selected = true
        }
        if (dist > size) {
            tow.selected = false
        }
    })
    if (e.button == 0) {
        if (world.PLACEHOLDER.length == 1 && uranium < world.PLACEHOLDER[0][1] && world.PLACEHOLDER[0][0].canPlace) {
            world.PLACEHOLDER[0][0].color = "rgb(255, 0, 0)"
            world.PLACEHOLDER[0][0].canPlace = false
            setTimeout(() => {
                world.PLACEHOLDER.splice(0, 1)
            }, 100)
        }
        if (world.PLACEHOLDER.length == 1 && uranium >= world.PLACEHOLDER[0][1] && world.PLACEHOLDER[0][0].canPlace) {
            if (world.PLACEHOLDER[0][0].canPlace == false) return;
            let tower = world.PLACEHOLDER[0][0]
            let cost = world.PLACEHOLDER[0][1]
            let canPlace = true
            if (world.TOWERS.length > 0) {
                for (let t of world.TOWERS) {
                    let dx = t.x - tower.x
                    let dy = t.y - tower.y
                    let dist = dx*dx+dy*dy
                    let r = t.size + tower.size
                    if (dist < r*r) {
                        canPlace = false;
                        break;
                    }
                }
                if (!canPlace) {
                    tower.color = "rgb(255, 0, 0)"
                    tower.canPlace = false
                    setTimeout(() => {
                        tower.color = "rgb(0, 255, 0)"
                        tower.canPlace = true
                    }, 50)
                }
                if (canPlace) {
                    let newTower = new Tower(wmx, wmy, tower.name, tower.savedColor, 30, structuredClone(tower.turrets))
                    newTower.turrets.forEach((tur, index) => {
                        tur.COLOR = tower.savedTurretData[index].COLOR
                        tur.GUN_COL = tower.savedTurretData[index].GUN_COL
                        tur.SIZE /= (newTower.size/10)
                    })
                    newTower.color = world.PLACEHOLDER[0][0].savedColor
                    newTower.uraniumProd = world.PLACEHOLDER[0][0].uraniumProd
                    newTower.blastMaxReload = world.PLACEHOLDER[0][0].blastMaxReload
                    newTower.blastDamage = world.PLACEHOLDER[0][0].blastDamage
                    newTower.blastRadius = world.PLACEHOLDER[0][0].blastRadius
                    newTower.blastPush = world.PLACEHOLDER[0][0].blastPush
                    newTower.droneSpawner = world.PLACEHOLDER[0][0].droneSpawner
                    newTower.level = world.PLACEHOLDER[0][0].level
                    uranium -= cost
                    world.TOWERS.push(newTower)
                    world.PLACEHOLDER.splice(0, 1)
                }
            }
            if (world.TOWERS.length == 0) {
                let newTower = new Tower(wmx, wmy, tower.name, tower.savedColor, 30, structuredClone(tower.turrets))
                newTower.turrets.forEach((tur, index) => {
                    tur.COLOR = tower.savedTurretData[index].COLOR
                    tur.GUN_COL = tower.savedTurretData[index].GUN_COL
                    tur.SIZE /= (newTower.size/10)
                })
                newTower.color = world.PLACEHOLDER[0][0].savedColor
                newTower.uraniumProd = world.PLACEHOLDER[0][0].uraniumProd
                newTower.blastMaxReload = world.PLACEHOLDER[0][0].blastMaxReload
                newTower.blastDamage = world.PLACEHOLDER[0][0].blastDamage
                newTower.blastRadius = world.PLACEHOLDER[0][0].blastRadius
                newTower.blastPush = world.PLACEHOLDER[0][0].blastPush
                newTower.droneSpawner = world.PLACEHOLDER[0][0].droneSpawner
                newTower.level = world.PLACEHOLDER[0][0].level
                uranium -= cost
                world.TOWERS.push(newTower)
                world.PLACEHOLDER.splice(0, 1)
            }
        }
        if (world.PLACEHOLDER.length == 0) {
            for (let b of towerButtons) {
                if (mouseRectCollision(mx, my, b.x, b.y, b.size/2) && world.PLACEHOLDER.length < 1) {
                    let towToPlace = new TowerPlaceholder(wmx, wmy, "", "", 30, structuredClone(b.clonedTower.turrets))
                    towToPlace.savedTurretData = structuredClone(b.clonedTower.turrets)
                    towToPlace.savedColor = b.clonedTower.savedColor
                    towToPlace.uraniumProd = structuredClone(b.clonedTower.uraniumProd)
                    towToPlace.blastReload = b.clonedTower.blastMaxReload
                    towToPlace.blastMaxReload = b.clonedTower.blastMaxReload
                    towToPlace.blastDamage = b.clonedTower.blastDamage
                    towToPlace.blastRadius = b.clonedTower.blastRadius
                    towToPlace.blastPush = b.clonedTower.blastPush
                    towToPlace.droneSpawner = structuredClone(b.clonedTower.droneSpawner)
                    towToPlace.level = b.clonedTower.level
                    world.PLACEHOLDER.push([towToPlace, b.cost])
                    break;
                }
            }
        }
    }
})
export const camera = new Camera(mapSize/2, mapSize/2)
setInterval(() => {
    shownFPS = fps
    fps = 0
}, 1000)
let collisionUpdate = setInterval(() => {
    spatialHash.update()
    spatialHash.clearCellEntities()
    world.ENTITIES.forEach((entity) => {
        if ((entity.x < 0 || entity.x + entity.size > mapSize) && (entity.y < 0 || entity.y + entity.size > mapSize)) return;
        spatialHash.addEntity(entity)
    })
    spatialHash.collisions.forEach((col) => {
        let e1 = col[0]
        let e2 = col[1]
        if ((e1.type == "bullet" && e2.type == "enemy") || (e1.type == "enemy" && e2.type == "bullet")) {
            let enemy = e1.type == "enemy" ? e1 : e2
            let bullet = e1.type == "bullet" ? e1 : e2
            bullet.lifeTime = 0
            enemy.health -= bullet.damage
        }
        if ((e1.type == "tower" && e2.type == "enemy") || (e1.type == "enemy" && e2.type == "tower")) {
            let enemy = e1.type === "enemy" ? e1 : e2
            let dx = e1.x - e2.x
            let dy = e1.y - e2.y
            let angle = getAngle(dx, dy)
            enemy.vel.x -= 2*Math.cos(angle)
            enemy.vel.y -= 2*Math.sin(angle)
            return
        }
        if (e1.type == "drone" && e2.type == "drone" && e1.host === e2.host) {
            let dx = e1.x - e2.x
            let dy = e1.y - e2.y
            let angle = getAngle(dx, dy)
            e1.vel.x += 1*Math.cos(angle)
            e1.vel.y += 1*Math.sin(angle)
            
            e2.vel.x -= 1*Math.cos(angle)
            e2.vel.y -= 1*Math.sin(angle)
        }
        if ((e1.type == "drone" && e2.type == "enemy") || (e1.type == "enemy" && e2.type == "drone")) {
            let enemy = e1.type === "enemy" ? e1 : e2
            let drone = e2.type === "drone" ? e2 : e1
            let dx = enemy.x - drone.x
            let dy = enemy.y - drone.y
            let angle = getAngle(dx, dy)
            enemy.vel.x += 2*Math.cos(angle)
            enemy.vel.y += 2*Math.sin(angle)
            
            drone.vel.x -= 2*Math.cos(angle)
            drone.vel.y -= 2*Math.sin(angle)
            enemy.health -= drone.bodyDamage
            drone.health -= enemy.damage
        }
        if (e1.type == "enemy" && e2.type == "enemy") {
            let dx = e1.x - e2.x
            let dy = e1.y - e2.y
            let angle = getAngle(dx, dy)
            e1.vel.x += 2*Math.cos(angle)
            e1.vel.y += 2*Math.sin(angle)

            e2.vel.x -= 2*Math.cos(angle)
            e2.vel.y -= 2*Math.sin(angle)
            return
        }
    })
}, 1000/10)

let update =  setInterval(() => {
    world.DRONES = []
    if (keys[87] || keys[38]) {
        camera.y -= SPEED
    }
    if (keys[83] || keys[40]) {
        camera.y += SPEED
    }
    if (keys[65] || keys[37]) {
        camera.x -= SPEED
    }
    if (keys[68] || keys[39]) {
        camera.x += SPEED
    }
    camera.follow()
    world.BULLETS.forEach((bullet) => {
        if (bullet.health <= 0) {
            removeElement(bullet, world.BULLETS)
        }
    })
    world.TOWERS.forEach((tow) => {
        tow.targets = world.ENEMIES
        tow.miscUpdate(uranium)
        if (tow.uraniumProd.canProduce) {
            uranium += tow.uraniumProd.amount/60
        }
        if (tow.health <= 0) {
            removeElement(tow, world.TOWERS)
        }
        tow.drones.forEach((drone) => {
            world.DRONES.push(drone)
        })
    })
    world.DRONES.forEach((drone) => {
        drone.update()
        drone.targets = world.ENEMIES

        if (drone.health <= 0) {
            removeElement(drone, drone.host.drones)
        }
    })
    world.ENTITIES = world.TOWERS.concat(world.ENEMIES).concat(world.BULLETS).concat(world.DRONES)
    world.ENEMIES.forEach((enemy) => {
        if (enemy.health <= 0) {
            uranium += enemy.reward
            removeElement(enemy, world.ENEMIES)
        }
    })
    world.ENTITIES.forEach((e) => {
        e.update()
        if (e.x <= 0 && e.vel.x < 0) {
            e.vel.x += 1
        }
        if (e.x >= mapSize && e.vel.x > 0) {
            e.vel.x -= 1
        }
        if (e.y <= 0 && e.vel.y < 0) {
            e.vel.y += 1
        }
        if (e.y >= mapSize && e.vel.y > 0) {
            e.vel.y -= 1
        }
    })
    minimap.entities = world.ENTITIES
    wave.update()
    towerButtons.forEach((t) => {
        t.update()
    })
    
    wmx = mx+camera.x2-canvas.width/2
    wmy = my+camera.y2-canvas.height/2
    world.PLACEHOLDER.forEach((e) => {
        e[0].update()
    })
}, 1000/60)
function render() {
    fps++
    resize()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // spatialHash.draw()
    camera.x = Math.max(canvas.width/2, Math.min(camera.x, mapSize-canvas.width/2))
    camera.y = Math.max(canvas.height/2, Math.min(camera.y, mapSize-canvas.height/2))
    ctx.save()
    camera.apply()
    makeGrid(mapSize/50)
    world.BULLETS.forEach((e) => {
        e.draw()
    })
    world.ENEMIES.forEach((e) => {
        e.draw()
        e.drawHPBar()
    })
    world.TOWERS.forEach((e) => {
        e.draw()
    })
    world.DRONES.forEach((d) => {
        d.draw()
    })
    world.PLACEHOLDER.forEach((e) => {
        e[0].x = wmx
        e[0].y = wmy
        e[0].draw()
    })
    ctx.restore()
    minimap.x = canvas.width-minimap.size-10
    minimap.y = 10
    minimap.draw()
    wave.draw()
    towerButtons.forEach((tow, index) => {
        tow.x = (canvas.width/2)-(tow.size*1.1)*towerButtons.length/1.25+(tow.size*1.5)*(index+1)
        tow.y = canvas.height-tow.size/1.5
        tow.draw()
    })
    pointTexts.forEach((p, i) => {
        p.x = -2
        p.y = canvas.height/2 - (100*(pointTexts.length-1)) + (100*i)
        p.draw()
        switch (p.type) {
            case "Uranium": {
                p.points = uranium
                break;
            }
        }
    })
    requestAnimationFrame(render)
}
render()