import { Tower } from "../ENTITIES/tower.js"

class BasicTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Basic"
    }

    innitTurrets() {
        this.turrets = [
            {
                POSITION: [0, 0],
                SIZE: 5,
                STATS: [ 20, 6 ],
                ANGLE: 0,
                COLOR: "rgb(110, 110, 110)",
                GUN_COL: "rgb(100, 100, 100)",
                WIDTH: 10,
                HEIGHT: 20,
                CAN_SHOOT: true,
                BULLET_COL: "rgb(120, 120, 120)",
                MAX_RELOAD: 40,
                RELOAD: 0
            }
        ]
    }
}

let basicTower = new BasicTower(0, 0, "", "rgb(120, 120, 120)", 30, [])
basicTower.innitTurrets()

export let towers = [
    // [tower, cost]
    [basicTower, 0]
]