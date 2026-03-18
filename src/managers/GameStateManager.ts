import Phaser from 'phaser';
import type { GameState } from '../types';
import { INITIAL_STATE } from '../types';
import { Events } from '../constants/Events';

export class GameStateManager extends Phaser.Events.EventEmitter {
    private state: GameState;

    constructor() {
        super();
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    }

    public get gold(): number {
        return this.state.gold;
    }

    public get inventory(): Record<string, number> {
        return { ...this.state.inventory };
    }

    public addGold(amount: number) {
        this.state.gold += amount;
        this.emit(Events.GOLD_CHANGED, this.state.gold);
    }

    public spendGold(amount: number): boolean {
        if (this.state.gold >= amount) {
            this.state.gold -= amount;
            this.emit(Events.GOLD_CHANGED, this.state.gold);
            return true;
        }
        return false;
    }

    public addItem(itemId: string, count: number = 1) {
        if (!this.state.inventory[itemId]) {
            this.state.inventory[itemId] = 0;
        }
        this.state.inventory[itemId] += count;
        this.emit(Events.INVENTORY_CHANGED, this.state.inventory);
    }

    public removeItem(itemId: string, count: number = 1): boolean {
        if (this.state.inventory[itemId] >= count) {
            this.state.inventory[itemId] -= count;
            this.emit(Events.INVENTORY_CHANGED, this.state.inventory);
            return true;
        }
        return false;
    }

    public getItemCount(itemId: string): number {
        return this.state.inventory[itemId] || 0;
    }

    public reset() {
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        this.emit(Events.GOLD_CHANGED, this.state.gold);
        this.emit(Events.INVENTORY_CHANGED, this.state.inventory);
    }
}
