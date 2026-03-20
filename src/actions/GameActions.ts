import { GameStateManager } from '../managers/GameStateManager';
import { GridSystem } from '../systems/GridSystem';
import { ITEMS } from '../types';

export class GameActions {
    /**
     * Attempts to plant an item at the specified coordinates.
     */
    public static plant(
        gsm: GameStateManager, 
        grid: GridSystem, 
        x: number, 
        y: number, 
        itemId: string
    ): boolean {
        const occupiedId = grid.getCell(x, y);
        if (occupiedId) return false;

        const count = gsm.getItemCount(itemId);
        if (count > 0) {
            grid.setCell(x, y, itemId);
            gsm.removeItem(itemId, 1);
            return true;
        }
        return false;
    }

    /**
     * Attempts to harvest an item at the specified coordinates.
     */
    public static harvest(
        gsm: GameStateManager, 
        grid: GridSystem, 
        x: number, 
        y: number
    ): boolean {
        const occupiedId = grid.getCell(x, y);
        if (occupiedId) {
            grid.setCell(x, y, null);
            gsm.addItem(occupiedId, 1);
            return true;
        }
        return false;
    }

    /**
     * Attempts to buy an item from the shop.
     */
    public static buyItem(gsm: GameStateManager, itemId: string): boolean {
        const item = ITEMS[itemId];
        if (!item) return false;

        if (gsm.spendGold(item.buyPrice)) {
            gsm.addItem(itemId, 1);
            return true;
        }
        return false;
    }

    /**
     * Attempts to sell an item to the shop.
     */
    public static sellItem(gsm: GameStateManager, itemId: string): boolean {
        const item = ITEMS[itemId];
        if (!item) return false;

        const sellPrice = Math.floor(item.buyPrice * 0.5);
        if (gsm.removeItem(itemId, 1)) {
            gsm.addGold(sellPrice);
            return true;
        }
        return false;
    }

    /**
     * Attempts to buy an upgrade.
     */
    public static buyUpgrade(gsm: GameStateManager, upgradeId: string): boolean {
        return gsm.buyUpgrade(upgradeId);
    }
}
