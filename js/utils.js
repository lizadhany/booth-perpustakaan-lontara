/* =====================================================================
   utils.js  —  fungsi bantu kecil yang dipakai semua halaman
   ===================================================================== */

// Ambil elemen HTML dengan selector CSS, contoh: $("#judul")
const $ = (selector, root = document) => root.querySelector(selector);

// Mengamankan teks agar aman dimasukkan ke HTML
const esc = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Mengacak urutan isi array (tanpa mengubah array asli)
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Membuat ID unik sederhana
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Menunggu sekian milidetik (dipakai dengan await)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tombol fullscreen: masuk / keluar
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

// HTML untuk slot logo: tampil gambar jika ada, jika tidak tampil placeholder
function logoHTML(src, label) {
  return src
    ? `<img src="${esc(src)}" alt="${esc(label)}">`
    : `<span>Tempel<br>${esc(label)}<br>di sini</span>`;
}

// Membuat QR code (SVG) dari sebuah URL. Butuh library qrcode-generator (CDN)
function makeQR(url) {
  try {
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  } catch (e) {
    return `<p class="qr-fallback">QR tidak tersedia (offline).<br>${esc(url)}</p>`;
  }
}

/* === TOMBOL SELESAI KE HALAMAN SYARAT === */
document.addEventListener("DOMContentLoaded", () => {
  // Jangan tampilkan tombol di halaman utama (index.html) atau halaman settings
  if (document.getElementById("view-gate") || location.pathname.includes("/settings/")) return;

  const btnSelesai = document.createElement("button");
  btnSelesai.textContent = "✔ Selesai";
  
  Object.assign(btnSelesai.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "99999",
    padding: "12px 24px",
    backgroundColor: "#eab308",
    color: "#0f172a",
    fontWeight: "800",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "16px",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  });

  btnSelesai.addEventListener("click", () => {
    sessionStorage.clear();
    // Naik 2 folder dari games/nama-game/index.html menuju index.html utama (Halaman Syarat)
    window.top.location.href = "../../index.html";
  });

  document.body.appendChild(btnSelesai);
});