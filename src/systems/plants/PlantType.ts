export interface PlantType {
    asset: string;
    tags: string[];
    shouldSurvive(neighborCount: number, nonMushroomCount?: number): boolean;
}
