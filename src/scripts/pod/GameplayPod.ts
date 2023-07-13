import { BehaviorSubject } from 'rxjs'
import { GamePhaseSettingBean } from '../GamePhaseSettingBean'
import { GameConfig } from '../GameConfig'

export class GameplayPod {
    currentGameConfig: GamePhaseSettingBean
    phase: BehaviorSubject<number> = new BehaviorSubject(1)

    private maxGamePhase: number = GameConfig.GAMEPHASESETTING.length
    constructor() {
        this.currentGameConfig = GameConfig.GAMEPHASESETTING.find((x) => x.phase == this.phase.value)
    }

    changeGamePhase(phase: number) {
        if (phase <= this.maxGamePhase) {
            this.currentGameConfig = GameConfig.GAMEPHASESETTING.find((x) => x.phase == phase)
            this.phase.next(phase)
        } else {
            console.log('Max Phase Game')
        }
    }
}
