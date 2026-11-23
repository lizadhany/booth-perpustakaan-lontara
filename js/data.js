/* =====================================================================
   data.js  —  data soal bawaan + penyimpanan (IndexedDB)
   Semua halaman (hub, game, pengaturan) membaca data dari sini,
   jadi perubahan di halaman Pengaturan langsung dipakai kedua game.
   ===================================================================== */

/* ---------- Pembuat gambar SVG sederhana (untuk soal bawaan) ---------- */
const svgURI = (inner) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' + inner + "</svg>");
const svgText = (x, y, size, text, fill = "#fff") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="800" font-family="Arial,sans-serif" text-anchor="middle" fill="${fill}">${text}</text>`;

// Ilustrasi kode QR sederhana untuk soal QRIS
function qrArt() {
  const finder = (x, y) =>
    `<rect x="${x}" y="${y}" width="56" height="56" fill="#10213F"/><rect x="${x + 8}" y="${y + 8}" width="40" height="40" fill="#fff"/><rect x="${x + 16}" y="${y + 16}" width="24" height="24" fill="#10213F"/>`;
  let dots = "";
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8);
      if (!inFinder && (r * 7 + c * 13 + r * c) % 3 === 0)
        dots += `<rect x="${116 + c * 8}" y="${40 + r * 8}" width="8" height="8" fill="#10213F"/>`;
    }
  }
  return '<rect width="400" height="400" fill="#fff"/>' + dots + finder(116, 40) + finder(228, 40) + finder(116, 152) +
    '<rect x="60" y="250" width="280" height="90" rx="16" fill="#D93B3B"/>' + svgText(200, 318, 64, "QRIS");
}

/* ---------- Soal bawaan: Complete the Picture ---------- */
function defaultPics() {
  return [
    { id: "p1", name: "Uang Kertas Rupiah",
      info: "Rupiah adalah mata uang sah Indonesia. Kenali keasliannya dengan 3D: Dilihat, Diraba, Diterawang.",
      src: svgURI('<rect width="400" height="400" fill="#DCEBFA"/><rect x="40" y="110" width="320" height="180" rx="14" fill="#2F6FB5" stroke="#10213F" stroke-width="6"/><rect x="56" y="126" width="288" height="148" rx="8" fill="none" stroke="#fff" stroke-width="3"/><circle cx="200" cy="200" r="52" fill="#F4B63D" stroke="#10213F" stroke-width="5"/>' + svgText(200, 218, 46, "Rp", "#10213F") + svgText(110, 160, 24, "100.000") + svgText(290, 258, 24, "100.000")) },
    { id: "p2", name: "Uang Logam Rupiah",
      info: "Selain uang kertas, Rupiah juga berbentuk logam. Bank Indonesia adalah satu-satunya lembaga yang berwenang mengedarkan Rupiah.",
      src: svgURI('<rect width="400" height="400" fill="#FFF1D0"/><circle cx="200" cy="200" r="130" fill="#E2A93A" stroke="#10213F" stroke-width="8"/><circle cx="200" cy="200" r="104" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/>' + svgText(200, 228, 90, "500", "#10213F") + svgText(200, 292, 28, "RUPIAH", "#10213F")) },
    { id: "p3", name: "QRIS",
      info: "QRIS (QR Code Indonesian Standard) menyatukan banyak kode QR pembayaran menjadi satu. Cepat, mudah, dan aman.",
      src: svgURI(qrArt()) },
    { id: "p4", name: "Gedung Bank Indonesia",
      info: "Bank Indonesia adalah bank sentral Republik Indonesia yang menjaga stabilitas nilai Rupiah dan sistem pembayaran.",
      src: svgURI('<rect width="400" height="400" fill="#CFE3F7"/><circle cx="330" cy="70" r="34" fill="#F4B63D"/><polygon points="50,150 200,70 350,150" fill="#0A2A5E"/><rect x="50" y="150" width="300" height="16" fill="#10213F"/>' + [85, 140, 195, 250, 305].map((x) => `<rect x="${x - 12}" y="170" width="26" height="120" fill="#fff" stroke="#10213F" stroke-width="4"/>`).join("") + '<rect x="40" y="290" width="320" height="20" fill="#10213F"/><rect x="25" y="310" width="350" height="24" fill="#0A2A5E"/><rect x="10" y="334" width="380" height="26" fill="#10213F"/>') },
    { id: "p5", name: "Pembayaran Digital",
      info: "Sistem pembayaran digital membuat transaksi lebih cepat dan efisien. Bank Indonesia mengatur dan mengawasinya agar aman dan lancar.",
      src: svgURI('<rect width="400" height="400" fill="#E3F6EE"/><rect x="130" y="30" width="140" height="340" rx="26" fill="#10213F"/><rect x="142" y="58" width="116" height="284" rx="10" fill="#fff"/><circle cx="200" cy="140" r="42" fill="#1FA37A"/><polyline points="180,140 196,158 224,122" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' + svgText(200, 240, 26, "Berhasil", "#10213F") + svgText(200, 282, 24, "Rp 25.000", "#1FA37A")) }
  ];
}

/* ---------- Soal bawaan: Who Am I? ----------
   a = jawaban, h = 3 petunjuk, e = penjelasan korelasi petunjuk dengan jawaban */
function defaultWai() {
  return [
    { id: "w1", a: "Bank Indonesia",
      h: ["Saya lembaga negara yang independen.", "Tugas saya menjaga stabilitas nilai Rupiah dan sistem pembayaran.", "Saya bank sentral Republik Indonesia."],
      e: "Petunjuk 1 dan 2 menggambarkan ciri khas bank sentral: independen, menjaga nilai Rupiah, dan mengatur sistem pembayaran. Petunjuk 3 menyebutnya langsung. Semuanya mengarah ke Bank Indonesia." },
    { id: "w2", a: "Rupiah",
      h: ["Saya alat pembayaran yang sah di Indonesia.", "Wujud saya ada kertas, logam, dan digital.", "Keaslian saya dikenali dengan 3D: Dilihat, Diraba, Diterawang."],
      e: "Alat pembayaran sah di Indonesia yang berwujud kertas, logam, dan digital hanyalah Rupiah. Ciri keaslian 3D pada petunjuk 3 adalah cara mengenali uang Rupiah yang asli." },
    { id: "w3", a: "Inflasi",
      h: ["Saya naik ketika harga barang dan jasa naik terus-menerus.", "Jika saya terlalu tinggi, uangmu terasa makin kecil nilainya.", "Bank Indonesia berusaha menjaga saya tetap rendah dan stabil."],
      e: "Kenaikan harga yang terus-menerus (petunjuk 1) membuat nilai uang terasa menurun (petunjuk 2). Itulah inflasi, yang karena dampaknya perlu dijaga stabil oleh Bank Indonesia (petunjuk 3)." },
    { id: "w4", a: "QRIS",
      h: ["Saya satu kode untuk banyak aplikasi pembayaran.", "Cukup pindai saya dengan ponsel untuk membayar.", "Nama lengkap saya Quick Response Code Indonesian Standard."],
      e: "Satu kode untuk banyak aplikasi, dibayar dengan memindai, dan bernama lengkap Quick Response Code Indonesian Standard: ketiganya menunjuk ke QRIS, standar QR pembayaran nasional." },
    { id: "w5", a: "BI-Rate",
      h: ["Saya suku bunga acuan.", "Saya diumumkan Bank Indonesia setelah Rapat Dewan Gubernur.", "Naik-turun saya memengaruhi bunga kredit dan tabungan."],
      e: "Suku bunga acuan yang diumumkan Bank Indonesia (petunjuk 1 dan 2) dan menjadi patokan bunga kredit serta tabungan (petunjuk 3) adalah BI-Rate." },
    { id: "w6", a: "Daya Beli",
      h: ["Saya kemampuan uangmu untuk membeli barang dan jasa.", "Jika harga naik tetapi penghasilan tetap, saya melemah.", "Inflasi yang tinggi bisa menggerogoti saya."],
      e: "Kemampuan membeli barang dan jasa (petunjuk 1) melemah saat harga naik dan penghasilan tetap (petunjuk 2), terutama ketika inflasi tinggi (petunjuk 3). Itu yang disebut daya beli." },
    { id: "w7", a: "Kebijakan Moneter",
      h: ["Saya dijalankan oleh bank sentral.", "Alat saya antara lain suku bunga dan operasi pasar.", "Tujuan saya menjaga inflasi dan nilai tukar Rupiah tetap stabil."],
      e: "Langkah bank sentral memakai suku bunga dan operasi pasar untuk menjaga inflasi dan nilai tukar tetap stabil dikenal sebagai kebijakan moneter." },
    { id: "w8", a: "Cinta, Bangga, Paham Rupiah",
      h: ["Saya gerakan nasional dari Bank Indonesia.", "Saya mengajak masyarakat menghargai mata uangnya sendiri.", "Singkatan saya CBP Rupiah."],
      e: "Gerakan dari Bank Indonesia yang mengajak masyarakat menghargai Rupiah, dengan singkatan CBP, adalah Cinta, Bangga, Paham Rupiah: mencintai, bangga memakai, dan paham ciri keasliannya." }
  ];
}

function defaultCfg() {
  return { logoBI: "", logoLib: "" };
}

/* ---------- Penyimpanan IndexedDB ----------
   Dipakai agar foto besar tidak membuat penyimpanan penuh seperti LocalStorage.
   Cara pakai di halaman lain:  const data = await Store.init();
   lalu ubah data.wai / data.pics / data.cfg dan panggil  await Store.save(); */
const Store = {
  db: null,
  mem: {},      // cadangan jika IndexedDB diblokir browser
  data: null,

  open() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open("bi-booth", 1);
        req.onupgradeneeded = () => req.result.createObjectStore("kv");
        req.onsuccess = () => { this.db = req.result; resolve(); };
        req.onerror = () => resolve();
      } catch (e) { resolve(); }
    });
  },
  get(key) {
    return new Promise((resolve) => {
      if (!this.db) return resolve(this.mem[key]);
      const req = this.db.transaction("kv").objectStore("kv").get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });
  },
  put(key, value) {
    return new Promise((resolve) => {
      if (!this.db) { this.mem[key] = value; return resolve(); }
      const tx = this.db.transaction("kv", "readwrite");
      tx.objectStore("kv").put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  },

  // Memuat data (atau memakai data bawaan jika masih kosong)
  async init() {
    if (this.data) return this.data;
    await this.open();
    const [cfg, wai, pics] = await Promise.all([this.get("cfg"), this.get("wai"), this.get("pics")]);
    this.data = { cfg: { ...defaultCfg(), ...(cfg || {}) }, wai: wai || defaultWai(), pics: pics || defaultPics() };
    if (!wai || !pics) await this.save();
    return this.data;
  },
  save() {
    return Promise.all([this.put("cfg", this.data.cfg), this.put("wai", this.data.wai), this.put("pics", this.data.pics)]);
  }
};
