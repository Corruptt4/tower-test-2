import { world, ctx } from "../main.js";

export class WaveHandler {
    constructor(startWave) {
        this.wave = startWave
        this.waveMaxTimer = 60*30
        this.waveTimer = this.waveMaxTimer
        this.enemiesToSpawn = []
        this.spawnTickDelay = 50
    }
}