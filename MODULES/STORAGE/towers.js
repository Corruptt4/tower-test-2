import { Tower } from "../ENTITIES/tower.js"

class BasicTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Basic"
        this.description = "Everything starts here."
        this.savedColor = "rgb(130, 130, 130)"
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
        this.description = "The turrets aren't alone anymore."
        this.savedColor = "rgb(130, 130, 130)"
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
        this.description = "Shoots extremely fast."
        this.savedColor = "rgb(130, 130, 130)"
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
        this.description = "Very high damage."
        this.savedColor = "rgb(130, 130, 130)"
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
class BlastTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 3500
        this.name = "Blaster"
        this.blastMaxReload = 50;
        this.blastReload = 0;
        this.blastDamage = 45;
        this.blastRadius = 10;
        this.blastPush = 5;
        this.description = "Blast damage doing the work today! For free!"
        this.color = "rgb(40, 40, 40)"
        this.savedColor = "rgb(40, 40, 40)"
    }
}

class TripletTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 2500
        this.name = "Triple"
        this.description = "Triplets? Triple the damage, because triple the turrets."
        this.savedColor = "rgb(130, 130, 130)"
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
class ProducerTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 6000
        this.name = "Producer"
        this.color = "rgb(0, 255, 0)"
        this.savedColor = "rgb(0, 255, 0)"
        this.description = "Vulnerable, looks radioactive... produces uranium."
        this.uraniumProd = {
            canProduce: true,
            amount: 10 // 10/s
        }
    }
}
class DroneTower extends Tower {
    constructor(x, y, name, color, size, turrets) {
        super(x, y, name, color, size, turrets)
        this.health = 6000
        this.name = "Hangar"
        this.savedColor = "rgb(130, 130, 130)"
        this.description = "Now comes to spawn drones for defense."
        this.droneSpawner = {
            canSpawn: true,
            interval: 150,
            maxInterval: 150,
            maxDrones: 5,
            droneStats: [ 30, 12, 1500, 15, 25 ]
        }
    }
}

let basicTower = new BasicTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
basicTower.innitTurrets()
let twinTower = new TwinTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
twinTower.innitTurrets()
let rapidTower = new RapidTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
rapidTower.innitTurrets()
let destroyerTower = new DestroyerTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
destroyerTower.innitTurrets()
let tripletTower = new TripletTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
tripletTower.innitTurrets()
let producerTower = new ProducerTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
let blastTower = new BlastTower(0, 0, "", "rgb(130, 130, 130)", 30, [])
let droneTower = new DroneTower(0, 0, "", "rgb(130, 130, 130)", 30, [])

export let towers = [
    // [tower, cost]
    [basicTower, 20],
    [twinTower, 70],
    [rapidTower, 80],
    [destroyerTower, 160],
    [tripletTower, 100],
    [producerTower, 150],
    [blastTower, 450],
    [droneTower, 100]
]