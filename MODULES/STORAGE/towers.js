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
class TwinTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Twin"
    }

    innitTurrets() {
        this.turrets = [
            {
                POSITION: [9, 0],
                SIZE: 4,
                STATS: [ 25, 6 ],
                ANGLE: 0,
                COLOR: "rgb(110, 110, 110)",
                GUN_COL: "rgb(100, 100, 100)",
                WIDTH: 10,
                HEIGHT: 20,
                CAN_SHOOT: true,
                BULLET_COL: "rgb(120, 120, 120)",
                MAX_RELOAD: 25,
                RELOAD: 0
            },
            {
                POSITION: [-9, 0],
                SIZE: 4,
                STATS: [ 25, 6 ],
                ANGLE: 0,
                COLOR: "rgb(110, 110, 110)",
                GUN_COL: "rgb(100, 100, 100)",
                WIDTH: 10,
                HEIGHT: 20,
                CAN_SHOOT: true,
                BULLET_COL: "rgb(120, 120, 120)",
                MAX_RELOAD: 25,
                RELOAD: 0
            },
        ]
    }
}
class RapidTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Rapid"
    }

    innitTurrets() {
        this.turrets = [
            {
                POSITION: [0, 0],
                SIZE: 7,
                STATS: [ 25, 8 ],
                ANGLE: 0,
                COLOR: "rgb(110, 110, 110)",
                GUN_COL: "rgb(100, 100, 100)",
                WIDTH: 5,
                HEIGHT: 20,
                CAN_SHOOT: true,
                BULLET_COL: "rgb(120, 120, 120)",
                MAX_RELOAD: 15,
                RELOAD: 0
            },
        ]
    }
}
class DestroyerTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Destroyer"
    }

    innitTurrets() {
        this.turrets = [
            {
                POSITION: [0, 0],
                SIZE: 7,
                STATS: [ 80, 8 ],
                ANGLE: 0,
                COLOR: "rgb(110, 110, 110)",
                GUN_COL: "rgb(100, 100, 100)",
                WIDTH: 15,
                HEIGHT: 25,
                CAN_SHOOT: true,
                BULLET_COL: "rgb(120, 120, 120)",
                MAX_RELOAD: 70,
                RELOAD: 0
            },
        ]
    }
}

class TripletTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Triple"
    }

    innitTurrets() {
        this.turrets = ((o=[]) => {
            for (let i = 0, s = 3; i < s; i++) {
                let ang = ((Math.PI*2)/s)*i
                o.push({
                    POSITION: [10 * Math.cos(ang), 10 * Math.sin(ang)],
                    SIZE: 4,
                    STATS: [ 45, 6.5 ],
                    ANGLE: (ang*(180/Math.PI)),
                    COLOR: "rgb(110, 110, 110)",
                    GUN_COL: "rgb(100, 100, 100)",
                    WIDTH: 10,
                    HEIGHT: 20,
                    CAN_SHOOT: true,
                    BULLET_COL: "rgb(120, 120, 120)",
                    MAX_RELOAD: 25,
                    RELOAD: 0
                })
            }
            return o
        })()
    }
}

let basicTower = new BasicTower(0, 0, "", "rgb(120, 120, 120)", 30, [])
basicTower.innitTurrets()
let twinTower = new TwinTower(0, 0, "", "rgb(120, 120, 120)", 30, [])
twinTower.innitTurrets()
let rapidTower = new RapidTower(0, 0, "", "rgb(120, 120, 120)", 30, [])
rapidTower.innitTurrets()
let destroyerTower = new DestroyerTower(0, 0, "", "rgb(120, 120, 120)", 30, [])
destroyerTower.innitTurrets()
let tripletTower = new TripletTower(0, 0, "", "rgb(120, 120, 120)", 30, [])
tripletTower.innitTurrets()

export let towers = [
    // [tower, cost]
    [basicTower, 20],
    [twinTower, 70],
    [rapidTower, 80],
    [destroyerTower, 160],
    [tripletTower, 100]
]