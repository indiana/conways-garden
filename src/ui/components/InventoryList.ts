import Phaser from "phaser";
import { STYLES } from "../../constants/Styles";
import { GameStateManager } from "../../managers/GameStateManager";
import { LAYOUT } from "../../constants/Layout";

export class InventoryList extends Phaser.GameObjects.Container {
  private selectionFrames: Record<string, Phaser.GameObjects.Graphics> = {};
  private countTexts: Record<string, Phaser.GameObjects.Text> = {};
  private gameStateManager: GameStateManager;

  constructor(scene: Phaser.Scene, gameStateManager: GameStateManager) {
    super(scene, 0, 0);
    this.gameStateManager = gameStateManager;

    this.createInventoryList();

    // Reactive bindings
    gameStateManager.subscribeInventory((inv) => this.updateCounts(inv));
    this.updateSelectionHighlight(); // Initial

    scene.add.existing(this);
  }

  private createInventoryList() {
    const items = [
      { id: "turnip", icon: "ui_turnip" },
      { id: "grass_01", icon: "ui_grass" },
    ];

    items.forEach((item, index) => {
      this.createInventoryItem(index, item.id, item.icon);
    });
  }

  private createInventoryItem(index: number, itemId: string, iconKey: string) {
    const x = LAYOUT.INVENTORY_LIST_X;
    const y =
      LAYOUT.INVENTORY_LIST_START_Y + index * LAYOUT.INVENTORY_ITEM_SPACING;

    // Selection Frame
    const frame = this.scene.add.graphics();
    this.selectionFrames[itemId] = frame;

    // Interactive Zone
    const zone = this.scene.add
      .zone(
        x + LAYOUT.INVENTORY_SLOT_WIDTH / 2 - 20,
        y,
        LAYOUT.INVENTORY_SLOT_WIDTH,
        LAYOUT.INVENTORY_SLOT_HEIGHT,
      )
      .setOrigin(0.5)
      .setInteractive();
    zone.on("pointerdown", () => {
      this.gameStateManager.selectedItem = itemId;
      this.updateSelectionHighlight();
    });

    // Icon
    const icon = this.scene.add.sprite(x, y, iconKey).setOrigin(0, 0.5);

    // Count Text
    const text = this.scene.add
      .text(x + 110, y, "x0", STYLES.INVENTORY)
      .setOrigin(0, 0.5);
    this.countTexts[itemId] = text;

    this.add([frame, zone, icon, text]);
  }

  private updateCounts(inventory: Record<string, number>) {
    if (this.countTexts["turnip"]) {
      this.countTexts["turnip"].setText(`x${inventory["turnip"] || 0}`);
    }
    if (this.countTexts["grass_01"]) {
      this.countTexts["grass_01"].setText(`x${inventory["grass_01"] || 0}`);
    }
  }

  public updateSelectionHighlight() {
    const selectedItem = this.gameStateManager.selectedItem;

    Object.keys(this.selectionFrames).forEach((itemId) => {
      const frame = this.selectionFrames[itemId];
      const index = itemId === "turnip" ? 0 : 1;
      const x = LAYOUT.INVENTORY_LIST_X - 10;
      const y =
        LAYOUT.INVENTORY_LIST_START_Y + index * LAYOUT.INVENTORY_ITEM_SPACING;

      frame.clear();

      if (itemId === selectedItem) {
        frame.lineStyle(4, 0x7f8c8d, 1);
        frame.strokeRoundedRect(
          x,
          y - LAYOUT.INVENTORY_SLOT_HEIGHT / 2,
          LAYOUT.INVENTORY_SLOT_WIDTH,
          LAYOUT.INVENTORY_SLOT_HEIGHT,
          15,
        );
      }
    });
  }
}
