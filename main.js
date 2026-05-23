import { Camera } from "./MODULES/camera.js"
import { Tower } from "./MODULES/ENTITIES/tower.js"

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
let mapSize = 5000
export let towers = []
export const canvas = document.getElementById("canv"),
            ctx = canvas.getContext("2d")
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
            GUN_COL: "rgb(100, 0, 0)",
            WIDTH: 8,
            HEIGHT: 18,
            MAX_RELOAD: 50,
            RELOAD: 50
        }
    ]
)
towers.push(tower)

resize()

const camera = new Camera(mapSize/2, mapSize/2)

let update =  setInterval(() => {
    towers.forEach((tow) => {
        tow.update()
    })
}, 1000/60)
function render() {
    resize()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    camera.follow()
    camera.apply()
    towers.forEach((tower) => {
        tower.draw()
    })
    requestAnimationFrame(render)
}
render()