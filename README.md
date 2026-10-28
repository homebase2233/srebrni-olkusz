# Srebrni Olkusz — aplikacja PWA

Lekka, responsywna aplikacja internetowa, którą można dodać do ekranu głównego Androida. Nie wymaga Google Play, konta, płatnego hostingu ani instalowania narzędzi programistycznych.

## Co zawiera MVP

- ekran startowy z aktualnościami;
- drużyny 2016/17, 2018, 2019 i 2020/21/22;
- miesięczny kalendarz z filtrem drużyn i listą wydarzeń;
- informacje o akademii, kontakt oraz zapowiedź „Mojej Karty Piłkarza”;
- instalację PWA i podstawowe działanie offline po pierwszej wizycie.

Aktualności i terminy są celowo puste. Wpisuj potwierdzone przez akademię informacje w `content.js`. Nie publikuj danych osobowych dzieci ani ich zdjęć bez wymaganych zgód. Kontakt prowadzi do oficjalnej strony akademii.

## Publikacja bezpłatnie przez GitHub Pages

Wskazane publiczne repozytorium to [homebase2233/srebrni-olkusz](https://github.com/homebase2233/srebrni-olkusz). Zawiera aktualną stronę akademii i może służyć do publikacji tej aplikacji.

1. Otwórz repozytorium i zaloguj się do GitHub.
2. Rozpakuj ten folder, jeśli pobrałeś go jako ZIP.
3. W repozytorium wybierz **Add file → Upload files**.
4. Przeciągnij pliki z tego folderu do głównego katalogu repozytorium. Zastąp `index.html`; dodaj `app.css`, `app.js`, `content.js`, `manifest.webmanifest`, `sw.js` i `icon.svg`.
5. Wybierz **Commit changes** i zapisz zmianę do gałęzi `main`.
6. W repozytorium wejdź w **Settings → Pages**. Jako źródło wybierz **Deploy from a branch**, gałąź `main` i katalog `/ (root)`, a następnie **Save**.
7. Po publikacji GitHub pokaże adres strony w sekcji Pages. Otwórz go w Chrome na Androidzie.
8. W menu Chrome wybierz **Zainstaluj aplikację** albo **Dodaj do ekranu głównego**.

Jeśli GitHub Pages jest już włączone dla gałęzi `main`, wystarczy przesłać pliki i poczekać, aż wdrożenie zakończy się w zakładce **Actions**. Repozytorium jest stroną typu project site, dlatego wszystkie zasoby aplikacji używają ścieżek względnych.

## Dodawanie aktualności i wydarzeń

Otwórz `content.js` i uzupełnij tablice `news` oraz `events`. Przykładowa struktura:

```js
news: [
  { day: "12", month: "CZERWIEC", category: "AKADEMIA", title: "Tytuł komunikatu", description: "Treść potwierdzona przez akademię." }
],
events: [
  { date: "2026-06-12", type: "training", teamId: "2018", title: "Trening", time: "17:00", location: "Olkusz" }
]
```

`type` wydarzenia to `training` albo `match`. `teamId` powinno mieć wartość `2016-17`, `2018`, `2019` lub `2020-22`. Datę podaj jako `RRRR-MM-DD`. Zapisz zmianę i wgraj zaktualizowany `content.js` do repozytorium.

## Edycja iPhone / Android

PWA działa w przeglądarce na Androidzie i iOS. Instalacja na Androidzie jest dostępna z menu Chrome; na iPhonie użyj Safari → **Udostępnij → Do ekranu początkowego**. Pełna instalacja wymaga publikacji przez HTTPS, które GitHub Pages zapewnia automatycznie.

Herb klubu jest używany w nagłówku, ekranie startowym i ikonach instalacyjnych PWA.
