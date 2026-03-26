import Phaser from 'phaser';
import { ITEMS, ItemType } from '../types';
import { LocaleManager } from '../managers/LocaleManager';
import { LAYOUT } from '../constants/Layout';

export class AtlasScene extends Phaser.Scene {
    private localeManager!: LocaleManager;
    private scrollContainer!: Phaser.GameObjects.Container;
    private scrollMask!: Phaser.Display.Masks.GeometryMask;
    private scrollOffset: number = 0;
    private contentHeight: number = 0;

    constructor() {
        super('AtlasScene');
    }

    create() {
        this.localeManager = this.registry.get('localeManager') as LocaleManager;

        // Background
        this.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x2d3436, 1)
            .setInteractive();

        // Title
        this.add.text(LAYOUT.CENTER_X, LAYOUT.ATLAS_TITLE_Y, '', {
            fontFamily: 'Comfortaa, sans-serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setName('titleText');

        // Create scroll mask area (using shape for masking)
        const maskGraphics = this.add.graphics();
        maskGraphics.fillStyle(0xffffff, 1);
        maskGraphics.fillRect(0, LAYOUT.ATLAS_SCROLL_TOP, LAYOUT.WIDTH, LAYOUT.ATLAS_SCROLL_BOTTOM - LAYOUT.ATLAS_SCROLL_TOP);
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
            if (pointer.y > LAYOUT.ATLAS_SCROLL_TOP && pointer.y < LAYOUT.ATLAS_SCROLL_BOTTOM) {
                isDragging = true;
                dragStartY = pointer.y + this.scrollOffset;
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (isDragging && pointer.y > LAYOUT.ATLAS_SCROLL_TOP && pointer.y < LAYOUT.ATLAS_SCROLL_BOTTOM) {
                const newOffset = dragStartY - pointer.y;
                this.setScrollOffset(newOffset);
            }
        });

        this.input.on('pointerup', () => {
            isDragging = false;
        });

        // Subscribe to events
        this.localeManager.subscribeLocale(() => this.refresh());
        this.events.on('wake', () => this.refresh());

        this.refresh();
    }

    private handleScroll(deltaY: number) {
        const scrollSpeed = 30;
        const newOffset = this.scrollOffset + (deltaY > 0 ? scrollSpeed : -scrollSpeed);
        this.setScrollOffset(newOffset);
    }

    private setScrollOffset(value: number) {
        const maxScroll = Math.max(0, this.contentHeight - (LAYOUT.ATLAS_SCROLL_BOTTOM - LAYOUT.ATLAS_SCROLL_TOP));
        this.scrollOffset = Phaser.Math.Clamp(value, 0, maxScroll);
        this.scrollContainer.y = -this.scrollOffset;
    }

    private refresh() {
        if (!this.scrollContainer) return;

        this.scrollContainer.removeAll(true);

        const titleText = this.children.getByName('titleText') as Phaser.GameObjects.Text;
        if (titleText) {
            titleText.setText(this.localeManager.get('TAB_ATLAS'));
        }

        const plants = Object.values(ITEMS).filter(item => item.type === ItemType.Plant);
        let currentY = LAYOUT.ATLAS_SCROLL_TOP + 10;

        plants.forEach((plant, index) => {
            // 1. Icon (Large)
            const icon = this.add.sprite(80, currentY + 40, plant.icon);
            icon.setScale(1.2);
            this.scrollContainer.add(icon);

            // 2. Name
            const nameText = this.add.text(150, currentY, this.localeManager.get(plant.displayNameKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#f1c40f'
            }).setOrigin(0, 0);
            this.scrollContainer.add(nameText);

            // 3. Price
            const priceLabel = this.add.text(150, currentY + 55, this.localeManager.get('TRADE_PRICE'), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '24px',
                color: '#f1c40f'
            }).setOrigin(0, 0.5);
            const priceValue = this.add.text(priceLabel.x + priceLabel.width, currentY + 55, `${plant.buyPrice}`, {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '24px',
                color: '#f1c40f'
            }).setOrigin(0, 0.5);
            const priceIcon = this.add.sprite(priceValue.x + priceValue.width + 5, currentY + 55, 'ui_gold').setOrigin(0, 0.5);
            priceIcon.setScale(40 / priceIcon.width);
            this.scrollContainer.add([priceLabel, priceValue, priceIcon]);

            // 4. Tags
            const tagColors: Record<string, number> = {
                'vegetable': 0x27ae60,
                'wild': 0xe67e22,
                'mushroom': 0x9b59b6
            };
            const tagBgColor = 0x2d3436;
            const tagBorderColor = 0x636e72;
            let tagX = 150;
            const tagY = currentY + 90;

            plant.tags.forEach(tag => {
                const tagText = this.localeManager.get(`TAG_${tag.toUpperCase()}`);
                const padding = 12;
                const textStyle = {
                    fontFamily: 'Comfortaa, sans-serif',
                    fontSize: '16px',
                    color: '#ffffff'
                };
                const tempText = this.add.text(0, 0, tagText, textStyle);
                const tagWidth = tempText.width + padding * 2;
                const tagHeight = tempText.height + 6;
                tempText.destroy();

                const bg = this.add.graphics();
                bg.fillStyle(tagBgColor, 1);
                bg.fillRoundedRect(tagX, tagY - tagHeight / 2, tagWidth, tagHeight, 8);
                bg.lineStyle(2, tagColors[tag] || tagBorderColor, 1);
                bg.strokeRoundedRect(tagX, tagY - tagHeight / 2, tagWidth, tagHeight, 8);

                const text = this.add.text(tagX + padding, tagY, tagText, textStyle).setOrigin(0, 0.5);
                this.scrollContainer.add([bg, text]);
                tagX += tagWidth + 10;
            });

            // 5. Description
            currentY += 130;
            const descText = this.add.text(40, currentY, this.localeManager.get(plant.descriptionKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '20px',
                color: '#dfe6e9',
                fontStyle: 'italic',
                wordWrap: { width: 640 }
            }).setOrigin(0, 0);
            this.scrollContainer.add(descText);
            currentY += descText.height + 20;

            // 6. Rules
            const rulesLabel = this.add.text(40, currentY, this.localeManager.get('ATLAS_RULES'), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#e74c3c'
            }).setOrigin(0, 0);

            const rulesText = this.add.text(225, currentY, this.localeManager.get(plant.rulesKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '20px',
                color: '#b2bec3',
                wordWrap: { width: 475 }
            }).setOrigin(0, 0);
            this.scrollContainer.add([rulesLabel, rulesText]);
            currentY += rulesText.height + 20;

            // 7. Unlock
            const unlockLabel = this.add.text(40, currentY, this.localeManager.get('ATLAS_UNLOCK'), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#2ecc71'
            }).setOrigin(0, 0);

            const unlockText = this.add.text(225, currentY, this.localeManager.get(plant.unlockKey), {
                fontFamily: 'Comfortaa, sans-serif',
                fontSize: '20px',
                color: '#b2bec3',
                wordWrap: { width: 475 }
            }).setOrigin(0, 0);
            this.scrollContainer.add([unlockLabel, unlockText]);
            currentY += unlockText.height + 30;

            // Separator Line (if not last)
            if (index < plants.length - 1) {
                const line = this.add.rectangle(LAYOUT.CENTER_X, currentY, 600, 2, 0x636e72).setOrigin(0.5);
                this.scrollContainer.add(line);
                currentY += 30;
            }
        });

        this.contentHeight = currentY;
        this.setScrollOffset(this.scrollOffset);
    }
}
