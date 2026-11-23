/* =====================================================================
   settings.js  —  halaman Pengaturan & Kelola Materi (digabung)
   Tab 1: soal Who Am I?  |  Tab 2: gambar Complete the Picture
   Tab 3: logo, Export/Import JSON, reset data
   ===================================================================== */

let data;               // seluruh data aplikasi (dari Store)
let tab = "wai";        // tab yang sedang aktif
let editing = null;     // null = tidak edit, "new" = soal baru, angka = indeks soal

const TABS = [
  ["wai", "Soal Who Am I?"],
  ["pics", "Gambar Complete the Picture"],
  ["misc", "Logo & Data"]
];

/* ---------- Menggambar halaman ---------- */
function render() {
  $("#tabs").innerHTML = TABS.map(([id, name]) =>
    `<button class="tab ${tab === id ? "on" : ""}" onclick="tab='${id}';editing=null;render()">${name}</button>`
  ).join("");
  $("#panel").innerHTML = tab === "wai" ? viewWai() : tab === "pics" ? viewPics() : viewMisc();
}

/* ---------- TAB 1: Soal Who Am I? ---------- */
function viewWai() {
  let form = "";
  if (editing !== null) {
    const q = editing === "new" ? { a: "", h: ["", "", ""], e: "" } : data.wai[editing];
    form = `<div class="row" style="display:block">
      <h3>${editing === "new" ? "Soal baru" : "Edit soal"}</h3>
      <label class="lbl">Jawaban</label><input id="f-a" class="fld" value="${esc(q.a)}">
      ${[0, 1, 2].map((i) => `<label class="lbl">Petunjuk ${i + 1}</label><input id="f-h${i}" class="fld" value="${esc(q.h[i])}">`).join("")}
      <label class="lbl">Penjelasan (kaitkan petunjuk dengan jawaban)</label>
      <textarea id="f-e" class="fld" rows="3">${esc(q.e)}</textarea>
      <button class="btn mint" onclick="saveWai()">Simpan</button>
      <button class="btn" onclick="editing=null;render()">Batal</button></div>`;
  }
  const list = data.wai.map((q, i) =>
    `<div class="row"><div><b>${esc(q.a)}</b><div class="note">${esc(q.h[0])}</div></div>
     <div class="actions"><button class="btn small" onclick="editing=${i};render()">Edit</button>
     <button class="btn small red" onclick="deleteWai(${i})">Hapus</button></div></div>`
  ).join("");
  return form + `<button class="btn gold" onclick="editing='new';render()">+ Tambah soal</button>` + list;
}

async function saveWai() {
  const item = {
    id: editing === "new" ? uid() : data.wai[editing].id,
    a: $("#f-a").value.trim(),
    h: [0, 1, 2].map((i) => $("#f-h" + i).value.trim()),
    e: $("#f-e").value.trim()
  };
  if (!item.a || item.h.some((x) => !x)) return alert("Jawaban dan ketiga petunjuk wajib diisi.");
  if (editing === "new") data.wai.push(item); else data.wai[editing] = item;
  editing = null;
  await Store.save();
  render();
}
async function deleteWai(i) {
  if (!confirm("Hapus soal ini?")) return;
  data.wai.splice(i, 1);
  await Store.save();
  render();
}

/* ---------- TAB 2: Gambar Complete the Picture ---------- */
function viewPics() {
  const form = `<div class="row" style="display:block">
    <h3>Tambah gambar</h3>
    <label class="lbl">Nama objek</label><input id="p-name" class="fld">
    <label class="lbl">Informasi edukatif singkat</label><textarea id="p-info" class="fld" rows="2"></textarea>
    <label class="lbl">Foto (disimpan di IndexedDB)</label><input id="p-file" type="file" accept="image/*" class="fld">
    <button class="btn mint" onclick="addPic()">Simpan gambar</button></div>`;
  const grid = data.pics.map((p, i) =>
    `<div class="row" style="display:block"><img src="${esc(p.src)}" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px">
     <b>${esc(p.name)}</b><div class="note">${esc(p.info)}</div>
     <button class="btn small" onclick="editPic(${i})">Edit teks</button>
     <button class="btn small red" onclick="deletePic(${i})">Hapus</button></div>`
  ).join("");
  return form + `<div class="thumbs">${grid}</div>`;
}

// Membaca file gambar; jika max diisi, gambar dikecilkan agar hemat penyimpanan
function readImage(file, max) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!max) return resolve(reader.result);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * k;
        canvas.height = img.height * k;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function addPic() {
  const name = $("#p-name").value.trim();
  const file = $("#p-file").files[0];
  if (!name || !file) return alert("Nama objek dan foto wajib diisi.");
  data.pics.push({ id: uid(), name, info: $("#p-info").value.trim(), src: await readImage(file, 1100) });
  await Store.save();
  render();
}
async function editPic(i) {
  const name = prompt("Nama objek:", data.pics[i].name);
  if (name === null) return;
  const info = prompt("Informasi edukatif:", data.pics[i].info);
  data.pics[i].name = name.trim() || data.pics[i].name;
  if (info !== null) data.pics[i].info = info.trim();
  await Store.save();
  render();
}
async function deletePic(i) {
  if (!confirm("Hapus gambar ini?")) return;
  data.pics.splice(i, 1);
  await Store.save();
  render();
}

/* ---------- TAB 3: Logo, Export/Import, Reset ---------- */
function viewMisc() {
  const bi = data.cfg.logoBI || CONFIG.LOGO_BI;
  const lib = data.cfg.logoLib || CONFIG.LOGO_PERPUS;
  return `
    <h3>Logo</h3>
    <p class="note">Logo juga bisa diisi lewat js/config.js. Unggahan di sini akan lebih diutamakan.</p>
    <div class="logos">
      <div><div class="logo-slot">${logoHTML(bi, "Logo Bank Indonesia")}</div><input type="file" accept="image/*" onchange="setLogo('logoBI',this)"></div>
      <div><div class="logo-slot">${logoHTML(lib, "Logo Perpustakaan")}</div><input type="file" accept="image/*" onchange="setLogo('logoLib',this)"></div>
    </div>
    <h3>Pindahkan data antar laptop</h3>
    <p class="note">Export menyimpan seluruh soal, gambar, dan logo ke satu file JSON. Import di laptop lain untuk memuatnya.</p>
    <div class="actions" style="justify-content:flex-start">
      <button class="btn gold" onclick="exportJson()">Export JSON</button>
      <label class="btn mint">Import JSON<input type="file" accept=".json,application/json" hidden onchange="importJson(this)"></label>
      <button class="btn red" onclick="resetAll()">Kembalikan data bawaan</button>
    </div>`;
}

async function setLogo(key, input) {
  if (!input.files[0]) return;
  data.cfg[key] = await readImage(input.files[0], 0);
  await Store.save();
  render();
}

function exportJson() {
  const blob = new Blob([JSON.stringify({ v: 1, cfg: data.cfg, wai: data.wai, pics: data.pics })], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data-booth-bi.json";
  a.click();
}

function importJson(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const d = JSON.parse(reader.result);
      if (!Array.isArray(d.wai) || !Array.isArray(d.pics)) throw new Error("format salah");
      data.cfg = { ...defaultCfg(), ...d.cfg };
      data.wai = d.wai;
      data.pics = d.pics;
      await Store.save();
      alert("Import berhasil.");
      render();
    } catch (e) {
      alert("File JSON tidak valid.");
    }
  };
  reader.readAsText(file);
}

async function resetAll() {
  if (!confirm("Kembalikan semua data ke bawaan? Soal dan gambar buatan sendiri akan hilang.")) return;
  data.cfg = defaultCfg();
  data.wai = defaultWai();
  data.pics = defaultPics();
  await Store.save();
  render();
}

/* ---------- Mulai ---------- */
(async function () {
  data = await Store.init();
  const btn = $("#btn-sound");
  const refresh = () => { btn.textContent = Sound.enabled ? "🔊 Suara ON" : "🔇 Suara OFF"; };
  btn.addEventListener("click", () => { Sound.toggle(); refresh(); Sound.click(); });
  refresh();
  render();
})();
