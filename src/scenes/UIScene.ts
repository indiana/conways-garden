import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
    private inventoryText!: Phaser.GameObjects.Text;
    private goldText!: Phaser.GameObjects.Text;
    private timerGraphics!: Phaser.GameObjects.Graphics;
    
    private readonly UI_CENTER_X = 360;
    private readonly TIMER_Y = 150;
    private readonly INVENTORY_Y = 1100;

    constructor() {
        super('UIScene');
    }

    create() {
        // Gold Display
        this.goldText = this.add.text(40, 40, 'Gold: 20', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#f1c40f', // Gold color
            stroke: '#000000',
            strokeThickness: 4
        });

        // Inventory Slot 
        const slotGraphics = this.add.graphics();
        slotGraphics.fillStyle(0x000000, 0.5);
        slotGraphics.fillRoundedRect(this.UI_CENTER_X - 150, this.INVENTORY_Y - 60, 300, 120, 20);
        slotGraphics.lineStyle(4, 0xffffff, 0.8);
        slotGraphics.strokeRoundedRect(this.UI_CENTER_X - 150, this.INVENTORY_Y - 60, 300, 120, 20);
        
        // Turnip Icon
        const turnipIcon = this.add.sprite(this.UI_CENTER_X - 60, this.INVENTORY_Y, 'ui_turnip');
        if (turnipIcon.width > 0) {
            const scale = 80 / turnipIcon.width;
            turnipIcon.setScale(scale);
        }

        this.inventoryText = this.add.text(this.UI_CENTER_X + 20, this.INVENTORY_Y, 'x5', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Radial Timer
        this.timerGraphics = this.add.graphics();
        this.drawTimer(0); 
        
        // Trade Button
        const tradeBtn = this.add.text(this.UI_CENTER_X, this.INVENTORY_Y + 80, 'HANDEL', {
            fontSize: '32px',
            backgroundColor: '#f39c12',
            color: '#ffffff',
            padding: { x: 20, y: 10 },
            fontFamily: 'Arial'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.handleTrade())
        .on('pointerover', () => tradeBtn.setStyle({ backgroundColor: '#f1c40f' }))
        .on('pointerout', () => tradeBtn.setStyle({ backgroundColor: '#f39c12' }));

        // Reset Button
        const resetBtn = this.add.text(this.UI_CENTER_X, this.INVENTORY_Y + 160, 'RESET', {
            fontSize: '24px',
            backgroundColor: '#ff4757',
            color: '#ffffff',
            padding: { x: 15, y: 8 },
            fontFamily: 'Arial'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.handleReset())
        .on('pointerover', () => resetBtn.setStyle({ backgroundColor: '#ff6b81' }))
        .on('pointerout', () => resetBtn.setStyle({ backgroundColor: '#ff4757' }));
    }

    private drawTimer(progress: number) {
        this.timerGraphics.clear();
        this.timerGraphics.lineStyle(20, 0x2d3436);
        this.timerGraphics.strokeCircle(this.UI_CENTER_X, this.TIMER_Y, 80);
        
        if (progress > 0) {
            this.timerGraphics.lineStyle(20, 0x2ecc71);
            this.timerGraphics.beginPath();
            this.timerGraphics.arc(this.UI_CENTER_X, this.TIMER_Y, 80, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + 360 * progress), false);
            this.timerGraphics.strokePath();
        }
    }

    private handleReset() {
        const mainScene = this.scene.get('MainScene') as any;
        if (mainScene && mainScene.resetGame) {
            mainScene.resetGame();
        }
    }

    private handleTrade() {
        this.scene.pause('MainScene');
        this.scene.run('TradeScene');
    }

    public updateInventory(count: number, gold: number) {
        if (this.inventoryText) {
            this.inventoryText.setText(`x${count}`);
        }
        if (this.goldText) {
            this.goldText.setText(`Gold: ${gold}`);
        }
    }

    public updateTimer(progress: number) {
        this.drawTimer(progress);
    }
}
