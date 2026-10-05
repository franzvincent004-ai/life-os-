// ==================== 05.08 · ROBOTER-SHOP & SKINS ====================
const RARITY_COLOR = {
  common: "var(--rarity-common)",
  uncommon: "var(--rarity-uncommon)",
  rare: "var(--rarity-rare)",
  epic: "var(--rarity-epic)",
  legendary: "var(--rarity-legendary)",
  mythic: "var(--rarity-mythic)",
};
const RARITY_CHANCE = {
  common: 42,
  uncommon: 28,
  rare: 16,
  epic: 9,
  legendary: 4,
  mythic: 1,
};

const ALL_ROBOTS = [
  // COMMON — clean industrial
  {
    id: "momo",
    name: "Unit-01",
    rarity: "common",
    desc: "Standard-Chassis. Mattweiß. Soft-Face.",
    c1: "#F0F0F5",
    c2: "#D8D8E0",
    accent: "#00D4FF",
    eye: "#00E5FF",
    metal: "#C8C8D0",
  },
  {
    id: "graphite",
    name: "Graphite",
    rarity: "common",
    desc: "Dunkler Industriekörper.",
    c1: "#3A3A3A",
    c2: "#1F1F1F",
    accent: "#888",
    eye: "#111",
    metal: "#555",
  },
  {
    id: "ivory",
    name: "Ivory Proto",
    rarity: "common",
    desc: "Helles Labor-Finish.",
    c1: "#F5F5F4",
    c2: "#D6D3D1",
    accent: "#A8A29E",
    eye: "#292524",
    metal: "#E7E5E4",
  },
  {
    id: "slate",
    name: "Slate Core",
    rarity: "common",
    desc: "Kühles Stahlgrau.",
    c1: "#64748B",
    c2: "#334155",
    accent: "#94A3B8",
    eye: "#0F172A",
    metal: "#475569",
  },
  {
    id: "sand",
    name: "Sand Unit",
    rarity: "common",
    desc: "Wüsten-Camouflage.",
    c1: "#D6C3A8",
    c2: "#A89070",
    accent: "#8B7355",
    eye: "#3D2B1F",
    metal: "#C4B09A",
  },
  // UNCOMMON
  {
    id: "obsidian",
    name: "Obsidian X",
    rarity: "uncommon",
    desc: "Tiefschwarzes Carbon.",
    c1: "#0A0A0A",
    c2: "#1A1A1A",
    accent: "#525252",
    eye: "#FAFAFA",
    metal: "#262626",
  },
  {
    id: "arctic",
    name: "Arctic Lens",
    rarity: "uncommon",
    desc: "Eisblaues Optik-System.",
    c1: "#E0F2FE",
    c2: "#7DD3FC",
    accent: "#0EA5E9",
    eye: "#0C4A6E",
    metal: "#BAE6FD",
    glow: true,
  },
  {
    id: "ember",
    name: "Ember Frame",
    rarity: "uncommon",
    desc: "Hitzebehandelte Panzerung.",
    c1: "#431407",
    c2: "#9A3412",
    accent: "#F97316",
    eye: "#FDBA74",
    metal: "#7C2D12",
    glow: true,
  },
  {
    id: "forest",
    name: "Forest Ops",
    rarity: "uncommon",
    desc: "Taktisches Grün.",
    c1: "#14532D",
    c2: "#166534",
    accent: "#4ADE80",
    eye: "#052E16",
    metal: "#15803D",
  },
  {
    id: "violet",
    name: "Violet Node",
    rarity: "uncommon",
    desc: "Neuro-Lila Gehäuse.",
    c1: "#2E1065",
    c2: "#5B21B6",
    accent: "#A78BFA",
    eye: "#EDE9FE",
    metal: "#6D28D9",
  },
  // RARE
  {
    id: "chrome",
    name: "Chrome Sentinel",
    rarity: "rare",
    desc: "Polierter Spiegelstahl.",
    c1: "#E5E5E5",
    c2: "#A3A3A3",
    accent: "#FAFAFA",
    eye: "#171717",
    metal: "#D4D4D4",
    glow: true,
  },
  {
    id: "cobalt",
    name: "Cobalt Prime",
    rarity: "rare",
    desc: "Militärisches Kobaltblau.",
    c1: "#1E3A8A",
    c2: "#1E40AF",
    accent: "#60A5FA",
    eye: "#DBEAFE",
    metal: "#3B82F6",
    glow: true,
  },
  {
    id: "crimson",
    name: "Crimson Edge",
    rarity: "rare",
    desc: "Rote Kampflinie.",
    c1: "#450A0A",
    c2: "#991B1B",
    accent: "#F87171",
    eye: "#FECACA",
    metal: "#DC2626",
    glow: true,
  },
  {
    id: "jade",
    name: "Jade Circuit",
    rarity: "rare",
    desc: "Jade-Inlays, leise Eleganz.",
    c1: "#022C22",
    c2: "#064E3B",
    accent: "#34D399",
    eye: "#A7F3D0",
    metal: "#059669",
    glow: true,
  },
  {
    id: "amber",
    name: "Amber Optic",
    rarity: "rare",
    desc: "Goldgelbe Sensorik.",
    c1: "#451A03",
    c2: "#92400E",
    accent: "#FBBF24",
    eye: "#FEF3C7",
    metal: "#D97706",
    glow: true,
  },
  // EPIC
  {
    id: "neon",
    name: "Neon Phantom",
    rarity: "epic",
    desc: "Schwarz mit Neon-Adern.",
    c1: "#050505",
    c2: "#111",
    accent: "#22D3EE",
    eye: "#67E8F9",
    metal: "#083344",
    glow: true,
  },
  {
    id: "plasma",
    name: "Plasma Core",
    rarity: "epic",
    desc: "Energiekern sichtbar.",
    c1: "#1A0533",
    c2: "#4C1D95",
    accent: "#E879F9",
    eye: "#F5D0FE",
    metal: "#7E22CE",
    glow: true,
  },
  {
    id: "titanium",
    name: "Titanium Mk.IV",
    rarity: "epic",
    desc: "Militär-Titanlegierung.",
    c1: "#1C1917",
    c2: "#44403C",
    accent: "#D6D3D1",
    eye: "#FAFAF9",
    metal: "#78716C",
    glow: true,
  },
  {
    id: "aurora",
    name: "Aurora Shell",
    rarity: "epic",
    desc: "Schillernde Oberflächen.",
    c1: "#0F172A",
    c2: "#1E293B",
    accent: "#38BDF8",
    eye: "#E0F2FE",
    metal: "#0369A1",
    glow: true,
  },
  {
    id: "void",
    name: "Void Frame",
    rarity: "epic",
    desc: "Absorbiert fast alles Licht.",
    c1: "#000",
    c2: "#0A0A0A",
    accent: "#7C3AED",
    eye: "#C4B5FD",
    metal: "#1E1B4B",
    glow: true,
  },
  // LEGENDARY
  {
    id: "gold",
    name: "Aureate King",
    rarity: "legendary",
    desc: "Vergoldetes Prestige-Chassis.",
    c1: "#78350F",
    c2: "#B45309",
    accent: "#FDE68A",
    eye: "#FFFBEB",
    metal: "#F59E0B",
    glow: true,
  },
  {
    id: "diamond",
    name: "Diamond Lattice",
    rarity: "legendary",
    desc: "Kristalline Panzerung.",
    c1: "#0C4A6E",
    c2: "#0369A1",
    accent: "#E0F2FE",
    eye: "#F0F9FF",
    metal: "#7DD3FC",
    glow: true,
  },
  {
    id: "solar",
    name: "Solar Titan",
    rarity: "legendary",
    desc: "Sonnenkern-Reaktor.",
    c1: "#7C2D12",
    c2: "#C2410C",
    accent: "#FDBA74",
    eye: "#FFF7ED",
    metal: "#EA580C",
    glow: true,
  },
  {
    id: "quantum",
    name: "Quantum Drift",
    rarity: "legendary",
    desc: "Instabile Realitätsschicht.",
    c1: "#020617",
    c2: "#1E1B4B",
    accent: "#818CF8",
    eye: "#E0E7FF",
    metal: "#4F46E5",
    glow: true,
  },
  // MYTHIC
  {
    id: "origin",
    name: "Origin Zero",
    rarity: "mythic",
    desc: "Der erste Prototyp. Reines Weiß.",
    c1: "#FAFAFA",
    c2: "#E5E5E5",
    accent: "#FFFFFF",
    eye: "#0A0A0A",
    metal: "#D4D4D4",
    glow: true,
  },
  {
    id: "apex",
    name: "Apex Prime",
    rarity: "mythic",
    desc: "Endstufe. Schwarz-Gold.",
    c1: "#000",
    c2: "#171717",
    accent: "#FBBF24",
    eye: "#FEF3C7",
    metal: "#A16207",
    glow: true,
  },
  {
    id: "singularity",
    name: "Singularity",
    rarity: "mythic",
    desc: "Event-Horizont im Gehäuse.",
    c1: "#000",
    c2: "#0A0014",
    accent: "#F472B6",
    eye: "#FCE7F3",
    metal: "#9D174D",
    glow: true,
  },
  // MORE COMMON
  {
    id: "rust",
    name: "Rust Unit",
    rarity: "common",
    desc: "Patina-Körper. Bewährt.",
    c1: "#8B6914",
    c2: "#654321",
    accent: "#CD853F",
    eye: "#FFD700",
    metal: "#8B7355",
    anim: "heavy",
  },
  {
    id: "frost",
    name: "Frost Core",
    rarity: "common",
    desc: "Eisblauer Prototyp.",
    c1: "#B0E0E6",
    c2: "#87CEEB",
    accent: "#E0FFFF",
    eye: "#00CED1",
    metal: "#ADD8E6",
    anim: "standard",
  },
  {
    id: "midnight",
    name: "Midnight",
    rarity: "common",
    desc: "Nachtschwarze Einheit.",
    c1: "#191970",
    c2: "#0F0F2A",
    accent: "#4169E1",
    eye: "#87CEEB",
    metal: "#2F2F4F",
    anim: "standard",
  },
  // MORE UNCOMMON
  {
    id: "phantom",
    name: "Phantom",
    rarity: "uncommon",
    desc: "Stealth-Operations-Einheit.",
    c1: "#1a1a2e",
    c2: "#16213e",
    accent: "#0f3460",
    eye: "#e94560",
    metal: "#1a1a2e",
    anim: "agile",
  },
  {
    id: "toxic",
    name: "Toxic Node",
    rarity: "uncommon",
    desc: "Biohazard-Kontrolleinheit.",
    c1: "#0D3B0D",
    c2: "#1A5C1A",
    accent: "#39FF14",
    eye: "#ADFF2F",
    metal: "#2E8B57",
    anim: "energetic",
    glow: true,
  },
  {
    id: "copper",
    name: "Copper Mk.II",
    rarity: "uncommon",
    desc: "Kupferlegierung. Warm.",
    c1: "#B87333",
    c2: "#8B5A2B",
    accent: "#DAA520",
    eye: "#FFD700",
    metal: "#CD853F",
    anim: "heavy",
  },
  // MORE RARE
  {
    id: "blaze",
    name: "Blaze Core",
    rarity: "rare",
    desc: "Feuerfester Kampfrahmen.",
    c1: "#8B0000",
    c2: "#B22222",
    accent: "#FF4500",
    eye: "#FFD700",
    metal: "#DC143C",
    anim: "energetic",
    glow: true,
  },
  {
    id: "storm",
    name: "Storm Prime",
    rarity: "rare",
    desc: "Elektrische Panzerung.",
    c1: "#1C1C3A",
    c2: "#2E2E5E",
    accent: "#00BFFF",
    eye: "#87CEEB",
    metal: "#4169E1",
    anim: "agile",
    glow: true,
  },
  {
    id: "jade_emperor",
    name: "Jade Emperor",
    rarity: "rare",
    desc: "Kaiserliche Jade-Einheit.",
    c1: "#006400",
    c2: "#228B22",
    accent: "#FFD700",
    eye: "#7CFC00",
    metal: "#2E8B57",
    anim: "heavy",
    glow: true,
  },
  // MORE EPIC
  {
    id: "nebula",
    name: "Nebula Drift",
    rarity: "epic",
    desc: "Kosmische Konstruktion.",
    c1: "#1A0033",
    c2: "#2D0066",
    accent: "#9B59B6",
    eye: "#E8DAEF",
    metal: "#4A235A",
    anim: "floaty",
    glow: true,
  },
  {
    id: "inferno",
    name: "Inferno King",
    rarity: "epic",
    desc: "Geschmolzener Kern.",
    c1: "#4A0000",
    c2: "#800000",
    accent: "#FF6600",
    eye: "#FFD700",
    metal: "#B22222",
    anim: "energetic",
    glow: true,
  },
  {
    id: "cryo",
    name: "Cryo Sentinel",
    rarity: "epic",
    desc: "Tiefkühl-Wacheinheit.",
    c1: "#0C2340",
    c2: "#1B3A5C",
    accent: "#00CED1",
    eye: "#E0FFFF",
    metal: "#4682B4",
    anim: "floaty",
    glow: true,
  },
  // MORE LEGENDARY
  {
    id: "eclipse",
    name: "Eclipse",
    rarity: "legendary",
    desc: "Sonnenfresser. Dunkelheit.",
    c1: "#0A0A0A",
    c2: "#1A1A1A",
    accent: "#FFD700",
    eye: "#FFA500",
    metal: "#2F2F2F",
    anim: "heavy",
    glow: true,
  },
  {
    id: "phoenix",
    name: "Phoenix Rise",
    rarity: "legendary",
    desc: "Auferstanden aus Glut.",
    c1: "#8B0000",
    c2: "#FF4500",
    accent: "#FFD700",
    eye: "#FFFACD",
    metal: "#B8860B",
    anim: "energetic",
    glow: true,
  },
  // MORE MYTHIC
  {
    id: "omega",
    name: "Omega Zero",
    rarity: "mythic",
    desc: "Endform. Reines Licht.",
    c1: "#FAFAFA",
    c2: "#E8E8E8",
    accent: "#FFFFFF",
    eye: "#F0F0FF",
    metal: "#D0D0D0",
    anim: "floaty",
    glow: true,
  },
  {
    id: "void_walker",
    name: "Void Walker",
    rarity: "mythic",
    desc: "Realitätsbrecher.",
    c1: "#05000A",
    c2: "#0A0014",
    accent: "#8B00FF",
    eye: "#DA70D6",
    metal: "#1A0033",
    anim: "floaty",
    glow: true,
  },
  // ===== NEW EXPANSION TO 100 SKINS =====
  // NEW COMMON (15)
  {
    id: "iron_clad",
    name: "Iron Clad",
    rarity: "common",
    desc: "Schweres Gusseisen-Chassis.",
    c1: "#5C5C5C",
    c2: "#383838",
    accent: "#9E9E9E",
    eye: "#D4D4D4",
    metal: "#4A4A4A",
  },
  {
    id: "khaki_ops",
    name: "Khaki Ops",
    rarity: "common",
    desc: "Wüstengrün-taktischer Einsatzrahmen.",
    c1: "#8F8B66",
    c2: "#636046",
    accent: "#C2BD88",
    eye: "#E6E1AA",
    metal: "#757255",
  },
  {
    id: "zinc_unit",
    name: "Zinc Unit",
    rarity: "common",
    desc: "Verzinkte Oberfläche, wetterfest.",
    c1: "#A1AAB0",
    c2: "#6E777D",
    accent: "#B8C2C7",
    eye: "#E8F1F5",
    metal: "#788187",
  },
  {
    id: "basalt",
    name: "Basalt Rock",
    rarity: "common",
    desc: "Aus dunklem Vulkangestein-Verbund.",
    c1: "#2C2D30",
    c2: "#18191B",
    accent: "#6E7075",
    eye: "#A4A7AD",
    metal: "#35373A",
  },
  {
    id: "chalk",
    name: "Chalk White",
    rarity: "common",
    desc: "Kalkweiße Schale für Labortests.",
    c1: "#F0F2F0",
    c2: "#CFD4CF",
    accent: "#93A193",
    eye: "#2C3B2C",
    metal: "#DCE0DC",
  },
  {
    id: "rusty_nail",
    name: "Rusty Nail",
    rarity: "common",
    desc: "Altmetall aus dem Ödland.",
    c1: "#9E5B32",
    c2: "#6B3C1E",
    accent: "#D48148",
    eye: "#FFB380",
    metal: "#7A4420",
  },
  {
    id: "asphalt",
    name: "Asphalt Runner",
    rarity: "common",
    desc: "Straßentaugliche Grauguss-Einheit.",
    c1: "#3D4043",
    c2: "#242628",
    accent: "#8A9199",
    eye: "#B5BDC7",
    metal: "#4C5054",
  },
  {
    id: "clay_model",
    name: "Clay Proto",
    rarity: "common",
    desc: "Tonfarbiger Design-Prototyp.",
    c1: "#B87D5B",
    c2: "#8A583A",
    accent: "#DE9C73",
    eye: "#FFE4D1",
    metal: "#9C6647",
  },
  {
    id: "olive_drab",
    name: "Olive Drab",
    rarity: "common",
    desc: "Klassisches Armeegrün.",
    c1: "#555D3E",
    c2: "#383E27",
    accent: "#8F9C68",
    eye: "#C2D194",
    metal: "#495034",
  },
  {
    id: "pewter",
    name: "Pewter Mk.I",
    rarity: "common",
    desc: "Matt-zinnfarbener Panzerrahmen.",
    c1: "#7B8287",
    c2: "#52575C",
    accent: "#A9B2B8",
    eye: "#E1EBEF",
    metal: "#676E73",
  },
  {
    id: "cinder",
    name: "Cinder Block",
    rarity: "common",
    desc: "Aschefarbiger Rohbau.",
    c1: "#474747",
    c2: "#2E2E2E",
    accent: "#7D7D7D",
    eye: "#C7C7C7",
    metal: "#3B3B3B",
  },
  {
    id: "dusty",
    name: "Dusty Trail",
    rarity: "common",
    desc: "Verstaubte Offroad-Einheit.",
    c1: "#C2B091",
    c2: "#8A7B62",
    accent: "#E6D6BA",
    eye: "#594E3E",
    metal: "#A39378",
  },
  {
    id: "granite",
    name: "Granite Slab",
    rarity: "common",
    desc: "Gesprenkeltes Granit-Finish.",
    c1: "#63676B",
    c2: "#424547",
    accent: "#9DA2A6",
    eye: "#EBF0F5",
    metal: "#53575A",
  },
  {
    id: "moss_stone",
    name: "Moss Stone",
    rarity: "common",
    desc: "Von Moos bewachsener Wächter.",
    c1: "#4E6148",
    c2: "#2F3D2A",
    accent: "#7DA172",
    eye: "#A8D69A",
    metal: "#3D4D37",
  },
  {
    id: "cement",
    name: "Cement Core",
    rarity: "common",
    desc: "Massiver Zementbeton-Körper.",
    c1: "#878D91",
    c2: "#5E6366",
    accent: "#B6BEC2",
    eye: "#1E252B",
    metal: "#70767A",
  },

  // NEW UNCOMMON (14)
  {
    id: "aqua_marine",
    name: "Aquamarine",
    rarity: "uncommon",
    desc: "Unterwasser-Aufklärungseinheit.",
    c1: "#1A6B73",
    c2: "#0F4347",
    accent: "#38CBD6",
    eye: "#75F3FF",
    metal: "#13555B",
    glow: true,
  },
  {
    id: "neon_green",
    name: "Acid Lime",
    rarity: "uncommon",
    desc: "Leuchtend grüne Kontrastelemente.",
    c1: "#2E381D",
    c2: "#19210E",
    accent: "#84CC16",
    eye: "#BEF264",
    metal: "#3F4D27",
    glow: true,
  },
  {
    id: "coral_reef",
    name: "Coral Shell",
    rarity: "uncommon",
    desc: "Korallenfarbene Speziallegierung.",
    c1: "#9E3B3B",
    c2: "#662222",
    accent: "#F87171",
    eye: "#FECACA",
    metal: "#823131",
    glow: true,
  },
  {
    id: "stealth_blue",
    name: "Navy Ops",
    rarity: "uncommon",
    desc: "Marineblaue Tarnkappeneinheit.",
    c1: "#1E293B",
    c2: "#0F172A",
    accent: "#38BDF8",
    eye: "#E0F2FE",
    metal: "#334155",
    glow: true,
  },
  {
    id: "bronze_age",
    name: "Bronze Age",
    rarity: "uncommon",
    desc: "Antikes Bronze-Finish.",
    c1: "#8C6239",
    c2: "#5C3E21",
    accent: "#D4A373",
    eye: "#FFEEDA",
    metal: "#75502C",
  },
  {
    id: "mint_fresh",
    name: "Mint Chip",
    rarity: "uncommon",
    desc: "Frische Minzkühlung im Chassis.",
    c1: "#1B4D3E",
    c2: "#113329",
    accent: "#34D399",
    eye: "#A7F3D0",
    metal: "#164034",
    glow: true,
  },
  {
    id: "lavender",
    name: "Lavender Proto",
    rarity: "uncommon",
    desc: "Sanftes Lavendel-Sensorsystem.",
    c1: "#4C3B6E",
    c2: "#2E2245",
    accent: "#A78BFA",
    eye: "#EDE9FE",
    metal: "#3E305C",
    glow: true,
  },
  {
    id: "amber_glow",
    name: "Amber Spark",
    rarity: "uncommon",
    desc: "Bernsteingelbe Signaladern.",
    c1: "#78350F",
    c2: "#451A03",
    accent: "#F59E0B",
    eye: "#FEF3C7",
    metal: "#92400E",
    glow: true,
  },
  {
    id: "steel_blue",
    name: "Steel Glacier",
    rarity: "uncommon",
    desc: "Kühles Eisstahl-Finish.",
    c1: "#3B5A7D",
    c2: "#22374D",
    accent: "#7DD3FC",
    eye: "#E0F2FE",
    metal: "#2D4561",
    glow: true,
  },
  {
    id: "jungle_camo",
    name: "Jungle Stalker",
    rarity: "uncommon",
    desc: "Tiefes Dschungelgrün.",
    c1: "#14532D",
    c2: "#052E16",
    accent: "#22C55E",
    eye: "#86EFAC",
    metal: "#166534",
    glow: true,
  },
  {
    id: "magma_vent",
    name: "Magma Vent",
    rarity: "uncommon",
    desc: "Vulkanasche mit Glutrissen.",
    c1: "#3B1812",
    c2: "#210C09",
    accent: "#EA580C",
    eye: "#FFEDD5",
    metal: "#57241B",
    glow: true,
  },
  {
    id: "cobalt_lite",
    name: "Cobalt Scout",
    rarity: "uncommon",
    desc: "Leichter blauer Aufklärer.",
    c1: "#1D4ED8",
    c2: "#1E3A8A",
    accent: "#60A5FA",
    eye: "#DBEAFE",
    metal: "#2563EB",
    glow: true,
  },
  {
    id: "plum_dark",
    name: "Plum Guard",
    rarity: "uncommon",
    desc: "Dunkelpflaumige Sicherheitsrüstung.",
    c1: "#4C1D95",
    c2: "#2E1065",
    accent: "#C084FC",
    eye: "#F3E8FF",
    metal: "#5B21B6",
    glow: true,
  },
  {
    id: "slate_teal",
    name: "Slate Teal",
    rarity: "uncommon",
    desc: "Schiefergrün mit Türkisoptik.",
    c1: "#115E59",
    c2: "#042F2E",
    accent: "#2DD4BF",
    eye: "#CCFBF1",
    metal: "#134E4A",
    glow: true,
  },

  // NEW RARE (12)
  {
    id: "ruby_guard",
    name: "Ruby Sentinel",
    rarity: "rare",
    desc: "Rubinrote Laser-Panzerung.",
    c1: "#991B1B",
    c2: "#5E1010",
    accent: "#EF4444",
    eye: "#FCA5A5",
    metal: "#7F1717",
    glow: true,
  },
  {
    id: "sapphire_knight",
    name: "Sapphire Knight",
    rarity: "rare",
    desc: "Saphirblauer Ritter-Rahmen.",
    c1: "#1E40AF",
    c2: "#112361",
    accent: "#3B82F6",
    eye: "#BFDBFE",
    metal: "#1D3899",
    glow: true,
  },
  {
    id: "emerald_blade",
    name: "Emerald Blade",
    rarity: "rare",
    desc: "Scharfe smaragdgrüne Linien.",
    c1: "#065F46",
    c2: "#033527",
    accent: "#10B981",
    eye: "#A7F3D0",
    metal: "#054E39",
    glow: true,
  },
  {
    id: "topaz_beam",
    name: "Topaz Beam",
    rarity: "rare",
    desc: "Goldener Topas-Energiekern.",
    c1: "#854D0E",
    c2: "#4E2D08",
    accent: "#EAB308",
    eye: "#FEF08A",
    metal: "#713F0D",
    glow: true,
  },
  {
    id: "amethyst_core",
    name: "Amethyst Core",
    rarity: "rare",
    desc: "Kristalline Amethyst-Struktur.",
    c1: "#6B21A8",
    c2: "#3B125D",
    accent: "#A855F7",
    eye: "#E9D5FF",
    metal: "#5A1C8D",
    glow: true,
  },
  {
    id: "titan_silver",
    name: "Silver Falcon",
    rarity: "rare",
    desc: "Hochglanzpoliertes Flugtitan.",
    c1: "#D4D4D8",
    c2: "#71717A",
    accent: "#FFFFFF",
    eye: "#3B82F6",
    metal: "#A1A1AA",
    glow: true,
  },
  {
    id: "laser_pink",
    name: "Laser Strike",
    rarity: "rare",
    desc: "Neonpinke Zieloptik.",
    c1: "#831843",
    c2: "#4B0E27",
    accent: "#EC4899",
    eye: "#FBCFE8",
    metal: "#701439",
    glow: true,
  },
  {
    id: "cyber_cyan",
    name: "Cyber Cyan",
    rarity: "rare",
    desc: "Cyberspace-Datennetz-Einheit.",
    c1: "#0E7490",
    c2: "#064354",
    accent: "#06B6D4",
    eye: "#CFFAFE",
    metal: "#0B5F76",
    glow: true,
  },
  {
    id: "golden_eagle",
    name: "Golden Eagle",
    rarity: "rare",
    desc: "Adler-Wappen auf vergoldetem Stahl.",
    c1: "#A16207",
    c2: "#5E3A04",
    accent: "#FACC15",
    eye: "#FEF9C3",
    metal: "#854D0E",
    glow: true,
  },
  {
    id: "crimson_samurai",
    name: "Crimson Samurai",
    rarity: "rare",
    desc: "Samurai-Rüstung mit roten Klingen.",
    c1: "#7F1D1D",
    c2: "#450A0A",
    accent: "#F87171",
    eye: "#FEE2E2",
    metal: "#671616",
    glow: true,
  },
  {
    id: "arctic_wolf",
    name: "Arctic Wolf",
    rarity: "rare",
    desc: "Schnee-Camo und Frostklingen.",
    c1: "#E0F2FE",
    c2: "#93C5FD",
    accent: "#3B82F6",
    eye: "#1E3A8A",
    metal: "#BAE6FD",
    glow: true,
  },
  {
    id: "obsidian_blade",
    name: "Shadow Blade",
    rarity: "rare",
    desc: "Matte Schleichpanzerung.",
    c1: "#18181B",
    c2: "#09090B",
    accent: "#38BDF8",
    eye: "#7DD3FC",
    metal: "#27272A",
    glow: true,
  },

  // NEW EPIC (8)
  {
    id: "nebula_storm",
    name: "Nebula Storm",
    rarity: "epic",
    desc: "Interstellarer Plasma-Wirbel.",
    c1: "#2E1065",
    c2: "#0F0524",
    accent: "#A855F7",
    eye: "#E9D5FF",
    metal: "#4C1D95",
    glow: true,
  },
  {
    id: "hyperion",
    name: "Hyperion Mk.VII",
    rarity: "epic",
    desc: "Fortschrittliche Titan-Hologramm-Panzerung.",
    c1: "#1E293B",
    c2: "#0F172A",
    accent: "#22D3EE",
    eye: "#CFFAFE",
    metal: "#334155",
    glow: true,
  },
  {
    id: "valkyrie",
    name: "Valkyrie Wing",
    rarity: "epic",
    desc: "Nordische Luftüberlegenheits-Einheit.",
    c1: "#0F172A",
    c2: "#020617",
    accent: "#38BDF8",
    eye: "#E0F2FE",
    metal: "#1E293B",
    glow: true,
  },
  {
    id: "inferno_lord",
    name: "Inferno Lord",
    rarity: "epic",
    desc: "Vulkanreaktor brennt im Gehäuse.",
    c1: "#450A0A",
    c2: "#1F0404",
    accent: "#F97316",
    eye: "#FFEDD5",
    metal: "#7C2D12",
    glow: true,
  },
  {
    id: "quantum_node",
    name: "Quantum Node",
    rarity: "epic",
    desc: "Verschränkte Sensorenergie.",
    c1: "#172554",
    c2: "#0B132B",
    accent: "#60A5FA",
    eye: "#DBEAFE",
    metal: "#1E3A8A",
    glow: true,
  },
  {
    id: "dragon_scale",
    name: "Dragon Scale",
    rarity: "epic",
    desc: "Drachenschuppen-Legierung in Smaragd.",
    c1: "#022C22",
    c2: "#01130E",
    accent: "#34D399",
    eye: "#D1FAE5",
    metal: "#064E3B",
    glow: true,
  },
  {
    id: "cyber_phantom",
    name: "Cyber Phantom",
    rarity: "epic",
    desc: "Geisterhafte Neon-Schattenstruktur.",
    c1: "#0A0A0A",
    c2: "#000000",
    accent: "#E879F9",
    eye: "#FAE8FF",
    metal: "#1F1F1F",
    glow: true,
  },
  {
    id: "solar_flare",
    name: "Solar Flare",
    rarity: "epic",
    desc: "Sonnensturm-Akkumulator.",
    c1: "#431407",
    c2: "#210903",
    accent: "#FB923C",
    eye: "#FFEDD5",
    metal: "#7C2D12",
    glow: true,
  },

  // NEW LEGENDARY (5)
  {
    id: "chronos_king",
    name: "Chronos Titan",
    rarity: "legendary",
    desc: "Zeitkrümmender Reaktor-Kern.",
    c1: "#451A03",
    c2: "#1D0B01",
    accent: "#FDE68A",
    eye: "#FFFBEB",
    metal: "#92400E",
    glow: true,
  },
  {
    id: "celestial_guard",
    name: "Celestial King",
    rarity: "legendary",
    desc: "Himmelswächter. Weißgold-Legierung.",
    c1: "#F8FAFC",
    c2: "#CBD5E1",
    accent: "#F59E0B",
    eye: "#FEF3C7",
    metal: "#E2E8F0",
    glow: true,
  },
  {
    id: "void_emperor",
    name: "Void Emperor",
    rarity: "legendary",
    desc: "Herrscher des Nullraums.",
    c1: "#030712",
    c2: "#000000",
    accent: "#A855F7",
    eye: "#F3E8FF",
    metal: "#111827",
    glow: true,
  },
  {
    id: "supernova",
    name: "Supernova Core",
    rarity: "legendary",
    desc: "Explosives Sternenfeuer im Inneren.",
    c1: "#450A0A",
    c2: "#180303",
    accent: "#FBBF24",
    eye: "#FEF9C3",
    metal: "#991B1B",
    glow: true,
  },
  {
    id: "diamond_king",
    name: "Diamond Apex",
    rarity: "legendary",
    desc: "Unzerstörbare Diamant-Gitterhülle.",
    c1: "#0C4A6E",
    c2: "#072B40",
    accent: "#7DD3FC",
    eye: "#F0F9FF",
    metal: "#0284C7",
    glow: true,
  },

  // NEW MYTHIC (3)
  {
    id: "genesis_zero",
    name: "Genesis Prime",
    rarity: "mythic",
    desc: "Der Schöpfer aller Chassis. Reines Prisma.",
    c1: "#FFFFFF",
    c2: "#E2E8F0",
    accent: "#F472B6",
    eye: "#0A0A0A",
    metal: "#F1F5F9",
    glow: true,
  },
  {
    id: "infinity_core",
    name: "Infinity Core",
    rarity: "mythic",
    desc: "Unendliche Energie im Quantenkern.",
    c1: "#020617",
    c2: "#000000",
    accent: "#38BDF8",
    eye: "#E0F2FE",
    metal: "#0F172A",
    glow: true,
  },
  {
    id: "aethelgard",
    name: "Aethelgard",
    rarity: "mythic",
    desc: "Göttlicher Mecha aus einer anderen Dimension.",
    c1: "#1E1B4B",
    c2: "#0A081F",
    accent: "#FDE68A",
    eye: "#FFFBEB",
    metal: "#312E81",
    glow: true,
  },
];

function getRobotConfig(id) {
  return ALL_ROBOTS.find((robot) => robot.id === id) || ALL_ROBOTS[0];
}
window.getRobotConfig = getRobotConfig;

const PACKS = [
  {
    id: "basic",
    name: "Robot Box",
    price: 80,
    desc: "1 Unit · klassische Drop-Chancen",
    color: "#6B7280",
    color2: "#374151",
    accent: "#D1D5DB",
    art: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjAgMTgwIiByb2xlPSJpbWciIGFyaWEtbGFiZWxsZWRieT0idCBkIj4KICA8dGl0bGUgaWQ9InQiPkxpZmUgT1MgUm9ib3QgQm94PC90aXRsZT48ZGVzYyBpZD0iZCI+SW5kdXN0cmllbGxlIHNpbGJlcm5lIFJvYm90ZXItQm94PC9kZXNjPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJib2R5IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzljYTNhZiIvPjxzdG9wIG9mZnNldD0iLjQ4IiBzdG9wLWNvbG9yPSIjNGI1NTYzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMWYyOTM3Ii8+PC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZWRnZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2Y4ZmFmYyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzZiNzI4MCIvPjwvbGluZWFyR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJzaGFkb3ciIHg9Ii0zMCUiIHk9Ii0zMCUiIHdpZHRoPSIxNjAlIiBoZWlnaHQ9IjE3MCUiPjxmZURyb3BTaGFkb3cgZHg9IjAiIGR5PSIxMiIgc3RkRGV2aWF0aW9uPSIxMCIgZmxvb2Qtb3BhY2l0eT0iLjQ1Ii8+PC9maWx0ZXI+CiAgPC9kZWZzPgogIDxlbGxpcHNlIGN4PSIxMTAiIGN5PSIxNTgiIHJ4PSI3MCIgcnk9IjEyIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuMjgiLz4KICA8ZyBmaWx0ZXI9InVybCgjc2hhZG93KSI+CiAgICA8cGF0aCBkPSJNNDIgNTRsNjgtMjggNjggMjh2ODJsLTY4IDI4LTY4LTI4eiIgZmlsbD0idXJsKCNib2R5KSIgc3Ryb2tlPSIjZDFkNWRiIiBzdHJva2Utd2lkdGg9IjMiLz4KICAgIDxwYXRoIGQ9Ik00MiA1NGw2OCAyOCA2OC0yOE0xMTAgODJ2ODIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLW9wYWNpdHk9Ii41NSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cGF0aCBkPSJNNjIgNzNsNDggMTkgNDgtMTl2NDNsLTQ4IDIwLTQ4LTIweiIgZmlsbD0iIzExMTgyNyIgb3BhY2l0eT0iLjUyIi8+CiAgICA8cmVjdCB4PSI4NSIgeT0iOTYiIHdpZHRoPSI1MCIgaGVpZ2h0PSIyNCIgcng9IjciIGZpbGw9IiMwYjBmMTciIHN0cm9rZT0idXJsKCNlZGdlKSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMDEiIGN5PSIxMDgiIHI9IjUiIGZpbGw9IiM2N2U4ZjkiLz48Y2lyY2xlIGN4PSIxMTkiIGN5PSIxMDgiIHI9IjUiIGZpbGw9IiM2N2U4ZjkiLz4KICAgIDxwYXRoIGQ9Ik0xMDEgMTI4aDE4IiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgICA8cGF0aCBkPSJNNTIgNTdsNTgtMjQgNTggMjQtNTggMjN6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMzIiIHN0cm9rZS13aWR0aD0iNCIvPgogIDwvZz4KICA8ZyBmaWxsPSIjZjhmYWZjIiBvcGFjaXR5PSIuNzUiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDIiIHI9IjIiLz48Y2lyY2xlIGN4PSIxNzQiIGN5PSIzOSIgcj0iMS41Ii8+PHBhdGggZD0iTTE4NyA4NGgxME0xOTIgNzl2MTAiIHN0cm9rZT0iI2Y4ZmFmYyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPgo8L3N2Zz4K",
    tier: "I",
    odds: { common: 55, uncommon: 30, rare: 12, epic: 3 },
  },
  {
    id: "premium",
    name: "Prime Box",
    price: 220,
    desc: "1 Unit · stark erhöhte Rare+ Chance",
    color: "#3B82F6",
    color2: "#1D4ED8",
    accent: "#93C5FD",
    art: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjAgMTgwIiByb2xlPSJpbWciIGFyaWEtbGFiZWxsZWRieT0idCBkIj4KICA8dGl0bGUgaWQ9InQiPkxpZmUgT1MgUHJpbWUgQm94PC90aXRsZT48ZGVzYyBpZD0iZCI+QmxhdWUgSGlnaC1UZWNoLUVuZXJnaWVib3g8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJvZHkiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjNjBhNWZhIi8+PHN0b3Agb2Zmc2V0PSIuNDgiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxNzI1NTQiLz48L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJjb3JlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIuMjUiIHN0b3AtY29sb3I9IiM2N2U4ZjkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyNTYzZWIiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJnbG93IiB4PSItNjAlIiB5PSItNjAlIiB3aWR0aD0iMjIwJSIgaGVpZ2h0PSIyMjAlIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI2IiByZXN1bHQ9ImIiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49ImIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+CiAgPC9kZWZzPgogIDxlbGxpcHNlIGN4PSIxMTAiIGN5PSIxNTgiIHJ4PSI3MCIgcnk9IjEyIiBmaWxsPSIjMDIwNjE3IiBvcGFjaXR5PSIuNTUiLz4KICA8Y2lyY2xlIGN4PSIxMTAiIGN5PSI4OCIgcj0iNzAiIGZpbGw9InVybCgjY29yZSkiIG9wYWNpdHk9Ii4yIi8+CiAgPGc+CiAgICA8cGF0aCBkPSJNNDQgNDhsNjYtMjQgNjYgMjQgMTAgODgtNzYgMzAtNzYtMzB6IiBmaWxsPSJ1cmwoI2JvZHkpIiBzdHJva2U9IiM5M2M1ZmQiIHN0cm9rZS13aWR0aD0iMyIvPgogICAgPHBhdGggZD0iTTQ0IDQ4bDY2IDI1IDY2LTI1TTExMCA3M3Y5MyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZkYmZlIiBzdHJva2Utb3BhY2l0eT0iLjQ4IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDxwYXRoIGQ9Ik01NCA2MmwxNyA2LTYgNTgtMTktOHpNMTY2IDYybC0xNyA2IDYgNTggMTktOHoiIGZpbGw9IiMwZjE3MmEiIG9wYWNpdHk9Ii43NSIvPgogICAgPHBhdGggZD0iTTczIDg3aDc0bC03IDQ4LTMwIDEzLTMwLTEzeiIgZmlsbD0iIzBiMTczYiIgc3Ryb2tlPSIjNjBhNWZhIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDxnIGZpbHRlcj0idXJsKCNnbG93KSI+PHBhdGggZD0iTTExNiA4OGwtMTkgMjhoMTVsLTggMjMgMjQtMzJoLTE1eiIgZmlsbD0iI2UwZjJmZSIvPjwvZz4KICAgIDxwYXRoIGQ9Ik02MyA0OWw0Ny0xNyA0NyAxNy00NyAxOHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RiZWFmZSIgc3Ryb2tlLW9wYWNpdHk9Ii41IiBzdHJva2Utd2lkdGg9IjQiLz4KICA8L2c+CiAgPGcgZmlsbD0iIzY3ZThmOSI+PGNpcmNsZSBjeD0iMzciIGN5PSI3OSIgcj0iMiIvPjxjaXJjbGUgY3g9IjE4NSIgY3k9IjkxIiByPSIyIi8+PGNpcmNsZSBjeD0iMTc0IiBjeT0iMzUiIHI9IjEuNSIvPjwvZz4KICA8cGF0aCBkPSJNMjYgMTAxaDEzTTMyLjUgOTR2MTRNMTgzIDYyaDEyIiBzdHJva2U9IiM2MGE1ZmEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIuOCIvPgo8L3N2Zz4K",
    tier: "II",
    odds: { common: 25, uncommon: 35, rare: 25, epic: 10, legendary: 5 },
  },
  {
    id: "mythic",
    name: "Mythic Box",
    price: 600,
    desc: "1 Unit · Rare+ garantiert · Box möglich",
    color: "#A855F7",
    color2: "#6B21A8",
    accent: "#E9D5FF",
    art: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjAgMTgwIiByb2xlPSJpbWciIGFyaWEtbGFiZWxsZWRieT0idCBkIj4KICA8dGl0bGUgaWQ9InQiPkxpZmUgT1MgTXl0aGljIEJveDwvdGl0bGU+PGRlc2MgaWQ9ImQiPlZpb2xldHRlIHNlbHRlbmUgS3Jpc3RhbGxib3g8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJvZHkiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjYzA4NGZjIi8+PHN0b3Agb2Zmc2V0PSIuNDUiIHN0b3AtY29sb3I9IiM3ZTIyY2UiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyZTEwNjUiLz48L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJjcnlzdGFsIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iLjI1IiBzdG9wLWNvbG9yPSIjZjBhYmZjIi8+PHN0b3Agb2Zmc2V0PSIuNyIgc3RvcC1jb2xvcj0iI2E4NTVmNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzRjMWQ5NSIvPjwvbGluZWFyR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJnbG93IiB4PSItODAlIiB5PSItODAlIiB3aWR0aD0iMjYwJSIgaGVpZ2h0PSIyNjAlIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI3IiByZXN1bHQ9ImIiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49ImIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+CiAgPC9kZWZzPgogIDxlbGxpcHNlIGN4PSIxMTAiIGN5PSIxNTkiIHJ4PSI3MiIgcnk9IjEyIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIuNCIvPgogIDxnIG9wYWNpdHk9Ii40NSIgZmlsdGVyPSJ1cmwoI2dsb3cpIiBmaWxsPSIjZDhiNGZlIj48Y2lyY2xlIGN4PSIxMTAiIGN5PSI4OCIgcj0iNTAiLz48Y2lyY2xlIGN4PSIxMTAiIGN5PSI4OCIgcj0iNjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MwODRmYyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPgogIDxnPgogICAgPHBhdGggZD0iTTQ2IDU3bDY0LTMxIDY0IDMxdjc3bC02NCAzMS02NC0zMXoiIGZpbGw9InVybCgjYm9keSkiIHN0cm9rZT0iI2U5ZDVmZiIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgICA8cGF0aCBkPSJNNDYgNTdsNjQgMjYgNjQtMjZNMTEwIDgzdjgyIiBmaWxsPSJub25lIiBzdHJva2U9IiNmNWQwZmUiIHN0cm9rZS1vcGFjaXR5PSIuNSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cGF0aCBkPSJNNjIgNzVsNDggMTkgNDgtMTktNyA1My00MSAyMS00MS0yMXoiIGZpbGw9IiMxZTBiMzUiIHN0cm9rZT0iI2E4NTVmNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8ZyBmaWx0ZXI9InVybCgjZ2xvdykiPjxwYXRoIGQ9Ik0xMTAgODZsMTkgMjUtMTkgMzEtMTktMzF6IiBmaWxsPSJ1cmwoI2NyeXN0YWwpIi8+PHBhdGggZD0iTTExMCA4NnY1Nk05MSAxMTFoMzgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii40NSIvPjwvZz4KICAgIDxwYXRoIGQ9Ik01NiA1N2w1NC0yNCA1NCAyNC01NCAyMXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii40OCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgICA8cGF0aCBkPSJNNzAgNDlsOS0yMCAxMyAxMiAxOC0yNSAxOCAyNSAxMy0xMiA5IDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmMGFiZmMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDwvZz4KICA8ZyBmaWxsPSIjZjBhYmZjIj48Y2lyY2xlIGN4PSIzMSIgY3k9IjkxIiByPSIyIi8+PGNpcmNsZSBjeD0iMTg4IiBjeT0iNzMiIHI9IjIuNSIvPjxjaXJjbGUgY3g9IjE4MSIgY3k9IjEyMCIgcj0iMS41Ii8+PHBhdGggZD0iTTI5IDQ4aDEyTTM1IDQydjEyIiBzdHJva2U9IiNmMGFiZmMiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz4KPC9zdmc+Cg==",
    tier: "III",
    odds: { rare: 40, epic: 30, legendary: 20, mythic: 10 },
  },
];

function metalClassFor(r) {
  const id = (r && r.id) || "";
  const rarity = (r && r.rarity) || "common";
  if (id === "chrome" || id === "origin") return "metal-chrome";
  if (id === "gold" || id === "solar" || id === "apex") return "metal-gold";
  if (id === "obsidian" || id === "void" || id === "graphite")
    return "metal-carbon";
  if (id === "neon" || id === "plasma" || id === "quantum") return "metal-neon";
  if (id === "titanium" || id === "slate" || id === "cobalt")
    return "metal-titanium";
  if (rarity === "mythic" || id === "singularity") return "metal-mythic";
  if (rarity === "legendary" || rarity === "epic") return "metal-chrome";
  return "metal-brushed";
}
function wrapMetal(svg, r) {
  const cls = metalClassFor(r);
  const color = (r && r.accent) || "#fff";
  return `<span class="metal-wrap ${cls}" style="color:${color}">${svg}</span>`;
}

function getMomoStage(score) {
  const s =
    typeof score === "number"
      ? score
      : typeof window.momoScore === "number"
        ? window.momoScore
        : 0;
  if (s >= 90) return 7; // Stufe 8: Überglücklich (90+ P)
  if (s >= 75) return 6; // Stufe 7: Strahlend (75-89 P)
  if (s >= 60) return 5; // Stufe 6: Glücklich (60-74 P)
  if (s >= 45) return 4; // Stufe 5: Zuversichtlich (45-59 P)
  if (s >= 30) return 3; // Stufe 4: Neutral (30-44 P)
  if (s >= 15) return 2; // Stufe 3: Besorgt/Skeptisch (15-29 P)
  if (s > 0) return 1; // Stufe 2: Traurig (1-14 P)
  return 0; // Stufe 1: Sehr traurig / schläft / weint (0 P)
}

function getRobotFaceSVG(stage, eye, face, acc, isBlinking) {
  let out = "";
  if (stage === 0) {
    // Stufe 1: Sehr traurig / weinend (0 Punkte)
    out += `
      <rect x="33" y="21" width="4" height="2" fill="${eye}" opacity="0.4"/>
      <rect x="37" y="20" width="4" height="2" fill="${eye}" opacity="0.4"/>
      <rect x="55" y="20" width="4" height="2" fill="${eye}" opacity="0.4"/>
      <rect x="59" y="21" width="4" height="2" fill="${eye}" opacity="0.4"/>
    `;
    if (!isBlinking) {
      out += `
        <rect x="34" y="25" width="8" height="4" fill="${eye}"/>
        <rect x="54" y="25" width="8" height="4" fill="${eye}"/>
        <rect x="36" y="26" width="4" height="2" fill="#fff" opacity="0.5"/>
        <rect x="56" y="26" width="4" height="2" fill="#fff" opacity="0.5"/>
      `;
    } else {
      out += `
        <rect x="34" y="27" width="8" height="2" fill="${eye}" opacity="0.6"/>
        <rect x="54" y="27" width="8" height="2" fill="${eye}" opacity="0.6"/>
      `;
    }
    out += `
      <rect x="34" y="30" width="2" height="4" fill="#38BDF8" opacity="0.85"/>
      <rect x="34" y="34" width="2" height="2" fill="#38BDF8" opacity="0.6"/>
      <rect x="60" y="30" width="2" height="4" fill="#38BDF8" opacity="0.85"/>
      <rect x="60" y="34" width="2" height="2" fill="#38BDF8" opacity="0.6"/>
      <rect x="42" y="37" width="2" height="2" fill="${eye}" opacity="0.8"/>
      <rect x="44" y="35" width="8" height="2" fill="${eye}" opacity="0.8"/>
      <rect x="52" y="37" width="2" height="2" fill="${eye}" opacity="0.8"/>
    `;
  } else if (stage === 1) {
    // Stufe 2: Traurig (1-14 Punkte) - no tears
    out += `
      <rect x="34" y="20" width="8" height="2" fill="${eye}" opacity="0.4"/>
      <rect x="54" y="20" width="8" height="2" fill="${eye}" opacity="0.4"/>
    `;
    if (!isBlinking) {
      out += `
        <rect x="34" y="24" width="8" height="6" fill="${eye}"/>
        <rect x="54" y="24" width="8" height="6" fill="${eye}"/>
        <rect x="36" y="25" width="4" height="2" fill="#fff" opacity="0.5"/>
        <rect x="56" y="25" width="4" height="2" fill="#fff" opacity="0.5"/>
      `;
    } else {
      out += `
        <rect x="34" y="26" width="8" height="2" fill="${eye}" opacity="0.5"/>
        <rect x="54" y="26" width="8" height="2" fill="${eye}" opacity="0.5"/>
      `;
    }
    out += `
      <rect x="42" y="36" width="2" height="2" fill="${eye}" opacity="0.7"/>
      <rect x="44" y="35" width="8" height="2" fill="${eye}" opacity="0.7"/>
      <rect x="52" y="36" width="2" height="2" fill="${eye}" opacity="0.7"/>
    `;
  } else if (stage === 2) {
    // Stufe 3: Besorgt / Skeptisch (15-28 Punkte)
    out += `
      <rect x="34" y="21" width="8" height="2" fill="${eye}" opacity="0.5"/>
      <rect x="54" y="21" width="8" height="2" fill="${eye}" opacity="0.5"/>
    `;
    if (!isBlinking) {
      out += `
        <rect x="34" y="24" width="8" height="6" fill="${eye}"/>
        <rect x="54" y="24" width="8" height="6" fill="${eye}"/>
        <rect x="36" y="26" width="4" height="2" fill="#fff" opacity="0.4"/>
        <rect x="56" y="26" width="4" height="2" fill="#fff" opacity="0.4"/>
      `;
    } else {
      out += `
        <rect x="34" y="26" width="8" height="2" fill="${eye}" opacity="0.5"/>
        <rect x="54" y="26" width="8" height="2" fill="${eye}" opacity="0.5"/>
      `;
    }
    out += `
      <rect x="42" y="35" width="4" height="2" fill="${eye}" opacity="0.7"/>
      <rect x="46" y="36" width="4" height="2" fill="${eye}" opacity="0.7"/>
      <rect x="50" y="35" width="4" height="2" fill="${eye}" opacity="0.7"/>
    `;
  } else if (stage === 3) {
    // Stufe 4: Neutral / Aufmerksam (29-42 Punkte)
    if (!isBlinking) {
      out += `
        <rect x="34" y="22" width="10" height="8" fill="${eye}"/>
        <rect x="52" y="22" width="10" height="8" fill="${eye}"/>
        <rect x="36" y="24" width="6" height="4" fill="#fff" opacity="0.5"/>
        <rect x="54" y="24" width="6" height="4" fill="#fff" opacity="0.5"/>
      `;
    } else {
      out += `
        <rect x="34" y="25" width="10" height="2" fill="${eye}" opacity="0.6"/>
        <rect x="52" y="25" width="10" height="2" fill="${eye}" opacity="0.6"/>
      `;
    }
    out += `
      <rect x="42" y="35" width="12" height="2" fill="${eye}" opacity="0.8"/>
      <rect x="44" y="35" width="2" height="4" fill="${eye}" opacity="0.5"/>
      <rect x="48" y="35" width="2" height="4" fill="${eye}" opacity="0.5"/>
      <rect x="52" y="35" width="2" height="4" fill="${eye}" opacity="0.5"/>
    `;
  } else if (stage === 4) {
    // Stufe 5: Zuversichtlich / Leichtes Lächeln (43-56 Punkte)
    if (!isBlinking) {
      out += `
        <rect x="34" y="22" width="10" height="8" fill="${eye}"/>
        <rect x="52" y="22" width="10" height="8" fill="${eye}"/>
        <rect x="34" y="22" width="2" height="2" fill="#fff" opacity="0.6"/>
        <rect x="60" y="22" width="2" height="2" fill="#fff" opacity="0.6"/>
        <rect x="36" y="24" width="6" height="4" fill="#fff" opacity="0.5"/>
        <rect x="54" y="24" width="6" height="4" fill="#fff" opacity="0.5"/>
      `;
    } else {
      out += `
        <rect x="34" y="25" width="10" height="2" fill="${eye}"/>
        <rect x="52" y="25" width="10" height="2" fill="${eye}"/>
      `;
    }
    out += `
      <rect x="42" y="35" width="2" height="2" fill="${eye}" opacity="0.8"/>
      <rect x="44" y="36" width="8" height="2" fill="${eye}" opacity="0.8"/>
      <rect x="52" y="35" width="2" height="2" fill="${eye}" opacity="0.8"/>
    `;
  } else if (stage === 5) {
    // Stufe 6: Glücklich (57-70 Punkte) - blushing + wider smile
    out += `
      <rect x="31" y="30" width="4" height="2" fill="#F472B6" opacity="0.6"/>
      <rect x="61" y="30" width="4" height="2" fill="#F472B6" opacity="0.6"/>
    `;
    if (!isBlinking) {
      out += `
        <rect x="34" y="22" width="10" height="8" fill="${eye}"/>
        <rect x="52" y="22" width="10" height="8" fill="${eye}"/>
        <rect x="36" y="22" width="6" height="2" fill="#fff" opacity="0.7"/>
        <rect x="54" y="22" width="6" height="2" fill="#fff" opacity="0.7"/>
        <rect x="36" y="24" width="6" height="4" fill="#fff" opacity="0.5"/>
        <rect x="54" y="24" width="6" height="4" fill="#fff" opacity="0.5"/>
      `;
    } else {
      out += `
        <rect x="35" y="24" width="8" height="2" fill="${eye}"/>
        <rect x="33" y="26" width="2" height="2" fill="${eye}"/>
        <rect x="43" y="26" width="2" height="2" fill="${eye}"/>
        <rect x="53" y="24" width="8" height="2" fill="${eye}"/>
        <rect x="51" y="26" width="2" height="2" fill="${eye}"/>
        <rect x="61" y="26" width="2" height="2" fill="${eye}"/>
      `;
    }
    out += `
      <rect x="40" y="35" width="2" height="2" fill="${eye}"/>
      <rect x="42" y="36" width="12" height="2" fill="${eye}"/>
      <rect x="54" y="35" width="2" height="2" fill="${eye}"/>
    `;
  } else if (stage === 6) {
    // Stufe 7: Strahlend (71-89 Punkte) - bright blush, open smile with tongue
    out += `
      <rect x="31" y="30" width="5" height="3" fill="#F472B6" opacity="0.75"/>
      <rect x="60" y="30" width="5" height="3" fill="#F472B6" opacity="0.75"/>
    `;
    if (!isBlinking) {
      out += `
        <rect x="33" y="21" width="12" height="9" fill="${eye}"/>
        <rect x="51" y="21" width="12" height="9" fill="${eye}"/>
        <rect x="35" y="22" width="4" height="4" fill="#fff" opacity="0.9"/>
        <rect x="53" y="22" width="4" height="4" fill="#fff" opacity="0.9"/>
        <rect x="41" y="26" width="2" height="2" fill="#fff" opacity="0.7"/>
        <rect x="59" y="26" width="2" height="2" fill="#fff" opacity="0.7"/>
      `;
    } else {
      out += `
        <rect x="35" y="24" width="8" height="2" fill="${eye}"/>
        <rect x="33" y="26" width="2" height="2" fill="${eye}"/>
        <rect x="43" y="26" width="2" height="2" fill="${eye}"/>
        <rect x="53" y="24" width="8" height="2" fill="${eye}"/>
        <rect x="51" y="26" width="2" height="2" fill="${eye}"/>
        <rect x="61" y="26" width="2" height="2" fill="${eye}"/>
      `;
    }
    out += `
      <rect x="40" y="35" width="2" height="3" fill="${eye}"/>
      <rect x="42" y="35" width="12" height="2" fill="${eye}"/>
      <rect x="42" y="37" width="12" height="2" fill="${eye}"/>
      <rect x="54" y="35" width="2" height="3" fill="${eye}"/>
      <rect x="45" y="37" width="6" height="2" fill="#F472B6"/>
    `;
  } else {
    // Stufe 8: Überglücklich! (90+ Punkte) - star eyes, gold sparkles, huge grin with tongue & teeth
    out += `
      <rect x="30" y="29" width="6" height="3" fill="#F472B6" opacity="0.9"/>
      <rect x="60" y="29" width="6" height="3" fill="#F472B6" opacity="0.9"/>
      <rect x="20" y="14" width="2" height="6" fill="#FBBF24"/>
      <rect x="18" y="16" width="6" height="2" fill="#FBBF24"/>
      <rect x="74" y="14" width="2" height="6" fill="#FBBF24"/>
      <rect x="72" y="16" width="6" height="2" fill="#FBBF24"/>
    `;
    if (!isBlinking) {
      out += `
        <rect x="34" y="21" width="10" height="9" fill="${eye}"/>
        <rect x="52" y="21" width="10" height="9" fill="${eye}"/>
        <rect x="38" y="22" width="2" height="6" fill="#fff"/>
        <rect x="36" y="24" width="6" height="2" fill="#fff"/>
        <rect x="56" y="22" width="2" height="6" fill="#fff"/>
        <rect x="54" y="24" width="6" height="2" fill="#fff"/>
      `;
    } else {
      out += `
        <rect x="35" y="23" width="8" height="3" fill="${eye}"/>
        <rect x="33" y="26" width="3" height="3" fill="${eye}"/>
        <rect x="42" y="26" width="3" height="3" fill="${eye}"/>
        <rect x="53" y="23" width="8" height="3" fill="${eye}"/>
        <rect x="51" y="26" width="3" height="3" fill="${eye}"/>
        <rect x="60" y="26" width="3" height="3" fill="${eye}"/>
      `;
    }
    out += `
      <rect x="39" y="34" width="2" height="4" fill="${eye}"/>
      <rect x="41" y="34" width="14" height="2" fill="${eye}"/>
      <rect x="55" y="34" width="2" height="4" fill="${eye}"/>
      <rect x="41" y="36" width="14" height="3" fill="${eye}" opacity="0.9"/>
      <rect x="43" y="36" width="10" height="2" fill="#fff"/>
      <rect x="45" y="38" width="6" height="2" fill="#F472B6"/>
    `;
  }
  return out;
}

function robotAvatarSVG(r, size = 64, customScore = null, isBlinking = false) {
  const score =
    customScore !== null
      ? customScore
      : typeof window.momoScore === "number"
        ? window.momoScore
        : 0;
  const stage = getMomoStage(score);

  const uid = (r.id || "x") + size + Math.random().toString(36).slice(2, 5);
  const c1 = r.c1 || "#E8E8F0";
  const c2 = r.c2 || "#A8A8B8";
  const acc = r.accent || "#00E5FF";
  const eye = r.eye || "#00E5FF";
  const met = r.metal || c2;
  const rar = (r.rarity || "common").toLowerCase();
  const face = "#070B12";
  const dark = "#0A0A0E";
  // shade helper
  const outline =
    rar === "mythic"
      ? "#F472B6"
      : rar === "legendary"
        ? "#FBBF24"
        : rar === "epic"
          ? "#A78BFA"
          : rar === "rare"
            ? "#60A5FA"
            : rar === "uncommon"
              ? "#34D399"
              : "#3A3A42";

  // Tuff pixel-mech: chunky armor, visor slit, shoulder pads, boots
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;image-rendering:crisp-edges">
  <!-- shadow -->
  <rect x="22" y="88" width="52" height="6" fill="#000" opacity="0.22"/>

  <!-- BOOTS -->
  <rect x="20" y="78" width="20" height="10" fill="${c2}"/>
  <rect x="56" y="78" width="20" height="10" fill="${c2}"/>
  <rect x="18" y="84" width="24" height="6" fill="${dark}"/>
  <rect x="54" y="84" width="24" height="6" fill="${dark}"/>
  <rect x="18" y="84" width="24" height="2" fill="${acc}" opacity="0.7"/>
  <rect x="54" y="84" width="24" height="2" fill="${acc}" opacity="0.7"/>

  <!-- LEGS -->
  <rect x="26" y="64" width="14" height="16" fill="${c1}"/>
  <rect x="56" y="64" width="14" height="16" fill="${c1}"/>
  <rect x="26" y="70" width="14" height="4" fill="${c2}"/>
  <rect x="56" y="70" width="14" height="4" fill="${c2}"/>

  <!-- TORSO armor -->
  <rect x="22" y="40" width="52" height="28" fill="${c1}"/>
  <rect x="22" y="40" width="52" height="6" fill="${c2}"/>
  <!-- chest plate -->
  <rect x="30" y="48" width="36" height="16" fill="${c2}"/>
  <rect x="36" y="52" width="24" height="10" fill="${dark}"/>
  <!-- core reactor -->
  <rect x="42" y="54" width="12" height="8" fill="${acc}"/>
  <rect x="44" y="56" width="8" height="4" fill="#fff" opacity="0.55"/>
  <!-- side vents -->
  <rect x="24" y="50" width="4" height="12" fill="${dark}"/>
  <rect x="68" y="50" width="4" height="12" fill="${dark}"/>
  <rect x="24" y="52" width="4" height="2" fill="${acc}" opacity="0.5"/>
  <rect x="68" y="52" width="4" height="2" fill="${acc}" opacity="0.5"/>
  <rect x="24" y="56" width="4" height="2" fill="${acc}" opacity="0.5"/>
  <rect x="68" y="56" width="4" height="2" fill="${acc}" opacity="0.5"/>

  <!-- SHOULDER PADS -->
  <rect x="10" y="38" width="16" height="12" fill="${c1}"/>
  <rect x="70" y="38" width="16" height="12" fill="${c1}"/>
  <rect x="10" y="38" width="16" height="4" fill="${met}"/>
  <rect x="70" y="38" width="16" height="4" fill="${met}"/>
  <rect x="12" y="42" width="4" height="4" fill="${acc}" opacity="0.8"/>
  <rect x="80" y="42" width="4" height="4" fill="${acc}" opacity="0.8"/>

  <!-- ARMS -->
  <rect x="12" y="50" width="10" height="22" fill="${c1}"/>
  <rect x="74" y="50" width="10" height="22" fill="${c1}"/>
  <rect x="12" y="60" width="10" height="4" fill="${c2}"/>
  <rect x="74" y="60" width="10" height="4" fill="${c2}"/>
  <!-- fists -->
  <rect x="10" y="70" width="14" height="10" fill="${c2}"/>
  <rect x="72" y="70" width="14" height="10" fill="${c2}"/>
  <rect x="10" y="76" width="14" height="4" fill="${dark}"/>
  <rect x="72" y="76" width="14" height="4" fill="${dark}"/>

  <!-- HEAD helmet -->
  <rect x="26" y="10" width="44" height="30" fill="${c1}"/>
  <rect x="26" y="10" width="44" height="6" fill="${met}"/>
  <!-- top crest / antenna -->
  <rect x="44" y="2" width="8" height="10" fill="${c2}"/>
  <rect x="42" y="0" width="12" height="6" fill="${acc}"/>
  <rect x="46" y="2" width="4" height="4" fill="#fff" opacity="0.4"/>
  <!-- ear armor -->
  <rect x="16" y="16" width="10" height="18" fill="${c2}"/>
  <rect x="70" y="16" width="10" height="18" fill="${c2}"/>
  <rect x="18" y="20" width="6" height="4" fill="${acc}" opacity="0.6"/>
  <rect x="72" y="20" width="6" height="4" fill="${acc}" opacity="0.6"/>

  <!-- VISOR (tuff slit) -->
  <rect x="30" y="18" width="36" height="16" fill="${face}"/>
  <rect x="30" y="18" width="36" height="2" fill="${acc}" opacity="0.35"/>
  <!-- DYNAMIC ROBOT FACE (8 STAGES + BLINKING) -->
  ${getRobotFaceSVG(stage, eye, face, acc, isBlinking)}

  <!-- helmet highlight -->
  <rect x="28" y="12" width="14" height="4" fill="#fff" opacity="0.18"/>

  <!-- RARITY EXTRAS -->
  ${
    rar === "uncommon" ||
    rar === "rare" ||
    rar === "epic" ||
    rar === "legendary" ||
    rar === "mythic"
      ? `
  <rect x="30" y="16" width="36" height="2" fill="${acc}" opacity="0.5"/>
  `
      : ""
  }
  ${
    rar === "rare" || rar === "epic" || rar === "legendary" || rar === "mythic"
      ? `
  <rect x="8" y="36" width="6" height="6" fill="${acc}"/>
  <rect x="82" y="36" width="6" height="6" fill="${acc}"/>
  `
      : ""
  }
  ${
    rar === "epic" || rar === "legendary" || rar === "mythic"
      ? `
  <rect x="40" y="42" width="16" height="2" fill="${acc}"/>
  <rect x="0" y="48" width="8" height="4" fill="${outline}" opacity="0.8"/>
  <rect x="88" y="48" width="8" height="4" fill="${outline}" opacity="0.8"/>
  `
      : ""
  }
  ${
    rar === "legendary" || rar === "mythic"
      ? `
  <!-- crown spikes -->
  <rect x="30" y="4" width="4" height="8" fill="${outline}"/>
  <rect x="38" y="2" width="4" height="10" fill="${outline}"/>
  <rect x="54" y="2" width="4" height="10" fill="${outline}"/>
  <rect x="62" y="4" width="4" height="8" fill="${outline}"/>
  `
      : ""
  }
  ${
    rar === "mythic"
      ? `
  <!-- mythic wings / energy -->
  <rect x="2" y="28" width="8" height="4" fill="${outline}"/>
  <rect x="0" y="32" width="10" height="4" fill="${outline}" opacity="0.7"/>
  <rect x="2" y="36" width="8" height="4" fill="${outline}" opacity="0.5"/>
  <rect x="86" y="28" width="8" height="4" fill="${outline}"/>
  <rect x="86" y="32" width="10" height="4" fill="${outline}" opacity="0.7"/>
  <rect x="86" y="36" width="8" height="4" fill="${outline}" opacity="0.5"/>
  <rect x="42" y="54" width="12" height="8" fill="#fff" opacity="0.35"/>
  `
      : ""
  }

  <!-- rarity corner mark -->
  <rect x="2" y="2" width="6" height="6" fill="${outline}"/>
</svg>`;
  return svg;
}

function isInfiniteCoins() {
  return load("lifeos:infinite-coins", false);
}
function getCoins() {
  if (isInfiniteCoins()) return 99999999;
  return load("coins", 80);
}
function setCoins(n) {
  if (isInfiniteCoins()) {
    save("coins", 99999999);
    updateCoinsUI();
    return;
  }
  save("coins", Math.max(0, Math.round(n)));
  updateCoinsUI();
}
function addCoins(n) {
  if (isInfiniteCoins()) {
    updateCoinsUI();
    return;
  }
  setCoins(getCoins() + n);
}
function getBonusXp() {
  return load("bonus-xp", 0);
}
function addBonusXp(n) {
  save("bonus-xp", getBonusXp() + Math.max(0, Math.round(n)));
  try {
    updateRankUI();
  } catch (e) {}
}
function getFreeBoxes() {
  return load("free-boxes", { basic: 0, premium: 0, mythic: 0 });
}
function setFreeBoxes(o) {
  save("free-boxes", o);
}
function addFreeBox(id, n) {
  const o = getFreeBoxes();
  o[id] = (o[id] || 0) + (n || 1);
  setFreeBoxes(o);
}
function useFreeBox(id) {
  const o = getFreeBoxes();
  if ((o[id] || 0) > 0) {
    o[id]--;
    setFreeBoxes(o);
    return true;
  }
  return false;
}
