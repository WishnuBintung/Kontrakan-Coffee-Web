import type { MenuItem } from "./types";

/**
 * Tema visual hero untuk setiap "menu rekomendasi" (pengganti flavor Classic / Zero Lime
 * pada konsep Soda). Data menu tetap berasal dari CMS; file ini hanya memetakan tampilan.
 */
export type ParticleKind = "bean" | "leaf" | "ice" | "cocoa";

export type HeroTheme = {
  /** Warna gradien radial latar hero (inner → mid → outer) */
  bg: { inner: string; mid: string; outer: string };
  /** Lapisan minuman di dalam gelas */
  liquid: { top: string; bottom: string };
  /** Objek 3D melayang (pengganti cherry ↔ blueberry) */
  particle: ParticleKind;
  /** Judul samping (pengganti "Refreshingly Clean") */
  tagline: [string, string];
  /** Nama singkat untuk kartu carousel */
  shortName: string;
};

export type HeroFlavor = {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  deskripsi: string;
  theme: HeroTheme;
};

const THEMES: Record<string, HeroTheme> = {
  "es-kopi-susu": {
    bg: { inner: "#a0582a", mid: "#55290f", outer: "#170a04" },
    liquid: { top: "#ecd2ab", bottom: "#6b3a1e" },
    particle: "bean",
    tagline: ["Manis", "Aren"],
    shortName: "Es Kopi Susu",
  },
  "matcha-latte": {
    bg: { inner: "#5d8a35", mid: "#2b4a1a", outer: "#0b1607" },
    liquid: { top: "#e4efc4", bottom: "#7da34a" },
    particle: "leaf",
    tagline: ["Hijau", "Lembut"],
    shortName: "Matcha Latte",
  },
  "cold-brew-gayo": {
    bg: { inner: "#33557f", mid: "#172a45", outer: "#060b14" },
    liquid: { top: "#5a3524", bottom: "#2a160c" },
    particle: "ice",
    tagline: ["Dingin", "16 Jam"],
    shortName: "Cold Brew",
  },
  "caramel-macchiato": {
    bg: { inner: "#c27c2c", mid: "#6b3d10", outer: "#1c0f03" },
    liquid: { top: "#f3dcb0", bottom: "#a8652a" },
    particle: "bean",
    tagline: ["Karamel", "Lumer"],
    shortName: "Caramel",
  },
  "signature-dark-chocolate": {
    bg: { inner: "#8a3440", mid: "#40131b", outer: "#120407" },
    liquid: { top: "#8a4a32", bottom: "#3e1b10" },
    particle: "cocoa",
    tagline: ["Cokelat", "Pekat"],
    shortName: "Dark Choco",
  },
};

const FALLBACK: Record<string, HeroTheme> = {
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
      const theme = THEMES[m.id] ?? FALLBACK[m.kategori] ?? THEMES["es-kopi-susu"];
      return {
        id: m.id,
        nama: m.nama,
        harga: m.harga,
        kategori: m.kategori,
        deskripsi: m.deskripsi,
        theme: { ...theme, shortName: THEMES[m.id]?.shortName ?? m.nama },
      };
    });
}

