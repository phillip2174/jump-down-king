import Phaser from 'phaser'
import { MenuGameplayScene } from './scripts/scene/MenuGameplayScene'
import { UIUtil } from './scripts/plugins/utils/UIUtil'
import { GamePlayScene } from './scripts/scene/GamePlayScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    parent: 'app',
    backgroundColor: '#000000',
    width: UIUtil.getCanvasWidth() * window.devicePixelRatio,
    height: UIUtil.getCanvasHeight() * window.devicePixelRatio,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [MenuGameplayScene, GamePlayScene],
}

export default new Phaser.Game(config)
