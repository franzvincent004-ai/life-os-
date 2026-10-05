// ==================== 05.06 · APP-DESIGN & THEMES ====================
const APP_THEMES = {
  dark: {
    name: "Dark (Standard)",
    icon: "🌑",
    bg: "#0D1219",
    surface: "#171E28",
    surface2: "#202A36",
    surface3: "#2A3644",
    border: "#344252",
    borderSoft: "#283440",
    text: "#F8FAFC",
    text2: "#CBD5E1",
    text3: "#94A3B8",
    grayBg: "#19222D",
    grayBorder: "#314052",
    isLight: false,
  },
  oled: {
    name: "OLED Black",
    icon: "⬛",
    bg: "#000000",
    surface: "#090909",
    surface2: "#111111",
    surface3: "#181818",
    border: "#222222",
    borderSoft: "#151515",
    text: "#FFFFFF",
    text2: "#BFBFBF",
    text3: "#8E8E8E",
    grayBg: "#0A0A0A",
    grayBorder: "#1F1F1F",
    isLight: false,
  },
  light: {
    name: "Ivory (Hell)",
    icon: "☀️",
    bg: "#F8F9FA",
    surface: "#FFFFFF",
    surface2: "#F1F3F5",
    surface3: "#E9ECEF",
    border: "#DEE2E6",
    borderSoft: "#E9ECEF",
    text: "#111827",
    text2: "#4B5563",
    text3: "#6B7280",
    grayBg: "#F1F3F5",
    grayBorder: "#DEE2E6",
    isLight: true,
  },
  midnight: {
    name: "Midnight Blue",
    icon: "🌌",
    bg: "#090D16",
    surface: "#101626",
    surface2: "#182238",
    surface3: "#1F2C47",
    border: "#283655",
    borderSoft: "#1E2942",
    text: "#F1F5F9",
    text2: "#B1C1D8",
    text3: "#869AB8",
    grayBg: "#111A2E",
    grayBorder: "#22304D",
    isLight: false,
  },
  espresso: {
    name: "Warm Espresso",
    icon: "☕",
    bg: "#14110E",
    surface: "#1E1A16",
    surface2: "#2A241F",
    surface3: "#362F28",
    border: "#3F362E",
    borderSoft: "#2E2721",
    text: "#FBF7F4",
    text2: "#C4B9B0",
    text3: "#998D83",
    grayBg: "#1B1713",
    grayBorder: "#332C25",
    isLight: false,
  },
  forest: {
    name: "Forest Green",
    icon: "🌲",
    bg: "#09120C",
    surface: "#101E15",
    surface2: "#192C1F",
    surface3: "#223B2A",
    border: "#2E4B37",
    borderSoft: "#1E3627",
    text: "#F0FDF4",
    text2: "#ADD1B8",
    text3: "#7FA88B",
    grayBg: "#122117",
    grayBorder: "#284231",
    isLight: false,
  },
  ocean: {
    name: "Deep Ocean",
    icon: "🌊",
    bg: "#04151D",
    surface: "#08232E",
    surface2: "#0C3140",
    surface3: "#124354",
    border: "#18556A",
    borderSoft: "#0E3949",
    text: "#ECFEFF",
    text2: "#A5D9E5",
    text3: "#74AFC0",
    grayBg: "#092832",
    grayBorder: "#154859",
    isLight: false,
  },
  royal: {
    name: "Royal Purple",
    icon: "👑",
    bg: "#10091A",
    surface: "#1A1029",
    surface2: "#28183D",
    surface3: "#36204F",
    border: "#493064",
    borderSoft: "#301D46",
    text: "#FAF5FF",
    text2: "#D5B9EA",
    text3: "#A98BC3",
    grayBg: "#1D122D",
    grayBorder: "#3A2552",
    isLight: false,
  },
  sakura: {
    name: "Sakura",
    icon: "🌸",
    bg: "#1A0E14",
    surface: "#26151E",
    surface2: "#34202A",
    surface3: "#452B37",
    border: "#5C3949",
    borderSoft: "#3B2530",
    text: "#FFF1F7",
    text2: "#E6B8CB",
    text3: "#BB879E",
    grayBg: "#2B1822",
    grayBorder: "#503140",
    isLight: false,
  },
  sunset: {
    name: "Sunset",
    icon: "🌅",
    bg: "#190D0B",
    surface: "#251411",
    surface2: "#351C17",
    surface3: "#47271F",
    border: "#61372B",
    borderSoft: "#3F241C",
    text: "#FFF7ED",
    text2: "#F1C1A5",
    text3: "#C48D72",
    grayBg: "#2B1713",
    grayBorder: "#523026",
    isLight: false,
  },
  nord: {
    name: "Nord Frost",
    icon: "❄️",
    bg: "#111820",
    surface: "#18232E",
    surface2: "#22313F",
    surface3: "#2D4050",
    border: "#3C5365",
    borderSoft: "#293B49",
    text: "#F1F5F9",
    text2: "#BED0DE",
    text3: "#91A9BB",
    grayBg: "#1D2A35",
    grayBorder: "#354A5A",
    isLight: false,
  },
  cream: {
    name: "Soft Cream",
    icon: "🤍",
    bg: "#F5F0E7",
    surface: "#FFFDF8",
    surface2: "#EDE5D8",
    surface3: "#E3D8C7",
    border: "#D4C7B4",
    borderSoft: "#E7DDCF",
    text: "#29241E",
    text2: "#665D52",
    text3: "#817568",
    grayBg: "#EEE6DA",
    grayBorder: "#D8CCBA",
    isLight: true,
  },
  lavender: {
    name: "Lavender Light",
    icon: "🪻",
    bg: "#F3F0FA",
    surface: "#FFFFFF",
    surface2: "#E9E3F5",
    surface3: "#DED5EE",
    border: "#CFC2E3",
    borderSoft: "#E3DBF0",
    text: "#251E32",
    text2: "#5D526D",
    text3: "#7C6E8F",
    grayBg: "#EBE5F5",
    grayBorder: "#D5CAE6",
    isLight: true,
  },
  cyber: {
    name: "Cyber Night",
    icon: "⚡",
    bg: "#05050B",
    surface: "#0C0B16",
    surface2: "#141226",
    surface3: "#1E1A35",
    border: "#312A50",
    borderSoft: "#211C3B",
    text: "#F7F7FF",
    text2: "#C3BFE2",
    text3: "#8C86B5",
    grayBg: "#100E20",
    grayBorder: "#292347",
    isLight: false,
  },
};

const APP_ACCENTS = {
  white: { name: "Klassisch", color: "#FFFFFF", lightColor: "#111827" },
  emerald: { name: "Emerald", color: "#10B981", lightColor: "#059669" },
  cyan: { name: "Cyber Cyan", color: "#06B6D4", lightColor: "#0891B2" },
  amber: { name: "Amber", color: "#F59E0B", lightColor: "#D97706" },
  purple: {
    name: "Neon Purple",
    color: "#A855F7",
    lightColor: "#7E22CE",
  },
  ruby: { name: "Ruby Red", color: "#EF4444", lightColor: "#DC2626" },
  pink: { name: "Sakura Pink", color: "#EC4899", lightColor: "#DB2777" },
  blue: { name: "Electric", color: "#3B82F6", lightColor: "#2563EB" },
  lime: { name: "Lime", color: "#84CC16", lightColor: "#65A30D" },
  orange: { name: "Orange", color: "#F97316", lightColor: "#EA580C" },
  teal: { name: "Teal", color: "#14B8A6", lightColor: "#0F766E" },
  indigo: { name: "Indigo", color: "#6366F1", lightColor: "#4F46E5" },
};

const APP_RADII = {
  round: { name: "Rund", r: "22px", rSm: "14px" },
  medium: { name: "Mittel", r: "16px", rSm: "10px" },
  sharp: { name: "Eckig", r: "10px", rSm: "6px" },
};

function getAppDesign() {
  return load("app-design-config", {
    theme: "dark",
    accent: "white",
    radius: "round",
  });
}

function applyAppDesign(customConfig = null) {
  const cfg = customConfig || getAppDesign();
  const themeObj = APP_THEMES[cfg.theme] || APP_THEMES.dark;
  const accentObj = APP_ACCENTS[cfg.accent] || APP_ACCENTS.white;
  const radiusObj = APP_RADII[cfg.radius] || APP_RADII.round;

  const root = document.documentElement;
  root.style.setProperty("--bg", themeObj.bg);
  root.style.setProperty("--surface", themeObj.surface);
  root.style.setProperty("--surface-2", themeObj.surface2);
  root.style.setProperty("--surface-3", themeObj.surface3);
  root.style.setProperty("--border", themeObj.border);
  root.style.setProperty("--border-soft", themeObj.borderSoft);
  root.style.setProperty("--text", themeObj.text);
  root.style.setProperty("--text-2", themeObj.text2);
  root.style.setProperty("--text-3", themeObj.text3);
  root.style.setProperty("--gray-bg", themeObj.grayBg);
  root.style.setProperty("--gray-border", themeObj.grayBorder);

  const actualAccent = themeObj.isLight
    ? cfg.accent === "white"
      ? "#111827"
      : accentObj.lightColor
    : accentObj.color;
  root.style.setProperty("--accent", actualAccent);

  root.style.setProperty("--radius", radiusObj.r);
  root.style.setProperty("--radius-sm", radiusObj.rSm);

  if (document.body) {
    document.body.style.background = themeObj.bg;
    document.body.style.color = themeObj.text;
  }
}
applyAppDesign();

function openThemeModal() {
  const cfg = getAppDesign();
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[22px] font-bold text-[var(--text)]">Design & Theme anpassen</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)] text-[var(--text)]">✕</button>
    </div>
    <div class="mt-4 space-y-5">
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-2.5" style="color:var(--text-2)">1. HINTERGRUND-THEME</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${Object.entries(APP_THEMES)
            .map(([k, t]) => {
              const active = cfg.theme === k;
              return `
              <button type="button" onclick="selectAppTheme('${k}')" class="p-2.5 rounded-[14px] border text-left flex items-center gap-2 transition-all ${active ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/40 font-bold" : "border-[var(--border)] opacity-80 hover:opacity-100"}" style="background:${t.surface}; color:${t.text}">
                <span class="text-[18px]">${t.icon}</span>
                <div class="truncate">
                  <p class="text-[13px] leading-tight truncate font-bold">${t.name}</p>
                </div>
              </button>
            `;
            })
            .join("")}
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-2.5" style="color:var(--text-2)">2. AKZENT- / LEUCHTFARBE</label>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          ${Object.entries(APP_ACCENTS)
            .map(([k, a]) => {
              const active = cfg.accent === k;
              return `
              <button type="button" onclick="selectAppAccent('${k}')" class="p-2 rounded-[12px] border flex items-center justify-center gap-1.5 transition-all ${active ? "border-[var(--text)] ring-2 ring-[var(--text)]/40 font-bold scale-105" : "border-[var(--border)] opacity-80 hover:opacity-100"}" style="background:var(--surface-2)">
                <span class="w-4 h-4 rounded-full border border-black/20" style="background:${a.color}"></span>
                <span class="text-[11px] truncate font-bold" style="color:var(--text)">${a.name}</span>
              </button>
            `;
            })
            .join("")}
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-2.5" style="color:var(--text-2)">3. KARTEN-ECKENRADIUS</label>
        <div class="grid grid-cols-3 gap-2">
          ${Object.entries(APP_RADII)
            .map(([k, r]) => {
              const active = cfg.radius === k;
              return `
              <button type="button" onclick="selectAppRadius('${k}')" class="py-2.5 rounded-[12px] font-bold text-[13px] border transition-all ${active ? "bg-[var(--text)] text-[var(--bg)] border-[var(--text)]" : "bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]"}">${r.name}</button>
            `;
            })
            .join("")}
        </div>
      </div>

      <div class="pt-2 border-t border-[var(--border-soft)]">
        <button type="button" onclick="resetAppDesign()" class="w-full btn-ghost !py-2.5 !text-[12px] font-bold !text-red-400 hover:!bg-red-500/10">↩ Auf Standard (Dark) zurücksetzen</button>
      </div>
    </div>
  `);
}

function selectAppTheme(themeKey) {
  const cfg = getAppDesign();
  cfg.theme = themeKey;
  save("app-design-config", cfg);
  applyAppDesign(cfg);
  openThemeModal();
}

function selectAppAccent(accentKey) {
  const cfg = getAppDesign();
  cfg.accent = accentKey;
  save("app-design-config", cfg);
  applyAppDesign(cfg);
  openThemeModal();
}

function selectAppRadius(radiusKey) {
  const cfg = getAppDesign();
  cfg.radius = radiusKey;
  save("app-design-config", cfg);
  applyAppDesign(cfg);
  openThemeModal();
}

function resetAppDesign() {
  const cfg = { theme: "dark", accent: "white", radius: "round" };
  save("app-design-config", cfg);
  applyAppDesign(cfg);
  openThemeModal();
}
