// src/lib/types.ts
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

export type GaleriFoto = {
  id: string;
  judul: string;
  gambar: string;
  sudut_favorit: boolean;
  urutan: number;
};

export type JamBuka = {
  hari: string;
  buka: string;
  tutup: string;
  libur: boolean;
};

export type InfoToko = {
  nama_toko: string;
  alamat: string;
  link_peta: string;
  whatsapp: string;
  instagram: string;
  jam_buka: JamBuka[];
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