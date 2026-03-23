# Conway's Garden - Project Overview

A sandbox logic/simulation game combining inventory management with Conway's Game of Life rules, built with **Phaser 3**, **TypeScript**, and **Vite**.

## 🎯 Project Purpose
Players manage an isometric garden grid. Every 10 seconds (the "Pulse"), the grid evolves according to Conway's Game of Life rules. Players can plant seeds (consuming inventory) and harvest plants (gaining inventory) to maintain the ecosystem and participate in a simple economy.

## 🛠 Tech Stack
- **Engine**: Phaser 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Assets**: Isometric sprites (PNG)

## 🏗 System Architecture

### Scene Structure
- `PreloadScene`: Loads all game assets and initializes animations.
- `MainScene`: Core gameplay scene. Manages the 4x4 isometric grid and the 10-second "Pulse" timer.
- `UIScene`: Overlays UI elements like the radial timer, inventory counts, and navigation buttons.
- `TradeScene`: A dedicated scene for the "KUP" (Buy) and "SPRZEDAŻ" (Sell) market system.

### Key Components
- **`GameStateManager`**: Centralized state management for Gold and Inventory (Turnips). Emits events when state changes.
- **`GridSystem`**: Pure logic class for the grid. Implements Conway's Game of Life evolution and neighbor calculations.
- **`Events`**: Constant definitions for cross-scene communication (e.g., `GOLD_CHANGED`, `INVENTORY_CHANGED`, `PULSE_PROGRESS`).

## 🚀 Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Commands
- **Install Dependencies**: `npm install`
- **Development Mode**: `npm run dev` (Starts Vite server with HMR)
- **Production Build**: `npm run build` (Compiles TypeScript and bundles via Vite)
- **Preview Build**: `npm run preview` (Serves the local production build)

## 📏 Development Conventions

### Coding Style
- **TypeScript**: Strict typing is encouraged. Interfaces for game state and items are defined in `src/types.ts`.
- **Naming**: PascalCase for Classes and Scenes, camelCase for methods and variables, UPPER_CASE for constants.
- **Organization**:
  - `src/scenes/`: Phaser scenes.
  - `src/managers/`: State and logic managers.
  - `src/systems/`: Core simulation logic.
  - `src/constants/`: Event names and style definitions.

## 🛡 Engineering Standards
- **Validation**: After every code modification, you MUST attempt to build the project using `npm run build` to verify structural integrity and catch TypeScript errors.
- **Error Resolution**: Proactively fix any build errors or type mismatches introduced by changes before finalizing a task.
- **Technical Integrity**: Ensure all changes are idiomatically consistent with the existing codebase and follow the established architectural patterns.

### Gameplay Logic (The Pulse)
- The grid is a 4x4 matrix with "dead borders" (no wrapping).
- **Survival**: 2 or 3 neighbors.
- **Death**: < 2 (isolation) or > 3 (overcrowding).
- **Birth**: Exactly 3 neighbors in an empty cell.

### UI & Scaling
- **Resolution**: 720x1280 (Portrait 9:16).
- **Scaling Mode**: `Phaser.Scale.FIT`, centered in the browser.
- **Isometric Math**: Standard isometric transformation for the 4x4 grid rendering.

## 📂 Directory Structure Highlights
- `public/assets/`: All game sprites and icons.
- `doc/`: Technical and design specifications (`SPEC.md`, `TECH_SPEC.md`).
- `src/main.ts`: Entry point and Phaser configuration.
