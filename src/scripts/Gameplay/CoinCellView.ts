import { GameObjects, Physics, Sound } from 'phaser'
import { PlayerObjectView } from '../player/PlayerObjectView'
import { GameplayPod } from '../pod/GameplayPod'
import { PodProvider } from '../pod/PodProvider'
import { Subscription } from 'rxjs'
import { GameplayUIState } from './GameplayUIState'

export default class CoinCellView extends GameObjects.GameObject {
    private coinObject: Physics.Arcade.Sprite

    private phaseSubscription: Subscription

    private gameplayPod: GameplayPod

    private player: PlayerObjectView

    private coinPickupSoundPlayer: Sound.BaseSound

    private speed: number = 0

    constructor(scene: Phaser.Scene) {
        super(scene, 'gameObject')
    }

    private setupAnimation(): void {
        this.scene.anims.create({
            key: 'rotate',
            frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            repeat: -1,
            frameRate: 10,
        })
    }

    public doInit(
        playerObject: PlayerObjectView,
        objectChecker: GameObjects.GameObject,
        xPosition: number,
        yPosition: number
    ) {
        this.gameplayPod = PodProvider.instance.gamePlayPod
        this.player = playerObject

        this.coinObject = this.scene.physics.add.sprite(xPosition, yPosition, 'coin', 0).setScale(2)

        this.scene.physics.add.existing(this.coinObject)
        this.coinPickupSoundPlayer = this.scene.sound.add('coin_pickup', { volume: 0.5 })
        this.setupAnimation()
        this.coinObject.play('rotate')

        //  //@ts-ignore
        //  this.obstacle01.body.setImmovable(true)

        this.scene.physics.add.overlap(this.coinObject as any, objectChecker, this.onHitChecker, null, this)

        this.scene.physics.add.overlap(this.coinObject as any, this.player, this.onHitPlayer, null, this)

        this.phaseSubscription = this.gameplayPod.phase.subscribe((phase) => {
            this.coinObject.body.velocity.x = 0
            this.coinObject.body.velocity.y = this.gameplayPod.currentGameConfig.speed

            if (this.speed == 0) {
                this.coinObject.body.velocity.y = this.gameplayPod.currentGameConfig.speed
                this.speed = this.gameplayPod.currentGameConfig.speed
            } else {
                this.scene.add.tween({
                    targets: this.coinObject.body.velocity,
                    ease: 'Quart.easeOut',
                    yoyo: false,
                    repeat: 0,
                    duration: 1800,
                    props: {
                        y: { from: this.coinObject.body.velocity.y, to: this.gameplayPod.currentGameConfig.speed },
                    },
                })
            }
        })
    }

    onHitChecker() {
        this.destroy()
    }

    onHitPlayer() {
        console.log('hit coin')
        if (PodProvider.instance.gamePlayUIPod.currentGameplayUIState.value == GameplayUIState.GameResult) return

        console.log('hit coin')
        const particles01 = this.scene.add.particles('efx_sparkle_special_2')
        const particles01Emitter = particles01.createEmitter({
            alpha: { start: 1, end: 0.5, ease: 'Expo.linear' },
            lifespan: { min: 200, max: 400 },
            speed: { min: 500, max: 800 },
            // gravityY: 1000,
            frequency: 1000,
            // maxParticles: 5000,
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
        })

        const particles02 = this.scene.add.particles('coin')
        const particles02Emitter = particles02.createEmitter({
            alpha: { start: 1, end: 0.5, ease: 'Expo.linear' },
            lifespan: { min: 200, max: 400 },
            speed: { min: 500, max: 800 },
            // gravityY: 1000,
            frequency: 1000,
            // maxParticles: 5000,
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
        })

        particles01Emitter.stop()
        particles02Emitter.stop()

        particles01Emitter.explode(3, this.coinObject.x, this.coinObject.y)
        particles02Emitter.explode(6, this.coinObject.x, this.coinObject.y)

        this.coinPickupSoundPlayer.play()
        this.player.addPlayerScore(100)
        this.destroy()
    }

    destroy(fromScene?: boolean) {
        if (!fromScene) {
            this.coinObject.body.velocity.y = 0
            this.coinObject?.destroy()
        }
        this.phaseSubscription?.unsubscribe()
        super.destroy(fromScene)
    }
}
