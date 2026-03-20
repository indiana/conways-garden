import Phaser from 'phaser';
import { STYLES } from '../constants/Styles';
import { ACHIEVEMENTS } from '../types';
import { GameStateManager } from '../managers/GameStateManager';

export class AchievementsScene extends Phaser.Scene {
    private gameStateManager!: GameStateManager;
    private uiContainer!: Phaser.GameObjects.Container;

    constructor() {
        super('AchievementsScene');
    }

    create() {
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;

        // Fullscreen background overlay
        this.add.rectangle(360, 640, 720, 1280, 0x2d3436, 1)
            .setInteractive(); // Block input

        // Title
        this.add.text(360, 150, 'OSIĄGNIĘCIA', STYLES.TITLE).setOrigin(0.5);

        this.uiContainer = this.add.container(0, 0);
        this.renderAchievements();
        
        this.events.on('wake', () => this.renderAchievements());
    }

    private renderAchievements() {
        this.uiContainer.removeAll(true);
        
        let currentY = 300;
        const achievementsList = Object.values(ACHIEVEMENTS);

        achievementsList.forEach(ach => {
            const isUnlocked = this.gameStateManager.hasAchievement(ach.id);
            const iconKey = isUnlocked ? 'badge_collected' : 'badge_uncollected';
            const textColor = isUnlocked ? '#ffffff' : '#7f8c8d';

            // Moved container to the left (e.g. 50 instead of 360)
            const container = this.add.container(50, currentY);

            // Line 1: [Icon] Title [Check]
            const icon = this.add.sprite(0, 0, iconKey).setScale(1); // Scaled appropriately
            const title = this.add.text(60, 0, ach.title.toUpperCase(), {
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
            const desc = this.add.text(60, 40, ach.description, {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                fontStyle: 'italic',
                color: textColor,
                wordWrap: { width: 600 }
            }).setOrigin(0, 0);

            // Line 3: Bonus
            const bonusLabel = this.add.text(60, desc.y + desc.displayHeight + 10, 'ODBLOKOWUJE: ', {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                fontStyle: 'bold',
                color: isUnlocked ? '#f1c40f' : '#7f8c8d'
            }).setOrigin(0, 0);
            
            const bonusValue = this.add.text(bonusLabel.x + bonusLabel.width, bonusLabel.y, ach.rewardDescription, {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                color: isUnlocked ? '#f1c40f' : '#7f8c8d'
            }).setOrigin(0, 0);

            container.add([...line1Elements, desc, bonusLabel, bonusValue]);
            this.uiContainer.add(container);

            currentY += 200;
        });
    }
}
