import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { apiRouter } from "./routes/api.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Request logger
app.use((req, _res, next) => {
    const time = new Date().toLocaleTimeString("id-ID");
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
});
// Mount REST API
app.use("/api", apiRouter);
// Serve Decap CMS static admin & public uploads
const adminDir = path.join(__dirname, "../public/admin");
app.use("/admin", express.static(adminDir));
// Fallback route
app.get("/", (_req, res) => {
    res.json({
        name: "Kopi Senja — Backend REST API",
        status: "running",
        port: PORT,
        endpoints: {
            health: "/api/health",
            kategori: "/api/kategori",
            menu: "/api/menu",
            menuRekomendasi: "/api/menu/rekomendasi",
            menuDetail: "/api/menu/:slug",
            galeri: "/api/galeri",
            promo: "/api/promo",
            infoToko: "/api/info-toko",
            statusToko: "/api/status-toko",
            adminCMS: "/admin",
        },
    });
});
export const server = app.listen(PORT, () => {
    console.log("==============================================");
    console.log(`☕ Kopi Senja Backend Server running on port ${PORT}`);
    console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
    console.log(`⚙️  Decap CMS Admin: http://localhost:${PORT}/admin`);
    console.log("==============================================");
});
export default app;
