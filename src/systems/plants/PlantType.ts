export interface PlantType {
    id: string;
    buyPrice: number;
    sellPrice: number;
    asset: string;
    shouldSurvive(neighborCount: number): boolean;
}
