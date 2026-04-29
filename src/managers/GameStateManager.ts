import Phaser from 'phaser';
import type { GameState } from '../types';
import { INITIAL_STATE, UPGRADES } from '../types';
import { Events } from '../constants/Events';
import { AchievementsManager } from './AchievementsManager';

export class GameStateManager extends Phaser.Events.EventEmitter {
    private state: GameState;
    private _selectedItem: string = 'turnip';
    private achievementsManager: AchievementsManager;

    constructor() {
        super();
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        this.achievementsManager = new AchievementsManager();
    }

    public get selectedItem(): string {
        return this._selectedItem;
    }

    public set selectedItem(item: string) {
        this._selectedItem = item;
    }

    public get gold(): number {
        return this.state.gold;
    }

    public get inventory(): Record<string, number> {
        return { ...this.state.inventory };
    }

    public get gridSize(): number {
        return this.state.gridSize;
    }

    public addGold(amount: number) {
        if (amount <= 0) return;
        this.state.gold += amount;
        this.state.totalGoldEarned += amount;
        this.emit(Events.GOLD_CHANGED, this.state.gold);
        this.checkAchievements();
    }

    public spendGold(amount: number): boolean {
        if (amount <= 0) return false;
        if (this.state.gold >= amount) {
            this.state.gold -= amount;
            this.emit(Events.GOLD_CHANGED, this.state.gold);
            return true;
        }
        return false;
    }

    public addItem(itemId: string, count: number = 1) {
        if (count <= 0) return;
        if (!this.state.inventory[itemId]) {
            this.state.inventory[itemId] = 0;
        }
        this.state.inventory[itemId] += count;
        this.emit(Events.INVENTORY_CHANGED, this.state.inventory);
    }

    public removeItem(itemId: string, count: number = 1): boolean {
        if (count <= 0) return false;
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

    public hasAchievement(id: string): boolean {
        return this.state.achievements.includes(id);
    }

    public unlockAchievement(id: string) {
        if (!this.hasAchievement(id)) {
            this.state.achievements.push(id);
            this.emit(Events.ACHIEVEMENT_UNLOCKED, id);
        }
    }

    public hasUpgrade(id: string): boolean {
        return this.state.upgrades.includes(id);
    }

    public buyUpgrade(id: string): boolean {
        const upgrade = UPGRADES[id];
        if (!upgrade) return false;
        if (this.hasUpgrade(id)) return false;

        if (upgrade.requirementAchievementId && !this.hasAchievement(upgrade.requirementAchievementId)) {
             return false;
        }

        if (this.spendGold(upgrade.cost)) {
            this.state.upgrades.push(id);
            this.emit(Events.UPGRADE_PURCHASED, id);
            
            // Apply Upgrade Effects
            if (id === 'garden_level_2') {
                this.expandGrid(4);
            } else if (id === 'garden_level_3') {
                this.expandGrid(5);
            }
            
            return true;
        }
        return false;
    }

    public expandGrid(newSize: number) {
        this.state.gridSize = newSize;
        this.emit(Events.GRID_SIZE_CHANGED, newSize);
    }

    private checkAchievements() {
        const newAchievements = this.achievementsManager.check(this.state);
        newAchievements.forEach(id => this.unlockAchievement(id));
    }

    public reset() {
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        this.emit(Events.GAME_RESET);
        this.emit(Events.GOLD_CHANGED, this.state.gold);
        this.emit(Events.INVENTORY_CHANGED, this.state.inventory);
        this.emit(Events.GRID_SIZE_CHANGED, this.state.gridSize);
    }

    // --- Subscription Methods ---

    public subscribeGold(callback: (gold: number) => void) {
        this.on(Events.GOLD_CHANGED, callback);
        callback(this.gold);
    }

    public subscribeInventory(callback: (inventory: Record<string, number>) => void) {
        this.on(Events.INVENTORY_CHANGED, callback);
        callback(this.inventory);
    }

    public subscribeAchievements(callback: (achievements: string[]) => void) {
        this.on(Events.ACHIEVEMENT_UNLOCKED, () => callback(this.state.achievements));
        this.on(Events.GAME_RESET, () => callback(this.state.achievements));
        callback(this.state.achievements);
    }

    public subscribeUpgrades(callback: (upgrades: string[]) => void) {
        this.on(Events.UPGRADE_PURCHASED, () => callback(this.state.upgrades));
        this.on(Events.GAME_RESET, () => callback(this.state.upgrades));
        callback(this.state.upgrades);
    }
}
