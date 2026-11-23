/* =====================================================================
   config.js  —  SATU-SATUNYA FILE YANG PERLU ANDA UBAH UNTUK PENGATURAN DASAR
   ===================================================================== */

const CONFIG = {

  /* ---------- 1. LINK GERBANG SYARAT (ISI MANUAL DI SINI) ----------
     Ganti dua URL di bawah ini. QR code di halaman gerbang akan
     otomatis mengikuti URL yang Anda isi. */
  IG_URL:  "https://www.instagram.com/perpustakaanbisulsel?avpt=M3N5OWYzcjdxMXNo",   // <-- URL Instagram Perpustakaan
  IBI_URL: "https://q.me-qr.com/0ksu1jqq",       // <-- URL IBI Library

  /* ---------- 2. LOGO (PLACEHOLDER) ----------
     Cara mengganti logo:
     a) Taruh file logo di folder assets/, misalnya assets/logo-bi.png
        dan assets/logo-perpus.png, lalu isi path-nya di bawah.
        Contoh: LOGO_BI: "assets/logo-bi.png"
     b) ATAU unggah lewat halaman Pengaturan (ikon gear) → tab "Logo & Data".
     Dibiarkan kosong ("") = tampil kotak placeholder. */
  LOGO_BI:    "",   // <-- path logo Bank Indonesia
  LOGO_PERPUS: "",  // <-- path logo Perpustakaan

  /* ---------- 3. PENGATURAN GAME 1: Complete the Picture ---------- */
  G1_SECONDS: 15,          // durasi ronde (detik)
  G1_INITIAL_OPEN: 6,      // jumlah kotak yang sudah terbuka acak saat ronde mulai
  G1_RANDOM_MAX: 2,        // batas pemakaian tombol "Buka Acak" per ronde
  G1_REVEAL_COUNTDOWN: 5,  // countdown layar penuh sebelum jawaban muncul (detik)

  /* ---------- 4. PENGATURAN GAME 2: Who Am I? ---------- */
  G2_CLUE_SECONDS: 5,      // timer tiap petunjuk (detik)
  G2_WAIT_SECONDS: 3,      // countdown menunggu jawaban setelah timer petunjuk habis

  /* ---------- 5. TEKS HADIAH ---------- */
  REWARD_TEXT: "Peserta yang berhasil menjawab berhak mendapatkan merchandise dari panitia (sesuai konfirmasi operator)."
};

/* ---------- DAFTAR GAME (MODULAR) ----------
   Cara menambah game baru:
   1. Buat folder baru, misalnya games/nama-game/ berisi index.html + game.js
   2. Tambahkan satu baris di bawah ini. Hub akan menampilkannya otomatis. */
const GAMES = [
  { icon: "🧩", title: "Complete the Picture", desc: "Buka kotak dan tebak gambarnya sebelum waktu habis!", path: "games/complete-the-picture/index.html" },
  { icon: "🕵️", title: "Who Am I?", desc: "Tebak istilah seputar Bank Indonesia dari 3 petunjuk bertahap.", path: "games/who-am-i/index.html" }
  // { icon: "🎯", title: "Nama Game Baru", desc: "Deskripsi singkat.", path: "games/nama-game/index.html" },
];
