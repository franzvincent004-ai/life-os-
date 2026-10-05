// ==================== 05.18 · GYM ====================
function setGymPeriod(p) {
  gymPeriod = p;
  document
    .querySelectorAll('[id^="gym-p-"]')
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("gym-p-" + p)?.classList.add("active");
  renderGym();
}
function renderGym() {
  const gymLog = load("gym-log", []);
  const container = document.getElementById("gym-cards");
  if (!container) return;
  container.innerHTML = "";
  const sel = document.getElementById("gym-select");
  if (sel)
    sel.innerHTML = exercises
      .map((ex) => `<option value="${ex}">${ex}</option>`)
      .join("");
  exercises.forEach((ex) => {
    const hist = gymLog.filter((l) => l.ex === ex);
    const bestEntry = hist.reduce(
      (a, b) =>
        b.reps > a.reps ||
        (b.reps === a.reps && (b.weight || 0) > (a.weight || 0))
          ? b
          : a,
      { reps: 0, weight: 0 },
    );
    const best = bestEntry.reps || 0;
    const bestWeight = bestEntry.weight || 0;
    const isCustom = !DEFAULT_EXERCISES.includes(ex);
    const card = document.createElement("div");
    card.className = "stat-card";
    card.onclick = () => openGymDetail(ex);
    card.innerHTML = `
      <div class="flex justify-between items-start"><p class="stat-label">${hist.length} LOGS</p><span class="font-mono text-[9px] px-1.5 py-0.5 rounded-full" style="background:var(--surface-2)">${Math.min(100, Math.round((best / 15) * 100))}%</span></div>
      <p class="font-display font-bold text-[14px] mt-1.5 truncate">${ex}</p>
      <p class="stat-value !text-[20px] mt-1.5">${best} <span class="text-[12px] opacity-50">${bestWeight ? bestWeight + "kg" : ""}</span></p>
      <p class="font-mono text-[9px] mt-1 opacity-50">PR • Ziel 15</p>
    `;
    container.appendChild(card);
  });
  const logDiv = document.getElementById("gym-log");
  if (logDiv) {
    logDiv.innerHTML = "";
    [...gymLog]
      .reverse()
      .slice(0, 10)
      .forEach((l) => {
        const d = document.createElement("div");
        d.className =
          "flex justify-between items-center px-2.5 py-2 rounded-[11px] text-[12px]";
        d.style.background = "var(--surface-2)";
        d.innerHTML =
          '<span class="font-mono opacity-55">' +
          l.date +
          '</span><span class="font-bold truncate max-w-[80px]">' +
          l.ex +
          '</span><span class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold" style="background:var(--accent-light); color:var(--accent-dark)">' +
          l.reps +
          (l.weight ? " \u2022 " + l.weight + "kg" : "") +
          '</span><button onclick="deleteGymLog(' +
          l.ts +
          ')" class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-50" style="color:var(--text-3)">\u2715</button></span>';
        logDiv.appendChild(d);
      });
  }
  let bestEx = "-",
    bestVal = 0;
  exercises.forEach((ex) => {
    const h = gymLog.filter((l) => l.ex === ex);
    const m = h.length ? Math.max(...h.map((x) => x.reps)) : 0;
    if (m > bestVal) {
      bestVal = m;
      bestEx = ex;
    }
  });
  const bestEl = document.getElementById("gym-best");
  if (bestEl)
    bestEl.textContent = bestEx !== "-" ? `${bestEx} ${bestVal}` : "-";
  renderTrainingsplaene();
}
function renderGymStats() {
  const gymLog = load("gym-log", []);
  const container = document.getElementById("gym-stats");
  if (!container) return;
  const best = {};
  gymLog.forEach((l) => {
    best[l.ex] = Math.max(best[l.ex] || 0, l.reps);
  });
  const avgBest = Object.values(best).length
    ? (
        Object.values(best).reduce((a, b) => a + b, 0) /
        Object.values(best).length
      ).toFixed(1)
    : 0;
  container.innerHTML = `
    <div class="stat-card"><p class="stat-label">TOTAL LOGS</p><p class="stat-value">${gymLog.length}</p></div>
    <div class="stat-card"><p class="stat-label">Ø BEST</p><p class="stat-value">${avgBest}</p></div>
    <div class="stat-card"><p class="stat-label">ÜBUNGEN</p><p class="stat-value">${Object.keys(best).length}/${exercises.length}</p></div>
    <div class="stat-card"><p class="stat-label">BESTE</p><p class="stat-value !text-[14px] truncate">${Object.entries(best).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}</p></div>
  `;
}
function openAddExerciseModal() {
  openModalHTML(`
    <div class="flex justify-between"><h3 class="font-display text-[20px] font-bold">Neue Übung</h3><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-4 space-y-3"><input id="new-ex-name" placeholder="Name z.B. Weighted Pull Ups" class="input-min font-bold"><button onclick="saveNewExercise()" class="w-full btn-primary">+ Hinzufügen</button></div>
  `);
}
function saveNewExercise() {
  const name = document.getElementById("new-ex-name").value.trim();
  if (!name) return;
  if (exercises.includes(name)) return alert("Gibt es schon");
  exercises.push(name);
  save("gym-exercises", exercises);
  closeModal();
  renderGym();
  renderGymStats();
}
function deleteGymLog(ts) {
  if (!confirm("PR löschen?")) return;
  var log = load("gym-log", []);
  log = log.filter(function (l) {
    return l.ts !== ts;
  });
  save("gym-log", log);
  renderGym();
  renderGymStats();
}
function addGym() {
  const ex = document.getElementById("gym-select").value;
  const reps = parseInt(document.getElementById("gym-reps").value) || 0;
  if (!reps) return;
  const weight = parseFloat(document.getElementById("gym-weight").value) || 0;
  const date =
    document.getElementById("gym-date")?.value ||
    new Date().toISOString().slice(0, 10);
  const note = document.getElementById("gym-note")?.value || "";
  const log = load("gym-log", []);
  log.push({ ex, reps, weight, date, note, ts: Date.now() });
  save("gym-log", log);
  document.getElementById("gym-reps").value = "";
  document.getElementById("gym-weight").value = "";
  document.getElementById("gym-note").value = "";
  if (navigator.vibrate) navigator.vibrate(20);
  renderGym();
  renderGymStats();
}
function openGymDetail(ex) {
  var allLogs = load("gym-log", []).filter(function (l) {
    return l.ex === ex;
  });
  var detailPeriod = "month";
  function renderDetailChart() {
    if (typeof Chart === "undefined") return;
    var cvs = document.getElementById("gymDetailChart");
    if (!cvs) return;
    var c2 = cvs.getContext("2d");
    if (!c2) return;
    var filtered = allLogs;
    if (detailPeriod === "week") filtered = allLogs.slice(-12);
    else if (detailPeriod === "month") filtered = allLogs.slice(-30);
    if (window._gymDetChart)
      try {
        window._gymDetChart.destroy();
      } catch (e) {}
    if (!filtered.length) {
      cvs.width = cvs.offsetWidth;
      cvs.height = 220;
      c2.clearRect(0, 0, cvs.width, cvs.height);
      c2.fillStyle = "#888";
      c2.font = "bold 14px sans-serif";
      c2.textAlign = "center";
      c2.fillText(
        "Noch keine Daten - PR eintragen",
        cvs.width / 2,
        cvs.height / 2,
      );
      var h2 = document.getElementById("gym-detail-history");
      if (h2) h2.innerHTML = "";
      return;
    }
    var hasW = false;
    for (var i = 0; i < filtered.length; i++) {
      if (filtered[i].weight > 0) {
        hasW = true;
        break;
      }
    }
    var ds = [
      {
        label: "Reps",
        data: filtered.map(function (l) {
          return l.reps;
        }),
        borderColor: "#7BA889",
        backgroundColor: "rgba(123,168,137,0.15)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        borderWidth: 2,
      },
    ];
    if (hasW)
      ds.push({
        label: "kg",
        data: filtered.map(function (l) {
          return l.weight || null;
        }),
        borderColor: "#FBBF24",
        backgroundColor: "rgba(251,191,36,0.1)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        borderWidth: 2,
        borderDash: [6, 3],
      });
    window._gymDetChart = new Chart(c2, {
      type: "line",
      data: {
        labels: filtered.map(function (l) {
          return l.date.slice(5);
        }),
        datasets: ds,
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: hasW } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#222" } },
        },
      },
    });
    var h3 = document.getElementById("gym-detail-history");
    if (h3)
      h3.innerHTML = filtered
        .slice(-8)
        .reverse()
        .map(function (l) {
          return (
            '<div class="flex justify-between items-center px-2.5 py-1.5 rounded-[10px] text-[12px]" style="background:var(--surface-2)"><span class="font-mono opacity-55">' +
            l.date +
            '</span><span class="flex items-center gap-1.5"><span class="font-bold">' +
            l.reps +
            " reps" +
            (l.weight ? " \u2022 " + l.weight + "kg" : "") +
            '</span><button onclick="event.stopPropagation();deleteGymLog(' +
            l.ts +
            ");window._setDGP('" +
            detailPeriod +
            '\')" class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-50" style="color:var(--text-3)">\u2715</button></span></div>'
          );
        })
        .join("");
  }
  var html =
    '<div class="flex justify-between items-start"><div><p class="font-mono text-[9px] opacity-60">GYM &bull; ' +
    allLogs.length +
    ' LOGS</p><h3 class="font-display text-[22px] font-bold leading-none mt-0.5">' +
    ex +
    '</h3></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">\u2715</button></div>';
  html += '<div class="mt-3 flex gap-1.5 flex-wrap">';
  html +=
    '<button onclick="window._setDGP(\'week\')" id="dgp-week" class="period-btn">Woche</button>';
  html +=
    '<button onclick="window._setDGP(\'month\')" id="dgp-month" class="period-btn active">Monat</button>';
  html +=
    '<button onclick="window._setDGP(\'all\')" id="dgp-all" class="period-btn">Alle</button>';
  html += "</div>";
  html +=
    '<div class="mt-3 surface-2 !p-3 !rounded-[16px]"><canvas id="gymDetailChart" height="220"></canvas></div>';
  html +=
    '<div class="mt-3 max-h-[140px] overflow-y-auto space-y-1.5" id="gym-detail-history"></div>';
  openModalHTML(html, function () {
    window._setDGP = function (p) {
      detailPeriod = p;
      document.querySelectorAll('[id^="dgp-"]').forEach(function (b) {
        b.classList.remove("active");
      });
      var el = document.getElementById("dgp-" + p);
      if (el) el.classList.add("active");
      renderDetailChart();
    };
    setTimeout(function () {
      renderDetailChart();
    }, 100);
  });
}
