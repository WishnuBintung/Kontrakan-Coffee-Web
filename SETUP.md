# Panduan Setup — Landing Page Coffee Shop (Kopi Senja)

> Referensi utama: [`kopi-senja-PRD.md`](./kopi-senja-PRD.md). Setiap langkah di bawah dicantumkan bagian PRD yang menjadi dasarnya.
> Semua perintah ditulis untuk **Windows PowerShell**.

---

## 0. Checklist Ringkas

| # | Yang harus di-setup | Dasar di PRD |
| --- | --- | --- |
| 1 | Node.js **22.x LTS** + npm **10.x** | §7.1 Runtime |
| 2 | Git + akun GitHub (repo konten) | §5, §7.3 |
| 3 | Akun Netlify | §7.5, §7.6 |
| 4 | Proyek Next.js **15** (App Router, TypeScript strict, Tailwind **4**, ESLint 9) | §7.1, §7.2 |
| 5 | shadcn/ui, lucide-react, motion (opsional), Prettier | §7.1 |
| 6 | `next.config.ts` → static export (`output: 'export'`) | §7.2 Mode render |
| 7 | Folder konten (`content/`) + tipe TypeScript sesuai skema | §6 |
| 8 | Decap CMS 3 di `public/admin/` (`index.html` + `config.yml`) | §7.3 |
| 9 | `netlify.toml` (`NODE_VERSION=22`, publish `out`) | §7.6 |
| 10 | Netlify Identity + Git Gateway, undang pemilik kafe | §7.5, §4B |

> [!WARNING]
> **Kondisi mesin kamu saat ini:** Node `v24.15.0` dan npm `12.0.2`. PRD mematok **Node 22.x + npm 10.x** (dan Netlify di-set `NODE_VERSION=22`). Samakan versi lokal dengan langkah 1 supaya build lokal = build Netlify.

---

## 1. Prasyarat (Tools & Akun)

### 1.1 Node.js 22 via nvm-windows
```powershell
winget install CoreyButler.NVMforWindows
# tutup & buka ulang terminal, lalu:
nvm install 22
nvm use 22
node -v   # harus v22.x
npm -v    # harus 10.x
```

### 1.2 Git & akun
- Git sudah terpasang (`2.49`) ✅ — set identitas bila belum:
  ```powershell
  git config --global user.name  "Nama Kamu"
  git config --global user.email "email@kamu.com"
  ```
- Buat akun **GitHub** (tempat repo + konten CMS disimpan).
- Buat akun **Netlify** (login pakai GitHub agar mudah dihubungkan).

### 1.3 Editor (disarankan)
VS Code + ekstensi: *ESLint*, *Prettier*, *Tailwind CSS IntelliSense*, *YAML* (untuk `config.yml`).

---

## 2. Inisialisasi Proyek Next.js 15

> [!IMPORTANT]
> Pakai **`create-next-app@15`**, bukan `@latest` — `@latest` bisa memasang major yang lebih baru dan melanggar kebijakan versi PRD §7.7.

`create-next-app` menolak folder yang berisi file asing, jadi pindahkan PRD sementara:

```powershell
cd d:\Bintang\ProjectAlaAla\kontrakan-coffee
Move-Item .\kopi-senja-PRD.md ..\ ; Move-Item .\SETUP.md ..\

npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack

Move-Item ..\kopi-senja-PRD.md . ; Move-Item ..\SETUP.md .
```

Cek hasilnya:
- `package.json` → `next` `^15.x`, `react` `^19.x`, `tailwindcss` `^4.x`
- `tsconfig.json` → `"strict": true`
- **Tidak ada** `tailwind.config.js` (Tailwind v4 dikonfigurasi lewat `@theme` di `src/app/globals.css`)

### 2.1 Kunci versi Node
```powershell
"22" | Out-File -Encoding ascii .nvmrc
npm pkg set engines.node=">=20.9 <23"
```

---

## 3. Dependency Tambahan

```powershell
# UI & konten
npm i lucide-react gray-matter
npm i motion                      # opsional (Framer Motion 12)

# Format
npm i -D prettier prettier-plugin-tailwindcss eslint-config-prettier
```

Buat `.prettierrc`:
```json
{ "semi": true, "singleQuote": false, "plugins": ["prettier-plugin-tailwindcss"] }
```

Tambahkan `"prettier"` ke akhir array extends/config di `eslint.config.mjs` (agar ESLint tidak bentrok dengan Prettier).

### 3.1 shadcn/ui (copy-in ke `components/ui`)
```powershell
npx shadcn@latest init
npx shadcn@latest add button card badge input dialog tabs skeleton
```
Pemetaan ke fitur PRD: `card` (kartu menu), `tabs`/`badge` (kategori & label rekomendasi), `input` (cari menu), `dialog` (foto layar penuh & detail), `skeleton` (loading gambar).

> Jangan pasang: Prisma/PostgreSQL, NextAuth, Stripe/Midtrans, Supabase, Redux/Zustand (PRD §7.7).

---

## 4. Konfigurasi Static Export

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // PRD §7.2 — statis penuh untuk Netlify + Decap
  trailingSlash: true,       // /admin/ → admin/index.html
  images: { unoptimized: true }, // wajib: optimizer next/image tidak jalan di static export
};

export default nextConfig;
```

Konsekuensi `output: 'export'` yang perlu diingat:
- Route dinamis `/menu/[slug]` **wajib** punya `generateStaticParams()` dan `export const dynamicParams = false`.
- Tidak ada API route / Server Actions / middleware (memang tidak dibutuhkan, PRD §7.4).
- Kompres foto sebelum upload (atau via CMS) karena gambar tidak dioptimasi otomatis.

---

## 5. Struktur Folder

```
kontrakan-coffee/
├─ content/                    # "database" (PRD §6) — ditulis oleh Decap CMS
│  ├─ menu/*.md                # koleksi menu_item
│  ├─ kategori/*.yml           # koleksi kategori
│  ├─ galeri/*.md              # koleksi galeri_foto
│  ├─ promo/*.md               # koleksi promo (Fase 3)
│  └─ info-toko.json           # koleksi info_toko (satu entri)
├─ public/
│  ├─ admin/
│  │  ├─ index.html            # Decap CMS
│  │  └─ config.yml
│  └─ images/uploads/          # foto hasil upload CMS
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx              # profil + promo + daftar menu
│  │  ├─ menu/[slug]/page.tsx  # detail menu
│  │  └─ galeri/page.tsx       # galeri + sudut favorit
│  ├─ components/ui/           # shadcn
│  ├─ components/              # MenuCard, MenuFilter, Lightbox, JamBuka, dll.
│  └─ lib/
│     ├─ content.ts            # baca file konten saat build
│     └─ types.ts              # tipe sesuai skema PRD §6
├─ netlify.toml
└─ kopi-senja-PRD.md
```

### 5.1 Tipe data (`src/lib/types.ts`)
```ts
export type Kategori = { id: string; nama: string; urutan: number };

export type MenuItem = {
  id: string; nama: string; kategori: string; harga: number;
  deskripsi: string; foto: string; ukuran?: string[]; rasa?: string[];
  rekomendasi: boolean; aktif: boolean;
};

export type GaleriFoto = {
  id: string; judul: string; gambar: string; sudut_favorit: boolean; urutan: number;
};

export type JamBuka = { hari: string; buka: string; tutup: string; libur: boolean };

export type InfoToko = {
  nama_toko: string; alamat: string; link_peta: string;
  whatsapp: string; instagram: string; jam_buka: JamBuka[];
};

export type Promo = {
  id: string; judul: string; deskripsi: string;
  tanggal_mulai: string; tanggal_selesai: string;
  gambar?: string; tipe: "promo" | "kegiatan"; aktif: boolean;
};
```

### 5.2 Loader konten (contoh, `src/lib/content.ts`)
```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { MenuItem } from "./types";

const CONTENT = path.join(process.cwd(), "content");

export function getMenu(): MenuItem[] {
  const dir = path.join(CONTENT, "menu");
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return { id: f.replace(/\.md$/, ""), deskripsi: content.trim(), ...data } as MenuItem;
    })
    .filter((m) => m.aktif);
}
```
Pola yang sama dipakai untuk galeri, promo (filter juga `tanggal_mulai ≤ hari ini ≤ tanggal_selesai`), dan kategori (`yaml` → bisa pakai `gray-matter` atau `npm i yaml`).

### 5.3 Contoh isi awal
`content/kategori/kopi.yml`
```yaml
nama: Kopi
urutan: 1
```
`content/menu/es-kopi-susu.md`
```md
---
nama: Es Kopi Susu
kategori: kopi
harga: 18000
foto: /images/uploads/es-kopi-susu.jpg
ukuran: [Regular, Large]
rasa: [Original, Aren]
rekomendasi: true
aktif: true
---
Espresso, susu segar, dan gula aren.
```

---

## 6. Decap CMS 3 (`/admin`)

### 6.1 `public/admin/index.html`
```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Admin — Kopi Senja</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

### 6.2 `public/admin/config.yml` (dipetakan dari PRD §6)
```yaml
backend:
  name: git-gateway
  branch: main

local_backend: true                 # untuk edit lokal via `npx decap-server`
publish_mode: editorial_workflow    # PRD §2 no.8: draft → review/pratinjau → publish

media_folder: public/images/uploads
public_folder: /images/uploads

collections:
  - name: menu
    label: Menu
    folder: content/menu
    create: true
    slug: "{{slug}}"
    identifier_field: nama
    summary: "{{nama}} — Rp{{harga}}"
    fields:
      - { label: Nama, name: nama, widget: string }
      - label: Kategori
        name: kategori
        widget: relation
        collection: kategori
        search_fields: [nama]
        value_field: "{{slug}}"
        display_fields: [nama]
      - { label: Harga (Rp), name: harga, widget: number, value_type: int, min: 0 }
      - { label: Foto, name: foto, widget: image }
      - { label: Ukuran, name: ukuran, widget: list, required: false }
      - { label: Rasa / Varian, name: rasa, widget: list, required: false }
      - { label: Menu Rekomendasi, name: rekomendasi, widget: boolean, default: false }
      - { label: Tampilkan, name: aktif, widget: boolean, default: true }
      - { label: Deskripsi, name: body, widget: markdown }

  - name: kategori
    label: Kategori
    folder: content/kategori
    extension: yml
    format: yml
    create: true
    slug: "{{slug}}"
    identifier_field: nama
    fields:
      - { label: Nama, name: nama, widget: string }
      - { label: Urutan, name: urutan, widget: number, value_type: int }

  - name: galeri
    label: Galeri
    folder: content/galeri
    create: true
    slug: "{{slug}}"
    identifier_field: judul
    fields:
      - { label: Judul, name: judul, widget: string }
      - { label: Gambar, name: gambar, widget: image }
      - { label: Sudut Favorit, name: sudut_favorit, widget: boolean, default: false }
      - { label: Urutan, name: urutan, widget: number, value_type: int }

  - name: promo
    label: Promo & Kegiatan
    folder: content/promo
    create: true
    slug: "{{slug}}"
    identifier_field: judul
    fields:
      - { label: Judul, name: judul, widget: string }
      - { label: Tipe, name: tipe, widget: select, options: [promo, kegiatan] }
      - { label: Deskripsi, name: deskripsi, widget: text }
      - { label: Tanggal Mulai, name: tanggal_mulai, widget: datetime, time_format: false, format: "YYYY-MM-DD" }
      - { label: Tanggal Selesai, name: tanggal_selesai, widget: datetime, time_format: false, format: "YYYY-MM-DD" }
      - { label: Gambar, name: gambar, widget: image, required: false }
      - { label: Tampilkan, name: aktif, widget: boolean, default: true }

  - name: pengaturan
    label: Info Toko
    files:
      - name: info_toko
        label: Info Toko
        file: content/info-toko.json
        fields:
          - { label: Nama Toko, name: nama_toko, widget: string }
          - { label: Alamat, name: alamat, widget: text }
          - { label: Link Google Maps, name: link_peta, widget: string }
          - label: WhatsApp (format 62xxx)
            name: whatsapp
            widget: string
            pattern: ["^62[0-9]{8,13}$", "Awali dengan 62, tanpa + / spasi"]
          - { label: Instagram (URL), name: instagram, widget: string }
          - label: Jam Buka
            name: jam_buka
            widget: list
            fields:
              - { label: Hari, name: hari, widget: select, options: [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu] }
              - { label: Buka, name: buka, widget: string, hint: "contoh 08:00" }
              - { label: Tutup, name: tutup, widget: string, hint: "contoh 22:00" }
              - { label: Libur, name: libur, widget: boolean, default: false }
```

### 6.3 Menjalankan CMS secara lokal
```powershell
# terminal 1
npm run dev
# terminal 2
npx decap-server
```
Buka `http://localhost:3000/admin/index.html` → edit konten → file di `content/` langsung berubah (tanpa login).

---

## 7. Netlify

### 7.1 `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "22"
```

### 7.2 Redirect token undangan ke `/admin`
Email undangan Netlify Identity mengarah ke `/` dengan `#invite_token=...`. Tambahkan di `src/app/layout.tsx` (di dalam `<body>`):
```tsx
import Script from "next/script";
// ...
<Script id="identity-redirect" strategy="beforeInteractive">
  {`if (/(invite|recovery|confirmation)_token=/.test(location.hash)) location.replace('/admin/' + location.hash);`}
</Script>
```

### 7.3 Push & hubungkan
```powershell
git add -A
git commit -m "chore: init Next.js 15 + Decap CMS"
git branch -M main
git remote add origin https://github.com/<username>/kontrakan-coffee.git
git push -u origin main
```
Lalu di dashboard Netlify:
1. **Add new site → Import from Git** → pilih repo. Build command & publish dir otomatis terbaca dari `netlify.toml`.
2. **Site configuration → Identity → Enable Identity**.
3. Identity → **Registration: Invite only** (supaya orang asing tidak bisa daftar).
4. Identity → Services → **Enable Git Gateway**.
5. Identity → **Invite users** → masukkan email pemilik kafe/staf.
6. (Untuk pratinjau) **Deploy Previews** aktif → setiap draft di editorial workflow mendapat URL preview.
7. Buka `https://<nama-site>.netlify.app/admin/` → login → coba ubah harga → publish → cek situs ter-update.

> [!WARNING]
> **Git Gateway sudah berstatus deprecated** di Netlify (masih berfungsi, tetapi tidak lagi dikembangkan). Stack PRD tetap bisa dipakai, namun siapkan rencana cadangan:
> - **DecapBridge** — pengganti Git Gateway, tetap pakai Decap CMS, pemilik kafe login dengan email/password.
> - **Sveltia CMS** — drop-in pengganti Decap (memakai `config.yml` yang sama), login langsung via GitHub.
>
> Karena konten tetap berupa file di `content/`, mengganti lapisan auth/CMS tidak mengubah kode Next.js.

> [!NOTE]
> Bila build Netlify gagal karena plugin Next.js otomatis (`@netlify/plugin-nextjs`) tidak cocok dengan `output: 'export'`, nonaktifkan plugin tersebut di **Site configuration → Build & deploy**; situs cukup dilayani sebagai folder statis `out/`.

---

## 8. Verifikasi Setup

```powershell
npm run lint
npm run build      # harus menghasilkan folder out/ tanpa error
npx serve out      # cek hasil statis di http://localhost:3000
```
Checklist:
- [ ] `node -v` = 22.x, `package-lock.json` ter-commit (PRD §7.7)
- [ ] `out/admin/index.html` & `out/admin/config.yml` ikut ter-build
- [ ] `/menu/<slug>/` ter-generate untuk setiap file di `content/menu/`
- [ ] Login `/admin/` di Netlify berhasil, publish memicu deploy otomatis
- [ ] Tampilan dicek di viewport ponsel (DevTools → 375px) — mobile first

---

## 9. Urutan Pengerjaan Setelah Setup (sesuai Fase PRD §3)

| Fase | Fitur | Komponen utama |
| --- | --- | --- |
| 1 — Menu Digital | Kategori, daftar & harga, detail, cari | `MenuFilter` (tabs + input), `MenuCard`, `/menu/[slug]` |
| 2 — Galeri & Info | Galeri, sudut favorit, lightbox, peta, jam buka (buka/tutup), kontak | `GaleriGrid`, `Lightbox` (dialog), `JamBuka`, `KontakButtons` (`wa.me/<nomor>`), iframe Maps `output=embed` |
| 3 — Sorotan | Banner promo, label rekomendasi, info kegiatan | `PromoBanner`, `Badge` rekomendasi, `EventList` |

Terakhir: metadata SEO + Open Graph (`export const metadata` di `layout.tsx` & `generateMetadata` di detail menu) agar tautan cantik saat dibagikan ke WhatsApp/Instagram (PRD §2 Non-Fungsional).

