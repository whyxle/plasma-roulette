(function () {
  const sectors = ["0", "10.000", "25.000", "50.000", "100.000", "250.000", "500.000"];
  const baseColors = ["#052f3f", "#063e55", "#094f6a", "#0b6b8a", "#1b7fc0", "#5b8bff", "#7bd3ff"];
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const log = document.getElementById("log");
  const resultEl = document.getElementById("result");
  const centerBadge = document.getElementById("centerBadge");

  let isSpinning = false;
  let currentRotation = 0;

  function resizeCanvas() {
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawWheel() {
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.width / ratio;
    const h = canvas.height / ratio;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 28;
    const slice = (2 * Math.PI) / sectors.length;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(6,20,40,0.28)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(currentRotation);

    for (let i = 0; i < sectors.length; i += 1) {
      const start = i * slice;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, start + slice, false);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        Math.cos(start) * -radius,
        Math.sin(start) * -radius,
        Math.cos(start + slice) * radius,
        Math.sin(start + slice) * radius,
      );
      gradient.addColorStop(0, baseColors[i % baseColors.length]);
      gradient.addColorStop(1, "#021623");
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = "rgba(80,170,255,0.12)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      const angle = start + slice / 2;
      ctx.rotate(angle);
      ctx.translate(radius * 0.58, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "#e8fbff";
      ctx.font = `700 ${Math.max(12, Math.round(radius * 0.11))}px Inter, Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sectors[i], 0, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    const glow = ctx.createRadialGradient(0, 0, 12, 0, 0, radius * 0.45);
    glow.addColorStop(0, "rgba(255,255,255,0.15)");
    glow.addColorStop(0.4, "rgba(255,255,255,0.06)");
    glow.addColorStop(1, "rgba(1,10,20,0.6)");
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.restore();
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  async function spin() {
    if (!window.plasmaGiveaway?.spinAllowed) {
      window.setPlasmaStatus?.("введите данные", "error");
      log.textContent = "Введите данные";
      centerBadge.classList.remove("shake");
      void centerBadge.offsetWidth;
      centerBadge.classList.add("shake");
      setTimeout(() => centerBadge.classList.remove("shake"), 600);
      return;
    }

    if (isSpinning) return;

    isSpinning = true;
    centerBadge.textContent = "КРУТИМ...";
    centerBadge.setAttribute("aria-pressed", "true");
    resultEl.textContent = "Результат: -";
    log.textContent = "Начинаем крутить...";

    const slice = (2 * Math.PI) / sectors.length;
    const targetIndex = 0;
    const baseRotation = -Math.PI / 2 - (targetIndex * slice + slice / 2);
    const rounds = 7 + Math.floor(Math.random() * 3);
    const targetRotation = rounds * 2 * Math.PI + baseRotation;
    const startRotation = currentRotation % (2 * Math.PI);
    const endRotation = startRotation + targetRotation;
    const duration = 4100 + Math.floor(Math.random() * 700);
    const startTime = performance.now();

    return new Promise((resolve) => {
      function frame(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = easeOutCubic(t);
        currentRotation = startRotation + (endRotation - startRotation) * eased;
        drawWheel();

        if (t < 1) {
          requestAnimationFrame(frame);
          return;
        }

        drawWheel();
        centerBadge.textContent = "0";
        centerBadge.setAttribute("aria-pressed", "false");
        resultEl.textContent = "Результат: 0 плазмы";
        log.textContent = "Выпало: 0 плазмы";
        isSpinning = false;
        resolve();
      }

      requestAnimationFrame(frame);
    });
  }

  centerBadge.addEventListener("click", () => {
    window.triggerSpin?.();
  });

  function refresh() {
    resizeCanvas();
    drawWheel();
  }

  window.triggerSpin = spin;
  window.addEventListener("resize", refresh);
  refresh();
})();
