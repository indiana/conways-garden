import Phaser from "phaser";
import { PLANT_ITEMS } from "../types";
import { LocaleManager } from "../managers/LocaleManager";
import { LAYOUT } from "../constants/Layout";
import { ScrollablePanel } from "../ui/components/ScrollablePanel";
import {
  TAG_COLORS,
  TAG_BG_COLOR,
  TAG_BORDER_COLOR,
} from "../constants/TagStyles";

export class AtlasScene extends Phaser.Scene {
  private localeManager!: LocaleManager;
  private scrollPanel!: ScrollablePanel;

  constructor() {
    super("AtlasScene");
  }

  create() {
    this.localeManager = this.registry.get("localeManager") as LocaleManager;

    // Background (always at bottom)
    const background = this.add.image(
      LAYOUT.CENTER_X,
      LAYOUT.CENTER_Y,
      "background",
    );
    background.setDepth(-100);

    this.add
      .text(LAYOUT.CENTER_X, LAYOUT.ATLAS_TITLE_Y, "", {
        fontFamily: "Comfortaa, sans-serif",
        fontSize: "48px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setName("titleText");

    this.scrollPanel = new ScrollablePanel(
      this,
      LAYOUT.SCROLL_TOP,
      LAYOUT.SCROLL_BOTTOM,
    );

    this.localeManager.subscribeLocale(() => this.refresh());
    this.events.on("wake", () => this.refresh());

    this.refresh();
  }

  private refresh() {
    const titleText = this.children.getByName(
      "titleText",
    ) as Phaser.GameObjects.Text;
    if (titleText) {
      titleText.setText(this.localeManager.get("TAB_ATLAS"));
    }

    const container = this.scrollPanel.getContainer();
    this.scrollPanel.clearContent();

    const plants = PLANT_ITEMS;
    let currentY = LAYOUT.SCROLL_TOP + 10;

    plants.forEach((plant, index) => {
      const icon = this.add.sprite(100, currentY + 40, plant.icon);
      icon.setScale(1.2);
      container.add(icon);

      const nameText = this.add
        .text(150, currentY, this.localeManager.get(plant.displayNameKey), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "32px",
          fontStyle: "bold",
          color: "#f1c40f",
        })
        .setOrigin(0, 0);
      container.add(nameText);

      const priceLabel = this.add
        .text(150, currentY + 55, this.localeManager.get("TRADE_PRICE"), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "24px",
          color: "#f1c40f",
        })
        .setOrigin(0, 0.5);
      const priceValue = this.add
        .text(
          priceLabel.x + priceLabel.width,
          currentY + 55,
          `${plant.buyPrice}`,
          {
            fontFamily: "Comfortaa, sans-serif",
            fontSize: "24px",
            color: "#f1c40f",
          },
        )
        .setOrigin(0, 0.5);
      const priceIcon = this.add
        .sprite(priceValue.x + priceValue.width + 5, currentY + 55, "ui_gold")
        .setOrigin(0, 0.5);
      priceIcon.setScale(40 / priceIcon.width);
      container.add([priceLabel, priceValue, priceIcon]);

      let tagX = 150;
      const tagY = currentY + 90;

      plant.tags.forEach((tag) => {
        const tagText = this.localeManager.get(`TAG_${tag.toUpperCase()}`);
        const padding = 12;
        const textStyle = {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "16px",
          color: "#ffffff",
        };
        const tempText = this.add.text(0, 0, tagText, textStyle);
        const tagWidth = tempText.width + padding * 2;
        const tagHeight = tempText.height + 6;
        tempText.destroy();

        const bg = this.add.graphics();
        bg.fillStyle(TAG_BG_COLOR, 1);
        bg.fillRoundedRect(tagX, tagY - tagHeight / 2, tagWidth, tagHeight, 8);
        bg.lineStyle(2, TAG_COLORS[tag] || TAG_BORDER_COLOR, 1);
        bg.strokeRoundedRect(
          tagX,
          tagY - tagHeight / 2,
          tagWidth,
          tagHeight,
          8,
        );

        const text = this.add
          .text(tagX + padding, tagY, tagText, textStyle)
          .setOrigin(0, 0.5);
        container.add([bg, text]);
        tagX += tagWidth + 10;
      });

      currentY += 130;
      const descText = this.add
        .text(70, currentY, this.localeManager.get(plant.descriptionKey), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "20px",
          color: "#dfe6e9",
          fontStyle: "italic",
          wordWrap: { width: 640 },
        })
        .setOrigin(0, 0);
      container.add(descText);
      currentY += descText.height + 20;

      const rulesLabel = this.add
        .text(70, currentY, this.localeManager.get("ATLAS_RULES"), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "20px",
          fontStyle: "bold",
          color: "#e74c3c",
        })
        .setOrigin(0, 0);

      const rulesText = this.add
        .text(255, currentY, this.localeManager.get(plant.rulesKey), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "20px",
          color: "#b2bec3",
          wordWrap: { width: 435 },
        })
        .setOrigin(0, 0);
      container.add([rulesLabel, rulesText]);
      currentY += rulesText.height + 20;

      const unlockLabel = this.add
        .text(70, currentY, this.localeManager.get("ATLAS_UNLOCK"), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "20px",
          fontStyle: "bold",
          color: "#2ecc71",
        })
        .setOrigin(0, 0);

      const unlockText = this.add
        .text(255, currentY, this.localeManager.get(plant.unlockKey), {
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "20px",
          color: "#b2bec3",
          wordWrap: { width: 435 },
        })
        .setOrigin(0, 0);
      container.add([unlockLabel, unlockText]);
      currentY += unlockText.height + 30;

      if (index < plants.length - 1) {
        const line = this.add
          .rectangle(LAYOUT.CENTER_X, currentY, 600, 2, 0x636e72)
          .setOrigin(0.5);
        container.add(line);
        currentY += 30;
      }
    });

    this.scrollPanel.setContentHeight(currentY);
    this.scrollPanel.resetScroll();
  }
}
