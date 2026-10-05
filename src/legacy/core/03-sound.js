// ==================== 05.03 · SOUND-SYSTEM ====================
const SFX = (() => {
  let ctx = null;
  let enabled = load("sfx-on", true);
  let volume = Math.max(
    0,
    Math.min(1, Number(load("sfx-volume", 0.65)) || 0.65),
  );
  let profile = load("sfx-profile", "soft");
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(
    freq,
    dur,
    type = "sine",
    vol = 0.12,
    delay = 0,
    slideTo = null,
  ) {
    const c = ac();
    if (!c || !enabled) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    const profileGain =
      profile === "minimal" ? 0.42 : profile === "soft" ? 0.7 : 1;
    const shapedVolume = Math.max(0.0001, vol * volume * profileGain);
    const shapedType =
      profile === "soft" && type === "square" ? "triangle" : type;
    o.type = shapedType;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo != null)
      o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(shapedVolume, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol = 0.08, delay = 0) {
    const c = ac();
    if (!c || !enabled) return;
    const t0 = c.currentTime + delay;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    const profileGain =
      profile === "minimal" ? 0.35 : profile === "soft" ? 0.6 : 1;
    g.gain.setValueAtTime(Math.max(0.0001, vol * volume * profileGain), t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(g);
    g.connect(c.destination);
    src.start(t0);
  }
  return {
    isOn: () => enabled,
    getVolume: () => volume,
    setVolume(next) {
      volume = Math.max(0, Math.min(1, Number(next) || 0));
      save("sfx-volume", volume);
      return volume;
    },
    getProfile: () => profile,
    setProfile(next) {
      profile = ["minimal", "soft", "arcade"].includes(next) ? next : "soft";
      save("sfx-profile", profile);
      return profile;
    },
    preview() {
      tone(440, 0.08, "sine", 0.08);
      tone(660, 0.12, "sine", 0.07, 0.07);
    },
    toggle() {
      enabled = !enabled;
      save("sfx-on", enabled);
      return enabled;
    },
    unlock() {
      ac();
    },
    click() {
      tone(520, 0.05, "square", 0.06);
    },
    tab() {
      tone(380, 0.06, "triangle", 0.07);
      tone(520, 0.05, "sine", 0.04, 0.04);
    },
    save() {
      tone(440, 0.08, "sine", 0.08);
      tone(660, 0.1, "sine", 0.07, 0.07);
    },
    coin() {
      tone(880, 0.08, "square", 0.07);
      tone(1175, 0.12, "square", 0.06, 0.07);
    },
    equip() {
      tone(300, 0.1, "triangle", 0.08);
      tone(450, 0.12, "sine", 0.07, 0.08);
      tone(600, 0.15, "sine", 0.05, 0.16);
    },
    error() {
      tone(200, 0.15, "sawtooth", 0.08);
      tone(150, 0.2, "sawtooth", 0.06, 0.08);
    },
    confetti() {
      for (let i = 0; i < 6; i++)
        tone(600 + Math.random() * 800, 0.12, "sine", 0.04, i * 0.04);
    },
    secret() {
      tone(523, 0.12, "sine", 0.1);
      tone(659, 0.12, "sine", 0.1, 0.12);
      tone(784, 0.12, "sine", 0.1, 0.24);
      tone(1047, 0.25, "sine", 0.12, 0.36);
    },
    packShake() {
      for (let i = 0; i < 8; i++) noise(0.04, 0.05, i * 0.12);
      for (let i = 0; i < 5; i++)
        tone(120 + i * 20, 0.06, "square", 0.04, i * 0.18);
    },
    packBurst() {
      noise(0.25, 0.14);
      tone(80, 0.3, "sawtooth", 0.12, 0, 40);
      tone(400, 0.15, "square", 0.08, 0.05, 200);
      tone(900, 0.2, "sine", 0.06, 0.08);
    },
    packCard(i = 0) {
      const base = 500 + i * 80;
      tone(base, 0.1, "triangle", 0.09);
      tone(base * 1.5, 0.15, "sine", 0.07, 0.06);
      noise(0.08, 0.04, 0.02);
    },
    enter() {
      tone(220, 0.2, "sine", 0.08, 0, 440);
      tone(440, 0.25, "sine", 0.07, 0.15);
      tone(880, 0.3, "triangle", 0.05, 0.3);
    },
  };
})();
window.SFX = SFX;
function renderSfxButton(on) {
  const btn = document.getElementById("sfx-toggle");
  if (!btn) return;
  btn.dataset.soundOn = String(Boolean(on));
  btn.setAttribute("aria-label", on ? "Sound ausschalten" : "Sound einschalten");
  btn.innerHTML = on
    ? '<svg class="header-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9a5 5 0 010 6M19 6a9 9 0 010 12"/></svg>'
    : '<svg class="header-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 5M22 9l-5 5"/></svg>';
}
function toggleSfx() {
  const on = SFX.toggle();
  renderSfxButton(on);
  if (on)
    try {
      SFX.click();
    } catch (e) {}
}
window.toggleSfx = toggleSfx;
function syncSfxBtn() {
  renderSfxButton(SFX.isOn());
}
