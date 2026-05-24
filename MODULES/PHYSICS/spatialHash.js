import { mapSize, ctx }  from "../../main.js"
import { getDist } from "../functions.js";

// cell
class Cell {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.index = 0
        this.collisions = []
        this.entities = []
    }
    insert(entity) {
        this.entities.push(entity)
    }
    updateCell() {
        this.collisions = []
        for (let i = 0; i < this.entities.length; i++) {
            let e1 = this.entities[i]
            for (let j = i+1; j < this.entities.length; j++) {
                let e2 = this.entities[j]
                let r = e1.size+e2.size
                if (getDist(e1, e2) < (r*r)) {
                    this.collisions.push([e1, e2])
                }
            }
        }
    }
}

// spatial hash ;3
export class SpatialHash {
    constructor(size, mapSize) {
        this.grid = size ?? 16
        this.mapSize = mapSize
        this.factor = 0
        this.cells = []
        this.collisions = []
    }
    draw() {
        this.cells.forEach((cell) => {
            ctx.beginPath()
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
            ctx.lineWidth = 3
            ctx.strokeRect(cell.x, cell.y, cell.width, cell.height)
            ctx.fillRect(cell.x, cell.y, cell.width, cell.height)
            ctx.font = `${cell.width/10}px Arial`
            ctx.textAlign = "center"
            ctx.fillText(`G${cell.index}`, cell.x + cell.width/2, cell.y + cell.height/2)
            ctx.closePath()
        })
    }
    innitiateGrid() {
        for (let x = 0; x < this.grid; x++) {
            for (let y = 0; y < this.grid; y++) {
                let cellSize = this.mapSize/this.grid
                let index = y*this.grid+x
                this.cells[index] = new Cell(cellSize*x, cellSize*y, cellSize, cellSize)
                this.cells[index].index = index
            }
        }
    }
    clearCellEntities() {
        this.cells.forEach((cell) => {
            cell.entities = []
        })
    }
    update() {
        this.collisions = []
        this.cells.forEach((cell) => {
            cell.updateCell()
            let collisions = []
            this.collisions.push(...cell.collisions)
        })
    }
    addEntity(entity) {
        let cSize = this.mapSize/this.grid
        let cSx = Math.floor((entity.x-entity.size-this.factor)/cSize)
        let cSy = Math.floor((entity.y-entity.size-this.factor)/cSize)
        let cEx = Math.floor((entity.x+entity.size+this.factor)/cSize)
        let cEy = Math.floor((entity.y+entity.size+this.factor)/cSize)
        cSx = Math.max(0, cSx)
        cSy = Math.max(0, cSy)
        cEx = Math.min(this.grid-1, cEx)
        cEy = Math.min(this.grid-1, cEy)
        for (let x = cSx; x <= cEx; x++) {
            for (let y = cSy; y <= cEy; y++) {
                let index = y*this.grid+x
                this.cells[index].insert(entity)
            }
        }
    }
}