import { Cameras, GameObjects, Scene } from 'phaser'
import { Button } from '../button/Button'
import { MenuGameplayScene } from '../scene/MenuGameplayScene'
import { GamePlayScene } from '../scene/GamePlayScene'
import { PodProvider } from '../pod/PodProvider'
import { GameplayUIState } from './GameplayUIState'

export class GameResultView extends GameObjects.GameObject {
    private gameResultPanel: GameObjects.Rectangle
    private gameOverText: GameObjects.Text
    private playerScoreText: GameObjects.Text
    private backText: GameObjects.Text
    private restartText: GameObjects.Text

    private backButton: Button
    private restartButton: Button

    private mainCamera: Cameras.Scene2D.Camera
    private scaleRatio: number
    constructor(scene: Scene, type: string) {
        super(scene, type)
    }

    private setupGameResultUIPanel() {
        this.scaleRatio = window.devicePixelRatio / 4
        this.gameResultPanel = this.scene.add
            .rectangle(
                this.mainCamera.centerX,
                this.mainCamera.centerY,
                800 * this.scaleRatio,
                850 * this.scaleRatio,
                0xffffff,
                1
            )
            .setDepth(6)

        this.setupUITexts()
    }

    private setupUITexts() {
        this.gameOverText = this.scene.add
            .text(this.gameResultPanel.x, this.gameResultPanel.y - 300 * this.scaleRatio, 'GAME OVER!!', {
                font: 'Arial',
                fontStyle: 'bold',
            })
            .setFontSize(80 * this.scaleRatio)
            .setColor('black')
            .setOrigin(0.5)
            .setDepth(6)

        this.playerScoreText = this.scene.add
            .text(this.gameResultPanel.x, this.gameResultPanel.y - 125 * this.scaleRatio, 'DISTANCE TRAVELED: ', {
                font: 'Arial',
            })
            .setFontSize(45 * this.scaleRatio)
            .setColor('black')
            .setOrigin(0.5)
            .setDepth(6)
    }

    private setupButtons(): void {
        this.backButton = new Button(
            this.scene,
            this.gameResultPanel.x - 200 * this.scaleRatio,
            this.gameResultPanel.y + 300 * this.scaleRatio,
            100 * this.scaleRatio,
            50 * this.scaleRatio,
            ''
        ).setDepth(6)
        this.backButton.setBackgroundButtonTextureWithAtlas('spritesPacker', 'button-bg.png')
        this.backButton.setButtonSize(200 * this.scaleRatio, 100 * this.scaleRatio)

        this.backText = this.scene.add
            .text(this.backButton.x, this.backButton.y, 'Back', { font: 'Arial', fontStyle: 'strong' })
            .setFontSize(45 * this.scaleRatio)
            .setColor('#ffe375')
            .setOrigin(0.5)
            .setDepth(6)

        this.backButton.onClick(() => {
            PodProvider.instance.gamePlayUIPod.changeGameplayUIState(GameplayUIState.Gameplay)
            this.scene.scene.start('MenuGameplay', MenuGameplayScene)
        })

        this.restartButton = new Button(
            this.scene,
            this.gameResultPanel.x + 200 * this.scaleRatio,
            this.gameResultPanel.y + 300 * this.scaleRatio,
            100 * this.scaleRatio,
            50 * this.scaleRatio,
            ''
        ).setDepth(6)
        this.restartButton.setBackgroundButtonTextureWithAtlas('spritesPacker', 'button-bg.png')
        this.restartButton.setButtonSize(200 * this.scaleRatio, 100 * this.scaleRatio)

        this.restartText = this.scene.add
            .text(this.restartButton.x, this.restartButton.y, 'Again', { font: 'Arial', fontStyle: 'strong' })
            .setFontSize(40 * this.scaleRatio)
            .setColor('#ffe375')
            .setOrigin(0.5)
            .setDepth(6)

        this.restartButton.onClick(() => {
            PodProvider.instance.gamePlayUIPod.changeGameplayUIState(GameplayUIState.Gameplay)
            this.scene.scene.restart(GamePlayScene)
        })
    }

    public showHideResult(isShowResult: boolean, playerScore: number = 0): void {
        this.gameResultPanel.setVisible(isShowResult)
        this.gameOverText.setVisible(isShowResult)
        this.playerScoreText.setActive(isShowResult)
        this.playerScoreText.setVisible(isShowResult)
        this.playerScoreText.setText('SCORE: ' + playerScore.toString())
        this.backButton.setActive(isShowResult)
        this.backButton.setVisible(isShowResult)
        this.restartButton.setActive(isShowResult)
        this.restartButton.setVisible(isShowResult)
        this.backText.setVisible(isShowResult)
        this.restartText.setVisible(isShowResult)
    }

    public doInit(): void {
        this.scene.add.existing(this)
        this.mainCamera = this.scene.cameras.main
        this.setupGameResultUIPanel()
        this.setupButtons()
    }
}
