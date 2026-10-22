import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import type {
  GaleriFoto,
  InfoToko,
  Kategori,
  MenuItem,
  Promo,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readDirSafe(subDir: string): string[] {
  const target = path.join(CONTENT_DIR, subDir);
  if (!fs.existsSync(target)) return [];
  return fs.readdirSync(target);
}

export function getKategori(): Kategori[] {
  const dir = path.join(CONTENT_DIR, "kategori");
  return readDirSafe("kategori")
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const parsed = YAML.parse(raw) as Partial<Kategori>;
      const id = f.replace(/\.(yml|yaml)$/, "");
      return {
        id,
        nama: parsed.nama ?? id,
        urutan: parsed.urutan ?? 99,
      } as Kategori;
    })
    .sort((a, b) => a.urutan - b.urutan);
}

export function getMenu(): MenuItem[] {
  const dir = path.join(CONTENT_DIR, "menu");
  return readDirSafe("menu")
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      const id = f.replace(/\.md$/, "");
      return {
        id,
        deskripsi: content.trim(),
        ...data,
      } as MenuItem;
    })
    .filter((m) => m.aktif !== false);
}

export function getMenuBySlug(slug: string): MenuItem | null {
  const filePath = path.join(CONTENT_DIR, "menu", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    id: slug,
    deskripsi: content.trim(),
    ...data,
  } as MenuItem;
}

export function getGaleri(): GaleriFoto[] {
  const dir = path.join(CONTENT_DIR, "galeri");
  return readDirSafe("galeri")
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data } = matter(raw);
      const id = f.replace(/\.md$/, "");
      return {
        id,
        ...data,
      } as GaleriFoto;
    })
    .sort((a, b) => (a.urutan ?? 99) - (b.urutan ?? 99));
}

export function getPromo(): Promo[] {
  const dir = path.join(CONTENT_DIR, "promo");
  return readDirSafe("promo")
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      const id = f.replace(/\.md$/, "");
      return {
        id,
        deskripsi: data.deskripsi || content.trim(),
        ...data,
      } as Promo;
    })
    .filter((p) => p.aktif !== false);
}

export function getInfoToko(): InfoToko {
  const filePath = path.join(CONTENT_DIR, "info-toko.json");
  if (!fs.existsSync(filePath)) {
    return {
      nama_toko: "Kopi Senja",
      alamat: "Jl. Senja Kopi No. 12",
      link_peta: "https://maps.google.com",
      whatsapp: "6281234567890",
      instagram: "https://instagram.com/kopisenja",
      jam_buka: [],
    };
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as InfoToko;
}

