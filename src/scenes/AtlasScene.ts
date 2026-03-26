import Phaser from 'phaser';
import { ITEMS, ItemType } from '../types';
import { LocaleManager } from '../managers/LocaleManager';
import { STYLES } from '../constants/Styles';
import { LAYOUT } from '../constants/Layout';

export class AtlasScene extends Phaser.Scene {
    private localeManager!: LocaleManager;
    private container!: Phaser.GameObjects.Container;
    private titleText!: Phaser.GameObjects.Text;

    constructor() {
        super('AtlasScene');
    }

    create() {
        this.localeManager = this.registry.get('localeManager') as LocaleManager;

        // Background (Matches other overlays)
        this.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x2d3436, 1)
            .setInteractive();

        // Title
        this.titleText = this.add.text(LAYOUT.CENTER_X, 120, '', STYLES.TITLE).setOrigin(0.5);

        // Container for scrollable/list content
        this.container = this.add.container(0, 0);

        // Subscribe to events
        this.localeManager.subscribeLocale(() => this.refresh());
        this.events.on('wake', () => this.refresh());
    }

    private refresh() {
        if (!this.container) return;
        this.container.removeAll(true);
        
        if (this.titleText) {
            this.titleText.setText(this.localeManager.get('TAB_ATLAS'));
        }

        const plants = Object.values(ITEMS).filter(item => item.type === ItemType.Plant);
        let currentY = 200;

        plants.forEach((plant, index) => {
            // 1. Icon (Large)
            const icon = this.add.sprite(80, currentY + 40, plant.icon);
            // Scale up slightly if needed, assuming 60px icons
            icon.setScale(1.2); 
            this.container.add(icon);

            // 2. Name
            const nameText = this.add.text(150, currentY, this.localeManager.get(plant.displayNameKey), {
                ...STYLES.BUTTON,
                fontSize: '32px',
                color: '#f1c40f',
                padding: { x: 0, y: 0 }
            }).setOrigin(0, 0);
            this.container.add(nameText);

            // 3. Price
            const priceLabel = this.add.text(150, currentY + 55, this.localeManager.get('TRADE_PRICE'), STYLES.PRICE).setOrigin(0, 0.5);
            const priceValue = this.add.text(priceLabel.x + priceLabel.width, currentY + 55, `${plant.buyPrice}`, STYLES.PRICE).setOrigin(0, 0.5);
            const priceIcon = this.add.sprite(priceValue.x + priceValue.width + 5, currentY + 55, 'ui_gold').setOrigin(0, 0.5);
            priceIcon.setScale(40 / priceIcon.width);
            this.container.add([priceLabel, priceValue, priceIcon]);

            // 3.5 Tags
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
                this.container.add([bg, text]);
                tagX += tagWidth + 10;
            });

            // 4. Description (Flavor)
            currentY += 130;
            const descText = this.add.text(40, currentY, this.localeManager.get(plant.descriptionKey), {
                fontFamily: 'Monospace',
                fontSize: '20px',
                color: '#dfe6e9',
                fontStyle: 'italic',
                wordWrap: { width: 640 }
            }).setOrigin(0, 0);
            this.container.add(descText);
            currentY += descText.height + 20;

            // 5. Rules
            const rulesLabel = this.add.text(40, currentY, this.localeManager.get('ATLAS_RULES'), {
                fontFamily: 'Monospace',
                fontSize: '20px',
                color: '#e74c3c',
                fontStyle: 'bold'
            }).setOrigin(0, 0);
            
            const rulesText = this.add.text(185, currentY, this.localeManager.get(plant.rulesKey), {
                fontFamily: 'Monospace',
                fontSize: '20px',
                color: '#b2bec3',
                wordWrap: { width: 495 }
            }).setOrigin(0, 0);
            this.container.add([rulesLabel, rulesText]);
            currentY += rulesText.height + 20;

            // 6. Unlock
            const unlockLabel = this.add.text(40, currentY, this.localeManager.get('ATLAS_UNLOCK'), {
                fontFamily: 'Monospace',
                fontSize: '20px',
                color: '#2ecc71',
                fontStyle: 'bold'
            }).setOrigin(0, 0);

            const unlockText = this.add.text(185, currentY, this.localeManager.get(plant.unlockKey), {
                fontFamily: 'Monospace',
                fontSize: '20px',
                color: '#b2bec3',
                wordWrap: { width: 495 }
            }).setOrigin(0, 0);
            this.container.add([unlockLabel, unlockText]);
            currentY += unlockText.height + 30;

            // Separator Line (if not last)
            if (index < plants.length - 1) {
                const line = this.add.rectangle(LAYOUT.CENTER_X, currentY, 600, 2, 0x636e72).setOrigin(0.5);
                this.container.add(line);
                currentY += 30;
            }
        });
    }
}
