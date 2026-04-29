import Phaser from "phaser";
import { ITEMS, UPGRADES } from "../types";
import { GameStateManager } from "../managers/GameStateManager";
import { LocaleManager } from "../managers/LocaleManager";
import { STYLES } from "../constants/Styles";
import { LAYOUT } from "../constants/Layout";
import { GameActions } from "../actions/GameActions";

export class TradeScene extends Phaser.Scene {
  private currentTab: "BUY" | "SELL" = "BUY";
  private uiContainer!: Phaser.GameObjects.Container;
  private gameStateManager!: GameStateManager;
  private localeManager!: LocaleManager;

  // UI Elements
  private titleText!: Phaser.GameObjects.Text;
  private tabBuyBtn!: Phaser.GameObjects.Text;
  private tabSellBtn!: Phaser.GameObjects.Text;

  private readonly ACCENT_COLOR = 0xf39c12;

  constructor() {
    super("TradeScene");
  }

  create() {
    this.gameStateManager = this.registry.get(
      "gameStateManager",
    ) as GameStateManager;
    this.localeManager = this.registry.get("localeManager") as LocaleManager;

    // Background (always at bottom)
    const background = this.add.image(
      LAYOUT.CENTER_X,
      LAYOUT.CENTER_Y,
      "background",
    );
    background.setDepth(-100);

    // Title
    this.titleText = this.add
      .text(LAYOUT.CENTER_X, LAYOUT.TRADE_TITLE_Y, "", STYLES.TITLE)
      .setOrigin(0.5);

    // Tabs
    this.tabBuyBtn = this.createTab(
      LAYOUT.CENTER_X - 100,
      LAYOUT.TRADE_TABS_Y,
      "",
      "BUY",
    );
    this.tabSellBtn = this.createTab(
      LAYOUT.CENTER_X + 100,
      LAYOUT.TRADE_TABS_Y,
      "",
      "SELL",
    );

    // Content Container
    this.uiContainer = this.add.container(0, 0);

    // Reactive bindings
    this.gameStateManager.subscribeGold(() => this.refresh());
    this.gameStateManager.subscribeInventory(() => this.refresh());
    this.gameStateManager.subscribeAchievements(() => this.refresh());
    this.gameStateManager.subscribeUpgrades(() => this.refresh());
    this.localeManager.subscribeLocale(() => this.refresh());

    // Listen for wake event to reset view
    this.events.on("wake", () => {
      this.currentTab = "BUY";
      this.refresh();
    });
  }

  private createTab(x: number, y: number, text: string, type: "BUY" | "SELL") {
    const bg =
      type === this.currentTab
        ? `#${this.ACCENT_COLOR.toString(16)}`
        : "#636e72";
    return this.add
      .text(x, y, text, {
        ...STYLES.UI_LABEL,
        fontSize: "28px",
        backgroundColor: bg,
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.currentTab = type;
        this.refresh();
      });
  }

  private refresh() {
    if (!this.uiContainer) return; // Prevent refresh before create

    // Update Static Text
    if (this.titleText)
      this.titleText.setText(this.localeManager.get("TAB_TRADE"));
    if (this.tabBuyBtn)
      this.tabBuyBtn.setText(this.localeManager.get("TRADE_BUY"));
    if (this.tabSellBtn)
      this.tabSellBtn.setText(this.localeManager.get("TRADE_SELL"));

    // Update Tab Styles
    const activeBg = `#${this.ACCENT_COLOR.toString(16)}`;
    if (this.tabBuyBtn)
      this.tabBuyBtn.setStyle({
        backgroundColor: this.currentTab === "BUY" ? activeBg : "#636e72",
      });
    if (this.tabSellBtn)
      this.tabSellBtn.setStyle({
        backgroundColor: this.currentTab === "SELL" ? activeBg : "#636e72",
      });

    // Clear previous content
    this.uiContainer.removeAll(true);

    if (this.currentTab === "BUY") {
      this.renderBuyView();
    } else {
      this.renderSellView();
    }
  }

  private renderBuyView() {
    let currentY = LAYOUT.TRADE_LIST_START_Y;

    // Render Items
    const itemIds = Object.keys(ITEMS);
    itemIds.forEach((id) => {
      const item = ITEMS[id];
      this.renderTradeItem(
        this.localeManager.get(item.displayNameKey),
        item.buyPrice,
        item.icon,
        currentY,
        () => {
          GameActions.buyItem(this.gameStateManager, item.id);
        },
        "BUY",
        this.gameStateManager.getItemCount(id),
      );
      currentY += LAYOUT.TRADE_ITEM_SPACING;
    });

    // Render Upgrades
    const upgradeIds = Object.keys(UPGRADES);
    upgradeIds.forEach((id) => {
      const upgrade = UPGRADES[id];
      const isUnlocked =
        !upgrade.requirementAchievementId ||
        this.gameStateManager.hasAchievement(upgrade.requirementAchievementId);
      const isPurchased = this.gameStateManager.hasUpgrade(id);

      if (isUnlocked && !isPurchased) {
        this.renderTradeItem(
          this.localeManager.get(upgrade.displayNameKey),
          upgrade.cost,
          "tile_ground",
          currentY,
          () => {
            GameActions.buyUpgrade(this.gameStateManager, id);
          },
          "BUY",
        );
        currentY += LAYOUT.TRADE_ITEM_SPACING;
      }
    });
  }

  private renderSellView() {
    const itemIds = Object.keys(ITEMS).filter(
      (id) => this.gameStateManager.getItemCount(id) > 0,
    );
    let currentY = LAYOUT.TRADE_LIST_START_Y;

    if (itemIds.length === 0) {
      const emptyText = this.add
        .text(
          LAYOUT.CENTER_X,
          currentY,
          this.localeManager.get("TRADE_EMPTY_SELL"),
          STYLES.UI_LABEL,
        )
        .setOrigin(0.5);
      this.uiContainer.add(emptyText);
      return;
    }

    itemIds.forEach((id) => {
      const item = ITEMS[id];
      const sellPrice = Math.floor(item.buyPrice * 0.5);

      this.renderTradeItem(
        this.localeManager.get(item.displayNameKey),
        sellPrice,
        item.icon,
        currentY,
        () => {
          GameActions.sellItem(this.gameStateManager, id);
        },
        "SELL",
        this.gameStateManager.getItemCount(id),
      );
      currentY += LAYOUT.TRADE_ITEM_SPACING;
    });
  }

  private renderTradeItem(
    name: string,
    price: number,
    iconKey: string,
    y: number,
    onAction: () => void,
    actionType: "BUY" | "SELL",
    count?: number,
  ) {
    // Icon
    const icon = this.add.sprite(130, y, iconKey);
    this.uiContainer.add(icon);

    // Inventory Count (optional)
    if (count !== undefined) {
      const countText = this.add
        .text(80, y, `${count}`, STYLES.UI_LABEL)
        .setOrigin(0.5);
      this.uiContainer.add(countText);
    }

    // Name & Price
    const nameText = this.add
      .text(180, y - 40, name, {
        ...STYLES.BUTTON,
        padding: { x: 0, y: 0 },
        wordWrap: { width: 320 },
      })
      .setOrigin(0, 0);

    const priceY = nameText.y + nameText.displayHeight + 5;

    const priceLabel = this.add
      .text(180, priceY, this.localeManager.get("TRADE_PRICE"), STYLES.PRICE)
      .setOrigin(0, 0);
    const priceValue = this.add
      .text(priceLabel.x + priceLabel.width, priceY, `${price}`, STYLES.PRICE)
      .setOrigin(0, 0);
    const priceIcon = this.add
      .sprite(priceValue.x + priceValue.width + 0, priceY + 12, "ui_gold")
      .setOrigin(0, 0.5);
    priceIcon.setScale(50 / priceIcon.width);

    this.uiContainer.add([nameText, priceLabel, priceValue, priceIcon]);

    // Action Button
    let btnText: string;
    let bgColor: string;
    let canAfford = true;

    if (actionType === "BUY") {
      canAfford = this.gameStateManager.gold >= price;
      btnText = this.localeManager.get("TRADE_BUY");
      bgColor = canAfford ? "#2ecc71" : "#7f8c8d";
    } else {
      btnText = this.localeManager.get("TRADE_SELL");
      bgColor = "#e74c3c";
    }

    const actionBtn = this.add
      .text(570, y, btnText, {
        ...STYLES.UI_LABEL,
        fontSize: "28px",
        backgroundColor: bgColor,
        padding: { x: actionType === "BUY" ? 20 : 10, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    if (canAfford || actionType === "SELL") {
      actionBtn.on("pointerdown", onAction);
    }

    itemIds.forEach((id) => {
      const item = ITEMS[id];
      const sellPrice = Math.floor(item.buyPrice * 0.5);

      // Icon
      const icon = this.add.sprite(130, currentY, item.icon);
      this.uiContainer.add(icon);

      // Inventory Count
      const count = this.gameStateManager.getItemCount(id);
      const countText = this.add
        .text(80, currentY, `${count}`, STYLES.UI_LABEL)
        .setOrigin(0.5);
      this.uiContainer.add(countText);

      // Name & Price
      const nameText = this.add
        .text(180, currentY - 40, this.localeManager.get(item.displayNameKey), {
          ...STYLES.BUTTON,
          padding: { x: 0, y: 0 },
          wordWrap: { width: 320 },
        })
        .setOrigin(0, 0);

      const priceY = nameText.y + nameText.displayHeight + 5;

      const priceLabel = this.add
        .text(180, priceY, this.localeManager.get("TRADE_PRICE"), STYLES.PRICE)
        .setOrigin(0, 0);
      const priceValue = this.add
        .text(
          priceLabel.x + priceLabel.width,
          priceY,
          `${sellPrice}`,
          STYLES.PRICE,
        )
        .setOrigin(0, 0);
      const priceIcon = this.add
        .sprite(priceValue.x + priceValue.width + 0, priceY + 12, "ui_gold")
        .setOrigin(0, 0.5);
      priceIcon.setScale(50 / priceIcon.width);

      this.uiContainer.add([nameText, priceLabel, priceValue, priceIcon]);

      // Sell Button
      const sellBtnText = this.localeManager.get("TRADE_SELL");
      const sellBtn = this.add
        .text(570, currentY, sellBtnText, {
          ...STYLES.UI_LABEL,
          fontSize: "28px",
          backgroundColor: "#e74c3c",
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          GameActions.sellItem(this.gameStateManager, id);
        });
      this.uiContainer.add(sellBtn);

      currentY += LAYOUT.TRADE_ITEM_SPACING;
    });
  }
}
