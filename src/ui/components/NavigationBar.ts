import Phaser from 'phaser';

export type NavTab = 'GARDEN' | 'TRADE' | 'ACHIEVEMENTS' | 'ATLAS';

export class NavigationBar extends Phaser.GameObjects.Container {
    private navButtons: Record<NavTab, Phaser.GameObjects.Sprite> = {} as any;
    private onTabSwitch: (tab: NavTab) => void;
    private activeTab: NavTab = 'GARDEN';

    constructor(scene: Phaser.Scene, y: number, onTabSwitch: (tab: NavTab) => void) {
        super(scene, 0, y);
        this.onTabSwitch = onTabSwitch;

        const spacing = 170;
        const startX = 360 - (spacing * 1.5);

        this.navButtons.GARDEN = this.createNavButton(startX, 0, 'btn_garden', 'GARDEN');
        this.navButtons.TRADE = this.createNavButton(startX + spacing, 0, 'btn_trade', 'TRADE');
        this.navButtons.ACHIEVEMENTS = this.createNavButton(startX + spacing * 2, 0, 'btn_achievements', 'ACHIEVEMENTS');
        this.navButtons.ATLAS = this.createNavButton(startX + spacing * 3, 0, 'btn_atlas', 'ATLAS');

        this.add([
            this.navButtons.GARDEN,
            this.navButtons.TRADE,
            this.navButtons.ACHIEVEMENTS,
            this.navButtons.ATLAS
        ]);

        this.updateVisuals();
        scene.add.existing(this);
    }

    private createNavButton(x: number, y: number, key: string, tab: NavTab) {
        const btn = this.scene.add.sprite(x, y, key).setInteractive();
        btn.setScale(160 / btn.width);
        btn.on('pointerdown', () => {
            this.activeTab = tab;
            this.updateVisuals();
            this.onTabSwitch(tab);
        });
        return btn;
    }

    public updateVisuals() {
        this.navButtons.GARDEN.setTexture('btn_garden');
        this.navButtons.TRADE.setTexture('btn_trade');
        this.navButtons.ACHIEVEMENTS.setTexture('btn_achievements');
        this.navButtons.ATLAS.setTexture('btn_atlas');

        switch (this.activeTab) {
            case 'GARDEN': this.navButtons.GARDEN.setTexture('btn_garden_active'); break;
            case 'TRADE': this.navButtons.TRADE.setTexture('btn_trade_active'); break;
            case 'ACHIEVEMENTS': this.navButtons.ACHIEVEMENTS.setTexture('btn_achievements_active'); break;
            case 'ATLAS': this.navButtons.ATLAS.setTexture('btn_atlas_active'); break;
        }
    }

    public setActiveTab(tab: NavTab) {
        this.activeTab = tab;
        this.updateVisuals();
    }
}
