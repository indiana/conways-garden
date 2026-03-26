import type { PlantType } from './PlantType';
import { PlantTags } from './PlantTags';

export class Grass implements PlantType {
    id = 'grass_01';
    buyPrice = 4;
    sellPrice = 2;
    asset = 'tile_grass';
    tags = [PlantTags.WILD];

    shouldSurvive(neighborCount: number): boolean {
        return neighborCount >= 1 && neighborCount <= 3;
    }
}
