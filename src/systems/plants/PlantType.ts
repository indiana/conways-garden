export interface PlantType {
    id: string;
    buyPrice: number;
    sellPrice: number;
    asset: string;
    tags: string[];
    shouldSurvive(neighborCount: number): boolean;
}
