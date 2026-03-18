import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('tile_ground', 'tile_ground128.png');
        this.load.image('plant_sprite', 'tile_turnip128.png');
        this.load.image('ui_turnip', 'icon_turnip80.png');
        this.load.image('ui_gold', 'icon_coin.png');
    }

    create() {
        this.scene.start('MainScene');
        this.scene.launch('UIScene');
    }
}
