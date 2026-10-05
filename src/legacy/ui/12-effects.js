// ==================== 05.12 · CONFETTI & VISUELLE EFFEKTE ====================
const confettiCanvas = document.getElementById("confetti-canvas"),
  confettiCtx = confettiCanvas?.getContext("2d");
function resizeConfetti() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}
window.addEventListener("resize", resizeConfetti);
resizeConfetti();
function launchConfetti() {
  if (!confettiCtx) return;
  let particles = [];
  const colors = [
    "#FFFFFF",
    "#A78BFA",
    "#FBBF24",
    "#F472B6",
    "#60A5FA",
    "#34D399",
  ];
  for (let i = 0; i < 50; i++)
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 80,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 4,
      life: 1,
    });
  (function frame() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.11;
      p.rot += p.vr;
      p.life -= 0.013;
      if (p.life > 0) {
        alive = true;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rot * Math.PI) / 180);
        confettiCtx.globalAlpha = p.life;
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        confettiCtx.restore();
      }
    });
    if (alive) requestAnimationFrame(frame);
    else
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  })();
}
