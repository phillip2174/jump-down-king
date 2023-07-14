import { Physics, Scene, Sound } from 'phaser'
import { PlayerObjectPod } from './PlayerObjectPod'
import { UIUtil } from '../plugins/utils/UIUtil'
import { PlayerHealthUIView } from './PlayerHealthUIView'
import { PodProvider } from '../pod/PodProvider'
import { GameplayUIState } from '../Gameplay/GameplayUIState'
import { Pod } from '../plugins/objects/Pod'
import { Subscription } from 'rxjs'

export class PlayerObjectView extends Physics.Arcade.Sprite {
   private static readonly RADIAN_PI: number = 3.14159265359
   private playerMoveDuration: number
   private playerObjectPod: PlayerObjectPod
   private playerHealthUIView: PlayerHealthUIView
   private isTweening: boolean = false
   private isFirstInit: boolean = false
   private isCanDamage: boolean = true
   private isDead: boolean = false
   private playerOnHitSoundPlayer: Sound.BaseSound
   private playerChangeSideSoundPlayer: Sound.BaseSound
   private playerOnDeadSoundPlayer: Sound.BaseSound
   private gamePhaseSubscription: Subscription = new Subscription()

   constructor(scene: Scene, posX: number, posY: number, texture: string, frame: string | number) {
      super(scene, posX, posY, texture, frame)
   }

   private setupAnimations(): void {
      this.anims.create({
         key: 'walk',
         frames: this.anims.generateFrameNumbers('nyan_cat', {
            start: 0,
            end: 5,
         }),
         frameRate: 15,
         repeat: -1,
      })
   }

   private setupSubscribes(): void {
      this.gamePhaseSubscription = PodProvider.instance.gamePlayPod.phase.subscribe((currPhase) => {
         switch (currPhase) {
            case 1:
               this.playerMoveDuration = 800
               this.play('walk')
               break
            case 2:
               this.playerMoveDuration = 600
               this.anims.msPerFrame = 50
               break
            case 3:
               this.playerMoveDuration = 400
               this.anims.msPerFrame = 40
               break
         }
      })

      this.playerObjectPod.isOnLeftSide.subscribe((isLeftSide) => {
         if (this.isFirstInit) return
         switch (isLeftSide) {
            case true:
               this.moveToLeft()
               break
            case false:
               this.moveToRight()
               break
         }
      })

      this.playerObjectPod.playerHp.subscribe((hp) => {
         if (this.isFirstInit) return
         this.getDamaged(hp)
      })

      this.isFirstInit = false
   }

   private moveToLeft() {
      this.scene.add.tween({
         targets: this,
         ease: 'Linear',
         yoyo: false,
         repeat: 0,
         duration: this.playerMoveDuration,
         props: {
            rotation: {
               from: this.rotation,
               to: -this.rotation - 3.1415,
            },
            x: { from: this.x, to: 109 },
         },
         onComplete: () => {
            this.setFlipY(false)
            this.isTweening = false
         },
      })
   }

   private moveToRight() {
      this.scene.add.tween({
         targets: this,
         ease: 'Linear',
         yoyo: false,
         repeat: 0,
         duration: this.playerMoveDuration,
         props: {
            rotation: {
               from: this.rotation,
               to: -this.rotation - 3.1415,
            },
            x: { from: this.x, to: this.scene.cameras.main.width - 109 },
         },
         onComplete: () => {
            this.setFlipY(true)
            this.isTweening = false
         },
      })
   }

   private getDamaged(hp: number): void {
      this.isCanDamage = false
      this.playerOnHitSoundPlayer.play()
      let playerHitTween = this.scene.add.tween({
         targets: this,
         duration: 500,
         alpha: { from: 1, to: 0 },
         ease: 'Sine.InOut',
         repeat: 1,
         yoyo: true,
         onComplete: () => {
            this.isCanDamage = true
            this.scene.tweens.remove(playerHitTween)
         },
      })

      if (hp <= 0) {
         PodProvider.instance.gamePlayUIPod.changeGameplayUIState(GameplayUIState.GameResult)
         this.isDead = true
         this.playerOnDeadSoundPlayer.play()
         this.setActive(false)
         this.scene.add.tween({
            targets: this,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
            props: {
               x: { from: this.x, to: UIUtil.getCanvasWidth() / 2 },
            },
            onComplete: () => {
               this.scene.add.tween({
                  targets: this,
                  duration: 1000,
                  ease: 'Linear',
                  repeat: 0,
                  yoyo: false,
                  props: {
                     y: { from: this.y, to: -10 },
                  },
                  onComplete: () => {
                     this.anims.stop()
                     this.destroy(true)
                  },
               })
            },
         })
         this.disposeAll()
      }

      this.playerHealthUIView.hideHealthIcon()
   }

   private disposeAll(): void {
      this.playerObjectPod.isOnLeftSide?.unsubscribe()
      this.playerObjectPod.playerHp?.unsubscribe()
      this.gamePhaseSubscription?.unsubscribe()
      this.scene.input.removeAllListeners()
   }

   public doInit() {
      this.playerObjectPod = new PlayerObjectPod()
      this.setScale(1.5)
      this.isFirstInit = true
      this.scene.add.existing(this)
      this.scene.physics.add.existing(this)

      let bodyPhysics: Physics.Arcade.Body = this.body as Physics.Arcade.Body
      bodyPhysics.setSize(40, 45, false)
      bodyPhysics.setOffset(10, 3)

      this.playerOnHitSoundPlayer = this.scene.sound.add('cat_meow')
      this.playerChangeSideSoundPlayer = this.scene.sound.add('change_side', { volume: 1 })
      this.playerOnDeadSoundPlayer = this.scene.sound.add('game_over')

      this.setRotation(PlayerObjectView.RADIAN_PI / 2)
      this.setupAnimations()
      this.setupSubscribes()

      this.playerHealthUIView = new PlayerHealthUIView(this.scene, 'gameObject', this.playerObjectPod)
      this.playerHealthUIView.doInit()

      this.scene.input.on('pointerdown', () => {
         if (this.isTweening) return
         this.playerChangeSideSoundPlayer.play()
         this.isTweening = true
         switch (this.playerObjectPod.isOnLeftSide.getValue()) {
            case true:
               this.playerObjectPod.changeSide(false)
               bodyPhysics.setOffset(20, 3)
               break
            case false:
               this.playerObjectPod.changeSide(true)
               bodyPhysics.setOffset(10, 3)
               break
         }
      })
   }

   public addPlayerScore(addRate: number): void {
      this.playerObjectPod.score += addRate
   }

   public getPlayerScore(): number {
      return this.playerObjectPod.getPlayerScore()
   }

   public decreaseHp(): void {
      if (this.isCanDamage) {
         this.playerObjectPod.decreaseHP()
         console.log('Player Is Damaged')
      }
   }

   public update(): void {
      if (this.isDead) this.rotation += 0.1
      else this.playerObjectPod.increasePlayerScore()
   }
}
