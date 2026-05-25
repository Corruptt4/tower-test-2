import { Camera } from "./MODULES/camera.js"
import { Enemy } from "./MODULES/ENTITIES/enemy.js"
import { Tower } from "./MODULES/ENTITIES/tower.js"
import { getAngle, removeElement } from "./MODULES/functions.js"
import { MiniMap } from "./MODULES/minimap.js"
import { SpatialHash } from "./MODULES/PHYSICS/spatialHash.js"
import { WaveHandler } from "./MODULES/wave.js"

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
const SPEED = 10
let keys = {}
let fps = 0
export let shownFPS = 0

export let mapSize = 5000
export const canvas = document.getElementById("canv"),
            ctx = canvas.getContext("2d")
resize()
export let world = {
    ENTITIES: [],
    TOWERS: [],
    ENEMIES: [],
    BULLETS: []
}
export const frictionFactor = 0.93
let spatialHash = new SpatialHash(16, mapSize)
spatialHash.innitiateGrid()
let wave = new WaveHandler(0)
let minimap = new MiniMap(250)
setInterval(() => {
    for (let i = 0; i < 1; i++) {
        let ang = Math.PI * 2 * Math.random()
        let dist = 800+Math.random()*200
        let testEnemy = new Enemy(mapSize/2 + dist * Math.cos(ang), mapSize/2 - dist * Math.sin(ang), 30, 300, 10)
        world.ENEMIES.push(testEnemy)
    }
}, 1000/2)
for (let i = 0, s = 3; i < s; i++) {
    let ang = ((Math.PI*2)/s)*i
    let testTower = new Tower(
        mapSize/2+s*13*Math.cos(ang), 
        mapSize/2+s*13*Math.sin(ang), 
        "Basic",
        "rgb(75, 75, 75)", 30, []
    )
    testTower.turrets = ((o = []) => {
        for (let i = 0, s = 4; i < s; i++) {
            let ang = ((Math.PI*2)/s )* i
            let d = 19
            o.push({
                POSITION: [d*Math.cos(ang), d*Math.sin(ang)],
                SIZE: 10,
                //         damage (base is 5),       bspeed (base is 6)
                STATS: [            10,                             6             ],
                ANGLE: 0,
                COLOR: "rgb(110, 110, 110)",
                GUN_COL: "rgb(100, 100, 100)",
                WIDTH: 10,
                HEIGHT: 20,
                CAN_SHOOT: true,
                BULLET_COL: "rgb(150, 255, 10)",
                MAX_RELOAD: 10,
                RELOAD: 0
            })
        }
        return o
    })()
    world.TOWERS.push(testTower)
}

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
        enemy.towers = world.TOWERS

        if (enemy.health <= 0) {
            removeElement(enemy, world.ENEMIES)
        }
    })
    world.ENTITIES.forEach((e) => {
        e.update()
    })
    minimap.entities = world.ENTITIES
    wave.update()
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
    ctx.restore()
    minimap.draw()
    wave.draw()
    requestAnimationFrame(render)
}
render()