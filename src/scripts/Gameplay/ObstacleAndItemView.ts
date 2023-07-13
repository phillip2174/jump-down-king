import { GameObjects } from 'phaser'
import ObstacleCellView from './ObstacleCellView'
import { Subscription, timer } from 'rxjs'
import CoinCellView from './CoinCellView'
import { PlayerObjectView } from '../player/PlayerObjectView'
import { GameConfig } from '../GameConfig'
import { GameplayPod } from '../pod/GameplayPod'
import { PodProvider } from '../pod/PodProvider'
import { ObstacleType } from './ObstacleType'
import { ObstacleMoveType } from './ObstacleMoveType'
import { GameplayUIState } from './GameplayUIState'

export default class ObstacleAndItemView extends GameObjects.GameObject {
   private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

   private bodyChecker: GameObjects.Rectangle
   private obstacleTriggerMove: GameObjects.Rectangle

   private playerObject: PlayerObjectView

   private timerObstacleLeftSubscription: Subscription = new Subscription()
   private timerObstacleRightSubscription: Subscription = new Subscription()
   private coinSubscription: Subscription = new Subscription()
   private phaseSubscription: Subscription = new Subscription()

   private gamePlayPod: GameplayPod
   private tempCurrentLevel: number

   constructor(scene: Phaser.Scene) {
      super(scene, 'gameObject')
   }

   public doInit(playerObject: PlayerObjectView) {
      console.log('Init ObstacleView')

      this.gamePlayPod = PodProvider.instance.gamePlayPod

      this.playerObject = playerObject
      this.cursors = this.scene.input.keyboard.createCursorKeys()

      this.bodyChecker = this.scene.add
         .rectangle(this.scene.cameras.main.centerX, -30, this.scene.cameras.main.width * 1.5, 50, 0xffffff)
         .setDepth(4)
         .setAlpha(0)

      this.scene.physics.add.existing(this.bodyChecker)

      this.obstacleTriggerMove = this.scene.add
         .rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 50,
            this.scene.cameras.main.width * 1.5,
            1,
            0xffffff
         )
         .setDepth(4)
         .setAlpha(0)

      this.scene.physics.add.existing(this.obstacleTriggerMove)

      //this.obstacleChecker.body

      //@ts-ignore
      //this.obstacleChecker.body.setCollideWorldBounds(true);

      //let bodyPhysics: Physics.Arcade.Body = this.bodyChecker.body as Physics.Arcade.Body
      //    //@ts-ignore
      // bodyPhysics.setImmovable(true)
      // bodyPhysics.setSize(400, 160, false)
      // bodyPhysics.setOffset(0, 150)

      this.phaseSubscription = this.gamePlayPod.phase.subscribe((phase) => {
         if (PodProvider.instance.gamePlayUIPod.currentGameplayUIState.value == GameplayUIState.Gameplay) {
            this.timerObstacleLeftSubscription?.unsubscribe()
            this.timerObstacleRightSubscription?.unsubscribe()

            this.tempCurrentLevel = phase

            if (!this.gamePlayPod.currentGameConfig.isSpawnObstacleMoveBoth) {
               let laneRandom = this.randomInt(1, 2)
               if (laneRandom == 1) {
                  this.CommandSpawnObstacleLane(true, false)
               } else {
                  this.CommandSpawnObstacleLane(false, true)
               }
            } else {
               this.CommandSpawnObstacleLane(true, true)
            }
            this.SpawnCoin()
         }
      })
   }

   private CommandSpawnObstacleLane(isSpawnMoveObstacleFirstLane: boolean, isSpawnMoveObstacleSecondLane: boolean) {
      this.SpawnObstacleLane(
         this.timerObstacleLeftSubscription,
         25,
         ObstacleMoveType.LeftToRight,
         isSpawnMoveObstacleFirstLane
      )
      this.SpawnObstacleLane(
         this.timerObstacleRightSubscription,
         this.scene.cameras.main.width - 25,
         ObstacleMoveType.RightToLeft,
         isSpawnMoveObstacleSecondLane
      )
   }

   public SpawnObstacleLane(
      subscription: Subscription,
      xPosition: number,
      obstacleMoveType: ObstacleMoveType,
      isSpawnMoveObstacle: boolean
   ) {
      subscription?.unsubscribe()
      let minTimeObstacleTimeRand = this.gamePlayPod.currentGameConfig.minTimeObstacleTimeRand
      let maxTimeObstacleTimeRand = this.gamePlayPod.currentGameConfig.maxTimeObstacleTimeRand

      //let isSpawnObstacleMoveBoth = this.gamePlayPod.currentGameConfig.isSpawnObstacleMoveBoth

      let numberRandom = this.randomInt(minTimeObstacleTimeRand, maxTimeObstacleTimeRand)

      let obstacleType: ObstacleType
      if (isSpawnMoveObstacle) {
         obstacleType =
            ObstacleType[
               ObstacleType[Math.floor(Math.random() * this.gamePlayPod.currentGameConfig.obstacleIndexArray.length)]
            ]
      } else {
         obstacleType = ObstacleType.ObstacleStatic
      }

      // const randObstacleType = this.randomEnum(ObstacleType) as ObstacleType
      // console.log(obstacleMoveType + ' : ' + ObstacleType[randObstacleType])
      let currentPhase = this.gamePlayPod.currentGameConfig.phase
      subscription = timer(numberRandom * 1000).subscribe((_) => {
         if (PodProvider.instance.gamePlayUIPod.currentGameplayUIState.value == GameplayUIState.GameResult) return

         if (this.tempCurrentLevel == currentPhase) {
            let cell = new ObstacleCellView(this.scene)

            cell.doInit(
               this.playerObject,
               this.bodyChecker,
               this.obstacleTriggerMove,
               xPosition,
               this.scene.cameras.main.height,
               obstacleType,
               obstacleMoveType
            )

            this.SpawnObstacleLane(subscription, xPosition, obstacleMoveType, isSpawnMoveObstacle)
         } else {
            subscription?.unsubscribe()
         }
      })
   }

   public SpawnCoin() {
      this.coinSubscription?.unsubscribe()

      let minTimeCoinTimeRand = this.gamePlayPod.currentGameConfig.minTimeCoinTimeRand
      let maxTimeCoinTimeRand = this.gamePlayPod.currentGameConfig.maxTimeCoinTimeRand

      let numberRandom = this.randomInt(minTimeCoinTimeRand, maxTimeCoinTimeRand)

      this.coinSubscription = timer(numberRandom * 1000).subscribe((_) => {
         let cell = new CoinCellView(this.scene)
         cell.doInit(
            this.playerObject,
            this.bodyChecker,
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height
         )

         this.SpawnCoin()
      })
   }

   randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
   }

   private randomEnum<T>(anEnum: T): T[keyof T] {
      const enumValues = Object.keys(anEnum)
         .map((n) => Number.parseInt(n))
         .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][]
      const randomIndex = Math.floor(Math.random() * enumValues.length)
      const randomEnumValue = enumValues[randomIndex]
      return randomEnumValue
   }

   public destroy(fromScene?: boolean): void {
      //console.log(this.timerObstacleLeftSubscription)
      this.coinSubscription?.unsubscribe()
      this.timerObstacleLeftSubscription?.unsubscribe()
      this.timerObstacleRightSubscription?.unsubscribe()
      this.phaseSubscription?.unsubscribe()
      super.destroy(fromScene)
   }
}
