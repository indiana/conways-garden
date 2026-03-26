import Phaser from 'phaser';
import { Events } from '../constants/Events';
import { PlantFactory } from './plants/PlantFactory';
import { HybridSystem } from './HybridSystem';

export class GridSystem extends Phaser.Events.EventEmitter {
    private grid: (string | null)[][] = [];
    private size: number;

    constructor(size: number) {
        super();
        this.size = size;
        this.initGrid();
    }

    private initGrid() {
        this.grid = [];
        for (let x = 0; x < this.size; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.grid[x][y] = null;
            }
        }
    }

    public resize(newSize: number) {
        const newGrid: (string | null)[][] = [];
        for (let x = 0; x < newSize; x++) {
            newGrid[x] = [];
            for (let y = 0; y < newSize; y++) {
                // Copy old value if within bounds
                if (x < this.size && y < this.size) {
                    newGrid[x][y] = this.grid[x][y];
                } else {
                    newGrid[x][y] = null;
                }
            }
        }
        this.grid = newGrid;
        this.size = newSize;
        this.emit(Events.GRID_UPDATED, this.grid);
    }

    public get currentSize(): number {
        return this.size;
    }

    public isAlive(x: number, y: number): boolean {
        return this.grid[x][y] !== null;
    }

    public getCell(x: number, y: number): string | null {
        return this.grid[x][y];
    }

    public setCell(x: number, y: number, value: string | null) {
        if (this.grid[x][y] !== value) {
            this.grid[x][y] = value;
            this.emit(Events.GRID_UPDATED, this.grid);
        }
    }

    public executePulse() {
        const nextGrid: (string | null)[][] = [];
        let changed = false;

        for (let x = 0; x < this.size; x++) {
            nextGrid[x] = [];
            for (let y = 0; y < this.size; y++) {
                const neighborInfo = this.getNeighborInfo(x, y);
                const currentPlantId = this.grid[x][y];
                let nextState: string | null = null;

                if (currentPlantId) {
                    // Survival Logic
                    const plantType = PlantFactory.getPlant(currentPlantId);
                    if (plantType) {
                        const shouldSurvive = plantType.shouldSurvive(neighborInfo.count, neighborInfo.nonMushroomCount);
                        if (shouldSurvive) {
                            nextState = currentPlantId;
                        } else {
                            nextState = null; // Dies
                        }
                    } else {
                        // Unknown plant? Kill it.
                        nextState = null;
                    }
                } else {
                    // Birth Logic
                    if (neighborInfo.count === 3) {
                        nextState = HybridSystem.resolveBirth(neighborInfo.neighborIds, neighborInfo.nonMushroomCount > 0);
                    } else {
                        nextState = null;
                    }
                }
                
                nextGrid[x][y] = nextState;
                if (nextState !== currentPlantId) changed = true;
            }
        }

        if (changed) {
            this.grid = nextGrid;
            this.emit(Events.GRID_UPDATED, this.grid);
        }
    }

    private getNeighborInfo(cx: number, cy: number): { count: number; nonMushroomCount: number; neighborIds: string[] } {
        const neighborIds: string[] = [];
        let nonMushroomCount = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                const nx = cx + x;
                const ny = cy + y;
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    const cell = this.grid[nx][ny];
                    if (cell) {
                        neighborIds.push(cell);
                        const plantType = PlantFactory.getPlant(cell);
                        if (plantType && !plantType.tags.includes('mushroom')) {
                            nonMushroomCount++;
                        }
                    }
                }
            }
        }
        return { count: neighborIds.length, nonMushroomCount, neighborIds };
    }

    public reset() {
        this.initGrid();
        this.emit(Events.GRID_UPDATED, this.grid);
    }

    public get currentGrid(): (string | null)[][] {
        return this.grid.map(row => [...row]);
    }
}
