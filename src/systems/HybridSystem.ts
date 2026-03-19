export class HybridSystem {
    /**
     * Determines the child species based on the 3 parents' composition.
     * @param parents Array of 3 plant IDs.
     * @returns The ID of the child species.
     */
    public static resolveBirth(parents: string[]): string {
        if (parents.length !== 3) {
            console.warn('HybridSystem: resolveBirth called with incorrect number of parents', parents);
            return 'turnip'; // Fallback
        }

        const counts: Record<string, number> = {};
        for (const p of parents) {
            counts[p] = (counts[p] || 0) + 1;
        }

        const grassCount = counts['grass_01'] || 0;
        // Turnip count is just the remainder, or counts['turnip']

        // Probability of Grass = (Grass Neighbors / 3) * 100%
        const grassChance = grassCount / 3;

        return Math.random() < grassChance ? 'grass_01' : 'turnip';
    }
}
