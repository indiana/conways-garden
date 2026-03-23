import Phaser from 'phaser';
import { Events } from '../constants/Events';

export type Locale = 'PL' | 'EN';

export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
    PL: {
        'ITEM_TURNIP': 'Rzepa',
        'ITEM_GRASS': 'Trawa',
        'ACHIEVEMENT_FIRST_STEPS_TITLE': 'Pierwsze kroki',
        'ACHIEVEMENT_FIRST_STEPS_DESC': 'Zarób łącznie 100 monet ze sprzedaży swoich plonów.',
        'ACHIEVEMENT_REWARD_4X4': 'Upgrade: Powiększenie ogrodu (4x4).',
        'ACHIEVEMENT_GOLDEN_HAND_TITLE': 'Złota Rączka',
        'ACHIEVEMENT_GOLDEN_HAND_DESC': 'Zarób łącznie 1 000 monet ze sprzedaży swoich plonów.',
        'ACHIEVEMENT_REWARD_5X5': 'Upgrade: Powiększenie ogrodu (5x5).',
        'ACHIEVEMENT_GREEN_INVESTOR_TITLE': 'Zielony Inwestor',
        'ACHIEVEMENT_GREEN_INVESTOR_DESC': 'Zarób łącznie 10 000 monet ze sprzedaży swoich plonów.',
        'ACHIEVEMENT_REWARD_SOON': 'Wkrótce nowa nagroda!',
        'ACHIEVEMENT_FLORA_TYCOON_TITLE': 'Magnat Flory',
        'ACHIEVEMENT_FLORA_TYCOON_DESC': 'Zarób łącznie 100 000 monet ze sprzedaży swoich plonów.',
        'UPGRADE_GARDEN_LEVEL_2': 'Powiększenie ogrodu (Poziom 2)',
        'UPGRADE_GARDEN_LEVEL_2_DESC': 'Powiększa siatkę do 4x4 pól.',
        'UPGRADE_GARDEN_LEVEL_3': 'Powiększenie ogrodu (Poziom 3)',
        'UPGRADE_GARDEN_LEVEL_3_DESC': 'Powiększa siatkę do 5x5 pól.',
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
        'ACHIEVEMENT_FIRST_STEPS_DESC': 'Earn a total of 100 coins from selling your crops.',
        'ACHIEVEMENT_REWARD_4X4': 'Upgrade: Garden Expansion (4x4).',
        'ACHIEVEMENT_GOLDEN_HAND_TITLE': 'Golden Hand',
        'ACHIEVEMENT_GOLDEN_HAND_DESC': 'Earn a total of 1,000 coins from selling your crops.',
        'ACHIEVEMENT_REWARD_5X5': 'Upgrade: Garden Expansion (5x5).',
        'ACHIEVEMENT_GREEN_INVESTOR_TITLE': 'Green Investor',
        'ACHIEVEMENT_GREEN_INVESTOR_DESC': 'Earn a total of 10,000 coins from selling your crops.',
        'ACHIEVEMENT_REWARD_SOON': 'New reward coming soon!',
        'ACHIEVEMENT_FLORA_TYCOON_TITLE': 'Flora Tycoon',
        'ACHIEVEMENT_FLORA_TYCOON_DESC': 'Earn a total of 100,000 coins from selling your crops.',
        'UPGRADE_GARDEN_LEVEL_2': 'Garden Expansion (Level 2)',
        'UPGRADE_GARDEN_LEVEL_2_DESC': 'Expands grid to 4x4 tiles.',
        'UPGRADE_GARDEN_LEVEL_3': 'Garden Expansion (Level 3)',
        'UPGRADE_GARDEN_LEVEL_3_DESC': 'Expands grid to 5x5 tiles.',
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
