import Phaser from 'phaser';
import { ITEMS } from '../types';
import { GameStateManager } from '../managers/GameStateManager';
import { STYLES } from '../constants/Styles';

export class TradeScene extends Phaser.Scene {
    private currentTab: 'BUY' | 'SELL' = 'BUY';
    private sellQuantity: number = 1;
    private uiContainer!: Phaser.GameObjects.Container;
    private gameStateManager!: GameStateManager;
    
    // UI Elements
    private goldText!: Phaser.GameObjects.Text;
    private goldIcon!: Phaser.GameObjects.Sprite;
    private tabBuyBtn!: Phaser.GameObjects.Text;
    private tabSellBtn!: Phaser.GameObjects.Text;
    
    private readonly BG_COLOR = 0x2d3436;
    private readonly ACCENT_COLOR = 0xf39c12;

    constructor() {
        super('TradeScene');
    }

    create() {
        this.gameStateManager = this.registry.get('gameStateManager') as GameStateManager;

        // Semi-transparent background overlay
        this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.7)
            .setInteractive(); // Block input to scenes below

        // Main Panel
        this.add.rectangle(360, 640, 600, 800, this.BG_COLOR, 1).setStrokeStyle(4, 0xffffff);
        
        // Title
        this.add.text(360, 300, 'HANDEL', STYLES.TITLE).setOrigin(0.5);

        // Gold Display
        this.goldIcon = this.add.sprite(600, 300, 'ui_gold').setOrigin(1, 0.5);
        this.goldIcon.setScale(60 / this.goldIcon.width);
        this.goldText = this.add.text(this.goldIcon.x - this.goldIcon.displayWidth - 10, 300, '0', {
            ...STYLES.GOLD,
            strokeThickness: 0 
        }).setOrigin(1, 0.5);

        // Close Button
        this.add.text(360, 980, 'POWRÓT', {
            ...STYLES.BUTTON,
            backgroundColor: '#ff4757'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.handleClose());

        // Tabs
        this.tabBuyBtn = this.createTab(260, 400, 'KUP', 'BUY');
        this.tabSellBtn = this.createTab(460, 400, 'SPRZEDAŻ', 'SELL');

        // Content Container
        this.uiContainer = this.add.container(0, 0);

        // Initial Refresh
        this.refresh();
        
        // Listen for wake event to refresh state
        this.events.on('wake', () => {
            this.currentTab = 'BUY';
            this.sellQuantity = 1;
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
            this.sellQuantity = 1; // Reset quantity on tab switch
            this.refresh();
        });
    }

    private refresh() {
        this.goldText.setText(`${this.gameStateManager.gold}`);
        
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
        let currentY = 550;

        itemIds.forEach(id => {
            const item = ITEMS[id];
            
            // Item Card
            const card = this.add.rectangle(360, currentY, 500, 150, 0x636e72).setStrokeStyle(2, 0xffffff);
            this.uiContainer.add(card);

            // Icon
            const icon = this.add.sprite(200, currentY, item.icon);
            if (icon.width > 0) {
                icon.setScale(100 / icon.width);
            }
            this.uiContainer.add(icon);

            // Name & Price
            const nameText = this.add.text(280, currentY - 30, item.displayName, { ...STYLES.BUTTON, padding: { x: 0, y: 0 } }).setOrigin(0, 0.5);
            const priceLabel = this.add.text(280, currentY + 10, 'Cena: ', STYLES.PRICE).setOrigin(0, 0.5);
            const priceValue = this.add.text(priceLabel.x + priceLabel.width, currentY + 10, `${item.buyPrice}`, STYLES.PRICE).setOrigin(0, 0.5);
            const priceIcon = this.add.sprite(priceValue.x + priceValue.width + 15, currentY + 10, 'ui_gold').setOrigin(0, 0.5);
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
            
            currentY += 170; // Offset for next item
        });
    }

    private renderSellView() {
        const itemIds = Object.keys(ITEMS).filter(id => this.gameStateManager.getItemCount(id) > 0);
        let currentY = 550;

        if (itemIds.length === 0) {
            const emptyText = this.add.text(360, currentY, 'Brak przedmiotów na sprzedaż', STYLES.UI_LABEL).setOrigin(0.5);
            this.uiContainer.add(emptyText);
            return;
        }

        itemIds.forEach(id => {
            const item = ITEMS[id];
            const inventoryCount = this.gameStateManager.getItemCount(id);
            const sellPrice = Math.floor(item.buyPrice * 0.5);

            // Item Card
            const card = this.add.rectangle(360, currentY, 500, 200, 0x636e72).setStrokeStyle(2, 0xffffff);
            this.uiContainer.add(card);

            // Icon
            const icon = this.add.sprite(200, currentY - 20, item.icon);
            if (icon.width > 0) {
                icon.setScale(100 / icon.width);
            }
            this.uiContainer.add(icon);

            // Info
            const infoText = this.add.text(280, currentY - 50, `${item.displayName} (Posiadasz: ${inventoryCount})`, { 
                ...STYLES.UI_LABEL,
                fontSize: '24px'
            });
            this.uiContainer.add(infoText);

            // Quantity Selector (Scoped to this item)
            this.sellQuantity = Math.min(this.sellQuantity, inventoryCount);
            this.sellQuantity = Math.max(1, this.sellQuantity);

            const qtyText = this.add.text(360, currentY + 10, `${this.sellQuantity}`, { ...STYLES.BUTTON, padding: { x: 0, y: 0 } }).setOrigin(0.5);
            
            const minusBtn = this.add.text(300, currentY + 10, '<', { ...STYLES.BUTTON, color: '#f39c12', padding: { x: 0, y: 0 } })
                .setOrigin(0.5).setInteractive()
                .on('pointerdown', () => {
                    if (this.sellQuantity > 1) {
                        this.sellQuantity--;
                        this.refresh();
                    }
                });

            const plusBtn = this.add.text(420, currentY + 10, '>', { ...STYLES.BUTTON, color: '#f39c12', padding: { x: 0, y: 0 } })
                .setOrigin(0.5).setInteractive()
                .on('pointerdown', () => {
                    if (this.sellQuantity < inventoryCount) {
                        this.sellQuantity++;
                        this.refresh();
                    }
                });
            
            this.uiContainer.add([qtyText, minusBtn, plusBtn]);

            // Total Value
            const totalValue = this.sellQuantity * sellPrice;
            const totalLabel = this.add.text(360, currentY + 60, 'Suma: ', STYLES.PRICE).setOrigin(1, 0.5);
            const totalValueText = this.add.text(totalLabel.x, currentY + 60, `${totalValue}`, STYLES.PRICE).setOrigin(0, 0.5);
            const totalIcon = this.add.sprite(totalValueText.x + totalValueText.width + 10, currentY + 60, 'ui_gold').setOrigin(0, 0.5);
            totalIcon.setScale(50 / totalIcon.width);
            
            // Adjust label to be centered as a group
            const totalGroupWidth = totalLabel.width + totalValueText.width + totalIcon.displayWidth + 10;
            totalLabel.setX(360 - totalGroupWidth/2 + totalLabel.width);
            totalValueText.setX(totalLabel.x);
            totalIcon.setX(totalValueText.x + totalValueText.width + 10);

            this.uiContainer.add([totalLabel, totalValueText, totalIcon]);

            // Sell Button
            const sellBtn = this.add.text(520, currentY, 'SPRZEDAJ', {
                ...STYLES.UI_LABEL,
                backgroundColor: '#e74c3c',
                padding: { x: 10, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.gameStateManager.removeItem(id, this.sellQuantity)) {
                    this.gameStateManager.addGold(totalValue);
                    this.sellQuantity = 1;
                    this.refresh();
                }
            });
            this.uiContainer.add(sellBtn);
            
            currentY += 220;
        });
    }

    private handleClose() {
        this.scene.sleep();
        this.scene.resume('MainScene');
    }
}
