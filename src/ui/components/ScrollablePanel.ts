import Phaser from 'phaser';
import { LAYOUT } from '../../constants/Layout';

export class ScrollablePanel {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private scrollMask: Phaser.Display.Masks.GeometryMask;
    private scrollOffset: number = 0;
    private contentHeight: number = 0;
    private scrollTop: number;
    private scrollBottom: number;
    private scrollSpeed: number;

    constructor(
        scene: Phaser.Scene,
        scrollTop: number,
        scrollBottom: number,
        scrollSpeed: number = 30
    ) {
        this.scene = scene;
        this.scrollTop = scrollTop;
        this.scrollBottom = scrollBottom;
        this.scrollSpeed = scrollSpeed;

        const maskGraphics = scene.add.graphics();
        maskGraphics.fillStyle(0xffffff, 1);
        maskGraphics.fillRect(0, scrollTop, LAYOUT.WIDTH, scrollBottom - scrollTop);
        this.scrollMask = maskGraphics.createGeometryMask();
        maskGraphics.setVisible(false);

        this.container = scene.add.container(0, 0);
        this.container.setMask(this.scrollMask);

        this.setupScrolling();
    }

    private setupScrolling() {
        let dragStartY = 0;
        let isDragging = false;

        this.scene.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
            this.handleScroll(deltaY);
        });

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.y > this.scrollTop && pointer.y < this.scrollBottom) {
                isDragging = true;
                dragStartY = pointer.y + this.scrollOffset;
            }
        });

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (isDragging && pointer.y > this.scrollTop && pointer.y < this.scrollBottom) {
                const newOffset = dragStartY - pointer.y;
                this.setScrollOffset(newOffset);
            }
        });

        this.scene.input.on('pointerup', () => {
            isDragging = false;
        });
    }

    private handleScroll(deltaY: number) {
        const newOffset = this.scrollOffset + (deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed);
        this.setScrollOffset(newOffset);
    }

    public setScrollOffset(value: number) {
        const scrollArea = this.scrollBottom - this.scrollTop;
        const maxScroll = Math.max(0, this.contentHeight - scrollArea);
        this.scrollOffset = Phaser.Math.Clamp(value, 0, maxScroll);
        this.container.y = -this.scrollOffset;
    }

    public resetScroll() {
        this.scrollOffset = 0;
        this.container.y = 0;
    }

    public getContainer(): Phaser.GameObjects.Container {
        return this.container;
    }

    public clearContent() {
        this.container.removeAll(true);
    }

    public setContentHeight(height: number) {
        this.contentHeight = height;
        this.setScrollOffset(this.scrollOffset);
    }

    public getScrollTop(): number {
        return this.scrollTop;
    }

    public getScrollBottom(): number {
        return this.scrollBottom;
    }
}
