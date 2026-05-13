import Phaser from 'phaser';
import { STYLES } from '../../constants/Styles';
import { LocaleManager } from '../../managers/LocaleManager';
import { LAYOUT } from '../../constants/Layout';

export class MenuOverlay extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;
    private localeManager: LocaleManager;
    private resetBtn: Phaser.GameObjects.Text;
    private langBtn: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, localeManager: LocaleManager, onReset: () => void) {
        super(scene, 0, 0);
        this.localeManager = localeManager;

        this.setVisible(false);
        this.setDepth(1000);

        // Semi-transparent background
        const bg = scene.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, LAYOUT.WIDTH, LAYOUT.HEIGHT, 0x000000, 0.7);
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => this.toggle());

        // Menu Panel
        const panelWidth = 400;
        const panelHeight = 300;
        const panel = scene.add.rectangle(LAYOUT.CENTER_X, LAYOUT.CENTER_Y, panelWidth, panelHeight, 0x2d3436);
        panel.setStrokeStyle(4, 0xffffff);

        // Menu Items
        this.resetBtn = scene.add.text(LAYOUT.CENTER_X, LAYOUT.CENTER_Y - 40, '', STYLES.UI_LABEL)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                onReset();
                this.toggle();
            })
            .on('pointerover', () => this.resetBtn.setAlpha(0.8))
            .on('pointerout', () => this.resetBtn.setAlpha(1.0));

        this.langBtn = scene.add.text(LAYOUT.CENTER_X, LAYOUT.CENTER_Y + 40, '', { ...STYLES.UI_LABEL, color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                const nextLocale = this.localeManager.getLocale() === 'PL' ? 'EN' : 'PL';
                this.localeManager.setLocale(nextLocale);
            })
            .on('pointerover', () => this.langBtn.setAlpha(0.8))
            .on('pointerout', () => this.langBtn.setAlpha(1.0));

        this.add([bg, panel, this.resetBtn, this.langBtn]);
        
        // Subscribe to locale changes to update text
        this.localeManager.subscribeLocale(() => this.updateText());
        
        scene.add.existing(this);
    }

    private updateText() {
        this.resetBtn.setText(this.localeManager.get('MENU_RESET'));
        
        const currentLocale = this.localeManager.getLocale();
        const langKey = currentLocale === 'PL' ? 'MENU_LANGUAGE_TO_EN' : 'MENU_LANGUAGE_TO_PL';
        this.langBtn.setText(this.localeManager.get(langKey));
    }

    public toggle() {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
    }
}
