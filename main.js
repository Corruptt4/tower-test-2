import { Camera } from "./MODULES/camera.js"
import { Enemy } from "./MODULES/ENTITIES/enemy.js"
import { Tower, TowerPlaceholder } from "./MODULES/ENTITIES/tower.js"
import { getAngle, mouseRectCollision, removeElement } from "./MODULES/functions.js"
import { MiniMap } from "./MODULES/minimap.js"
import { SpatialHash } from "./MODULES/PHYSICS/spatialHash.js"
import { WaveHandler } from "./MODULES/wave.js"
import { towers } from "./MODULES/STORAGE/towers.js"
import { TowerButton } from "./MODULES/UI/towerPlaceBTN.js"

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
const SPEED = 10
let keys = {}
let fps = 0
let uranium = 0
let mx = 0
let my = 0
let wmx = 0
let wmy = 0
export let shownFPS = 0

export let mapSize = 5000
export const canvas = document.getElementById("canv"),
            ctx = canvas.getContext("2d")
resize()
export let world = {
    ENTITIES: [],
    TOWERS: [],
    ENEMIES: [],
    BULLETS: [],
    PLACEHOLDER: []
}
export const frictionFactor = 0.93

let towerButtons = []
towers.forEach((struct) => {
    let [tower, cost] = struct
    let tBTN = new TowerButton(100, 100, 80, tower)
    towerButtons.push(tBTN)
})

let spatialHash = new SpatialHash(16, mapSize)
spatialHash.innitiateGrid()

let wave = new WaveHandler(0)

let minimap = new MiniMap(250)

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true
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
})
document.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        if (world.PLACEHOLDER.length == 1){
            let towerToPlace = world.PLACEHOLDER[0]
            let newTower = new Tower(wmx, wmy, towerToPlace.name, "rgb(130, 130, 130)", 30, structuredClone(towerToPlace.turrets))
            newTower.turrets.forEach((tur, index) => {
                tur.COLOR = towerToPlace.savedTurretData[index].COLOR
                tur.GUN_COL = towerToPlace.savedTurretData[index].GUN_COL
                tur.SIZE /= (newTower.size/10)
            })
            world.TOWERS.push(newTower)
            world.PLACEHOLDER.splice(0, 1)
        }
        if (world.PLACEHOLDER.length <= 1) {
            towerButtons.forEach((b) => {
                if (mouseRectCollision(mx, my, b.x, b.y, b.size) && world.PLACEHOLDER.length < 1) {
                    let towToPlace = new TowerPlaceholder(wmx, wmy, "", "", 30, structuredClone(b.clonedTower.turrets))
                    towToPlace.savedTurretData = structuredClone(b.clonedTower.turrets)
                    world.PLACEHOLDER.push(towToPlace)
                    console.log(towToPlace)
                }
            })
        }
    }
})
const camera = new Camera(mapSize/2, mapSize/2)
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
    world.ENTITIES = world.TOWERS.concat(world.ENEMIES).concat(world.BULLETS)
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
        if (tow.health <= 0) {
            removeElement(tow, world.TOWERS)
        }
    })
    world.ENEMIES.forEach((enemy) => {
        if (enemy.health <= 0) {
            removeElement(enemy, world.ENEMIES)
        }
    })
    world.ENTITIES.forEach((e) => {
        e.update()
    })
    minimap.entities = world.ENTITIES
    wave.update()
    towerButtons.forEach((t) => {
        t.update()
    })
    
    wmx = mx+camera.x2-canvas.width/2
    wmy = my+camera.y2-canvas.height/2
    world.PLACEHOLDER.forEach((e) => {
        e.update()
    })
}, 1000/60)
function render() {
    fps++
    resize()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // spatialHash.draw()
    ctx.save()
    camera.apply()
    world.BULLETS.forEach((e) => {
        e.draw()
    })
    world.ENEMIES.forEach((e) => {
        e.draw()
    })
    world.TOWERS.forEach((e) => {
        e.draw()
    })
    world.PLACEHOLDER.forEach((e) => {
        e.x = wmx
        e.y = wmy
        e.draw()
    })
    ctx.restore()
    minimap.x = canvas.width-minimap.size-10
    minimap.y = 10
    minimap.draw()
    wave.draw()
    towerButtons.forEach((tow, index) => {
        tow.x = (canvas.width/2)-(tow.size*1.1)*towerButtons.length+(tow.size*1.5)*(index+1)
        tow.y = canvas.height-tow.size/1.5
        tow.draw()
    })
    requestAnimationFrame(render)
}
render()