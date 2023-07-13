import { GameObjects, Sound } from 'phaser'
import GameplayBackgroundView from '../Gameplay/GameplayBackgroundView'
import { PlayerObjectView } from '../player/PlayerObjectView'
import { UIUtil } from '../plugins/utils/UIUtil'
import ObstacleAndItemView from '../Gameplay/ObstacleAndItemView'
import { Subscription, timer } from 'rxjs'
import { GameplayPod } from '../pod/GameplayPod'
import { PodProvider } from '../pod/PodProvider'
import { GameplayUIPod } from '../pod/GameplayUIPod'
import { GameplayUIState } from '../Gameplay/GameplayUIState'
import { GameResultView } from '../Gameplay/GameResultView'

export class GamePlayScene extends Phaser.Scene {
   private gameplayBackgroundView: GameplayBackgroundView
   private obstacleView: ObstacleAndItemView
   private playerObjectView: PlayerObjectView
   private gameResultView: GameResultView
   private playerScoreText: GameObjects.Text
   private gameBgmPlayer: Sound.BaseSound

   private gameplayPod: GameplayPod
   private gameplayUIPod: GameplayUIPod
   private gamePhaseInterval: Subscription

   constructor() {
      super({ key: 'GamePlayScene' })
   }

   private setupSubscribe(): void {
      this.gameplayUIPod.currentGameplayUIState.subscribe((state) => {
         switch (state) {
            case GameplayUIState.Gameplay:
               this.gameBgmPlayer.play()
               this.gameResultView.setActive(false)
               this.gameResultView.showHideResult(false)
               break
            case GameplayUIState.GameResult:
               this.gameplayPod.changeGamePhase(1)
               this.fadeOutBGM()
               this.disposeAll()
               this.obstacleView.destroy(false)
               this.playerScoreText.setActive(false)
               this.playerScoreText.setVisible(false)
               timer(2000).subscribe((_) => {
                  this.gameResultView.setActive(true)
                  this.gameResultView.showHideResult(true, this.playerObjectView.getPlayerScore())
               })

               break
         }
      })
   }

   private fadeOutBGM(): void {
      this.tweens.add({
         targets: this.gameBgmPlayer,
         volume: 0,
         ease: 'Linear',
         duration: 2000,
         onComplete: () => {
            this.gameBgmPlayer.stop()
         },
      })
   }

   public create() {
      this.doInit()
   }

   public doInit() {
      this.gameplayPod = PodProvider.instance.gamePlayPod
      this.gameplayUIPod = PodProvider.instance.gamePlayUIPod

      this.setPhaseIntervalChange()

      this.gameplayBackgroundView = new GameplayBackgroundView(this)
      this.gameplayBackgroundView.doInit()

      this.gameResultView = new GameResultView(this, 'GameObject')
      this.gameResultView.doInit()

      this.playerObjectView = new PlayerObjectView(this, 109, 310, 'nyan_cat', '')
      this.playerObjectView.doInit()

      this.obstacleView = new ObstacleAndItemView(this)
      this.obstacleView.doInit(this.playerObjectView)

      this.playerScoreText = this.add
         .text(UIUtil.getCanvasWidth() / 2, 50, '0', { font: 'Arial' })
         .setOrigin(0.5)
         .setFontSize(50)

      this.gameBgmPlayer = this.sound.add('game_bgm', { loop: true, volume: 0.3 })

      this.setupSubscribe()
   }

   public setPhaseIntervalChange() {
      this.gamePhaseInterval?.unsubscribe()
      console.log('start phase : ' + this.gameplayPod.phase.value)
      if (PodProvider.instance.gamePlayUIPod.currentGameplayUIState.value == GameplayUIState.Gameplay) {
         if (this.gameplayPod.currentGameConfig.phaseTimeSecChange != 0) {
            let phaseTimeConvertToMiniSec = this.gameplayPod.currentGameConfig.phaseTimeSecChange * 1000
            this.gamePhaseInterval = timer(phaseTimeConvertToMiniSec).subscribe((_) => {
               this.gameplayPod.changeGamePhase(this.gameplayPod.phase.value + 1)
               this.setPhaseIntervalChange()
            })
         }
      }
   }

   public update(): void {
      this.gameplayBackgroundView.update()
      this.playerObjectView.update()
      this.playerScoreText.setText(this.playerObjectView.getPlayerScore().toString())
   }

   public disposeAll(): void {
      this.gamePhaseInterval?.unsubscribe()
   }
}
