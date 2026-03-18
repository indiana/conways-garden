import Phaser from 'phaser';
import { Events } from '../constants/Events';

export class GridSystem extends Phaser.Events.EventEmitter {
    private grid: boolean[][] = [];
    private readonly size: number;

    constructor(size: number) {
        super();
        this.size = size;
        this.initGrid();
    }

    private initGrid() {
        for (let x = 0; x < this.size; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.grid[x][y] = false;
            }
        }
    }

    public isAlive(x: number, y: number): boolean {
        return this.grid[x][y];
    }

    public toggleCell(x: number, y: number): boolean {
        this.grid[x][y] = !this.grid[x][y];
        this.emit(Events.GRID_UPDATED, this.grid);
        return this.grid[x][y];
    }

    public setCell(x: number, y: number, alive: boolean) {
        if (this.grid[x][y] !== alive) {
            this.grid[x][y] = alive;
            this.emit(Events.GRID_UPDATED, this.grid);
        }
    }

    public executePulse() {
        const nextGrid: boolean[][] = [];
        let changed = false;

        for (let x = 0; x < this.size; x++) {
            nextGrid[x] = [];
            for (let y = 0; y < this.size; y++) {
                const neighbors = this.countNeighbors(x, y);
                const isAlive = this.grid[x][y];
                let nextState = false;

                if (isAlive) {
                    nextState = (neighbors === 2 || neighbors === 3);
                } else {
                    nextState = (neighbors === 3);
                }
                
                nextGrid[x][y] = nextState;
                if (nextState !== isAlive) changed = true;
            }
        }

        if (changed) {
            this.grid = nextGrid;
            this.emit(Events.GRID_UPDATED, this.grid);
        }
    }

    private countNeighbors(cx: number, cy: number): number {
        let count = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                const nx = cx + x;
                const ny = cy + y;
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    if (this.grid[nx][ny]) count++;
                }
            }
        }
        return count;
    }

    public reset() {
        this.initGrid();
        this.emit(Events.GRID_UPDATED, this.grid);
    }

    public get currentGrid(): boolean[][] {
        return this.grid.map(row => [...row]);
    }
}
