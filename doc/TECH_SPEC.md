# Technical Specification: "Conway's Garden" Implementation (Phaser Edition)

## 1. Technical Stack
*   **Engine:** Phaser 3 (Latest stable).
*   **Language:** TypeScript.
*   **Build Tool:** Vite (Optimized for fast HMR and web builds).
*   **Mobile Bridge:** Capacitor (to be added for future native iOS/Android builds).
*   **Assets:** PNG files for sprites (`tile_ground`, `plant_sprite`, `ui_slot`, etc.).
*   **Audio:** None (Not required for prototype).

## 2. System Architecture

### 2.1. Phaser Scenes & Config
*   **Config:** `disableVisibilityChange: true` (ensures the 10s timer continues running when the tab/app is in the background).
*   **PreloadScene:** Loads PNG assets and creates animations (`fx_poof`).
*   **MainScene:** Core gameplay logic.
    *   4x4 Isometric Grid: Managed as a `Phaser.GameObjects.Group`.
    *   Isometric Transformation: 
        *   `screenX = (cartX - cartY) * (tileWidth / 2)`
        *   `screenY = (cartX + cartY) * (tileHeight / 2)`
    *   The Pulse: A recurring 10,000ms `Phaser.Time.TimerEvent`.
    *   Input: Pointer events on tiles for Planting/Harvesting (requires isometric hit detection).
    *   Reset: A "Reset" button that clears the grid, restores inventory to 5, and resets the timer.
*   **UIScene:** Layered on top for the 9:16 layout.
    *   Top: Radial Timer.
    *   Center: 4x4 Garden Grid.
    *   Bottom: Inventory (x5) and Reset Button.

### 2.2. State Structure
```typescript
interface GameState {
  grid: boolean[][];   // 4x4 matrix
  inventory: number;   // default: 5
  lastPulseTime: number; // for background sync if needed
}
```

### 2.3. The Pulse (Logic)
*   **Algorithm:** Double buffering approach.
    1.  Copy state.
    2.  Calculate neighbors for each of the 16 cells (Dead Borders).
    3.  Apply Conway's rules.
    4.  Update visuals: `plant_sprite` visibility/tweens and `fx_poof` for deaths.

## 3. Visual & UX Implementation
*   **Aspect Ratio:** Mobile-first (9:16).
*   **Scaling:** `Phaser.Scale.FIT` to handle different device sizes while maintaining the portrait ratio.
*   **Interactions:**
    *   **Empty Tile + Inventory > 0:** Plant (Inv - 1).
    *   **Occupied Tile:** Harvest (Inv + 1).
    *   **Reset Button:** Hard reset of all game state.
*   **Animations:**
    *   **Radial Clock:** `Phaser.GameObjects.Graphics` drawing a circular sector that fills over 10s.
    *   **Plants:** Simple scale tweens for "birth" and "pulse" effects.

## 4. Implementation Details (Confirmed)
*   **Starting State:** Grid is strictly empty; Inventory starts at 5.
*   **Conditions:** No Win/Loss states; gameplay is continuous/sandbox.
*   **Timer Persistence:** Continues in background/inactive tabs.

## 5. Roadmap
1.  Setup Vite + Phaser + TypeScript project.
2.  Configure 9:16 scaling and background-persistence.
3.  Implement `PreloadScene` and `MainScene` layout (4x4).
4.  Implement the 10s "Pulse" (GoL logic).
5.  Implement UI: Radial Timer, Inventory counter, and Reset button.
6.  Visual polish: "Poof" animations and sprite integration.
