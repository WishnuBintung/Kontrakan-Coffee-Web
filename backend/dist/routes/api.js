import { Router } from "express";
import { formatRupiah, getActivePromo, getAllMenuSlugs, getGaleri, getInfoToko, getKategori, getMenu, getMenuBySlug, getMenuWithKategori, getPromo, getRecommendedMenu, getRelatedMenu, getStoreStatus, } from "../lib/content.js";
export const apiRouter = Router();
// API Root Index (GET /api atau GET /api/)
apiRouter.get("/", (_req, res) => {
    res.json({
        name: "Kopi Senja — REST API",
        status: "online",
        version: "1.1.0",
        endpoints: {
            health: "/api/health",
            kategori: "/api/kategori",
            menu: "/api/menu (params: ?q=, ?kategori=, ?rekomendasi=, ?sort=)",
            menuRekomendasi: "/api/menu/rekomendasi",
            menuDetail: "/api/menu/:slug",
            menuSlugs: "/api/menu/slugs",
            galeri: "/api/galeri (params: ?favorit=true)",
            promo: "/api/promo (params: ?tipe=promo|kegiatan, ?aktif_saja=true)",
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
        version: "1.1.0",
        timestamp: new Date().toISOString(),
    });
});
// Kategori
apiRouter.get("/kategori", (_req, res) => {
    try {
        const data = getKategori();
        res.json({ success: true, count: data.length, data });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
// Menu Rekomendasi (harus sebelum /menu/:slug agar tidak bentrok)
apiRouter.get("/menu/rekomendasi", (_req, res) => {
    try {
        const data = getRecommendedMenu();
        res.json({ success: true, count: data.length, data });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
// Menu Slugs (untuk static generation Next.js)
apiRouter.get("/menu/slugs", (_req, res) => {
    try {
        const data = getAllMenuSlugs();
        res.json({ success: true, count: data.length, data });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
// Daftar Menu (mendukung query ?q=, ?kategori=, ?rekomendasi=, ?sort=)
apiRouter.get("/menu", (req, res) => {
    try {
        const kategori = typeof req.query.kategori === "string" ? req.query.kategori : undefined;
        const query = typeof req.query.q === "string" ? req.query.q : undefined;
        const rekomendasi = req.query.rekomendasi === "true"
            ? true
            : req.query.rekomendasi === "false"
                ? false
                : undefined;
        const sort = typeof req.query.sort === "string" ? req.query.sort : undefined;
        const withKategori = req.query.with_kategori === "true";
        if (withKategori) {
            const data = getMenuWithKategori();
            res.json({ success: true, count: data.length, data });
            return;
        }
        const data = getMenu({ kategori, query, rekomendasi, sort });
        res.json({
            success: true,
            count: data.length,
            filters: { kategori, query, rekomendasi, sort },
            data,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
// Detail Menu by Slug (+ Related Menu)
apiRouter.get("/menu/:slug", (req, res) => {
    try {
        const { slug } = req.params;
        const item = getMenuBySlug(slug);
        if (!item) {
            res.status(404).json({ success: false, error: `Menu "${slug}" tidak ditemukan` });
            return;
        }
        const relatedMenu = getRelatedMenu(item.id, item.kategori, 3);
        res.json({
            success: true,
            data: {
                ...item,
                hargaFormatted: formatRupiah(item.harga),
                relatedMenu,
            },
        });
    }
    catch (err) {
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
// Promo & Kegiatan (?tipe=promo|kegiatan, ?aktif_saja=true)
apiRouter.get("/promo", (req, res) => {
    try {
        const tipe = req.query.tipe === "kegiatan" || req.query.tipe === "promo"
            ? req.query.tipe
            : undefined;
        const activeOnly = req.query.aktif_saja === "true";
        const data = activeOnly ? getActivePromo(new Date(), tipe) : getPromo(tipe);
        res.json({ success: true, count: data.length, data });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
// Info Toko & Jam Buka (tanpa WhatsApp sesuai permintaan)
apiRouter.get("/info-toko", (_req, res) => {
    try {
        const data = getInfoToko();
        res.json({ success: true, data });
    }
    catch (err) {
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        res.status(500).json({ success: false, error: message });
    }
});
