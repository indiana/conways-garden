import Phaser from 'phaser';
import { STYLES } from '../constants/Styles';

export class AchievementsScene extends Phaser.Scene {
    constructor() {
        super('AchievementsScene');
    }

    create() {
        // Fullscreen background overlay (Matching Garden background color)
        this.add.rectangle(360, 640, 720, 1280, 0x2d3436, 1)
            .setInteractive(); // Block input

        // Title
        this.add.text(360, 150, 'OSIĄGNIĘCIA', STYLES.TITLE).setOrigin(0.5);
    }
}
