import { GameObjects, Physics } from 'phaser'
import { GameConfig } from '../GameConfig'
import { PlayerObjectView } from '../player/PlayerObjectView'
import { Subscription } from 'rxjs'
import { GameplayPod } from '../pod/GameplayPod'
import { PodProvider } from '../pod/PodProvider'
import { ObstacleType } from './ObstacleType'
import { ObstacleMoveType } from './ObstacleMoveType'

export default class ObstacleCellView extends GameObjects.GameObject {
    private obstacle01: GameObjects.Image
    private player: PlayerObjectView

    private gameplayPod: GameplayPod
    private phaseSubscription: Subscription

    private obstacleType: ObstacleType
    private isHitObstacleTrigger: boolean = false
    private targetValueMove: number = 0
    private startMovePostion: number

    constructor(scene: Phaser.Scene) {
        super(scene, 'gameObject')
    }

    public doInit(
        playerObject: PlayerObjectView,
        objectChecker: GameObjects.GameObject,
        obstacleTriggerChecker: GameObjects.GameObject,
        xPosition: number,
        yPosition: number,
        obstacleType: ObstacleType,
        moveType: ObstacleMoveType
    ) {
        this.gameplayPod = PodProvider.instance.gamePlayPod

        this.obstacleType = obstacleType
        this.player = playerObject

        this.scene.events.addListener('update', this.onUpdate, this)
        //this.scene.events.removeListener('update', this.onUpdate, this)

        switch (moveType) {
            case ObstacleMoveType.LeftToRight:
                this.targetValueMove = this.scene.cameras.main.width + 25
                this.startMovePostion = -25
                break
            case ObstacleMoveType.RightToLeft:
                this.targetValueMove = -25
                this.startMovePostion = 25
                break
        }

        let randNumber = this.randomInt(1, 3)

        switch (this.obstacleType) {
            case ObstacleType.ObstacleStatic:
                this.obstacle01 = this.scene.add
                    .image(xPosition, yPosition, 'spritesPacker', 'meteorBrown_big' + randNumber + '.png')
                    .setDepth(4)
                    .setScale(1.2)
                this.scene.physics.add.existing(this.obstacle01)

                let bodyPhysics: Physics.Arcade.Body = this.obstacle01.body as Physics.Arcade.Body

                switch (randNumber) {
                    case 1:
                        bodyPhysics.setSize(100, 60, false)
                        bodyPhysics.setOffset(0, 10)
                        break
                    case 2:
                        bodyPhysics.setSize(110, 60, false)
                        bodyPhysics.setOffset(0, 20)
                        break
                    case 3:
                        if (moveType == ObstacleMoveType.LeftToRight) {
                            this.obstacle01.x = this.obstacle01.x + 15
                        } else {
                            this.obstacle01.x = this.obstacle01.x - 20
                        }

                        bodyPhysics.setSize(90, 60, false)
                        bodyPhysics.setOffset(0, 10)

                        break
                }

                this.scene.physics.add.overlap(this.obstacle01 as any, objectChecker, this.onHitChecker, null, this)

                break
            case ObstacleType.ObstacleDynamic:
                this.obstacle01 = this.scene.add
                    .image(xPosition, yPosition, 'spritesPacker', 'meteorGrey_big' + randNumber + '.png')
                    .setDepth(4)
                    .setScale(0.8)
                this.scene.physics.add.existing(this.obstacle01)

                this.scene.physics.add.overlap(
                    this.obstacle01 as any,
                    obstacleTriggerChecker,
                    this.onObstacleTriggerDynamic,
                    null,
                    this
                )

                this.scene.add.tween({
                    targets: this.obstacle01,
                    ease: 'cubic.inout',
                    yoyo: false,
                    repeat: 0,
                    duration: 400,
                    props: {
                        x: { from: this.obstacle01, to: xPosition - this.startMovePostion * 1.5 },
                    },
                })
                break
            case ObstacleType.ObstacleYoyo:
                //#
                this.obstacle01 = this.scene.add
                    .image(xPosition, yPosition, 'spritesPacker', 'ufoRed.png')
                    .setDepth(4)
                    .setScale(0.8)
                this.scene.physics.add.existing(this.obstacle01)

                this.scene.physics.add.overlap(this.obstacle01 as any, objectChecker, this.onHitChecker, null, this)

                this.scene.add.tween({
                    targets: this.obstacle01,
                    ease: 'Linear',
                    yoyo: true,
                    repeat: -1,
                    duration: 1600 - -this.gameplayPod.currentGameConfig.speed,
                    props: {
                        x: { from: this.obstacle01, to: this.targetValueMove },
                    },
                })

                break
            default:
                this.obstacle01 = this.scene.add
                    .image(xPosition, yPosition, 'spritesPacker', 'meteorBrown_big' + randNumber + '.png')
                    .setDepth(4)
                this.scene.physics.add.existing(this.obstacle01)

                this.scene.physics.add.overlap(this.obstacle01 as any, objectChecker, this.onHitChecker, null, this)
                break
        }

        this.scene.physics.add.overlap(this.obstacle01 as any, playerObject, this.onHitPlayer, null, this)

        this.phaseSubscription = this.gameplayPod.phase.subscribe((phase) => {
            if (this.isHitObstacleTrigger == false) {
                if (this.obstacleType == ObstacleType.ObstacleYoyo) {
                    this.obstacle01.body.velocity.x = 0
                    this.obstacle01.body.velocity.y = this.gameplayPod.currentGameConfig.speed / 2.5
                } else {
                    this.obstacle01.body.velocity.x = 0
                    this.obstacle01.body.velocity.y = this.gameplayPod.currentGameConfig.speed
                }
            }
        })
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    onUpdate() {
        console.log('update')
    }

    onHitChecker() {
        this.destroy()
    }

    onHitPlayer() {
        this.player.decreaseHp()
        console.log('Hit obstacle')
    }

    onObstacleTriggerDynamic() {
        if (this.isHitObstacleTrigger != true) {
            this.isHitObstacleTrigger = true
            // this.obstacle01.body.velocity.y = 0
            this.scene.add.tween({
                targets: this.obstacle01,
                ease: 'Linear',
                yoyo: false,
                repeat: 0,
                duration: 1300 - -this.gameplayPod.currentGameConfig.speed / 2,
                props: {
                    x: { from: this.obstacle01, to: this.targetValueMove },
                },
                onComplete: () => {
                    this.destroy()
                },
            })
        }
    }

    destroy(formScene?: boolean) {
        if (!formScene) {
            this.obstacle01.body.velocity.y = 0
            this.scene.events.removeListener('update', this.onUpdate, this)
            this.obstacle01?.destroy()
        }

        this.phaseSubscription?.unsubscribe()

        super.destroy(formScene)
    }
}
