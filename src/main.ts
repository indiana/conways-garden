import Phaser from 'phaser';
import './style.css';
import { PreloadScene } from './scenes/PreloadScene';
import { MainScene } from './scenes/MainScene';
import { UIScene } from './scenes/UIScene';
import { TradeScene } from './scenes/TradeScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    parent: 'game-container',
    backgroundColor: '#2d3436',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [PreloadScene, MainScene, UIScene, TradeScene],
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    render: {
        pixelArt: false,
        antialias: true
    }
};

new Phaser.Game(config);
