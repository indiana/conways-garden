import Phaser from "phaser";
import { STYLES } from "../../constants/Styles";
import { LAYOUT } from "../../constants/Layout";
import { GameStateManager } from "../../managers/GameStateManager";
import { LocaleManager } from "../../managers/LocaleManager";

export class TopBar extends Phaser.GameObjects.Container {
  private goldText: Phaser.GameObjects.Text;
  private goldIcon: Phaser.GameObjects.Sprite;
  private onMenuClick: () => void;
  private localeManager: LocaleManager;

  constructor(
    scene: Phaser.Scene,
    gsm: GameStateManager,
    localeManager: LocaleManager,
    onMenuClick: () => void,
  ) {
    super(scene, 0, 0);
    this.onMenuClick = onMenuClick;
    this.localeManager = localeManager;

    // Gold Display
    const y = LAYOUT.TOP_BAR_Y;
    this.goldText = scene.add.text(40, y, "0", STYLES.GOLD).setOrigin(0, 0.5);
    this.goldIcon = scene.add.sprite(0, y, "ui_gold").setOrigin(0, 0.5);
    this.goldIcon.setScale(75 / this.goldIcon.width);

    // Hamburger Icon
    const menuX = LAYOUT.WIDTH - 40;
    const menuY = y;
    const menuSize = 40;
    const menuGraphics = scene.add.graphics();

    // Hamburger lines
    menuGraphics.lineStyle(4, 0xffffff, 1);
    const mY = menuY - menuSize / 2;
    menuGraphics.beginPath();
    menuGraphics.moveTo(menuX - menuSize / 2, mY + 10);
    menuGraphics.lineTo(menuX + menuSize / 2, mY + 10);
    menuGraphics.moveTo(menuX - menuSize / 2, mY + 20);
    menuGraphics.lineTo(menuX + menuSize / 2, mY + 20);
    menuGraphics.moveTo(menuX - menuSize / 2, mY + 30);
    menuGraphics.lineTo(menuX + menuSize / 2, mY + 30);
    menuGraphics.strokePath();

    const hitArea = scene.add
      .zone(menuX, menuY, menuSize + 20, menuSize + 20)
      .setInteractive({ useHandCursor: true });
    hitArea.on("pointerdown", () => this.onMenuClick());
    hitArea.on("pointerover", () => {
        menuGraphics.setAlpha(0.8);
    });
    hitArea.on("pointerout", () => {
        menuGraphics.setAlpha(1.0);
    });

    this.add([this.goldText, this.goldIcon, menuGraphics, hitArea]);

    // Subscribe to gold changes
    gsm.subscribeGold((gold) => this.updateGold(gold));

    // Refresh on locale change (if top bar had text other than numbers)
    this.localeManager.subscribeLocale(() => {});

    scene.add.existing(this);
  }

  private updateGold(gold: number) {
    this.goldText.setText(`${gold}`);
    this.goldIcon.setX(this.goldText.x + this.goldText.width + 10);
  }
}
