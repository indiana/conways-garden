import Phaser from 'phaser';
import { STYLES } from '../../constants/Styles';
import { LocaleManager } from '../../managers/LocaleManager';
import { LAYOUT } from '../../constants/Layout';

export class MenuOverlay extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;
    private localeManager: LocaleManager;

    constructor(scene: Phaser.Scene, localeManager: LocaleManager, onReset: () => void) {
        super(scene, 0, 0);
        this.localeManager = localeManager;

        this.setVisible(false);
        this.setDepth(1000);

        // Semi-transparent background
        const bg = scene.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x000000, 0.7);
        bg.setInteractive();
        bg.on('pointerdown', () => this.toggle());

        // Menu Panel
        const panelWidth = 400;
        const panelHeight = 300;
        const panel = scene.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, panelWidth, panelHeight, 0x2d3436);
        panel.setStrokeStyle(4, 0xffffff);

        // Menu Items
        const resetBtn = scene.add.text(LAYOUT.CENTER_X, LAYOUT.CENTER_Y - 40, this.localeManager.get('MENU_RESET'), STYLES.UI_LABEL)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                onReset();
                this.toggle();
            });

        const langBtn = scene.add.text(LAYOUT.CENTER_X, LAYOUT.CENTER_Y + 40, this.localeManager.get('MENU_LANGUAGE'), { ...STYLES.UI_LABEL, color: '#7f8c8d' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                const nextLocale = this.localeManager.getLocale() === 'PL' ? 'EN' : 'PL';
                this.localeManager.setLocale(nextLocale);
                // In a real app, you'd trigger a full UI refresh here.
                // For now, let's just log it.
                console.log(`Language switched to ${nextLocale} (UI refresh needed)`);
                this.toggle();
            });

        this.add([bg, panel, resetBtn, langBtn]);
        scene.add.existing(this);
    }

    public toggle() {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
    }
}
