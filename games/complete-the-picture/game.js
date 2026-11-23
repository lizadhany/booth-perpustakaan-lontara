/* =====================================================================
   game.js (Complete the Picture) — 1 ronde per pengunjung (SVG Jigsaw 4x4)
   ===================================================================== */

(async function () {
  try {
    const data = await Store.init();
    const pics = data.pics || [];

    const SIZE = 4;
    const TOTAL = SIZE * SIZE;
    const CELL = 100;

    const elTimer = $("#timer");
    const btnRandom = $("#btn-random");
    const btnAnswer = $("#btn-answer");

    let current = null;
    let opened = new Set();
    let timeLeft = 0;
    let randomLeft = 0;
    let timer = null;
    let state = "idle";

    function getNextPictureId(key, ids) {
      if (typeof nextFromQueue === "function") return nextFromQueue(key, ids);
      let q = [];
      try { q = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}
      q = q.filter((id) => ids.includes(id));
      if (!q.length) q = shuffle([...ids]);
      const next = q.shift();
      localStorage.setItem(key, JSON.stringify(q));
      return next;
    }

    if (pics.length) {
      const id = getNextPictureId("bi_g1_queue", pics.map((p) => p.id));
      current = pics.find((p) => p.id === id) || pics[0];
    }

    const hDir = (r, c) => ((r + c) % 2 === 0 ? 1 : -1);
    const vDir = (r, c) => ((r + c) % 2 === 0 ? 1 : -1);

    function knobEdge(ax, ay, bx, by, nx, ny) {
      const dx = bx - ax, dy = by - ay;
      const P = (u, v) => (ax + dx * u + nx * v * CELL).toFixed(1) + " " + (ay + dy * u + ny * v * CELL).toFixed(1);
      return `L${P(0.4, 0)} C${P(0.4, 0.08)} ${P(0.33, 0.1)} ${P(0.33, 0.18)} ` +
             `C${P(0.33, 0.28)} ${P(0.67, 0.28)} ${P(0.67, 0.18)} ` +
             `C${P(0.67, 0.1)} ${P(0.6, 0.08)} ${P(0.6, 0)} L${bx} ${by} `;
    }

    function piecePath(r, c) {
      const x0 = c * CELL, y0 = r * CELL, x1 = x0 + CELL, y1 = y0 + CELL;
      let d = `M${x0} ${y0} `;
      d += r > 0        ? knobEdge(x0, y0, x1, y0, 0, hDir(r - 1, c)) : `L${x1} ${y0} `;
      d += c < SIZE - 1 ? knobEdge(x1, y0, x1, y1, vDir(r, c), 0)     : `L${x1} ${y1} `;
      d += r < SIZE - 1 ? knobEdge(x1, y1, x0, y1, 0, hDir(r, c))     : `L${x0} ${y1} `;
      d += c > 0        ? knobEdge(x0, y1, x0, y0, vDir(r, c - 1), 0) : `L${x0} ${y0} `;
      return d + "Z";
    }

    function buildBoard() {
      $("#pic").src = current.src;
      let html = `<defs><linearGradient id="pieceFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1f5fb8"/><stop offset="1" stop-color="#0a1b4a"/></linearGradient></defs>`;
      for (let i = 0; i < TOTAL; i++) {
        const r = Math.floor(i / SIZE), c = i % SIZE;
        html += `<g class="piece ${opened.has(i) ? "gone" : ""}" id="pc${i}" aria-label="Potongan ${i + 1}">
          <path d="${piecePath(r, c)}" fill="url(#pieceFill)"/>
          <text x="${c * CELL + CELL / 2}" y="${r * CELL + CELL / 2}">${i + 1}</text></g>`;
      }
      $("#puzzle").innerHTML = html;
    }

    function openRandomPieces(n) {
      const closed = [...Array(TOTAL).keys()].filter((i) => !opened.has(i));
      shuffle(closed).slice(0, n).forEach((i) => opened.add(i));
    }

    function updateHud() {
      elTimer.textContent = timeLeft;
      elTimer.classList.toggle("low", state === "playing" && timeLeft <= 5);
      btnRandom.textContent = `Buka Acak ${randomLeft}/${CONFIG.G1_RANDOM_MAX}`;
      btnRandom.disabled = state !== "playing" || randomLeft <= 0;
      btnAnswer.disabled = state !== "playing";
    }

    function startRound() {
      if (typeof Sound !== "undefined" && Sound.unlock) Sound.unlock();
      opened = new Set();
      openRandomPieces(CONFIG.G1_INITIAL_OPEN);
      randomLeft = CONFIG.G1_RANDOM_MAX;
      timeLeft = CONFIG.G1_SECONDS;
      state = "playing";
      $("#start-overlay").hidden = true;
      buildBoard();
      updateHud();

      timer = setInterval(() => {
        timeLeft--;
        updateHud();
        if (timeLeft <= 0) endRound(true);
        else if (timeLeft <= 5) Sound.tickLast();
        else Sound.tick();
      }, 1000);
    }

    function openRandomButton() {
      if (state !== "playing" || randomLeft <= 0) return;
      const before = new Set(opened);
      randomLeft--;
      openRandomPieces(1);
      opened.forEach((i) => { if (!before.has(i)) $("#pc" + i).classList.add("gone"); });
      Sound.click();
      updateHud();
    }

    async function endRound(timeUp) {
      if (state !== "playing") return;
      clearInterval(timer);
      state = "counting";
      updateHud();

      $("#count-title").textContent = timeUp ? "Waktu habis! Ayo jawab sekarang!" : "Siap-siap, jawaban segera dibuka!";
      $("#count-overlay").hidden = false;
      if (timeUp) Sound.timeup();

      const total = CONFIG.G1_REVEAL_COUNTDOWN;
      for (let s = total; s > 0; s--) {
        $("#count-num").textContent = s;
        if (typeof Sound.pulse === "function") Sound.pulse(total - s + 1, total);
        else Sound.heartbeat();
        await sleep(1000);
      }
      $("#count-overlay").hidden = true;
      reveal();
    }

    function reveal() {
      state = "revealed";
      for (let i = 0; i < TOTAL; i++) $("#pc" + i).classList.add("gone");
      $("#answer-name").textContent = current.name;
      $("#answer-info").textContent = current.info;
      $("#answer-column").hidden = false;
      $("#stage").classList.add("revealed");
      elTimer.hidden = true;
      $("#controls").hidden = true;
      $("#end-controls").hidden = false;
      Sound.reveal();
    }

    btnRandom.addEventListener("click", openRandomButton);
    btnAnswer.addEventListener("click", () => endRound(false));

    if (!current) {
      $("#start-text").textContent = "Belum ada gambar. Tambahkan lewat ikon ⚙️ Pengaturan di Hub.";
      $("#btn-start").hidden = true;
    } else {
      $("#btn-start").addEventListener("click", startRound);
    }
    updateHud();
  } catch (err) {
    console.error("Error game:", err);
    alert("Terjadi error: " + err.message);
  }
})();