// ==================== 05.11 · ROBOTER-REAKTIONEN & EMOTIONEN ====================
var _robotBusy = false;
var _robotTimeout = null;

function robotPlay(anim, dur) {
  var stage = document.querySelector(".robot-stage");
  if (!stage || _robotBusy) return;
  _robotBusy = true;
  stage.style.animation = anim + " " + dur + "s ease-in-out";
  clearTimeout(_robotTimeout);
  _robotTimeout = setTimeout(function () {
    // Nach einer bewussten Reaktion wieder vollständig ruhig stehen.
    stage.style.animation = "none";
    stage.style.transform = "translate3d(0,0,0)";
    _robotBusy = false;
  }, dur * 1000);
}

function robotSpawnParticles(count, color) {
  var cont = document.getElementById("robot-particles");
  if (!cont) return;
  for (var i = 0; i < count; i++) {
    var p = document.createElement("div");
    p.className = "robot-particle";
    var angle = Math.random() * Math.PI * 2;
    var dist = 30 + Math.random() * 50;
    p.style.setProperty("--px", Math.cos(angle) * dist + "px");
    p.style.setProperty("--py", Math.sin(angle) * dist - 20 + "px");
    p.style.left = 40 + Math.random() * 20 + "%";
    p.style.top = 30 + Math.random() * 30 + "%";
    p.style.width = p.style.height = 2 + Math.random() * 4 + "px";
    p.style.background = color || (Math.random() > 0.5 ? "#7BA889" : "#FBBF24");
    p.style.boxShadow = "0 0 6px " + (color || "#7BA889");
    p.style.animationDuration = 1 + Math.random() * 1 + "s";
    cont.appendChild(p);
    setTimeout(function () {
      p.remove();
    }, 2000);
  }
}

function robotGlowPulse() {
  var ring = document.querySelector(".robot-glow-ring");
  if (!ring) return;
  ring.style.opacity = "1";
  ring.style.transform = "scale(1.3)";
  ring.style.transition = "all 0.3s ease";
  setTimeout(function () {
    ring.style.opacity = "0.6";
    ring.style.transform = "scale(1)";
    ring.style.transition = "all 1s ease";
  }, 300);
}

function scheduleIdleRobot() {
  // Der alte Momo bleibt im Idle bewusst ruhig. Blinzeln und die sehr sanfte
  // Atembewegung reichen aus; größere Bewegungen passieren nur als direkte
  // Reaktion auf Speichern, Coins oder Challenges.
}

function robotReact(event) {
  var has3D = window.R3D && document.getElementById("momo-realistic")._r3dInit;
  if (event === "save") {
    if (has3D) R3D.playReact("excited", 0.8);
    else robotPlay("robotExcited", 0.8);
    robotSpawnParticles(8);
    robotGlowPulse();
  } else if (event === "challenge") {
    if (has3D) R3D.playReact("dance", 1.5);
    else robotPlay("robotDance", 1.5);
    robotSpawnParticles(15, "#FBBF24");
    robotGlowPulse();
  } else if (event === "coin") {
    if (has3D) R3D.playReact("surprised", 0.5);
    else robotPlay("robotSurprised", 0.5);
    robotSpawnParticles(5, "#FBBF24");
  } else if (event === "secret") {
    if (has3D) R3D.playReact("dance", 2);
    else robotPlay("robotDance", 2);
    robotSpawnParticles(20, "#F472B6");
    robotGlowPulse();
  } else if (event === "sleep") {
    if (has3D) R3D.playReact("nod", 3);
    else robotPlay("robotSleepy", 3);
  }
}

function updateMomoFaceDisplay(isBlinking = false) {
  const equippedId = getEquipped();
  const r = ALL_ROBOTS.find((x) => x.id === equippedId) || ALL_ROBOTS[0];
  const host = document.getElementById("momo-realistic");
  if (host) {
    host.innerHTML = robotAvatarSVG(
      r,
      148,
      typeof window.momoScore === "number" ? window.momoScore : 0,
      isBlinking,
    );
  }
}

function scheduleBlink() {
  setTimeout(
    () => {
      window._momoBlinking = true;
      updateMomoFaceDisplay(true);
      setTimeout(() => {
        window._momoBlinking = false;
        updateMomoFaceDisplay(false);
        scheduleBlink();
      }, 140);
    },
    2200 + Math.random() * 2800,
  );
}
function triggerMomo(type) {
  if (type !== "click") return;
  // Easter-Egg mit den 50 Coins auf Nutzer-Wunsch entfernt
}
function spawnHearts(n) {
  const cont = document.getElementById("hearts-container");
  if (!cont) return;
  for (let i = 0; i < n; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = ["💚", "🌿", "🤍"][i % 3];
    h.style.left = 30 + Math.random() * 60 + "px";
    h.style.top = 18 + Math.random() * 24 + "px";
    h.style.animationDelay = i * 0.08 + "s";
    cont.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }
}
function spawnSparkles(n) {
  const cont = document.getElementById("sparkles-container");
  if (!cont) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.textContent = ["✦", "•"][Math.floor(Math.random() * 2)];
    s.style.cssText = `position:absolute;left:${10 + Math.random() * 70}px;top:${10 + Math.random() * 50}px;font-size:${8 + Math.random() * 10}px;color:var(--accent);animation:sparkleAnim ${0.85 + Math.random() * 0.5}s ease-out ${i * 0.05}s forwards;`;
    s.style.setProperty("--x", Math.random() * 80 - 40 + "px");
    s.style.setProperty("--y", -30 - Math.random() * 50 + "px");
    cont.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }
}
function updateMomoProgressive(points, monthAvg) {
  momoScore = points;
  window.momoScore = points;
  const wrap = document.getElementById("momo-wrap");
  const moodEl = document.getElementById("momo-mood");
  const textEl = document.getElementById("momo-text");
  const shadow = document.getElementById("momo-shadow");
  const zzz = document.getElementById("zzz");
  if (wrap) wrap.className = "momo-wrap";
  if (zzz) zzz.classList.add("hidden");
  if (shadow) {
    shadow.style.transform = `scale(${0.86 + points / 150})`;
    shadow.style.opacity = 0.12 + points / 400;
  }
  [1, 2, 3, 4, 5].forEach((i) => {
    const ind = document.getElementById("ind" + i);
    if (ind)
      ind.setAttribute("fill", points >= i * 20 ? "var(--accent)" : "#EDE6D6");
  });
  const leaf1 = document.getElementById("leaf1"),
    leaf2 = document.getElementById("leaf2"),
    flower = document.getElementById("flower");
  if (leaf1) leaf1.style.transform = "scale(0)";
  if (leaf2) leaf2.style.transform = "scale(0)";
  if (flower) {
    flower.style.transform = "scale(0)";
    flower.style.opacity = "0";
  }
  if (monthAvg >= 20 && leaf1) leaf1.style.transform = "scale(1)";
  if (monthAvg >= 50 && leaf2) leaf2.style.transform = "scale(1)";
  if (monthAvg >= 75 && flower) {
    flower.style.opacity = "1";
    flower.style.transform = "scale(1)";
  }

  const stage = getMomoStage(points);
  let mood = "",
    txt = "";
  if (stage === 7) {
    if (wrap) wrap.classList.add("momo-happy");
    mood = `${points} P • Überglücklich! (Stufe 8/8)`;
    txt = "Ekstase! Perfekter Tagesscore!";
  } else if (stage === 6) {
    if (wrap) wrap.classList.add("momo-happy");
    mood = `${points} P • Strahlend (Stufe 7/8)`;
    txt = "Strahlt vor Energie und Lebensfreude!";
  } else if (stage === 5) {
    if (wrap) wrap.classList.add("momo-happy");
    mood = `${points} P • Glücklich (Stufe 6/8)`;
    txt = "Der Roboter freut sich über deinen Tag!";
  } else if (stage === 4) {
    mood = `${points} P • Zuversichtlich (Stufe 5/8)`;
    txt = "Ein leichtes Lächeln zeigt sich!";
  } else if (stage === 3) {
    mood = `${points} P • Neutral (Stufe 4/8)`;
    txt = "Solide Basis. Der Roboter ist aufmerksam.";
  } else if (stage === 2) {
    mood = `${points} P • Besorgt (Stufe 3/8)`;
    txt = "Wird langsam wach, aber noch skeptisch.";
  } else if (stage === 1) {
    mood = `${points} P • Traurig (Stufe 2/8)`;
    txt = "Noch etwas betrübt. Erste Punkte gesammelt!";
  } else {
    mood = `0 P • Sehr traurig (Stufe 1/8)`;
    txt = "Der Roboter ist traurig... Starte deinen Tag!";
    if (zzz) zzz.classList.remove("hidden");
  }
  if (moodEl) moodEl.textContent = mood;
  if (textEl) textEl.textContent = txt;

  updateMomoFaceDisplay(false);
  try {
    const grid = document.getElementById("robots-grid");
    if (grid && grid.children.length > 0) renderRobots();
  } catch (e) {}
}
