export const FONT_FAMILY = "'Fredoka', sans-serif";

export const STYLES = {
    GOLD: {
        fontSize: '32px',
        fontFamily: FONT_FAMILY,
        color: '#f1c40f',
        stroke: '#000000',
        strokeThickness: 4
    } as Phaser.Types.GameObjects.Text.TextStyle,

    INVENTORY: {
        fontSize: '48px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
    } as Phaser.Types.GameObjects.Text.TextStyle,

    BUTTON: {
        fontSize: '32px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
        padding: { x: 20, y: 10 }
    } as Phaser.Types.GameObjects.Text.TextStyle,

    TITLE: {
        fontSize: '48px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
        fontStyle: 'bold'
    } as Phaser.Types.GameObjects.Text.TextStyle,

    UI_LABEL: {
        fontSize: '24px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff'
    } as Phaser.Types.GameObjects.Text.TextStyle,

    PRICE: {
        fontSize: '24px',
        fontFamily: FONT_FAMILY,
        color: '#f1c40f'
    } as Phaser.Types.GameObjects.Text.TextStyle
};
