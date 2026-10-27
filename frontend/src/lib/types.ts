// frontend/src/lib/types.ts

export type Kategori = {
  id: string;
  nama: string;
  urutan: number;
};

export type MenuItem = {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  deskripsi: string;
  foto: string;
  ukuran?: string[];
  rasa?: string[];
  rekomendasi: boolean;
  aktif: boolean;
};

export type MenuWithKategori = MenuItem & {
  kategoriNama: string;
};

export type MenuDetailResponse = MenuItem & {
  hargaFormatted: string;
  relatedMenu: MenuItem[];
};

export type GaleriFoto = {
  id: string;
  judul: string;
  gambar: string;
  sudut_favorit: boolean;
  urutan: number;
};

export type Hari =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export type JamBuka = {
  hari: Hari | string;
  buka: string;
  tutup: string;
  libur: boolean;
};

export type InfoToko = {
  nama_toko: string;
  alamat: string;
  patokan?: string;
  link_peta: string;
  embed_peta?: string;
  instagram: string;
  tiktok?: string;
  /** Nomor WhatsApp format internasional tanpa "+" (mis. 6281234567890). Opsional — hanya kanal kontak. */
  whatsapp?: string;
  jam_buka: JamBuka[];
};

export type StatusToko = {
  isOpen: boolean;
  pesanStatus: string;
  jamHariIni?: JamBuka;
  hariIni: string;
  sekarangJam: string;
};

export type Promo = {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  gambar?: string;
  tipe: "promo" | "kegiatan";
  aktif: boolean;
};
