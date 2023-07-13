import { Physics } from 'phaser'

export class testObject extends Physics.Arcade.Image {
    private speed: number = 400
    private isInit: boolean = false

    public doInit(colliderOutside: Physics.Arcade.Image): void {
        if (!this.isInit) {
            this.scene.physics.add.existing(this)
            this.setTexture('rick')
                .setScale(0.2)
                .setPosition(
                    this.scene.cameras.main.width,
                    this.scene.cameras.main.centerY,
                )
            this.setObjectProperties()
            this.setColliderEvent(colliderOutside)
            this.isInit = true
        }

        this.showObject()
        this.startMove()
    }

    public showObject(): void {
        this.setActive(true)
        this.setVisible(true)
    }

    public hideObject(): void {
        this.setActive(false)
        this.setVisible(false)
    }

    private setObjectProperties(): void {
        // @ts-ignore
        this.body.allowGravity = false
        this.setOrigin(0.5).setImmovable(false).setGravity(0)
    }

    private startMove(): void {
        this.setVelocityX(-this.speed)
    }

    private stopMove(): void {
        this.setVelocityX(0)
    }

    private setColliderEvent(colliderOutside: Physics.Arcade.Image): void {
        this.scene.physics.add.overlap(
            colliderOutside,
            this,
            this.onHitColliderOutside,
            null,
            this,
        )
    }

    private onHitColliderOutside(): void {
        this.stopMove()
        this.hideObject()
    }
}
