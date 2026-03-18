export const ItemType = {
    Plant: 'Plant',
    Tool: 'Tool',
    Fertilizer: 'Fertilizer'
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export interface Item {
    id: string;
    displayName: string;
    type: ItemType;
    buyPrice: number;
    icon: string;
}

export interface GameState {
    gold: number;
    inventory: Record<string, number>;
}

export const ITEMS: Record<string, Item> = {
    'turnip': {
        id: 'turnip',
        displayName: 'Rzepa',
        type: ItemType.Plant,
        buyPrice: 10,
        icon: 'ui_turnip'
    }
};

export const INITIAL_STATE: GameState = {
    gold: 20,
    inventory: {
        'turnip': 5
    }
};
