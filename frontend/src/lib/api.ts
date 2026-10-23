import {
  getActivePromo,
  getGaleri,
  getInfoToko,
  getKategori,
  getMenu,
  getMenuBySlug,
  getPromo,
  getRecommendedMenu,
  getStoreStatus,
} from "./content";
import type {
  GaleriFoto,
  InfoToko,
  Kategori,
  MenuItem,
  Promo,
  StatusToko,
} from "./types";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Helper fetch dengan fallback ke data loader lokal jika backend server tidak merespons
 */
async function safeFetch<T>(endpoint: string, fallbackFn: () => T): Promise<T> {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return fallbackFn();
    }

    const json = await res.json();
    return json.data as T;
  } catch {
    // Backend server sedang offline (misal saat build offline), gunakan fallback loader lokal
    return fallbackFn();
  }
}

/**
 * Mengambil daftar kategori menu
 */
export async function fetchKategori(): Promise<Kategori[]> {
  return safeFetch("/kategori", () => getKategori());
}

/**
 * Mengambil daftar menu aktif, opsional filter kategori
 */
export async function fetchMenu(kategori?: string): Promise<MenuItem[]> {
  const query = kategori ? `?kategori=${encodeURIComponent(kategori)}` : "";
  return safeFetch(`/menu${query}`, () => {
    const all = getMenu();
    return kategori
      ? all.filter((m) => m.kategori.toLowerCase() === kategori.toLowerCase())
      : all;
  });
}

/**
 * Mengambil menu rekomendasi / andalan
 */
export async function fetchRecommendedMenu(): Promise<MenuItem[]> {
  return safeFetch("/menu/rekomendasi", () => getRecommendedMenu());
}

/**
 * Mengambil detail 1 menu berdasarkan slug
 */
export async function fetchMenuBySlug(slug: string): Promise<MenuItem | null> {
  return safeFetch(`/menu/${slug}`, () => getMenuBySlug(slug));
}

/**
 * Mengambil daftar galeri foto, opsional filter sudut favorit
 */
export async function fetchGaleri(onlyFavorites = false): Promise<GaleriFoto[]> {
  const query = onlyFavorites ? "?favorit=true" : "";
  return safeFetch(`/galeri${query}`, () => getGaleri(onlyFavorites));
}

/**
 * Mengambil promo aktif
 */
export async function fetchPromo(activeOnly = true): Promise<Promo[]> {
  const query = activeOnly ? "?aktif_saja=true" : "";
  return safeFetch(`/promo${query}`, () => (activeOnly ? getActivePromo() : getPromo()));
}

/**
 * Mengambil informasi toko & kontak
 */
export async function fetchInfoToko(): Promise<InfoToko> {
  return safeFetch("/info-toko", () => getInfoToko());
}

/**
 * Mengambil kalkulasi status buka/tutup toko saat ini (WIB)
 */
export async function fetchStatusToko(): Promise<StatusToko> {
  return safeFetch("/status-toko", () => getStoreStatus());
}

