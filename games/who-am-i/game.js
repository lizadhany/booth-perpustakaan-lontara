/* =====================================================================
   game.js (Who Am I?)
   Alur: Petunjuk 1..3 (baca + 3 dtk jawab) -> Layar blur countdown 5 dtk -> Jawaban
   ===================================================================== */

(async function () {
  const data = await Store.init();
  const questions = data.wai;

  const elClues = $("#clues");
  const elStatus = $("#status");
  const elLabel = $("#status-label");
  const elNum = $("#status-num");
  const elBar = $("#bar-fill");

  let deck = [];
  let index = 0;
  let current = null;
  let runId = 0;

  function newDeck() { deck = shuffle(questions.map((q) => q.id)); index = 0; }
  function pickQuestion() {
    current = questions.find((q) => q.id === deck[index % deck.length]);
    $("#round-label").textContent = "Ronde " + (index + 1);
  }

  function drawClues(opened, now) {
    elClues.innerHTML = [0, 1, 2].map((i) => {
      if (i < opened) {
        return `<div class="clue on ${i === now ? "now" : ""}"><small>Petunjuk ${i + 1}</small><p>${esc(current.h[i])}</p></div>`;
      }
      return `<div class="clue off"><small>Petunjuk ${i + 1}</small><p>🔒 Belum dibuka</p></div>`;
    }).join("");
  }

  function animateBar(sec) {
    elBar.style.transition = "none";
    elBar.style.width = "100%";
    void elBar.offsetWidth;
    elBar.style.transition = `width ${sec}s linear`;
    elBar.style.width = "0%";
  }

  async function countdown(seconds, myRun, onTick) {
    for (let s = seconds; s > 0; s--) {
      if (myRun !== runId) return false;
      onTick(s);
      await sleep(1000);
    }
    return myRun === runId;
  }

  async function playRound() {
    if (typeof Sound !== "undefined" && Sound.unlock) Sound.unlock();
    const myRun = ++runId;
    $("#start-overlay").hidden = true;
    $("#count-overlay").hidden = true;
    $("#reveal-overlay").hidden = true;
    pickQuestion();
    drawClues(0, -1);

    for (let i = 0; i < 3; i++) {
      // Tahap A: petunjuk tampil
      drawClues(i + 1, i);
      Sound.hint();
      elStatus.classList.remove("wait");
      elLabel.textContent = `Petunjuk ${i + 1}: baca dan pikirkan...`;
      animateBar(CONFIG.G2_CLUE_SECONDS);
      const okA = await countdown(CONFIG.G2_CLUE_SECONDS, myRun, (s) => {
        elNum.textContent = s;
        s <= 2 ? Sound.tickLast() : Sound.tick();
      });
      if (!okA) return;

      // Tahap B: 3 detik menunggu peserta menjawab
      elStatus.classList.add("wait");
      elLabel.textContent = "Ayo jawab sekarang!";
      animateBar(CONFIG.G2_WAIT_SECONDS);
      Sound.riser(CONFIG.G2_WAIT_SECONDS);
      const okB = await countdown(CONFIG.G2_WAIT_SECONDS, myRun, (s) => {
        elNum.textContent = s;
        Sound.heartbeat();
      });
      if (!okB) return;
    }

    // Tahap C: Countdown layar penuh 5 detik (latar belakang blur) setelah petunjuk ke-3
    Sound.timeup();
    $("#count-overlay").hidden = false;
    Sound.riser(5);
    const okC = await countdown(5, myRun, (s) => {
      $("#count-num").textContent = s;
      Sound.heartbeat();
    });
    $("#count-overlay").hidden = true;
    if (!okC) return;

    reveal();
  }

  function reveal() {
    runId++;
    elStatus.classList.remove("wait");
    $("#count-overlay").hidden = true;
    $("#reveal-answer").textContent = current.a;
    $("#reveal-explain").textContent = current.e;
    $("#reveal-overlay").hidden = false;
    Sound.reveal();
  }

  function showCurrentRevealIfNeeded() { if (current) reveal(); }
  function nextRound() { index++; if (index >= deck.length) newDeck(); playRound(); }

  $("#btn-answer").addEventListener("click", showCurrentRevealIfNeeded);
  $("#btn-next").addEventListener("click", nextRound);
  $("#btn-next2").addEventListener("click", nextRound);
  $("#btn-reset").addEventListener("click", playRound);
  $("#btn-reset2").addEventListener("click", playRound);

  if (!questions.length) {
    $("#start-overlay .lead").textContent = "Belum ada soal. Tambahkan lewat ikon ⚙️ Pengaturan di Hub.";
    $("#btn-start").hidden = true;
  } else {
    newDeck();
    drawClues(0, -1);
    $("#btn-start").addEventListener("click", playRound);
  }
})();