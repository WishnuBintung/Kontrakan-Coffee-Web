import { Router } from "express";
import {
  formatRupiah,
  getActivePromo,
  getAllMenuSlugs,
  getGaleri,
  getInfoToko,
  getKategori,
  getMenu,
  getMenuBySlug,
  getMenuWithKategori,
  getPromo,
  getRecommendedMenu,
  getStoreStatus,
} from "../lib/content.js";

export const apiRouter = Router();

// API Root Index (GET /api atau GET /api/)
apiRouter.get("/", (_req, res) => {
  res.json({
    name: "Kopi Senja — REST API",
    status: "online",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      kategori: "/api/kategori",
      menu: "/api/menu",
      menuRekomendasi: "/api/menu/rekomendasi",
      menuDetail: "/api/menu/:slug",
      menuSlugs: "/api/menu/slugs",
      galeri: "/api/galeri",
      promo: "/api/promo",
      infoToko: "/api/info-toko",
      statusToko: "/api/status-toko",
    },
  });
});

// Health check
apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "kopi-senja-backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Kategori
apiRouter.get("/kategori", (_req, res) => {
  try {
    const data = getKategori();
    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Menu Rekomendasi (harus sebelum /menu/:slug agar tidak bentrok)
apiRouter.get("/menu/rekomendasi", (_req, res) => {
  try {
    const data = getRecommendedMenu();
    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Menu Slugs (untuk static generation Next.js)
apiRouter.get("/menu/slugs", (_req, res) => {
  try {
    const data = getAllMenuSlugs();
    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Daftar Menu (dengan filter ?kategori=...)
apiRouter.get("/menu", (req, res) => {
  try {
    const kategori = typeof req.query.kategori === "string" ? req.query.kategori : undefined;
    const withKategori = req.query.with_kategori === "true";
    const data = withKategori ? getMenuWithKategori() : getMenu(kategori);
    res.json({ success: true, count: data.length, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Detail Menu by Slug
apiRouter.get("/menu/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const item = getMenuBySlug(slug);
    if (!item) {
      res.status(404).json({ success: false, error: `Menu "${slug}" tidak ditemukan` });
      return;
    }
    res.json({
      success: true,
      data: {
        ...item,
        hargaFormatted: formatRupiah(item.harga),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Galeri Foto (?favorit=true)
apiRouter.get("/galeri", (req, res) => {
  try {
    const onlyFavorites = req.query.favorit === "true";
    const data = getGaleri(onlyFavorites);
    res.json({ success: true, count: data.length, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Promo & Kegiatan (?aktif_saja=true)
apiRouter.get("/promo", (req, res) => {
  try {
    const activeOnly = req.query.aktif_saja === "true";
    const data = activeOnly ? getActivePromo() : getPromo();
    res.json({ success: true, count: data.length, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Info Toko & Jam Buka
apiRouter.get("/info-toko", (_req, res) => {
  try {
    const data = getInfoToko();
    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

// Status Toko Real-time (Buka/Tutup WIB)
apiRouter.get("/status-toko", (_req, res) => {
  try {
    const info = getInfoToko();
    const data = getStoreStatus(info);
    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ success: false, error: message });
  }
});

