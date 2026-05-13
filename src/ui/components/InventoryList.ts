import Phaser from "phaser";
import { STYLES } from "../../constants/Styles";
import { GameStateManager } from "../../managers/GameStateManager";
import { LAYOUT } from "../../constants/Layout";
import { PLANT_ITEMS, PLANT_ITEM_IDS } from "../../types";

export class InventoryList extends Phaser.GameObjects.Container {
  private selectionFrames: Record<string, Phaser.GameObjects.Graphics> = {};
  private countTexts: Record<string, Phaser.GameObjects.Text> = {};
  private gameStateManager: GameStateManager;
  private itemOrder: string[] = [];

  constructor(scene: Phaser.Scene, gameStateManager: GameStateManager) {
    super(scene, 0, 0);
    this.gameStateManager = gameStateManager;

    this.createInventoryList();

    gameStateManager.subscribeInventory((inv) => this.updateCounts(inv));
    this.updateSelectionHighlight();

    scene.add.existing(this);
  }

  private createInventoryList() {
    this.itemOrder = [...PLANT_ITEM_IDS];

    PLANT_ITEMS.forEach((plant, index) => {
      this.createInventoryItem(index, plant.id, plant.icon);
    });
  }

  private createInventoryItem(index: number, itemId: string, iconKey: string) {
    const x = LAYOUT.INVENTORY_LIST_X;
    const y = LAYOUT.INVENTORY_LIST_START_Y + index * LAYOUT.INVENTORY_ITEM_SPACING;

    const frame = this.scene.add.graphics();
    this.selectionFrames[itemId] = frame;

    const zone = this.scene.add
      .zone(
        x + LAYOUT.INVENTORY_SLOT_WIDTH / 2 - 20,
        y,
        LAYOUT.INVENTORY_SLOT_WIDTH,
        LAYOUT.INVENTORY_SLOT_HEIGHT,
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    zone.on("pointerdown", () => {
      this.gameStateManager.selectedItem = itemId;
      this.updateSelectionHighlight();
    });

    const icon = this.scene.add.sprite(x, y, iconKey).setOrigin(0, 0.5);

    const text = this.scene.add
      .text(x + 110, y, "x0", STYLES.INVENTORY)
      .setOrigin(0, 0.5);
    this.countTexts[itemId] = text;

    this.add([frame, zone, icon, text]);
  }

  private updateCounts(inventory: Record<string, number>) {
    Object.keys(this.countTexts).forEach(itemId => {
      if (this.countTexts[itemId]) {
        this.countTexts[itemId].setText(`x${inventory[itemId] || 0}`);
      }
    });
  }

  public updateSelectionHighlight() {
    const selectedItem = this.gameStateManager.selectedItem;

    Object.keys(this.selectionFrames).forEach((itemId) => {
      const frame = this.selectionFrames[itemId];
      const index = this.itemOrder.indexOf(itemId);
      const x = LAYOUT.INVENTORY_LIST_X - 10;
      const y = LAYOUT.INVENTORY_LIST_START_Y + index * LAYOUT.INVENTORY_ITEM_SPACING;

      frame.clear();

      if (itemId === selectedItem) {
        frame.lineStyle(4, 0x7f8c8d, 1);
        frame.strokeRoundedRect(
          x,
          y - LAYOUT.INVENTORY_ITEM_SPACING / 2,
          LAYOUT.INVENTORY_SLOT_WIDTH,
          LAYOUT.INVENTORY_ITEM_SPACING,
          15,
        );
      }
    });
  }
}
