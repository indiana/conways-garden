import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('tile_ground', 'tile_ground128.png');
        // this.load.image('plant_sprite', 'tile_turnip128.png'); // Deprecated
        this.load.image('tile_turnip', 'tile_turnip128.png');
        this.load.image('tile_grass', 'tile_grass128.png');
        
        this.load.image('ui_turnip', 'icon_turnip80.png');
        this.load.image('ui_grass', 'icon_grass80.png');
        this.load.image('ui_gold', 'icon_coin.png');
    }

    create() {
        this.scene.start('MainScene');
        this.scene.launch('UIScene');
    }
}
