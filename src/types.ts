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
    descriptionKey: string;
    rulesKey: string;
    unlockKey: string;
    tags: string[];
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
    totalGoldEarned: number;
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
        icon: 'ui_turnip',
        descriptionKey: 'ITEM_TURNIP_DESC',
        rulesKey: 'ITEM_TURNIP_RULES',
        unlockKey: 'ITEM_UNLOCK_DEFAULT',
        tags: ['vegetable']
    },
    'grass_01': {
        id: 'grass_01',
        displayNameKey: 'ITEM_GRASS',
        type: ItemType.Plant,
        buyPrice: 4,
        icon: 'ui_grass',
        descriptionKey: 'ITEM_GRASS_DESC',
        rulesKey: 'ITEM_GRASS_RULES',
        unlockKey: 'ITEM_UNLOCK_DEFAULT',
        tags: ['wild']
    }
};

export const ACHIEVEMENTS: Record<string, Achievement> = {
    'first_steps': {
        id: 'first_steps',
        titleKey: 'ACHIEVEMENT_FIRST_STEPS_TITLE',
        descriptionKey: 'ACHIEVEMENT_FIRST_STEPS_DESC',
        rewardDescriptionKey: 'ACHIEVEMENT_REWARD_4X4',
        icon: 'button_achievements'
    },
    'golden_hand': {
        id: 'golden_hand',
        titleKey: 'ACHIEVEMENT_GOLDEN_HAND_TITLE',
        descriptionKey: 'ACHIEVEMENT_GOLDEN_HAND_DESC',
        rewardDescriptionKey: 'ACHIEVEMENT_REWARD_5X5',
        icon: 'button_achievements'
    },
    'green_investor': {
        id: 'green_investor',
        titleKey: 'ACHIEVEMENT_GREEN_INVESTOR_TITLE',
        descriptionKey: 'ACHIEVEMENT_GREEN_INVESTOR_DESC',
        rewardDescriptionKey: 'ACHIEVEMENT_REWARD_SOON',
        icon: 'button_achievements'
    },
    'flora_tycoon': {
        id: 'flora_tycoon',
        titleKey: 'ACHIEVEMENT_FLORA_TYCOON_TITLE',
        descriptionKey: 'ACHIEVEMENT_FLORA_TYCOON_DESC',
        rewardDescriptionKey: 'ACHIEVEMENT_REWARD_SOON',
        icon: 'button_achievements'
    }
};

export const UPGRADES: Record<string, Upgrade> = {
    'garden_level_2': {
        id: 'garden_level_2',
        displayNameKey: 'UPGRADE_GARDEN_LEVEL_2',
        cost: 50,
        descriptionKey: 'UPGRADE_GARDEN_LEVEL_2_DESC',
        requirementAchievementId: 'first_steps'
    },
    'garden_level_3': {
        id: 'garden_level_3',
        displayNameKey: 'UPGRADE_GARDEN_LEVEL_3',
        cost: 250,
        descriptionKey: 'UPGRADE_GARDEN_LEVEL_3_DESC',
        requirementAchievementId: 'golden_hand'
    }
};

export const INITIAL_STATE: GameState = {
    gold: 20,
    totalGoldEarned: 0,
    inventory: {
        'turnip': 5,
        'grass_01': 5
    },
    achievements: [],
    upgrades: [],
    gridSize: 3
};
