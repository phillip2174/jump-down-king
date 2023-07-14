import { GameObjects, Physics } from 'phaser'
import { GameConfig } from '../GameConfig'
import { PlayerObjectView } from '../player/PlayerObjectView'
import { Subscription } from 'rxjs'
import { GameplayPod } from '../pod/GameplayPod'
import { PodProvider } from '../pod/PodProvider'
import { ObstacleType } from './ObstacleType'
import { ObstacleMoveType } from './ObstacleMoveType'
import { IPoolObject } from '../plugins/pool/IPoolObject'

export default class ObstacleCellView extends Physics.Arcade.Image implements IPoolObject {
    private obstacle01: GameObjects.Image
    private player: PlayerObjectView

    private gameplayPod: GameplayPod
    private phaseSubscription: Subscription

    private obstacleType: ObstacleType
    private isHitObstacleTrigger: boolean = false
    private targetValueMove: number = 0
    private startMovePostion: number

    private objectChecker: GameObjects.GameObject
    private obstacleTriggerChecker: GameObjects.GameObject
    private yoyoTween: Phaser.Tweens.Tween

    private isObjectHide: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, '')
    }
    public onCreate(
        playerObject: PlayerObjectView,
        objectChecker: GameObjects.GameObject,
        obstacleTriggerChecker: GameObjects.GameObject
    ) {
        this.gameplayPod = PodProvider.instance.gamePlayPod

        this.player = playerObject
        this.objectChecker = objectChecker
        this.obstacleTriggerChecker = obstacleTriggerChecker

        this.scene.physics.add.existing(this)

        this.scene.physics.add.overlap(this as any, playerObject, this.onHitPlayer, null, this)
        this.scene.physics.add.overlap(this as any, objectChecker, this.onHitChecker, null, this)
        this.scene.physics.add.overlap(this as any, obstacleTriggerChecker, this.onObstacleTriggerDynamic, null, this)

        this.setDepth(5)
        this.setVisible(false)
        this.setActive(false)
    }

    public init(xPosition: number, yPosition: number, obstacleType: ObstacleType, moveType: ObstacleMoveType) {
        this.setVisible(true)
        this.setActive(true)
        this.isObjectHide = false
        this.obstacleType = obstacleType
        this.isHitObstacleTrigger = false

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

        this.setPosition(xPosition, yPosition)
        switch (this.obstacleType) {
            case ObstacleType.ObstacleStatic:
                this.setTexture('spritesPacker', 'meteorBrown_big' + randNumber + '.png')
                this.setScale(1.2)

                switch (randNumber) {
                    case 1:
                        this.body.setSize(100, 60, false)
                        this.body.setOffset(0, 10)
                        break
                    case 2:
                        this.body.setSize(110, 60, false)
                        this.body.setOffset(0, 20)
                        break
                    case 3:
                        if (moveType == ObstacleMoveType.LeftToRight) {
                            this.x = this.x + 15
                        } else {
                            this.x = this.x - 20
                        }

                        this.body.setSize(80, 60, false)
                        this.body.setOffset(0, 10)

                        break
                }
                break
            case ObstacleType.ObstacleDynamic:
                this.setTexture('spritesPacker', 'meteorGrey_big' + randNumber + '.png')
                this.setScale(0.8)

                switch (randNumber) {
                    case 1:
                        this.body.setSize(100, 60, false)
                        this.body.setOffset(0, 10)
                        break
                    case 2:
                        this.body.setSize(90, 60, false)
                        this.body.setOffset(10, 20)
                        break
                    case 3:
                        this.body.setSize(70, 60, false)
                        this.body.setOffset(5, 10)
                        break
                }

                this.scene.add.tween({
                    targets: this,
                    ease: 'cubic.inout',
                    yoyo: false,
                    repeat: 0,
                    duration: 400,
                    props: {
                        x: { from: this.x, to: xPosition - this.startMovePostion * 1.5 },
                    },
                })

                break
            case ObstacleType.ObstacleYoyo:
                this.setTexture('spritesPacker', 'ufoRed.png')
                this.setScale(0.8)
                this.setSize(70, 70)
                this.setOffset(10, 10)

                this.yoyoTween = this.scene.add.tween({
                    targets: this,
                    ease: 'Linear',
                    yoyo: true,
                    repeat: -1,
                    duration: 1600 - -this.gameplayPod.currentGameConfig.speed,
                    props: {
                        x: { from: this.x, to: this.targetValueMove },
                    },
                })
                break
        }

        this.phaseSubscription?.unsubscribe()
        this.phaseSubscription = this.gameplayPod.phase.subscribe((phase) => {
            if (this.isHitObstacleTrigger == false) {
                if (this.obstacleType == ObstacleType.ObstacleYoyo) {
                    this.body.velocity.x = 0
                    this.body.velocity.y = this.gameplayPod.currentGameConfig.speed / 2.5
                } else {
                    this.body.velocity.x = 0
                    this.body.velocity.y = this.gameplayPod.currentGameConfig.speed
                }
            }
        })
    }

    hideObject(): void {
        this.isObjectHide = true
        this.phaseSubscription?.unsubscribe()
        this.setPosition(this.scene.cameras.main.centerX, this.scene.cameras.main.height)
        this.setVisible(false)
        this.setActive(false)
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    onUpdate() {
        console.log('update')
    }

    onHitChecker() {
        if (!this.isObjectHide) {
            this.yoyoTween?.remove()
            this.body.velocity.x = 0
            this.body.velocity.y = 0
            this.hideObject()
        }
        //this.destroy()
    }

    onHitPlayer() {
        if (!this.isObjectHide) {
            this.player.decreaseHp()
        }
        console.log('Hit obstacle')
    }

    onObstacleHit() {
        console.log('Hit self obstacle')
    }

    onObstacleTriggerDynamic() {
        if (this.obstacleType == ObstacleType.ObstacleDynamic) {
            if (this.isHitObstacleTrigger != true) {
                this.isHitObstacleTrigger = true
                // this.obstacle01.body.velocity.y = 0
                this.scene.add.tween({
                    targets: this,
                    ease: 'Linear',
                    yoyo: false,
                    repeat: 0,
                    duration: 1300 - -this.gameplayPod.currentGameConfig.speed / 2,
                    props: {
                        x: { from: this, to: this.targetValueMove },
                    },
                    onComplete: () => {
                        this.onHitChecker()
                    },
                })
            }
        }
    }

    destroy(formScene?: boolean) {
        if (!formScene) {
            // this.obstacle01.body.velocity.y = 0
            this.scene.events.removeListener('update', this.onUpdate, this)
            //this.obstacle01?.destroy()
        }

        this.phaseSubscription?.unsubscribe()

        super.destroy(formScene)
    }
}
