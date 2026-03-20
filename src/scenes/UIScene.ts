import Phaser from "phaser";
import { GameStateManager } from "../managers/GameStateManager";
import { Events } from "../constants/Events";
import { MainScene } from "./MainScene";
import { STYLES } from "../constants/Styles";

type NavTab = 'GARDEN' | 'TRADE' | 'ACHIEVEMENTS' | 'ATLAS';

export class UIScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private goldIcon!: Phaser.GameObjects.Sprite;
  private timerGraphics!: Phaser.GameObjects.Graphics;

  // Inventory UI
  private inventoryGroup!: Phaser.GameObjects.Group;
  private selectionFrames: Record<string, Phaser.GameObjects.Graphics> = {};
  private countTexts: Record<string, Phaser.GameObjects.Text> = {};
  
  // Navigation UI
  private activeTab: NavTab = 'GARDEN';
  private navButtons: Record<NavTab, Phaser.GameObjects.Sprite> = {} as any;

  private gameStateManager!: GameStateManager;

  private readonly UI_CENTER_X = 360;
  private readonly TIMER_Y = 150;
  
  // Inventory Layout
  private readonly LIST_X = 168; // Aligned with grid left
  private readonly LIST_START_Y = 820; // Moved up from 900
  private readonly ITEM_SPACING = 110; // Decreased from 140
  private readonly SLOT_WIDTH = 280; 
  private readonly SLOT_HEIGHT = 100; // Decreased from 120

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

    // Initialize Inventory Group
    this.inventoryGroup = this.add.group();
    this.createInventoryList();

    // Initial Inventory Sync
    this.updateInventoryCounts(this.gameStateManager.inventory);
    this.updateSelectionHighlight();

    // Radial Timer
    this.timerGraphics = this.add.graphics();
    this.drawTimer(0);
    
    // Create Navigation Bar
    this.createNavBar();

    const mainScene = this.scene.get("MainScene") as MainScene;
    if (mainScene) {
      mainScene.events.on(Events.PULSE_PROGRESS, (progress: number) => {
        this.drawTimer(progress);
      });
    }

    // Initial Visibility
    this.updateGardenElementsVisibility();
  }

  private createNavBar() {
      const y = 1280 - 100; // Position from bottom
      const spacing = 170;  // Horizontal spacing
      const startX = 360 - (spacing * 1.5); 

      this.navButtons.GARDEN = this.createNavButton(startX, y, 'btn_garden', 'GARDEN');
      this.navButtons.TRADE = this.createNavButton(startX + spacing, y, 'btn_trade', 'TRADE');
      this.navButtons.ACHIEVEMENTS = this.createNavButton(startX + spacing * 2, y, 'btn_achievements', 'ACHIEVEMENTS');
      this.navButtons.ATLAS = this.createNavButton(startX + spacing * 3, y, 'btn_atlas', 'ATLAS');

      this.updateNavVisuals();
  }

  private createNavButton(x: number, y: number, key: string, tab: NavTab) {
      const btn = this.add.sprite(x, y, key).setInteractive();
      btn.setScale(160 / btn.width); // Normalize width to ~160px
      btn.on('pointerdown', () => this.switchTab(tab));
      return btn;
  }

  private switchTab(tab: NavTab) {
      if (this.activeTab === tab) return;

      this.activeTab = tab;
      this.updateNavVisuals();
      this.updateGardenElementsVisibility();

      const tabs: Record<NavTab, string> = {
          'GARDEN': 'MainScene',
          'TRADE': 'TradeScene',
          'ACHIEVEMENTS': 'AchievementsScene',
          'ATLAS': 'AtlasScene'
      };

      const mainScene = this.scene.get('MainScene');

      // 1. Handle MainScene (Garden) separately to avoid redundancy
      if (tab === 'GARDEN') {
          if (mainScene.scene.isPaused()) {
              this.scene.resume('MainScene');
          }
          this.scene.setVisible(true, 'MainScene');
          this.scene.bringToTop('MainScene');
      } else {
          // Check if it is running (active and not paused/sleeping) before pausing
          if (this.scene.isActive('MainScene') && !mainScene.scene.isPaused() && !mainScene.scene.isSleeping()) {
              this.scene.pause('MainScene');
          }
          this.scene.setVisible(false, 'MainScene');
      }

      // 2. Handle other scenes
      Object.entries(tabs).forEach(([key, sceneKey]) => {
          if (key === 'GARDEN') return; // Handled above

          const targetScene = this.scene.get(sceneKey);
          if (key === tab) {
              // Activate Target
              if (targetScene.scene.isSleeping()) {
                  this.scene.wake(sceneKey);
              } else if (!this.scene.isActive(sceneKey)) {
                  this.scene.launch(sceneKey);
              }
              this.scene.setVisible(true, sceneKey);
              this.scene.bringToTop(sceneKey);
          } else {
              // Deactivate others
              if (this.scene.isActive(sceneKey) && !targetScene.scene.isSleeping()) {
                  this.scene.sleep(sceneKey);
              }
              this.scene.setVisible(false, sceneKey);
          }
      });

      this.scene.bringToTop('UIScene');
  }
  private updateGardenElementsVisibility() {
      const isGarden = this.activeTab === 'GARDEN';
      this.timerGraphics.setVisible(isGarden);
      this.inventoryGroup.setVisible(isGarden);
  }

  private updateNavVisuals() {
      // Reset all to default
      this.navButtons.GARDEN.setTexture('btn_garden');
      this.navButtons.TRADE.setTexture('btn_trade');
      this.navButtons.ACHIEVEMENTS.setTexture('btn_achievements');
      this.navButtons.ATLAS.setTexture('btn_atlas');

      // Set active
      switch (this.activeTab) {
          case 'GARDEN': this.navButtons.GARDEN.setTexture('btn_garden_active'); break;
          case 'TRADE': this.navButtons.TRADE.setTexture('btn_trade_active'); break;
          case 'ACHIEVEMENTS': this.navButtons.ACHIEVEMENTS.setTexture('btn_achievements_active'); break;
          case 'ATLAS': this.navButtons.ATLAS.setTexture('btn_atlas_active'); break;
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
      this.inventoryGroup.add(frame);

      // Interactive Zone
      const zone = this.add.zone(x + this.SLOT_WIDTH / 2 - 20, y, this.SLOT_WIDTH, this.SLOT_HEIGHT).setOrigin(0.5).setInteractive();
      zone.on('pointerdown', () => {
          this.gameStateManager.selectedItem = itemId;
          this.updateSelectionHighlight();
      });
      this.inventoryGroup.add(zone);

      // Icon
      const icon = this.add.sprite(x, y, iconKey).setScale(1.2).setOrigin(0, 0.5);
      this.inventoryGroup.add(icon);

      // Count Text
      const text = this.add.text(x + 110, y, 'x0', STYLES.INVENTORY).setOrigin(0, 0.5);
      this.countTexts[itemId] = text;
      this.inventoryGroup.add(text);
  }

  private updateSelectionHighlight() {
      const selectedItem = this.gameStateManager.selectedItem;
      
      Object.keys(this.selectionFrames).forEach(itemId => {
          const frame = this.selectionFrames[itemId];
          const index = itemId === 'turnip' ? 0 : 1; 
          const x = this.LIST_X - 10;
          const y = this.LIST_START_Y + (index * this.ITEM_SPACING);

          frame.clear();
          
          if (itemId === selectedItem) {
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
}
