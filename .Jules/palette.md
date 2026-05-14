## 2026-05-14 - Interactive Element Feedback & Visibility
**Learning:** Discovered an accessibility/UX issue pattern in Phaser components where interactive elements (like the hamburger menu) are defined using invisible interaction zones and empty graphics, lacking both visual presence and hover feedback. This results in 'mystery meat' navigation and poor affordance.
**Action:** Always ensure that interactive UI elements have a clear visual representation (e.g., drawing shapes or rendering sprites) and add explicit hover states (`pointerover` / `pointerout`) to indicate interactability.
