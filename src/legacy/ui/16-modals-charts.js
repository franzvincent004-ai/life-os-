// ==================== 05.16 · GLOBALE MODALS & DETAIL-DIAGRAMME ====================
function openModalHTML(html, after) {
  const root = document.getElementById("modalRoot");
  const content = document.getElementById("modalContent");
  content.innerHTML = html;
  content.style.animation = "none";
  void content.offsetWidth;
  content.style.animation = "";
  root.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (after) setTimeout(after, 80);
}
function closeModal() {
  document.getElementById("modalRoot").classList.add("hidden");
  document.body.style.overflow = "";
}

function openScoreModal(type) {
  const entries = migrateEntries();
  if (type === "day") {
    const scoreHabits = habits.filter((habit) => habit.countsForScore !== false);
    const pointsPerHabit = scoreHabits.length ? 100 / scoreHabits.length : 0;
    openModalHTML(
      `<div class="flex justify-between"><h3 class="font-display text-[22px] font-bold">100 Punkte System</h3><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div><div class="mt-3 text-[13px]" style="color:var(--text-2)"><p>100 Punkte / ${scoreHabits.length} wertende Habits = ${pointsPerHabit.toFixed(1)}P je Habit</p><p class="mt-2">${habits.map((h) => `• ${LifeIcon.from(h.icon)} ${escapeHtml(h.name)}: ${h.countsForScore === false ? "nur Tracking, keine Punkte" : habitGoalSummary(h)}`).join("<br>")}</p></div><div class="mt-4 surface-2 !p-3 !rounded-[16px]"><canvas id="modalChart" height="180"></canvas></div>`,
      () => {
        if (typeof Chart === "undefined") return;
        const ctx = document.getElementById("modalChart")?.getContext("2d");
        if (ctx)
          new Chart(ctx, {
            type: "line",
            data: {
              labels: entries.slice(-30).map((e) => e.date.slice(5)),
              datasets: [
                {
                  data: entries.slice(-30).map((e) => e.score),
                  borderColor: "#FFFFFF",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
            options: { plugins: { legend: { display: false } } },
          });
      },
    );
  } else if (type === "money") {
    openModalHTML(
      `<div class="flex justify-between"><h3 class="font-display text-[22px] font-bold text-[var(--text)]">Geld Netto (+ / - €) pro Tag</h3><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div><p class="font-mono text-[11px] mt-1" style="color:var(--text-2)">Tagessaldo von Einnahmen abzüglich Ausgaben der letzten 30 Tage</p><div class="mt-4 chart-detail-height"><canvas id="modalMoneyChart"></canvas></div>`,
      () => {
        if (typeof Chart === "undefined") return;
        const ctx = document
          .getElementById("modalMoneyChart")
          ?.getContext("2d");
        if (!ctx) return;
        const last = entries.slice(-30);
        const netData = last.map((e) =>
          parseFloat(((e.ein || 0) - (e.aus || 0)).toFixed(2)),
        );
        new Chart(ctx, {
          type: "line",
          data: {
            labels: last.map((e) => e.date.slice(5)),
            datasets: [
              {
                label: "Netto-Differenz",
                data: netData,
                borderColor: "#38BDF8",
                backgroundColor: "rgba(56,189,248,.12)",
                pointBackgroundColor: netData.map((v) =>
                  v >= 0 ? "#4ADE80" : "#F87171",
                ),
                fill: true,
                tension: 0.28,
                cubicInterpolationMode: "monotone",
                borderWidth: 2.25,
                pointRadius: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 120,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (c) =>
                    c.parsed.y >= 0
                      ? `+${c.parsed.y.toFixed(2)} €`
                      : `${c.parsed.y.toFixed(2)} €`,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#AAAAAA",
                  font: { size: 10, weight: "bold" },
                },
                grid: { display: false },
              },
              y: {
                ticks: {
                  color: "#B8B8B8",
                  font: { size: 11, weight: "bold" },
                  callback: (v) => (v >= 0 ? `+${v}€` : `${v}€`),
                },
                grid: { color: "rgba(255,255,255,0.08)" },
              },
            },
          },
        });
      },
    );
  }
}

let currentHabitDetail = null,
  habitCharts = [],
  habitPeriod = "week";
function detailChoiceButtons(h, currentValue) {
  return `<div class="habit-choice-grid">${normalizeHabitCategories(h)
    .map(
      (category) =>
        `<button type="button" class="${habitChoiceId(h, currentValue) === category.id ? "active" : ""}" onclick="setDetailChoice('${category.id}')"><span>${escapeAccountHtml(category.label)}</span><small>${category.score}%</small></button>`,
    )
    .join("")}</div>`;
}
function openHabitDetail(habitId) {
  currentHabitDetail = habitId;
  const h = habits.find((x) => x.id === habitId);
  if (!h) return;
  const entries = migrateEntries(),
    date = getSelectedEntryDate(),
    selected = entries.find((e) => e.date === date),
    currentVal =
      selected?.values?.[habitId] ??
      (isChoiceHabit(h)
        ? normalizeHabitCategories(h).at(-1).id
        : h.type === "time"
          ? ""
          : 0),
    currentContext = selected?.contexts?.[habitId] === "free" ? "free" : "busy";
  const dualCharts = h.splitGoal || h.type === "time";
  const scoringCount = habits.filter((habit) => habit.countsForScore !== false).length;
  const pointsLabel =
    h.countsForScore === false
      ? "OHNE SCORE-PUNKTE"
      : scoringCount
        ? `${(100 / scoringCount).toFixed(1)}P MAX`
        : "0P MAX";
  const graphs = dualCharts
    ? `<div class="mt-3 space-y-3"><div class="surface-2 !p-3 !rounded-[16px]"><div class="flex justify-between"><p class="font-bold text-[11px]">Nächster Tag frei</p><span class="font-mono text-[9px] text-[#A78BFA]">Ziel ${getHabitGoal(h, "free")}${h.type === "time" ? " Uhr" : h.unit || ""}</span></div><div class="habit-time-chart-wrap"><canvas id="habitChartFree"></canvas></div></div><div class="surface-2 !p-3 !rounded-[16px]"><div class="flex justify-between"><p class="font-bold text-[11px]">Nächster Tag nicht frei</p><span class="font-mono text-[9px] text-[#38BDF8]">Ziel ${getHabitGoal(h, "busy")}${h.type === "time" ? " Uhr" : h.unit || ""}</span></div><div class="habit-time-chart-wrap"><canvas id="habitChartBusy"></canvas></div></div></div>`
    : `<div class="mt-3 surface-2 !p-3 !rounded-[16px]"><div class="habit-time-chart-wrap"><canvas id="habitChart"></canvas></div></div>`;
  openModalHTML(
    `<div class="flex justify-between items-start gap-3"><div class="flex gap-2.5 items-center"><div class="w-11 h-11 rounded-[12px] flex items-center justify-center text-[20px]" style="background:var(--surface-2);border:1px solid var(--border)">${LifeIcon.from(h.icon)}</div><div><p class="font-mono text-[9px] tracking-widest opacity-60">HABIT • ${h.type === "time" ? "UHRZEIT" : pointsLabel}</p><h3 class="font-display text-[22px] font-bold leading-[.9] mt-0.5">${escapeHtml(h.name)}</h3></div></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-5 grid grid-cols-3 gap-2"><div class="surface-2 !p-3 !rounded-[14px]"><p class="font-mono text-[9px] opacity-60">${date === localDateISO() ? "HEUTE" : date.slice(5)}</p><p class="font-display font-bold text-[15px] mt-0.5">${formatHabitValue(h, currentVal)}</p></div><div class="surface-2 !p-3 !rounded-[14px]"><p class="font-mono text-[9px] opacity-60">Ø ZEITRAUM</p><p class="font-display font-bold text-[15px] mt-0.5" id="habit-avg7">–</p></div><div class="surface-2 !p-3 !rounded-[14px]"><p class="font-mono text-[9px] opacity-60">EINTRÄGE</p><p class="font-display font-bold text-[15px] mt-0.5" id="habit-best">–</p></div></div>
    <div class="mt-4 flex gap-1.5 flex-wrap"><button onclick="setHabitPeriod('week')" id="hp-week" class="period-btn active">Woche</button><button onclick="setHabitPeriod('month')" id="hp-month" class="period-btn">Monat</button><button onclick="setHabitPeriod('year')" id="hp-year" class="period-btn">Jahr</button><button onclick="setHabitPeriod('all')" id="hp-all" class="period-btn">Alle</button></div>${graphs}
    <div class="mt-4 p-3.5 rounded-[16px]" style="background:var(--gray-bg);border:1px solid var(--gray-border)"><p class="font-mono text-[10px] opacity-60 mb-2">FÜR ${date} EINTRAGEN</p>
      ${dualCharts ? `<select id="detail-context" class="input-min w-full mb-2"><option value="busy" ${currentContext === "busy" ? "selected" : ""}>💼 Nächster Tag nicht frei</option><option value="free" ${currentContext === "free" ? "selected" : ""}>🌙 Nächster Tag frei</option></select>` : ""}
      <div class="flex gap-2">${isChoiceHabit(h) ? detailChoiceButtons(h, currentVal) : h.type === "time" ? `<input id="detail-input" type="time" value="${isTimeValue(currentVal) ? currentVal : ""}" class="input-min flex-1 !py-2.5 !font-bold"><button onclick="saveDetailHabit()" class="btn-primary !py-2.5 !px-5">OK</button>` : `<div class="number-wrap flex-1"><input id="detail-input" type="number" value="${currentVal || 0}" class="input-min !py-2.5 !font-bold"><div class="stepper"><button class="step-btn up" onclick="adjustDetail(${h.id === "kcal" ? 20 : 1})">+</button><button class="step-btn" onclick="adjustDetail(${h.id === "kcal" ? -20 : -1})">−</button></div></div><button onclick="saveDetailHabit()" class="btn-primary !py-2.5 !px-5">OK</button>`}</div></div>`,
    () => setHabitPeriod("week"),
  );
}
function setHabitPeriod(p) {
  habitPeriod = p;
  document
    .querySelectorAll('[id^="hp-"]')
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("hp-" + p)?.classList.add("active");
  renderHabitChart();
}
function habitPeriodEntries() {
  const entries = migrateEntries();
  let days = 7;
  if (habitPeriod === "month") days = 30;
  else if (habitPeriod === "year") days = 365;
  else if (habitPeriod === "all") days = 9999;
  return entries.slice(-days);
}
function renderOneHabitChart(canvasId, h, entries, context, color) {
  const canvas = document.getElementById(canvasId),
    ctx = canvas?.getContext("2d");
  if (!ctx || typeof Chart === "undefined") return;
  let rows = entries.filter((e) => {
    if (e.values?.[h.id] === undefined || e.values?.[h.id] === "") return false;
    if (!context) return true;
    const rowContext =
      h.type === "time"
        ? e.contexts?.[h.id] === "free"
          ? "free"
          : "busy"
        : getHabitContext(e, h);
    return rowContext === context;
  });
  const labels = rows.map((e) => e.date.slice(5));
  let data, datasets, options;
  if (h.type === "time") {
    data = rows.map((e) => timeToBedtimeAxis(e.values[h.id]));
    const target = timeToBedtimeAxis(
        String(getHabitGoal(h, context || "default")),
      ),
      all = data
        .filter((v) => v !== null)
        .concat(target === null ? [] : [target]),
      min = all.length ? Math.floor((Math.min(...all) - 45) / 60) * 60 : 1080,
      max = all.length ? Math.ceil((Math.max(...all) + 45) / 60) * 60 : 1740;
    datasets = [
      {
        label: "Eingetragen",
        data,
        borderColor: color,
        backgroundColor: color + "18",
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
      },
      {
        label: "Ziel",
        data: rows.map(() => target),
        borderColor: "#FBBF24",
        borderDash: [6, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      },
    ];
    options = {
      plugins: {
        legend: {
          display: true,
          labels: { color: "#999", boxWidth: 12, font: { size: 9 } },
        },
        tooltip: {
          callbacks: {
            label: (c) =>
              `${c.dataset.label}: ${axisMinutesToTime(c.parsed.y)} Uhr`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#777", font: { size: 9 }, maxTicksLimit: 8 },
          grid: { display: false },
        },
        y: {
          min,
          max,
          reverse: true,
          ticks: { color: "#999", callback: (v) => axisMinutesToTime(v) },
          grid: { color: "rgba(255,255,255,.07)" },
        },
      },
    };
  } else {
    data = rows.map((e) =>
      isChoiceHabit(h)
        ? habitChoicePercent(h, e.values[h.id])
        : Number(e.values[h.id]) || 0,
    );
    const target = Number(getHabitGoal(h, context || "default")) || 0;
    datasets = [
      {
        label: isChoiceHabit(h) ? "Punkteanteil" : "Wert",
        data,
        borderColor: color,
        backgroundColor: color + "18",
        fill: !isChoiceHabit(h),
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
        borderRadius: 5,
      },
    ];
    if (!isChoiceHabit(h))
      datasets.push({
        label: "Ziel",
        data: rows.map(() => target),
        borderColor: "#FBBF24",
        borderDash: [6, 5],
        borderWidth: 1.5,
        pointRadius: 0,
      });
    options = {
      plugins: {
        legend: {
          display: !isChoiceHabit(h),
          labels: { color: "#999", boxWidth: 12, font: { size: 9 } },
        },
      },
      scales: {
        x: {
          ticks: { color: "#777", font: { size: 9 }, maxTicksLimit: 8 },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#999" },
          grid: { color: "rgba(255,255,255,.07)" },
        },
      },
    };
  }
  habitCharts.push(
    new Chart(ctx, {
      type: isChoiceHabit(h) ? "bar" : "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 120,
        ...options,
      },
    }),
  );
}
function renderHabitChart() {
  const h = habits.find((x) => x.id === currentHabitDetail);
  if (!h) return;
  habitCharts.forEach((c) => {
    try {
      c.destroy();
    } catch (e) {}
  });
  habitCharts = [];
  const entries = habitPeriodEntries(),
    values = entries
      .map((e) => e.values?.[h.id])
      .filter((v) => v !== undefined && v !== "");
  const avgEl = document.getElementById("habit-avg7"),
    countEl = document.getElementById("habit-best");
  if (h.type === "time") {
    const axes = values.map(timeToBedtimeAxis).filter((v) => v !== null),
      avg = axes.length ? axes.reduce((a, b) => a + b, 0) / axes.length : null;
    if (avgEl) avgEl.textContent = avg === null ? "–" : axisMinutesToTime(avg);
    if (countEl) countEl.textContent = axes.length;
  } else if (isChoiceHabit(h)) {
    const percentages = values.map((value) => habitChoicePercent(h, value));
    const averagePercent = percentages.length
      ? percentages.reduce((sum, value) => sum + value, 0) /
        percentages.length
      : 0;
    if (avgEl)
      avgEl.textContent = percentages.length
        ? Math.round(averagePercent) + "%"
        : "–";
    if (countEl) countEl.textContent = values.length;
  } else {
    const nums = values.map(Number).filter(Number.isFinite),
      avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    if (avgEl)
      avgEl.textContent = nums.length ? avg.toFixed(1) + (h.unit || "") : "–";
    if (countEl) countEl.textContent = nums.length;
  }
  if (h.splitGoal || h.type === "time") {
    renderOneHabitChart("habitChartFree", h, entries, "free", "#A78BFA");
    renderOneHabitChart("habitChartBusy", h, entries, "busy", "#38BDF8");
  } else renderOneHabitChart("habitChart", h, entries, null, "#FFFFFF");
}
function adjustDetail(d) {
  const el = document.getElementById("detail-input");
  if (!el || el.type === "time") return;
  el.value = Math.max(
    0,
    Math.round(((parseFloat(el.value) || 0) + d) * 10) / 10,
  );
}
function saveDetailHabit() {
  const h = habits.find((x) => x.id === currentHabitDetail);
  if (!h) return;
  const input = document.getElementById("detail-input"),
    val =
      h.type === "time" ? input?.value || "" : parseFloat(input?.value) || 0,
    date = getSelectedEntryDate();
  let entries = migrateEntries(),
    entry = entries.find((e) => e.date === date);
  if (!entry) {
    entry = {
      date,
      values: {},
      contexts: {},
      aus: 0,
      ein: 0,
      note: "",
      ts: Date.now(),
    };
    entries.push(entry);
  }
  entry.values = entry.values || {};
  entry.contexts = entry.contexts || {};
  entry.values[h.id] = val;
  if (h.splitGoal || h.type === "time")
    entry.contexts[h.id] =
      document.getElementById("detail-context")?.value || "busy";
  entry.score = calcPointsForEntry(entry, habits).total;
  entries.sort((a, b) => a.date.localeCompare(b.date));
  save("life-entries", entries);
  closeModal();
  updateAll();
  renderHistory();
  renderStatsGrid();
  loadEntryDate();
}
function setDetailChoice(categoryId) {
  const h = habits.find((habit) => habit.id === currentHabitDetail);
  if (!h) return;
  const date = getSelectedEntryDate();
  let entries = migrateEntries(),
    entry = entries.find((e) => e.date === date);
  if (!entry) {
    entry = {
      date,
      values: {},
      contexts: {},
      aus: 0,
      ein: 0,
      note: "",
      ts: Date.now(),
    };
    entries.push(entry);
  }
  entry.values = entry.values || {};
  entry.values[currentHabitDetail] = habitChoiceId(h, categoryId);
  entry.score = calcPointsForEntry(entry, habits).total;
  entries.sort((a, b) => a.date.localeCompare(b.date));
  save("life-entries", entries);
  closeModal();
  updateAll();
  renderHistory();
  renderStatsGrid();
  loadEntryDate();
}
function setDetailBool(value) {
  const h = habits.find((habit) => habit.id === currentHabitDetail);
  if (!h) return;
  const categories = normalizeHabitCategories(h);
  setDetailChoice(value ? categories[0].id : categories.at(-1).id);
}
