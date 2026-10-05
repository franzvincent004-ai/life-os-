// ==================== 05.15 · DASHBOARD, STATISTIKEN & TAGESARCHIV ====================
function updateAll() {
  const entries = migrateEntries();
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayEntry =
    entries.find((e) => e.date === todayStr) || entries.slice(-1)[0];
  const dayScore = todayEntry ? todayEntry.score : 0;
  const monthStr = todayStr.slice(0, 7);
  const monthEntries = entries.filter((e) => e.date.slice(0, 7) === monthStr);
  const monthScore = monthEntries.length
    ? monthEntries.reduce((s, e) => s + e.score, 0) / monthEntries.length
    : 0;
  const yearStr = todayStr.slice(0, 4);
  const yearEntries = entries.filter((e) => e.date.slice(0, 4) === yearStr);
  const yearScore = yearEntries.length
    ? yearEntries.reduce((s, e) => s + e.score, 0) / yearEntries.length
    : 0;
  const setTxt = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  const setStyle = (id, prop, v) => {
    const el = document.getElementById(id);
    if (el) el.style[prop] = v;
  };
  setTxt("score-day-num", dayScore);
  setTxt("score-day-big", dayScore);
  setStyle("score-day-bar", "width", dayScore + "%");
  const ring = document.getElementById("score-ring");
  if (ring) ring.style.strokeDashoffset = 163.36 - (163.36 * dayScore) / 100;
  setTxt("score-month-num", Math.round(monthScore) + " /100");
  setTxt("score-year-num", Math.round(yearScore) + " /100");
  setTxt(
    "score-month-label",
    new Date().toLocaleDateString("de-DE", { month: "long" }) +
      " • " +
      monthEntries.length +
      " Tage",
  );
  setTxt("score-year-label", yearStr + " • " + yearEntries.length + " Tage");
  // Echte Kalendertage in Folge (vorher: nur aufeinanderfolgende Einträge ≥ 60 Punkte)
  const streak = typeof calcStreak === "function" ? calcStreak(entries) : 0;
  setTxt("streak-text", streak + " Tage Streak");
  setTxt("total-text", entries.length + " Einträge");
  if (todayEntry) updateMomoProgressive(dayScore, monthScore);
  else {
    const calc = calcPointsFromInputs();
    updateMomoProgressive(calc.total, monthScore);
  }
  updateMiniChart();
  updateMoneyChart();
  updateCalorieChart();
  updateRankUI();
}

function renderStatsGrid() {
  const entries = migrateEntries(),
    grid = document.getElementById("stats-grid");
  if (!grid) return;
  const last7 = entries.slice(-7);
  grid.innerHTML = "";
  habits.forEach((h) => {
    const raw = last7
        .map((e) => ({ value: e.values?.[h.id], entry: e }))
        .filter((x) => x.value !== undefined && x.value !== ""),
      card = document.createElement("div");
    card.className = "stat-card";
    card.onclick = () => openHabitDetail(h.id);
    let top = "",
      main = "",
      progress = 0;
    if (h.type === "time") {
      const axes = raw
          .map((x) => timeToBedtimeAxis(x.value))
          .filter((v) => v !== null),
        avg = axes.length
          ? axes.reduce((a, b) => a + b, 0) / axes.length
          : null;
      top = avg === null ? "Ø –" : `Ø ${axisMinutesToTime(avg)}`;
      main = `${axes.length} Einträge`;
      progress = axes.length
        ? raw.reduce(
            (s, x) =>
              s +
              calcPointsForEntry(
                {
                  values: { [h.id]: x.value },
                  contexts: x.entry.contexts || {},
                },
                [{ ...h, countsForScore: true }],
              ).total,
            0,
          ) / axes.length
        : 0;
    } else if (isChoiceHabit(h)) {
      const percentages = raw.map((item) =>
        habitChoicePercent(h, item.value),
      );
      progress = percentages.length
        ? percentages.reduce((sum, value) => sum + value, 0) /
          percentages.length
        : 0;
      top = `Ø ${Math.round(progress)}%`;
      main = raw.length ? formatHabitValue(h, raw.at(-1).value) : "–";
    } else {
      const nums = raw.map((x) => Number(x.value) || 0),
        avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0,
        total = nums.reduce((a, b) => a + b, 0);
      top = `Ø ${avg.toFixed(h.goal < 5 ? 1 : 0)}${h.unit || ""}`;
      main =
        h.unit === "h"
          ? total.toFixed(1) + h.unit
          : total.toFixed(0) + (h.unit || "");
      progress = raw.length
        ? raw.reduce(
            (s, x) =>
              s +
              calcPointsForEntry(
                {
                  values: { [h.id]: x.value },
                  contexts: x.entry.contexts || {},
                },
                [{ ...h, countsForScore: true }],
              ).total,
            0,
          ) / raw.length
        : 0;
    }
    card.innerHTML = `<div class="flex justify-between items-start gap-1"><span class="text-[16px]">${LifeIcon.from(h.icon)}</span><span class="font-mono text-[8px] px-1.5 py-0.5 rounded-full truncate" style="background:var(--surface-2)">${top}</span></div><p class="font-display font-bold text-[13px] mt-1.5 truncate">${escapeHtml(h.name)}</p><p class="stat-value !text-[18px] mt-1.5">${main || "–"}</p><p class="font-mono text-[8px] mt-1 truncate" style="color:var(--text-2)">${h.countsForScore === false ? "Nur Tracking · " : "Ziel "}${habitGoalSummary(h)}</p><div class="mt-2 h-1 rounded-full overflow-hidden" style="background:var(--surface-3)"><div class="h-full rounded-full" style="background:var(--accent);width:${Math.min(100, Math.max(0, progress))}%"></div></div>`;
    grid.appendChild(card);
  });
  const sum = (arr, key) => arr.reduce((s, x) => s + (x[key] || 0), 0),
    geldEin = sum(last7, "ein"),
    geldAus = sum(last7, "aus"),
    extra = document.createElement("div");
  extra.className = "stat-card";
  extra.onclick = () => openScoreModal("money");
  extra.innerHTML = `<p class="stat-label">GELD 7T</p><p class="stat-value" style="color:${geldEin - geldAus >= 0 ? "var(--accent)" : "#B87A6A"}">${(geldEin - geldAus).toFixed(0)}€</p><p class="font-mono text-[9px] mt-1" style="color:var(--text-2)">Ein ${geldEin.toFixed(0)} • Aus ${geldAus.toFixed(0)}</p>`;
  grid.appendChild(extra);
}

function renderHistory() {
  const entries = migrateEntries(),
    tbody = document.getElementById("history-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  [...entries].reverse().forEach((e) => {
    let details = habits
      .map((h) => {
        const v = e.values?.[h.id];
        if (v === undefined || v === "") return "";
        if (isChoiceHabit(h))
          return `${LifeIcon.from(h.icon)}${formatHabitValue(h, v)}`;
        if (h.type === "time")
          return isTimeValue(v) ? `${LifeIcon.from(h.icon)}${v}` : "";
        return v ? `${LifeIcon.from(h.icon)}${v}${h.unit || ""}` : "";
      })
      .filter(Boolean)
      .join(" ");
    const ce = getEntryCaloriesEaten(e),
      cb = getEntryCaloriesBurned(e);
    if (ce || cb) details += ` 🍽${Math.round(ce)} · 🔥${Math.round(cb)}`;
    const tr = document.createElement("tr");
    tr.className = "border-b";
    tr.style.borderColor = "var(--border-soft)";
    tr.innerHTML = `<td class="py-3 font-mono text-[11px] whitespace-nowrap">${e.date}</td><td><span class="px-2 py-0.5 rounded-full text-[11px] font-bold" style="background:var(--surface-2);color:${e.score >= 80 ? "#4ADE80" : e.score >= 50 ? "#FBBF24" : "#F87171"}">${e.score}</span></td><td class="font-mono text-[10px] max-w-[220px] truncate hidden sm:table-cell">${details || "–"}</td><td class="font-mono text-[11px]" style="color:${e.ein - e.aus >= 0 ? "#4ADE80" : "#F87171"}">${(e.ein - e.aus).toFixed(0)}€</td><td><div class="flex justify-end gap-1"><button onclick="editDayEntry('${e.date}')" class="px-2.5 py-1.5 rounded-[9px] text-[10px] font-bold" style="background:var(--surface-2);border:1px solid var(--border)">✎</button><button onclick="deleteEntry('${e.date}')" class="w-7 h-7 rounded-[9px] text-[10px]" style="color:#F87171;background:rgba(248,113,113,.08)">✕</button></div></td>`;
    tbody.appendChild(tr);
  });
  if (!entries.length)
    tbody.innerHTML =
      '<tr><td colspan="5" class="py-8 text-center text-[12px] text-[var(--text-3)]">Noch keine Tage eingetragen.</td></tr>';
}
function dayOverviewDetails(entry) {
  const habitsHtml = habits
    .map((h) => {
      const v = entry.values?.[h.id];
      if (v === undefined || v === "") return "";
      const context = h.splitGoal
        ? getHabitContext(entry, h) === "free"
          ? " · 🌙 frei"
          : " · 💼 nicht frei"
        : "";
      return `<div class="flex justify-between gap-3 py-1.5 border-b last:border-0" style="border-color:var(--border-soft)"><span class="text-[11px] truncate">${LifeIcon.from(h.icon)} ${escapeHtml(h.name)}${context}</span><b class="font-mono text-[10px] shrink-0">${formatHabitValue(h, v)}</b></div>`;
    })
    .filter(Boolean)
    .join("");
  const eaten = getEntryCaloriesEaten(entry),
    burned = getEntryCaloriesBurned(entry),
    net = eaten - burned;
  const calories =
    eaten || burned
      ? `<div class="mt-2 p-2.5 rounded-[11px] flex justify-between gap-2 text-[9px] font-mono" style="background:var(--surface-3)"><span style="color:#FB923C">🍽 ${Math.round(eaten)}</span><span style="color:#22D3EE">🔥 ${Math.round(burned)}</span><b style="color:${net > 0 ? "#F87171" : net < 0 ? "#4ADE80" : "#A3A3A3"}">= ${net > 0 ? "+" : ""}${Math.round(net)} kcal</b></div>`
      : "";
  return habitsHtml + calories;
}
function openAllDaysModal() {
  const entries = migrateEntries(),
    first = entries[0]?.date || "–",
    last = entries[entries.length - 1]?.date || "–";
  openModalHTML(
    `<div class="flex justify-between items-start gap-3"><div><p class="font-mono text-[9px] tracking-widest opacity-50">GESAMTER ZEITRAUM</p><h3 class="font-display text-[24px] font-bold">Alle ${entries.length} Tage</h3><p class="text-[10px] text-[var(--text-2)] mt-1">${first} bis ${last}</p></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-4 grid grid-cols-[1fr_auto] gap-2"><input id="all-days-filter" type="search" placeholder="Datum oder Notiz suchen …" oninput="renderAllDaysList()" class="input-min"><button onclick="document.getElementById('all-days-filter').value='';renderAllDaysList()" class="btn-ghost !px-3">Reset</button></div>
    <div id="all-days-list" class="mt-3 space-y-2 max-h-[60vh] overflow-y-auto pr-1"></div>`,
    renderAllDaysList,
  );
}
function renderAllDaysList() {
  const host = document.getElementById("all-days-list");
  if (!host) return;
  const q = (document.getElementById("all-days-filter")?.value || "")
    .trim()
    .toLowerCase();
  const entries = [...migrateEntries()]
    .reverse()
    .filter(
      (e) =>
        !q || e.date.includes(q) || (e.note || "").toLowerCase().includes(q),
    );
  host.innerHTML =
    entries
      .map((e) => {
        const weekday = new Date(e.date + "T12:00:00").toLocaleDateString(
            "de-DE",
            {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            },
          ),
          net = (e.ein || 0) - (e.aus || 0);
        return `<article class="p-3.5 rounded-[16px]" style="background:var(--surface-2);border:1px solid var(--border)"><div class="flex justify-between items-start gap-3"><div><p class="font-bold text-[13px]">${weekday}</p><p class="font-mono text-[9px] text-[var(--text-3)] mt-0.5">${e.date}${e.note ? " · " + escapeAccountHtml(e.note) : ""}</p></div><div class="text-right"><span class="font-bold text-[13px]" style="color:${e.score >= 80 ? "#4ADE80" : e.score >= 50 ? "#FBBF24" : "#F87171"}">${e.score} P</span><p class="font-mono text-[9px] mt-0.5" style="color:${net >= 0 ? "#4ADE80" : "#F87171"}">${net >= 0 ? "+" : ""}${net.toFixed(2)} €</p></div></div><div class="mt-2">${dayOverviewDetails(e) || '<p class="text-[10px] text-[var(--text-3)]">Keine Habit-Daten</p>'}</div><button onclick="editDayEntry('${e.date}')" class="w-full mt-3 py-2.5 rounded-[11px] text-[11px] font-bold" style="background:var(--text);color:var(--bg)">✎ Diesen Tag bearbeiten</button></article>`;
      })
      .join("") ||
    '<p class="text-center py-8 text-[12px] text-[var(--text-3)]">Keine passenden Einträge gefunden.</p>';
}
function editDayEntry(date) {
  closeModal();
  switchTab("today");
  const input = document.getElementById("entry-date");
  if (input) input.value = date;
  loadEntryDate();
  setTimeout(() => {
    const card = document.getElementById("daily-entry-card");
    card?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (card) {
      card.style.boxShadow =
        "0 0 0 2px var(--accent),0 18px 50px rgba(0,0,0,.25)";
      setTimeout(() => (card.style.boxShadow = ""), 1400);
    }
  }, 120);
}
function deleteEntry(d) {
  if (!confirm(`Eintrag vom ${d} löschen?`)) return;
  const e = migrateEntries().filter((x) => x.date !== d);
  save("life-entries", e);
  updateAll();
  renderHistory();
  renderStatsGrid();
  if (document.getElementById("all-days-list")) renderAllDaysList();
}
function exportCSV() {
  const entries = migrateEntries();
  let csv =
    "Datum," +
    habits.map((h) => h.name).join(",") +
    ",Kalorien gegessen,Kalorien verbrannt,Kalorienbilanz,Aus,Ein,Score,Notiz\n";
  entries.forEach((e) => {
    const vals = habits
        .map((h) => {
          const v = e.values?.[h.id];
          return v === true ? "Gut" : v === false ? "Cheat" : v || 0;
        })
        .join(","),
      eaten = getEntryCaloriesEaten(e),
      burned = getEntryCaloriesBurned(e);
    csv += `${e.date},${vals},${eaten},${burned},${eaten - burned},${e.aus},${e.ein},${e.score},"${(e.note || "").replace(/"/g, '""')}"\n`;
  });
  const b = new Blob([csv], { type: "text/csv" }),
    u = URL.createObjectURL(b),
    a = document.createElement("a");
  a.href = u;
  a.download = "life.csv";
  a.click();
}
function clearAll() {
  if (!confirm("Alles löschen?")) return;
  localStorage.removeItem(key("life-entries"));
  updateAll();
  renderHistory();
  renderStatsGrid();
}

let chartMini,
  chartMoney,
  chartIncome,
  chartExpenses,
  chartCalories,
  chartCaloriesEaten,
  chartCaloriesBurned;
function updateMiniChart() {
  if (typeof Chart === "undefined") return;
  const entries = migrateEntries().slice(-14);
  const ctx = document.getElementById("chart-mini")?.getContext("2d");
  if (!ctx) return;
  if (chartMini) chartMini.destroy();
  chartMini = new Chart(ctx, {
    type: "line",
    data: {
      labels: entries.map((e) => e.date.slice(5)),
      datasets: [
        {
          label: "Punkte",
          data: entries.map((e) => e.score),
          borderColor: "#FFFFFF",
          backgroundColor: "rgba(255,255,255,0.06)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#666666", font: { size: 9 } },
          grid: { display: false },
        },
        y: {
          min: 0,
          ticks: { color: "#666666" },
          grid: { color: "#222222" },
        },
      },
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}
function dashboardLineChart(canvasId, labels, values, config = {}) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas?.getContext("2d");
  if (!ctx || typeof Chart === "undefined") return null;
  const gradient = ctx.createLinearGradient(0, 0, 0, 190);
  gradient.addColorStop(0, `${config.color || "#FFFFFF"}38`);
  gradient.addColorStop(1, `${config.color || "#FFFFFF"}00`);
  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: config.label || "Wert",
          data: values,
          borderColor: config.color || "#FFFFFF",
          backgroundColor: gradient,
          fill: true,
          tension: 0.28,
          cubicInterpolationMode: "monotone",
          borderWidth: 2.25,
          pointRadius: values.length <= 14 ? 2.5 : 0,
          pointHoverRadius: 5,
          pointBackgroundColor: config.color || "#FFFFFF",
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 120,
      animation: { duration: 350 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = Number(context.parsed.y) || 0;
              const prefix = config.forcePlus && value > 0 ? "+" : "";
              return `${config.label || "Wert"}: ${prefix}${config.format ? config.format(value) : value}`;
            },
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          ticks: { color: "#7D8590", font: { size: 9 }, maxTicksLimit: 7 },
          grid: { display: false },
        },
        y: {
          border: { display: false },
          beginAtZero: config.beginAtZero || false,
          ticks: {
            color: "#8D95A0",
            font: { size: 9 },
            callback: (value) =>
              config.axis ? config.axis(Number(value)) : value,
          },
          grid: { color: "rgba(255,255,255,.055)" },
        },
      },
    },
  });
}

function refreshDashboardLineChart(chart, canvasId, labels, values, config) {
  if (chart?.canvas?.isConnected) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update("none");
    return chart;
  }
  try {
    chart?.destroy();
  } catch (error) {}
  return dashboardLineChart(canvasId, labels, values, config);
}

function destroyChart(chart) {
  try {
    chart?.destroy();
  } catch (error) {}
  return null;
}

function toggleMoneyChartDetails() {
  const card = document.getElementById("money-chart-card");
  const details = document.getElementById("money-chart-details");
  if (!card || !details) return;
  const open = details.hidden;
  details.hidden = !open;
  card.classList.toggle("is-expanded", open);
  card.setAttribute("aria-expanded", String(open));
  if (open) {
    requestAnimationFrame(() =>
      renderMoneyDetailCharts(migrateEntries().slice(-14)),
    );
  } else {
    chartIncome = destroyChart(chartIncome);
    chartExpenses = destroyChart(chartExpenses);
  }
}

function renderMoneyDetailCharts(entries) {
  const labels = entries.map((entry) => entry.date.slice(5));
  const income = entries.map((entry) => Number(entry.ein) || 0);
  const expenses = entries.map((entry) => -Math.abs(Number(entry.aus) || 0));
  chartIncome = refreshDashboardLineChart(
    chartIncome,
    "chart-income",
    labels,
    income,
    {
      label: "Einnahmen",
      color: "#4ADE80",
      beginAtZero: true,
      forcePlus: true,
      format: (value) => `${value.toFixed(2)} €`,
      axis: (value) => `+${Math.abs(value)} €`,
    },
  );
  chartExpenses = refreshDashboardLineChart(
    chartExpenses,
    "chart-expenses",
    labels,
    expenses,
    {
      label: "Ausgaben",
      color: "#F87171",
      beginAtZero: true,
      format: (value) => `${value.toFixed(2)} €`,
      axis: (value) => `${value} €`,
    },
  );
}

function updateMoneyChart() {
  if (typeof Chart === "undefined") return;
  const entries = migrateEntries().slice(-14);
  const labels = entries.map((entry) => entry.date.slice(5));
  const difference = entries.map(
    (entry) => (Number(entry.ein) || 0) - (Number(entry.aus) || 0),
  );
  chartMoney = refreshDashboardLineChart(
    chartMoney,
    "chart-money",
    labels,
    difference,
    {
      label: "Differenz",
      color: "#38BDF8",
      forcePlus: true,
      format: (value) => `${value.toFixed(2)} €`,
      axis: (value) => `${value > 0 ? "+" : ""}${value} €`,
    },
  );
  if (!document.getElementById("money-chart-details")?.hidden) {
    renderMoneyDetailCharts(entries);
  }
}

function toggleCalorieChartDetails() {
  const card = document.getElementById("calorie-chart-card");
  const details = document.getElementById("calorie-chart-details");
  if (!card || !details) return;
  const open = details.hidden;
  details.hidden = !open;
  card.classList.toggle("is-expanded", open);
  card.setAttribute("aria-expanded", String(open));
  if (open) {
    requestAnimationFrame(() =>
      renderCalorieDetailCharts(migrateEntries().slice(-14)),
    );
  } else {
    chartCaloriesEaten = destroyChart(chartCaloriesEaten);
    chartCaloriesBurned = destroyChart(chartCaloriesBurned);
  }
}

function renderCalorieDetailCharts(entries) {
  const labels = entries.map((entry) => entry.date.slice(5));
  const eaten = entries.map(getEntryCaloriesEaten);
  const burned = entries.map(getEntryCaloriesBurned);
  chartCaloriesEaten = refreshDashboardLineChart(
    chartCaloriesEaten,
    "chart-calories-eaten",
    labels,
    eaten,
    {
      label: "Gegessen",
      color: "#FB923C",
      beginAtZero: true,
      format: (value) => `${Math.round(value)} kcal`,
      axis: (value) => `${value} kcal`,
    },
  );
  chartCaloriesBurned = refreshDashboardLineChart(
    chartCaloriesBurned,
    "chart-calories-burned",
    labels,
    burned,
    {
      label: "Verbrannt",
      color: "#22D3EE",
      beginAtZero: true,
      format: (value) => `${Math.round(value)} kcal`,
      axis: (value) => `${value} kcal`,
    },
  );
}

function updateCalorieChart() {
  if (typeof Chart === "undefined") return;
  const entries = migrateEntries().slice(-14);
  const labels = entries.map((entry) => entry.date.slice(5));
  const eaten = entries.map(getEntryCaloriesEaten);
  const burned = entries.map(getEntryCaloriesBurned);
  const difference = entries.map(
    (entry, index) => eaten[index] - burned[index],
  );
  const latest = difference.at(-1) || 0;
  const summary = document.getElementById("calorie-chart-summary");
  if (summary) {
    const goalState = evaluateCalorieGoal(latest);
    summary.textContent = entries.length
      ? `${latest > 0 ? "+" : ""}${Math.round(latest)} kcal`
      : "Noch keine Daten";
    summary.style.color = entries.length
      ? goalState.met
        ? "#4ADE80"
        : "#FBBF24"
      : "var(--text-2)";
  }
  chartCalories = refreshDashboardLineChart(
    chartCalories,
    "chart-calories",
    labels,
    difference,
    {
      label: "Differenz",
      color: "#A78BFA",
      forcePlus: true,
      format: (value) => `${Math.round(value)} kcal`,
      axis: (value) => `${value > 0 ? "+" : ""}${value} kcal`,
    },
  );
  if (!document.getElementById("calorie-chart-details")?.hidden) {
    renderCalorieDetailCharts(entries);
  }
}
