#!/usr/bin/env python3
"""
Life OS · Build-Skript
======================
Fügt alle Quelldateien aus src/ wieder zu EINER eigenständigen HTML-Datei
zusammen (offline-fähig, ohne Server per Doppelklick zu öffnen).

    python3 build.py            ->  release/Life-OS.html

Platzhalter in src/index.html:
    <!-- @inline-module <datei> -->   ES-Modul-Bundle (Chart.js, Three.js, App-Kern)
    <!-- @inline-style  <datei> -->   Stylesheet
    <!-- @inline-legacy -->           alle Dateien aus src/legacy/ (Reihenfolge s. LEGACY_ORDER)
"""
import base64, json, re, sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "release" / "Life-OS.html"

# Muss mit der Ladeliste im App-Bundle übereinstimmen (Reihenfolge = Abhängigkeiten!)
LEGACY_ORDER = [
    "core/01-three-robot.js",
    "core/03-sound.js",
    "services/05-accounts.js",
    "ui/06-themes.js",
    "data/07-defaults.js",
    "features/08-robots-shop.js",
    "features/09-daily-challenges.js",
    "core/10-startup-navigation.js",
    "features/11-robot-emotions.js",
    "ui/12-effects.js",
    "features/13-habits-calories.js",
    "features/14-rank.js",
    "ui/15-dashboard-history.js",
    "ui/16-modals-charts.js",
    "features/17-training-plans.js",
    "features/18-gym.js",
    "features/19-school.js",
    "features/21-streaks.js",
    "core/20-init.js",
]


def read(rel):
    return (SRC / rel).read_text(encoding="utf-8")


def guard(text, tag):
    if re.search(rf"</{tag}", text, re.I):
        sys.exit(f"Fehler: '</{tag}' in eingebettetem Inhalt gefunden – würde das HTML zerbrechen.")
    return text


def legacy_block():
    sources = {name: read(f"legacy/{name}") for name in LEGACY_ORDER}
    payload = json.dumps(sources, ensure_ascii=False).replace("<", "\\u003c")
    return ("<script>window.__LIFEOS_STANDALONE__=true;"
            f"window.__LIFEOS_LEGACY_SOURCES__={payload};</script>")


def main():
    html = read("index.html")
    html = re.sub(r"<!-- @inline-module (\S+) -->",
                  lambda m: f'<script type="module" crossorigin>{guard(read(m[1]), "script")}</script>', html)
    html = re.sub(r"<!-- @inline-style (\S+) -->",
                  lambda m: f"<style>{guard(read(m[1]), 'style')}</style>", html)
    html = html.replace("<!-- @inline-legacy -->", legacy_block())
    # Logo einsetzen (Favicon, Apple-Touch-Icon, CSS)
    svg_uri = "data:image/svg+xml;base64," + base64.b64encode((SRC / "assets/logo.svg").read_bytes()).decode()
    png_uri = "data:image/png;base64," + base64.b64encode((SRC / "assets/logo-180.png").read_bytes()).decode()
    html = html.replace("__LOGO_SVG_URI__", svg_uri).replace("__LOGO_PNG_URI__", png_uri)
    if "@inline" in html or "__LOGO_" in html:
        sys.exit("Fehler: nicht ersetzter Platzhalter in index.html")
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    web = ROOT / "web"; web.mkdir(exist_ok=True)
    (web / "index.html").write_text(html, encoding="utf-8")  # zum Hochladen (Netlify/GitHub Pages)
    print(f"✓ {OUT.relative_to(ROOT)}  ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
