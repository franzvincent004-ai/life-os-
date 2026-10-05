// ==================== 05.19 · SCHULE & NOTEN ====================
function setSchoolPeriod(p) {
  schoolPeriod = p;
  document
    .querySelectorAll('[id^="sch-p-"]')
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("sch-p-" + p)?.classList.add("active");
  renderSchool();
}
function parseNote(s) {
  s = (s || "").trim();
  if (!s) return null;
  let b = parseFloat(s.replace("+", "").replace("-", "").replace(",", "."));
  if (isNaN(b)) return null;
  if (s.includes("+")) b -= 0.3;
  if (s.includes("-")) b += 0.3;
  // Nur gültige deutsche Schulnoten zeichnen. Ungültige Werte würden die
  // invertierte Y-Achse am Anfang nach unten ziehen.
  if (b < 1 || b > 6) return null;
  return Math.round(b * 100) / 100;
}
function prepareSchoolCanvas(canvas, height) {
  if (!canvas) return null;
  const parentWidth = canvas.parentElement?.clientWidth || 640;
  canvas.width = Math.max(280, Math.floor(parentWidth));
  canvas.height = height;
  return canvas.getContext("2d");
}

const SUBJECT_COLORS = [
  "#22D3EE", // Cyan
  "#4ADE80", // Green
  "#FBBF24", // Gold
  "#A78BFA", // Purple
  "#F472B6", // Pink
  "#FB923C", // Orange
  "#38BDF8", // Light Blue
  "#E879F9", // Magenta
];
function redeemPromoCode() {
  const inp = document.getElementById("robot-promo-code");
  const code = (inp ? inp.value : "").trim().toUpperCase();
  if (!code) return alert("Bitte einen Code eingeben");

  const validCodes = [
    "FERDIHATEINENKLEINEN",
    "MOMO1M",
    "1000000",
    "1M",
    "LIFEOS",
    "ROBOT",
    "TEST",
    "COINS",
    "MOMO",
    "CHEAT",
    "1000000COINS",
  ];
  if (
    validCodes.includes(code) ||
    code.includes("1000000") ||
    code.includes("1M")
  ) {
    let usedCodes = load("redeemed-promo-codes", []);
    if (usedCodes.includes(code)) {
      return alert("Diesen Code hast du bereits eingelöst!");
    }
    usedCodes.push(code);
    save("redeemed-promo-codes", usedCodes);

    if (code === "FERDIHATEINENKLEINEN") {
      save("lifeos:infinite-coins", true);
      save("coins", 99999999);
      updateCoinsUI();
      if (inp) inp.value = "";
      try {
        SFX.unlock();
        SFX.coin();
      } catch (e) {}
      launchConfetti();
      if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100]);

      openModalHTML(`
        <div class="text-center py-6">
          <p class="font-mono text-[11px] tracking-widest text-[#FBBF24] font-bold">LEGENDÄRER CODE EINGELÖST</p>
          <h3 class="font-display text-[28px] font-bold mt-2 text-[var(--text)]">∞ UNENDLICH COINS</h3>
          <p class="text-[13px] mt-2 text-[var(--text-2)]">Du hast unendlich Coins freigeschaltet! Dein Kontostand verringert sich beim Öffnen von Boxen nie wieder.</p>
          <button type="button" onclick="closeModal()" class="btn-primary mt-6 !bg-[var(--text)] !text-[var(--bg)] font-bold">Mega!</button>
        </div>
      `);
      return;
    }

    addCoins(1000000);
    if (inp) inp.value = "";
    try {
      SFX.unlock();
      SFX.coin();
    } catch (e) {}
    launchConfetti();
    if (navigator.vibrate) navigator.vibrate([40, 50, 40, 50, 60]);

    openModalHTML(`
      <div class="text-center py-6">
        <p class="font-mono text-[11px] tracking-widest text-[#4ADE80] font-bold">CODE ERFOLGREICH EINGELÖST</p>
        <h3 class="font-display text-[28px] font-bold mt-2 text-[var(--text)]">+1.000.000 Coins</h3>
        <p class="text-[13px] mt-2 text-[var(--text-2)]">Dir wurden 1.000.000 Coins gutgeschrieben. Viel Spaß im Shop!</p>
        <button type="button" onclick="closeModal()" class="btn-primary mt-6 !bg-[var(--text)] !text-[var(--bg)] font-bold">Genial!</button>
      </div>
    `);
  } else {
    try {
      SFX.error();
    } catch (e) {}
    alert("Ungültiger Code.");
  }
}

// Calculate weighted subject average based on categories (Notenstände & Verrechnungsfaktoren)
function calcFachAverage(f) {
  if (!f || !f.history || !f.history.length) return null;
  const kats =
    f.kategorien && f.kategorien.length
      ? f.kategorien
      : [
          { id: "cat-1", name: "Schriftlich", weight: 2 },
          { id: "cat-2", name: "Mündlich", weight: 1 },
        ];

  let totalWeight = 0;
  let weightedSum = 0;
  let hasAnyCatAvg = false;

  kats.forEach((kat) => {
    const notes = (f.history || []).filter((h) => {
      const hCat = h.catId || kats[0].id;
      return hCat === kat.id && h.value !== null && !isNaN(h.value);
    });
    if (notes.length > 0) {
      const catAvg = notes.reduce((a, b) => a + b.value, 0) / notes.length;
      const w = parseFloat(kat.weight) || 1;
      weightedSum += catAvg * w;
      totalWeight += w;
      hasAnyCatAvg = true;
    }
  });

  if (!hasAnyCatAvg || totalWeight === 0) {
    const vals = (f.history || [])
      .map((h) => h.value)
      .filter((v) => v !== null && !isNaN(v) && v >= 1 && v <= 6);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  return weightedSum / totalWeight;
}

function renderSchool() {
  let faecher = load(
    "schule-faecher",
    DEFAULT_FAECHER.map((n) => ({
      name: n,
      icon: window.SchoolIcons?.guess(n) || "general",
      notenStr: "",
      history: [],
      kategorien: [
        { id: "cat-1", name: "Schriftlich", weight: 2 },
        { id: "cat-2", name: "Mündlich", weight: 1 },
      ],
    })),
  );
  faecher = faecher.map((f) => {
    if (!f.icon) f.icon = window.SchoolIcons?.guess(f.name) || "general";
    if (!f.kategorien || !f.kategorien.length) {
      f.kategorien = [
        { id: "cat-1", name: "Schriftlich", weight: 2 },
        { id: "cat-2", name: "Mündlich", weight: 1 },
      ];
    }
    if (!f.history) {
      const parts = (f.notenStr || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      f.history = parts.map((p, i) => ({
        date: new Date(Date.now() - (parts.length - i) * 86400000 * 7)
          .toISOString()
          .slice(0, 10),
        noteStr: p,
        value: parseNote(p),
        catId: "cat-1",
        ts: Date.now() + i,
      }));
    }
    return f;
  });
  save("schule-faecher", faecher);

  const tbody = document.getElementById("schule-body");
  if (tbody) {
    tbody.innerHTML = "";
    faecher.forEach((f, i) => {
      const avg = calcFachAverage(f);
      const col = SUBJECT_COLORS[i % SUBJECT_COLORS.length];

      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-[var(--surface-2)] transition-colors";
      tr.style.borderColor = "var(--border-soft)";
      tr.onclick = () => openSubjectDetail(i);

      const notesBadges =
        f.history && f.history.length
          ? f.history
              .map((h) => {
                const kat = (f.kategorien || []).find(
                  (k) => k.id === (h.catId || "cat-1"),
                ) || { name: "Schriftlich" };
                return `<span class="inline-block px-2 py-0.5 m-0.5 rounded-[6px] font-bold text-[11px] bg-[var(--surface-3)] text-[var(--text)] border border-[var(--border)]" title="${escapeHtml(kat.name)}">${escapeHtml(h.noteStr)}</span>`;
              })
              .join("")
          : `<span class="opacity-60 italic text-[11px]" style="color:var(--text-2)">Noch keine Note</span>`;

      const avgBadgeStyle =
        avg == null
          ? "background:#2A2A2A; color:#A0A0A0;"
          : avg <= 2.0
            ? "background:rgba(52,211,153,0.2); color:#34D399; border:1px solid rgba(52,211,153,0.4);"
            : avg <= 3.5
              ? "background:rgba(251,191,36,0.2); color:#FBBF24; border:1px solid rgba(251,191,36,0.4);"
              : "background:rgba(248,113,113,0.2); color:#F87171; border:1px solid rgba(248,113,113,0.4);";

      tr.innerHTML = `
        <td class="py-3">
          <div class="flex items-center gap-2">
            <button type="button" onclick="event.stopPropagation();openSubjectIconModal(${i})" class="shrink-0 rounded-[10px]" title="Fachsymbol auswählen">${window.SchoolIcons?.svg(f.icon || window.SchoolIcons?.guess(f.name)) || ""}</button>
            <input value="${escapeHtml(f.name)}" onclick="event.stopPropagation()" onchange="updateFachName(${i}, this.value)" class="bg-transparent font-bold outline-none w-full text-[13px] sm:text-[14px] text-[var(--text)]">
          </div>
        </td>
        <td onclick="event.stopPropagation()" class="py-2">
          <div class="flex flex-wrap items-center max-w-[240px]">${notesBadges}</div>
        </td>
        <td class="text-center py-2">
          <span class="px-2.5 py-1 rounded-[8px] font-bold text-[12px]" style="${avgBadgeStyle}" title="Gewichteter Gesamtdurchschnitt">${avg !== null ? avg.toFixed(2) : "-"}</span>
        </td>
        <td class="text-right py-2 whitespace-nowrap">
          <button onclick="event.stopPropagation(); openAddNoteModal(${i})" class="btn-ghost !py-1 !px-2 !text-[11px] mr-1 font-bold" title="Note zu ${escapeHtml(f.name)} eintragen">+ Note</button>
          <button onclick="event.stopPropagation(); removeFach(${i})" class="w-6 h-6 rounded-full hover:text-red-500" style="color:var(--text-2)" title="Fach löschen">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderSchoolStats();
  renderSchoolSingleCharts();

  if (typeof Chart === "undefined") return;
  const mainCanvas = document.getElementById("chart-schule");
  const ctx = prepareSchoolCanvas(
    mainCanvas,
    window.innerWidth <= 700 ? 240 : 280,
  );
  if (!ctx) return;

  const datasets = faecher
    .map((f, idx) => {
      const col = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
      const dataPts = (f.history || [])
        .map((h) => h.value)
        .filter((v) => v !== null && !isNaN(v) && v >= 1 && v <= 6);
      return {
        label: f.name,
        data: dataPts,
        borderColor: col,
        backgroundColor: col + "22",
        fill: false,
        tension: 0.2,
        cubicInterpolationMode: "monotone",
        spanGaps: false,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: col,
        pointBorderColor: "#1d1d1f",
        pointBorderWidth: 1,
      };
    })
    .filter((d) => d.data.length > 0);

  const maxLen = datasets.length
    ? Math.max(...datasets.map((d) => d.data.length))
    : 0;
  const chartLabels = Array.from({ length: maxLen }, (_, i) => `#${i + 1}`);

  if (window.chartSchule?.canvas === ctx.canvas) {
    window.chartSchule.data.labels = chartLabels;
    window.chartSchule.data.datasets = datasets;
    window.chartSchule.update("none");
    return;
  }
  try {
    window.chartSchule?.destroy();
  } catch (error) {}

  window.chartSchule = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets,
    },
    options: {
      responsive: false,
      animation: false,
      normalized: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#F5F5F5",
            font: { size: 12, weight: "600" },
            usePointStyle: true,
            boxWidth: 8,
          },
        },
      },
      scales: {
        y: {
          min: 1,
          max: 6,
          reverse: true, // INVERTED SCALE: 1 AT TOP, 6 AT BOTTOM
          ticks: {
            stepSize: 1,
            color: "#B8B8B8",
            font: { size: 12, weight: "600" },
          },
          grid: { color: "rgba(255,255,255,0.08)" },
        },
        x: {
          ticks: { color: "#8C8C8C", font: { size: 11, weight: "600" } },
          grid: { display: false },
        },
      },
    },
  });
}

function renderSchoolStats() {
  let faecher = load("schule-faecher", []);
  const container = document.getElementById("schule-stats");
  if (!container) return;
  let allVals = [];
  faecher.forEach((f) => {
    (f.history || []).forEach((h) => {
      if (h.value !== null && !isNaN(h.value)) allVals.push(h.value);
    });
  });
  const avg = allVals.length
    ? (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(2)
    : "-";
  const best = allVals.length ? Math.min(...allVals).toFixed(1) : "-";
  const worst = allVals.length ? Math.max(...allVals).toFixed(1) : "-";
  container.innerHTML = `
    <div class="stat-card"><p class="stat-label" style="color:var(--text-2)">GESAMT Ø</p><p class="stat-value text-[var(--text)]">${avg}</p></div>
    <div class="stat-card"><p class="stat-label" style="color:var(--text-2)">BESTE NOTE</p><p class="stat-value text-[var(--text)]">${best}</p></div>
    <div class="stat-card"><p class="stat-label" style="color:var(--text-2)">SCHLECHTESTE</p><p class="stat-value text-[var(--text)]">${worst}</p></div>
    <div class="stat-card"><p class="stat-label" style="color:var(--text-2)">FÄCHER</p><p class="stat-value text-[var(--text)]">${faecher.length}</p></div>
  `;
}

function renderSchoolSingleCharts() {
  const container = document.getElementById("schule-single-charts-grid");
  if (!container) return;
  (window.schoolSingleCharts || []).forEach((chart) => {
    try {
      chart.destroy();
    } catch (error) {}
  });
  window.schoolSingleCharts = [];
  window.schoolSingleRenderToken = (window.schoolSingleRenderToken || 0) + 1;
  const renderToken = window.schoolSingleRenderToken;
  const faecher = load("schule-faecher", []);
  if (!faecher.length) {
    container.innerHTML = `<p class="text-[13px] text-[var(--text-2)] italic col-span-full">Noch keine Fächer angelegt.</p>`;
    return;
  }

  container.innerHTML = faecher
    .map((f, idx) => {
      const avgVal = calcFachAverage(f);
      const avg = avgVal !== null ? avgVal.toFixed(2) : "-";
      const col = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];

      const avgBadgeStyle =
        avg === "-"
          ? "background:#2A2A2A; color:#A0A0A0;"
          : parseFloat(avg) <= 2.0
            ? "background:rgba(52,211,153,0.2); color:#34D399; border:1px solid rgba(52,211,153,0.4);"
            : parseFloat(avg) <= 3.5
              ? "background:rgba(251,191,36,0.2); color:#FBBF24; border:1px solid rgba(251,191,36,0.4);"
              : "background:rgba(248,113,113,0.2); color:#F87171; border:1px solid rgba(248,113,113,0.4);";

      return `
      <div class="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            ${window.SchoolIcons?.svg(f.icon || window.SchoolIcons?.guess(f.name)) || ""}
            <h4 class="font-display font-bold text-[16px] text-[var(--text)]">${escapeHtml(f.name)}</h4>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-[8px] font-bold text-[12px]" style="${avgBadgeStyle}" title="Gewichteter Schnitt">Ø ${avg}</span>
            <button onclick="openAddNoteModal(${idx})" class="btn-ghost !py-1 !px-2.5 !text-[11px] font-bold">+ Note</button>
          </div>
        </div>
        <div class="h-[160px] w-full">
          <canvas id="single-chart-fach-${idx}" height="160"></canvas>
        </div>
      </div>
    `;
    })
    .join("");

  setTimeout(() => {
    if (
      typeof Chart === "undefined" ||
      renderToken !== window.schoolSingleRenderToken
    )
      return;
    faecher.forEach((f, idx) => {
      const singleCanvas = document.getElementById(`single-chart-fach-${idx}`);
      const ctx = prepareSchoolCanvas(
        singleCanvas,
        window.innerWidth <= 700 ? 170 : 180,
      );
      if (!ctx) return;
      const col = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
      const validHistory = (f.history || []).filter(
        (entry) =>
          entry.value !== null &&
          !isNaN(entry.value) &&
          entry.value >= 1 &&
          entry.value <= 6,
      );
      const dataPts = validHistory.map((entry) => entry.value);
      const labels = validHistory.map(
        (entry, i) => entry.noteStr || `#${i + 1}`,
      );

      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels.length ? labels : ["-"],
          datasets: [
            {
              label: f.name,
              data: dataPts.length ? dataPts : [],
              borderColor: col,
              backgroundColor: col + "22",
              fill: true,
              tension: 0.2,
              cubicInterpolationMode: "monotone",
              spanGaps: false,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: col,
              pointBorderColor: "#1d1d1f",
              pointBorderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          animation: false,
          normalized: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 1,
              max: 6,
              reverse: true, // INVERTED SCALE: 1 AT TOP, 6 AT BOTTOM
              ticks: {
                stepSize: 1,
                color: "#A0A0A0",
                font: { size: 11, weight: "600" },
              },
              grid: { color: "rgba(255,255,255,0.06)" },
            },
            x: {
              ticks: {
                color: "#888888",
                font: { size: 11, weight: "600" },
              },
              grid: { display: false },
            },
          },
        },
      });
      window.schoolSingleCharts.push(chart);
    });
  }, 50);
}

// Subject Detail Modal with Notenstände (Categories & Weighting)
function openSubjectDetail(idx) {
  try {
    window.subjectChart?.destroy();
  } catch (error) {}
  window.subjectChart = null;
  let faecher = load("schule-faecher", []);
  const f = faecher[idx];
  if (!f) return;

  if (!f.kategorien || !f.kategorien.length) {
    f.kategorien = [
      { id: "cat-1", name: "Schriftlich", weight: 2 },
      { id: "cat-2", name: "Mündlich", weight: 1 },
    ];
    save("schule-faecher", faecher);
  }

  const avgVal = calcFachAverage(f);
  const avg = avgVal !== null ? avgVal.toFixed(2) : "-";

  let totalActiveWeight = 0;
  f.kategorien.forEach((k) => {
    const hasNotes = (f.history || []).some(
      (h) =>
        (h.catId || f.kategorien[0].id) === k.id &&
        h.value !== null &&
        !isNaN(h.value),
    );
    if (hasNotes) totalActiveWeight += parseFloat(k.weight) || 1;
  });

  const katsHtml = f.kategorien
    .map((k) => {
      const notes = (f.history || []).filter(
        (h) =>
          (h.catId || f.kategorien[0].id) === k.id &&
          h.value !== null &&
          !isNaN(h.value),
      );
      const catAvg = notes.length
        ? notes.reduce((a, b) => a + b.value, 0) / notes.length
        : null;
      const w = parseFloat(k.weight) || 1;
      const sharePct =
        notes.length && totalActiveWeight > 0
          ? Math.round((w / totalActiveWeight) * 100)
          : 0;

      return `
      <div class="p-3.5 rounded-[16px] bg-[var(--surface)] border border-[var(--border)] mb-3">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="font-display font-bold text-[15px] text-[var(--text)]">${escapeHtml(k.name)}</span>
            <span class="px-2 py-0.5 rounded-full font-mono text-[11px] bg-[var(--surface-3)] text-[var(--accent)] font-bold">Gewicht: ${w}x (${sharePct}%)</span>
            <span class="font-mono text-[13px] text-[var(--text)] font-bold">Ø ${catAvg !== null ? catAvg.toFixed(2) : "-"}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="openEditKategorieModal(${idx}, '${k.id}')" class="btn-ghost !py-1 !px-2.5 !text-[11px] font-bold" title="Gewichtung / Name bearbeiten">✎ Gewichtung</button>
            <button onclick="deleteKategorie(${idx}, '${k.id}')" class="w-6 h-6 rounded-full hover:text-red-500 text-[var(--text-2)]" title="Notenstand löschen">✕</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5 mt-2">
          ${
            notes
              .map(
                (h) => `
            <span class="inline-flex items-center px-2.5 py-1 rounded-[8px] font-bold text-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]">
              ${escapeHtml(h.noteStr)}
              <button onclick="removeNoteByTs(${idx}, ${h.ts || 0}, ${escapeHtml(JSON.stringify(String(h.noteStr || "")))})" class="ml-1.5 opacity-60 hover:opacity-100 hover:text-red-500">✕</button>
            </span>
          `,
              )
              .join("") ||
            '<span class="opacity-50 italic text-[11px]" style="color:var(--text-2)">Noch keine Noten in diesem Notenstand</span>'
          }
        </div>
      </div>
    `;
    })
    .join("");

  openModalHTML(
    `
    <div class="flex justify-between items-start">
      <div>
        <p class="font-mono text-[10px] opacity-80" style="color:var(--text-2)">FACH • ${(f.history || []).length} NOTEN GESAMT</p>
        <h3 class="font-display text-[24px] font-bold leading-[0.9] mt-0.5 text-[var(--text)]">${escapeHtml(f.name)}</h3>
        <p class="font-mono text-[12px] mt-1.5 opacity-90 text-[var(--accent)] font-bold">Gewichteter Gesamt-Ø: ${avg}</p>
      </div>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>

    <!-- NOTENSTÄNDE & GEWICHTUNGEN (VERRECHNUNG) -->
    <div class="mt-4">
      <div class="flex justify-between items-center mb-2.5">
        <h4 class="font-display font-bold text-[16px] text-[var(--text)]">Notenstände & Gewichtung (Verrechnung)</h4>
        <button onclick="openAddKategorieModal(${idx})" class="btn-primary-green !py-1.5 !px-3 !text-[11px] font-bold">+ Notenstand</button>
      </div>
      <div>${katsHtml}</div>
    </div>

    <div class="mt-4 surface-2 !p-3 !rounded-[16px]"><div class="school-chart-detail"><canvas id="subjectChart"></canvas></div></div>

    <!-- ADD NOTE BUTTON IN MODAL -->
    <div class="mt-4 pt-3 border-t border-[var(--border-soft)]">
      <button onclick="openAddNoteModal(${idx})" class="w-full btn-primary !py-2.5 !bg-[var(--text)] !text-[var(--bg)] font-bold">+ Neue Note für "${escapeHtml(f.name)}" eintragen</button>
    </div>
  `,
    () => {
      if (typeof Chart === "undefined") return;
      const subjectCanvas = document.getElementById("subjectChart");
      const ctx = prepareSchoolCanvas(
        subjectCanvas,
        window.innerWidth <= 700 ? 190 : 220,
      );
      if (!ctx) return;
      const filtered = (f.history || []).filter(
        (entry) =>
          entry.value !== null &&
          !isNaN(entry.value) &&
          entry.value >= 1 &&
          entry.value <= 6,
      );
      window.subjectChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: filtered.map(
            (h) => (h.date ? h.date.slice(5) : "") + " " + h.noteStr,
          ),
          datasets: [
            {
              data: filtered.map((h) => h.value),
              borderColor: "#4ADE80",
              backgroundColor: "rgba(74,222,128,0.12)",
              fill: true,
              tension: 0.2,
              cubicInterpolationMode: "monotone",
              spanGaps: false,
              pointRadius: 4,
              pointBackgroundColor: "#4ADE80",
            },
          ],
        },
        options: {
          responsive: false,
          animation: false,
          normalized: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 1,
              max: 6,
              reverse: true, // INVERTED SCALE
              ticks: {
                stepSize: 1,
                color: "#B8B8B8",
                font: { size: 12, weight: "600" },
              },
              grid: { color: "rgba(255,255,255,0.08)" },
            },
            x: {
              ticks: {
                color: "#8C8C8C",
                font: { size: 11, weight: "600" },
                maxRotation: 40,
              },
              grid: { display: false },
            },
          },
        },
      });
    },
  );
}

function removeNoteByTs(fachIdx, ts, noteStr) {
  let faecher = load("schule-faecher", []);
  const f = faecher[fachIdx];
  if (!f || !f.history) return;
  const idx = f.history.findIndex(
    (h) => (ts && h.ts === ts) || h.noteStr === noteStr,
  );
  if (idx >= 0) {
    f.history.splice(idx, 1);
    save("schule-faecher", faecher);
  }
  openSubjectDetail(fachIdx);
  renderSchool();
}

// Kategorie (Notenstand) Modals: Add, Edit, Delete
function openAddKategorieModal(fachIdx) {
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold text-[var(--text)]">Neuer Notenstand</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">NAME (Z.B. MÜNDLICH, SCHRIFTLICH, PRAKTISCH)</label>
        <input id="add-kat-name-input" placeholder="z.B. Mündlich, Praktisch, Ex" class="input-min font-bold w-full">
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">GEWICHTUNG / VERRECHNUNGSFAKTOR</label>
        <div class="flex gap-1.5 mb-2">
          ${["1", "2", "3", "0.5"]
            .map(
              (w) => `
            <button type="button" onclick="document.getElementById('add-kat-weight-input').value='${w}'" class="flex-1 py-1.5 rounded-[8px] font-bold bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors">${w}x</button>
          `,
            )
            .join("")}
        </div>
        <input id="add-kat-weight-input" type="number" step="0.1" value="1" placeholder="z.B. 1 oder 2" class="input-min font-bold w-full">
      </div>
      <button onclick="saveNewKategorie(${fachIdx})" class="w-full btn-primary mt-2 font-bold">+ Notenstand anlegen</button>
    </div>
  `);
  setTimeout(() => document.getElementById("add-kat-name-input")?.focus(), 100);
}

function saveNewKategorie(fachIdx) {
  const inp = document.getElementById("add-kat-name-input");
  const wInp = document.getElementById("add-kat-weight-input");
  const name = inp ? inp.value.trim() : "";
  const weight = parseFloat(wInp ? wInp.value : "1") || 1;
  if (!name) return alert("Bitte einen Namen für den Notenstand eingeben");
  let faecher = load("schule-faecher", []);
  const f = faecher[fachIdx];
  if (f) {
    f.kategorien = f.kategorien || [];
    f.kategorien.push({ id: "cat-" + Date.now(), name, weight });
    save("schule-faecher", faecher);
  }
  openSubjectDetail(fachIdx);
  renderSchool();
}

function openEditKategorieModal(fachIdx, catId) {
  let faecher = load("schule-faecher", []);
  const f = faecher[fachIdx];
  const kat = f ? (f.kategorien || []).find((k) => k.id === catId) : null;
  if (!kat) return;

  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold text-[var(--text)]">Gewichtung / Notenstand bearbeiten</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">NAME DES NOTENSTANDS</label>
        <input id="edit-kat-name-input" value="${escapeHtml(kat.name)}" class="input-min font-bold w-full">
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">GEWICHTUNG / VERRECHNUNGSFAKTOR (Z.B. 2 FÜR 2x)</label>
        <div class="flex gap-1.5 mb-2">
          ${["1", "2", "3", "0.5"]
            .map(
              (w) => `
            <button type="button" onclick="document.getElementById('edit-kat-weight-input').value='${w}'" class="flex-1 py-1.5 rounded-[8px] font-bold bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors">${w}x</button>
          `,
            )
            .join("")}
        </div>
        <input id="edit-kat-weight-input" type="number" step="0.1" value="${kat.weight}" class="input-min font-bold w-full">
      </div>
      <button onclick="saveEditKategorie(${fachIdx}, '${catId}')" class="w-full btn-primary mt-2 font-bold">Speichern & neu verrechnen</button>
    </div>
  `);
  setTimeout(
    () => document.getElementById("edit-kat-name-input")?.focus(),
    100,
  );
}

function saveEditKategorie(fachIdx, catId) {
  const inp = document.getElementById("edit-kat-name-input");
  const wInp = document.getElementById("edit-kat-weight-input");
  const name = inp ? inp.value.trim() : "";
  const weight = parseFloat(wInp ? wInp.value : "1") || 1;
  if (!name) return alert("Bitte einen Namen eingeben");
  let faecher = load("schule-faecher", []);
  const f = faecher[fachIdx];
  const kat = f ? (f.kategorien || []).find((k) => k.id === catId) : null;
  if (kat) {
    kat.name = name;
    kat.weight = weight;
    save("schule-faecher", faecher);
  }
  openSubjectDetail(fachIdx);
  renderSchool();
}

function deleteKategorie(fachIdx, catId) {
  if (!confirm("Diesen Notenstand wirklich löschen?")) return;
  let faecher = load("schule-faecher", []);
  const f = faecher[fachIdx];
  if (f && f.kategorien) {
    if (f.kategorien.length <= 1)
      return alert("Mindestens ein Notenstand muss erhalten bleiben.");
    f.kategorien = f.kategorien.filter((k) => k.id !== catId);
    save("schule-faecher", faecher);
  }
  openSubjectDetail(fachIdx);
  renderSchool();
}

// Add Note Modal with Subject and Kategorie selector
function openAddNoteModal(defaultFachIdx = 0) {
  let faecher = load(
    "schule-faecher",
    DEFAULT_FAECHER.map((n) => ({
      name: n,
      icon: window.SchoolIcons?.guess(n) || "general",
      notenStr: "",
      history: [],
      kategorien: [
        { id: "cat-1", name: "Schriftlich", weight: 2 },
        { id: "cat-2", name: "Mündlich", weight: 1 },
      ],
    })),
  );
  const initialFach = faecher[defaultFachIdx] || faecher[0];
  const initialKats =
    initialFach && initialFach.kategorien && initialFach.kategorien.length
      ? initialFach.kategorien
      : [
          { id: "cat-1", name: "Schriftlich", weight: 2 },
          { id: "cat-2", name: "Mündlich", weight: 1 },
        ];

  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold text-[var(--text)]">Neue Note eintragen</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">1. FACH AUSWÄHLEN</label>
        <select id="add-note-fach-select" onchange="updateAddNoteCatSelect(this.value)" class="input-min font-bold w-full text-[14px]">
          ${faecher.map((f, i) => `<option value="${i}" ${i === defaultFachIdx ? "selected" : ""}>${escapeHtml(f.name)}</option>`).join("")}
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">2. NOTENSTAND / KATEGORIE (GEWICHTUNG)</label>
        <select id="add-note-cat-select" class="input-min font-bold w-full text-[14px]">
          ${initialKats.map((k) => `<option value="${k.id}">${escapeHtml(k.name)} (Gewicht: ${k.weight}x)</option>`).join("")}
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">3. NOTE (1 – 6)</label>
        <div class="flex gap-1.5 mb-2">
          ${["1", "2", "3", "4", "5", "6"]
            .map(
              (n) => `
            <button type="button" onclick="document.getElementById('add-note-val-input').value='${n}'" class="flex-1 py-2 rounded-[10px] font-bold bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors">${n}</button>
          `,
            )
            .join("")}
        </div>
        <input id="add-note-val-input" placeholder="z.B. 1, 2+, 3-, 1.5" class="input-min font-bold w-full text-[15px]">
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">4. DATUM</label>
        <input id="add-note-date-input" type="date" value="${new Date().toISOString().slice(0, 10)}" class="input-min font-bold w-full text-[14px]">
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">5. NOTIZ / ART (OPTIONAL)</label>
        <input id="add-note-art-input" placeholder="z.B. Schulaufgabe, Ex, Test, Mündlich" class="input-min font-bold w-full text-[14px]">
      </div>
      <button onclick="saveNewNoteFromModal()" class="w-full btn-primary mt-2 font-bold">+ Note speichern</button>
    </div>
  `);
  setTimeout(() => document.getElementById("add-note-val-input")?.focus(), 100);
}

function updateAddNoteCatSelect(fachIdxStr) {
  const idx = parseInt(fachIdxStr, 10) || 0;
  let faecher = load("schule-faecher", []);
  const f = faecher[idx];
  const kats =
    f && f.kategorien && f.kategorien.length
      ? f.kategorien
      : [
          { id: "cat-1", name: "Schriftlich", weight: 2 },
          { id: "cat-2", name: "Mündlich", weight: 1 },
        ];
  const catSelect = document.getElementById("add-note-cat-select");
  if (catSelect) {
    catSelect.innerHTML = kats
      .map(
        (k) =>
          `<option value="${k.id}">${escapeHtml(k.name)} (Gewicht: ${k.weight}x)</option>`,
      )
      .join("");
  }
}

function saveNewNoteFromModal() {
  const fSelect = document.getElementById("add-note-fach-select");
  const catSelect = document.getElementById("add-note-cat-select");
  const valInput = document.getElementById("add-note-val-input");
  const dateInput = document.getElementById("add-note-date-input");
  const artInput = document.getElementById("add-note-art-input");
  const strVal = valInput ? valInput.value.trim() : "";
  if (!strVal) return alert("Bitte eine Note eingeben (z.B. 1, 2+, 3-)");
  const parsed = parseNote(strVal);
  if (parsed === null || isNaN(parsed) || parsed < 0.5 || parsed > 6.5) {
    return alert("Bitte eine gültige Note zwischen 1 und 6 eingeben");
  }

  let faecher = load("schule-faecher", []);
  const idx = fSelect ? parseInt(fSelect.value, 10) : 0;
  if (faecher[idx]) {
    faecher[idx].history = faecher[idx].history || [];
    const chosenCatId =
      catSelect && catSelect.value
        ? catSelect.value
        : faecher[idx].kategorien?.[0]?.id || "cat-1";
    faecher[idx].history.push({
      date: dateInput ? dateInput.value : new Date().toISOString().slice(0, 10),
      noteStr: strVal,
      value: parsed,
      catId: chosenCatId,
      art: artInput ? artInput.value.trim() : "",
      ts: Date.now(),
    });
    save("schule-faecher", faecher);
  }
  closeModal();
  renderSchool();
}

function openSubjectIconModal(fachIdx) {
  const faecher = load("schule-faecher", []);
  const fach = faecher[fachIdx];
  if (!fach) return;
  const selected = fach.icon || window.SchoolIcons?.guess(fach.name) || "general";
  openModalHTML(`
    <div class="flex justify-between items-center"><div><p class="font-mono text-[9px] opacity-60">FACH-SYMBOL</p><h3 class="font-display text-[20px] font-bold">${escapeHtml(fach.name)}</h3></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-4">${window.SchoolIcons?.picker("edit-fach-icon", selected) || ""}</div>
    <button onclick="saveSubjectIcon(${fachIdx})" class="w-full btn-primary mt-4">Symbol speichern</button>`);
}

function saveSubjectIcon(fachIdx) {
  const faecher = load("schule-faecher", []);
  if (!faecher[fachIdx]) return;
  faecher[fachIdx].icon =
    document.getElementById("edit-fach-icon-subject-icon")?.value || "general";
  save("schule-faecher", faecher);
  closeModal();
  renderSchool();
}

function openAddFachModal() {
  openModalHTML(`
    <div class="flex justify-between items-center">
      <h3 class="font-display text-[20px] font-bold text-[var(--text)]">Neues Fach hinzufügen</h3>
      <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button>
    </div>
    <div class="mt-4 space-y-3">
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">NAME DES FACHS</label>
        <input id="add-fach-name-input" placeholder="z.B. Geschichte, Chemie, Physik" class="input-min font-bold w-full">
      </div>
      <div>
        <label class="block text-[11px] font-mono opacity-80 mb-1" style="color:var(--text-2)">SVG-SYMBOL AUSWÄHLEN</label>
        ${window.SchoolIcons?.picker("add-fach", "general") || ""}
      </div>
      <button onclick="saveNewFachFromModal()" class="w-full btn-primary mt-2 font-bold">+ Fach anlegen</button>
    </div>
  `);
  setTimeout(
    () => document.getElementById("add-fach-name-input")?.focus(),
    100,
  );
}

function saveNewFachFromModal() {
  const inp = document.getElementById("add-fach-name-input");
  const name = inp ? inp.value.trim() : "";
  if (!name) return alert("Bitte einen Fachnamen eingeben");
  let faecher = load("schule-faecher", []);
  if (faecher.some((f) => f.name.toLowerCase() === name.toLowerCase()))
    return alert("Fach existiert bereits");
  faecher.push({
    name,
    icon:
      document.getElementById("add-fach-subject-icon")?.value ||
      window.SchoolIcons?.guess(name) ||
      "general",
    notenStr: "",
    history: [],
    kategorien: [
      { id: "cat-1", name: "Schriftlich", weight: 2 },
      { id: "cat-2", name: "Mündlich", weight: 1 },
    ],
  });
  save("schule-faecher", faecher);
  closeModal();
  renderSchool();
}

function updateFachName(i, v) {
  let f = load("schule-faecher", []);
  f[i].name = v;
  if (!f[i].icon || f[i].icon === "general")
    f[i].icon = window.SchoolIcons?.guess(v) || "general";
  save("schule-faecher", f);
  renderSchool();
  renderSchoolStats();
}
function removeFach(i) {
  if (!confirm("Fach löschen?")) return;
  let f = load("schule-faecher", []);
  f.splice(i, 1);
  save("schule-faecher", f);
  renderSchool();
  renderSchoolStats();
}

