# Specyfikacja Techniczna: Prototyp Gry "Conway's Garden"

## 1. Przegląd Projektu
Gra logiczno-symulacyjna typu sandbox, łącząca mechanikę zarządzania inwentarzem z automatem komórkowym Conway’s Game of Life. Gracz sadzi i zbiera rośliny na siatce 4x4, starając się zapanować nad ich automatyczną ewolucją.

## 2. Mechanika Rozgrywki (Gameplay)

### 2.1. Plansza i Świat
* **Siatka:** 16 pól w układzie 4x4.
* **Krawędzie:** Traktowane jako ściany (brak zawijania planszy – "Dead Borders").
* **Stan początkowy:** Plansza jest pusta, gracz posiada 5 roślin w inwentarzu.

### 2.2. Cykl Życia (The Pulse)
Co 10 sekund następuje automatyczna aktualizacja wszystkich pól zgodnie z zasadami Game of Life:
* **Zasada Przetrwania:** Roślina zostaje na polu, jeśli ma 2 lub 3 sąsiadów.
* **Zasada Śmierci:** Roślina znika, jeśli ma <2 (izolacja) lub >3 (przeludnienie) sąsiadów.
* **Zasada Narodzin:** W pustym polu powstaje roślina, jeśli ma dokładnie 3 sąsiadów (roślina ta pojawia się "znikąd", nie uszczuplając inwentarza).
* **Implementacja:** Należy zastosować *Double Buffering* (obliczanie nowego stanu na kopii planszy).

### 2.3. Akcje Gracza i Inwentarz
* **Sadzenie:** Kliknięcie na puste pole odejmuje 1 roślinę z inwentarza i umieszcza ją na planszy.
* **Zbiór:** Kliknięcie na zajęte pole usuwa roślinę z planszy i dodaje 1 do inwentarza.
* **Inwentarz:** Przechowuje liczbę roślin; zapobiega sadzeniu przy stanie 0.

## 3. Interfejs Użytkownika (UI) i Estetyka

### 3.1. Styl Wizualny
* **Klimat:** Kreskówkowy (Cartoon), żywe kolory, gruby obrys (bold outlines), styl 2D vector.
* **Paleta:** Brązy ziemi (plansza) oraz soczysta zieleń (rośliny/timer).

### 3.2. Komponenty UI
* **Inwentarz:** Ikona rośliny z licznikiem (np. "x5"). Wybrany slot posiada złotą, pulsującą ramkę.
* **Timer (Radial Clock):** Koło w kolorze ciemnej zieleni, które w ciągu 10 sekund zapełnia się jasną zielenią (zgodnie z ruchem wskazówek zegara). Po zapełnieniu następuje Impuls i reset.
* **Plansza:** Stylizowane grządki w odcieniach brązu (jaśniejsze pola, ciemniejsze granice).

## 4. Lista Zasobów (Assets)

| Zasób | Opis |
| :--- | :--- |
| `tile_ground` | Kafel ziemi (jasny brąz, zaokrąglone rogi). |
| `plant_sprite` | Kreskówkowa roślina z dwoma listkami. |
| `ui_slot` | Ramka inwentarza + złota ramka wyboru. |
| `timer_radial` | Dwa koła: ciemnozielone (tło) i jasnoniebieskie/limonkowe (wypełnienie). |
| `fx_poof` | Animacja zniknięcia (chmurka). |
| `font_main` | Zaokrąglona, czytelna czcionka typu "Bubble". |

## 5. Logika Techniczna (Pseudokod)

```pseudo
FUNCTION UpdateGame():
    IF Timer >= 10:
        NewState = CalculateConway(CurrentGrid)
        CurrentGrid = NewState
        Timer = 0
    ELSE:
        Timer += DeltaTime

FUNCTION OnTileClick(x, y):
    IF Grid[x][y] == EMPTY AND Inventory > 0:
        Grid[x][y] = OCCUPIED
        Inventory -= 1
    ELSE IF Grid[x][y] == OCCUPIED:
        Grid[x][y] = EMPTY
        Inventory += 1
        
## 6. Rozwój (Roadmap)
* Dodanie wielu gatunków roślin (każdy z własnym licznikiem i ikoną).
* Wprowadzenie waluty (sprzedaż zebranych roślin).
* Zakup ulepszeń modyfikujących wygląd i zasady gry.
