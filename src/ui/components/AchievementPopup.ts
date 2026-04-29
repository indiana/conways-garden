import Phaser from "phaser";
import { ACHIEVEMENTS } from "../../types";
import { LocaleManager } from "../../managers/LocaleManager";
import { LAYOUT } from "../../constants/Layout";

export class AchievementPopup extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private icon: Phaser.GameObjects.Sprite;
  private title: Phaser.GameObjects.Text;
  private desc: Phaser.GameObjects.Text;
  private localeManager: LocaleManager;
  private onClick: () => void;
  private isVisible: boolean = false;
  private hideTimer?: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    localeManager: LocaleManager,
    onClick: () => void,
  ) {
    super(scene, LAYOUT.CENTER_X, -200); // Start off-screen
    this.localeManager = localeManager;
    this.onClick = onClick;

    // Background
    this.bg = scene.add
      .rectangle(0, 0, 600, 120, 0x2d3436, 0.95)
      .setStrokeStyle(4, 0xf1c40f)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleClick());

    // Icon
    this.icon = scene.add.sprite(-250, 0, "badge_collected");
    this.icon.setScale(0.8);

    // Title
    this.title = scene.add
      .text(-180, -25, "", {
        fontFamily: "Comfortaa",
        fontSize: "28px",
        fontStyle: "bold",
        color: "#f1c40f",
      })
      .setOrigin(0, 0.5);

    // Description
    this.desc = scene.add
      .text(-180, 15, "", {
        fontFamily: "Comfortaa",
        fontSize: "18px",
        color: "#ffffff",
        wordWrap: { width: 400 },
      })
      .setOrigin(0, 0);

    this.add([this.bg, this.icon, this.title, this.desc]);
    scene.add.existing(this);
  }

  public show(achievementId: string) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    // Update Content
    this.title.setText(
      this.localeManager.get(achievement.titleKey).toUpperCase(),
    );
    this.desc.setText(this.localeManager.get(achievement.descriptionKey));

    // If already visible, just update content and reset timer
    if (this.isVisible) {
      if (this.hideTimer) this.hideTimer.remove();
      this.startHideTimer();
      return;
    }

    this.isVisible = true;

    // Animate In
    this.scene.tweens.add({
      targets: this,
      y: 80, // Target position (below TopBar)
      duration: 500,
      ease: "Back.easeOut",
      onComplete: () => this.startHideTimer(),
    });
  }

  private startHideTimer() {
    this.hideTimer = this.scene.time.delayedCall(3000, () => {
      this.hide();
    });
  }

  private hide() {
    this.isVisible = false;
    this.scene.tweens.add({
      targets: this,
      y: -200,
      duration: 500,
      ease: "Back.easeIn",
    });
  }

  private handleClick() {
    if (this.isVisible) {
      this.onClick();
      this.hide();
    }
  }
}
