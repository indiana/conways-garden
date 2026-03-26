import Phaser from 'phaser';
import { ACHIEVEMENTS } from '../types';
import { GameStateManager } from '../managers/GameStateManager';
import { LocaleManager } from '../managers/LocaleManager';
import { LAYOUT } from '../constants/Layout';
import { ScrollablePanel } from '../ui/components/ScrollablePanel';

export class AchievementsScene extends Phaser.Scene {
    private gameStateManager!: GameStateManager;
    private localeManager!: LocaleManager;
    private scrollPanel!: ScrollablePanel;

    constructor() {
        super('AchievementsScene');
    }

    create() {
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;
        this.localeManager = this.registry.get('localeManager') as LocaleManager;

        this.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x2d3436, 1)
            .setInteractive();

        this.add.text(LAYOUT.CENTER_X, LAYOUT.ACHIEVEMENTS_TITLE_Y, '', {
            fontFamily: 'Comfortaa, sans-serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setName('titleText');

        this.scrollPanel = new ScrollablePanel(this, LAYOUT.SCROLL_TOP, LAYOUT.SCROLL_BOTTOM);

        this.gameStateManager.subscribeAchievements(() => this.renderAchievements());
        this.localeManager.subscribeLocale(() => this.refresh());
        this.events.on('wake', () => this.refresh());

        this.refresh();
    }

    private refresh() {
        const titleText = this.children.getByName('titleText') as Phaser.GameObjects.Text;
        if (titleText) {
            titleText.setText(this.localeManager.get('TAB_ACHIEVEMENTS'));
        }
        this.renderAchievements();
    }

    private renderAchievements() {
        const container = this.scrollPanel.getContainer();
        this.scrollPanel.clearContent();

        let currentY = LAYOUT.SCROLL_TOP + 30;
        const achievementsList = Object.values(ACHIEVEMENTS);

        achievementsList.forEach(ach => {
            const isUnlocked = this.gameStateManager.hasAchievement(ach.id);
            const iconKey = isUnlocked ? 'badge_collected' : 'badge_uncollected';
            const textColor = isUnlocked ? '#ffffff' : '#7f8c8d';

            const itemContainer = this.add.container(50, currentY);

            const icon = this.add.sprite(0, 0, iconKey).setScale(1);
            const title = this.add.text(60, 0, this.localeManager.get(ach.titleKey).toUpperCase(), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '32px',
                fontStyle: 'bold',
                color: textColor
            }).setOrigin(0, 0.5);

            const line1Elements: Phaser.GameObjects.GameObject[] = [icon, title];
            if (isUnlocked) {
                const check = this.add.text(title.x + title.width + 10, 0, '✔️', { fontSize: '32px' }).setOrigin(0, 0.5);
                line1Elements.push(check);
            }

            const desc = this.add.text(60, 40, this.localeManager.get(ach.descriptionKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '24px',
                fontStyle: 'italic',
                color: textColor,
                wordWrap: { width: 600 }
            }).setOrigin(0, 0);

            const bonusLabelWidth = 200;
            const bonusValueWidth = 600 - bonusLabelWidth;
            
            const bonusLabel = this.add.text(60, desc.y + desc.displayHeight + 10, this.localeManager.get('ACHIEVEMENT_UNLOCKS'), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '24px',
                fontStyle: 'bold',
                color: isUnlocked ? '#f1c40f' : '#7f8c8d'
            }).setOrigin(0, 0);

            const bonusValue = this.add.text(bonusLabel.x + bonusLabel.width, bonusLabel.y, this.localeManager.get(ach.rewardDescriptionKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '24px',
                color: isUnlocked ? '#f1c40f' : '#7f8c8d',
                wordWrap: { width: bonusValueWidth }
            }).setOrigin(0, 0);

            itemContainer.add([...line1Elements, desc, bonusLabel, bonusValue]);
            container.add(itemContainer);

            const itemHeight = Math.max(bonusLabel.y + bonusValue.displayHeight, desc.y + desc.displayHeight) + 50;
            currentY += itemHeight;
        });

        this.scrollPanel.setContentHeight(currentY);
        this.scrollPanel.resetScroll();
    }
}
