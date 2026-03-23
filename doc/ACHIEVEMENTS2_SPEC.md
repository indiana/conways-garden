# Specyfikacja Techniczna: System Progresji Ogrodu i Osiągnięć (v3.1)

## 1. Dynamika Wielkości Ogrodu
Gra wprowadza ewolucyjny model rozbudowy pola. Rozmiar kafelka pozostaje stały (128x128 px), a siatka rozszerza się wraz z postępami gracza, zachowując wycentrowanie na ekranie.

| Poziom Ogrodu | Wymiary | Liczba Pól | Warunek Odblokowania | Koszt Upgradu |
| :--- | :--- | :--- | :--- | :--- |
| **Startowy** | $3 \times 3$ | 9 | Dostępny od początku | 0 monet |
| **Poziom 2** | $4 \times 4$ | 16 | Osiągnięcie: "Pierwsze kroki" | 50 monet |
| **Poziom 3** | $5 \times 5$ | 25 | Osiągnięcie: "Złota Rączka" | 250 monet |

---

## 2. Lista Osiągnięć (Układ 3-liniowy)
Osiągnięcia bazują na zmiennej `TotalGoldEarned` (całkowita suma monet zebranych ze sprzedaży, bez odejmowania wydatków).

### 2.1. Próg: 100 monet (Suma zarobków)
* **Linia 1:** `[🏆]` **Pierwsze kroki**
* **Linia 2:** Zarób łącznie 100 monet ze sprzedaży swoich plonów.
* **Linia 3:** **ODBLOKOWUJE:** Upgrade: Powiększenie ogrodu (4x4).

### 2.2. Próg: 1 000 monet (Suma zarobków)
* **Linia 1:** `[💰]` **Złota Rączka**
* **Linia 2:** Zarób łącznie 1 000 monet ze sprzedaży swoich plonów.
* **Linia 3:** **ODBLOKOWUJE:** Upgrade: Powiększenie ogrodu (5x5).

### 2.3. Próg: 10 000 monet (Suma zarobków)
* **Linia 1:** `[💎]` **Zielony Inwestor**
* **Linia 2:** Zarób łącznie 10 000 monet ze sprzedaży swoich plonów.
* **Linia 3:** **ODBLOKOWUJE:** *Wkrótce nowa nagroda!*

### 2.4. Próg: 100 000 monet (Suma zarobków)
* **Linia 1:** `[👑]` **Magnat Flory**
* **Linia 2:** Zarób łącznie 100 000 monet ze sprzedaży swoich plonów.
* **Linia 3:** **ODBLOKOWUJE:** *Wkrótce nowa nagroda!*

---

## 3. Logika Implementacji (Phaser.js)

### 3.1. Przeliczanie Siatki (Resize Logic)
Przy zakupie ulepszenia, gra musi wygenerować nową grupę kafelków, biorąc pod uwagę centrowanie. Rośliny z poprzedniej siatki powinny zostać przeniesione na nową.
