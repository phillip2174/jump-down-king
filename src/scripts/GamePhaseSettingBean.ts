export class GamePhaseSettingBean {
    phase: number
    speed: number
    minTimeObstacleTimeRand: number
    maxTimeObstacleTimeRand: number
    minTimeCoinTimeRand: number
    maxTimeCoinTimeRand: number
    isSpawnObstacleMoveBoth: boolean
    obstacleIndexArray: number[] = [0, 1]
    phaseTimeSecChange: number

    // constructor(phase : number , minTime : number , maxTime){
    //     this.phase = phase
    //     this.minTimeObstacleTimeRand = minTime;
    //     this.maxTimeObstacleTimeRand = maxTime;
    // }

    constructor(init?: Partial<GamePhaseSettingBean>) {
        Object.assign(this, init)
    }
}
