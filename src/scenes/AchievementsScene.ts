import Phaser from 'phaser';
import { STYLES } from '../constants/Styles';
import { ACHIEVEMENTS } from '../types';
import { GameStateManager } from '../managers/GameStateManager';
import { LocaleManager } from '../managers/LocaleManager';
import { LAYOUT } from '../constants/Layout';

export class AchievementsScene extends Phaser.Scene {
    private gameStateManager!: GameStateManager;
    private localeManager!: LocaleManager;
    private uiContainer!: Phaser.GameObjects.Container;

    constructor() {
        super('AchievementsScene');
    }

    create() {
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;
        this.localeManager = this.registry.get('localeManager') as LocaleManager;

        // Fullscreen background overlay
        this.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x2d3436, 1)
            .setInteractive(); // Block input

        // Title
        this.add.text(LAYOUT.CENTER_X, LAYOUT.ACHIEVEMENTS_TITLE_Y, this.localeManager.get('TAB_ACHIEVEMENTS'), STYLES.TITLE).setOrigin(0.5);

        this.uiContainer = this.add.container(0, 0);
        this.renderAchievements();
        
        this.events.on('wake', () => this.renderAchievements());
    }

    private renderAchievements() {
        this.uiContainer.removeAll(true);
        
        let currentY = LAYOUT.ACHIEVEMENTS_LIST_START_Y;
        const achievementsList = Object.values(ACHIEVEMENTS);

        achievementsList.forEach(ach => {
            const isUnlocked = this.gameStateManager.hasAchievement(ach.id);
            const iconKey = isUnlocked ? 'badge_collected' : 'badge_uncollected';
            const textColor = isUnlocked ? '#ffffff' : '#7f8c8d';

            const container = this.add.container(50, currentY);

            // Line 1: [Icon] Title [Check]
            const icon = this.add.sprite(0, 0, iconKey).setScale(1); 
            const title = this.add.text(60, 0, this.localeManager.get(ach.titleKey).toUpperCase(), {
                fontFamily: 'Fredoka',
                fontSize: '32px',
                fontStyle: 'bold',
                color: textColor
            }).setOrigin(0, 0.5);
            
            const line1Elements: Phaser.GameObjects.GameObject[] = [icon, title];
            if (isUnlocked) {
                const check = this.add.text(title.x + title.width + 10, 0, '✔️', { fontSize: '32px' }).setOrigin(0, 0.5);
                line1Elements.push(check);
            }

            // Line 2: Description
            const desc = this.add.text(60, 40, this.localeManager.get(ach.descriptionKey), {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                fontStyle: 'italic',
                color: textColor,
                wordWrap: { width: 600 }
            }).setOrigin(0, 0);

            // Line 3: Bonus
            const bonusLabel = this.add.text(60, desc.y + desc.displayHeight + 10, this.localeManager.get('ACHIEVEMENT_UNLOCKS'), {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                fontStyle: 'bold',
                color: isUnlocked ? '#f1c40f' : '#7f8c8d'
            }).setOrigin(0, 0);
            
            const bonusValue = this.add.text(bonusLabel.x + bonusLabel.width, bonusLabel.y, this.localeManager.get(ach.rewardDescriptionKey), {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                color: isUnlocked ? '#f1c40f' : '#7f8c8d'
            }).setOrigin(0, 0);

            container.add([...line1Elements, desc, bonusLabel, bonusValue]);
            this.uiContainer.add(container);

            currentY += LAYOUT.ACHIEVEMENTS_ITEM_SPACING;
        });
    }
}
