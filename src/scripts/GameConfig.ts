import { GamePhaseSettingBean } from './GamePhaseSettingBean'

export class GameConfig {
    static readonly GAMEPHASESETTING: GamePhaseSettingBean[] = [
        new GamePhaseSettingBean({
            phase: 1,
            speed: -300,
            minTimeObstacleTimeRand: 3,
            maxTimeObstacleTimeRand: 10,
            minTimeCoinTimeRand: 4,
            maxTimeCoinTimeRand: 8,
            isSpawnObstacleMoveBoth: false,
            phaseTimeSecChange: 20,
        }),
        new GamePhaseSettingBean({
            phase: 2,
            speed: -600,
            minTimeObstacleTimeRand: 3,
            maxTimeObstacleTimeRand: 8,
            minTimeCoinTimeRand: 4,
            maxTimeCoinTimeRand: 8,
            isSpawnObstacleMoveBoth: true,
            phaseTimeSecChange: 20,
        }),
        new GamePhaseSettingBean({
            phase: 3,
            speed: -800,
            minTimeObstacleTimeRand: 3,
            maxTimeObstacleTimeRand: 6,
            minTimeCoinTimeRand: 4,
            maxTimeCoinTimeRand: 8,
            isSpawnObstacleMoveBoth: true,
            obstacleIndexArray: [0, 1, 2],
            phaseTimeSecChange: 0,
        }),
    ]
}

// {
//     phase: 1,
//     minTimeObstacleTimeRand: 3,
//     maxTimeObstacleTimeRand: 10
//   },
//   {
//     phase: 2,
//     minTimeObstacleTimeRand: 3,
//     maxTimeObstacleTimeRand: 8
//   },
//   {
//     phase: 3,
//     minTimeObstacleTimeRand: 3,
//     maxTimeObstacleTimeRand: 6
//   }
