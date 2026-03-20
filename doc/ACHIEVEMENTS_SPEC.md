# Specyfikacja Techniczna: System Osiągnięć i Rozbudowy Pola (v2.9)

## 1. System Osiągnięć (Achievements UI)
Zmieniamy strukturę prezentacji osiągnięć na bardziej przejrzystą, 3-liniową formę, co ułatwi czytanie na urządzeniach mobilnych i w przeglądarce.

### 1.1. Układ Pojedynczego Osiągnięcia (Layout)
Każdy wpis na liście zajmuje dedykowany kontener o następującej strukturze pionowej:

*   **Linia 1 (Nagłówek):** `[Ikona_Pucharu]` **NAZWA OSIĄGNIĘCIA** (Font: Fredoka One, Bold) ✔️ (jeśli osiągnięcie zdobyte)
*   **Linia 2 (Instrukcja):** *Opis warunku do zdobycia* (np. "Zbierz 200 złota.")
*   **Linia 3 (Bonus):** **ODBLOKOWUJE:** [Nazwa Nagrody] (Kolor wyróżniający, np. złoty)

### 1.2. Osiągnięcie: "Pierwsze kroki"
*   **Linia 1:** `[🏆]` **Pierwsze kroki**
*   **Linia 2:** Zbierz łącznie 200 monet w swoim portfelu.
*   **Linia 3:** **ODBLOKOWUJE:** Upgrade: Powiększenie siatki 5x5.

---

## 2. Upgrade: Powiększenie Siatki 5x5
Mechanika przejścia z formatu 4x4 na 5x5 przy zachowaniu oryginalnej wielkości kafelków.

### 2.1. Logika Przestrzenna (No-Scale Resize)
Zamiast zmniejszać kafelki, gra rozszerza obszar roboczy. Wymaga to od silnika Phaser.js:
*   **Centrowanie:** Przeliczenie punktu zakotwiczenia (Anchor Point) całej grupy siatki, aby po dodaniu 5. kolumny i 5. rzędu, plansza nadal była wycentrowana na ekranie.
*   **Dynamiczne Renderowanie:** Funkcja `drawGrid` musi zostać wywołana ponownie z nowymi parametrami pętli (`for x < 5`, `for y < 5`).
*   **Kamera:** Jeśli siatka 5x5 wychodzi poza pierwotny obszar widzenia, kamera powinna płynnie oddalić się (Zoom Out) lub po prostu wyświetlić większy fragment tła.

### 2.2. Dane przedmiotu w sklepie
*   **Nazwa:** Powiększenie ogrodu (5x5)
*   **Koszt:** 100 monet.
*   **Typ:** `Upgrade` (Natychmiastowy, jednorazowy).
*   **Widoczność:** Pojawia się w zakładce **KUP** dopiero po fladze `ach_first_steps = true`.

---

## 3. Logika Implementacji (Phaser.js)

### 3.1. Przebieg Odblokowania
1.  **Monitor:** `if (player.gold >= 200) unlock('first_steps')`.
2.  **Sklep:** `if (unlocked('first_steps')) showItem('upgrade_grid_5x5')`.
3.  **Zakup:** `onClick -> player.gold -= 100 -> triggerUpgrade('grid_5x5')`.
4.  **Efekt:**
    ```javascript
    function triggerUpgrade(type) {
        if (type === 'grid_5x5') {
            this.gridSize = 5;
            this.renderNewGrid(); // Funkcja tworząca 25 kafelków w nowych współrzędnych
            this.showVisualEffect('expand'); // Opcjonalny efekt cząsteczkowy
        }
    }
    ```

---

## 4. Wytyczne Wizualne
*   **Puste pola:** Nowo powstałe 9 pól (różnica między 16 a 25) powinno pojawić się z animacją "wyskakiwania" (Bounce), aby gracz zauważył nową przestrzeń do sadzenia.
*   **Kolorystyka:** Osiągnięcia zablokowane powinny mieć tekst w odcieniu szarości, a po odblokowaniu zmieniać się na pełny kolor z białą czcionką Fredoka One.
