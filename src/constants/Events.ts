export const Events = {
    GOLD_CHANGED: 'gold-changed',
    INVENTORY_CHANGED: 'inventory-changed',
    GRID_UPDATED: 'grid-updated',
    PULSE_PROGRESS: 'pulse-progress'
} as const;

export type Events = typeof Events[keyof typeof Events];
