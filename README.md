# Kalkulator Średniej Ocen dla Mobidziennik

## Opis
Kalkulator Średniej Ocen to rozszerzenie do przeglądarki, które automatycznie oblicza średnie ocen w dzienniku elektronicznym Mobidziennik. Rozszerzenie dodaje funkcje wyświetlania średniej dla każdego przedmiotu, średniej ogólnej, wykresów zmian ocen w czasie oraz symulacji wpływu nowych ocen na średnią.

## Funkcje
- **Automatyczne obliczanie średnich** - Natychmiastowe obliczanie średniej ważonej dla każdego przedmiotu
- **Średnia ogólna** - Kalkulacja i wyświetlanie średniej ze wszystkich przedmiotów na dole strony
- **Interaktywne wykresy** - Wizualizacja zmian średniej w czasie z kolorowymi oznaczeniami wzrostu i spadku
- **Symulacja ocen** - Możliwość sprawdzenia jak potencjalne oceny wpłyną na średnią
- **Intuicyjny interfejs** - Przejrzyste, kolorowe oznaczenia wzrostu i spadku średniej
- **Dynamiczne odświeżanie** - Automatyczna aktualizacja po dodaniu nowych ocen

## Instalacja

### Firefox
[![Pobierz dla Firefox](https://img.shields.io/badge/Firefox-pobierz-orange)](https://addons.mozilla.org/pl/firefox/addon/kalkulator-sredniej-ocen/) (link do zaktualizowania po publikacji)

### Chrome
[![Pobierz dla Chrome](https://img.shields.io/badge/Chrome-pobierz-blue)](https://chrome.google.com/webstore/detail/kalkulator-sredniej-ocen/) (link do zaktualizowania po publikacji)

### Instalacja manualna
1. Pobierz pliki rozszerzenia
2. Rozpakuj do wybranego folderu
3. W przeglądarce otwórz zakładkę Rozszerzenia
4. Włącz tryb dewelopera
5. Kliknij "Załaduj rozpakowane" i wskaż folder z rozszerzeniem

## Jak używać
1. Zaloguj się do systemu Mobidziennik
2. Przejdź do strony z ocenami
3. Rozszerzenie automatycznie obliczy i wyświetli średnie dla każdego przedmiotu
4. Kliknij przycisk "+" przy przedmiocie, aby symulować nowe oceny
5. Kliknij przycisk "Wykres" aby zobaczyć graficzną reprezentację zmian średniej w czasie
6. Na dole strony pojawi się panel z ogólną średnią ze wszystkich przedmiotów

### Funkcja wykresu
- Wykres pokazuje zmianę średniej w czasie po każdej dodanej ocenie
- Zielona linia oznacza wzrost średniej, czerwona spadek, niebieska brak zmiany
- Najedź kursorem na punkt wykresu, aby zobaczyć szczegóły oceny i średniej
- Najedź kursorem na linię wykresu, aby zobaczyć zmianę średniej między ocenami

### Funkcja symulacji ocen
- Wybierz ocenę i jej wagę w panelu symulacji
- Kliknij "Oblicz" aby sprawdzić potencjalny wpływ oceny na średnią
- Kliknij "Dodaj do wykresu" aby dodać symulowaną ocenę do wykresu
- Możesz dodać wiele symulowanych ocen i obserwować zmiany na wykresie
- Kliknij "Wyczyść" aby usunąć wszystkie symulowane oceny

## Planowane funkcje
- **Eksport danych** - Możliwość zapisania wyników i wykresów do PDF lub obrazu
- **Cele edukacyjne** - Ustawianie celów dla średnich i śledzenie postępów
- **Tryb ciemny** - Alternatywny schemat kolorów dla interfejsu
- **Dodatkowe statystyki** - Rozszerzone analizy wyników, w tym trendy długoterminowe
- **Powiadomienia** - Opcjonalne alerty o nowych ocenach i ich wpływie na średnią

## Prywatność
Rozszerzenie działa całkowicie lokalnie w przeglądarce i nie przesyła żadnych danych na zewnętrzne serwery. Wszystkie obliczenia są wykonywane na Twoim urządzeniu.

## Kompatybilność
- Działa z przeglądarkami Firefox i Chrome
- Dostosowane do interfejsu Mobidziennik

## Dla deweloperów
Projekt wykorzystuje:
- JavaScript (vanilla)
- SVG dla wizualizacji wykresów (bez zewnętrznych bibliotek)
- WebExtension API

### Struktura projektu
```
src/
  content/       # Skrypty działające na stronie
  icons/         # Ikony rozszerzenia
  lib/           # Biblioteki zewnętrzne
  popup/         # Interfejs popup rozszerzenia
```

## Zgłaszanie błędów
Jeśli znalazłeś błąd lub masz propozycję nowej funkcji, zgłoś ją poprzez zakładkę Issues w repozytorium GitHub.

## Licencja
MIT License

Copyright (c) 2025

Niniejszym udziela się, bezpłatnie, każdej osobie, która otrzyma kopię tego oprogramowania i związanych z nim plików dokumentacji ("Oprogramowanie"), prawa do nieograniczonego korzystania z Oprogramowania, w tym bez ograniczeń prawa do używania, kopiowania, modyfikowania, łączenia, publikowania, rozpowszechniania, sublicencjonowania i/lub sprzedaży kopii Oprogramowania, a także zezwolenia osobom, którym Oprogramowanie jest dostarczane, na takie działania, z zastrzeżeniem następujących warunków:

Powyższa informacja o prawach autorskich oraz niniejsza informacja o zezwoleniu będą dołączone do wszystkich kopii lub istotnych części Oprogramowania.

OPROGRAMOWANIE JEST DOSTARCZANE "TAKIE JAKIE JEST", BEZ ŻADNYCH GWARANCJI, WYRAŹNYCH LUB DOROZUMIANYCH, W TYM, ALE NIE WYŁĄCZNIE, GWARANCJI PRZYDATNOŚCI HANDLOWEJ, PRZYDATNOŚCI DO OKREŚLONEGO CELU I NIENARUSZALNOŚCI PRAW. W ŻADNYM WYPADKU AUTORZY LUB POSIADACZE PRAW AUTORSKICH NIE PONOSZĄ ODPOWIEDZIALNOŚCI ZA JAKIEKOLWIEK ROSZCZENIA, SZKODY LUB INNĄ ODPOWIEDZIALNOŚĆ, CZY TO W RAMACH DZIAŁANIA UMOWY, DELIKTU CZY W INNY SPOSÓB, POWSTAŁE Z, LUB W ZWIĄZKU Z OPROGRAMOWANIEM LUB UŻYTKOWANIEM LUB INNYMI DZIAŁANIAMI W OPROGRAMOWANIU.