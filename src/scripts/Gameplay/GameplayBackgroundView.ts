import { GameObjects } from 'phaser'

export default class GameplayBackgroundView extends GameObjects.GameObject {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private cameraObjectFollow: GameObjects.Image

    private backgrounds: { ratioY: number; sprite: GameObjects.TileSprite }[] = []

    private velocityX: number = 10
    private velocityY: number = 10

    constructor(scene: Phaser.Scene) {
        super(scene, 'gameObject')
    }

    public doInit() {
        console.log('Init Gameplay Background View')

        this.cursors = this.scene.input.keyboard.createCursorKeys()

        //   this.cameraObjectFollow = this.scene.add
        //      .image(
        //         this.scene.cameras.main.centerX,
        //         this.scene.cameras.main.centerY,
        //         "ship"
        //      )
        //      .setOrigin(0.5)
        //      .setScale(3)
        //      .setFlipY(true)
        //      .setDepth(3);

        //this.physics.add.existing(this.cameraObjectFollow);

        //this.cameras.main.startFollow(this.cameraObjectFollow, true ,0.1 , 0.1);
        //this.cameras.main.setFollowOffset(0, 145)

        this.backgrounds.push({
            ratioY: 100,
            sprite: this.scene.add
                .tileSprite(
                    this.scene.cameras.main.centerX,
                    this.scene.cameras.main.centerY,
                    this.scene.cameras.main.width,
                    this.scene.cameras.main.height,
                    'spritesPacker',
                    'bg_01.png'
                )
                .setOrigin(0.5)
                .setScrollFactor(0, 0),
        })

        this.backgrounds.push({
            ratioY: 300,
            sprite: this.scene.add
                .tileSprite(
                    this.scene.cameras.main.width - 30,
                    this.scene.cameras.main.centerY,
                    86,
                    this.scene.cameras.main.height,
                    'spritesPacker',
                    'rainbow-pillar.png'
                )
                .setOrigin(0.5)
                .setScrollFactor(0, 0)
                .setDepth(2)
                .setScale(1)
                .setFlipX(true),
        })

        this.backgrounds.push({
            ratioY: 300,
            sprite: this.scene.add
                .tileSprite(
                    30,
                    this.scene.cameras.main.centerY,
                    86,
                    this.scene.cameras.main.height,
                    'spritesPacker',
                    'rainbow-pillar.png'
                )
                .setOrigin(0.5)
                .setScrollFactor(0, 0)
                .setDepth(2)
                .setScale(1),
        })

        //  this.tileSpriteBackground =
        //this.cameras.main.stopFollow
    }

    public update(): void {
        for (let i = 0; i < this.backgrounds.length; ++i) {
            const bg = this.backgrounds[i]

            bg.sprite.tilePositionY = (this.scene.game.getTime() / 1000) * bg.ratioY
        }

        //this.tileSpriteBackground.tilePositionY = this.cameras.main.scrollY * 1

        //this.speedValue += 0.01
        //this.cameras.main.y += 10 * this.game.getTime()/1000
        //this.cameraObjectFollow.y += 10 * this.game.getTime()/1000
        //console.log(this.game.getTime()/1000);

        //   if (this.cursors.left.isDown) {
        //      this.velocityX = -10;
        //   } else if (this.cursors.right.isDown) {
        //      this.velocityX = 10;
        //   } else {
        //      this.velocityX = 0;
        //   }

        //   if (this.cursors.up.isDown) {
        //      this.velocityY = -10;
        //   } else if (this.cursors.down.isDown) {
        //      this.velocityY = 10;
        //   } else {
        //      this.velocityY = 0;
        //   }

        //   this.cameraObjectFollow.x += this.velocityX;
        //   this.cameraObjectFollow.y += this.velocityY;
    }
}
