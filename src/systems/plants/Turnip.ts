import type { PlantType } from './PlantType';
import { PlantTags } from './PlantTags';

export class Turnip implements PlantType {
    asset = 'tile_turnip';
    tags = [PlantTags.VEGETABLE];

    shouldSurvive(neighborCount: number, _nonMushroomCount?: number): boolean {
        return neighborCount === 2 || neighborCount === 3;
    }
}
