// ==================== 05.10 · APP-START, SPLASH & NAVIGATION ====================
function getPlayerName() {
  return (load("player-name", "") || "").trim();
}
function setPlayerName(n) {
  save(
    "player-name",
    String(n || "")
      .trim()
      .slice(0, 18),
  );
  updatePlayerNameUI();
}
function updatePlayerNameUI() {
  const n = getPlayerName();
  const el = document.getElementById("header-player-name");
  if (el) el.textContent = n ? n : "";
  try {
    updateYoGreeting(getAccountRank());
  } catch (e) {}
}

function showAccountGate() {
  const gate = document.getElementById("account-gate");
  const splash = document.getElementById("splash");
  if (splash) {
    splash.classList.add("splash-exit");
    splash.style.pointerEvents = "none";
  }
  const show = () => {
    if (splash) {
      splash.style.display = "none";
      splash.classList.add("hidden");
    }
    if (gate) {
      gate.classList.remove("hidden");
      gate.style.display = "flex";
      gate.style.opacity = "1";
      setAccountGateMode(readLocalAccounts().length ? "login" : "create");
    }
  };
  setTimeout(show, splash ? 470 : 0);
}
function showNameGate() {
  const splash = document.getElementById("splash");
  if (splash) {
    splash.classList.add("splash-exit");
    splash.style.pointerEvents = "none";
    setTimeout(() => {
      splash.classList.add("hidden");
      splash.style.display = "none";
    }, 420);
  }
  document.getElementById("name-onboarding")?.remove();
  const gate = document.createElement("div");
  gate.id = "name-onboarding";
  gate.className = "name-onboarding";
  gate.innerHTML = `
    <section class="name-onboarding__card" role="dialog" aria-modal="true" aria-labelledby="name-onboarding-title">
      <div class="name-onboarding__mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13h3l2-5 4 10 2-5h5"/><path d="M12 22C6 18 3 14 3 9a5 5 0 019-3 5 5 0 019 3c0 5-3 9-9 13z"/></svg></div>
      <p>WILLKOMMEN</p>
      <h1 id="name-onboarding-title">Wie heißt du?</h1>
      <label for="name-onboarding-input">Dein Anzeigename</label>
      <input id="name-onboarding-input" maxlength="18" autocomplete="name" placeholder="Name eingeben">
      <span id="name-onboarding-error" role="alert"></span>
      <button type="button" onclick="submitPlayerName()">Weiter</button>
      <small>Kein Konto nötig. Deine Daten bleiben lokal auf diesem Gerät.</small>
    </section>`;
  document.body.appendChild(gate);
  const input = document.getElementById("name-onboarding-input");
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") submitPlayerName();
  });
  setTimeout(() => input?.focus(), 470);
}
function submitPlayerName() {
  const input = document.getElementById("name-onboarding-input");
  const value = String(input?.value || "").trim().slice(0, 18);
  const error = document.getElementById("name-onboarding-error");
  if (!value) {
    if (error) error.textContent = "Bitte gib deinen Namen ein.";
    input?.focus();
    return;
  }
  setPlayerName(value);
  save("name-onboarding-v1", true);
  const gate = document.getElementById("name-onboarding");
  gate?.classList.add("is-leaving");
  setTimeout(() => gate?.remove(), 260);
  enterApp();
}
async function startFromSplash() {
  await ensureDurableAccountsLoaded();
  const name = getPlayerName();
  const onboardingDone = load("name-onboarding-v1", false) === true;
  if (!name || (name === "Pilot" && !onboardingDone)) {
    showNameGate();
    return;
  }
  if (!onboardingDone) save("name-onboarding-v1", true);
  enterApp();
}

function enterApp() {
  try {
    try {
      SFX.unlock();
      SFX.enter();
    } catch (e) {}
    try {
      updatePlayerNameUI();
    } catch (e) {}
    const ng = document.getElementById("account-gate");
    if (ng) {
      ng.classList.add("hidden");
      ng.style.display = "none";
    }
    const splash = document.getElementById("splash");
    const app = document.getElementById("app");
    if (splash) {
      splash.classList.add("splash-exit");
      splash.style.pointerEvents = "none";
      setTimeout(() => {
        splash.classList.add("hidden");
        splash.style.display = "none";
      }, 700);
    }
    if (app) {
      app.classList.remove("hidden");
      app.style.display = "";
      app.style.opacity = "0";
      app.style.transform = "scale(0.97) translateY(12px)";
      app.style.transition =
        "opacity .55s ease, transform .55s cubic-bezier(0.16,1,0.3,1)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          app.style.opacity = "1";
          app.style.transform = "none";
        });
      });
    }
    setTimeout(() => {
      try {
        initApp();
      } catch (err) {
        console.error("initApp", err);
      }
    }, 80);
  } catch (e) {
    console.error("enterApp", e);
    const app = document.getElementById("app");
    const splash = document.getElementById("splash");
    if (splash) {
      splash.style.display = "none";
      splash.classList.add("hidden");
    }
    if (app) {
      app.classList.remove("hidden");
      app.style.display = "";
    }
    try {
      initApp();
    } catch (err) {
      console.error(err);
    }
  }
}
window.enterApp = enterApp;

// 05.10.1 · Automatische Opening-Sequenz
(function runOpeningSequence() {
  let played = false;
  async function play() {
    if (played) return;
    played = true;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const parts = document.getElementById("splash-particles");
    const flash = document.getElementById("splash-flash");
    if (parts) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("i");
        p.className = "splash-particle";
        p.style.left = 8 + Math.random() * 84 + "%";
        p.style.bottom = 8 + Math.random() * 40 + "%";
        p.style.animationDuration = 3.5 + Math.random() * 4 + "s";
        p.style.animationDelay = Math.random() * 1.4 + "s";
        parts.appendChild(p);
      }
    }
    await wait(620);
    if (flash) {
      flash.style.transition = "opacity .12s ease";
      flash.style.opacity = ".14";
      setTimeout(() => {
        flash.style.transition = "opacity .5s ease";
        flash.style.opacity = "0";
      }, 110);
    }
    await wait(1880);
    const hint = document.getElementById("splash-hint");
    if (hint) hint.textContent = "BEREIT";
    await wait(180);
    startFromSplash();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", play, { once: true });
  else play();
})();

function rarityLabel(r) {
  return r.toUpperCase();
}

function renderRobots() {
  updateCoinsUI();
  const owned = getOwned();
  const equipped = getEquipped();
  const eq = ALL_ROBOTS.find((r) => r.id === equipped) || ALL_ROBOTS[0];

  const prev = document.getElementById("equipped-preview");
  if (prev) {
    prev.innerHTML = robotAvatarSVG(eq, 72);
    prev.style.borderColor = eq.accent || "var(--border)";
    prev.style.background = "var(--surface-2)";
    prev.style.boxShadow = eq.glow ? `0 0 28px ${eq.accent}50` : "none";
    prev.style.padding = "4px";
  }
  const en = document.getElementById("equipped-name");
  if (en) en.textContent = eq.name;
  const er = document.getElementById("equipped-rarity");
  if (er) {
    er.textContent = rarityLabel(eq.rarity);
    er.style.color = RARITY_COLOR[eq.rarity];
  }
  const ed = document.getElementById("equipped-desc");
  if (ed) ed.textContent = eq.desc;

  const pg = document.getElementById("packs-grid");
  if (pg) {
    pg.innerHTML = PACKS.map(
      (p) => `
      <div class="bs-shop-card" style="--box-c1:${p.color};--box-c2:${p.color2};--box-accent:${p.accent};border-color:${p.color}55">
        <div class="lifeos-pack-art" data-tier="${p.tier}">
          <img src="${p.art}" alt="" width="220" height="180" loading="lazy">
          <span>DROP TIER ${p.tier}</span>
        </div>
        <p class="font-display font-bold text-[15px] text-center">${p.name}</p>
        <p class="text-[11px] text-center mt-0.5" style="color:var(--text-2)">${p.desc}</p>
        <div class="flex flex-wrap gap-1 mt-2 justify-center">
          ${Object.entries(p.odds)
            .map(
              ([r, v]) =>
                `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold" style="background:var(--surface-2);color:${RARITY_COLOR[r]}">${r.slice(0, 3).toUpperCase()} ${v}%</span>`,
            )
            .join("")}
        </div>
        <button type="button" onclick="openPack('${p.id}')" class="mt-3 w-full btn-primary !py-2.5 !text-[13px]" style="background:linear-gradient(180deg,${p.color},${p.color2});color:#fff;border:1.5px solid ${p.accent}66;box-shadow:0 4px 16px ${p.color}44">
          ${(getFreeBoxes()[p.id] || 0) > 0 ? "FREE ×" + getFreeBoxes()[p.id] : "Öffnen · ◆ " + p.price}
        </button>
      </div>
    `,
    ).join("");
  }

  const grid = document.getElementById("robots-grid");
  const cc = document.getElementById("collection-count");
  if (cc) cc.textContent = `${owned.length} / ${ALL_ROBOTS.length}`;
  if (grid) {
    const RARITY_RANK_MAP = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      mythic: 6,
    };

    const sortedRobots = [...ALL_ROBOTS].sort((a, b) => {
      const rA = RARITY_RANK_MAP[a.rarity] || 1;
      const rB = RARITY_RANK_MAP[b.rarity] || 1;
      if (rA !== rB) return rA - rB; // 1 (common) at top, 6 (mythic) at bottom!
      return a.name.localeCompare(b.name);
    });

    let html = "";
    let currentRarity = null;

    sortedRobots.forEach((r) => {
      if (r.rarity !== currentRarity) {
        currentRarity = r.rarity;
        const countInTier = sortedRobots.filter(
          (x) => x.rarity === currentRarity,
        ).length;
        const label = rarityLabel(currentRarity).toUpperCase();
        const col = RARITY_COLOR[currentRarity] || "#fff";
        html += `
          <div class="col-span-full mt-4 mb-1 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" style="background:${col}"></span>
              <h4 class="font-display font-bold text-[15px] tracking-wide" style="color:${col}">${label} SKINS (${countInTier})</h4>
            </div>
            <span class="font-mono text-[10px] text-[var(--text-2)]">${RARITY_CHANCE[currentRarity]}% Dropchance</span>
          </div>
        `;
      }

      const isOwned = owned.includes(r.id);
      const isEq = equipped === r.id;
      html += `
        <div class="stat-card !p-3 relative overflow-hidden robot-3d-card robot-card-shine" style="
          opacity:${isOwned ? 1 : 0.38};
          border-color:${isEq ? r.accent : "var(--border)"};
          ${r.glow && isOwned ? `box-shadow:0 0 18px ${r.accent}35` : ""};
        " onclick="${isOwned ? `equipRobot('${r.id}')` : `showLocked('${r.id}')`}">
          <div class="flex justify-between items-start">
            <div style="width:52px;height:52px;${isOwned ? "" : "filter:grayscale(1) brightness(0.5)"}">
              ${isOwned ? robotAvatarSVG(r, 52) : robotAvatarSVG({ ...r, c1: "#222", c2: "#111", accent: "#444", eye: "#111", metal: "#333" }, 52)}
            </div>
            <span class="font-mono text-[8px] px-1.5 py-0.5 rounded-full font-bold" style="color:${RARITY_COLOR[r.rarity]};background:var(--surface-2)">
              ${rarityLabel(r.rarity)}
            </span>
          </div>
          <p class="font-display font-bold text-[12px] mt-2 truncate">${r.name}</p>
          <p class="font-mono text-[9px] mt-0.5" style="color:var(--text-3)">${RARITY_CHANCE[r.rarity]}% Drop</p>
          ${isEq ? '<p class="font-mono text-[9px] mt-1 font-bold" style="color:#fff">● EQUIPPED</p>' : !isOwned ? '<p class="font-mono text-[9px] mt-1 opacity-40">LOCKED</p>' : ""}
        </div>
      `;
    });

    grid.innerHTML = html;
  }
}

function equipRobot(id) {
  setEquipped(id);
  try {
    SFX.equip();
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(15);
}

function showLocked(id) {
  const r = ALL_ROBOTS.find((x) => x.id === id);
  if (!r) return;
  openModalHTML(`
    <div class="text-center py-4">
      <div style="margin:0 auto 12px;width:80px;height:80px;filter:grayscale(1) brightness(0.55)">${robotAvatarSVG(r, 80)}</div>
      <h3 class="font-display text-[22px] font-bold">${r.name}</h3>
      <p class="font-mono text-[11px] mt-2" style="color:${RARITY_COLOR[r.rarity]}">${rarityLabel(r.rarity)} · ${RARITY_CHANCE[r.rarity]}% Dropchance</p>
      <p class="text-[13px] mt-3" style="color:var(--text-2)">${r.desc}</p>
      <p class="font-mono text-[11px] mt-4 opacity-50">Öffne Crates um ihn freizuschalten</p>
      <button type="button" onclick="closeModal()" class="btn-primary mt-5 !bg-white !text-black">Verstanden</button>
    </div>
  `);
}

function rollRarity(odds) {
  const entries = Object.entries(odds);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  let r = Math.random() * total;
  for (const [name, w] of entries) {
    r -= w;
    if (r <= 0) return name;
  }
  return entries[0][0];
}

function openPack(packId) {
  const pack = PACKS.find((p) => p.id === packId);
  if (!pack) return;

  // Free box from inventory? else pay coins
  const usedFree = useFreeBox(packId);
  if (!usedFree) {
    const coins = getCoins();
    if (coins < pack.price) {
      try {
        SFX.error();
      } catch (e) {}
      openModalHTML(
        `<div class="text-center py-6"><p class="font-display text-[20px] font-bold">Nicht genug Coins</p><p class="mt-2 text-[13px]" style="color:var(--text-2)">Du brauchst ◆ ${pack.price}</p><button onclick="closeModal()" class="btn-primary mt-5 !bg-white !text-black">OK</button></div>`,
      );
      return;
    }
    setCoins(coins - pack.price);
  }
  try {
    SFX.unlock();
    SFX.packShake();
  } catch (e) {}

  const owned = getOwned();
  const rarityGlow = {
    common: "#9CA3AF",
    uncommon: "#34D399",
    rare: "#60A5FA",
    epic: "#A78BFA",
    legendary: "#FBBF24",
    mythic: "#F472B6",
    coins: "#FBBF24",
    xp: "#22D3EE",
    box: "#E879F9",
  };
  const order = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

  // ===== SINGLE DROP =====
  // Odds: robot (main), rare coins, rarer XP, very rare other boxes
  const roll = Math.random();
  let result;

  // From higher tier packs, slightly better special rates
  const boxChance =
    packId === "mythic" ? 0.06 : packId === "premium" ? 0.04 : 0.025; // other boxes
  const xpChance =
    packId === "mythic" ? 0.1 : packId === "premium" ? 0.07 : 0.05;
  const coinChance =
    packId === "mythic" ? 0.12 : packId === "premium" ? 0.1 : 0.08;

  if (roll < boxChance) {
    // Win another box (never the same tier only — can win any, weighted)
    let wonId;
    const r2 = Math.random();
    if (r2 < 0.55) wonId = "basic";
    else if (r2 < 0.88) wonId = "premium";
    else wonId = "mythic";
    // tiny chance upgrade: if opened mythic, bias toward premium/mythic
    if (packId === "mythic" && r2 > 0.4)
      wonId = r2 > 0.75 ? "mythic" : "premium";
    if (packId === "premium" && r2 > 0.7) wonId = "mythic";
    const wonPack = PACKS.find((p) => p.id === wonId) || PACKS[0];
    addFreeBox(wonId, 1);
    result = {
      type: "box",
      boxId: wonId,
      name: wonPack.name,
      icon: wonPack.icon || "📦",
      rarity: "box",
      color: wonPack.color,
      isNew: true,
    };
  } else if (roll < boxChance + coinChance) {
    const amount =
      packId === "mythic"
        ? 80 + Math.floor(Math.random() * 140)
        : packId === "premium"
          ? 35 + Math.floor(Math.random() * 70)
          : 15 + Math.floor(Math.random() * 40);
    addCoins(amount);
    result = {
      type: "coins",
      amount,
      name: "◆ " + amount,
      rarity: "coins",
      isNew: true,
    };
  } else if (roll < boxChance + coinChance + xpChance) {
    const amount =
      packId === "mythic"
        ? 35 + Math.floor(Math.random() * 55)
        : packId === "premium"
          ? 18 + Math.floor(Math.random() * 28)
          : 8 + Math.floor(Math.random() * 16);
    addBonusXp(amount);
    result = {
      type: "xp",
      amount,
      name: "+" + amount + " XP",
      rarity: "xp",
      isNew: true,
    };
  } else {
    const rarity = rollRarity(pack.odds);
    const pool = ALL_ROBOTS.filter(
      (r) => r.rarity === rarity && r.id !== "momo",
    );
    const pick = pool.length
      ? pool[Math.floor(Math.random() * pool.length)]
      : ALL_ROBOTS[Math.floor(Math.random() * ALL_ROBOTS.length)];
    const isNew = !owned.includes(pick.id);
    if (isNew) owned.push(pick.id);
    setOwned(owned);
    result = { type: "robot", ...pick, isNew };
  }
  updateCoinsUI();

  const epicColor = rarityGlow[result.rarity] || pack.accent;

  function makeReelItems(winner) {
    const pool = ALL_ROBOTS.filter((r) => r.id !== "momo");
    const items = [];
    for (let i = 0; i < 55; i++) {
      const rr = Math.random();
      if (rr < 0.05)
        items.push({ type: "coins", name: "◆ ???", rarity: "coins" });
      else if (rr < 0.09) items.push({ type: "xp", name: "XP", rarity: "xp" });
      else if (rr < 0.12) {
        const bp = PACKS[Math.floor(Math.random() * PACKS.length)];
        items.push({
          type: "box",
          name: bp.name,
          rarity: "box",
          icon: bp.icon,
        });
      } else {
        const p = pool[Math.floor(Math.random() * pool.length)];
        items.push({
          type: "robot",
          name: p.name,
          rarity: p.rarity,
          robot: p,
        });
      }
    }
    if (winner.type === "robot") {
      items[48] = {
        type: "robot",
        name: winner.name,
        rarity: winner.rarity,
        robot: winner,
      };
    } else if (winner.type === "box") {
      items[48] = {
        type: "box",
        name: winner.name,
        rarity: "box",
        icon: winner.icon,
      };
    } else {
      items[48] = {
        type: winner.type,
        name: winner.name,
        rarity: winner.rarity,
      };
    }
    return items;
  }

  const reel = makeReelItems(result);

  function itemHTML(it) {
    const col = rarityGlow[it.rarity] || "#888";
    if (it.type === "coins") {
      return `<div class="csgo-item r-coins"><div class="ci-icon">◆</div><div class="ci-name" style="color:#FBBF24">${it.name}</div><div class="ci-rar" style="color:#FBBF24">COINS</div></div>`;
    }
    if (it.type === "xp") {
      return `<div class="csgo-item r-xp"><div class="ci-icon">⚡</div><div class="ci-name" style="color:#22D3EE">${it.name}</div><div class="ci-rar" style="color:#22D3EE">XP</div></div>`;
    }
    if (it.type === "box") {
      return `<div class="csgo-item" style="border-color:#E879F9;box-shadow:0 0 14px #E879F966"><div class="ci-icon">${it.icon || "📦"}</div><div class="ci-name" style="color:#E879F9">${it.name}</div><div class="ci-rar" style="color:#E879F9">BOX</div></div>`;
    }
    const rob = it.robot || {
      c1: "#888",
      c2: "#444",
      accent: col,
      eye: col,
      rarity: it.rarity,
      name: it.name,
    };
    return `<div class="csgo-item r-${it.rarity}"><div style="width:56px;height:56px">${robotAvatarSVG(rob, 56)}</div><div class="ci-name">${it.name}</div><div class="ci-rar" style="color:${col}">${(it.rarity || "").toUpperCase()}</div></div>`;
  }

  const freeNote = usedFree
    ? '<p class="font-mono text-[10px] mb-1" style="color:#4ADE80">FREE BOX</p>'
    : "";

  openModalHTML(`
    <div class="text-center pack-open-stage" id="pack-stage" style="--box-c1:${pack.color};--box-c2:${pack.color2};--box-accent:${pack.accent};--box-glow:${pack.accent}88">
      <div class="pack-bg-pulse on"></div>
      ${freeNote}
      <p class="font-mono text-[11px] tracking-[0.25em] pack-status-pulse mb-2" id="pack-status" style="color:${pack.accent}">UNLOCKING CASE…</p>
      <p class="font-display font-bold text-[18px] mb-3">${pack.name}</p>
      <div class="csgo-wrap">
        <div class="csgo-window" id="csgo-window">
          <div class="csgo-marker"></div>
          <div class="csgo-track" id="csgo-track">${reel.map(itemHTML).join("")}</div>
        </div>
      </div>
      <p class="font-mono text-[11px] mt-4 opacity-50" id="pack-sub">Spinning…</p>
    </div>
  `);

  if (navigator.vibrate) navigator.vibrate([15, 20, 15, 20, 15]);

  const track = document.getElementById("csgo-track");
  const itemW = 104;
  const finalX = -(48 * itemW) + (Math.random() - 0.5) * 18;
  if (track) {
    track.style.transform = "translate3d(0,0,0)";
    track.style.transition = "none";
    void track.offsetWidth;
    track.style.transition = "transform 8.5s cubic-bezier(0.05, 0.7, 0.08, 1)";
    track.style.transform = `translate3d(${finalX}px,0,0)`;
  }
  try {
    SFX.packShake();
  } catch (e) {}

  let ticks = 0;
  const tickTimer = setInterval(() => {
    ticks++;
    try {
      SFX.packCard(ticks % 3);
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(8);
    if (ticks > 28) clearInterval(tickTimer);
  }, 280);

  setTimeout(() => {
    clearInterval(tickTimer);
    const items = document.querySelectorAll("#csgo-track .csgo-item");
    if (items[48]) {
      items[48].classList.add("win");
      items[48].style.setProperty(
        "--win-color",
        rarityGlow[result.rarity] || "#fff",
      );
    }
    const status = document.getElementById("pack-status");
    const sub = document.getElementById("pack-sub");
    if (status) {
      status.textContent = "✦ HIT ✦";
      status.style.color = rarityGlow[result.rarity] || pack.accent;
    }
    if (sub) sub.textContent = result.name;
    try {
      SFX.packBurst();
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([40, 25, 50]);
  }, 8600);

  setTimeout(() => {
    const stage = document.getElementById("pack-stage");
    if (!stage) return;
    let cardInner = "";
    if (result.type === "coins") {
      cardInner = `<div class="pack-card-front" style="--card-rarity:#FBBF24;border-color:#FBBF24">
        <div style="font-size:42px;margin:14px 0">◆</div>
        <p class="font-bold text-[20px]" style="color:#FBBF24">+${result.amount}</p>
        <p class="font-mono text-[11px] mt-1" style="color:#FBBF24">COINS</p>
      </div>`;
    } else if (result.type === "xp") {
      cardInner = `<div class="pack-card-front" style="--card-rarity:#22D3EE;border-color:#22D3EE">
        <div style="font-size:42px;margin:14px 0">⚡</div>
        <p class="font-bold text-[20px]" style="color:#22D3EE">+${result.amount} XP</p>
        <p class="font-mono text-[11px] mt-1" style="color:#22D3EE">RANK XP</p>
      </div>`;
    } else if (result.type === "box") {
      cardInner = `<div class="pack-card-front" style="--card-rarity:#E879F9;border-color:#E879F9">
        <div style="font-size:42px;margin:14px 0">${result.icon || "📦"}</div>
        <p class="font-bold text-[16px]" style="color:#E879F9">${result.name}</p>
        <p class="font-mono text-[11px] mt-1" style="color:#E879F9">FREE BOX</p>
        <p class="text-[10px] mt-2 opacity-60">Im Inventar gespeichert</p>
      </div>`;
    } else {
      cardInner = `<div class="pack-card-front" style="--card-rarity:${rarityGlow[result.rarity]};border-color:${rarityGlow[result.rarity]}">
        <div style="display:flex;justify-content:center;margin-bottom:8px">${robotAvatarSVG(result, 80)}</div>
        <p class="font-bold text-[15px] truncate">${result.name}</p>
        <p class="font-mono text-[11px] mt-0.5 font-bold" style="color:${rarityGlow[result.rarity]}">${rarityLabel(result.rarity)}</p>
        ${result.isNew ? '<p class="text-[11px] mt-1.5 font-bold" style="color:#4ADE80">✦ NEU</p>' : '<p class="text-[11px] mt-1.5 opacity-40">Dupe</p>'}
      </div>`;
    }
    stage.innerHTML = `
      <div class="pack-flash boom" style="background:radial-gradient(circle,#fff 0%,${epicColor}44 35%,transparent 65%)"></div>
      <p class="font-mono text-[10px] tracking-[0.22em]" style="color:${epicColor}">✦ CASE OPENED ✦</p>
      <h3 class="font-display text-[22px] font-bold mt-1">${pack.name}</h3>
      <div class="pack-results pack-results-1" style="margin-top:18px">
        <div class="pack-card" style="animation-delay:0.1s;max-width:180px">${cardInner}</div>
      </div>
      <button type="button" onclick="closeModal();renderRobots();try{updateRankUI()}catch(e){}" class="pack-done-btn">Weiter</button>
    `;
    try {
      SFX.packCard(0);
    } catch (e) {}
    setTimeout(() => {
      try {
        SFX.confetti();
        launchConfetti();
      } catch (e) {}
    }, 500);
  }, 10200);
}

function applyRobotLook(id) {
  const r = ALL_ROBOTS.find((x) => x.id === id) || ALL_ROBOTS[0];
  const nameEl = document.getElementById("momo-name");
  if (nameEl) nameEl.textContent = r.name;
  window._robotAccent = r.accent;
  window._currentRobotRarity = r.rarity || "common";

  // Pixel-Art Robot (main view) – no 3D
  var host3d = document.getElementById("momo-realistic");
  if (host3d) {
    host3d.innerHTML = robotAvatarSVG(r, 148);
    host3d.style.filter = "";
    host3d._r3dInit = false;
  }
  const oldSvg = document.getElementById("momo-svg");
  if (oldSvg) oldSvg.style.display = "none";

  const old = document.getElementById("meme-skin-badge");
  if (old) old.remove();

  const wrap = document.getElementById("momo-wrap");
  if (wrap) wrap.style.filter = "";
}

let habits = [];
let exercises = [];
let gymPeriod = "month";
let schoolPeriod = "month";

function migrateEntries() {
  let entries = load("life-entries", []);
  if (!entries.length) return entries;
  if (entries[0].values)
    return entries.map((e) => ({ ...e, contexts: e.contexts || {} }));
  return entries.map((e) => ({
    date: e.date,
    values: {
      seiten: e.seiten || 0,
      training: e.training || 0,
      kcal: e.kcal || 0,
      ernaehrung: e.ernaehrung === "Ja",
      screen: e.screen || 0,
      ...(e.customValues || {}),
    },
    contexts: {},
    aus: e.aus || 0,
    ein: e.ein || 0,
    note: e.note || "",
    score: e.score || 0,
    ts: e.ts || Date.now(),
  }));
}
function localDateISO(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getSelectedEntryDate() {
  return document.getElementById("entry-date")?.value || localDateISO();
}
function setEntryDateOffset(offset) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + Number(offset || 0));
  const el = document.getElementById("entry-date");
  if (el) el.value = localDateISO(d);
  loadEntryDate();
}
function timeToMinutes(value) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(":").map(Number);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}
function timeToBedtimeAxis(value) {
  const mins = timeToMinutes(value);
  if (mins === null) return null;
  return mins < 720 ? mins + 1440 : mins;
}
function axisMinutesToTime(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value)))
    return "--:--";
  let mins = Math.round(Number(value)) % 1440;
  if (mins < 0) mins += 1440;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}
function isTimeValue(value) {
  return timeToMinutes(value) !== null;
}
function getHabitContext(entry, h) {
  return h.splitGoal
    ? entry?.contexts?.[h.id] === "free"
      ? "free"
      : "busy"
    : "default";
}
function getHabitGoal(h, entryOrContext = null) {
  if (!h.splitGoal) return h.goal;
  const context =
    typeof entryOrContext === "string"
      ? entryOrContext
      : getHabitContext(entryOrContext, h);
  return context === "free" ? (h.goalFree ?? h.goal) : (h.goalBusy ?? h.goal);
}
function isChoiceHabit(h) {
  return h?.type === "boolean" || h?.type === "choice";
}
function normalizeHabitCategories(h) {
  const saved = Array.isArray(h?.categories) ? h.categories : [];
  const source =
    saved.length >= 2
      ? saved
      : [
          { id: "good", label: "Gut", score: 100 },
          { id: "cheat", label: "Cheat", score: 0 },
        ];
  return source.map((category, index) => ({
    id: String(category.id || `category-${index}`).replace(
      /[^a-zA-Z0-9_-]/g,
      "-",
    ),
    label: String(category.label || `Kategorie ${index + 1}`),
    score: Math.max(0, Math.min(100, Number(category.score) || 0)),
  }));
}
function habitChoiceId(h, value) {
  const categories = normalizeHabitCategories(h);
  if (value === true) return categories[0].id;
  if (value === false) return categories.at(-1).id;
  const id = String(value ?? "");
  return categories.some((category) => category.id === id)
    ? id
    : categories.at(-1).id;
}
function habitChoiceCategory(h, value) {
  const id = habitChoiceId(h, value);
  return normalizeHabitCategories(h).find((category) => category.id === id);
}
function habitChoicePercent(h, value) {
  return habitChoiceCategory(h, value)?.score || 0;
}
function formatHabitValue(h, value) {
  if (isChoiceHabit(h)) return habitChoiceCategory(h, value)?.label || "–";
  if (h.type === "time") return isTimeValue(value) ? value + " Uhr" : "–";
  return value === undefined || value === null || value === ""
    ? "–"
    : `${value}${h.unit || ""}`;
}
function habitGoalSummary(h) {
  if (isChoiceHabit(h))
    return normalizeHabitCategories(h)
      .map((category) => `${category.label} ${category.score}%`)
      .join(" · ");
  const suffix = h.type === "time" ? " Uhr" : h.unit || "";
  if (h.splitGoal)
    return `🌙 ${getHabitGoal(h, "free")}${suffix} · 💼 ${getHabitGoal(h, "busy")}${suffix}`;
  return `${h.goal}${suffix}${h.inverse ? " oder weniger" : ""}`;
}
function calcPointsForEntry(entry, habitsList = habits) {
  const scoringHabits = habitsList.filter((h) => h.countsForScore !== false);
  if (!scoringHabits.length) return { total: 0, breakdown: {} };
  const hasAnyActiveInput = scoringHabits.some((h) => {
    const value = entry.values?.[h.id];
    if (isChoiceHabit(h)) return habitChoicePercent(h, value) > 0;
    if (h.type === "time") return isTimeValue(value);
    return Number(value) > 0;
  });
  if (!hasAnyActiveInput) return { total: 0, breakdown: {} };
  const pointsPerHabit = 100 / scoringHabits.length;
  let total = 0,
    breakdown = {};
  habitsList.forEach((h) => {
    let val = entry.values?.[h.id];
    let pts = 0;
    if (h.countsForScore === false) {
      breakdown[h.id] = 0;
      return;
    }
    const goal = getHabitGoal(h, entry);
    if (isChoiceHabit(h))
      pts = pointsPerHabit * (habitChoicePercent(h, val) / 100);
    else if (h.type === "time") {
      const actual = timeToBedtimeAxis(val),
        target = timeToBedtimeAxis(String(goal || ""));
      if (actual !== null && target !== null) {
        const lateBy = actual - target;
        pts =
          lateBy <= 0
            ? pointsPerHabit
            : Math.max(0, pointsPerHabit * (1 - lateBy / 180));
      }
    } else {
      val = typeof val === "number" ? val : parseFloat(val) || 0;
      const numericGoal = parseFloat(goal) || 0;
      if (h.inverse) {
        if (numericGoal > 0 && val <= numericGoal) pts = pointsPerHabit;
        else if (numericGoal > 0) {
          const over = val - numericGoal;
          pts = Math.max(0, pointsPerHabit * (1 - over / (numericGoal * 2.5)));
        }
      } else if (numericGoal > 0)
        pts = Math.min(pointsPerHabit, (val / numericGoal) * pointsPerHabit);
    }
    breakdown[h.id] = pts;
    total += pts;
  });
  return { total: Math.round(total), breakdown };
}
function calcPointsFromInputs() {
  const values = {},
    contexts = {};
  habits.forEach((h) => {
    if (isChoiceHabit(h)) {
      values[h.id] =
        document.getElementById(`in-${h.id}`)?.dataset?.choice ||
        normalizeHabitCategories(h).at(-1).id;
    } else if (h.type === "time") {
      values[h.id] = document.getElementById(`in-${h.id}`)?.value || "";
    } else {
      const numeric =
        parseFloat(document.getElementById(`in-${h.id}`)?.value) || 0;
      values[h.id] =
        h.id === "kcal" ? Math.round(numeric / 20) * 20 : numeric;
    }
    if (h.splitGoal)
      contexts[h.id] =
        document.getElementById(`ctx-${h.id}`)?.dataset?.context || "busy";
  });
  return calcPointsForEntry({ values, contexts }, habits);
}
function getEntryCaloriesBurned(entry) {
  return Math.max(0, Number(entry?.values?.kcal ?? entry?.kcalBurned) || 0);
}
function getEntryCaloriesEaten(entry) {
  return Math.max(0, Number(entry?.kcalEaten) || 0);
}
function getEntryCalorieBalance(entry) {
  return getEntryCaloriesEaten(entry) - getEntryCaloriesBurned(entry);
}
function getCurrentCaloriesBurned() {
  return Math.max(0, Number(document.getElementById("in-kcal")?.value) || 0);
}
function getCalorieBalanceGoal() {
  const saved = load("calorie-balance-goal", {
    mode: "maintenance",
    amount: 200,
  });
  const requestedAmount = Number(saved?.amount);
  return {
    mode: ["surplus", "maintenance", "deficit"].includes(saved?.mode)
      ? saved.mode
      : "maintenance",
    amount: Math.max(
      0,
      Math.round((Number.isFinite(requestedAmount) ? requestedAmount : 200) / 20) *
        20,
    ),
  };
}
function calorieGoalSummary(goal = getCalorieBalanceGoal()) {
  if (goal.mode === "surplus") return `Ziel +${goal.amount} kcal oder mehr`;
  if (goal.mode === "deficit") return `Ziel −${goal.amount} kcal oder mehr`;
  return `Ziel zwischen −${goal.amount} und +${goal.amount} kcal`;
}
function evaluateCalorieGoal(net, goal = getCalorieBalanceGoal()) {
  if (goal.mode === "surplus")
    return {
      met: net >= goal.amount,
      remaining: Math.max(0, goal.amount - net),
    };
  if (goal.mode === "deficit")
    return {
      met: net <= -goal.amount,
      remaining: Math.max(0, goal.amount + net),
    };
  return {
    met: Math.abs(net) <= goal.amount,
    remaining: Math.max(0, Math.abs(net) - goal.amount),
  };
}
function updateCalorieBalancePreview() {
  const eaten = Math.max(
      0,
      Number(document.getElementById("in-kcal-eaten")?.value) || 0,
    ),
    burned = getCurrentCaloriesBurned(),
    net = eaten - burned,
    goal = getCalorieBalanceGoal(),
    goalState = evaluateCalorieGoal(net, goal);
  const burnedEl = document.getElementById("calorie-burned-preview"),
    netEl = document.getElementById("calorie-net-preview"),
    label = document.getElementById("calorie-net-label"),
    badge = document.getElementById("calorie-balance-badge"),
    goalSummary = document.getElementById("calorie-goal-summary"),
    goalStatus = document.getElementById("calorie-goal-state");
  if (burnedEl) burnedEl.textContent = `${Math.round(burned)} kcal`;
  const signed = `${net > 0 ? "+" : ""}${Math.round(net)} kcal`,
    color = goalState.met ? "#4ADE80" : "#FBBF24";
  if (netEl) {
    netEl.textContent = signed;
    netEl.style.color = color;
  }
  if (badge) {
    badge.textContent = signed;
    badge.style.color = color;
  }
  if (label) {
    label.textContent =
      net > 0
        ? "Überschuss"
        : net < 0
          ? "Defizit"
          : "Ausgeglichen";
  }
  if (goalSummary) goalSummary.textContent = calorieGoalSummary(goal);
  if (goalStatus) {
    goalStatus.textContent = goalState.met
      ? "Ziel erreicht"
      : `Noch ${Math.ceil(goalState.remaining / 20) * 20} kcal bis zum Ziel`;
    goalStatus.style.color = color;
  }
}
function adjustCaloriesEaten(delta) {
  const el = document.getElementById("in-kcal-eaten");
  if (!el) return;
  el.value = Math.max(0, (Number(el.value) || 0) + Number(delta || 0));
  updateCalorieBalancePreview();
}

function loadEntryDate() {
  const date = getSelectedEntryDate();
  const today = localDateISO();
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = localDateISO(d);
  const dateEl = document.getElementById("entry-date");
  if (dateEl) dateEl.max = today;
  if (date > today) {
    if (dateEl) dateEl.value = today;
    return loadEntryDate();
  }
  const entry = migrateEntries().find((e) => e.date === date);
  renderHabitsInputs();
  const aus = document.getElementById("in-aus"),
    ein = document.getElementById("in-ein"),
    note = document.getElementById("in-note"),
    eaten = document.getElementById("in-kcal-eaten");
  if (aus) aus.value = entry?.aus || "";
  if (ein) ein.value = entry?.ein || "";
  if (note) note.value = entry?.note || "";
  if (eaten) eaten.value = entry?.kcalEaten || "";
  updateCalorieBalancePreview();
  const label =
    date === today
      ? "Heute"
      : date === yesterday
        ? "Gestern"
        : new Date(date + "T12:00:00").toLocaleDateString("de-DE", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
          });
  const title = document.getElementById("entry-day-title"),
    sub = document.getElementById("entry-day-subtitle"),
    saveBtn = document.getElementById("save-day-btn");
  if (title) title.textContent = label;
  if (sub)
    sub.textContent = `Daten für ${date} ${entry ? "bearbeiten" : "eintragen"}`;
  if (saveBtn) saveBtn.textContent = `${label} speichern`;
  document
    .getElementById("entry-today-btn")
    ?.classList.toggle("!bg-[var(--text)]", date === today);
  document
    .getElementById("entry-today-btn")
    ?.classList.toggle("!text-[var(--bg)]", date === today);
  document
    .getElementById("entry-yesterday-btn")
    ?.classList.toggle("!bg-[var(--text)]", date === yesterday);
  document
    .getElementById("entry-yesterday-btn")
    ?.classList.toggle("!text-[var(--bg)]", date === yesterday);
  onChange();
}

const TABS_ORDER = [
  "today",
  "analytics",
  "goals",
  "insights",
  "weekly",
  "monthly",
  "health",
  "settings",
  "gym",
  "school",
];
let currentTab = "today";

function switchTab(t) {
  if (!TABS_ORDER.includes(t)) return;
  if (t !== currentTab)
    try {
      SFX.tab();
    } catch (e) {}
  currentTab = t;

  // Only ONE view visible – class tab-on
  TABS_ORDER.forEach(function (name) {
    var el = document.getElementById("view-" + name);
    if (!el) return;
    el.classList.remove("tab-on");
    el.classList.add("hidden");
    el.style.display = "none";
  });
  var view = document.getElementById("view-" + t);
  if (view) {
    view.classList.remove("hidden");
    view.classList.add("tab-on");
    view.style.display = "block";
  }

  document.querySelectorAll(".tab").forEach(function (b) {
    b.classList.remove("tab-active");
  });
  var tabBtn = document.getElementById("tab-" + t);
  if (tabBtn) tabBtn.classList.add("tab-active");
  document.querySelectorAll("[data-nav-tab]").forEach(function (button) {
    button.classList.toggle("active", button.dataset.navTab === t);
  });

  // Force scroll to very top
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (t === "gym") {
    try {
      renderGym();
      renderGymStats();
    } catch (e) {
      console.error(e);
    }
  }
  if (t === "school") {
    try {
      renderSchool();
      renderSchoolStats();
    } catch (e) {
      console.error(e);
    }
  }
  if (t === "today") {
    try {
      renderHistory();
      updateAll();
      renderStatsGrid();
      renderChallenge();
    } catch (e) {
      console.error(e);
    }
  }
  if (t === "analytics") {
    window.refreshAnalytics?.();
  }
  if (t === "goals") {
    window.refreshGoals?.();
  }
  if (t === "insights") {
    try {
      window.refreshInsights?.();
    } catch (e) {
      console.error("insights tab", e);
    }
  }
  if (t === "weekly" || t === "monthly") {
    window.refreshReview?.(t);
  }
  if (t === "health") {
    window.refreshHealth?.();
  }
  if (t === "settings") {
    window.refreshSettings?.();
  }
  if (t === "robots") {
    try {
      updateCoinsUI();
      renderRobots();
      window.scrollTo(0, 0);
    } catch (e) {
      console.error("robots tab", e);
    }
  }

  document.querySelectorAll("[data-nav-tab]").forEach((button) => {
    button.setAttribute(
      "aria-current",
      button.dataset.navTab === t ? "page" : "false",
    );
  });
  window.dispatchEvent(
    new CustomEvent("lifeos:tab-change", { detail: { tab: t } }),
  );
}
window.switchTab = switchTab;

// 05.10.2 · Navigation und Start-Interaktionen
function wireNavClicks() {
  document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
    if (btn.dataset.wired === "1") return;
    btn.dataset.wired = "1";
    const tab = btn.dataset.navTab;
    if (!tab) return;
    btn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof switchTab === "function") switchTab(tab);
      },
      true,
    );
  });
  const startBtn =
    document.getElementById("splash-start-btn") ||
    document.querySelector("#splash button");
  if (startBtn && startBtn.dataset.wired !== "1") {
    startBtn.dataset.wired = "1";
    startBtn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        if (typeof startFromSplash === "function") startFromSplash();
        else if (typeof enterApp === "function") enterApp();
      },
      true,
    );
  }
  const nameBtn = document.getElementById("name-gate-btn");
  if (nameBtn && nameBtn.dataset.wired !== "1") {
    nameBtn.dataset.wired = "1";
    nameBtn.addEventListener("click", function (e) {
      e.preventDefault();
      submitPlayerName();
    });
  }
  [
    ["gate-create-pass", () => createLocalAccount("gate")],
    ["gate-login-pass", () => loginLocalAccount("gate")],
  ].forEach(([id, fn]) => {
    const inp = document.getElementById(id);
    if (inp && inp.dataset.wired !== "1") {
      inp.dataset.wired = "1";
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          fn();
        }
      });
    }
  });
  const nameInp = document.getElementById("player-name-input");
  if (nameInp && nameInp.dataset.wired !== "1") {
    nameInp.dataset.wired = "1";
    nameInp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitPlayerName();
      }
    });
  }
}

// Roboter-Grundzustand
let momoTapCount = 0;
let momoTapTimer = null;
function initMomo() {
  const wrap = document.getElementById("momo-wrap");
  if (!wrap) return;
  wrap.addEventListener("click", () => triggerMomo("click"));
  scheduleBlink();
}
let momoScore = 0;
