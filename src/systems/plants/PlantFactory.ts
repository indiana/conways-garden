import type { PlantType } from './PlantType';
import { Turnip } from './Turnip';
import { Grass } from './Grass';
import { Mushroom } from './Mushroom';

export class PlantFactory {
    private static plants: Record<string, PlantType> = {
        'turnip': new Turnip(),
        'grass_01': new Grass(),
        'mushroom_01': new Mushroom()
    };

    public static getPlant(id: string): PlantType | undefined {
        return this.plants[id];
    }
}
