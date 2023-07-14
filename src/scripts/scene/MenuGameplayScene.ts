import { UIUtil } from '../plugins/utils/UIUtil'
import { Button } from '../button/Button'
import { ResourceManager } from '../plugins/resource-loader/ResourceManager'
import { GamePlayScene } from './GamePlayScene'
import { GameObjects, Physics } from 'phaser'

export class MenuGameplayScene extends Phaser.Scene {
    private startButton: Button

    constructor() {
        super({
            key: 'MenuGameplay',
        })
    }

    private doInit(): void {
        this.startButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, 200, 100, '')
        this.startButton.setBackgroundButtonTextureWithAtlas('spritesPacker', 'button-bg.png')
        this.startButton.setNativeSize()

        this.startButton.onClick(() => {
            console.log('scene load to gameplay')
            this.scene.start('GamePlayScene', GamePlayScene)
        })

        this.add
            .image(this.cameras.main.centerX, this.cameras.main.centerY, 'spritesPacker', 'button-text.png')
            .setOrigin(0.5)

        // let object = {
        //     followTarget: this.imageTest,
        //     geom: circle,
        // } as Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
        // let test = this.imageTest.scene.add.particles('efx_special_coin_big')

        //emitter.startFollow(this.imageTest)
        // this.collectGameItemParticleEmitter = this.collectGameItemParticle.createEmitter(object)

        // this.collectGameItemParticleEmitter.on = true
    }

    preload() {
        console.log('preload')

        ResourceManager.instance.doInit(this)
        ResourceManager.instance.loadPackJson('assetLoad', `assets/assetLoad.json`).subscribe((_) => {
            this.doInit()
        })

        this.initWindowEvents()
    }

    create() {
        console.log('create')
        this.setGameCanvasSize()

        this.add
            .text(UIUtil.getCanvasWidth() / 2, UIUtil.getCanvasHeight() / 2 - 100, 'JUMP DOWN KING', { font: 'Arial' })
            .setOrigin(0.5)
            .setFontSize(50)
    }

    private initWindowEvents() {
        window.onresize = () => {
            window.location.reload()
        }
    }

    update(): void {
        //console.log("test")
        //console.log()
    }

    private setGameCanvasSize(): void {
        const w = UIUtil.getCanvasWidth()
        const h = UIUtil.getCanvasHeight()
        this.scale.setGameSize(w, h)
        this.scale.refresh()
        UIUtil.initialize(this.cameras.main.width, this.cameras.main.height)
        UIUtil.innerHeight = window.innerHeight
        UIUtil.parentWidth = this.scale.parentSize.width
        UIUtil.parentHeight = this.scale.parentSize.height
    }
}
