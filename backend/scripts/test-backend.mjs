// scripts/test-backend.mjs
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const BACKEND_ROOT = path.resolve(SCRIPT_DIR, "..");
const CONTENT_DIR = fs.existsSync(path.join(BACKEND_ROOT, "content"))
  ? path.join(BACKEND_ROOT, "content")
  : path.join(process.cwd(), "content");
const ROOT = BACKEND_ROOT;

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log("=== MEMULAI TEST BACKEND REALISTIC DATA (KOPI SENJA) ===\n");

// 1. Uji Koleksi Kategori
console.log("1. Validasi Koleksi Kategori (content/kategori/):");
const katDir = path.join(CONTENT_DIR, "kategori");
const katFiles = fs.readdirSync(katDir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));
assert(katFiles.length >= 3, `Minimal terdapat 3 kategori (ditemukan: ${katFiles.length})`);

const kategoriIds = [];
for (const file of katFiles) {
  const raw = fs.readFileSync(path.join(katDir, file), "utf8");
  const data = YAML.parse(raw);
  const id = file.replace(/\.(yml|yaml)$/, "");
  kategoriIds.push(id);
  assert(Boolean(data.nama), `Kategori "${file}" memiliki nama: ${data.nama}`);
  assert(typeof data.urutan === "number", `Kategori "${file}" memiliki urutan angka: ${data.urutan}`);
}

// 2. Uji Koleksi Menu (Realistic Data)
console.log("\n2. Validasi Koleksi Menu Realistis (content/menu/):");
const menuDir = path.join(CONTENT_DIR, "menu");
const menuFiles = fs.readdirSync(menuDir).filter((f) => f.endsWith(".md"));
assert(menuFiles.length >= 10, `Terdapat koleksi menu realistis (ditemukan: ${menuFiles.length} menu)`);

let countRekomendasi = 0;
for (const file of menuFiles) {
  const raw = fs.readFileSync(path.join(menuDir, file), "utf8");
  const { data, content } = matter(raw);
  const id = file.replace(/\.md$/, "");
  
  assert(Boolean(data.nama), `Menu "${id}" memiliki nama: ${data.nama}`);
  assert(typeof data.harga === "number" && data.harga >= 10000, `Menu "${id}" memiliki harga realistis: Rp ${data.harga}`);
  assert(kategoriIds.includes(data.kategori), `Kategori menu "${id}" (${data.kategori}) valid`);
  assert(content.trim().length > 10, `Menu "${id}" memiliki deskripsi cerita rasa`);
  if (data.rekomendasi) countRekomendasi++;
}
assert(countRekomendasi >= 3, `Terdapat minimal 3 menu rekomendasi andalan (ditemukan: ${countRekomendasi})`);

// 3. Uji Koleksi Galeri & Sudut Favorit
console.log("\n3. Validasi Koleksi Galeri Suasana (content/galeri/):");
const galeriDir = path.join(CONTENT_DIR, "galeri");
const galeriFiles = fs.readdirSync(galeriDir).filter((f) => f.endsWith(".md"));
assert(galeriFiles.length >= 5, `Terdapat minimal 5 spot foto suasana (ditemukan: ${galeriFiles.length})`);

let countSudutFavorit = 0;
for (const file of galeriFiles) {
  const raw = fs.readFileSync(path.join(galeriDir, file), "utf8");
  const { data } = matter(raw);
  assert(Boolean(data.judul), `Galeri "${file}" memiliki judul: ${data.judul}`);
  if (data.sudut_favorit) countSudutFavorit++;
}
assert(countSudutFavorit >= 2, `Terdapat minimal 2 sudut favorit kafe (ditemukan: ${countSudutFavorit})`);

// 4. Uji Koleksi Promo & Event Kegiatan
console.log("\n4. Validasi Koleksi Promo & Kegiatan (content/promo/):");
const promoDir = path.join(CONTENT_DIR, "promo");
const promoFiles = fs.readdirSync(promoDir).filter((f) => f.endsWith(".md"));
assert(promoFiles.length >= 3, `Minimal terdapat 3 promo/kegiatan (ditemukan: ${promoFiles.length})`);

let hasEvent = false;
let hasDiscount = false;
for (const file of promoFiles) {
  const raw = fs.readFileSync(path.join(promoDir, file), "utf8");
  const { data } = matter(raw);
  assert(Boolean(data.judul), `Promo "${file}" memiliki judul: ${data.judul}`);
  assert(["promo", "kegiatan"].includes(data.tipe), `Promo "${file}" memiliki tipe valid (${data.tipe})`);
  if (data.tipe === "kegiatan") hasEvent = true;
  if (data.tipe === "promo") hasDiscount = true;
}
assert(hasDiscount, "Terdapat promo diskon belanja");
assert(hasEvent, "Terdapat info kegiatan/acara musik live (PRD Fase 3)");

// 5. Uji Info Toko & Jam Buka (Tanpa WhatsApp sesuai instruksi user)
console.log("\n5. Validasi Informasi Toko (content/info-toko.json):");
const infoFile = path.join(CONTENT_DIR, "info-toko.json");
assert(fs.existsSync(infoFile), "Berkas content/info-toko.json tersedia");
const infoData = JSON.parse(fs.readFileSync(infoFile, "utf8"));
assert(Boolean(infoData.nama_toko), `Nama toko valid: ${infoData.nama_toko}`);
assert(Boolean(infoData.alamat), `Alamat toko lengkap: ${infoData.alamat}`);
assert(Boolean(infoData.link_peta), `Link peta Google Maps: ${infoData.link_peta}`);
assert(Boolean(infoData.embed_peta), `Link embed peta Google Maps tersedia: ${infoData.embed_peta}`);
assert(Boolean(infoData.instagram), `Akun Instagram tersedia: ${infoData.instagram}`);
assert(infoData.whatsapp === undefined, "Kontak WhatsApp ditiadakan sesuai preferensi user");
assert(Array.isArray(infoData.jam_buka) && infoData.jam_buka.length === 7, `Jam buka mencakup 7 hari (ditemukan: ${infoData.jam_buka?.length})`);

// 6. Uji Business Logic Jam Buka
console.log("\n6. Validasi Business Logic Jam Buka:");
const HARI_MAP = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

function calculateStoreStatus(jamBukaList, mockDate) {
  const utc = mockDate.getTime() + mockDate.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);
  const dayIndex = wib.getDay();
  const namaHari = HARI_MAP[dayIndex];
  const jam = String(wib.getHours()).padStart(2, "0");
  const menit = String(wib.getMinutes()).padStart(2, "0");
  const waktu = `${jam}:${menit}`;

  const schedule = jamBukaList.find((j) => j.hari.toLowerCase() === namaHari.toLowerCase());
  if (!schedule || schedule.libur) return { isOpen: false, status: "Tutup" };
  const tutup = schedule.tutup === "24:00" ? "23:59" : schedule.tutup;
  if (waktu >= schedule.buka && waktu <= tutup) {
    return { isOpen: true, status: `Buka • Tutup pukul ${schedule.tutup}` };
  }
  return { isOpen: false, status: "Tutup" };
}

// Simulasi: Senin pukul 14:00 WIB (harus BUKA)
const monday1400 = new Date("2026-10-19T07:00:00Z");
const resBuka = calculateStoreStatus(infoData.jam_buka, monday1400);
assert(resBuka.isOpen === true, `Simulasi Senin 14:00 WIB terdeteksi BUKA (${resBuka.status})`);

// Simulasi: Senin pukul 02:00 WIB (harus TUTUP)
const monday0200 = new Date("2026-10-18T19:00:00Z");
const resTutup = calculateStoreStatus(infoData.jam_buka, monday0200);
assert(resTutup.isOpen === false, `Simulasi Senin 02:00 WIB terdeteksi TUTUP (${resTutup.status})`);

// 7. Uji Decap CMS Files
console.log("\n7. Validasi Konfigurasi Decap CMS:");
const decapHtml = path.join(ROOT, "public/admin/index.html");
const decapYml = path.join(ROOT, "public/admin/config.yml");
assert(fs.existsSync(decapHtml), "Berkas public/admin/index.html tersedia");
assert(fs.existsSync(decapYml), "Berkas public/admin/config.yml tersedia");

// Ringkasan
console.log("\n=================================================");
console.log(`HASIL TEST: ${passedTests} / ${totalTests} pengujian BERHASIL.`);
if (passedTests === totalTests) {
  console.log("🎉 SEMUA PENGUJIAN REALISTIC DATA & BACKEND SUKSES!");
  process.exit(0);
} else {
  console.error("❌ ADA PENGUJIAN YANG GAGAL!");
  process.exit(1);
}
