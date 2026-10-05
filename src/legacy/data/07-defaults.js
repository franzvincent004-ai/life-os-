// ==================== HILFSFUNKTIONEN ====================
// Escaped Nutzereingaben (Fach-, Habit-, Plan- und Übungsnamen), bevor sie per
// innerHTML gerendert werden. Verhindert kaputtes Layout bei Zeichen wie " < & '
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
window.escapeHtml = escapeHtml;

// ==================== 05.07 · DATENMODELLE & STANDARDWERTE ====================
const DEFAULT_HABITS = [
  {
    id: "seiten",
    name: "Seiten",
    icon: "📖",
    goal: 10,
    unit: "",
    type: "number",
  },
  {
    id: "training",
    name: "Training",
    icon: "💪",
    goal: 1,
    unit: "h",
    type: "number",
  },
  {
    id: "kcal",
    name: "Kalorien verbrannt",
    icon: "🔥",
    goal: 700,
    unit: " kcal",
    type: "number",
  },
  {
    id: "ernaehrung",
    name: "Ernährung",
    icon: "🥗",
    goal: 1,
    unit: "",
    type: "boolean",
  },
  {
    id: "screen",
    name: "Screen",
    icon: "📱",
    goal: 2,
    unit: "h",
    type: "number",
    inverse: true,
  },
];
const DEFAULT_EXERCISES = [
  "Pull Ups",
  "Push Ups",
  "Kniebeugen",
  "Australian Pull Ups",
  "Dips",
  "Hanging Knee Raises",
];
const DEFAULT_FAECHER = [
  "Mathe",
  "Deutsch",
  "Englisch",
  "Bio",
  "Informatik",
  "Sport",
];
