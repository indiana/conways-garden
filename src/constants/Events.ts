export const Events = {
    GOLD_CHANGED: 'gold-changed',
    INVENTORY_CHANGED: 'inventory-changed',
    GRID_UPDATED: 'grid-updated',
    PULSE_PROGRESS: 'pulse-progress',
    ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
    UPGRADE_PURCHASED: 'upgrade-purchased',
    GRID_SIZE_CHANGED: 'grid-size-changed'
} as const;

export type Events = typeof Events[keyof typeof Events];
