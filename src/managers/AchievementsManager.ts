import type { GameState } from '../types';

export class AchievementsManager {
    public check(state: GameState): string[] {
        const unlocked: string[] = [];
        
        // First Steps: 100 total gold
        if (state.totalGoldEarned >= 100 && !state.achievements.includes('first_steps')) {
            unlocked.push('first_steps');
        }

        // Golden Hand: 1000 total gold
        if (state.totalGoldEarned >= 1000 && !state.achievements.includes('golden_hand')) {
            unlocked.push('golden_hand');
        }

        // Green Investor: 10000 total gold
        if (state.totalGoldEarned >= 10000 && !state.achievements.includes('green_investor')) {
            unlocked.push('green_investor');
        }

        // Flora Tycoon: 100000 total gold
        if (state.totalGoldEarned >= 100000 && !state.achievements.includes('flora_tycoon')) {
            unlocked.push('flora_tycoon');
        }

        return unlocked;
    }
}
