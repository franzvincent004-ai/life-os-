// Richtet die nativen Projekte für Apple Health (HealthKit) und
// Health Connect (Android / Google) ein. Mehrfach ausführbar.
//   node scripts/patch-native.mjs ios|android|all
import fs from "node:fs";
import path from "node:path";

const target = process.argv[2] || "all";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const log = (m) => console.log("  ✓ " + m);

function patchIOS() {
  const appDir = path.join(root, "ios/App/App");
  if (!fs.existsSync(appDir)) return console.log("  – ios/ fehlt (erst npm run setup:ios)");

  // 1) Info.plist: Begründungstexte, die iOS im Health-Dialog zeigt
  const plist = path.join(appDir, "Info.plist");
  let p = fs.readFileSync(plist, "utf8");
  const keys = {
    NSHealthShareUsageDescription:
      "Life OS liest Schritte, Distanz, aktive Kalorien, Herzfrequenz und Gewicht, um deine Tageswerte automatisch zu füllen. Die Daten bleiben auf deinem iPhone.",
    NSHealthUpdateUsageDescription: "Life OS schreibt nur Werte, die du selbst einträgst.",
  };
  for (const [k, v] of Object.entries(keys)) {
    if (!p.includes(`<key>${k}</key>`)) {
      p = p.replace(/<dict>/, `<dict>\n\t<key>${k}</key>\n\t<string>${v}</string>`);
      log(`Info.plist: ${k}`);
    }
  }
  fs.writeFileSync(plist, p);

  // 2) Entitlements-Datei mit HealthKit
  const ent = path.join(appDir, "App.entitlements");
  if (!fs.existsSync(ent)) {
    fs.writeFileSync(
      ent,
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>com.apple.developer.healthkit</key>
\t<true/>
\t<key>com.apple.developer.healthkit.access</key>
\t<array/>
</dict>
</plist>
`,
    );
    log("App.entitlements (HealthKit) angelegt");
  }

  // 3) Entitlements im Xcode-Projekt verknüpfen
  const pbx = path.join(root, "ios/App/App.xcodeproj/project.pbxproj");
  let x = fs.readFileSync(pbx, "utf8");
  if (!x.includes("CODE_SIGN_ENTITLEMENTS")) {
    x = x.replace(/(INFOPLIST_FILE = App\/Info\.plist;)/g, `$1\n\t\t\t\tCODE_SIGN_ENTITLEMENTS = App/App.entitlements;`);
    fs.writeFileSync(pbx, x);
    log("Xcode-Projekt: CODE_SIGN_ENTITLEMENTS gesetzt");
  }
}

function patchAndroid() {
  const appDir = path.join(root, "android");
  if (!fs.existsSync(appDir)) return console.log("  – android/ fehlt (erst npm run setup:android)");

  // 1) Health Connect braucht Android 8 (API 26)
  const vars = path.join(appDir, "variables.gradle");
  let v = fs.readFileSync(vars, "utf8");
  v = v.replace(/minSdkVersion\s*=\s*(\d+)/, (m, n) => (Number(n) < 26 ? "minSdkVersion = 26" : m));
  fs.writeFileSync(vars, v);
  log("minSdkVersion ≥ 26");

  // 2) Datenschutzerklärung (Pflicht für Health Connect)
  const assets = path.join(appDir, "app/src/main/assets/public");
  fs.mkdirSync(assets, { recursive: true });
  fs.copyFileSync(path.join(root, "resources/privacypolicy.html"), path.join(assets, "privacypolicy.html"));
  log("privacypolicy.html kopiert");
}

if (target === "ios" || target === "all") patchIOS();
if (target === "android" || target === "all") patchAndroid();
