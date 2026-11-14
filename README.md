# Setup — Kontrakan Coffee Web

Panduan instalasi, pengembangan lokal (`frontend` & `backend` terpisah), Decap CMS, dan deploy Netlify.

## 1. Prasyarat

- **Node.js `22.x` LTS** (atau `>=20.9 <25`)
- **npm `10.x`**
- **Git** & akun **GitHub** + **Netlify** (untuk produksi & Decap CMS)

## 2. Struktur Folder

```text
├── content/          # Konten CMS (menu, kategori, galeri, promo, info-toko, why)
├── frontend/         # Next.js 16 (App Router, output: "export") + public/admin (Decap CMS)
├── backend/          # Express REST API lokal + decap-server
└── netlify.toml      # Konfigurasi build & publish Netlify (frontend/out)
```

## 3. Instalasi Mandiri

Install dependencies di masing-masing folder:

```bash
cd frontend && npm install
cd ../backend && npm install
```

## 4. Menjalankan Lokal (Terminal Terpisah)

1. **Backend API (`http://localhost:5000`)**:
   ```bash
   cd backend
   npm run dev
   ```
2. **Frontend (`http://localhost:3000`)**:
   ```bash
   cd frontend
   npm run dev
   ```
3. **Decap CMS Local Server (`http://localhost:8081`)** *(opsional, saat edit konten lokal)*:
   ```bash
   cd backend
   npm run cms
   ```
   Akses CMS lokal di `http://localhost:3000/admin/` (tanpa login).

## 5. Verifikasi & Build

```bash
# Frontend
cd frontend
npm run lint
npx tsc --noEmit
npm run build         # Static export ke frontend/out/

# Backend
cd backend
npm run build
npm test              # Validasi struktur konten
```

## 6. Deploy ke Netlify + Decap CMS

1. Import repository GitHub ke **Netlify** (**Add new site → Import an existing project**).
2. Pengaturan otomatis dibaca dari `netlify.toml`:
   - **Build command**: `cd frontend && npm ci && npm run build`
   - **Publish directory**: `frontend/out`
   - **Node version**: `22`
   - **Next.js runtime plugin**: dilewati (`NETLIFY_NEXT_PLUGIN_SKIP = "true"`)
3. Aktifkan autentikasi CMS di dashboard Netlify:
   - **Site configuration → Identity → Enable Identity**
   - **Registration preferences → Invite only**
   - **Services → Git Gateway → Enable Git Gateway**
   - **Identity → Invite users** → undang email pengelola kafe
4. Akses CMS produksi di `https://<nama-site>.netlify.app/admin/`.
