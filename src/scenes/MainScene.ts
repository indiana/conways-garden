import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
    private grid: boolean[][] = [];
    private tileSprites: Phaser.GameObjects.Sprite[][] = [];
    private plantSprites: Phaser.GameObjects.Sprite[][] = [];
    private gridGroup!: Phaser.GameObjects.Group;

    private inventory: number = 5;
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
        this.gridGroup = this.add.group();
        this.initGrid();
        this.drawGrid();

        this.pulseTimer = this.time.addEvent({
            delay: this.PULSE_INTERVAL,
            callback: this.executePulse,
            callbackScope: this,
            loop: true
        });

        this.updateVisuals();
    }

    update() {
        const progress = this.pulseTimer.getOverallProgress();
        const uiScene = this.scene.get('UIScene') as any;
        if (uiScene && uiScene.updateTimer) {
            uiScene.updateTimer(progress);
        }
    }

    private initGrid() {
        for (let x = 0; x < this.GRID_SIZE; x++) {
            this.grid[x] = [];
            this.tileSprites[x] = [];
            this.plantSprites[x] = [];
            for (let y = 0; y < this.GRID_SIZE; y++) {
                this.grid[x][y] = false;
            }
        }
    }

    private drawGrid() {
        for (let x = 0; x < this.GRID_SIZE; x++) {
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
        if (!this.grid[x][y] && this.inventory > 0) {
            this.grid[x][y] = true;
            this.inventory--;
        } else if (this.grid[x][y]) {
            this.grid[x][y] = false;
            this.inventory++;
        }
        this.updateVisuals();
        this.syncUI();
    }

    private executePulse() {
        const nextGrid: boolean[][] = [];

        for (let x = 0; x < this.GRID_SIZE; x++) {
            nextGrid[x] = [];
            for (let y = 0; y < this.GRID_SIZE; y++) {
                const neighbors = this.countNeighbors(x, y);
                const isAlive = this.grid[x][y];

                if (isAlive) {
                    nextGrid[x][y] = (neighbors === 2 || neighbors === 3);
                } else {
                    nextGrid[x][y] = (neighbors === 3);
                }
            }
        }

        this.grid = nextGrid;
        this.updateVisuals();
    }

    private countNeighbors(cx: number, cy: number): number {
        let count = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                const nx = cx + x;
                const ny = cy + y;
                if (nx >= 0 && nx < this.GRID_SIZE && ny >= 0 && ny < this.GRID_SIZE) {
                    if (this.grid[nx][ny]) count++;
                }
            }
        }
        return count;
    }

    private updateVisuals() {
        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < this.GRID_SIZE; y++) {
                this.plantSprites[x][y].setVisible(this.grid[x][y]);
            }
        }
    }

    public resetGame() {
        this.inventory = 5;
        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < this.GRID_SIZE; y++) {
                this.grid[x][y] = false;
            }
        }
        this.pulseTimer.reset({
            delay: this.PULSE_INTERVAL,
            callback: this.executePulse,
            callbackScope: this,
            loop: true
        });
        this.updateVisuals();
        this.syncUI();
    }

    private syncUI() {
        const uiScene = this.scene.get('UIScene') as any;
        if (uiScene && uiScene.updateInventory) {
            uiScene.updateInventory(this.inventory);
        }
    }
}
