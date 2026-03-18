import Phaser from 'phaser';
import { MainScene } from './MainScene';
import { ITEMS } from '../types';

export class TradeScene extends Phaser.Scene {
    private currentTab: 'BUY' | 'SELL' = 'BUY';
    private sellQuantity: number = 1;
    private uiContainer!: Phaser.GameObjects.Container;
    
    // UI Elements
    private goldText!: Phaser.GameObjects.Text;
    private tabBuyBtn!: Phaser.GameObjects.Text;
    private tabSellBtn!: Phaser.GameObjects.Text;
    
    private readonly BG_COLOR = 0x2d3436;
    private readonly ACCENT_COLOR = 0xf39c12;
    private readonly TEXT_COLOR = '#ffffff';

    constructor() {
        super('TradeScene');
    }

    create() {
        // Semi-transparent background overlay
        this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.7)
            .setInteractive(); // Block input to scenes below

        // Main Panel
        this.add.rectangle(360, 640, 600, 800, this.BG_COLOR, 1).setStrokeStyle(4, 0xffffff);
        
        // Title
        this.add.text(360, 300, 'HANDEL', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: this.TEXT_COLOR,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Gold Display
        this.goldText = this.add.text(600, 300, 'Gold: 0', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#f1c40f'
        }).setOrigin(1, 0.5);

        // Close Button
        this.add.text(360, 980, 'POWRÓT', {
            fontSize: '32px',
            backgroundColor: '#ff4757',
            color: this.TEXT_COLOR,
            padding: { x: 30, y: 15 },
            fontFamily: 'Arial'
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
            fontSize: '28px',
            fontFamily: 'Arial',
            color: this.TEXT_COLOR,
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
        const mainScene = this.scene.get('MainScene') as MainScene;
        const state = mainScene.gameState;

        this.goldText.setText(`Gold: ${state.gold}`);
        
        // Update Tab Styles
        const activeBg = `#${this.ACCENT_COLOR.toString(16)}`;
        this.tabBuyBtn.setStyle({ backgroundColor: this.currentTab === 'BUY' ? activeBg : '#636e72' });
        this.tabSellBtn.setStyle({ backgroundColor: this.currentTab === 'SELL' ? activeBg : '#636e72' });

        // Clear previous content
        this.uiContainer.removeAll(true);

        if (this.currentTab === 'BUY') {
            this.renderBuyView(mainScene);
        } else {
            this.renderSellView(mainScene);
        }
    }

    private renderBuyView(mainScene: MainScene) {
        const item = ITEMS['turnip'];
        const y = 550;

        // Item Card
        const card = this.add.rectangle(360, y, 500, 150, 0x636e72).setStrokeStyle(2, 0xffffff);
        this.uiContainer.add(card);

        // Icon
        const icon = this.add.sprite(200, y, item.icon);
        if (icon.width > 0) {
            icon.setScale(100 / icon.width);
        }
        this.uiContainer.add(icon);

        // Name & Price
        const nameText = this.add.text(280, y - 30, item.displayName, { fontSize: '32px', color: '#ffffff' });
        const priceText = this.add.text(280, y + 10, `Cena: ${item.buyPrice} Gold`, { fontSize: '24px', color: '#f1c40f' });
        this.uiContainer.add([nameText, priceText]);

        // Buy Button
        const canAfford = mainScene.gameState.gold >= item.buyPrice;
        const buyBtn = this.add.text(520, y, 'KUP', {
            fontSize: '28px',
            backgroundColor: canAfford ? '#2ecc71' : '#7f8c8d',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        if (canAfford) {
            buyBtn.on('pointerdown', () => {
                mainScene.gameState.gold -= item.buyPrice;
                mainScene.gameState.inventory['turnip'] = (mainScene.gameState.inventory['turnip'] || 0) + 1;
                mainScene.syncUI();
                this.refresh();
            });
        }
        this.uiContainer.add(buyBtn);
    }

    private renderSellView(mainScene: MainScene) {
        const item = ITEMS['turnip'];
        const inventoryCount = mainScene.gameState.inventory['turnip'] || 0;
        const sellPrice = Math.floor(item.buyPrice * 0.5);
        const y = 550;

        // Item Card
        const card = this.add.rectangle(360, y, 500, 200, 0x636e72).setStrokeStyle(2, 0xffffff);
        this.uiContainer.add(card);

        // Icon
        const icon = this.add.sprite(200, y - 20, item.icon);
        if (icon.width > 0) {
            icon.setScale(100 / icon.width);
        }
        this.uiContainer.add(icon);

        // Info
        const infoText = this.add.text(280, y - 50, `${item.displayName} (Posiadasz: ${inventoryCount})`, { 
            fontSize: '24px', color: '#ffffff' 
        });
        this.uiContainer.add(infoText);

        if (inventoryCount === 0) {
            const emptyText = this.add.text(360, y + 20, 'Brak przedmiotów na sprzedaż', { fontSize: '24px', color: '#bdc3c7' }).setOrigin(0.5);
            this.uiContainer.add(emptyText);
            return;
        }

        // Quantity Selector
        this.sellQuantity = Math.min(this.sellQuantity, inventoryCount);
        this.sellQuantity = Math.max(1, this.sellQuantity);

        const qtyText = this.add.text(360, y + 10, `${this.sellQuantity}`, { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
        
        const minusBtn = this.add.text(300, y + 10, '<', { fontSize: '32px', color: '#f39c12' })
            .setOrigin(0.5).setInteractive()
            .on('pointerdown', () => {
                if (this.sellQuantity > 1) {
                    this.sellQuantity--;
                    this.refresh();
                }
            });

        const plusBtn = this.add.text(420, y + 10, '>', { fontSize: '32px', color: '#f39c12' })
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
        const totalText = this.add.text(360, y + 60, `Suma: ${totalValue} Gold`, { fontSize: '24px', color: '#f1c40f' }).setOrigin(0.5);
        this.uiContainer.add(totalText);

        // Sell Button
        const sellBtn = this.add.text(520, y, 'SPRZEDAJ', {
            fontSize: '24px',
            backgroundColor: '#e74c3c',
            color: '#ffffff',
            padding: { x: 10, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            mainScene.gameState.gold += totalValue;
            mainScene.gameState.inventory['turnip'] -= this.sellQuantity;
            this.sellQuantity = 1; // Reset after sell
            mainScene.syncUI();
            this.refresh();
        });
        this.uiContainer.add(sellBtn);
    }

    private handleClose() {
        this.scene.sleep();
        this.scene.resume('MainScene');
    }
}
