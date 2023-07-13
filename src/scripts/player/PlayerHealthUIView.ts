import { GameObjects, Physics, Scene } from 'phaser'
import { PlayerObjectPod } from './PlayerObjectPod'
import { UIUtil } from '../plugins/utils/UIUtil'

export class PlayerHealthUIView extends GameObjects.GameObject {
    private playerPod: PlayerObjectPod
    private healthIconGroup: Physics.Arcade.Group
    private prevStarIcon: any

    constructor(scene: Scene, type: string, playerObjectPod: PlayerObjectPod) {
        super(scene, type)
        this.playerPod = playerObjectPod
    }

    public hideHealthIcon(): void {
        let icon: Physics.Arcade.Sprite = this.healthIconGroup.getLast(true)
        icon.setActive(false)
        icon.setVisible(false)
    }

    public doInit(): void {
        this.healthIconGroup = this.scene.physics.add.group()
        this.healthIconGroup.createMultiple({
            key: 'spritesPacker',
            frame: 'star.png',
            quantity: this.playerPod.playerHp.getValue(),
            active: true,
            visible: true,
        })

        this.healthIconGroup.getChildren().forEach((icon) => {
            let star = icon as any
            if (this.prevStarIcon == null) star.x = UIUtil.getCanvasWidth() / 2 - 60
            else star.x = this.prevStarIcon.x + 60

            this.prevStarIcon = star
            star.setScale(0.5)
            star.y = 110
        })
    }
}
