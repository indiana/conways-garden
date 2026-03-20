export type Locale = 'PL' | 'EN';

export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
    PL: {
        'ITEM_TURNIP': 'Rzepa',
        'ITEM_GRASS': 'Trawa',
        'ACHIEVEMENT_FIRST_STEPS_TITLE': 'Pierwsze kroki',
        'ACHIEVEMENT_FIRST_STEPS_DESC': 'Zbierz łącznie 200 monet w swoim portfelu.',
        'ACHIEVEMENT_REWARD_5X5': 'Upgrade: Powiększenie siatki 5x5.',
        'UPGRADE_GRID_5X5': 'Powiększenie ogrodu (5x5)',
        'UPGRADE_GRID_5X5_DESC': 'Zwiększa obszar ogrodu do 5x5.',
        'MENU_RESET': 'Zresetuj grę',
        'MENU_LANGUAGE': 'Język EN/PL',
        'TAB_GARDEN': 'OGRÓD',
        'TAB_TRADE': 'HANDEL',
        'TAB_ACHIEVEMENTS': 'OSIĄGNIĘCIA',
        'TAB_ATLAS': 'ATLAS',
        'TRADE_BUY': 'KUP',
        'TRADE_SELL': 'SPRZEDAŻ',
        'TRADE_PRICE': 'Cena: ',
        'TRADE_EMPTY_SELL': 'Brak przedmiotów na sprzedaż',
        'ACHIEVEMENT_UNLOCKS': 'ODBLOKOWUJE: '
    },
    EN: {
        'ITEM_TURNIP': 'Turnip',
        'ITEM_GRASS': 'Grass',
        'ACHIEVEMENT_FIRST_STEPS_TITLE': 'First Steps',
        'ACHIEVEMENT_FIRST_STEPS_DESC': 'Collect a total of 200 coins in your wallet.',
        'ACHIEVEMENT_REWARD_5X5': 'Upgrade: 5x5 Grid expansion.',
        'UPGRADE_GRID_5X5': 'Garden Expansion (5x5)',
        'UPGRADE_GRID_5X5_DESC': 'Increases garden area to 5x5.',
        'MENU_RESET': 'Reset Game',
        'MENU_LANGUAGE': 'Language EN/PL',
        'TAB_GARDEN': 'GARDEN',
        'TAB_TRADE': 'TRADE',
        'TAB_ACHIEVEMENTS': 'ACHIEVEMENTS',
        'TAB_ATLAS': 'ATLAS',
        'TRADE_BUY': 'BUY',
        'TRADE_SELL': 'SELL',
        'TRADE_PRICE': 'Price: ',
        'TRADE_EMPTY_SELL': 'No items to sell',
        'ACHIEVEMENT_UNLOCKS': 'UNLOCKS: '
    }
};

export class LocaleManager {
    private currentLocale: Locale = 'PL';

    public setLocale(locale: Locale) {
        this.currentLocale = locale;
    }

    public get(key: string): string {
        return TRANSLATIONS[this.currentLocale][key] || key;
    }

    public getLocale(): Locale {
        return this.currentLocale;
    }
}
