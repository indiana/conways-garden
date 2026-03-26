export class HybridSystem {
    /**
     * Determines the child species based on the 3 parents' composition.
     * Probability is proportional to neighbor count.
     * @param parents Array of 3 plant IDs.
     * @param hasNonMushroom Whether at least one neighbor is not a mushroom.
     * @returns The ID of the child species, or null if birth is not allowed.
     */
    public static resolveBirth(parents: string[], hasNonMushroom: boolean): string | null {
        if (parents.length !== 3) {
            console.warn('HybridSystem: resolveBirth called with incorrect number of parents', parents);
            return 'turnip';
        }

        if (!hasNonMushroom) {
            return null;
        }

        const counts: Record<string, number> = {};
        for (const p of parents) {
            counts[p] = (counts[p] || 0) + 1;
        }

        const roll = Math.random();
        let cumulative = 0;

        for (const plantId of parents) {
            if (counts[plantId]) {
                const chance = counts[plantId] / 3;
                if (roll >= cumulative && roll < cumulative + chance) {
                    return plantId;
                }
                cumulative += chance;
            }
        }

        return 'turnip';
    }
}
