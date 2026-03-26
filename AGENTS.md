# Conway's Garden - Agent Instructions

## Project Overview
A sandbox logic/simulation game combining inventory management with Conway's Game of Life, built with **Phaser 3**, **TypeScript**, and **Vite**.

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Compile TypeScript and bundle for production |
| `npm run preview` | Serve local production build |

**Type Checking:**
```bash
npx tsc --noEmit
```

## TypeScript Configuration
- Target: ES2023
- Module: ESNext
- Strict mode enabled
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true` (use `import type` for type-only imports)

## Code Style Guidelines

### Naming Conventions
- **Classes/Scenes/Types**: PascalCase (e.g., `GameStateManager`, `MainScene`)
- **Methods/Variables**: camelCase (e.g., `addGold`, `currentSize`)
- **Constants/Event Names**: UPPER_SNAKE_CASE (e.g., `GOLD_CHANGED`, `PULSE_INTERVAL`)
- **File Names**: PascalCase for classes/scenes, camelCase for utilities (e.g., `GridSystem.ts`, `IsoUtils.ts`)

### Imports
```typescript
import Phaser from 'phaser';
import type { GameState } from '../types';          // Type-only imports
import { INITIAL_STATE, UPGRADES } from '../types';  // Value imports
import { Events } from '../constants/Events';
```

### File Organization
```
src/
├── actions/          # Game action handlers (plant, harvest, etc.)
├── constants/        # Event names, styles, layout constants
├── managers/         # State managers (GameStateManager, etc.)
├── scenes/           # Phaser scenes (MainScene, UIScene, etc.)
├── systems/          # Core simulation logic (GridSystem, plants/)
├── types.ts          # Interfaces and type definitions
├── ui/components/    # UI components (GridRenderer, RadialTimer, etc.)
├── utils/            # Utility functions (IsoUtils, etc.)
└── main.ts           # Entry point
```

### TypeScript Patterns
- Use interfaces for data structures (Item, Achievement, GameState)
- Use `as const` for constant objects
- Use type-only imports for types (`import type { X }`)
- Prefer `readonly` for immutable data
- Use strict null checks

### Error Handling
- Return `boolean` from methods that may fail (e.g., `spendGold()`, `buyUpgrade()`)
- Guard early with validation checks
- Log errors to console when unrecoverable

### Class Patterns
- Extend `Phaser.Events.EventEmitter` for event-driven communication
- Use getters/setters for exposed state
- Initialize properties with `!` definite assignment when set in `create()`
- Private members use `private` keyword

### Phaser-Specific Guidelines
- Use `this.registry.get()` to access shared managers across scenes
- Use `Phaser.Time.TimerEvent` for periodic operations
- Use `Phaser.Types.Core.GameConfig` for game configuration
- Emit custom events via `this.events.emit()` for scene communication
- Register event listeners in `create()`, clean up in `shutdown()`

## Game-Specific Conventions

### Conway's Game of Life Rules
- Grid with "dead borders" (no wrapping)
- Survival: 2 or 3 neighbors
- Death: < 2 (isolation) or > 3 (overcrowding)
- Birth: Exactly 3 neighbors in empty cell
- Pulse interval: 10 seconds

### Grid Coordinates
- 0-indexed (0 to gridSize-1)
- Grid stored as `grid[x][y]` (not `[y][x]`)
- Isometric rendering via `IsoUtils.cartesianToIsometric()`

### Event System
All cross-scene communication uses the `Events` constants:
```typescript
GOLD_CHANGED, INVENTORY_CHANGED, GRID_UPDATED, PULSE_PROGRESS,
ACHIEVEMENT_UNLOCKED, UPGRADE_PURCHASED, GRID_SIZE_CHANGED, GAME_RESET, LOCALE_CHANGED
```

## Game Resolution
- Base resolution: 720x1280 (Portrait 9:16)
- Scale mode: `Phaser.Scale.FIT`, centered
- Target FPS: 60

## Quality Checklist
Before completing any task:
1. Run `npm run build` to verify TypeScript compilation
2. Fix any type errors or lint issues
3. Ensure changes follow existing patterns and conventions
