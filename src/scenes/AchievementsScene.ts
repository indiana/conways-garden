import Phaser from 'phaser';
import { ACHIEVEMENTS } from '../types';
import { GameStateManager } from '../managers/GameStateManager';
import { LocaleManager } from '../managers/LocaleManager';
import { LAYOUT } from '../constants/Layout';

export class AchievementsScene extends Phaser.Scene {
    private gameStateManager!: GameStateManager;
    private localeManager!: LocaleManager;
    private scrollContainer!: Phaser.GameObjects.Container;
    private scrollMask!: Phaser.Display.Masks.GeometryMask;
    private scrollOffset: number = 0;
    private contentHeight: number = 0;

    constructor() {
        super('AchievementsScene');
    }

    create() {
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;
        this.localeManager = this.registry.get('localeManager') as LocaleManager;

        // Fullscreen background overlay
        this.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x2d3436, 1)
            .setInteractive();

        // Title
        this.add.text(LAYOUT.CENTER_X, LAYOUT.ACHIEVEMENTS_TITLE_Y, '', {
            fontFamily: 'Comfortaa, sans-serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setName('titleText');

        // Create scroll mask area
        const maskGraphics = this.add.graphics();
        maskGraphics.fillStyle(0xffffff, 1);
        maskGraphics.fillRect(0, LAYOUT.ACHIEVEMENTS_SCROLL_TOP, LAYOUT.WIDTH, LAYOUT.ACHIEVEMENTS_SCROLL_BOTTOM - LAYOUT.ACHIEVEMENTS_SCROLL_TOP);
        this.scrollMask = maskGraphics.createGeometryMask();
        maskGraphics.setVisible(false);

        // Scrollable container with mask
        this.scrollContainer = this.add.container(0, 0);
        this.scrollContainer.setMask(this.scrollMask);

        // Mouse wheel scrolling
        this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
            this.handleScroll(deltaY);
        });

        // Touch/mouse drag scrolling
        let dragStartY = 0;
        let isDragging = false;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.y > LAYOUT.ACHIEVEMENTS_SCROLL_TOP && pointer.y < LAYOUT.ACHIEVEMENTS_SCROLL_BOTTOM) {
                isDragging = true;
                dragStartY = pointer.y + this.scrollOffset;
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (isDragging && pointer.y > LAYOUT.ACHIEVEMENTS_SCROLL_TOP && pointer.y < LAYOUT.ACHIEVEMENTS_SCROLL_BOTTOM) {
                const newOffset = dragStartY - pointer.y;
                this.setScrollOffset(newOffset);
            }
        });

        this.input.on('pointerup', () => {
            isDragging = false;
        });

        // Reactive bindings
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

    private handleScroll(deltaY: number) {
        const scrollSpeed = 30;
        const newOffset = this.scrollOffset + (deltaY > 0 ? scrollSpeed : -scrollSpeed);
        this.setScrollOffset(newOffset);
    }

    private setScrollOffset(value: number) {
        const maxScroll = Math.max(0, this.contentHeight - (LAYOUT.ACHIEVEMENTS_SCROLL_BOTTOM - LAYOUT.ACHIEVEMENTS_SCROLL_TOP));
        this.scrollOffset = Phaser.Math.Clamp(value, 0, maxScroll);
        this.scrollContainer.y = -this.scrollOffset;
    }

    private renderAchievements() {
        if (!this.scrollContainer) return;

        this.scrollContainer.removeAll(true);

        let currentY = 0;
        const startY = LAYOUT.ACHIEVEMENTS_SCROLL_TOP + 30;
        const achievementsList = Object.values(ACHIEVEMENTS);

        achievementsList.forEach(ach => {
            const isUnlocked = this.gameStateManager.hasAchievement(ach.id);
            const iconKey = isUnlocked ? 'badge_collected' : 'badge_uncollected';
            const textColor = isUnlocked ? '#ffffff' : '#7f8c8d';

            const container = this.add.container(50, startY + currentY);

            // Line 1: [Icon] Title [Check]
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

            // Line 2: Description
            const desc = this.add.text(60, 40, this.localeManager.get(ach.descriptionKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '24px',
                fontStyle: 'italic',
                color: textColor,
                wordWrap: { width: 600 }
            }).setOrigin(0, 0);

            // Line 3: Bonus Label + Bonus Value (with wrapping)
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

            container.add([...line1Elements, desc, bonusLabel, bonusValue]);
            this.scrollContainer.add(container);

            const itemHeight = Math.max(bonusLabel.y + bonusValue.displayHeight, desc.y + desc.displayHeight) + 50;
            currentY += itemHeight;
        });

        this.contentHeight = currentY;
        this.setScrollOffset(this.scrollOffset);
    }
}
