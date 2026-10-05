// ==================== 05.09 · DAILY CHALLENGES ====================
function buildChallenges() {
  const list = [];
  const sports = [
    {
      name: "Liegestütze",
      unit: "Wdh",
      base: 5,
      step: 2,
      how: "Hände schulterbreit, Körper gerade. Arme beugen bis Brust fast Boden berührt, dann hoch.",
    },
    {
      name: "Kniebeugen",
      unit: "Wdh",
      base: 8,
      step: 3,
      how: "Füße schulterbreit, Rücken gerade. Po nach hinten als würdest du dich setzen, tief runter.",
    },
    {
      name: "Ausfallschritte",
      unit: "Wdh",
      base: 6,
      step: 2,
      how: "Großer Schritt nach vorne, beide Knie 90 Grad. Abstoßen, Seiten wechseln.",
    },
    {
      name: "Burpees",
      unit: "Wdh",
      base: 3,
      step: 1,
      how: "Hinlegen, Liegestütz machen, Füße ran, hochspringen. Alles in einem Flow.",
    },
    {
      name: "Plank",
      unit: "Sek",
      base: 20,
      step: 5,
      how: "Unterarmstütz, Körper gerade wie ein Brett. Nicht durchhängen, Po nicht hoch!",
    },
    {
      name: "Sit-ups",
      unit: "Wdh",
      base: 8,
      step: 2,
      how: "Rücken flach, Knie angewinkelt. Oberkörper langsam hoch, kontrolliert runter.",
    },
    {
      name: "Hampelmänner",
      unit: "Wdh",
      base: 15,
      step: 5,
      how: "Springen, Beine spreizen, Arme über Kopf klatschen. Gleichmäßiger Rhythmus.",
    },
    {
      name: "Mountain Climbers",
      unit: "Wdh",
      base: 10,
      step: 4,
      how: "Plank-Position, abwechselnd Knie zur Brust ziehen. Schnell aber kontrolliert.",
    },
    {
      name: "Tricep Dips",
      unit: "Wdh",
      base: 5,
      step: 2,
      how: "Hände auf Stuhl oder Kante, Beine gestreckt. Arme beugen bis 90 Grad, hochdrücken.",
    },
    {
      name: "Glute Bridges",
      unit: "Wdh",
      base: 10,
      step: 3,
      how: "Rücken flach, Knie angewinkelt. Po heben bis Körper eine gerade Linie bildet, kurz halten.",
    },
    {
      name: "Wall Sit",
      unit: "Sek",
      base: 25,
      step: 5,
      how: "Rücken flach an die Wand, Oberschenkel parallel zum Boden. Durchhalten!",
    },
    {
      name: "High Knees",
      unit: "Wdh",
      base: 20,
      step: 5,
      how: "Auf der Stelle laufen, Knie so hoch wie möglich. Arme mitbewegen, Tempo halten.",
    },
    {
      name: "Calf Raises",
      unit: "Wdh",
      base: 12,
      step: 4,
      how: "Auf Zehenspitzen stellen, langsam runter. An einer Kante für mehr Bewegungsumfang.",
    },
    {
      name: "Superman Holds",
      unit: "Wdh",
      base: 6,
      step: 2,
      how: "Auf den Bauch legen, Arme und Beine gleichzeitig heben. 2-3 Sekunden oben halten.",
    },
    {
      name: "Russian Twists",
      unit: "Wdh",
      base: 12,
      step: 4,
      how: "Hinsetzen, Füße angehoben. Oberkörper abwechselnd nach links und rechts drehen.",
    },
    {
      name: "Joggen",
      unit: "Min",
      base: 5,
      step: 1,
      how: "Lockeres Tempo, gleichmäßig atmen. Nicht zu schnell starten, lieber gleichmäßig.",
    },
    {
      name: "Seilspringen",
      unit: "Wdh",
      base: 20,
      step: 10,
      how: "Aus den Handgelenken drehen, nicht aus den Armen. Kleine Sprünge, auf den Fußballen landen.",
    },
    {
      name: "Shadow Boxing",
      unit: "Min",
      base: 2,
      step: 1,
      how: "Fäuste hoch, Kinn einziehen. Jab, Cross und Hook schlagen. Füße immer in Bewegung!",
    },
    {
      name: "Yoga Flow",
      unit: "Min",
      base: 5,
      step: 1,
      how: "Sonnengruß: Herabschauendes Hundesichtung, Planke, Cobra. Langsam und bewusst atmen.",
    },
    {
      name: "Treppensteigen",
      unit: "Stufen",
      base: 20,
      step: 10,
      how: "Ganz rauf, ganz runter. Tempo steigern. Seiten wechseln für Balance.",
    },
    {
      name: "Dehnen Beine",
      unit: "Sek",
      base: 30,
      step: 10,
      how: "Langsam vorbeugen, Zehen oder Schienbeine berühren. 30 Sekunden halten, nicht wippen!",
    },
    {
      name: "Dehnen Hüfte",
      unit: "Sek",
      base: 30,
      step: 10,
      how: "Tiefer Ausfallschritt, hinteres Knie am Boden. Hüfte nach vorne schieben, 30 Sek pro Seite.",
    },
    {
      name: "Dehnen Schultern",
      unit: "Sek",
      base: 20,
      step: 5,
      how: "Arm über die Brust ziehen, mit anderem Arm drücken. 20 Sek pro Seite, Schultern entspannen.",
    },
    {
      name: "Dehnen Rücken",
      unit: "Sek",
      base: 30,
      step: 10,
      how: "Katze-Kuh: Auf allen Vieren, Rücken abwechselnd rund und durchgebogen. Langsam ausatmen.",
    },
    {
      name: "Dehnen Brust",
      unit: "Sek",
      base: 20,
      step: 5,
      how: "Arme nach hinten strecken und Brust raus. Oder im Türrahmen abstützen und nach vorne lehnen.",
    },
    {
      name: "Dehnen Nacken",
      unit: "Sek",
      base: 20,
      step: 5,
      how: "Kopf langsam zur Seite neigen, 20 Sek halten. Dann andere Seite. Auf keinen Fall kreisen!",
    },
    {
      name: "Dehnen Waden",
      unit: "Sek",
      base: 20,
      step: 5,
      how: "An Wand lehnen, ein Bein gestreckt nach hinten. Ferse am Boden drücken, 20 Sek halten.",
    },
    {
      name: "Sonnengruß",
      unit: "Wdh",
      base: 3,
      step: 1,
      how: "Stehen, Vorbeugen, Planke, Cobra, herabschauendes Hunde-Sichtung. Fließend wiederholen.",
    },
  ];
  for (let i = 0; i < 300; i++) {
    const s = sports[i % sports.length];
    const round = Math.floor(i / sports.length);
    const amount =
      s.base +
      round * s.step +
      Math.floor(i / 50) * Math.max(1, Math.floor(s.step / 2));
    const sets = 1 + Math.floor(round / 3);
    const tier = Math.min(15, 1 + Math.floor(i / 20));
    let title, desc, durationSec;
    if (s.unit === "Sek") {
      title = `${s.name} · ${amount} Sek`;
      desc = `${amount} Sek: ${s.how || "Halten und durchhalten!"}`;
      durationSec = amount * Math.max(1, sets);
    } else if (s.unit === "Min") {
      title = `${s.name} · ${amount} Min`;
      desc = `${amount} Min: ${s.how || "Aktiv bleiben!"}`;
      durationSec = amount * 60;
    } else if (s.unit === "Stufen") {
      title = `${s.name} · ${amount}`;
      desc = `${amount} Stufen: ${s.how}`;
      durationSec = Math.max(60, amount * 2); // estimated max
    } else {
      const total = amount * sets;
      title =
        sets > 1 ? `${s.name} · ${sets}×${amount}` : `${s.name} · ${amount}`;
      desc =
        sets > 1
          ? `${sets}x${amount} (${total} gesamt): ${s.how || "Fertig tippen wenn erledigt."}`
          : `${amount} Wdh: ${s.how || "Stoppuhr starten, danach fertig tippen."}`;
      // estimated work time ~2s per rep
      durationSec = Math.max(30, total * 2);
    }
    list.push({
      id: i + 1,
      title,
      desc,
      tier,
      amount,
      sets,
      unit: s.unit,
      sport: s.name,
      reward: 0,
      durationSec,
    });
  }
  return list;
}
const CHALLENGES = buildChallenges();

// Daily random challenges
function getDailyChallenges() {
  var today = new Date().toISOString().slice(0, 10);
  var stored = load("daily-ch", null);
  if (stored && stored.date === today) return stored.list;
  var indices = [];
  for (var i = 0; i < 300; i++) indices.push(i);
  var s = today.split("-").reduce(function (a, b) {
    return a * 31 + parseInt(b);
  }, 0);
  function sr() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  }
  for (let i = indices.length - 1; i > 0; i--) {
    var j = Math.floor(sr() * (i + 1));
    var t = indices[i];
    indices[i] = indices[j];
    indices[j] = t;
  }
  var list = indices.slice(0, 30);
  save("daily-ch", { date: today, list: list });
  return list;
}
function getDailyProgress() {
  var today = new Date().toISOString().slice(0, 10);
  var p = load("daily-prog", { date: today, count: 0 });
  if (p.date !== today) return 0;
  return p.count;
}
function setDailyProgress(n) {
  save("daily-prog", {
    date: new Date().toISOString().slice(0, 10),
    count: n,
  });
}

function formatMMSS(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Challenge runtime state
let _chState = "idle"; // idle | running | done | cooldown
let _chTick = null;
let _chRemain = 0;
let _chTotal = 0;
let _chMode = "down"; // down = countdown, up = stopwatch
let _chUiTick = null;

function setChBtn(text, mode) {
  const btn = document.getElementById("ch-btn");
  if (!btn) return;
  btn.textContent = text;
  btn.disabled = mode === "disabled";
  btn.classList.remove("ch-disabled", "ch-running", "ch-claim");
  if (mode === "disabled") btn.classList.add("ch-disabled");
  if (mode === "running") btn.classList.add("ch-running");
  if (mode === "claim") btn.classList.add("ch-claim");
}

function renderChallenge() {
  const daily = getDailyChallenges();
  const progress = getDailyProgress();
  const idx = progress;
  const title = document.getElementById("ch-title");
  const desc = document.getElementById("ch-desc");
  const prog = document.getElementById("ch-progress");
  const bar = document.getElementById("ch-bar");
  const tier = document.getElementById("ch-tier");
  const box = document.getElementById("ch-timer-box");
  const cool = document.getElementById("ch-cooldown-text");
  if (!title) return;

  // Don't overwrite UI while exercise timer is running
  if (_chState === "running" || _chState === "done") {
    return;
  }

  if (idx >= 30) {
    title.textContent = "Heute geschafft!";
    if (desc) desc.textContent = "30 Challenges erledigt. Morgen gibt es neue.";
    if (prog) prog.textContent = "30 / 30";
    if (bar) bar.style.width = "100%";
    if (tier) tier.textContent = "MAX";
    if (box) box.style.display = "none";
    setChBtn("Fertig für heute", "disabled");
    return;
  }

  const chIdx = daily[idx];
  const ch = CHALLENGES[chIdx];
  title.textContent = ch.title;
  if (desc) desc.textContent = ch.desc;
  if (prog) prog.textContent = `${idx + 1} / 30`;
  if (bar) bar.style.width = (idx / 30) * 100 + "%";
  if (tier) tier.textContent = "Lv." + ch.tier;
  if (box) box.style.display = "none";

  _chState = "idle";
  setChBtn("▶  Timer starten", "idle");
}

function onChallengeBtn() {
  if (getDailyProgress() >= 30) return;
  if (_chState === "idle") {
    startExerciseTimer();
    return;
  }
  if (_chState === "running") {
    // For stopwatch mode allow early finish
    if (_chMode === "up") {
      finishExerciseTimer(true);
    }
    return;
  }
  if (_chState === "done") {
    claimChallenge();
    return;
  }
}
window.onChallengeBtn = onChallengeBtn;

function startExerciseTimer() {
  const daily = getDailyChallenges();
  const progress = getDailyProgress();
  if (progress >= 30) return;
  const idx = daily[progress];
  if (idx >= CHALLENGES.length) return;
  const ch = CHALLENGES[idx];
  const box = document.getElementById("ch-timer-box");
  const label = document.getElementById("ch-timer-label");
  const display = document.getElementById("ch-timer-display");
  const tbar = document.getElementById("ch-timer-bar");

  // Countdown for Sek/Min, stopwatch for reps
  const isCountdown = ch.unit === "Sek" || ch.unit === "Min";
  _chMode = isCountdown ? "down" : "up";
  _chTotal = isCountdown ? ch.durationSec : ch.durationSec;
  _chRemain = isCountdown ? ch.durationSec : 0;
  _chState = "running";

  if (box) box.style.display = "block";
  if (label)
    label.textContent = isCountdown
      ? "COUNTDOWN"
      : "STOPPUHR · tippe Fertig wenn erledigt";
  if (display)
    display.textContent = isCountdown ? formatMMSS(_chRemain) : "00:00";
  if (tbar) tbar.style.width = isCountdown ? "100%" : "0%";

  setChBtn(
    isCountdown ? "Läuft…" : "✓  Fertig (Stop)",
    isCountdown ? "running" : "running",
  );
  try {
    SFX.click();
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(20);

  if (_chTick) clearInterval(_chTick);
  const started = Date.now();
  _chTick = setInterval(() => {
    if (_chMode === "down") {
      _chRemain = Math.max(
        0,
        ch.durationSec - Math.floor((Date.now() - started) / 1000),
      );
      if (display) display.textContent = formatMMSS(_chRemain);
      if (tbar) tbar.style.width = (_chRemain / ch.durationSec) * 100 + "%";
      if (_chRemain <= 0) finishExerciseTimer(true);
    } else {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      _chRemain = elapsed;
      if (display) display.textContent = formatMMSS(elapsed);
      if (tbar)
        tbar.style.width =
          Math.min(100, (elapsed / Math.max(1, ch.durationSec)) * 100) + "%";
      // soft auto-enable claim after estimated time
      if (elapsed >= ch.durationSec) {
        setChBtn("✓  Fertig", "claim");
      }
    }
  }, 200);
}

function finishExerciseTimer(success) {
  if (_chTick) {
    clearInterval(_chTick);
    _chTick = null;
  }
  _chState = "done";
  const display = document.getElementById("ch-timer-display");
  const label = document.getElementById("ch-timer-label");
  const tbar = document.getElementById("ch-timer-bar");
  if (label) label.textContent = "GESCHAFFT";
  if (display) display.style.color = "#4ADE80";
  if (tbar) tbar.style.width = "100%";
  setChBtn("✓  Challenge abschließen", "claim");
  try {
    SFX.save();
  } catch (e) {}
  try {
    robotReact("save");
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
}

function claimChallenge() {
  var progress = getDailyProgress();
  var daily = getDailyChallenges();
  if (progress >= 30) return;
  var chIdx = daily[progress];
  var ch = CHALLENGES[chIdx];

  setDailyProgress(progress + 1);
  _chState = "idle";
  if (_chTick) {
    clearInterval(_chTick);
    _chTick = null;
  }

  const display = document.getElementById("ch-timer-display");
  if (display) display.style.color = "#fff";

  try {
    SFX.save();
    SFX.confetti();
  } catch (e) {}
  try {
    robotReact("challenge");
  } catch (e) {}
  if (typeof launchConfetti === "function") launchConfetti();
  if (navigator.vibrate) navigator.vibrate([30, 40, 30, 40, 50]);

  openModalHTML(`
    <div class="text-center py-4">
      <p class="font-mono text-[10px] tracking-widest" style="color:#FBBF24">CHALLENGE DONE</p>
      <h3 class="font-display text-[22px] font-bold mt-2">${ch.title}</h3>
      <p class="text-[18px] font-bold mt-4" style="color:#4ADE80">Erledigt</p>
      <p class="text-[12px] mt-2" style="color:var(--text-2)">Challenge ${progress + 1} / 30 · Keine XP-Belohnung</p>
      <button type="button" onclick="closeModal();renderChallenge()" class="ch-btn" style="margin-top:20px">Weiter</button>
    </div>
  `);
  renderChallenge();
}
window.completeChallenge = claimChallenge;

function startChallengeTimer() {
  if (_chUiTick) clearInterval(_chUiTick);
  _chState = "idle";
  renderChallenge();
  getDailyChallenges();
}
function getOwned() {
  return load("owned-robots", ["momo"]);
}
function setOwned(arr) {
  save("owned-robots", arr);
}
function getEquipped() {
  return load("equipped-robot", "momo");
}
function setEquipped(id) {
  save("equipped-robot", id);
  applyRobotLook(id);
  renderRobots();
}

function updateCoinsUI() {
  ["coins-badge", "coins-num", "coins-num-2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  const xp = getBonusXp();
  ["xp-num", "xp-num-2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = xp;
  });
}
