/* =====================================================================
   app.js  —  logika halaman utama (index.html):
   Gerbang syarat → Opening → Hub pilihan game
   ===================================================================== */

(async function () {
  const data = await Store.init();

  /* ---------- Berpindah antar "view" ----------
     Tahap terakhir disimpan di sessionStorage, jadi saat kembali dari
     game atau pengaturan, pengunjung langsung ke Hub (bukan ke gerbang lagi). */
  const VIEWS = ["gate", "opening", "hub"];
  function showView(name) {
    VIEWS.forEach((v) => { $("#view-" + v).hidden = v !== name; });
    sessionStorage.setItem("bi_stage", name);
    window.scrollTo(0, 0);
  }

  /* ---------- 1. Gerbang syarat ---------- */
  $("#qr-ig").innerHTML = makeQR(CONFIG.IG_URL);
  $("#qr-ibi").innerHTML = makeQR(CONFIG.IBI_URL);
  $("#txt-ig").textContent = CONFIG.IG_URL;
  $("#link-ibi").href = CONFIG.IBI_URL;

  const chkIg = $("#chk-ig");
  const chkIbi = $("#chk-ibi");
  const btnNext = $("#btn-gate-next");
  const updateGate = () => { btnNext.disabled = !(chkIg.checked && chkIbi.checked); };
  chkIg.addEventListener("change", updateGate);
  chkIbi.addEventListener("change", updateGate);
  btnNext.addEventListener("click", () => { Sound.unlock(); Sound.click(); showView("opening"); });
  $("#btn-skip").addEventListener("click", () => showView("opening"));

  /* ---------- 2. Opening (logo) ---------- */
  $("#logo-bi").innerHTML = logoHTML(data.cfg.logoBI || CONFIG.LOGO_BI, "Logo Bank Indonesia");
  $("#logo-perpus").innerHTML = logoHTML(data.cfg.logoLib || CONFIG.LOGO_PERPUS, "Logo Perpustakaan");
  $("#btn-start").addEventListener("click", () => { Sound.unlock(); Sound.reveal(); showView("hub"); });

  /* ---------- 3. Hub ---------- */
  const cards = GAMES.map((g) =>
    `<a class="card game-card" href="${esc(g.path)}">
       <div class="icon">${g.icon}</div>
       <h2>${esc(g.title)}</h2>
       <p>${esc(g.desc)}</p>
       <span class="btn gold">Main sekarang</span>
     </a>`
  ).join("");
  const comingSoon =
    `<div class="card game-card soon">
       <div class="icon">⏳</div><h2>Segera hadir</h2><p>Game selanjutnya sedang disiapkan.</p>
     </div>`;
  $("#game-list").innerHTML = cards + comingSoon;

  const btnSound = $("#btn-sound");
  const refreshSound = () => { btnSound.textContent = Sound.enabled ? "🔊 Suara ON" : "🔇 Suara OFF"; };
  btnSound.addEventListener("click", () => { Sound.toggle(); refreshSound(); Sound.click(); });
  $("#btn-fs").addEventListener("click", toggleFullscreen);
  refreshSound();

  /* ---------- Mulai dari tahap yang tersimpan ---------- */
  showView(sessionStorage.getItem("bi_stage") || "gate");
})();
