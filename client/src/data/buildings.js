// Building Types Definition
export const buildingTypes = {
    house: {
        id: 'house',
        name: 'Житловий будинок',
        category: 'житлові',
        emoji: '🏠',
        baseCost: { money: 100, wood: 50, stone: 0 },
        baseIncome: 10,
        satisfaction: 5,
        images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=300&q=80'],
    },
    shop: {
        id: 'shop',
        name: 'Магазин',
        category: 'комерційні',
        emoji: '🏬',
        baseCost: { money: 200, wood: 150, stone: 50 },
        baseIncome: 50,
        satisfaction: 2,
        images: ['https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80'],
    },
    factory: {
        id: 'factory',
        name: 'Фабрика',
        category: 'промислові',
        emoji: '🏭',
        baseCost: { money: 500, wood: 400, stone: 200 },
        baseIncome: 150,
        satisfaction: -10,
        images: ['https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=300&q=80'],
    },
    park: {
        id: 'park',
        name: 'Парк',
        category: 'комерційні',
        emoji: '🌲',
        baseCost: { money: 50, wood: 10, stone: 10 },
        baseIncome: 5,
        satisfaction: 15,
        images: ['https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=300&q=80'],
    },
};

// Initial 4x4 Grid
export const initialGrid = [
    { id: 'c1', type: 'grass' },
    { id: 'c2', type: 'road' },
    { id: 'c3', type: 'road' },
    { id: 'c4', type: 'grass' },
    { id: 'c5', type: 'road' },
    { id: 'c6', type: 'house', level: 1, isBuilding: true },
    { id: 'c7', type: 'shop', level: 1, isBuilding: true },
    { id: 'c8', type: 'road' },
    { id: 'c9', type: 'grass' },
    { id: 'c10', type: 'road' },
    { id: 'c11', type: 'factory', level: 1, isBuilding: true },
    { id: 'c12', type: 'grass' },
    { id: 'c13', type: 'park', level: 1, isBuilding: true },
    { id: 'c14', type: 'road' },
    { id: 'c15', type: 'road' },
    { id: 'c16', type: 'grass' },
];

// Default resources
export const defaultResources = { money: 10000, wood: 1500, stone: 800 };
