import Phaser from 'phaser';
import { ISO_TILE_WIDTH, ISO_TILE_HEIGHT, IsoUtils } from '../../utils/IsoUtils';
import { GridSystem } from '../../systems/GridSystem';
import { PlantFactory } from '../../systems/plants/PlantFactory';
import { LAYOUT } from '../../constants/Layout';

export class GridRenderer extends Phaser.Events.EventEmitter {
    private scene: Phaser.Scene;
    private tileSprites: Phaser.GameObjects.Sprite[][] = [];
    private plantSprites: Phaser.GameObjects.Sprite[][] = [];
    private gridGroup: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene) {
        super();
        this.scene = scene;
        this.gridGroup = scene.add.group();
    }

    public drawGrid(currentSize: number, animateNew: boolean = false, oldSize: number = 0) {
        // Clear existing sprites
        this.tileSprites.forEach(row => row.forEach(s => s?.destroy()));
        this.plantSprites.forEach(row => row.forEach(s => s?.destroy()));
        this.tileSprites = [];
        this.plantSprites = [];

        for (let x = 0; x < currentSize; x++) {
            this.tileSprites[x] = [];
            this.plantSprites[x] = [];
            for (let y = 0; y < currentSize; y++) {
                const { sx, sy } = IsoUtils.cartesianToIsometric(x, y, currentSize, LAYOUT.GRID_ORIGIN_X, LAYOUT.GRID_ORIGIN_Y);
                
                const tile = this.scene.add.sprite(sx, sy, 'tile_ground');
                tile.setOrigin(0.5, 0); 
                
                const shape = new Phaser.Geom.Polygon([
                    ISO_TILE_WIDTH / 2, 0,
                    ISO_TILE_WIDTH, ISO_TILE_HEIGHT / 2,
                    ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT,
                    0, ISO_TILE_HEIGHT / 2
                ]);
                tile.setInteractive({ hitArea: shape, hitAreaCallback: Phaser.Geom.Polygon.Contains, useHandCursor: true });

                tile.on('pointerdown', () => this.emit('tile-click', x, y));
                this.tileSprites[x][y] = tile;
                
                const plant = this.scene.add.sprite(sx, sy, 'tile_turnip');
                plant.setOrigin(0.5, 0); 
                plant.setVisible(false);
                this.plantSprites[x][y] = plant;
                
                this.gridGroup.add(tile);
                this.gridGroup.add(plant);

                if (animateNew && (x >= oldSize || y >= oldSize)) {
                    tile.setScale(0);
                    this.scene.tweens.add({
                        targets: tile,
                        scale: 1,
                        duration: 500,
                        ease: 'Back.easeOut',
                        delay: (x + y) * 50
                    });
                }
            }
        }
    }

    public updateVisuals(gridSystem: GridSystem) {
        const currentSize = gridSystem.currentSize;
        if (!this.plantSprites || this.plantSprites.length < currentSize) return;

        for (let x = 0; x < currentSize; x++) {
            if (!this.plantSprites[x] || this.plantSprites[x].length < currentSize) continue;
            for (let y = 0; y < currentSize; y++) {
                const plantId = gridSystem.getCell(x, y);
                const sprite = this.plantSprites[x][y];
                if (!sprite) continue;
                
                if (plantId) {
                    const plantType = PlantFactory.getPlant(plantId);
                    if (plantType) {
                        sprite.setTexture(plantType.asset);
                        sprite.setVisible(true);
                    }
                } else {
                    sprite.setVisible(false);
                }
            }
        }
    }

    public clear() {
        this.tileSprites.forEach(row => row.forEach(s => s?.destroy()));
        this.plantSprites.forEach(row => row.forEach(s => s?.destroy()));
        this.tileSprites = [];
        this.plantSprites = [];
        this.gridGroup.clear(true, true);
    }
}
