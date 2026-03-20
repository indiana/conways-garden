export const ItemType = {
    Plant: 'Plant',
    Tool: 'Tool',
    Fertilizer: 'Fertilizer',
    Upgrade: 'Upgrade'
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export interface Item {
    id: string;
    displayNameKey: string;
    type: ItemType;
    buyPrice: number;
    icon: string;
}

export interface Achievement {
    id: string;
    titleKey: string;
    descriptionKey: string;
    rewardDescriptionKey: string;
    icon: string;
}

export interface Upgrade {
    id: string;
    displayNameKey: string;
    cost: number;
    descriptionKey: string;
    requirementAchievementId?: string;
}

export interface GameState {
    gold: number;
    inventory: Record<string, number>;
    achievements: string[];
    upgrades: string[];
    gridSize: number;
}

export const ITEMS: Record<string, Item> = {
    'turnip': {
        id: 'turnip',
        displayNameKey: 'ITEM_TURNIP',
        type: ItemType.Plant,
        buyPrice: 10,
        icon: 'ui_turnip'
    },
    'grass_01': {
        id: 'grass_01',
        displayNameKey: 'ITEM_GRASS',
        type: ItemType.Plant,
        buyPrice: 4,
        icon: 'ui_grass'
    }
};

export const ACHIEVEMENTS: Record<string, Achievement> = {
    'first_steps': {
        id: 'first_steps',
        titleKey: 'ACHIEVEMENT_FIRST_STEPS_TITLE',
        descriptionKey: 'ACHIEVEMENT_FIRST_STEPS_DESC',
        rewardDescriptionKey: 'ACHIEVEMENT_REWARD_5X5',
        icon: 'button_achievements'
    }
};

export const UPGRADES: Record<string, Upgrade> = {
    'grid_5x5': {
        id: 'grid_5x5',
        displayNameKey: 'UPGRADE_GRID_5X5',
        cost: 100,
        descriptionKey: 'UPGRADE_GRID_5X5_DESC',
        requirementAchievementId: 'first_steps'
    }
};

export const INITIAL_STATE: GameState = {
    gold: 20,
    inventory: {
        'turnip': 5,
        'grass_01': 5
    },
    achievements: [],
    upgrades: [],
    gridSize: 4
};
