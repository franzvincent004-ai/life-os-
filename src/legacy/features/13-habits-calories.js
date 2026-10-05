// ==================== 05.13 · HABITS, UHRZEITEN & KALORIEN ====================
function habitContextButtons(h, current = "busy") {
  if (!h.splitGoal) return "";
  return `<div class="mt-2 p-1 rounded-[12px] grid grid-cols-2 gap-1" style="background:var(--surface-3)" id="ctx-${h.id}" data-context="${current}">
    <button type="button" data-hctx="free" onclick="setHabitContext('${h.id}','free')" class="py-2 px-1 rounded-[9px] text-[10px] font-bold ${current === "free" ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--text-2)]"}">🌙 Nächster Tag frei</button>
    <button type="button" data-hctx="busy" onclick="setHabitContext('${h.id}','busy')" class="py-2 px-1 rounded-[9px] text-[10px] font-bold ${current === "busy" ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--text-2)]"}">💼 Nicht frei</button>
  </div>`;
}
function setHabitContext(id, context) {
  const wrap = document.getElementById(`ctx-${id}`);
  if (!wrap) return;
  wrap.dataset.context = context;
  wrap.querySelectorAll("[data-hctx]").forEach((btn) => {
    const active = btn.dataset.hctx === context;
    btn.className = `py-2 px-1 rounded-[9px] text-[10px] font-bold ${active ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--text-2)]"}`;
  });
  const h = habits.find((x) => x.id === id),
    goal = document.getElementById(`habit-goal-${id}`);
  if (h && goal) {
    const suffix = h.type === "time" ? " Uhr" : h.unit || "";
    goal.textContent = `Ziel ${getHabitGoal(h, context)}${suffix}`;
  }
  onChange();
}
function renderHabitsInputs() {
  const container = document.getElementById("habits-container");
  if (!container) return;
  container.innerHTML = "";
  const selectedDate = getSelectedEntryDate();
  const selectedEntry = migrateEntries().find((e) => e.date === selectedDate);
  habits.forEach((h) => {
    const row = document.createElement("div");
    row.className = "habit-row";
    const isChoice = isChoiceHabit(h),
      isTime = h.type === "time";
    const stored = selectedEntry?.values?.[h.id];
    const categories = isChoice ? normalizeHabitCategories(h) : [];
    // Noch nichts gewählt → kein Button aktiv (beim Speichern zählt es weiterhin als letzte Kategorie)
    const selectedChoice =
      isChoice && stored !== undefined && stored !== null && stored !== ""
        ? habitChoiceId(h, stored)
        : "";
    const context = h.splitGoal
      ? selectedEntry?.contexts?.[h.id] === "free"
        ? "free"
        : "busy"
      : "default";
    const goal = getHabitGoal(h, context);
    const goalSuffix = isTime ? " Uhr" : h.unit || "";
    const numericStep = h.id === "kcal" ? 20 : h.goal < 5 ? 0.5 : 1;
    row.innerHTML = `
      <div class="habit-icon">${LifeIcon.from(h.icon)}</div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start gap-2"><div class="min-w-0"><p id="habit-title-${h.id}" class="font-semibold text-[13px] truncate transition-colors duration-300">${escapeHtml(h.name)}</p><div class="habit-meta-line">${h.splitGoal ? '<span style="color:#38BDF8">2 Tagesziele · 2 Graphen</span>' : ""}${h.countsForScore === false ? '<span class="habit-no-score">OHNE SCORE-PUNKTE</span>' : ""}</div></div><p id="habit-goal-${h.id}" class="font-mono text-[9px] opacity-60 shrink-0">${isChoice ? `${categories.length} Kategorien` : `Ziel ${goal + goalSuffix}`}</p></div>
        <div class="mt-1.5">
          ${
            isChoice
              ? `<div id="in-${h.id}" data-choice="${selectedChoice}" style="display:none"></div><div class="habit-choice-grid">${categories.map((category) => `<button type="button" data-choice-habit="${h.id}" data-choice-id="${escapeAccountHtml(category.id)}" data-tone="${category.score >= 100 ? "good" : category.score <= 0 ? "bad" : "mid"}" onclick="setChoiceHabit('${h.id}','${escapeAccountHtml(category.id)}')"><span>${escapeAccountHtml(category.label)}</span><small>${category.score}%</small></button>`).join("")}</div>`
              : isTime
                ? `<div class="relative"><input id="in-${h.id}" type="time" value="${isTimeValue(stored) ? stored : ""}" class="input-min !py-2.5 !pl-11 !text-[15px] !font-bold"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-[16px]">🕒</span></div>`
                : `<div class="number-wrap"><input id="in-${h.id}" type="number" step="${h.id === "kcal" ? 20 : h.goal < 5 ? 0.1 : 1}" min="0" value="${typeof stored === "number" && stored ? stored : ""}" placeholder="0" ${h.id === "kcal" ? `onchange="snapCaloriesToTwenty('in-${h.id}')"` : ""} class="input-min !py-2.5 !text-[14px] !font-bold"><div class="stepper"><button class="step-btn up" onclick="adjustHabit('${h.id}',${numericStep})">+</button><button class="step-btn" onclick="adjustHabit('${h.id}',-${numericStep})">−</button></div></div>`
          }
          ${habitContextButtons(h, context)}
        </div>
      </div>
      <div class="flex flex-col gap-1 shrink-0"><button onclick="openEditHabitModal('${h.id}')" class="w-7 h-7 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[11px]" title="Habit bearbeiten">✎</button><button onclick="removeHabit('${h.id}')" class="w-7 h-7 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[11px] opacity-60">✕</button></div>`;
    container.appendChild(row);
  });
  habits.forEach((h) => {
    if (!isChoiceHabit(h)) {
      const el = document.getElementById(`in-${h.id}`);
      if (el) el.addEventListener("input", onChange);
    }
  });
  updateChoiceButtons();
}

function updateChoiceButtons() {
  habits.filter(isChoiceHabit).forEach((h) => {
    const value = document.getElementById(`in-${h.id}`)?.dataset?.choice;
    document
      .querySelectorAll(`[data-choice-habit="${h.id}"]`)
      .forEach((button) =>
        button.classList.toggle("active", button.dataset.choiceId === value),
      );
    const title = document.getElementById(`habit-title-${h.id}`);
    if (title) {
      const percent = habitChoicePercent(h, value);
      // Farbe des Habit-Namens: grün = voll erfüllt, rot = Cheat (0 %), orange = dazwischen
      title.style.color = !value
        ? "var(--text)"
        : percent >= 100
          ? "var(--ios-green, #30d158)"
          : percent <= 0
            ? "var(--ios-red, #ff453a)"
            : "var(--ios-orange, #ff9f0a)";
      title.style.fontWeight = value && (percent >= 100 || percent <= 0) ? "700" : "600";
    }
  });
}
function setChoiceHabit(id, categoryId) {
  const h = habits.find((habit) => habit.id === id);
  if (!h) return;
  let input = document.getElementById(`in-${id}`);
  if (!input) return;
  input.dataset.choice = habitChoiceId(h, categoryId);
  updateChoiceButtons();
  onChange();
}
function setBoolHabit(id, bool) {
  const h = habits.find((habit) => habit.id === id);
  if (!h) return;
  const categories = normalizeHabitCategories(h);
  setChoiceHabit(id, bool ? categories[0].id : categories.at(-1).id);
}
function adjustHabit(id, delta) {
  const el = document.getElementById(`in-${id}`);
  if (!el) return;
  let next = Math.max(0, (parseFloat(el.value) || 0) + delta);
  next = Math.round(next * 10) / 10;
  el.value = next;
  onChange();
}
function snapCaloriesToTwenty(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.value = Math.max(0, Math.round((Number(input.value) || 0) / 20) * 20);
  onChange();
}
function adjustMoney(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  let next = (parseFloat(el.value) || 0) + delta;
  el.value = next;
  onChange();
}
function adjustCalorieGoalAmount(delta) {
  const input = document.getElementById("calorie-goal-amount");
  if (!input) return;
  input.value = Math.max(
    0,
    Math.round(((Number(input.value) || 0) + Number(delta || 0)) / 20) * 20,
  );
  updateCalorieGoalExample();
}
function updateCalorieGoalExample() {
  const mode = document.getElementById("calorie-goal-mode")?.value || "maintenance";
  const amount = Math.max(
    0,
    Math.round((Number(document.getElementById("calorie-goal-amount")?.value) || 0) / 20) * 20,
  );
  const output = document.getElementById("calorie-goal-example");
  if (!output) return;
  output.textContent =
    mode === "surplus"
      ? `Erreicht bei +${amount} kcal oder mehr.`
      : mode === "deficit"
        ? `Erreicht bei −${amount} kcal oder mehr Defizit.`
        : `Erreicht zwischen −${amount} und +${amount} kcal.`;
}
function openCalorieBalanceGoalModal() {
  const goal = getCalorieBalanceGoal();
  openModalHTML(
    `<div class="flex justify-between items-start"><div><p class="font-mono text-[9px] tracking-widest opacity-60">KALORIENBILANZ</p><h3 class="font-display text-[22px] font-bold mt-1">Persönliches Bilanzziel</h3></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div><div class="mt-5 space-y-3"><label class="block text-[11px] font-bold">Richtung<select id="calorie-goal-mode" onchange="updateCalorieGoalExample()" class="input-min w-full mt-1.5"><option value="surplus" ${goal.mode === "surplus" ? "selected" : ""}>Überschuss aufbauen</option><option value="maintenance" ${goal.mode === "maintenance" ? "selected" : ""}>Gewicht halten / ausgeglichen</option><option value="deficit" ${goal.mode === "deficit" ? "selected" : ""}>Defizit erreichen</option></select></label><label class="block text-[11px] font-bold">Zielbetrag in kcal<div class="number-wrap mt-1.5"><input id="calorie-goal-amount" type="number" min="0" step="20" value="${goal.amount}" oninput="updateCalorieGoalExample()" class="input-min !font-bold"><div class="stepper"><button class="step-btn up" onclick="adjustCalorieGoalAmount(20)">+</button><button class="step-btn" onclick="adjustCalorieGoalAmount(-20)">−</button></div></div></label><p id="calorie-goal-example" class="p-3 rounded-[13px] text-[11px]" style="background:var(--surface-2);color:var(--text-2)"></p><p class="text-[9px]" style="color:var(--text-3)">Dieses Ziel bewertet deine Bilanz. Ob einzelne Habits Score-Punkte geben, stellst du direkt beim jeweiligen Habit ein.</p><button onclick="saveCalorieBalanceGoal()" class="w-full btn-primary">Bilanzziel speichern</button></div>`,
    updateCalorieGoalExample,
  );
}
function saveCalorieBalanceGoal() {
  const mode = document.getElementById("calorie-goal-mode")?.value;
  const amount = Math.max(
    0,
    Math.round((Number(document.getElementById("calorie-goal-amount")?.value) || 0) / 20) * 20,
  );
  save("calorie-balance-goal", {
    mode: ["surplus", "maintenance", "deficit"].includes(mode)
      ? mode
      : "maintenance",
    amount,
  });
  closeModal();
  updateCalorieBalancePreview();
}

function updateHabitGoalEditor(prefix) {
  const type = document.getElementById(`${prefix}-h-type`)?.value || "number";
  const split =
    document.getElementById(`${prefix}-h-split-goal`)?.checked || false;
  const isTime = type === "time",
    isChoice = type === "choice" || type === "boolean";
  document
    .getElementById(`${prefix}-h-goal-area`)
    ?.classList.toggle("hidden", isChoice);
  document
    .getElementById(`${prefix}-h-categories-wrap`)
    ?.classList.toggle("hidden", !isChoice);
  document
    .getElementById(`${prefix}-h-split-wrap`)
    ?.classList.toggle("hidden", isChoice);
  document
    .getElementById(`${prefix}-h-normal-goal`)
    ?.classList.toggle("hidden", isChoice || split);
  document
    .getElementById(`${prefix}-h-split-goals`)
    ?.classList.toggle("hidden", isChoice || !split);
  document
    .querySelectorAll(`[data-${prefix}-goal-kind="number"]`)
    .forEach((el) => el.classList.toggle("hidden", isTime));
  document
    .querySelectorAll(`[data-${prefix}-goal-kind="time"]`)
    .forEach((el) => el.classList.toggle("hidden", !isTime));
  document
    .getElementById(`${prefix}-h-unit-wrap`)
    ?.classList.toggle("hidden", isTime || isChoice);
  document
    .getElementById(`${prefix}-h-inverse-wrap`)
    ?.classList.toggle("hidden", isTime || isChoice);
}
const HABIT_ICON_CHOICES = [
  ["✨", "Allgemein"],
  ["📖", "Lesen"],
  ["💪", "Training"],
  ["🔥", "Kalorien"],
  ["🥗", "Ernährung"],
  ["📱", "Screen"],
  ["🌙", "Schlaf"],
  ["🕒", "Uhrzeit"],
  ["🎯", "Ziel"],
  ["💼", "Arbeit"],
];

function habitIconPickerHTML(prefix, selected = "✨") {
  const value = HABIT_ICON_CHOICES.some(([icon]) => icon === selected)
    ? selected
    : "✨";
  return `<div class="lifeos-icon-picker"><span id="${prefix}-h-icon-preview" class="lifeos-icon-picker__preview">${LifeIcon.from(value)}</span><select id="${prefix}-h-icon" class="input-min" onchange="updateHabitIconPreview('${prefix}')">${HABIT_ICON_CHOICES.map(([icon, label]) => `<option value="${icon}" ${icon === value ? "selected" : ""}>${label}</option>`).join("")}</select></div>`;
}

function updateHabitIconPreview(prefix) {
  const select = document.getElementById(`${prefix}-h-icon`);
  const preview = document.getElementById(`${prefix}-h-icon-preview`);
  if (select && preview) preview.innerHTML = LifeIcon.from(select.value);
}

function applySleepHabitPreset() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  set("new-h-icon", "🌙");
  set("new-h-name", "Schlafenszeit");
  set("new-h-type", "time");
  const split = document.getElementById("new-h-split-goal");
  if (split) split.checked = true;
  set("new-h-goal-time", "22:30");
  set("new-h-goal-busy-time", "22:30");
  set("new-h-goal-free-time", "00:30");
  updateHabitIconPreview("new");
  updateHabitGoalEditor("new");
}
function habitGoalEditorHTML(prefix, h = {}) {
  const type = h.type || "number",
    split = !!h.splitGoal;
  const defaultTime = isTimeValue(String(h.goal || "")) ? h.goal : "22:30";
  return `<div id="${prefix}-h-goal-area" class="space-y-3">
    <div id="${prefix}-h-normal-goal"><label class="font-mono text-[9px] opacity-60 ml-1">ZIEL</label><input data-${prefix}-goal-kind="number" id="${prefix}-h-goal" type="number" value="${typeof h.goal === "number" ? h.goal : 1}" placeholder="Ziel z.B. 2" class="input-min w-full mt-1 font-bold"><input data-${prefix}-goal-kind="time" id="${prefix}-h-goal-time" type="time" value="${defaultTime}" class="input-min w-full mt-1 font-bold hidden"></div>
    <label id="${prefix}-h-split-wrap" class="flex items-start gap-2 p-3 rounded-[13px]" style="background:var(--surface-2);border:1px solid var(--border)"><input type="checkbox" id="${prefix}-h-split-goal" ${split ? "checked" : ""} onchange="updateHabitGoalEditor('${prefix}')" class="mt-0.5"><span><b class="text-[12px]">Zwei Ziele je nach nächstem Tag</b><small class="block text-[10px] text-[var(--text-2)] mt-0.5">Separater Wert und Graph für „frei“ und „nicht frei“.</small></span></label>
    <div id="${prefix}-h-split-goals" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 hidden">
      <div class="p-3 rounded-[13px]" style="background:var(--surface-2);border:1px solid var(--border)"><label class="font-mono text-[9px] text-[#A78BFA]">🌙 NÄCHSTER TAG FREI</label><input data-${prefix}-goal-kind="number" id="${prefix}-h-goal-free" type="number" value="${h.goalFree ?? h.goal ?? 1}" class="input-min w-full mt-1.5"><input data-${prefix}-goal-kind="time" id="${prefix}-h-goal-free-time" type="time" value="${isTimeValue(String(h.goalFree || "")) ? h.goalFree : "00:30"}" class="input-min w-full mt-1.5 hidden"></div>
      <div class="p-3 rounded-[13px]" style="background:var(--surface-2);border:1px solid var(--border)"><label class="font-mono text-[9px] text-[#38BDF8]">💼 NÄCHSTER TAG NICHT FREI</label><input data-${prefix}-goal-kind="number" id="${prefix}-h-goal-busy" type="number" value="${h.goalBusy ?? h.goal ?? 1}" class="input-min w-full mt-1.5"><input data-${prefix}-goal-kind="time" id="${prefix}-h-goal-busy-time" type="time" value="${isTimeValue(String(h.goalBusy || "")) ? h.goalBusy : "22:30"}" class="input-min w-full mt-1.5 hidden"></div>
    </div>
  </div>`;
}
function habitCategoryRowHTML(prefix, category, index) {
  return `<div class="habit-category-editor-row" data-category-row><input type="hidden" data-category-id value="${escapeAccountHtml(category.id || `category-${index}`)}"><span>${index + 1}</span><input data-category-label maxlength="24" value="${escapeAccountHtml(category.label || `Kategorie ${index + 1}`)}" placeholder="Name der Kategorie" class="input-min"><label><input data-category-score type="number" min="0" max="100" step="1" value="${Math.max(0, Math.min(100, Number(category.score) || 0))}" class="input-min"><small>% Punkte</small></label><button type="button" onclick="removeHabitCategory(this,'${prefix}')" aria-label="Kategorie entfernen">✕</button></div>`;
}
function habitCategoryEditorHTML(prefix, h = {}) {
  const categories = normalizeHabitCategories(h);
  return `<div id="${prefix}-h-categories-wrap" class="habit-category-editor hidden"><div class="habit-category-editor-head"><div><strong>Eigene Kategorien</strong><small>Name und Punkteanteil frei festlegen</small></div><button type="button" onclick="addHabitCategory('${prefix}')">+ Kategorie</button></div><div id="${prefix}-h-categories" class="habit-category-editor-list">${categories.map((category, index) => habitCategoryRowHTML(prefix, category, index)).join("")}</div><button type="button" class="habit-category-balance" onclick="rebalanceHabitCategories('${prefix}')">Gleichmäßig von 100 % bis 0 % verteilen</button><p>Beispiel: Drei Kategorien werden automatisch zu 100 %, 50 % und 0 %. Du kannst jeden Wert danach manuell ändern.</p></div>`;
}
function renumberHabitCategories(prefix) {
  document
    .querySelectorAll(`#${prefix}-h-categories [data-category-row]`)
    .forEach((row, index) => {
      const number = row.querySelector(":scope > span");
      if (number) number.textContent = String(index + 1);
    });
}
function rebalanceHabitCategories(prefix) {
  const rows = [
    ...document.querySelectorAll(
      `#${prefix}-h-categories [data-category-row]`,
    ),
  ];
  rows.forEach((row, index) => {
    const score = rows.length <= 1 ? 100 : (100 * (rows.length - 1 - index)) / (rows.length - 1);
    const input = row.querySelector("[data-category-score]");
    if (input) input.value = String(Math.round(score));
  });
}
function addHabitCategory(prefix) {
  const list = document.getElementById(`${prefix}-h-categories`);
  if (!list) return;
  const rows = [...list.querySelectorAll("[data-category-row]")];
  if (rows.length >= 10) return alert("Maximal 10 Kategorien möglich.");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = habitCategoryRowHTML(
    prefix,
    {
      id: `category-${Date.now()}-${rows.length}`,
      label: `Kategorie ${rows.length + 1}`,
      score: 0,
    },
    rows.length,
  );
  const row = wrapper.firstElementChild;
  if (rows.length) rows.at(-1).before(row);
  else list.appendChild(row);
  renumberHabitCategories(prefix);
  rebalanceHabitCategories(prefix);
}
function removeHabitCategory(button, prefix) {
  const list = document.getElementById(`${prefix}-h-categories`);
  const rows = [...(list?.querySelectorAll("[data-category-row]") || [])];
  if (rows.length <= 2) return alert("Mindestens zwei Kategorien behalten.");
  button.closest("[data-category-row]")?.remove();
  renumberHabitCategories(prefix);
  rebalanceHabitCategories(prefix);
}
function readHabitCategories(prefix) {
  const rows = [
    ...document.querySelectorAll(
      `#${prefix}-h-categories [data-category-row]`,
    ),
  ];
  const categories = rows.map((row, index) => ({
    id:
      row.querySelector("[data-category-id]")?.value ||
      `category-${Date.now()}-${index}`,
    label:
      row.querySelector("[data-category-label]")?.value.trim() ||
      `Kategorie ${index + 1}`,
    score: Math.max(
      0,
      Math.min(100, Number(row.querySelector("[data-category-score]")?.value) || 0),
    ),
  }));
  if (categories.length < 2) throw new Error("Mindestens zwei Kategorien nötig.");
  return categories;
}
function openAddHabitModal() {
  openModalHTML(
    `<div class="flex justify-between items-start"><div><p class="font-mono text-[10px] tracking-widest opacity-60">NEUES HABIT</p><h3 class="font-display text-[22px] font-bold mt-1">Habit hinzufügen</h3></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <button onclick="applySleepHabitPreset()" class="w-full mt-4 p-3 rounded-[14px] text-left flex items-center gap-3" style="background:linear-gradient(135deg,rgba(167,139,250,.13),rgba(56,189,248,.08));border:1px solid rgba(167,139,250,.25)"><span class="text-[23px]">🌙</span><span><b class="text-[12px]">Schlafenszeit-Vorlage</b><small class="block text-[10px] text-[var(--text-2)]">Mit zwei Zielen und zwei Graphen</small></span></button>
    <div class="mt-3 space-y-3"><div class="grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-2.5">${habitIconPickerHTML("new")}<input id="new-h-name" placeholder="Name z.B. Schlafenszeit" class="input-min font-bold"></div>
    <select id="new-h-type" onchange="updateHabitGoalEditor('new')" class="input-min"><option value="number">Zahl eintragen</option><option value="time">Uhrzeit eintragen</option><option value="choice">Eigene Kategorien</option></select>
    ${habitGoalEditorHTML("new")}
    ${habitCategoryEditorHTML("new")}
    <div id="new-h-unit-wrap"><input id="new-h-unit" placeholder="Einheit z.B. L, h, Seiten" class="input-min w-full"></div>
    <label id="new-h-inverse-wrap" class="flex items-center gap-2 font-mono text-[12px]"><input type="checkbox" id="new-h-inverse"> <span>Umgekehrt (kleiner = besser)</span></label>
    <label class="habit-score-toggle"><input type="checkbox" id="new-h-counts-score" checked><span><b>Gibt Tages-Score-Punkte</b><small>Deaktivieren, wenn das Habit nur dokumentiert werden soll.</small></span></label>
    <button onclick="saveNewHabit()" class="w-full btn-primary-green">+ Hinzufügen</button></div>`,
    () => updateHabitGoalEditor("new"),
  );
}
function readHabitGoalConfig(prefix, type) {
  const isChoice = type === "choice" || type === "boolean";
  const split =
    !isChoice && !!document.getElementById(`${prefix}-h-split-goal`)?.checked;
  if (isChoice) {
    return {
      goal: 1,
      splitGoal: false,
      categories: readHabitCategories(prefix),
    };
  }
  if (type === "time") {
    const goal =
      document.getElementById(`${prefix}-h-goal-time`)?.value || "22:30";
    return {
      goal,
      splitGoal: split,
      goalFree: split
        ? document.getElementById(`${prefix}-h-goal-free-time`)?.value || goal
        : undefined,
      goalBusy: split
        ? document.getElementById(`${prefix}-h-goal-busy-time`)?.value || goal
        : undefined,
    };
  }
  const goal =
    parseFloat(document.getElementById(`${prefix}-h-goal`)?.value) || 1;
  return {
    goal,
    splitGoal: split,
    goalFree: split
      ? parseFloat(document.getElementById(`${prefix}-h-goal-free`)?.value) ||
        goal
      : undefined,
    goalBusy: split
      ? parseFloat(document.getElementById(`${prefix}-h-goal-busy`)?.value) ||
        goal
      : undefined,
  };
}
function saveNewHabit() {
  const icon = document.getElementById("new-h-icon").value || "✨",
    name = document.getElementById("new-h-name").value.trim(),
    type = document.getElementById("new-h-type").value;
  if (!name) return alert("Name fehlt");
  const cfg = readHabitGoalConfig("new", type),
    isChoice = type === "choice" || type === "boolean",
    unit =
      type === "time" || isChoice
        ? ""
        : document.getElementById("new-h-unit").value.trim();
  const inverse =
      type === "number" && document.getElementById("new-h-inverse").checked,
    countsForScore =
      document.getElementById("new-h-counts-score")?.checked !== false,
    id = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
  habits.push({
    id,
    name,
    icon,
    type: isChoice ? "choice" : type,
    unit,
    inverse,
    countsForScore,
    ...cfg,
  });
  save("life-habits", habits);
  closeModal();
  loadEntryDate();
  updateAll();
  renderStatsGrid();
}
function openEditHabitModal(id) {
  const h = habits.find((x) => x.id === id);
  if (!h) return;
  openModalHTML(
    `<div class="flex justify-between items-start"><div><p class="font-mono text-[10px] tracking-widest opacity-60">HABIT BEARBEITEN</p><h3 class="font-display text-[22px] font-bold mt-1">${LifeIcon.from(h.icon)} ${escapeHtml(h.name)}</h3></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-5 space-y-3"><div class="grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-2.5">${habitIconPickerHTML("edit", h.icon)}<input id="edit-h-name" value="${escapeHtml(h.name || "")}" class="input-min font-bold"></div>
    <select id="edit-h-type" onchange="updateHabitGoalEditor('edit')" class="input-min"><option value="number" ${h.type === "number" ? "selected" : ""}>Zahl eintragen</option><option value="time" ${h.type === "time" ? "selected" : ""}>Uhrzeit eintragen</option><option value="choice" ${isChoiceHabit(h) ? "selected" : ""}>Eigene Kategorien</option></select>
    ${habitGoalEditorHTML("edit", h)}
    ${habitCategoryEditorHTML("edit", h)}
    <div id="edit-h-unit-wrap"><input id="edit-h-unit" value="${h.unit || ""}" placeholder="Einheit" class="input-min w-full"></div>
    <label id="edit-h-inverse-wrap" class="flex items-center gap-2 font-mono text-[12px]"><input type="checkbox" id="edit-h-inverse" ${h.inverse ? "checked" : ""}> <span>Umgekehrt (kleiner = besser)</span></label>
    <label class="habit-score-toggle"><input type="checkbox" id="edit-h-counts-score" ${h.countsForScore === false ? "" : "checked"}><span><b>Gibt Tages-Score-Punkte</b><small>Deaktivieren, wenn das Habit nur dokumentiert werden soll.</small></span></label>
    <button onclick="saveHabitEdit('${h.id}')" class="w-full btn-primary-green">Änderungen speichern</button></div>`,
    () => updateHabitGoalEditor("edit"),
  );
}
function saveHabitEdit(id) {
  const h = habits.find((x) => x.id === id);
  if (!h) return;
  const name = document.getElementById("edit-h-name").value.trim();
  if (!name) return alert("Name fehlt");
  const type = document.getElementById("edit-h-type").value,
    isChoice = type === "choice" || type === "boolean",
    cfg = readHabitGoalConfig("edit", type);
  h.icon = document.getElementById("edit-h-icon").value || "✨";
  h.name = name;
  h.type = isChoice ? "choice" : type;
  h.unit =
    type === "time" || isChoice
      ? ""
      : document.getElementById("edit-h-unit").value.trim();
  h.inverse =
    type === "number" && document.getElementById("edit-h-inverse").checked;
  h.countsForScore =
    document.getElementById("edit-h-counts-score")?.checked !== false;
  Object.assign(h, cfg);
  if (!isChoice) delete h.categories;
  if (!cfg.splitGoal) {
    delete h.goalFree;
    delete h.goalBusy;
  }
  delete h.time;
  save("life-habits", habits);
  closeModal();
  loadEntryDate();
  updateAll();
  renderStatsGrid();
}
function removeHabit(id) {
  if (habits.length <= 1) return alert("Mindestens 1 Habit behalten");
  if (!confirm("Habit löschen?")) return;
  habits = habits.filter((h) => h.id !== id);
  save("life-habits", habits);
  let entries = load("life-entries", []);
  entries = entries.map((e) => {
    if (e.values && e.values[id] !== undefined) delete e.values[id];
    return e;
  });
  save("life-entries", entries);
  renderHabitsInputs();
  updateAll();
  renderStatsGrid();
}

function adjust(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  let next = Math.max(0, (parseFloat(el.value) || 0) + delta);
  next = Math.round(next * 10) / 10;
  el.value = next;
  onChange();
}
function onChange() {
  const calc = calcPointsFromInputs();
  const entries = migrateEntries();
  const monthEntries = entries.filter(
    (e) => e.date.slice(0, 7) === new Date().toISOString().slice(0, 7),
  );
  const monthAvg = monthEntries.length
    ? monthEntries.reduce((s, e) => s + e.score, 0) / monthEntries.length
    : calc.total;
  updateMomoProgressive(calc.total, monthAvg);
  const big = document.getElementById("score-day-big");
  if (big) big.textContent = calc.total;
  const num = document.getElementById("score-day-num");
  if (num) num.textContent = calc.total;
  const bar = document.getElementById("score-day-bar");
  if (bar) bar.style.width = calc.total + "%";
  const ring = document.getElementById("score-ring");
  if (ring) ring.style.strokeDashoffset = 163.36 - (163.36 * calc.total) / 100;
  updateCalorieBalancePreview();
}

function dailyScoreXp(score) {
  const value = Number(score) || 0;
  if (value >= 100) return 100;
  if (value >= 95) return 50;
  if (value >= 90) return 25;
  if (value >= 80) return 10;
  return 0;
}

function saveToday() {
  const date = getSelectedEntryDate(),
    today = localDateISO();
  if (date > today)
    return alert("Daten für die Zukunft können noch nicht gespeichert werden.");
  let entries = migrateEntries();
  const values = {},
    contexts = {};
  habits.forEach((h) => {
    if (isChoiceHabit(h))
      values[h.id] =
        document.getElementById(`in-${h.id}`)?.dataset?.choice ||
        normalizeHabitCategories(h).at(-1).id;
    else if (h.type === "time")
      values[h.id] = document.getElementById(`in-${h.id}`)?.value || "";
    else {
      const numeric =
        parseFloat(document.getElementById(`in-${h.id}`)?.value) || 0;
      values[h.id] =
        h.id === "kcal" ? Math.round(numeric / 20) * 20 : numeric;
    }
    if (h.splitGoal)
      contexts[h.id] =
        document.getElementById(`ctx-${h.id}`)?.dataset?.context || "busy";
  });
  const kcalEaten = Math.max(
      0,
      Math.round(
        (parseFloat(document.getElementById("in-kcal-eaten")?.value) || 0) /
          20,
      ) * 20,
    ),
    kcalBurned = Math.max(0, Number(values.kcal) || 0);
  const baseObj = {
    date,
    values,
    contexts,
    kcalEaten,
    kcalBurned,
    kcalBalance: kcalEaten - kcalBurned,
    aus: parseFloat(document.getElementById("in-aus")?.value) || 0,
    ein: parseFloat(document.getElementById("in-ein")?.value) || 0,
    note: document.getElementById("in-note")?.value || "",
    ts: Date.now(),
  };
  const calc = calcPointsForEntry(baseObj, habits),
    obj = { ...baseObj, score: calc.total, pointsDetail: calc.breakdown };
  const idx = entries.findIndex((e) => e.date === date);
  if (idx >= 0) entries[idx] = obj;
  else entries.push(obj);
  entries.sort((a, b) => a.date.localeCompare(b.date));
  save("life-entries", entries);
  try {
    SFX.save();
  } catch (e) {}
  if (obj.score >= 80) {
    launchConfetti();
    try {
      SFX.confetti();
    } catch (e) {}
  }
  if (navigator.vibrate) navigator.vibrate(obj.score >= 80 ? [30, 40, 30] : 25);
  const xpAwards = load("daily-score-xp-awards-v3", {});
  const targetXp = dailyScoreXp(obj.score);
  const previousXp = Number(xpAwards[date]) || 0;
  const xpGain = Math.max(0, targetXp - previousXp);
  if (xpGain > 0) {
    xpAwards[date] = targetXp;
    save("daily-score-xp-awards-v3", xpAwards);
    addBonusXp(xpGain);
    try {
      SFX.save();
    } catch (e) {}
    showDaySaveToast(`Starker Tages-Score · +${xpGain} XP`, "#22D3EE");
  } else if (targetXp > 0) {
    showDaySaveToast(
      `✓ ${date} gespeichert · XP für diesen Score bereits erhalten`,
      "#7BA889",
    );
  } else {
    showDaySaveToast(
      `✓ ${date} gespeichert · XP erst ab 80 Punkten`,
      "#A3A3A3",
    );
  }
  updateAll();
  renderHistory();
  renderStatsGrid();
  try {
    updateCoinsUI();
    updateRankUI();
  } catch (e) {}
  loadEntryDate();
}
function showDaySaveToast(message, color) {
  try {
    const tip = document.createElement("div");
    tip.textContent = message;
    tip.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:500;background:#111;border:1px solid ${color}55;color:${color};padding:10px 18px;border-radius:999px;font-family:monospace;font-size:11px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.4);white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis`;
    document.body.appendChild(tip);
    setTimeout(() => {
      tip.style.transition = "opacity .4s,transform .4s";
      tip.style.opacity = "0";
      tip.style.transform = "translateX(-50%) translateY(-12px)";
    }, 1400);
    setTimeout(() => tip.remove(), 1900);
  } catch (e) {}
}

// ==================== KALORIEN-WIDGET ====================
// Das Kalorien-Panel ist ein eigenes Dashboard-Widget (#calorie-widget).
// Es bearbeitet immer den im Tageseintrag gewählten Tag → Datum anzeigen.
function updateCalorieWidgetDate() {
  const el = document.getElementById("calorie-widget-date");
  if (!el) return;
  const date = typeof getSelectedEntryDate === "function" ? getSelectedEntryDate() : "";
  const today = typeof localDateISO === "function" ? localDateISO() : "";
  el.textContent =
    !date || date === today
      ? "Heute"
      : new Date(date + "T12:00:00").toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
}
(function hookLoadEntryDate() {
  if (typeof loadEntryDate !== "function" || loadEntryDate.__kcalHooked) return;
  const original = loadEntryDate;
  const wrapped = function () {
    const r = original.apply(this, arguments);
    try { updateCalorieWidgetDate(); } catch (e) {}
    return r;
  };
  wrapped.__kcalHooked = true;
  window.loadEntryDate = wrapped;
  loadEntryDate = wrapped; // eslint-disable-line no-func-assign
})();
