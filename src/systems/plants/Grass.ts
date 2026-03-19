import type { PlantType } from './PlantType';

export class Grass implements PlantType {
    id = 'grass_01';
    buyPrice = 4;
    sellPrice = 2;
    asset = 'tile_grass';

    shouldSurvive(neighborCount: number): boolean {
        // Survival rules: 1, 2, or 3 neighbors.
        // Dies if 0 (isolation) or > 3 (overcrowding).
        return neighborCount >= 1 && neighborCount <= 3;
    }
}
