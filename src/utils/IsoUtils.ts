export const ISO_TILE_WIDTH = 128;
export const ISO_TILE_HEIGHT = 64;

export class IsoUtils {
    public static cartesianToIsometric(
        x: number, 
        y: number, 
        currentSize: number, 
        originX: number, 
        originY: number
    ) {
        const offsetX = x - (currentSize - 1) / 2;
        const offsetY = y - (currentSize - 1) / 2;
        const sx = originX + (offsetX - offsetY) * (ISO_TILE_WIDTH / 2);
        const sy = originY + (offsetX + offsetY) * (ISO_TILE_HEIGHT / 2);
        return { sx, sy };
    }
}
