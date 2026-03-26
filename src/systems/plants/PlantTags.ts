export const PlantTags = {
    VEGETABLE: 'vegetable',
    WILD: 'wild',
    MUSHROOM: 'mushroom'
} as const;

export type PlantTag = typeof PlantTags[keyof typeof PlantTags];
