// scripts/test-backend.mjs
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
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

console.log("=== MEMULAI TEST BACKEND & DATA ACCESS LAYER (KOPI SENJA) ===\n");

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

// 2. Uji Koleksi Menu
console.log("\n2. Validasi Koleksi Menu (content/menu/):");
const menuDir = path.join(CONTENT_DIR, "menu");
const menuFiles = fs.readdirSync(menuDir).filter((f) => f.endsWith(".md"));
assert(menuFiles.length >= 3, `Minimal terdapat 3 menu item (ditemukan: ${menuFiles.length})`);

let hasRecommended = false;
for (const file of menuFiles) {
  const raw = fs.readFileSync(path.join(menuDir, file), "utf8");
  const { data, content } = matter(raw);
  const id = file.replace(/\.md$/, "");
  
  assert(Boolean(data.nama), `Menu "${id}" memiliki nama: ${data.nama}`);
  assert(typeof data.harga === "number" && data.harga > 0, `Menu "${id}" memiliki harga valid: Rp ${data.harga}`);
  assert(kategoriIds.includes(data.kategori), `Kategori menu "${id}" (${data.kategori}) terdaftar di koleksi kategori`);
  assert(content.trim().length > 0, `Menu "${id}" memiliki deskripsi markdown yang terisi`);
  if (data.rekomendasi) hasRecommended = true;
}
assert(hasRecommended, "Terdapat minimal satu menu dengan label rekomendasi (PRD Fase 3)");

// 3. Uji Koleksi Promo
console.log("\n3. Validasi Koleksi Promo (content/promo/):");
const promoDir = path.join(CONTENT_DIR, "promo");
const promoFiles = fs.readdirSync(promoDir).filter((f) => f.endsWith(".md"));
assert(promoFiles.length >= 1, `Minimal terdapat 1 promo (ditemukan: ${promoFiles.length})`);

for (const file of promoFiles) {
  const raw = fs.readFileSync(path.join(promoDir, file), "utf8");
  const { data } = matter(raw);
  assert(Boolean(data.judul), `Promo "${file}" memiliki judul: ${data.judul}`);
  assert(["promo", "kegiatan"].includes(data.tipe), `Promo "${file}" memiliki tipe valid (promo/kegiatan)`);
  assert(Boolean(data.tanggal_mulai), `Promo "${file}" memiliki tanggal mulai: ${data.tanggal_mulai}`);
  assert(Boolean(data.tanggal_selesai), `Promo "${file}" memiliki tanggal selesai: ${data.tanggal_selesai}`);
}

// 4. Uji Info Toko & Jam Buka
console.log("\n4. Validasi Informasi Toko (content/info-toko.json):");
const infoFile = path.join(CONTENT_DIR, "info-toko.json");
assert(fs.existsSync(infoFile), "Berkas content/info-toko.json tersedia");
const infoData = JSON.parse(fs.readFileSync(infoFile, "utf8"));
assert(Boolean(infoData.nama_toko), `Nama toko valid: ${infoData.nama_toko}`);
assert(Boolean(infoData.alamat), `Alamat toko terisi: ${infoData.alamat}`);
assert(Boolean(infoData.link_peta), `Link peta terisi: ${infoData.link_peta}`);
assert(/^62[0-9]{8,13}$/.test(infoData.whatsapp), `Nomor WhatsApp valid diawali 62: ${infoData.whatsapp}`);
assert(Array.isArray(infoData.jam_buka) && infoData.jam_buka.length === 7, `Jam buka mencakup 7 hari (ditemukan: ${infoData.jam_buka?.length})`);

// 5. Uji Business Logic Kalkulasi Jam Buka (Mock WIB Time)
console.log("\n5. Validasi Business Logic Jam Buka:");
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
const monday1400 = new Date("2026-10-19T07:00:00Z"); // 07:00 UTC = 14:00 WIB
const resBuka = calculateStoreStatus(infoData.jam_buka, monday1400);
assert(resBuka.isOpen === true, `Simulasi Senin 14:00 WIB terdeteksi BUKA (${resBuka.status})`);

// Simulasi: Senin pukul 02:00 WIB (harus TUTUP)
const monday0200 = new Date("2026-10-18T19:00:00Z"); // 19:00 UTC = 02:00 WIB
const resTutup = calculateStoreStatus(infoData.jam_buka, monday0200);
assert(resTutup.isOpen === false, `Simulasi Senin 02:00 WIB terdeteksi TUTUP (${resTutup.status})`);

// 6. Uji Decap CMS Files
console.log("\n6. Validasi Konfigurasi Decap CMS:");
const decapHtml = path.join(ROOT, "public/admin/index.html");
const decapYml = path.join(ROOT, "public/admin/config.yml");
assert(fs.existsSync(decapHtml), "Berkas public/admin/index.html tersedia");
assert(fs.existsSync(decapYml), "Berkas public/admin/config.yml tersedia");

const ymlRaw = fs.readFileSync(decapYml, "utf8");
const ymlData = YAML.parse(ymlRaw);
assert(ymlData.backend?.name === "git-gateway", "Backend CMS menggunakan git-gateway");
assert(ymlData.local_backend === true, "local_backend aktif untuk pengembangan lokal");
assert(Array.isArray(ymlData.collections) && ymlData.collections.length === 5, `Koleksi Decap CMS lengkap 5 entitas (ditemukan: ${ymlData.collections.length})`);

// Ringkasan
console.log("\n=================================================");
console.log(`HASIL TEST: ${passedTests} / ${totalTests} pengujian BERHASIL.`);
if (passedTests === totalTests) {
  console.log("🎉 SEMUA PENGUJIAN BACKEND & DATA ACCESS LAYER SUKSES!");
  process.exit(0);
} else {
  console.error("❌ ADA PENGUJIAN YANG GAGAL!");
  process.exit(1);
}

