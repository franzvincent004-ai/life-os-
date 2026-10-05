// ==================== 05.14 · EXTREM SCHWERES XP-RANGSYSTEM ====================
const RANK_TIERS = [
  { stars: 0, title: "Unranked", min: 0, color: "#AAB2C0", icon: "○" },
  { stars: 1, title: "Bronze", min: 2500, color: "#CD7F32", icon: "◇" },
  { stars: 2, title: "Silver", min: 8000, color: "#C0C0C0", icon: "◇" },
  { stars: 3, title: "Gold", min: 20000, color: "#FBBF24", icon: "★" },
  { stars: 4, title: "Platinum", min: 45000, color: "#67E8F9", icon: "★" },
  { stars: 5, title: "Diamond", min: 90000, color: "#38BDF8", icon: "✦" },
  { stars: 5, title: "Elite", min: 160000, color: "#A78BFA", icon: "✦" },
  { stars: 5, title: "Master", min: 260000, color: "#F472B6", icon: "♛" },
  { stars: 5, title: "Legend", min: 400000, color: "#FB7185", icon: "♛" },
  { stars: 5, title: "Mythic", min: 600000, color: "#E879F9", icon: "◈" },
];

function calcStreak(entries) {
  if (!entries.length) return 0;
  const days = new Set(entries.map((entry) => entry.date));
  let cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  const format = (date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  if (!days.has(format(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(format(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function calcRankPoints(entries) {
  const list = entries || [];
  const scores = list.map((entry) =>
    Math.max(0, Math.min(100, Number(entry.score) || 0)),
  );
  const xp = Math.max(0, Math.round(getBonusXp()));
  const avg = scores.length
    ? scores.reduce((sum, value) => sum + value, 0) / scores.length
    : 0;
  return {
    rp: xp,
    xp,
    avg,
    streak: calcStreak(list),
    days: list.length,
    perfects: scores.filter((score) => score >= 95).length,
  };
}

function getAccountRank(entries) {
  const stats = calcRankPoints(entries || migrateEntries());
  let tier = RANK_TIERS[0];
  for (const candidate of RANK_TIERS) {
    if (stats.xp >= candidate.min) tier = candidate;
  }
  const next = RANK_TIERS.find((candidate) => candidate.min > stats.xp) || null;
  const nextMin = next ? next.min : tier.min;
  const progress = next
    ? Math.min(
        100,
        Math.round(
          ((stats.xp - tier.min) / Math.max(1, nextMin - tier.min)) * 100,
        ),
      )
    : 100;
  return { ...stats, tier, next, progress };
}

function starsString(number) {
  return "★".repeat(number) + "☆".repeat(5 - number);
}

function updateRankUI() {
  const rank = getAccountRank();
  const stars = starsString(Math.min(5, rank.tier.stars || 0));
  const badge = document.getElementById("rank-stars");
  if (badge) {
    badge.textContent = `${rank.tier.icon || "○"} ${rank.tier.title}`;
    badge.style.color = rank.tier.color;
  }
  const big = document.getElementById("rank-stars-big");
  if (big) {
    big.textContent = stars;
    big.style.color = rank.tier.color;
  }
  const title = document.getElementById("rank-title");
  if (title) {
    title.textContent = rank.tier.title;
    title.style.color = rank.tier.color;
  }
  const points = document.getElementById("rank-points");
  if (points) points.textContent = `${rank.xp} XP`;
  const bar = document.getElementById("rank-bar");
  if (bar) {
    bar.style.width = `${rank.progress}%`;
    bar.style.background = `linear-gradient(90deg, ${rank.tier.color}, ${rank.next ? rank.next.color : rank.tier.color})`;
  }
  const next = document.getElementById("rank-next");
  if (next)
    next.textContent = rank.next
      ? `Nächster Rang · ${rank.next.title} ab ${rank.next.min.toLocaleString("de-DE")} XP`
      : "Max Rank · Mythic";
  try {
    updateYoGreeting(rank);
  } catch (error) {}
}

function updateYoGreeting(rank) {
  const element = document.getElementById("yo-greeting");
  if (!element) return;
  const name = getPlayerName() || "Pilot";
  element.innerHTML = `<span class="font-display font-bold text-[22px] sm:text-[26px]">Hallo, ${name}</span><p class="font-mono text-[11px] mt-1 opacity-60">${rank ? `${rank.tier.title} · ${rank.xp.toLocaleString("de-DE")} XP` : ""}</p>`;
}

function showRankDetails() {
  const rank = getAccountRank();
  const tiers = RANK_TIERS.map((tier) => {
    const active = tier.title === rank.tier.title;
    const unlocked = rank.xp >= tier.min;
    return `<div class="flex items-center justify-between py-2.5 px-3 rounded-xl mb-1" style="background:${active ? "var(--surface-2)" : "transparent"};border:1px solid ${active ? tier.color : "var(--border)"};opacity:${unlocked || active ? 1 : 0.42}"><div class="flex items-center gap-2.5"><span class="text-[14px]" style="color:${tier.color}">${tier.icon || "○"}</span><div><p class="font-bold text-[13px]" style="color:${active ? tier.color : "inherit"}">${tier.title}</p><p class="font-mono text-[9px] opacity-55">${tier.min.toLocaleString("de-DE")} XP</p></div></div>${active ? `<span class="font-mono text-[9px] font-bold" style="color:${tier.color}">AKTUELL</span>` : unlocked ? '<span class="font-mono text-[9px] opacity-50">✓</span>' : ""}</div>`;
  }).join("");
  openModalHTML(`
    <div><div class="flex justify-between items-start"><div><p class="font-mono text-[10px] tracking-widest opacity-55">XP RANK SYSTEM</p><h3 class="font-display text-[26px] font-bold mt-1" style="color:${rank.tier.color}">${rank.tier.title}</h3><p class="text-[15px] mt-1" style="color:${rank.tier.color}">${starsString(Math.min(5, rank.tier.stars))} · ${rank.xp.toLocaleString("de-DE")} XP</p></div><button type="button" onclick="closeModal()" class="w-8 h-8 rounded-full" style="background:var(--surface-2)">✕</button></div><div class="mt-4 h-2.5 rounded-full overflow-hidden" style="background:var(--surface-2)"><div class="h-full rounded-full transition-all" style="width:${rank.progress}%;background:linear-gradient(90deg,${rank.tier.color},${rank.next ? rank.next.color : rank.tier.color})"></div></div><p class="font-mono text-[10px] mt-1.5 opacity-55">${rank.next ? `${(rank.next.min - rank.xp).toLocaleString("de-DE")} XP bis ${rank.next.title}` : "Max Rank erreicht"}</p><div class="mt-4 p-3 rounded-[14px] text-[11px] leading-relaxed" style="background:var(--surface-2);border:1px solid var(--border)"><b>Extrem schweres Langzeitsystem:</b> XP gibt es ausschließlich für Tages-Scores ab 80 und echte Watch-Sleep-Scores ab 80. Challenges und Coins geben keine XP.</div><div class="grid grid-cols-2 gap-2 mt-3"><div class="p-3 rounded-2xl" style="background:var(--surface-2)"><p class="font-mono text-[9px] opacity-55">TOTAL XP</p><p class="font-display font-bold text-[20px] mt-1" style="color:#22D3EE">${rank.xp.toLocaleString("de-DE")}</p></div><div class="p-3 rounded-2xl" style="background:var(--surface-2)"><p class="font-mono text-[9px] opacity-55">STREAK</p><p class="font-display font-bold text-[20px] mt-1">${rank.streak}d</p></div><div class="p-3 rounded-2xl" style="background:var(--surface-2)"><p class="font-mono text-[9px] opacity-55">Ø TAGES-SCORE</p><p class="font-display font-bold text-[20px] mt-1">${Math.round(rank.avg || 0)}</p></div><div class="p-3 rounded-2xl" style="background:var(--surface-2)"><p class="font-mono text-[9px] opacity-55">95+ TAGE</p><p class="font-display font-bold text-[20px] mt-1">${rank.perfects}</p></div></div><p class="font-mono text-[10px] tracking-widest opacity-45 mt-5 mb-2">ALLE RÄNGE</p><div class="max-h-[260px] overflow-y-auto">${tiers}</div><button type="button" onclick="closeModal()" class="w-full btn-primary mt-4 !bg-white !text-black">Schließen</button></div>`,
  );
}
