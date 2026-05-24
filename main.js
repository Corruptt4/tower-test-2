import { Camera } from "./MODULES/camera.js"
import { Tower } from "./MODULES/ENTITIES/tower.js"

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
const SPEED = 10
let mapSize = 5000
let keys = {}
export const canvas = document.getElementById("canv"),
            ctx = canvas.getContext("2d")
resize()
export let world = {
    TOWERS: [],
    ENEMIES: []
}
let tower = new Tower(
    mapSize/2, 
    mapSize/2, 
    "Basic",
    "rgb(75, 75, 75)", 30, 
    [
        {
            POSITION: [0, 0],
            SIZE: 17,
            ANGLE: 0,
            COLOR: "rgb(110, 110, 110)",
            GUN_COL: "rgb(100, 100, 100)",
            WIDTH: 8,
            HEIGHT: 18,
            MAX_RELOAD: 50,
            RELOAD: 50
        }
    ]
)
world.TOWERS.push(tower)

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true
})
document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false
})


const camera = new Camera(mapSize/2, mapSize/2)

let update =  setInterval(() => {
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
    world.TOWERS.forEach((tow) => {
        tow.update()
    })
}, 1000/60)
function render() {
    resize()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    camera.apply()
    world.TOWERS.forEach((tower) => {
        tower.draw()
    })
    requestAnimationFrame(render)
}
render()