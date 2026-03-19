import Phaser from "phaser";
import { GameStateManager } from "../managers/GameStateManager";
import { Events } from "../constants/Events";
import { MainScene } from "./MainScene";
import { STYLES } from "../constants/Styles";

export class UIScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private goldIcon!: Phaser.GameObjects.Sprite;
  private timerGraphics!: Phaser.GameObjects.Graphics;

  // Inventory UI
  private selectionFrames: Record<string, Phaser.GameObjects.Graphics> = {};
  private countTexts: Record<string, Phaser.GameObjects.Text> = {};
  
  private gameStateManager!: GameStateManager;

  private readonly UI_CENTER_X = 360;
  private readonly TIMER_Y = 150;
  private readonly INVENTORY_Y = 1100; // Still used for Buttons
  
  // New Inventory Layout
  private readonly LIST_X = 168; // Aligned with grid left
  private readonly LIST_START_Y = 900;
  private readonly ITEM_SPACING = 140;
  private readonly SLOT_WIDTH = 280; // Widen to include text
  private readonly SLOT_HEIGHT = 120;

  constructor() {
    super("UIScene");
  }

  create() {
    this.gameStateManager = this.registry.get("gameStateManager") as GameStateManager;

    // Gold Display
    this.goldText = this.add.text(40, 40, "20", STYLES.GOLD).setOrigin(0, 0.5);
    this.goldIcon = this.add
      .sprite(this.goldText.x + this.goldText.width, 40, "ui_gold")
      .setOrigin(0, 0.5);
    this.goldIcon.setScale(75 / this.goldIcon.width);

    // Initial Gold Sync
    this.updateGold(this.gameStateManager.gold);

    // Event Listeners
    if (this.gameStateManager) {
      this.gameStateManager.on(Events.GOLD_CHANGED, (gold: number) => {
        this.updateGold(gold);
      });

      this.gameStateManager.on(
        Events.INVENTORY_CHANGED,
        (inventory: Record<string, number>) => {
          this.updateInventoryCounts(inventory);
        },
      );
    }

    // Initialize Inventory List
    this.createInventoryList();

    // Initial Inventory Sync
    this.updateInventoryCounts(this.gameStateManager.inventory);
    this.updateSelectionHighlight();

    // Radial Timer
    this.timerGraphics = this.add.graphics();
    this.drawTimer(0);

    // Trade Button
    const tradeBtn = this.add
      .text(this.UI_CENTER_X, this.INVENTORY_Y + 120, "HANDEL", {
        ...STYLES.BUTTON,
        backgroundColor: "#f39c12",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.handleTrade())
      .on("pointerover", () =>
        tradeBtn.setStyle({ backgroundColor: "#f1c40f" }),
      )
      .on("pointerout", () =>
        tradeBtn.setStyle({ backgroundColor: "#f39c12" }),
      );

    // Reset Button
    const resetBtn = this.add
      .text(this.UI_CENTER_X, this.INVENTORY_Y + 200, "RESET", {
        ...STYLES.BUTTON,
        fontSize: "24px",
        backgroundColor: "#ff4757",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.handleReset())
      .on("pointerover", () =>
        resetBtn.setStyle({ backgroundColor: "#ff6b81" }),
      )
      .on("pointerout", () =>
        resetBtn.setStyle({ backgroundColor: "#ff4757" }),
      );

    const mainScene = this.scene.get("MainScene") as MainScene;
    if (mainScene) {
      mainScene.events.on(Events.PULSE_PROGRESS, (progress: number) => {
        this.drawTimer(progress);
      });
    }
  }

  private createInventoryList() {
      const items = [
          { id: 'turnip', icon: 'ui_turnip' },
          { id: 'grass_01', icon: 'ui_grass' }
      ];

      items.forEach((item, index) => {
          this.createInventoryItem(index, item.id, item.icon);
      });
  }

  private createInventoryItem(index: number, itemId: string, iconKey: string) {
      const x = this.LIST_X;
      const y = this.LIST_START_Y + (index * this.ITEM_SPACING);

      // Selection Frame (Graphics)
      const frame = this.add.graphics();
      this.selectionFrames[itemId] = frame;

      // Interactive Zone - shifted right to cover entry
      const zone = this.add.zone(x + this.SLOT_WIDTH / 2 - 20, y, this.SLOT_WIDTH, this.SLOT_HEIGHT).setOrigin(0.5).setInteractive();
      zone.on('pointerdown', () => {
          this.gameStateManager.selectedItem = itemId;
          this.updateSelectionHighlight();
      });

      // Icon (Left aligned)
      this.add.sprite(x, y, iconKey).setScale(1.2).setOrigin(0, 0.5);

      // Count Text (On the right of the icon)
      const text = this.add.text(x + 110, y, 'x0', STYLES.INVENTORY).setOrigin(0, 0.5);
      this.countTexts[itemId] = text;
  }

  private updateSelectionHighlight() {
      const selectedItem = this.gameStateManager.selectedItem;
      
      Object.keys(this.selectionFrames).forEach(itemId => {
          const frame = this.selectionFrames[itemId];
          const index = itemId === 'turnip' ? 0 : 1; 
          const x = this.LIST_X - 10; // Padding
          const y = this.LIST_START_Y + (index * this.ITEM_SPACING);

          frame.clear();
          
          if (itemId === selectedItem) {
              // Gray Frame
              frame.lineStyle(4, 0x7f8c8d, 1);
              frame.strokeRoundedRect(x, y - this.SLOT_HEIGHT / 2, this.SLOT_WIDTH, this.SLOT_HEIGHT, 15);
          }
      });
  }

  private updateGold(gold: number) {
    this.goldText.setText(`${gold}`);
    this.goldIcon.setX(this.goldText.x + this.goldText.width + 10);
  }

  private updateInventoryCounts(inventory: Record<string, number>) {
      if (this.countTexts['turnip']) {
          this.countTexts['turnip'].setText(`x${inventory['turnip'] || 0}`);
      }
      if (this.countTexts['grass_01']) {
          this.countTexts['grass_01'].setText(`x${inventory['grass_01'] || 0}`);
      }
  }

  private drawTimer(progress: number) {
    this.timerGraphics.clear();
    this.timerGraphics.lineStyle(20, 0x2d3436);
    this.timerGraphics.strokeCircle(this.UI_CENTER_X, this.TIMER_Y, 80);

    if (progress > 0) {
      this.timerGraphics.lineStyle(20, 0x2ecc71);
      this.timerGraphics.beginPath();
      this.timerGraphics.arc(
        this.UI_CENTER_X,
        this.TIMER_Y,
        80,
        Phaser.Math.DegToRad(-90),
        Phaser.Math.DegToRad(-90 + 360 * progress),
        false,
      );
      this.timerGraphics.strokePath();
    }
  }

  private handleReset() {
    const mainScene = this.scene.get("MainScene") as MainScene;
    if (mainScene && mainScene.resetGame) {
      mainScene.resetGame();
    }
  }

  private handleTrade() {
    this.scene.pause("MainScene");
    this.scene.run("TradeScene");
  }
}
