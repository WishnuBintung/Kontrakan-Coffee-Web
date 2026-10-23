import {
  getActivePromo,
  getGaleri,
  getInfoToko,
  getKategori,
  getMenu,
  getMenuBySlug,
  getPromo,
  getRecommendedMenu,
  getRelatedMenu,
  getStoreStatus,
} from "./content";
import type {
  GaleriFoto,
  InfoToko,
  Kategori,
  MenuDetailResponse,
  MenuItem,
  Promo,
  StatusToko,
} from "./types";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    return fallbackFn();
  }
}

export async function fetchKategori(): Promise<Kategori[]> {
  return safeFetch("/kategori", () => getKategori());
}

export type FetchMenuParams = {
  kategori?: string;
  query?: string;
  rekomendasi?: boolean;
  sort?: string;
};

export async function fetchMenu(params?: string | FetchMenuParams): Promise<MenuItem[]> {
  const queryParams = new URLSearchParams();

  if (typeof params === "string") {
    queryParams.set("kategori", params);
  } else if (params) {
    if (params.kategori) queryParams.set("kategori", params.kategori);
    if (params.query) queryParams.set("q", params.query);
    if (params.rekomendasi !== undefined)
      queryParams.set("rekomendasi", String(params.rekomendasi));
    if (params.sort) queryParams.set("sort", params.sort);
  }

  const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return safeFetch(`/menu${qs}`, () => {
    if (typeof params === "string") {
      return getMenu({ kategori: params });
    }
    return getMenu(params);
  });
}

export async function fetchRecommendedMenu(): Promise<MenuItem[]> {
  return safeFetch("/menu/rekomendasi", () => getRecommendedMenu());
}

export async function fetchMenuBySlug(slug: string): Promise<MenuDetailResponse | null> {
  return safeFetch(`/menu/${slug}`, () => {
    const item = getMenuBySlug(slug);
    if (!item) return null;
    const related = getRelatedMenu(item.id, item.kategori, 3);
    return {
      ...item,
      hargaFormatted: `Rp ${item.harga.toLocaleString("id-ID")}`,
      relatedMenu: related,
    };
  });
}

export async function fetchGaleri(onlyFavorites = false): Promise<GaleriFoto[]> {
  const query = onlyFavorites ? "?favorit=true" : "";
  return safeFetch(`/galeri${query}`, () => getGaleri(onlyFavorites));
}

export async function fetchPromo(
  activeOnly = true,
  tipe?: "promo" | "kegiatan"
): Promise<Promo[]> {
  const params = new URLSearchParams();
  if (activeOnly) params.set("aktif_saja", "true");
  if (tipe) params.set("tipe", tipe);
  const qs = params.toString() ? `?${params.toString()}` : "";

  return safeFetch(`/promo${qs}`, () =>
    activeOnly ? getActivePromo(new Date(), tipe) : getPromo(tipe)
  );
}

export async function fetchInfoToko(): Promise<InfoToko> {
  return safeFetch("/info-toko", () => getInfoToko());
}

export async function fetchStatusToko(): Promise<StatusToko> {
  return safeFetch("/status-toko", () => getStoreStatus());
}
