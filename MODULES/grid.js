import { canvas, ctx, mapSize } from "../main.js"

export function makeGrid(cellSize) {
    let startX = 0
    let startY = 0
    ctx.beginPath()
    ctx.strokeStyle = "rgb(90, 90, 90)"
    for (let x = startX; x < mapSize; x+= cellSize) {
        ctx.moveTo(x, startY)
        ctx.lineTo(x, mapSize)
    }
    for (let y = startX; y < mapSize; y+= cellSize) {
        ctx.moveTo(startX, y)
        ctx.lineTo(mapSize, y)
    }
    ctx.stroke()
    ctx.closePath()
}