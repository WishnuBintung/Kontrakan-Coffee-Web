import type { MenuItem } from "./types";

/**
 * Tema visual hero untuk setiap "menu rekomendasi".
 * Terhubung dengan data CMS; menyediakan mapping sensori, palet warna dinamis,
 * serta mode penyajian (Dingin / Hangat).
 */
export type ParticleKind = "bean" | "leaf" | "ice" | "cocoa";

export type TastingProfile = {
  sweetness: number; // Skala 1 - 5
  boldness: number;  // Skala 1 - 5
  acidity: number;   // Skala 1 - 5
  aroma: number;     // Skala 1 - 5
};

export type CeramicGlaze = {
  base: string;
  rim: string;
  accent: string;
  latteArt: "heart" | "rosetta" | "swirl";
};

export type HeroTheme = {
  /** Warna gradien radial latar hero (inner → mid → outer) */
  bg: { inner: string; mid: string; outer: string };
  /** Lapisan minuman di dalam gelas */
  liquid: { top: string; bottom: string };
  /** Objek 3D melayang */
  particle: ParticleKind;
  /** Judul samping / mood */
  tagline: [string, string];
  /** Nama singkat untuk kartu carousel */
  shortName: string;
  /** Warna sedotan untuk iced cup */
  strawColor?: string;
  /** Glaze warna untuk artisan ceramic mug (mode hangat) */
  glaze: CeramicGlaze;
};

export type HeroFlavor = {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  deskripsi: string;
  theme: HeroTheme;
  tastingNotes: string[];
  profile: TastingProfile;
  supportsHot: boolean;
};

const THEMES: Record<string, HeroTheme> = {
  "es-kopi-susu": {
    bg: { inner: "#a0582a", mid: "#55290f", outer: "#170a04" },
    liquid: { top: "#ecd2ab", bottom: "#6b3a1e" },
    particle: "bean",
    tagline: ["Manis", "Aren"],
    shortName: "Es Kopi Susu",
    strawColor: "#fdba74",
    glaze: {
      base: "#452414",
      rim: "#d4a373",
      accent: "#f4a261",
      latteArt: "heart",
    },
  },
  "matcha-latte": {
    bg: { inner: "#5d8a35", mid: "#2b4a1a", outer: "#0b1607" },
    liquid: { top: "#e4efc4", bottom: "#7da34a" },
    particle: "leaf",
    tagline: ["Hijau", "Lembut"],
    shortName: "Matcha Latte",
    strawColor: "#a3e635",
    glaze: {
      base: "#243c1a",
      rim: "#84cc16",
      accent: "#bef264",
      latteArt: "rosetta",
    },
  },
  "cold-brew-gayo": {
    bg: { inner: "#33557f", mid: "#172a45", outer: "#060b14" },
    liquid: { top: "#5a3524", bottom: "#2a160c" },
    particle: "ice",
    tagline: ["Dingin", "16 Jam"],
    shortName: "Cold Brew",
    strawColor: "#38bdf8",
    glaze: {
      base: "#1a2c42",
      rim: "#38bdf8",
      accent: "#7dd3fc",
      latteArt: "swirl",
    },
  },
  "caramel-macchiato": {
    bg: { inner: "#c27c2c", mid: "#6b3d10", outer: "#1c0f03" },
    liquid: { top: "#f3dcb0", bottom: "#a8652a" },
    particle: "bean",
    tagline: ["Karamel", "Lumer"],
    shortName: "Caramel",
    strawColor: "#fbbf24",
    glaze: {
      base: "#5c3311",
      rim: "#f59e0b",
      accent: "#fde68a",
      latteArt: "heart",
    },
  },
  "signature-dark-chocolate": {
    bg: { inner: "#8a3440", mid: "#40131b", outer: "#120407" },
    liquid: { top: "#8a4a32", bottom: "#3e1b10" },
    particle: "cocoa",
    tagline: ["Cokelat", "Pekat"],
    shortName: "Dark Choco",
    strawColor: "#f43f5e",
    glaze: {
      base: "#3b1118",
      rim: "#e11d48",
      accent: "#fda4af",
      latteArt: "swirl",
    },
  },
};

const FLAVOR_PROFILES: Record<string, { notes: string[]; profile: TastingProfile; supportsHot: boolean }> = {
  "es-kopi-susu": {
    notes: ["Double Shot Espresso", "Gula Aren Organik", "Fresh Milk Gurih"],
    profile: { sweetness: 4, boldness: 4, acidity: 2, aroma: 5 },
    supportsHot: true,
  },
  "matcha-latte": {
    notes: ["Uji Matcha Asli", "Steamed Fresh Milk", "Hint of Vanilla"],
    profile: { sweetness: 3, boldness: 3, acidity: 1, aroma: 5 },
    supportsHot: true,
  },
  "cold-brew-gayo": {
    notes: ["Single Origin Aceh Gayo", "Slow Drip 16 Jam", "Fruity Aftertaste"],
    profile: { sweetness: 1, boldness: 5, acidity: 3, aroma: 5 },
    supportsHot: false,
  },
  "caramel-macchiato": {
    notes: ["Espresso Blend", "Sirup Vanila Alami", "Saus Karamel Lumer"],
    profile: { sweetness: 5, boldness: 3, acidity: 1, aroma: 4 },
    supportsHot: true,
  },
  "signature-dark-chocolate": {
    notes: ["Kakao Murni 70%", "Velvety Steamed Milk", "Kaya Antioksidan"],
    profile: { sweetness: 2, boldness: 5, acidity: 1, aroma: 4 },
    supportsHot: true,
  },
};

const FALLBACK_PROFILE = {
  notes: ["Bahan Pilihan", "Racikan Barista", "Segar & Nikmat"],
  profile: { sweetness: 3, boldness: 3, acidity: 2, aroma: 4 },
  supportsHot: true,
};

const FALLBACK_THEME: Record<string, HeroTheme> = {
  kopi: THEMES["es-kopi-susu"],
  "non-kopi": THEMES["matcha-latte"],
};

/** Urutan tampil carousel — menu andalan No. 1 selalu pertama. */
const ORDER = [
  "es-kopi-susu",
  "matcha-latte",
  "cold-brew-gayo",
  "caramel-macchiato",
  "signature-dark-chocolate",
];

export function toHeroFlavors(menu: MenuItem[]): HeroFlavor[] {
  return menu
    .filter((m) => m.rekomendasi && m.kategori !== "camilan")
    .sort((a, b) => {
      const ia = ORDER.indexOf(a.id);
      const ib = ORDER.indexOf(b.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    .map((m) => {
      const theme = THEMES[m.id] ?? FALLBACK_THEME[m.kategori] ?? THEMES["es-kopi-susu"];
      const meta = FLAVOR_PROFILES[m.id] ?? FALLBACK_PROFILE;
      return {
        id: m.id,
        nama: m.nama,
        harga: m.harga,
        kategori: m.kategori,
        deskripsi: m.deskripsi,
        theme: { ...theme, shortName: THEMES[m.id]?.shortName ?? m.nama },
        tastingNotes: meta.notes,
        profile: meta.profile,
        supportsHot: meta.supportsHot,
      };
    });
}
