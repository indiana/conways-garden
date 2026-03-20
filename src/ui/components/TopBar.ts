import Phaser from 'phaser';
import { STYLES } from '../../constants/Styles';

export class TopBar extends Phaser.GameObjects.Container {
    private goldText: Phaser.GameObjects.Text;
    private goldIcon: Phaser.GameObjects.Sprite;
    private onMenuClick: () => void;

    constructor(scene: Phaser.Scene, onMenuClick: () => void) {
        super(scene, 0, 0);
        this.onMenuClick = onMenuClick;

        // Gold Display
        this.goldText = scene.add.text(40, 40, "0", STYLES.GOLD).setOrigin(0, 0.5);
        this.goldIcon = scene.add.sprite(0, 40, "ui_gold").setOrigin(0, 0.5);
        this.goldIcon.setScale(75 / this.goldIcon.width);

        // Hamburger Icon
        const menuX = 680;
        const menuY = 40;
        const menuSize = 40;
        const menuGraphics = scene.add.graphics();
        menuGraphics.lineStyle(4, 0xffffff);
        menuGraphics.strokeLineShape(new Phaser.Geom.Line(menuX - menuSize/2, menuY - 10, menuX + menuSize/2, menuY - 10));
        menuGraphics.strokeLineShape(new Phaser.Geom.Line(menuX - menuSize/2, menuY, menuX + menuSize/2, menuY));
        menuGraphics.strokeLineShape(new Phaser.Geom.Line(menuX - menuSize/2, menuY + 10, menuX + menuSize/2, menuY + 10));

        const hitArea = scene.add.zone(menuX, menuY, menuSize + 20, menuSize + 20).setInteractive();
        hitArea.on('pointerdown', () => this.onMenuClick());

        this.add([this.goldText, this.goldIcon, menuGraphics, hitArea]);
        scene.add.existing(this);
    }

    public updateGold(gold: number) {
        this.goldText.setText(`${gold}`);
        this.goldIcon.setX(this.goldText.x + this.goldText.width + 10);
    }
}
