# Life OS

Persönlicher Habit-, Gym- und Schul-Tracker. Alle Daten bleiben lokal im Browser (`localStorage`, Präfix `lifeos:`).

## Schnellstart
```bash
python3 build.py          # erzeugt release/Life-OS.html
```
`release/Life-OS.html` ist eine einzelne, offline-fähige Datei – einfach im Browser öffnen.

## Ordnerstruktur
```
life-os/
├── build.py                    Baut alles zu einer HTML-Datei zusammen
├── release/Life-OS.html        Fertige App (Build-Ergebnis)
└── src/
    ├── index.html              HTML-Gerüst mit Platzhaltern (Splash, Login, Tabs, Modals)
    ├── css/
    │   ├── app.css             Tailwind + Komponenten-Styles
    │   └── design-refresh.css  Neues Design (überschreibt app.css)
    ├── js/
    │   └── app.bundle.js       App-Kern + Chart.js + Three.js (minifizierter Vite-Build)
    └── legacy/                 Lesbare Feature-Module, Ladereihenfolge = Nummer
        ├── core/      01 3D-Roboter · 03 Sound · 10 Start & Navigation · 20 Init
        ├── services/  05 Konten & Vault
        ├── ui/        06 Themes · 12 Effekte · 15 Dashboard/Verlauf · 16 Modals & Charts
        ├── data/      07 Standardwerte + Hilfsfunktionen (escapeHtml)
        └── features/  08 Roboter-Shop · 09 Daily Challenges · 11 Roboter-Emotionen
                       13 Habits & Kalorien · 14 Rang · 17 Trainingspläne · 18 Gym · 19 Schule
                       21 Streaks
```

## Wo ändere ich was?
| Ich will …                          | Datei                                   |
|-------------------------------------|-----------------------------------------|
| Farben / Look anpassen              | `src/css/design-refresh.css` (`:root`)  |
| Schul-/Notenlogik                   | `src/legacy/features/19-school.js`      |
| Gym / Trainingspläne                | `src/legacy/features/18-gym.js`, `17-training-plans.js` |
| Habits & Kalorien                   | `src/legacy/features/13-habits-calories.js` |
| Standard-Habits / Übungen           | `src/legacy/data/07-defaults.js`        |
| Texte im Login / Splash / Tabs      | `src/index.html`                        |

Neue Legacy-Datei? → Muss sowohl in `LEGACY_ORDER` (build.py) als auch in der Ladeliste im Bundle stehen.
Globale Helfer aus dem Bundle, die Legacy-Code nutzt: `load`, `save`, `key`, `LifeIcon`, `Chart`, `THREE`.

## Änderungsprotokoll (Überarbeitung)
- Code in Module/Ordner aufgeteilt, Build-Skript ergänzt
- **Fix:** Nutzereingaben (Fach-, Noten-, Kategorie-, Habit-, Plan-, Übungsnamen) werden jetzt escaped –
  Namen mit `"`, `<`, `&` zerstörten vorher Eingabefelder bzw. das Layout
- **Fix:** Übungsnamen mit Apostroph (z. B. „Farmer's Walk") brachen den PR-Button im Trainingsplan
  (das `replace(/'/g, "'")` war wirkungslos); dasselbe beim Löschen von Noten
- **Fix:** Aufrufe nicht existierender Funktionen `checkRivalUrlSync` / `checkGroupUrlSync` entfernt
- Doppelte `var i`-Deklaration in Daily Challenges bereinigt
- Toten Code entfernt (`addFach` – durch `openAddFachModal` ersetzt)
- Eingebettetes Cloudflare-Tracking-Script entfernt (Rest vom Speichern der Webseite, lud nur ins Leere)
- Design-Refresh 2026
- Neues Logo (`src/assets/logo.svg`): Fortschrittsring + „L“ mit Aufwärtspfeil – in Header, Splash, Favicon & Apple-Touch-Icon
- Native App (`native-app/`): Capacitor 8 + Apple Health / Health Connect, Setup-Skript, Android-Build per GitHub Actions
- **Neu: Streaks** (`features/21-streaks.js`): Flammen-Chip im Header, Streak-Karte auf Home (Wochenleiste,
  Rekord, Fortschritt zum nächsten Meilenstein), Detail-Fenster mit 30-Tage-Kalender, Feier-Animation beim
  Eintragen, Meilensteine 3/7/14/30/50/100/200/365 Tage mit XP-Bonus
- **Fix:** alte Streak-Zählung zählte nur Einträge ≥ 60 Punkte hintereinander statt echter Kalendertage
- Design auf Apple-Health-Stil umgestellt: reines Schwarz, flache graue Karten, SF-Systemschrift, keine Verläufe/Glows, iOS-Tab-Bar & Listen
- Streak ist jetzt ein echtes Dashboard-Widget (verschieben, Größe kompakt/halb/voll, Ansicht Woche/Meilenstein, ausblenden, in Widget-Bibliothek); Logo auf Variante 05 „Puls“ umgestellt
- Habit-Auswahl: „Cheat“ (0 %) wird rot, „Gut“ (100 %) grün, Zwischenstufen orange; ohne Auswahl ist kein Button vorausgewählt
- Kalorien als eigenes Dashboard-Widget („Kalorien“, Größe halb/voll, eigener Speichern-Button); aus dem Tageseintrag herausgelöst. Fix: „Heute speichern“-Button war weiß auf weiß
