# Specyfikacja: Nowy Gatunek i Logika Dziedziczenia (v2.6)

## 1. Nowy Gatunek: TRAWA (grass_01)
Trawa to odporny gatunek o niskim koszcie, idealny do stabilizacji ekosystemu na siatce.

### 1.1. Dane techniczne i Ekonomia
* **ID:** `grass_01`
* **Typ:** `Plant`
* **Cena Zakupu:** 4 monety
* **Cena Sprzedaży:** 2 monety (wyliczane jako 50% ceny zakupu)
* **Assety:** 
    * Widok siatki: `tile_grass128.png`
    * Ikona UI: `icon_grass80.png`

### 1.2. Logika Przetrwania (Survival Rules)
Trawa posiada zmodyfikowane zasady w porównaniu do standardowych automatów komórkowych:
* **Przeżywa:** Jeśli ma **1, 2 lub 3** sąsiadów. (Wymaga tylko jednego sąsiada, by nie zginąć z izolacji).
* **Ginie:** Jeśli ma **0** sąsiadów (izolacja) lub **>3** sąsiadów (przeludnienie).

---

## 2. Mechanika Dziedziczenia (Hybrid Birth)
Mechanika ta określa, jaki gatunek rośliny pojawi się na pustym polu, gdy spełniony zostanie warunek narodzin (dokładnie 3 sąsiadów).

### 2.1. Algorytm Szansy (Probability)
Gatunek nowej rośliny jest determinowany przez skład gatunkowy jej "rodziców" (3 sąsiadujących pól). Szansa na dany gatunek wynosi:
`P(Gatunek) = (Liczba sąsiadów danego gatunku / 3) * 100%`

**Tabela prawdopodobieństwa:**
| Sąsiedzi (Rodzice) | Szansa na Rzepę | Szansa na Trawę |
| :--- | :--- | :--- |
| 3x Trawa | 0% | 100% |
| 2x Trawa + 1x Rzepa | 33% | 66% |
| 1x Trawa + 2x Rzepa | 66% | 33% |
| 3x Rzepa | 100% | 0% |

### 2.2. Implementacja w "Impulsie"
W momencie narodzin silnik losuje gatunek z tablicy sąsiadów:
```javascript
// Pseudokod losowania gatunku
let parents = getNeighbors(emptyTile); // Tablica 3 gatunków
let childSpecies = parents[Math.floor(Math.random() * parents.length)];
spawnPlant(emptyTile, childSpecies);
