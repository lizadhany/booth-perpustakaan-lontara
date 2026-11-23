/* =====================================================================
   sound.js  —  semua efek suara dibuat dengan Web Audio API
   (tidak ada file audio luar, jadi tidak ada risiko error 404)
   Cara pakai:  Sound.click();  Sound.heartbeat();  Sound.reveal(); dst.
   ===================================================================== */

const Sound = {
  ctx: null,
  enabled: localStorage.getItem("bi_sound") !== "off",

  // Browser mewajibkan suara dimulai setelah klik. Panggil ini saat tombol diklik.
  unlock() {
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
    } catch (e) {}
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("bi_sound", this.enabled ? "on" : "off");
    return this.enabled;
  },

  // Satu nada: frekuensi, durasi, jenis gelombang, volume, jeda mulai, (opsional) frekuensi akhir
  tone(freq, dur = 0.12, type = "sine", vol = 0.15, delay = 0, slideTo = null) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  },

  click()    { this.tone(520, 0.09, "triangle", 0.15); },
  tick()     { this.tone(900, 0.05, "square", 0.05); },
  tickLast() { this.tone(1300, 0.09, "square", 0.1); },
  hint()     { this.tone(660, 0.1, "triangle", 0.15); this.tone(880, 0.14, "triangle", 0.15, 0.1); },

  // Detak jantung "dug-dug" yang menegangkan (panggil sekali per detik)
  heartbeat() {
    this.tone(90, 0.16, "sine", 0.6, 0, 45);
    this.tone(80, 0.2, "sine", 0.45, 0.18, 40);
  },

  // Suara naik (riser) yang makin tinggi selama beberapa detik
  riser(seconds = 5) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";                                         // gelombang halus (bukan sawtooth)
    osc.frequency.setValueAtTime(180, t);                      // nada awal hangat
    osc.frequency.exponentialRampToValueAtTime(420, t + seconds); // naik lembut, tidak melengking
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.06, t + seconds * 0.85);
    gain.gain.linearRampToValueAtTime(0.001, t + seconds);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + seconds);
  },
  
  // Waktu habis: alarm turun
  timeup() {
    [420, 320, 220].forEach((f, i) => this.tone(f, 0.28, "sawtooth", 0.14, i * 0.22));
  },

  // Reveal jawaban: hantaman keras lalu fanfare naik
  reveal() {
    this.tone(70, 0.5, "sine", 0.7, 0, 35);
    this.tone(120, 0.4, "sawtooth", 0.2, 0);
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.28, "triangle", 0.17, 0.12 + i * 0.1));
  }
};
