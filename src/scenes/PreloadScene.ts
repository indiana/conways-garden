import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('tile_ground_raw', 'tile_ground.png');
        this.load.image('tile_turnip_raw', 'tile_turnip.png');
        this.load.image('icon_turnip_raw', 'icon_turnip.png');
    }

    create() {
        this.processWhiteToAlpha('tile_ground_raw', 'tile_ground');
        this.processWhiteToAlpha('tile_turnip_raw', 'plant_sprite'); 
        this.processWhiteToAlpha('icon_turnip_raw', 'ui_turnip');     

        this.scene.start('MainScene');
        this.scene.launch('UIScene');
    }

    private processWhiteToAlpha(sourceKey: string, targetKey: string) {
        if (!this.textures.exists(sourceKey)) return;

        const source = this.textures.get(sourceKey).getSourceImage() as HTMLImageElement | HTMLCanvasElement;
        const canvas = document.createElement('canvas');
        canvas.width = source.width;
        canvas.height = source.height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(source, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            if (brightness > 240) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        this.textures.addCanvas(targetKey, canvas);
    }
}
