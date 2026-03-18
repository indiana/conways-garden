# Specyfikacja Techniczna: System Waluty, Obiektowego Inwentarza i Modułu HANDEL (v2.3)

## 1. System Waluty (Currency)
*   **Nazwa:** Moneta (Gold).
*   **Typ:** Globalna zmienna całkowita (Integer).
*   **Stan początkowy:** 20 monet.
*   **UI:** Licznik monet widoczny w głównym widoku oraz w widoku HANDEL.

---

## 2. Model Obiektowy Przedmiotów i Inwentarza

### 2.1. Klasa Przedmiotu (Base Item Class)
Każdy przedmiot w grze jest instancją klasy zawierającej:
*   `ID` (string): Techniczny identyfikator (np. "rzepa_01").
*   `DisplayName` (string): Nazwa widoczna dla gracza (np. "Rzepa").
*   `Type` (enum/string): Typ przedmiotu. Obecnie: `Plant`. (W przyszłości: `Tool`, `Fertilizer`).
*   `BuyPrice` (int): Bazowa cena zakupu w sklepie.
*   `Icon` (Sprite): Referencja do grafiki.

### 2.2. Struktura Inwentarza (Inventory)
Inwentarz to lista lub słownik przechowujący pary: `(Obiekt Przedmiotu, Ilość)`.
*   **Przykład:** `Inventory = { turnip_object: 5 }`.
*   **Sadzenie:** Tylko przedmioty o `Type == "Plant"` mogą być wybierane do sadzenia na planszy 4x4.

---

## 3. Moduł HANDEL

### 3.1. Widok i Nawigacja
*   **Wejście:** Przycisk `HANDEL` w głównym menu (pauzuje grę).
*   **Wyjście:** Przycisk `POWRÓT` (wznawia grę).
*   **Karty:** `KUP` (domyślna) oraz `SPRZEDAŻ`.

### 3.2. Zakładka KUP
Wyświetla przedmioty dostępne do nabycia.
*   **Startowy towar:** Rzepa (`Type: Plant`, `BuyPrice: 10`).
*   **Logika zakupu:** `Gold -= Item.BuyPrice`; `Inventory[Item] += 1`.
*   **Walidacja:** Przycisk zakupu nieaktywny, jeśli `Gold < Item.BuyPrice`.

### 3.3. Zakładka SPRZEDAŻ (Logika Ceny i Wyboru)
Wyświetla przedmioty z inwentarza gracza (gdzie ilość > 0).

*   **Wyliczanie Ceny Sprzedaży:** 
    *   Wartość obliczana dynamicznie przez silnik: `CurrentSellPrice = Item.BuyPrice * 0.5`.
    *   *Nota:* Dzięki temu w przyszłości łatwo dodasz modyfikator: `* GlobalMultiplier`.
*   **Selektor Ilości (Y):** 
    *   Gracz używa strzałek `[<]` i `[>]`, aby wybrać ilość do sprzedaży (zakres: `0` do `Ilość w Inwentarzu`).
*   **Podsumowanie:**
    *   Dynamiczne pole `Wartość Całkowita` sumuje: `Suma(Y * CurrentSellPrice)`.
    *   **Przycisk SPRZEDAJ:** Finalizuje transakcję (aktualizuje `Gold` i `Inventory`, resetuje selektory `Y`).

---

## 4. Logika Techniczna (Pseudokod)

```python
# Przykład klasy przedmiotu
class Item:
    def __init__(self, id, name, item_type, buy_price):
        self.id = id
        self.display_name = name
        self.type = item_type # np. "Plant"
        self.buy_price = buy_price

# Globalny przelicznik sprzedaży (łatwy do zmiany w przyszłości)
def get_sell_price(item):
    base_multiplier = 0.5
    return int(item.buy_price * base_multiplier)

# Logika aktualizacji sumy w UI sprzedaży
def on_arrow_click():
    total_value = 0
    for item in selected_for_sale:
        total_value += item.amount_to_sell * get_sell_price(item.ref)
    ui_total_label.text = f"Suma: {total_value} monet"
