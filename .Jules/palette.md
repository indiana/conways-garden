## 2026-04-29 - Interactive Cursor for Canvas UI\n**Learning:** In Canvas-based Phaser games, standard HTML/DOM accessibility tricks (like setting CSS cursor or ARIA labels) don't apply directly to game objects. Elements that are clickable remain default arrows unless explicitly told otherwise.\n**Action:** Always add `{ useHandCursor: true }` to `setInteractive()` calls for UI buttons, tabs, and interactive grid items to provide immediate visual feedback that an element is clickable.

## 2024-05-13 - Manual Hover States for Canvas UI
**Learning:** In Phaser canvas-based UI, typical CSS interactions like `:hover` are not natively applicable. This leads to a lack of visual feedback when hovering over interactive elements, affecting accessibility and intuitiveness.
**Action:** Always add explicit `pointerover` and `pointerout` event listeners on interactive game objects to manually adjust visual properties (e.g., `setAlpha(0.8)` or applying tints) to provide clear hover feedback.
