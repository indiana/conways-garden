export const ItemType = {
    Plant: 'Plant',
    Tool: 'Tool',
    Fertilizer: 'Fertilizer',
    Upgrade: 'Upgrade'
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export interface Item {
    id: string;
    displayName: string;
    type: ItemType;
    buyPrice: number;
    icon: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    rewardDescription: string;
    icon: string;
}

export interface Upgrade {
    id: string;
    displayName: string;
    cost: number;
    description: string;
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
        displayName: 'Rzepa',
        type: ItemType.Plant,
        buyPrice: 10,
        icon: 'ui_turnip'
    },
    'grass_01': {
        id: 'grass_01',
        displayName: 'Trawa',
        type: ItemType.Plant,
        buyPrice: 4,
        icon: 'ui_grass'
    }
};

export const ACHIEVEMENTS: Record<string, Achievement> = {
    'first_steps': {
        id: 'first_steps',
        title: 'Pierwsze kroki',
        description: 'Zbierz łącznie 200 monet w swoim portfelu.',
        rewardDescription: 'Upgrade: Powiększenie siatki 5x5.',
        icon: 'button_achievements' // Using existing icon as placeholder
    }
};

export const UPGRADES: Record<string, Upgrade> = {
    'grid_5x5': {
        id: 'grid_5x5',
        displayName: 'Powiększenie ogrodu (5x5)',
        cost: 100,
        description: 'Zwiększa obszar ogrodu do 5x5.',
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
