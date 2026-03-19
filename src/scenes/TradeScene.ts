import Phaser from 'phaser';
import { ITEMS } from '../types';
import { GameStateManager } from '../managers/GameStateManager';
import { STYLES } from '../constants/Styles';

export class TradeScene extends Phaser.Scene {
    private currentTab: 'BUY' | 'SELL' = 'BUY';
    private uiContainer!: Phaser.GameObjects.Container;
    private gameStateManager!: GameStateManager;
    
    // UI Elements
    private tabBuyBtn!: Phaser.GameObjects.Text;
    private tabSellBtn!: Phaser.GameObjects.Text;
    
    private readonly ACCENT_COLOR = 0xf39c12;

    constructor() {
        super('TradeScene');
    }

    create() {
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;

        // Fullscreen background overlay (Matching Garden background color)
        this.add.rectangle(360, 640, 720, 1280, 0x2d3436, 1)
            .setInteractive(); // Block input

        // Title
        this.add.text(360, 150, 'HANDEL', STYLES.TITLE).setOrigin(0.5);

        // Tabs
        this.tabBuyBtn = this.createTab(260, 250, 'KUP', 'BUY');
        this.tabSellBtn = this.createTab(460, 250, 'SPRZEDAŻ', 'SELL');

        // Content Container
        this.uiContainer = this.add.container(0, 0);

        // Initial Refresh
        this.refresh();
        
        // Listen for wake event to refresh state
        this.events.on('wake', () => {
            this.currentTab = 'BUY';
            this.refresh();
        });
    }

    private createTab(x: number, y: number, text: string, type: 'BUY' | 'SELL') {
        const bg = type === this.currentTab ? `#${this.ACCENT_COLOR.toString(16)}` : '#636e72';
        return this.add.text(x, y, text, {
            ...STYLES.UI_LABEL,
            fontSize: '28px',
            backgroundColor: bg,
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.currentTab = type;
            this.refresh();
        });
    }

    private refresh() {
        // Update Tab Styles
        const activeBg = `#${this.ACCENT_COLOR.toString(16)}`;
        this.tabBuyBtn.setStyle({ backgroundColor: this.currentTab === 'BUY' ? activeBg : '#636e72' });
        this.tabSellBtn.setStyle({ backgroundColor: this.currentTab === 'SELL' ? activeBg : '#636e72' });

        // Clear previous content
        this.uiContainer.removeAll(true);

        if (this.currentTab === 'BUY') {
            this.renderBuyView();
        } else {
            this.renderSellView();
        }
    }

    private renderBuyView() {
        const itemIds = Object.keys(ITEMS);
        let currentY = 400;

        itemIds.forEach(id => {
            const item = ITEMS[id];
            
            // Icon
            const icon = this.add.sprite(200, currentY, item.icon);
            this.uiContainer.add(icon);

            // Inventory Count
            const count = this.gameStateManager.getItemCount(id);
            const countText = this.add.text(150, currentY, `${count}`, STYLES.UI_LABEL).setOrigin(0.5);
            this.uiContainer.add(countText);

            // Name & Price
            const nameText = this.add.text(280, currentY - 30, item.displayName, { ...STYLES.BUTTON, padding: { x: 0, y: 0 } }).setOrigin(0, 0.5);
            const priceLabel = this.add.text(280, currentY + 10, 'Cena: ', STYLES.PRICE).setOrigin(0, 0.5);
            const priceValue = this.add.text(priceLabel.x + priceLabel.width, currentY + 10, `${item.buyPrice}`, STYLES.PRICE).setOrigin(0, 0.5);
            const priceIcon = this.add.sprite(priceValue.x + priceValue.width + 0, currentY + 10, 'ui_gold').setOrigin(0, 0.5);
            priceIcon.setScale(50 / priceIcon.width);
            
            this.uiContainer.add([nameText, priceLabel, priceValue, priceIcon]);

            // Buy Button
            const canAfford = this.gameStateManager.gold >= item.buyPrice;
            const buyBtn = this.add.text(520, currentY, 'KUP', {
                ...STYLES.UI_LABEL,
                fontSize: '28px',
                backgroundColor: canAfford ? '#2ecc71' : '#7f8c8d',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive();

            if (canAfford) {
                buyBtn.on('pointerdown', () => {
                    if (this.gameStateManager.spendGold(item.buyPrice)) {
                        this.gameStateManager.addItem(item.id, 1);
                        this.refresh();
                    }
                });
            }
            this.uiContainer.add(buyBtn);
            
            currentY += 170;
        });
    }

    private renderSellView() {
        const itemIds = Object.keys(ITEMS).filter(id => this.gameStateManager.getItemCount(id) > 0);
        let currentY = 400;

        if (itemIds.length === 0) {
            const emptyText = this.add.text(360, currentY, 'Brak przedmiotów na sprzedaż', STYLES.UI_LABEL).setOrigin(0.5);
            this.uiContainer.add(emptyText);
            return;
        }

        itemIds.forEach(id => {
            const item = ITEMS[id];
            const sellPrice = Math.floor(item.buyPrice * 0.5);

            // Icon
            const icon = this.add.sprite(200, currentY, item.icon);
            this.uiContainer.add(icon);

            // Inventory Count
            const count = this.gameStateManager.getItemCount(id);
            const countText = this.add.text(150, currentY, `${count}`, STYLES.UI_LABEL).setOrigin(0.5);
            this.uiContainer.add(countText);

            // Name & Price
            const nameText = this.add.text(280, currentY - 30, item.displayName, { ...STYLES.BUTTON, padding: { x: 0, y: 0 } }).setOrigin(0, 0.5);
            const priceLabel = this.add.text(280, currentY + 10, 'Cena: ', STYLES.PRICE).setOrigin(0, 0.5);
            const priceValue = this.add.text(priceLabel.x + priceLabel.width, currentY + 10, `${sellPrice}`, STYLES.PRICE).setOrigin(0, 0.5);
            const priceIcon = this.add.sprite(priceValue.x + priceValue.width + 0, currentY + 10, 'ui_gold').setOrigin(0, 0.5);
            priceIcon.setScale(50 / priceIcon.width);
            
            this.uiContainer.add([nameText, priceLabel, priceValue, priceIcon]);

            // Sell Button
            const sellBtn = this.add.text(520, currentY, 'SPRZEDAJ', {
                ...STYLES.UI_LABEL,
                fontSize: '28px',
                backgroundColor: '#e74c3c',
                padding: { x: 10, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.gameStateManager.removeItem(id, 1)) {
                    this.gameStateManager.addGold(sellPrice);
                    this.refresh();
                }
            });
            this.uiContainer.add(sellBtn);
            
            currentY += 170;
        });
    }
}
