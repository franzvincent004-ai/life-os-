// ==================== 05.17 · TRAININGSPLÄNE ====================
const DEFAULT_TRAININGSPLAENE = [];

function getTrainingsplaene() {
  const saved = load("gym-trainingsplaene", DEFAULT_TRAININGSPLAENE);
  const list = Array.isArray(saved) ? saved : [];
  // Frühere Versionen enthielten automatisch einen Demo-Plan. Dieser wird
  // einmalig entfernt, damit jeder Nutzer wirklich leer startet.
  const cleaned = list.filter((plan) => plan && plan.id !== "plan-demo-1");
  if (cleaned.length !== list.length) save("gym-trainingsplaene", cleaned);
  return cleaned;
}

function saveTrainingsplaene(list) {
  save("gym-trainingsplaene", list);
  renderTrainingsplaene();
}

function renderTrainingsplaene() {
  const container = document.getElementById("trainingsplaene-container");
  if (!container) return;
  const list = getTrainingsplaene();
  if (!list || !list.length) {
    container.innerHTML = `
      <div class="text-center py-6 border border-dashed border-[var(--border)] rounded-[16px]">
        <p class="font-display text-[15px] font-bold">Noch kein Trainingsplan</p>
        <p class="text-[12px] text-[var(--text-2)] mt-1">Erstelle deinen ersten Plan mit Tagen als Obergruppe!</p>
        <button type="button" onclick="openAddTrainingsplanModal()" class="btn-primary mt-3 !text-[13px] !py-2 !px-4">+ Plan erstellen</button>
      </div>
    `;
    return;
  }
  container.innerHTML = list
    .map((plan) => {
      const totalExercises = (plan.days || []).reduce(
        (sum, d) => sum + (d.exercises ? d.exercises.length : 0),
        0,
      );
      return `
      <div class="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--border)]">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-soft)]">
          <div class="flex items-center gap-2.5">
            <span class="text-[20px]">📋</span>
            <div>
              <h4 class="font-display font-bold text-[16px] sm:text-[18px]">${escapeHtml(plan.name)}</h4>
              <p class="font-mono text-[10px] text-[var(--text-2)]">${plan.days.length} ${plan.days.length === 1 ? "Tag" : "Tage"} • ${totalExercises} Übungen</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="openAddPlanDayModal('${plan.id}')" class="btn-primary-green !text-[11px] !py-1.5 !px-2.5">+ Tag</button>
            <button type="button" onclick="openEditPlanNameModal('${plan.id}')" class="btn-ghost !text-[11px] !py-1.5 !px-2.5" title="Plan umbenennen">✎ Plan</button>
            <button type="button" onclick="deleteTrainingsplan('${plan.id}')" class="btn-ghost !text-[11px] !py-1.5 !px-2 !text-red-500" title="Plan löschen">✕</button>
          </div>
        </div>
        <div class="space-y-3">
          ${(plan.days || [])
            .map(
              (day) => `
            <div class="p-3 sm:p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border-soft)]">
              <div class="flex items-center justify-between mb-2.5">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded-full font-bold bg-[var(--accent-light)] text-[var(--accent-dark)]">TAG</span>
                  <h5 class="font-display font-bold text-[14px] sm:text-[15px]">${escapeHtml(day.name)}</h5>
                </div>
                <div class="flex items-center gap-1">
                  <button type="button" onclick="openAddPlanExerciseModal('${plan.id}', '${day.id}')" class="btn-primary !bg-[var(--text)] !text-[var(--bg)] !text-[11px] !py-1 !px-2.5">+ Übung</button>
                  <button type="button" onclick="openEditPlanDayModal('${plan.id}', '${day.id}')" class="btn-ghost !text-[11px] !py-1 !px-2" title="Tag bearbeiten">✎</button>
                  <button type="button" onclick="deletePlanDay('${plan.id}', '${day.id}')" class="btn-ghost !text-[11px] !py-1 !px-2 !text-red-500" title="Tag löschen">✕</button>
                </div>
              </div>
              <div class="space-y-1.5">
                ${
                  !(day.exercises && day.exercises.length)
                    ? `
                  <p class="text-[12px] text-[var(--text-3)] italic py-1">Noch keine Übung in diesem Tag. Klicke auf "+ Übung".</p>
                `
                    : day.exercises
                        .map(
                          (ex) => `
                  <div class="flex items-center justify-between p-2 rounded-[10px] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors border border-[var(--border-soft)]">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                      <span class="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0"></span>
                      <div class="truncate">
                        <span class="font-bold text-[13px] text-[var(--text)]">${escapeHtml(ex.name)}</span>
                        <span class="font-mono text-[11px] ml-2 text-[var(--text-2)]">
                          ${ex.sets || 0} Sätze × ${ex.reps || 0} Wdhs ${ex.weight ? " • " + ex.weight + " kg" : ""}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <button type="button" onclick="logPlanExercisePR(${escapeHtml(JSON.stringify(String(ex.name || "")))}, '${ex.reps || ""}', '${ex.weight || ""}')" class="px-2 py-1 rounded-[8px] text-[10px] font-bold bg-[var(--accent-light)] text-[var(--accent-dark)] hover:opacity-80" title="Als PR ins Gym-Log eintragen">PR Log</button>
                      <button type="button" onclick="openEditPlanExerciseModal('${plan.id}', '${day.id}', '${ex.id}')" class="btn-ghost !p-1.5 !text-[11px]" title="Übung bearbeiten">✎</button>
                      <button type="button" onclick="deletePlanExercise('${plan.id}', '${day.id}', '${ex.id}')" class="btn-ghost !p-1.5 !text-[11px] !text-red-500" title="Übung löschen">✕</button>
                    </div>
                  </div>
                `,
                        )
                        .join("")
                }
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");
}

// Modal: Add Trainingsplan
function openAddTrainingsplanModal() {
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold">Neuer Trainingsplan</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-60 mb-1">PLAN NAME</label>
        <input id="new-plan-name" placeholder="z.B. 4-Tage Oberkörper/Unterkörper" class="input-min font-bold w-full">
      </div>
      <button type="button" onclick="saveNewTrainingsplan()" class="w-full btn-primary mt-2">+ Trainingsplan erstellen</button>
    </div>
  `);
  setTimeout(() => document.getElementById("new-plan-name")?.focus(), 100);
}

function saveNewTrainingsplan() {
  const nameInput = document.getElementById("new-plan-name");
  const name = nameInput ? nameInput.value.trim() : "";
  if (!name) return alert("Bitte einen Namen eingeben");
  const list = getTrainingsplaene();
  list.push({ id: "plan-" + Date.now(), name, days: [] });
  saveTrainingsplaene(list);
  closeModal();
}

// Modal: Edit Plan Name
function openEditPlanNameModal(planId) {
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  if (!plan) return;
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold">Plan umbenennen</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-60 mb-1">NAME DES PLANS</label>
        <input id="edit-plan-name" value="${escapeHtml(plan.name)}" class="input-min font-bold w-full">
      </div>
      <button type="button" onclick="saveEditPlanName('${planId}')" class="w-full btn-primary mt-2">Speichern</button>
    </div>
  `);
  setTimeout(() => document.getElementById("edit-plan-name")?.focus(), 100);
}

function saveEditPlanName(planId) {
  const nameInput = document.getElementById("edit-plan-name");
  const name = nameInput ? nameInput.value.trim() : "";
  if (!name) return alert("Bitte einen Namen eingeben");
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  if (plan) {
    plan.name = name;
    saveTrainingsplaene(list);
  }
  closeModal();
}

function deleteTrainingsplan(planId) {
  if (!confirm("Diesen Trainingsplan wirklich löschen?")) return;
  let list = getTrainingsplaene();
  list = list.filter((p) => p.id !== planId);
  saveTrainingsplaene(list);
}

// Modal: Add Day (Tag als Obergruppe)
function openAddPlanDayModal(planId) {
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold">Neuer Tag hinzufügen</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-60 mb-1">TAG (OBERGRUPPE)</label>
        <input id="new-day-name" placeholder="z.B. Montag – Push oder Tag 1" class="input-min font-bold w-full">
      </div>
      <button type="button" onclick="saveNewPlanDay('${planId}')" class="w-full btn-primary mt-2">+ Tag hinzufügen</button>
    </div>
  `);
  setTimeout(() => document.getElementById("new-day-name")?.focus(), 100);
}

function saveNewPlanDay(planId) {
  const nameInput = document.getElementById("new-day-name");
  const name = nameInput ? nameInput.value.trim() : "";
  if (!name) return alert("Bitte einen Tag eingeben");
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  if (plan) {
    plan.days = plan.days || [];
    plan.days.push({ id: "day-" + Date.now(), name, exercises: [] });
    saveTrainingsplaene(list);
  }
  closeModal();
}

// Modal: Edit Day Name
function openEditPlanDayModal(planId, dayId) {
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  if (!day) return;
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold">Tag bearbeiten</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-60 mb-1">NAME DES TAGS</label>
        <input id="edit-day-name" value="${escapeHtml(day.name)}" class="input-min font-bold w-full">
      </div>
      <button type="button" onclick="saveEditPlanDay('${planId}', '${dayId}')" class="w-full btn-primary mt-2">Speichern</button>
    </div>
  `);
  setTimeout(() => document.getElementById("edit-day-name")?.focus(), 100);
}

function saveEditPlanDay(planId, dayId) {
  const nameInput = document.getElementById("edit-day-name");
  const name = nameInput ? nameInput.value.trim() : "";
  if (!name) return alert("Bitte einen Namen eingeben");
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  if (day) {
    day.name = name;
    saveTrainingsplaene(list);
  }
  closeModal();
}

function deletePlanDay(planId, dayId) {
  if (!confirm("Diesen Tag und seine Übungen wirklich löschen?")) return;
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  if (plan) {
    plan.days = (plan.days || []).filter((d) => d.id !== dayId);
    saveTrainingsplaene(list);
  }
}

// Modal: Add Exercise to Day
function openAddPlanExerciseModal(planId, dayId) {
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  if (!day) return;
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold">Übung zu "${escapeHtml(day.name)}"</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-60 mb-1">ÜBUNG</label>
        <input id="plan-ex-name" list="available-exercises-list" placeholder="z.B. Bankdrücken oder Klimmzüge" class="input-min font-bold w-full">
        <datalist id="available-exercises-list">
          ${exercises.map((e) => `<option value="${e}"></option>`).join("")}
        </datalist>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-[11px] font-mono opacity-60 mb-1">SÄTZE</label>
          <input id="plan-ex-sets" type="number" value="3" placeholder="3" class="input-min w-full font-bold">
        </div>
        <div>
          <label class="block text-[11px] font-mono opacity-60 mb-1">WDHS</label>
          <input id="plan-ex-reps" type="text" value="10" placeholder="10" class="input-min w-full font-bold">
        </div>
        <div>
          <label class="block text-[11px] font-mono opacity-60 mb-1">GEWICHT (KG)</label>
          <input id="plan-ex-weight" type="text" value="" placeholder="optional" class="input-min w-full font-bold">
        </div>
      </div>
      <button type="button" onclick="saveNewPlanExercise('${planId}', '${dayId}')" class="w-full btn-primary mt-2">+ Übung hinzufügen</button>
    </div>
  `);
  setTimeout(() => document.getElementById("plan-ex-name")?.focus(), 100);
}

function saveNewPlanExercise(planId, dayId) {
  const name = document.getElementById("plan-ex-name")?.value.trim();
  const sets = document.getElementById("plan-ex-sets")?.value.trim() || "1";
  const reps = document.getElementById("plan-ex-reps")?.value.trim() || "10";
  const weight = document.getElementById("plan-ex-weight")?.value.trim() || "";
  if (!name) return alert("Bitte eine Übung eingeben");
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  if (day) {
    day.exercises = day.exercises || [];
    day.exercises.push({
      id: "ex-" + Date.now(),
      name,
      sets,
      reps,
      weight,
    });
    if (!exercises.includes(name)) {
      exercises.push(name);
      save("gym-exercises", exercises);
      renderGym();
    }
    saveTrainingsplaene(list);
  }
  closeModal();
}

// Modal: Edit Exercise
function openEditPlanExerciseModal(planId, dayId, exId) {
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  const ex = day ? (day.exercises || []).find((x) => x.id === exId) : null;
  if (!ex) return;
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold">Übung bearbeiten</h3>
      <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-60 mb-1">ÜBUNG</label>
        <input id="edit-plan-ex-name" list="available-exercises-list" value="${escapeHtml(ex.name)}" placeholder="z.B. Bankdrücken" class="input-min font-bold w-full">
        <datalist id="available-exercises-list">
          ${exercises.map((e) => `<option value="${e}"></option>`).join("")}
        </datalist>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-[11px] font-mono opacity-60 mb-1">SÄTZE</label>
          <input id="edit-plan-ex-sets" type="number" value="${ex.sets || ""}" placeholder="3" class="input-min w-full font-bold">
        </div>
        <div>
          <label class="block text-[11px] font-mono opacity-60 mb-1">WDHS</label>
          <input id="edit-plan-ex-reps" type="text" value="${ex.reps || ""}" placeholder="10" class="input-min w-full font-bold">
        </div>
        <div>
          <label class="block text-[11px] font-mono opacity-60 mb-1">GEWICHT (KG)</label>
          <input id="edit-plan-ex-weight" type="text" value="${ex.weight || ""}" placeholder="optional" class="input-min w-full font-bold">
        </div>
      </div>
      <button type="button" onclick="saveEditPlanExercise('${planId}', '${dayId}', '${exId}')" class="w-full btn-primary mt-2">Änderungen speichern</button>
    </div>
  `);
  setTimeout(() => document.getElementById("edit-plan-ex-name")?.focus(), 100);
}

function saveEditPlanExercise(planId, dayId, exId) {
  const name = document.getElementById("edit-plan-ex-name")?.value.trim();
  const sets =
    document.getElementById("edit-plan-ex-sets")?.value.trim() || "1";
  const reps =
    document.getElementById("edit-plan-ex-reps")?.value.trim() || "10";
  const weight =
    document.getElementById("edit-plan-ex-weight")?.value.trim() || "";
  if (!name) return alert("Bitte eine Übung eingeben");
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  const ex = day ? (day.exercises || []).find((x) => x.id === exId) : null;
  if (ex) {
    ex.name = name;
    ex.sets = sets;
    ex.reps = reps;
    ex.weight = weight;
    if (!exercises.includes(name)) {
      exercises.push(name);
      save("gym-exercises", exercises);
      renderGym();
    }
    saveTrainingsplaene(list);
  }
  closeModal();
}

function deletePlanExercise(planId, dayId, exId) {
  const list = getTrainingsplaene();
  const plan = list.find((p) => p.id === planId);
  const day = plan ? (plan.days || []).find((d) => d.id === dayId) : null;
  if (day) {
    day.exercises = (day.exercises || []).filter((x) => x.id !== exId);
    saveTrainingsplaene(list);
  }
}

function logPlanExercisePR(exName, defaultReps, defaultWeight) {
  if (!exercises.includes(exName)) {
    exercises.push(exName);
    save("gym-exercises", exercises);
    renderGym();
  }
  const sel = document.getElementById("gym-select");
  if (sel) {
    sel.value = exName;
  }
  const repEl = document.getElementById("gym-reps");
  if (repEl && defaultReps) {
    const num = parseInt(defaultReps, 10);
    if (!isNaN(num)) repEl.value = num;
  }
  const wEl = document.getElementById("gym-weight");
  if (wEl && defaultWeight) {
    const num = parseFloat(defaultWeight);
    if (!isNaN(num)) wEl.value = num;
  }
  sel?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => repEl?.focus(), 300);
}
