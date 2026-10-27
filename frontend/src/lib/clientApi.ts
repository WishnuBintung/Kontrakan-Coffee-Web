// frontend/src/lib/clientApi.ts
// Pure browser-compatible API client for Kontrakan Coffee REST API

import {
  MENU_ITEMS,
  GALLERY_ITEMS,
  PROMO_ITEMS,
  CAFE_INFO,
  CafeMenuItem,
  CafeGalleryItem,
  CafePromoItem,
  CafeInfo,
} from "./cafeData";

export interface ApiStatusToko {
  isOpen: boolean;
  pesanStatus: string;
  jamHariIni?: {
    hari: string;
    buka: string;
    tutup: string;
    libur: boolean;
  };
  hariIni: string;
  sekarangJam: string;
}

export interface ApiKategori {
  id: string;
  nama: string;
  urutan: number;
}

/**
 * Mendapatkan URL basis API backend secara dinamis:
 * 1. Jika NEXT_PUBLIC_API_URL didefinisikan, gunakan itu.
 * 2. Jika di browser, arahkan ke hostname yang sama pada port 5000 (mendukung localhost dan IP LAN HP seperti 192.168.x.x:5000).
 * 3. Default fallback ke http://localhost:5000/api.
 */
export function getBackendApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
}

async function requestWithTimeout<T>(
  url: string,
  timeoutMs = 4000
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Mengambil daftar menu dari backend /api/menu
 * Fallback ke MENU_ITEMS lokal jika backend offline.
 */
export async function getClientMenuItems(): Promise<CafeMenuItem[]> {
  const apiUrl = getBackendApiUrl();
  const data = await requestWithTimeout<any[]>(`${apiUrl}/menu`);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return MENU_ITEMS;
  }

  // Normalisasi data dari backend agar kompatibel dengan CafeMenuItem
  return data.map((item) => ({
    id: item.id || item.slug,
    nama: item.nama,
    kategori: item.kategori,
    harga: Number(item.harga) || 0,
    deskripsi: item.deskripsi || "",
    foto: item.foto || "/images/placeholder-coffee.svg",
    ukuran: Array.isArray(item.ukuran) ? item.ukuran : undefined,
    rasa: Array.isArray(item.rasa) ? item.rasa : undefined,
    rekomendasi: Boolean(item.rekomendasi),
    badge: item.badge || (item.rekomendasi ? "Pilihan Barista" : undefined),
    specs: item.specs || (item.deskripsi_panjang ? item.deskripsi_panjang.slice(0, 100) : undefined),
  }));
}

/**
 * Mengambil daftar kategori menu dari backend /api/kategori
 */
export async function getClientKategori(): Promise<ApiKategori[]> {
  const apiUrl = getBackendApiUrl();
  const data = await requestWithTimeout<ApiKategori[]>(`${apiUrl}/kategori`);
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [
      { id: "kopi", nama: "Kopi Atelier", urutan: 1 },
      { id: "non-kopi", nama: "Non-Kopi", urutan: 2 },
      { id: "camilan", nama: "Camilan & Pastry", urutan: 3 },
    ];
  }
  return data;
}

/**
 * Mengambil status operasional toko real-time WIB dari backend /api/status-toko
 */
export async function getClientStatusToko(): Promise<ApiStatusToko | null> {
  const apiUrl = getBackendApiUrl();
  return requestWithTimeout<ApiStatusToko>(`${apiUrl}/status-toko`, 3000);
}

/**
 * Mengambil informasi toko & jam buka dari backend /api/info-toko
 * Fallback ke CAFE_INFO lokal.
 */
export async function getClientInfoToko(): Promise<CafeInfo> {
  const apiUrl = getBackendApiUrl();
  const data = await requestWithTimeout<any>(`${apiUrl}/info-toko`, 3000);

  if (!data) {
    return CAFE_INFO;
  }

  return {
    ...CAFE_INFO,
    nama: data.nama_toko || CAFE_INFO.nama,
    tagline: data.tagline || CAFE_INFO.tagline,
    alamat: data.alamat || CAFE_INFO.alamat,
    patokan: data.patokan || CAFE_INFO.patokan,
    googleMapsUrl:
      data.link_peta?.trim() ||
      (data.alamat?.trim()
        ? `https://maps.google.com/?q=${encodeURIComponent(data.alamat.trim())}`
        : CAFE_INFO.googleMapsUrl),
    googleMapsEmbed:
      data.embed_peta?.trim() ||
      (data.alamat?.trim()
        ? `https://maps.google.com/maps?q=${encodeURIComponent(data.alamat.trim())}&t=&z=16&ie=UTF8&iwloc=&output=embed`
        : CAFE_INFO.googleMapsEmbed),
    instagram: data.instagram
      ? data.instagram.startsWith("http")
        ? data.instagram
        : `https://www.instagram.com/${data.instagram.replace("@", "")}`
      : CAFE_INFO.instagram,
    instagramHandle: data.instagram
      ? data.instagram.startsWith("http")
        ? `@${data.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, "").split("?")[0].replace(/\/$/, "") || "kontrakan.coffee"}`
        : data.instagram.startsWith("@")
        ? data.instagram
        : `@${data.instagram}`
      : CAFE_INFO.instagramHandle,
    tiktok: data.tiktok
      ? data.tiktok.startsWith("http")
        ? data.tiktok
        : `https://www.tiktok.com/@${data.tiktok.replace("@", "")}`
      : CAFE_INFO.tiktok,
    whatsapp: data.whatsapp || CAFE_INFO.whatsapp,
    whatsappDisplay: data.whatsapp ? `+${data.whatsapp.slice(0, 2)} ${data.whatsapp.slice(2, 5)}-${data.whatsapp.slice(5, 9)}-${data.whatsapp.slice(9)}` : CAFE_INFO.whatsappDisplay,
    jamBuka: Array.isArray(data.jam_buka)
      ? data.jam_buka.map((j: any) => ({
          hari: j.hari,
          buka: j.buka,
          tutup: j.tutup,
          libur: Boolean(j.libur),
          catatan: j.catatan || (j.libur ? "Tutup / Libur Operasional" : undefined),
        }))
      : CAFE_INFO.jamBuka,
  };
}

/**
 * Mengambil galeri foto dari backend /api/galeri
 * Fallback ke GALLERY_ITEMS lokal.
 */
export async function getClientGaleri(onlyFavorites = false): Promise<CafeGalleryItem[]> {
  const apiUrl = getBackendApiUrl();
  const query = onlyFavorites ? "?favorit=true" : "";
  const data = await requestWithTimeout<any[]>(`${apiUrl}/galeri${query}`, 3000);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return GALLERY_ITEMS;
  }

  return data.map((item, idx) => {
    // Cari kecocokan data lokal agar mendapatkan gambar fotografi beresolusi tinggi
    const matchingLocal = GALLERY_ITEMS.find(
      (g) =>
        g.id === item.id ||
        g.id === item.slug ||
        g.judul.toLowerCase() === (item.judul || "").toLowerCase()
    );

    const isMissingUpload =
      item.gambar &&
      item.gambar.includes("/uploads/") &&
      !item.gambar.startsWith("http");
    const isPlaceholder =
      !item.gambar || item.gambar === "/images/placeholder-coffee.svg";

    // Jika gambar di backend masih berupa upload kosong atau placeholder, gunakan gambar fotografi lokal yang indah
    const gambar =
      (isMissingUpload || isPlaceholder) && matchingLocal
        ? matchingLocal.gambar
        : item.gambar || matchingLocal?.gambar || "/images/bg-hero.jpg";

    return {
      id: item.id || `galeri-${idx}`,
      judul: item.judul || matchingLocal?.judul || "Suasana Kafe",
      deskripsi:
        item.deskripsi ||
        matchingLocal?.deskripsi ||
        "Sudut nyaman untuk rehat dan bercengkerama.",
      gambar,
      sudut_favorit: Boolean(item.sudut_favorit),
      tag: item.tag || (item.sudut_favorit ? "Spot Favorit" : matchingLocal?.tag || "Area"),
    };
  });
}

export type ApiPromoItem = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe: "promo" | "kegiatan";
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  tanggal_berakhir?: string;
  gambar?: string;
  aktif: boolean;
};

export type PromoFetchResult =
  | { status: "success"; data: CafePromoItem[] }
  | { status: "empty"; data: [] }
  | { status: "error"; error: string };

/**
 * Mengambil daftar promo & kegiatan dari backend /api/promo dengan deteksi status:
 * - "success": Ada promo aktif di CMS
 * - "empty": Terhubung ke CMS tetapi tidak ada promo (array === 0)
 * - "error": CMS tidak terhubung / tidak tersambung (data tidak dapat ditemukan)
 */
export async function getClientPromoResult(): Promise<PromoFetchResult> {
  const apiUrl = getBackendApiUrl();
  const data = await requestWithTimeout<ApiPromoItem[]>(`${apiUrl}/promo`);

  // 1. Jika CMS tidak terhubung / server mati / request timeout -> data === null
  if (data === null || !Array.isArray(data)) {
    return {
      status: "error",
      error: "Data tidak dapat ditemukan (server CMS tidak terhubung)",
    };
  }

  // 2. Jika terhubung ke CMS tetapi tidak ada promo yang dipublish (array === 0)
  if (data.length === 0) {
    return {
      status: "empty",
      data: [],
    };
  }

  // 3. Normalisasi data dari CMS (tanpa memaksakan template statis)
  const items: CafePromoItem[] = data.map((item, idx) => ({
    id: item.id || `promo-${idx}`,
    judul: item.judul || "Promo Spesial",
    deskripsi:
      item.deskripsi || "Nikmati penawaran menarik di Kontrakan Coffee.",
    tipe: item.tipe === "kegiatan" ? "kegiatan" : "promo",
    tanggal_mulai: item.tanggal_mulai || undefined,
    tanggal_selesai:
      item.tanggal_selesai || item.tanggal_berakhir || "2026-12-31",
    gambar: item.gambar || "/images/placeholder-coffee.svg",
    aktif: item.aktif !== false,
  }));

  return {
    status: "success",
    data: items,
  };
}

/**
 * Mengambil daftar promo & kegiatan dari backend /api/promo
 * Mengembalikan array kosong jika promo kosong atau error (tidak menggunakan template statis).
 */
export async function getClientPromo(): Promise<CafePromoItem[]> {
  const result = await getClientPromoResult();
  if (result.status === "success") {
    return result.data;
  }
  return [];
}