import type { PlantType } from './PlantType';
import { PlantTags } from './PlantTags';

export class Grass implements PlantType {
    asset = 'tile_grass';
    tags = [PlantTags.WILD];

    shouldSurvive(neighborCount: number, _nonMushroomCount?: number): boolean {
        return neighborCount >= 1 && neighborCount <= 3;
    }
}
