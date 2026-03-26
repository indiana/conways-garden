import type { PlantType } from './PlantType';
import { PlantTags } from './PlantTags';

export class Turnip implements PlantType {
    id = 'turnip';
    buyPrice = 10;
    sellPrice = 5;
    asset = 'tile_turnip';
    tags = [PlantTags.VEGETABLE];

    shouldSurvive(neighborCount: number): boolean {
        return neighborCount === 2 || neighborCount === 3;
    }
}
