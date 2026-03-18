import Phaser from 'phaser';
import { GameStateManager } from '../managers/GameStateManager';
import { GridSystem } from '../systems/GridSystem';
import { Events } from '../constants/Events';

export class MainScene extends Phaser.Scene {
    private gridSystem!: GridSystem;
    private tileSprites: Phaser.GameObjects.Sprite[][] = [];
    private plantSprites: Phaser.GameObjects.Sprite[][] = [];
    private gridGroup!: Phaser.GameObjects.Group;

    private gameStateManager!: GameStateManager;
    private pulseTimer!: Phaser.Time.TimerEvent;

    private readonly GRID_SIZE = 4;
    private readonly TILE_WIDTH = 128;
    private readonly TILE_HEIGHT = 64;
    private readonly ORIGIN_X = 360; 
    private readonly ORIGIN_Y = 500; 
    private readonly PULSE_INTERVAL = 10000; 

    constructor() {
        super('MainScene');
    }

    create() {
        // Initialize Managers
        this.gameStateManager = new GameStateManager();
        this.registry.set('gameStateManager', this.gameStateManager);

        this.gridSystem = new GridSystem(this.GRID_SIZE);
        this.gridSystem.on(Events.GRID_UPDATED, () => this.updateVisuals());

        this.gridGroup = this.add.group();
        this.drawGrid();

        this.pulseTimer = this.time.addEvent({
            delay: this.PULSE_INTERVAL,
            callback: () => this.gridSystem.executePulse(),
            callbackScope: this,
            loop: true
        });

        this.updateVisuals();
    }

    update() {
        const progress = this.pulseTimer.getOverallProgress();
        this.events.emit(Events.PULSE_PROGRESS, progress);
    }

    private drawGrid() {
        for (let x = 0; x < this.GRID_SIZE; x++) {
            this.tileSprites[x] = [];
            this.plantSprites[x] = [];
            for (let y = 0; y < this.GRID_SIZE; y++) {
                const { sx, sy } = this.cartesianToIsometric(x, y);
                
                const tile = this.add.sprite(sx, sy, 'tile_ground');
                tile.setOrigin(0.5, 0); 
                
                if (tile.width > 0) {
                    const scale = this.TILE_WIDTH / tile.width;
                    tile.setScale(scale);
                    const shape = new Phaser.Geom.Polygon([
                        tile.width / 2, 0,
                        tile.width, tile.height / 2,
                        tile.width / 2, tile.height,
                        0, tile.height / 2
                    ]);
                    tile.setInteractive(shape, Phaser.Geom.Polygon.Contains);
                }

                tile.on('pointerdown', () => this.handleTileClick(x, y));
                this.tileSprites[x][y] = tile;
                
                const plant = this.add.sprite(sx, sy, 'plant_sprite');
                plant.setOrigin(0.5, 0); 
                if (plant.width > 0) {
                    plant.setScale(this.TILE_WIDTH / plant.width);
                }
                plant.setVisible(false);
                this.plantSprites[x][y] = plant;
                
                this.gridGroup.add(tile);
                this.gridGroup.add(plant);
            }
        }
    }

    private cartesianToIsometric(x: number, y: number) {
        const offsetX = x - (this.GRID_SIZE - 1) / 2;
        const offsetY = y - (this.GRID_SIZE - 1) / 2;
        const sx = this.ORIGIN_X + (offsetX - offsetY) * (this.TILE_WIDTH / 2);
        const sy = this.ORIGIN_Y + (offsetX + offsetY) * (this.TILE_HEIGHT / 2);
        return { sx, sy };
    }

    private handleTileClick(x: number, y: number) {
        const turnipCount = this.gameStateManager.getItemCount('turnip');
        const isAlive = this.gridSystem.isAlive(x, y);
        
        if (!isAlive && turnipCount > 0) {
            this.gridSystem.setCell(x, y, true);
            this.gameStateManager.removeItem('turnip', 1);
        } else if (isAlive) {
            this.gridSystem.setCell(x, y, false);
            this.gameStateManager.addItem('turnip', 1);
        }
    }

    private updateVisuals() {
        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < this.GRID_SIZE; y++) {
                if (this.plantSprites[x] && this.plantSprites[x][y]) {
                    this.plantSprites[x][y].setVisible(this.gridSystem.isAlive(x, y));
                }
            }
        }
    }

    public resetGame() {
        this.gameStateManager.reset();
        this.gridSystem.reset();
        this.pulseTimer.reset({
            delay: this.PULSE_INTERVAL,
            callback: () => this.gridSystem.executePulse(),
            callbackScope: this,
            loop: true
        });
    }
}
