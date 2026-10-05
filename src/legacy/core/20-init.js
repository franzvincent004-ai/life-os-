// ==================== 05.20 · INITIALISIERUNG ====================
function initApp() {
  try {
    habits = load("life-habits", DEFAULT_HABITS);
    const calorieHabit = habits.find((h) => h.id === "kcal");
    if (calorieHabit) {
      let changed = false;
      if (calorieHabit.name === "Kalorien") {
        calorieHabit.name = "Kalorien verbrannt";
        changed = true;
      }
      if (!calorieHabit.unit) {
        calorieHabit.unit = " kcal";
        changed = true;
      }
      if (changed) save("life-habits", habits);
    }
    exercises = load("gym-exercises", DEFAULT_EXERCISES);
    const ed = document.getElementById("entry-date");
    if (ed) {
      ed.value = localDateISO();
      ed.max = localDateISO();
    }
    const gd = document.getElementById("gym-date");
    if (gd)
      try {
        gd.valueAsDate = new Date();
      } catch (e) {
        gd.value = localDateISO();
      }
    loadEntryDate();
    initMomo();
    onChange();
    updateAll();
    renderHistory();
    renderStatsGrid();
    updateCoinsUI();
    renderTrainingsplaene();
    try {
      applyAppDesign();
    } catch (e) {}
    applyRobotLook(getEquipped());
    try {
      updatePlayerNameUI();
    } catch (e) {}
    try {
      renderRobots();
    } catch (e) {}
    try {
      renderStreaks();
    } catch (e) {}
    wireNavClicks();
    syncSfxBtn();
    startChallengeTimer();
    scheduleIdleRobot();
    const requestedView = new URLSearchParams(window.location.search).get(
      "view",
    );
    if (requestedView && TABS_ORDER.includes(requestedView)) {
      setTimeout(() => switchTab(requestedView), 120);
    }
  } catch (err) {
    console.error("initApp failed", err);
  }
}

// Wire clicks ASAP (splash + nav)
document.addEventListener("DOMContentLoaded", wireNavClicks);
if (document.readyState !== "loading") wireNavClicks();
