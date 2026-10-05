// ==================== 05.21 · STREAKS ====================
// Ein Streak zählt aufeinanderfolgende Kalendertage mit gespeichertem
// Tageseintrag ("life-entries"). Heute noch nicht eingetragen bricht den
// Streak NICHT – er ist dann nur "in Gefahr", bis Mitternacht.
//
// Gespeichert (alle mit Präfix lifeos:):
//   streak-best        bester jemals erreichter Streak
//   streak-milestones  bereits gefeierte Meilensteine { "7": "2026-10-04", ... }

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];
const STREAK_MILESTONE_XP = { 3: 50, 7: 150, 14: 300, 30: 750, 50: 1200, 100: 3000, 200: 6000, 365: 12000 };

// Flammen-Symbol (Logo-Variante 13). `id` hält Gradient-IDs pro Instanz eindeutig.
let _flameSeq = 0;
function streakFlameSVG(size = 24, muted = false) {
  const id = "sf" + ++_flameSeq;
  const outer = muted
    ? `<stop offset="0" stop-color="#5b6170"/><stop offset="1" stop-color="#8a8f9a"/>`
    : `<stop offset="0" stop-color="#ff3b30"/><stop offset=".6" stop-color="#ff9500"/><stop offset="1" stop-color="#ffd60a"/>`;
  return `<svg class="streak-flame" width="${size}" height="${size}" viewBox="120 60 272 384" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">${outer}</linearGradient></defs>
    <path d="M256 76C300 160 380 200 380 300A124 124 0 0 1 132 300C132 240 170 210 190 170C200 220 230 240 240 240C230 180 230 130 256 76Z" fill="url(#${id})"/>
    <path d="M256 250C280 290 310 310 310 350A54 54 0 0 1 202 350C202 320 230 300 256 250Z" fill="${muted ? "#c4c7cf" : "#fff3c4"}"/>
  </svg>`;
}

function streakDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getStreakDays() {
  return new Set(load("life-entries", []).map((e) => e.date));
}

/** Liefert { current, best, doneToday, atRisk, last30 } */
function getStreakInfo() {
  const days = getStreakDays();
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  const todayKey = streakDateKey(cursor);
  const doneToday = days.has(todayKey);
  if (!doneToday) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (days.has(streakDateKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  // Bester Streak: aus allen Einträgen neu berechnen (robust gegen Nachtragen)
  const sorted = [...days].sort();
  let best = 0, run = 0, prev = null;
  for (const d of sorted) {
    const t = new Date(d + "T12:00:00");
    run = prev && Math.round((t - prev) / 864e5) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  best = Math.max(best, Number(load("streak-best", 0)) || 0);
  if (best > (Number(load("streak-best", 0)) || 0)) save("streak-best", best);

  const last30 = [];
  const c = new Date();
  c.setHours(12, 0, 0, 0);
  c.setDate(c.getDate() - 29);
  for (let i = 0; i < 30; i++) {
    const k = streakDateKey(c);
    last30.push({ date: k, done: days.has(k), today: k === todayKey, weekday: c.getDay() });
    c.setDate(c.getDate() + 1);
  }
  return { current, best, doneToday, atRisk: current > 0 && !doneToday, last30 };
}

function nextStreakMilestone(n) {
  return STREAK_MILESTONES.find((m) => m > n) || null;
}

function streakLabel(n) {
  return n === 1 ? "1 Tag" : `${n} Tage`;
}

// ---------- UI: Header-Chip ----------
function renderStreakChip(info) {
  const chip = document.getElementById("streak-chip");
  if (!chip) return;
  chip.classList.toggle("is-active", info.doneToday);
  chip.classList.toggle("is-risk", info.atRisk);
  chip.innerHTML = `${streakFlameSVG(18, !info.doneToday)}<b>${info.current}</b>`;
  chip.setAttribute(
    "aria-label",
    `Streak: ${streakLabel(info.current)}${info.atRisk ? ", heute noch eintragen!" : ""}`,
  );
}

// ---------- UI: Home-Widget ----------
// #streak-card ist ein reguläres Dashboard-Widget (Registry im Bundle, id "streak").
// Das Widget-System hängt eigene Bedien-Elemente (Verschieben, Größe, Ausblenden)
// an die <section> – deshalb wird NUR .streak-card__body neu gerendert.
function renderStreakCard(info) {
  const card = document.getElementById("streak-card");
  const body = card?.querySelector(".streak-card__body");
  if (!card || !body) return;
  const next = nextStreakMilestone(info.current);
  const prevM = [...STREAK_MILESTONES].reverse().find((m) => m <= info.current) || 0;
  const pct = next ? Math.round(((info.current - prevM) / (next - prevM)) * 100) : 100;
  const week = info.last30.slice(-7);
  const wd = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const status = info.doneToday
    ? "Heute erledigt"
    : info.current > 0
      ? "Heute noch eintragen!"
      : "Trag heute ein, um zu starten";
  card.classList.toggle("is-active", info.doneToday);
  card.classList.toggle("is-risk", info.atRisk);
  body.innerHTML = `
    <div class="dashboard-widget-heading">
      <div class="dashboard-widget-heading__title"><span class="dashboard-widget-icon streak-widget-icon">${streakFlameSVG(18, !info.doneToday && info.current === 0)}</span>
        <div><p class="ux-eyebrow">STREAK</p><h3>Streak</h3></div></div>
      <span class="dashboard-page-chevron">›</span>
    </div>
    <div class="streak-card__main">
      <div class="streak-card__copy">
        <h3><span>${info.current}</span> ${info.current === 1 ? "Tag" : "Tage"}</h3>
        <p class="streak-card__status">${status}</p>
      </div>
      <div class="streak-card__best"><small>Rekord</small><strong>${info.best}</strong></div>
    </div>
    <div class="streak-card__week" data-widget-panel="week">
      ${week
        .map(
          (d) => `<div class="streak-day${d.done ? " is-done" : ""}${d.today ? " is-today" : ""}">
            <i>${d.done ? streakFlameSVG(16) : ""}</i><span>${wd[d.weekday]}</span></div>`,
        )
        .join("")}
    </div>
    <div class="streak-card__progress" data-widget-panel="progress">
      ${
        next
          ? `<div><span style="width:${pct}%"></span></div>
             <small>Noch ${streakLabel(next - info.current)} bis ${next} Tage · +${STREAK_MILESTONE_XP[next]} XP</small>`
          : `<small>Alle Meilensteine geschafft 👑</small>`
      }
    </div>
    ${info.doneToday ? "" : `<button type="button" class="streak-card__cta" onclick="event.stopPropagation();scrollToDailyEntry()">Jetzt eintragen</button>`}`;
}

// Tippen aufs Widget öffnet die Details (nicht im Bearbeiten-Modus / nicht auf Buttons)
document.addEventListener("click", (e) => {
  const card = e.target.closest?.("#streak-card");
  if (!card || e.target.closest("button")) return;
  if (document.querySelector("#view-today.is-editing, .dashboard-editing, [data-dashboard-editing='true']")) return;
  openStreakModal();
});

function scrollToDailyEntry() {
  try {
    if (typeof switchTab === "function") switchTab("today");
  } catch (e) {}
  const card = document.getElementById("daily-entry-card");
  card?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderStreaks() {
  try {
    const info = getStreakInfo();
    renderStreakChip(info);
    renderStreakCard(info);
    return info;
  } catch (e) {
    console.error("renderStreaks failed", e);
  }
}

// ---------- Detail-Modal ----------
function openStreakModal() {
  const info = getStreakInfo();
  const reached = load("streak-milestones", {});
  const grid = info.last30
    .map(
      (d) =>
        `<div class="streak-cal${d.done ? " is-done" : ""}${d.today ? " is-today" : ""}" title="${d.date}">${d.done ? streakFlameSVG(14) : Number(d.date.slice(-2))}</div>`,
    )
    .join("");
  const ms = STREAK_MILESTONES.map(
    (m) => `<div class="streak-ms${reached[m] || info.best >= m ? " is-reached" : ""}">
      ${streakFlameSVG(20, !(reached[m] || info.best >= m))}<b>${m}</b><small>+${STREAK_MILESTONE_XP[m]} XP</small></div>`,
  ).join("");
  openModalHTML(`
    <div class="lifeos2-modal-heading"><div><p class="ux-eyebrow">STREAK</p><h3>Dein Streak</h3></div>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="streak-modal__hero">${streakFlameSVG(90, !info.doneToday && info.current === 0)}
      <div><strong>${info.current}</strong><span>${info.current === 1 ? "Tag" : "Tage"} in Folge</span></div></div>
    <div class="streak-modal__stats">
      <div><small>Rekord</small><b>${streakLabel(info.best)}</b></div>
      <div><small>Letzte 30 Tage</small><b>${info.last30.filter((d) => d.done).length} / 30</b></div>
      <div><small>Heute</small><b>${info.doneToday ? "✓ erledigt" : "offen"}</b></div>
    </div>
    <p class="streak-modal__label">LETZTE 30 TAGE</p>
    <div class="streak-modal__grid">${grid}</div>
    <p class="streak-modal__label">MEILENSTEINE</p>
    <div class="streak-modal__ms">${ms}</div>
    ${info.doneToday ? "" : `<button onclick="closeModal();scrollToDailyEntry()" class="w-full btn-primary mt-4">Jetzt eintragen</button>`}
  `);
}

// ---------- Feier-Animation ----------
function celebrateStreak(n, milestoneXp) {
  document.querySelector(".streak-celebration")?.remove();
  const el = document.createElement("div");
  el.className = "streak-celebration" + (milestoneXp ? " is-milestone" : "");
  el.innerHTML = `
    <div class="streak-celebration__inner">
      <div class="streak-celebration__flame">${streakFlameSVG(150)}</div>
      <div class="streak-celebration__num">${n}</div>
      <p>${milestoneXp ? `Meilenstein! ${streakLabel(n)} Streak` : n === 1 ? "Streak gestartet!" : `${streakLabel(n)} Streak!`}</p>
      ${milestoneXp ? `<span class="streak-celebration__xp">+${milestoneXp} XP</span>` : `<span class="streak-celebration__sub">Komm morgen wieder, um ihn zu halten 🔥</span>`}
    </div>`;
  el.addEventListener("click", () => el.remove());
  document.body.appendChild(el);
  try {
    if (milestoneXp) {
      launchConfetti?.();
      SFX?.confetti?.();
    }
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(milestoneXp ? [40, 60, 40, 60, 80] : [20, 40, 20]);
  setTimeout(() => el.classList.add("is-leaving"), milestoneXp ? 3200 : 2200);
  setTimeout(() => el.remove(), milestoneXp ? 3700 : 2700);
}

function checkStreakMilestone(n) {
  if (!STREAK_MILESTONES.includes(n)) return 0;
  const reached = load("streak-milestones", {});
  if (reached[n]) return 0;
  reached[n] = streakDateKey(new Date());
  save("streak-milestones", reached);
  const xp = STREAK_MILESTONE_XP[n] || 0;
  try {
    if (xp) addBonusXp(xp);
    updateRankUI?.();
  } catch (e) {}
  return xp;
}

// ---------- Hook in saveToday() ----------
(function hookSaveToday() {
  if (typeof saveToday !== "function" || saveToday.__streakHooked) return;
  const original = saveToday;
  const wrapped = function () {
    const before = getStreakInfo();
    const result = original.apply(this, arguments);
    const after = renderStreaks();
    // Nur feiern, wenn der heutige Tag NEU dazugekommen ist
    if (after && after.doneToday && !before.doneToday) {
      const xp = checkStreakMilestone(after.current);
      setTimeout(() => celebrateStreak(after.current, xp), 450);
    }
    return result;
  };
  wrapped.__streakHooked = true;
  window.saveToday = wrapped;
  saveToday = wrapped; // eslint-disable-line no-func-assign
})();

// Bei allen anderen Updates (Löschen, Nachtragen, Kontowechsel) mitziehen
(function hookUpdateAll() {
  if (typeof updateAll !== "function" || updateAll.__streakHooked) return;
  const original = updateAll;
  const wrapped = function () {
    const r = original.apply(this, arguments);
    renderStreaks();
    return r;
  };
  wrapped.__streakHooked = true;
  window.updateAll = wrapped;
  updateAll = wrapped; // eslint-disable-line no-func-assign
})();

// Um Mitternacht / beim Zurückkehren in die App Status aktualisieren
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) renderStreaks();
});
setInterval(renderStreaks, 5 * 60 * 1000);
