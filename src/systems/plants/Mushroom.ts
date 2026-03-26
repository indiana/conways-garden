import type { PlantType } from './PlantType';
import { PlantTags } from './PlantTags';

export class Mushroom implements PlantType {
    id = 'mushroom_01';
    buyPrice = 20;
    sellPrice = 10;
    asset = 'tile_mushroom_01';
    tags = [PlantTags.MUSHROOM];

    shouldSurvive(neighborCount: number, nonMushroomCount?: number): boolean {
        if (neighborCount < 1 || neighborCount > 2) return false;
        return (nonMushroomCount ?? 0) >= 1;
    }
}
