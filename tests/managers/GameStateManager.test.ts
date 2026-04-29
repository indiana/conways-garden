import { GameStateManager } from '../../src/managers/GameStateManager';
import { Events } from '../../src/constants/Events';

// Note: This test is designed to be run with a test runner like Vitest or Jest.
// Since the environment is restricted, we verified it using a custom runner.

describe('GameStateManager.addGold', () => {
    let gsm: GameStateManager;

    beforeEach(() => {
        gsm = new GameStateManager();
    });

    it('should increase gold balance', () => {
        const initialGold = gsm.gold;
        gsm.addGold(50);
        expect(gsm.gold).toBe(initialGold + 50);
    });

    it('should emit GOLD_CHANGED event', () => {
        const spy = jest.fn();
        gsm.on(Events.GOLD_CHANGED, spy);
        gsm.addGold(100);
        expect(spy).toHaveBeenCalledWith(gsm.gold);
    });

    it('should accumulate multiple additions', () => {
        const initialGold = gsm.gold;
        gsm.addGold(10);
        gsm.addGold(20);
        expect(gsm.gold).toBe(initialGold + 30);
    });

    it('should trigger achievements', () => {
        const spy = jest.fn();
        gsm.on(Events.ACHIEVEMENT_UNLOCKED, spy);
        gsm.addGold(100);
        expect(spy).toHaveBeenCalledWith('first_steps');
    });

    it('should handle zero amount', () => {
        const initialGold = gsm.gold;
        gsm.addGold(0);
        expect(gsm.gold).toBe(initialGold);
    });

    it('should handle large amounts', () => {
        const initialGold = gsm.gold;
        const largeAmount = 1000000;
        gsm.addGold(largeAmount);
        expect(gsm.gold).toBe(initialGold + largeAmount);
    });
});
