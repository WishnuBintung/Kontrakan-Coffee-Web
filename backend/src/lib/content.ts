import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import YAML from "yaml";
import type {
  GaleriFoto,
  Hari,
  InfoToko,
  JamBuka,
  Kategori,
  MenuItem,
  MenuWithKategori,
  Promo,
  StatusToko,
} from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lokasi content/ di dalam backend/
const CONTENT_DIR = fs.existsSync(path.join(process.cwd(), "content"))
  ? path.join(process.cwd(), "content")
  : fs.existsSync(path.join(process.cwd(), "backend", "content"))
  ? path.join(process.cwd(), "backend", "content")
  : path.join(__dirname, "../../../content");

const DEFAULT_PLACEHOLDER = "/images/placeholder-coffee.svg";

function readDirSafe(subDir: string): string[] {
  const target = path.join(CONTENT_DIR, subDir);
  if (!fs.existsSync(target)) return [];
  try {
    return fs.readdirSync(target);
  } catch {
    return [];
  }
}

/**
 * Format angka menjadi format Rupiah Indonesia (misal: 18000 -> "Rp 18.000")
 */
export function formatRupiah(nominal: number): string {
  if (typeof nominal !== "number" || isNaN(nominal)) {
    return "Rp 0";
  }
  return `Rp ${nominal.toLocaleString("id-ID")}`;
}

/**
 * Mendapatkan daftar kategori yang diurutkan berdasarkan `urutan`
 */
export function getKategori(): Kategori[] {
  const dir = path.join(CONTENT_DIR, "kategori");
  return readDirSafe("kategori")
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const parsed = (YAML.parse(raw) as Partial<Kategori>) || {};
        const id = f.replace(/\.(yml|yaml)$/, "");
        return {
          id,
          nama: parsed.nama || id,
          urutan: typeof parsed.urutan === "number" ? parsed.urutan : 99,
        };
      } catch (err) {
        console.error(`Gagal membaca file kategori: ${f}`, err);
        const id = f.replace(/\.(yml|yaml)$/, "");
        return { id, nama: id, urutan: 99 };
      }
    })
    .sort((a, b) => a.urutan - b.urutan);
}

export type GetMenuOptions = {
  kategori?: string;
  query?: string;
  rekomendasi?: boolean;
  sort?: "harga_asc" | "harga_desc" | "nama_asc" | "nama_desc" | string;
};

/**
 * Mendapatkan semua menu aktif dengan opsi pencarian, filter kategori, rekomendasi, dan pengurutan
 */
export function getMenu(options?: string | GetMenuOptions): MenuItem[] {
  const dir = path.join(CONTENT_DIR, "menu");
  let items = readDirSafe("menu")
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const { data, content } = matter(raw);
        const id = f.replace(/\.md$/, "");
        return {
          id,
          nama: data.nama || id,
          kategori: data.kategori || "kopi",
          harga: typeof data.harga === "number" ? data.harga : 0,
          foto: data.foto || DEFAULT_PLACEHOLDER,
          ukuran: Array.isArray(data.ukuran) ? data.ukuran : undefined,
          rasa: Array.isArray(data.rasa) ? data.rasa : undefined,
          rekomendasi: Boolean(data.rekomendasi),
          aktif: data.aktif !== false,
          deskripsi: content.trim(),
        } as MenuItem;
      } catch (err) {
        console.error(`Gagal membaca file menu: ${f}`, err);
        return null;
      }
    })
    .filter((m): m is MenuItem => m !== null && m.aktif !== false);

  if (!options) return items;

  // Jika dipanggil dengan string kategori langsung: getMenu("kopi")
  if (typeof options === "string") {
    return items.filter(
      (item) => item.kategori.toLowerCase() === options.toLowerCase()
    );
  }

  // Filter Kategori
  if (options.kategori) {
    items = items.filter(
      (item) => item.kategori.toLowerCase() === options.kategori?.toLowerCase()
    );
  }

  // Filter Rekomendasi
  if (typeof options.rekomendasi === "boolean") {
    items = items.filter((item) => item.rekomendasi === options.rekomendasi);
  }

  // Pencarian Teks (Cari Menu - PRD Fase 1)
  if (options.query && options.query.trim()) {
    const q = options.query.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.nama.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q)
    );
  }

  // Pengurutan (Sorting)
  if (options.sort) {
    switch (options.sort) {
      case "harga_asc":
        items.sort((a, b) => a.harga - b.harga);
        break;
      case "harga_desc":
        items.sort((a, b) => b.harga - a.harga);
        break;
      case "nama_asc":
        items.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
      case "nama_desc":
        items.sort((a, b) => b.nama.localeCompare(a.nama));
        break;
    }
  }

  return items;
}

/**
 * Mengambil menu berdasarkan slug/id unik
 */
export function getMenuBySlug(slug: string): MenuItem | null {
  const filePath = path.join(CONTENT_DIR, "menu", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return {
      id: slug,
      nama: data.nama || slug,
      kategori: data.kategori || "kopi",
      harga: typeof data.harga === "number" ? data.harga : 0,
      foto: data.foto || DEFAULT_PLACEHOLDER,
      ukuran: Array.isArray(data.ukuran) ? data.ukuran : undefined,
      rasa: Array.isArray(data.rasa) ? data.rasa : undefined,
      rekomendasi: Boolean(data.rekomendasi),
      aktif: data.aktif !== false,
      deskripsi: content.trim(),
    } as MenuItem;
  } catch (err) {
    console.error(`Gagal memuat menu: ${slug}`, err);
    return null;
  }
}

/**
 * Mengambil menu terkait (related items) berdasarkan kategori yang sama
 */
export function getRelatedMenu(
  currentSlug: string,
  kategori: string,
  limit = 3
): MenuItem[] {
  const sameCategory = getMenu({ kategori });
  return sameCategory
    .filter((item) => item.id !== currentSlug)
    .slice(0, limit);
}

/**
 * Mengambil daftar slug menu untuk static generation Next.js
 */
export function getAllMenuSlugs(): string[] {
  return readDirSafe("menu")
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Mengambil menu lengkap dengan nama kategori yang tertera
 */
export function getMenuWithKategori(): MenuWithKategori[] {
  const categories = getKategori();
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    categoryMap.set(cat.id, cat.nama);
  }

  return getMenu().map((item) => ({
    ...item,
    kategoriNama: categoryMap.get(item.kategori) || item.kategori,
  }));
}

/**
 * Mengambil menu rekomendasi / andalan (Fase 3 PRD)
 */
export function getRecommendedMenu(): MenuItem[] {
  return getMenu({ rekomendasi: true });
}

/**
 * Mengambil galeri foto dengan opsi filter khusus sudut favorit
 */
export function getGaleri(onlyFavorites = false): GaleriFoto[] {
  const dir = path.join(CONTENT_DIR, "galeri");
  const items = readDirSafe("galeri")
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const { data, content } = matter(raw);
        const id = f.replace(/\.md$/, "");
        return {
          id,
          judul: data.judul || id,
          gambar: data.gambar || DEFAULT_PLACEHOLDER,
          sudut_favorit: Boolean(data.sudut_favorit),
          urutan: typeof data.urutan === "number" ? data.urutan : 99,
          deskripsi: content ? content.trim() : undefined,
        } as GaleriFoto;
      } catch (err) {
        console.error(`Gagal membaca file galeri: ${f}`, err);
        return null;
      }
    })
    .filter((g): g is GaleriFoto => g !== null)
    .sort((a, b) => a.urutan - b.urutan);

  if (onlyFavorites) {
    return items.filter((item) => item.sudut_favorit);
  }
  return items;
}

/**
 * Mengambil semua promo atau filter per tipe (promo / kegiatan)
 */
export function getPromo(tipeFilter?: "promo" | "kegiatan"): Promo[] {
  const dir = path.join(CONTENT_DIR, "promo");
  const items = readDirSafe("promo")
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(dir, f), "utf8");
        const { data, content } = matter(raw);
        const id = f.replace(/\.md$/, "");
        return {
          id,
          judul: data.judul || id,
          deskripsi: data.deskripsi || content.trim(),
          tanggal_mulai: String(data.tanggal_mulai || ""),
          tanggal_selesai: String(data.tanggal_selesai || ""),
          gambar: data.gambar || undefined,
          tipe: data.tipe === "kegiatan" ? "kegiatan" : "promo",
          aktif: data.aktif !== false,
        } as Promo;
      } catch (err) {
        console.error(`Gagal membaca file promo: ${f}`, err);
        return null;
      }
    })
    .filter((p): p is Promo => p !== null && p.aktif !== false);

  if (tipeFilter) {
    return items.filter((p) => p.tipe === tipeFilter);
  }
  return items;
}

/**
 * Mengambil promo aktif yang berlaku pada tanggal tertentu (default: hari ini)
 */
export function getActivePromo(
  referenceDate: Date = new Date(),
  tipeFilter?: "promo" | "kegiatan"
): Promo[] {
  const allPromos = getPromo(tipeFilter);
  const todayStr = referenceDate.toISOString().slice(0, 10);

  return allPromos.filter((promo) => {
    if (!promo.aktif) return false;
    const start = promo.tanggal_mulai ? promo.tanggal_mulai.slice(0, 10) : "";
    const end = promo.tanggal_selesai ? promo.tanggal_selesai.slice(0, 10) : "";

    if (start && todayStr < start) return false;
    if (end && todayStr > end) return false;
    return true;
  });
}

/**
 * Mengambil profil & informasi toko dari content/info-toko.json
 */
export function getInfoToko(): InfoToko {
  const filePath = path.join(CONTENT_DIR, "info-toko.json");
  const fallback: InfoToko = {
    nama_toko: "Kopi Senja",
    alamat: "Jl. Seturan Raya No. 45, Sleman, D.I. Yogyakarta 55281",
    link_peta: "https://maps.google.com/?q=Kopi+Senja+Yogyakarta",
    embed_peta:
      "https://maps.google.com/maps?q=Kopi+Senja+Yogyakarta&t=&z=15&ie=UTF8&iwloc=&output=embed",
    instagram: "https://instagram.com/kopisenja.yk",
    jam_buka: [],
  };

  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    return {
      nama_toko: data.nama_toko || fallback.nama_toko,
      alamat: data.alamat || fallback.alamat,
      link_peta: data.link_peta || fallback.link_peta,
      embed_peta: data.embed_peta || fallback.embed_peta,
      instagram: data.instagram || fallback.instagram,
      jam_buka: Array.isArray(data.jam_buka) ? data.jam_buka : [],
    };
  } catch (err) {
    console.error("Gagal memuat info toko, menggunakan fallback:", err);
    return fallback;
  }
}

const HARI_MAP: Record<number, Hari> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

/**
 * Menghitung status buka/tutup toko saat ini berdasarkan data JamBuka (WIB / GMT+7)
 */
export function getStoreStatus(
  info?: InfoToko,
  referenceDate: Date = new Date()
): StatusToko {
  const toko = info || getInfoToko();
  const jamBukaList = toko.jam_buka || [];

  // Konversi waktu ke zona WIB (UTC+7)
  const utc = referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000;
  const wibDate = new Date(utc + 7 * 3600000);

  const dayIndex = wibDate.getDay();
  const namaHari = HARI_MAP[dayIndex];
  const jam = String(wibDate.getHours()).padStart(2, "0");
  const menit = String(wibDate.getMinutes()).padStart(2, "0");
  const waktuSekarang = `${jam}:${menit}`;

  const scheduleHariIni = jamBukaList.find(
    (j) => j.hari.toLowerCase() === namaHari.toLowerCase()
  );

  if (!scheduleHariIni || scheduleHariIni.libur) {
    let nextOpenDay = "";
    for (let i = 1; i <= 7; i++) {
      const nextIdx = (dayIndex + i) % 7;
      const nextHari = HARI_MAP[nextIdx];
      const nextSchedule = jamBukaList.find(
        (j) => j.hari.toLowerCase() === nextHari.toLowerCase()
      );
      if (nextSchedule && !nextSchedule.libur) {
        nextOpenDay = `${nextSchedule.hari} pukul ${nextSchedule.buka}`;
        break;
      }
    }

    return {
      isOpen: false,
      pesanStatus: nextOpenDay ? `Tutup • Buka ${nextOpenDay}` : "Tutup",
      jamHariIni: scheduleHariIni,
      hariIni: namaHari,
      sekarangJam: waktuSekarang,
    };
  }

  const { buka, tutup } = scheduleHariIni;
  const tutupNormalized = tutup === "24:00" ? "23:59" : tutup;

  if (waktuSekarang >= buka && waktuSekarang <= tutupNormalized) {
    return {
      isOpen: true,
      pesanStatus: `Buka • Tutup pukul ${tutup}`,
      jamHariIni: scheduleHariIni,
      hariIni: namaHari,
      sekarangJam: waktuSekarang,
    };
  } else if (waktuSekarang < buka) {
    return {
      isOpen: false,
      pesanStatus: `Tutup • Buka hari ini pukul ${buka}`,
      jamHariIni: scheduleHariIni,
      hariIni: namaHari,
      sekarangJam: waktuSekarang,
    };
  } else {
    const nextIdx = (dayIndex + 1) % 7;
    const nextHari = HARI_MAP[nextIdx];
    const nextSchedule = jamBukaList.find(
      (j) => j.hari.toLowerCase() === nextHari.toLowerCase()
    );

    const pesanBesok =
      nextSchedule && !nextSchedule.libur
        ? `Tutup • Buka besok pukul ${nextSchedule.buka}`
        : "Tutup";

    return {
      isOpen: false,
      pesanStatus: pesanBesok,
      jamHariIni: scheduleHariIni,
      hariIni: namaHari,
      sekarangJam: waktuSekarang,
    };
  }
}
