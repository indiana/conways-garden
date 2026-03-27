import Phaser from 'phaser';
import { GameStateManager } from '../managers/GameStateManager';
import { GridSystem } from '../systems/GridSystem';
import { Events } from '../constants/Events';
import { GridRenderer } from '../ui/components/GridRenderer';
import { GameActions } from '../actions/GameActions';
import { LAYOUT } from '../constants/Layout';

export class MainScene extends Phaser.Scene {
    private gridSystem!: GridSystem;
    private gridRenderer!: GridRenderer;

    private gameStateManager!: GameStateManager;
    private pulseTimer!: Phaser.Time.TimerEvent;

    private readonly PULSE_INTERVAL = 10000; 

    constructor() {
        super('MainScene');
    }

    create() {
        // Managers are initialized in PreloadScene
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;

        // Background (always at bottom)
        const background = this.add.image(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, 'background');
        background.setDepth(-100);

        this.gridSystem = new GridSystem(this.gameStateManager.gridSize);
        this.gridRenderer = new GridRenderer(this);

        this.gridSystem.on(Events.GRID_UPDATED, () => this.gridRenderer.updateVisuals(this.gridSystem));
        this.gridRenderer.on('tile-click', (x: number, y: number) => this.handleTileClick(x, y));

        this.gridRenderer.drawGrid(this.gridSystem.currentSize);

        this.pulseTimer = this.time.addEvent({
            delay: this.PULSE_INTERVAL,
            callback: () => this.gridSystem.executePulse(),
            callbackScope: this,
            loop: true
        });

        this.gameStateManager.on(Events.GRID_SIZE_CHANGED, (newSize: number) => {
            const oldSize = this.gridSystem.currentSize;
            this.gridSystem.resize(newSize);
            this.gridRenderer.drawGrid(newSize, true, oldSize);
            this.gridRenderer.updateVisuals(this.gridSystem);
        });

        this.gameStateManager.on(Events.GAME_RESET, () => {
            this.handleGameReset();
        });

        this.gridRenderer.updateVisuals(this.gridSystem);
    }

    private handleGameReset() {
        this.gridSystem.reset();
        this.pulseTimer.reset({
            delay: this.PULSE_INTERVAL,
            callback: () => this.gridSystem.executePulse(),
            callbackScope: this,
            loop: true
        });
        this.gridRenderer.updateVisuals(this.gridSystem);
    }

    update() {
        const progress = this.pulseTimer.getOverallProgress();
        this.events.emit(Events.PULSE_PROGRESS, progress);
    }

    private handleTileClick(x: number, y: number) {
        const selectedItem = this.gameStateManager.selectedItem;
        const occupiedId = this.gridSystem.getCell(x, y);
        
        if (!occupiedId) {
            GameActions.plant(this.gameStateManager, this.gridSystem, x, y, selectedItem);
        } else {
            GameActions.harvest(this.gameStateManager, this.gridSystem, x, y);
        }
    }

    public resetGame() {
        this.gameStateManager.reset();
    }
}
