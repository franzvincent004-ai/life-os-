# Life OS als native App mit Apple Health & Health Connect

Die App hat die Health-Anbindung schon eingebaut (Plugin `@capgo/capacitor-health`):
Einstellungen → **Apple Health & Apple Watch** verbinden → Schritte, Distanz, aktive Kalorien,
Herzfrequenz und Gewicht der letzten 30 Tage werden importiert und bei jedem Sync aktualisiert.

---

## iPhone (Apple Health) – braucht einen Mac, sonst kostenlos

### Einmalig
- **Xcode** (Mac App Store), einmal öffnen
- **Node.js 22 oder neuer** (nodejs.org)

### Projekt erzeugen
```bash
cd life-os/native-app
npm install
npm run setup:ios      # baut Web-App, erzeugt ios/, trägt HealthKit + Texte ein
npm run ios            # öffnet Xcode
```

### In Xcode
1. Links **App** → Tab **Signing & Capabilities**
2. **Team** → deine Apple-ID (kostenloses „Personal Team“)
3. **Bundle Identifier** eindeutig machen, z. B. `de.max.lifeos`
4. Prüfen, dass **HealthKit** in der Capability-Liste steht (sonst `+ Capability` → HealthKit)
5. `App/Assets.xcassets/AppIcon` → `resources/icon.png` hineinziehen
6. iPhone per Kabel anschließen → als Ziel wählen → ▶︎
7. iPhone: *Einstellungen → Allgemein → VPN & Geräteverwaltung* → vertrauen,
   ggf. *Datenschutz & Sicherheit → Entwicklermodus* an
8. In der App: Einstellungen → Apple Health verbinden → alles erlauben

### Nach Änderungen
```bash
npm run sync           # dann in Xcode ▶︎
```

**Kostenlos heißt:** App muss alle **7 Tage** neu per ▶︎ installiert werden (Daten bleiben erhalten).
Max. 3 eigene Apps gleichzeitig.

---

## Android (Health Connect = „Google Health“) – komplett kostenlos, kein Mac

**Variante A – ohne Installation:** Ordner `life-os` in ein GitHub-Repo hochladen →
Tab **Actions** → „Android APK“ → **Run workflow** → nach ~5 Min. APK unter *Artifacts*
herunterladen, aufs Handy kopieren, installieren („Unbekannte Quellen“ erlauben).

**Variante B – lokal:** Android Studio + Node 22 →
```bash
cd life-os/native-app && npm install && npm run setup:android && npm run android
```
→ in Android Studio ▶︎.

Health Connect ist ab Android 14 eingebaut, darunter App „Health Connect“ aus dem Play Store.
Fitbit, Samsung Health, Google Fit usw. schreiben dort hinein → Life OS liest es aus.

---

## Wichtig
- **Daten** aus Browser/Web-App werden nicht automatisch übernommen →
  Einstellungen → Transfer-Schlüssel exportieren → in der nativen App importieren.
- „Google Health“ gibt es auf dem **iPhone nicht** als Datenquelle. Geräte wie Fitbit/Garmin/Oura
  müssen ihre Daten in Apple Health schreiben (in deren App aktivieren) – dann kommen sie hier an.
- Importiert werden aktuell: Schritte, Distanz, aktive Kalorien, Herzfrequenz, Gewicht.

---

## iPhone OHNE Mac (kostenlos, mit Windows-PC)

1. **Repo anlegen:** Ordner `life-os` als **öffentliches** GitHub-Repo hochladen
   (nur öffentliche Repos bekommen Mac-Build-Minuten gratis).
2. **Bauen:** GitHub → **Actions** → „iOS IPA“ → **Run workflow** → nach ~10 Min.
   `LifeOS.ipa` unter *Artifacts* herunterladen (ZIP entpacken).
3. **Installieren** – eine der beiden Varianten:
   - **Sideloadly** (sideloadly.io, Windows): iPhone per Kabel, iTunes von apple.com installiert,
     `.ipa` reinziehen, Apple-ID eingeben → Start.
   - **SideStore** (sidestore.io): einmalig mit PC einrichten, danach erneuert sich die App
     **direkt auf dem iPhone** alle 7 Tage – ohne PC.
4. iPhone: *Einstellungen → Allgemein → VPN & Geräteverwaltung* → Apple-ID vertrauen,
   *Datenschutz & Sicherheit → Entwicklermodus* an.

⚠️ **Apple Health beim Sideloaden:** Ob deine kostenlose Apple-ID die HealthKit-Berechtigung
bekommt, entscheidet Apple beim Signieren. Bei Sideloadly unter *Advanced Options*
„Signing Mode: Apple ID Sideload“ wählen. Kommt beim Verbinden „nicht verfügbar“, wurde die
Berechtigung entfernt – dann geht Health nur mit 99 €-Account.
