import Phaser from 'phaser';
import { Events } from '../constants/Events';

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
        'MENU_LANGUAGE_TO_EN': 'English language',
        'MENU_LANGUAGE_TO_PL': 'Język polski',
        'TAB_GARDEN': 'OGRÓD',
        'TAB_TRADE': 'HANDEL',
        'TAB_ACHIEVEMENTS': 'OSIĄGNIĘCIA',
        'TAB_ATLAS': 'ATLAS',
        'TRADE_BUY': 'KUP',
        'TRADE_SELL': 'SPRZEDAŻ',
        'TRADE_PRICE': 'Cena: ',
        'TRADE_EMPTY_SELL': 'Brak przedmiotów na sprzedaż',
        'ACHIEVEMENT_UNLOCKS': 'ODBLOKOWUJE: ',
        'ITEM_TURNIP_DESC': 'Skromne warzywo korzeniowe. Wytrzymałe i niezawodne.',
        'ITEM_TURNIP_RULES': 'Narodziny: 3 sąsiadów.\nPrzetrwanie: 2-3 sąsiadów.\nŚmierć: < 2 lub > 3 sąsiadów.',
        'ITEM_UNLOCK_DEFAULT': 'Zawsze dostępne',
        'ITEM_GRASS_DESC': 'Dzika trawa, która łatwo się rozprzestrzenia. Świetna do wypełniania przestrzeni.',
        'ITEM_GRASS_RULES': 'Narodziny: 3 sąsiadów.\nPrzetrwanie: 1-3 sąsiadów.\nŚmierć: 0 lub > 3 sąsiadów.'
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
        'MENU_LANGUAGE_TO_EN': 'English language',
        'MENU_LANGUAGE_TO_PL': 'Język polski',
        'TAB_GARDEN': 'GARDEN',
        'TAB_TRADE': 'TRADE',
        'TAB_ACHIEVEMENTS': 'ACHIEVEMENTS',
        'TAB_ATLAS': 'ATLAS',
        'TRADE_BUY': 'BUY',
        'TRADE_SELL': 'SELL',
        'TRADE_PRICE': 'Price: ',
        'TRADE_EMPTY_SELL': 'No items to sell',
        'ACHIEVEMENT_UNLOCKS': 'UNLOCKS: ',
        'ITEM_TURNIP_DESC': 'A humble root vegetable. Sturdy and reliable.',
        'ITEM_TURNIP_RULES': 'Birth: 3 neighbors.\nSurvival: 2-3 neighbors.\nDeath: < 2 or > 3 neighbors.',
        'ITEM_UNLOCK_DEFAULT': 'Always Available',
        'ITEM_GRASS_DESC': 'Wild grass that spreads easily. Great for filling space.',
        'ITEM_GRASS_RULES': 'Birth: 3 neighbors.\nSurvival: 1-3 neighbors.\nDeath: 0 or > 3 neighbors.'
    }
};

export class LocaleManager extends Phaser.Events.EventEmitter {
    private currentLocale: Locale = 'PL';
    private readonly STORAGE_KEY = 'conways_garden_locale';

    constructor() {
        super();
        const savedLocale = localStorage.getItem(this.STORAGE_KEY) as Locale;
        if (savedLocale && (savedLocale === 'PL' || savedLocale === 'EN')) {
            this.currentLocale = savedLocale;
        }
    }

    public setLocale(locale: Locale) {
        if (this.currentLocale === locale) return;
        this.currentLocale = locale;
        localStorage.setItem(this.STORAGE_KEY, locale);
        this.emit(Events.LOCALE_CHANGED, locale);
    }

    public get(key: string): string {
        return TRANSLATIONS[this.currentLocale][key] || key;
    }

    public getLocale(): Locale {
        return this.currentLocale;
    }

    public subscribeLocale(callback: (locale: Locale) => void) {
        this.on(Events.LOCALE_CHANGED, callback);
        callback(this.currentLocale);
    }
}
