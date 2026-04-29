import Phaser from "phaser";
import { GameStateManager } from "../managers/GameStateManager";
import { LocaleManager } from "../managers/LocaleManager";
import { Events } from "../constants/Events";
import { MainScene } from "./MainScene";
import { NavigationBar } from "../ui/components/NavigationBar";
import type { NavTab } from "../ui/components/NavigationBar";
import { TopBar } from "../ui/components/TopBar";
import { MenuOverlay } from "../ui/components/MenuOverlay";
import { InventoryList } from "../ui/components/InventoryList";
import { RadialTimer } from "../ui/components/RadialTimer";
import { LAYOUT } from "../constants/Layout";

import { AchievementPopup } from "../ui/components/AchievementPopup";

export class UIScene extends Phaser.Scene {
  private navBar!: NavigationBar;
  private menuOverlay!: MenuOverlay;
  private inventoryList!: InventoryList;
  private radialTimer!: RadialTimer;
  private achievementPopup!: AchievementPopup;

  private activeTab: NavTab = 'GARDEN';
  private gameStateManager!: GameStateManager;
  private localeManager!: LocaleManager;

  constructor() {
    super("UIScene");
  }

  create() {
    this.gameStateManager = this.registry.get("gameStateManager") as GameStateManager;
    this.localeManager = this.registry.get("localeManager") as LocaleManager;

    // 1. Top Bar (Gold + Hamburger)
    new TopBar(this, this.gameStateManager, this.localeManager, () => this.menuOverlay.toggle());

    // 2. Navigation Bar
    this.navBar = new NavigationBar(this, this.localeManager, LAYOUT.NAV_BAR_Y, (tab) => this.switchTab(tab));

    // 3. Menu Overlay
    this.menuOverlay = new MenuOverlay(this, this.localeManager, () => {
        this.gameStateManager.reset();
        this.navBar.setActiveTab('GARDEN');
        this.switchTab('GARDEN');
    });

    // 4. Inventory List
    this.inventoryList = new InventoryList(this, this.gameStateManager);

    // 5. Radial Timer
    this.radialTimer = new RadialTimer(this);

    // 6. Achievement Popup
    this.achievementPopup = new AchievementPopup(this, this.localeManager, () => {
        this.navBar.setActiveTab('ACHIEVEMENTS');
        this.switchTab('ACHIEVEMENTS');
    });

    // Listen for Achievement Unlock
    this.gameStateManager.on(Events.ACHIEVEMENT_UNLOCKED, (id: string) => {
        this.achievementPopup.show(id);
    });

    const mainScene = this.scene.get("MainScene") as MainScene;
    if (mainScene) {
      mainScene.events.on(Events.PULSE_PROGRESS, (progress: number) => {
        this.radialTimer.drawProgress(progress);
      });
    }

    // Initial Visibility
    this.updateGardenElementsVisibility();
  }

  private switchTab(tab: NavTab) {
      if (this.activeTab === tab) return;

      this.activeTab = tab;
      this.updateGardenElementsVisibility();

      const tabs: Record<NavTab, string> = {
          'GARDEN': 'MainScene',
          'TRADE': 'TradeScene',
          'ACHIEVEMENTS': 'AchievementsScene',
          'ATLAS': 'AtlasScene'
      };

      Object.entries(tabs).forEach(([key, sceneKey]) => {
          if (key === tab) {
              this.activateScene(key as NavTab, sceneKey);
          } else {
              this.deactivateScene(key as NavTab, sceneKey);
          }
      });

      this.scene.bringToTop('UIScene');
  }

  private activateScene(tab: NavTab, sceneKey: string) {
      if (tab === 'GARDEN') {
          const mainScene = this.scene.get(sceneKey);
          if (mainScene.scene.isPaused()) {
              this.scene.resume(sceneKey);
          }
      } else {
          const targetScene = this.scene.get(sceneKey);
          if (targetScene.scene.isSleeping()) {
              this.scene.wake(sceneKey);
          } else if (!this.scene.isActive(sceneKey)) {
              this.scene.launch(sceneKey);
          }
      }
      this.scene.setVisible(true, sceneKey);
      this.scene.bringToTop(sceneKey);
  }

  private deactivateScene(tab: NavTab, sceneKey: string) {
      if (tab === 'GARDEN') {
          const mainScene = this.scene.get(sceneKey);
          if (this.scene.isActive(sceneKey) && !mainScene.scene.isPaused() && !mainScene.scene.isSleeping()) {
              this.scene.pause(sceneKey);
          }
      } else {
          const targetScene = this.scene.get(sceneKey);
          if (this.scene.isActive(sceneKey) && !targetScene.scene.isSleeping()) {
              this.scene.sleep(sceneKey);
          }
      }
      this.scene.setVisible(false, sceneKey);
  }

  private updateGardenElementsVisibility() {
      const isGarden = this.activeTab === 'GARDEN';
      this.radialTimer.setVisible(isGarden);
      this.inventoryList.setVisible(isGarden);
  }
}
