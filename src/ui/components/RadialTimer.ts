import Phaser from 'phaser';

export class RadialTimer extends Phaser.GameObjects.Container {
    private graphics: Phaser.GameObjects.Graphics;
    private readonly UI_CENTER_X = 360;
    private readonly TIMER_Y = 150;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.graphics = scene.add.graphics();
        this.add(this.graphics);
        this.drawProgress(0);
        scene.add.existing(this);
    }

    public drawProgress(progress: number) {
        this.graphics.clear();
        this.graphics.lineStyle(20, 0x2d3436);
        this.graphics.strokeCircle(this.UI_CENTER_X, this.TIMER_Y, 80);

        if (progress > 0) {
            this.graphics.lineStyle(20, 0x2ecc71);
            this.graphics.beginPath();
            this.graphics.arc(
                this.UI_CENTER_X,
                this.TIMER_Y,
                80,
                Phaser.Math.DegToRad(-90),
                Phaser.Math.DegToRad(-90 + 360 * progress),
                false,
            );
            this.graphics.strokePath();
        }
    }
}
