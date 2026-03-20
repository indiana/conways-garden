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
        
        // Navigation Buttons
        this.load.image('btn_garden', 'button_garden.png');
        this.load.image('btn_garden_active', 'button_garden_active.png');
        this.load.image('btn_trade', 'button_trade.png');
        this.load.image('btn_trade_active', 'button_trade_active.png');
        this.load.image('btn_achievements', 'button_achievements.png');
        this.load.image('btn_achievements_active', 'button_achievements_active.png');
        this.load.image('btn_atlas', 'button_atlas.png');
        this.load.image('btn_atlas_active', 'button_atlas_active.png');

        // Achievement Badges
        this.load.image('badge_uncollected', 'badge_achievement_grayed40.png');
        this.load.image('badge_collected', 'badge_achievement_earned40.png');
    }

    create() {
        this.scene.start('MainScene');
        this.scene.launch('UIScene');
    }
}
