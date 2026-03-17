# Conway's Garden

A sandbox logic/simulation game combining inventory management with Conway's Game of Life.
Players plant and harvest on a 4x4 grid while managing the automatic evolution of the ecosystem.

## Gameplay Mechanics

### The World
- **Grid**: 16 tiles (4x4)
- **Borders**: Dead borders (no wrapping)
- **Initial State**: Empty grid, 5 plants in inventory

### The Pulse (Life Cycle)
Every 10 seconds, the grid updates based on Conway's Game of Life rules:
- **Survival**: A plant stays if it has 2 or 3 neighbors.
- **Death**: A plant dies if it has < 2 (isolation) or > 3 (overcrowding) neighbors.
- **Birth**: A new plant sprouts in an empty tile if it has exactly 3 neighbors.

### Interaction
- **Planting**: Click an empty tile to plant (Costs 1 Inventory).
- **Harvesting**: Click a plant to harvest (Gains 1 Inventory).
- **Inventory**: You cannot plant if your inventory is empty.

## Tech Stack
- [Phaser 3](https://phaser.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Setup & Run

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```
