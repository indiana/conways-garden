import Phaser from 'phaser';
import { STYLES } from '../../constants/Styles';

export class MenuOverlay extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;

    constructor(scene: Phaser.Scene, onReset: () => void) {
        super(scene, 0, 0);

        this.setVisible(false);
        this.setDepth(1000);

        // Semi-transparent background
        const bg = scene.add.rectangle(360, 640, 720, 1280, 0x000000, 0.7);
        bg.setInteractive();
        bg.on('pointerdown', () => this.toggle());

        // Menu Panel
        const panelWidth = 400;
        const panelHeight = 300;
        const panel = scene.add.rectangle(360, 640, panelWidth, panelHeight, 0x2d3436);
        panel.setStrokeStyle(4, 0xffffff);

        // Menu Items
        const resetBtn = scene.add.text(360, 600, 'Zresetuj grę', STYLES.UI_LABEL)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                onReset();
                this.toggle();
            });

        const langBtn = scene.add.text(360, 680, 'Język EN/PL', { ...STYLES.UI_LABEL, color: '#7f8c8d' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('Language switch clicked (placeholder)');
            });

        this.add([bg, panel, resetBtn, langBtn]);
        scene.add.existing(this);
    }

    public toggle() {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
    }
}
