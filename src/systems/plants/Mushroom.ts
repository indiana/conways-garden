import type { PlantType } from './PlantType';
import { PlantTags } from './PlantTags';

export class Mushroom implements PlantType {
    asset = 'tile_mushroom_01';
    tags = [PlantTags.MUSHROOM];

    shouldSurvive(neighborCount: number, nonMushroomCount?: number): boolean {
        if (neighborCount < 1 || neighborCount > 2) return false;
        return (nonMushroomCount ?? 0) >= 1;
    }
}
