// frontend/src/lib/cafeData.ts
// Comprehensive dataset for Kontrakan Coffee landing page

export interface CafeMenuItem {
  id: string;
  nama: string;
  kategori: "kopi" | "non-kopi" | "camilan";
  harga: number;
  deskripsi: string;
  foto: string;
  ukuran?: string[];
  rasa?: string[];
  rekomendasi: boolean;
  badge?: string;
  specs?: string;
}

export interface CafeGalleryItem {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  sudut_favorit: boolean;
  kategori?: string;
  tag: string;
}

export interface CafePromoItem {
  id: string;
  judul: string;
  deskripsi: string;
  tipe: "promo" | "kegiatan";
  tanggal_mulai: string;
  tanggal_selesai: string;
  gambar: string;
  aktif: boolean;
}

export interface CafeJamBuka {
  hari: string;
  buka: string;
  tutup: string;
  libur: boolean;
  catatan?: string;
}

export interface CafeInfo {
  nama: string;
  tagline: string;
  alamat: string;
  patokan: string;
  koordinat: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappText: string;
  instagram: string;
  instagramHandle: string;
  tiktok?: string;
  email: string;
  jamBuka: CafeJamBuka[];
  fasilitas: { icon: string; title: string; desc: string }[];
}

export const CAFE_INFO: CafeInfo = {
  nama: "Kontrakan Coffee",
  tagline: "Spatial Botanical & Warm Monochrome Atelier",
  alamat: "Jl. Nyai Ketrik, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229",
  patokan: "Kawasan Sekaran, Gunungpati — dekat kampus Universitas Negeri Semarang (UNNES).",
  koordinat: "7.0505° S, 110.3920° E",
  googleMapsUrl: "https://maps.app.goo.gl/7kn5wi3aeE15r61T9?g_st=ic",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=Jl.+Nyai+Ketrik,+Sekaran,+Kec.+Gn.+Pati,+Kota+Semarang,+Jawa+Tengah+50229&t=&z=16&ie=UTF8&iwloc=&output=embed",
  whatsapp: "6281234567890",
  whatsappDisplay: "+62 812-3456-7890",
  whatsappText: "Halo Kontrakan Coffee, saya ingin bertanya tentang menu dan reservasi meja.",
  instagram: "https://www.instagram.com/kontrakan.coffee?dlrf=aHpsbXB6ajE4dmQ3",
  instagramHandle: "@kontrakan.coffee",
  tiktok: "https://www.tiktok.com/@kontrakancoffee?_r=1&_t=ZS-9AubeEe0g5M",
  email: "atelier@kontrakancoffee.com",
  jamBuka: [
    { hari: "Senin", buka: "09:00", tutup: "23:00", libur: false, catatan: "Weekday Roastery Session" },
    { hari: "Selasa", buka: "09:00", tutup: "23:00", libur: false, catatan: "Weekday Roastery Session" },
    { hari: "Rabu", buka: "09:00", tutup: "23:00", libur: false, catatan: "Midweek Chill & Study" },
    { hari: "Kamis", buka: "09:00", tutup: "23:00", libur: false, catatan: "Acoustic Evening" },
    { hari: "Jumat", buka: "13:00", tutup: "23:30", libur: false, catatan: "Buka setelah Sholat Jumat" },
    { hari: "Sabtu", buka: "09:00", tutup: "24:00", libur: false, catatan: "Weekend Midnight Coffee" },
    { hari: "Minggu", buka: "09:00", tutup: "23:00", libur: false, catatan: "Sunday Relax & Slow Bar" },
  ],
  fasilitas: [
    {
      icon: "wifi",
      title: "Wi-Fi Cepat 100 Mbps",
      desc: "Koneksi stabil di seluruh sudut untuk kebutuhan tugas dan WFC produktif.",
    },
    {
      icon: "plug",
      title: "Stopkontak di Tiap Meja",
      desc: "Tidak perlu berebut colokan, meja kerja komunal dilengkapi port ganda.",
    },
    {
      icon: "wind",
      title: "Ruang Indoor Ber-AC",
      desc: "Bebas asap rokok, sejuk, dan tenang untuk fokus membaca atau bekerja.",
    },
    {
      icon: "trees",
      title: "Outdoor Garden Rindang",
      desc: "Area terbuka bernuansa taman hijau untuk nongkrong santai sambil merokok.",
    },
    {
      icon: "car",
      title: "Parkir Luas & Aman",
      desc: "Tersedia area parkir motor dan mobil tertata rapi dijaga petugas kafe.",
    },
    {
      icon: "sparkles",
      title: "Musholla Nyaman",
      desc: "Tempat ibadah bersih dan lengkap dengan sarung, mukena, serta tempat wudhu.",
    },
  ],
};

export const MENU_ITEMS: CafeMenuItem[] = [
  // Rekomendasi 1: Es Kopi Susu
  {
    id: "es-kopi-susu",
    nama: "Es Kopi Susu",
    kategori: "kopi",
    harga: 18000,
    deskripsi:
      "Espresso double shot dari biji arabika-robusta pilihan, dipadukan dengan susu segar dingin dan lelehan gula aren murni. Menghasilkan rasa yang seimbang, manis lembut, dan creamy.",
    foto: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular (12oz)", "Large (16oz)"],
    rasa: ["Original Aren", "Less Sweet", "Oat Milk Substitute (+5k)"],
    rekomendasi: true,
    badge: "BEST SELLER",
    specs: "Double Shot / Gula Aren Murni / Fresh Milk",
  },
  // Rekomendasi 2: Caramel Macchiato
  {
    id: "caramel-macchiato",
    nama: "Caramel Macchiato",
    kategori: "kopi",
    harga: 24000,
    deskripsi:
      "Kombinasi harmonis antara susu segar creamy, sirup vanilla madagascar premium, lapisan espresso pekat, dan siraman saus karamel legit di bagian atas.",
    foto: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Normal Sweet", "Less Sweet"],
    rekomendasi: true,
    badge: "SIGNATURE",
    specs: "Madagascar Vanilla / Microfoam / House Caramel",
  },
  // Rekomendasi 3: Cold Brew Gayo
  {
    id: "cold-brew-gayo",
    nama: "Cold Brew Gayo",
    kategori: "kopi",
    harga: 23000,
    deskripsi:
      "Kopi seduh dingin selama 16 jam menggunakan 100% biji Arabika Aceh Gayo pilihan. Memiliki tingkat keasaman rendah dengan aroma floral lembut dan sentuhan citrus alami.",
    foto: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Bottle 250ml"],
    rasa: ["Black Floral Clean", "White Cream (+Gula Aren)"],
    rekomendasi: true,
    badge: "SLOW BREW",
    specs: "16-Hour Cold Extraction / 100% Gayo Arabica / Low Acid",
  },
  // Rekomendasi 4: Matcha Latte
  {
    id: "matcha-latte",
    nama: "Matcha Latte",
    kategori: "non-kopi",
    harga: 22000,
    deskripsi:
      "Pure ceremonial Uji Matcha Jepang premium dipadukan dengan steamed fresh milk yang lembut. Menghadirkan rasa umami khas dan manis legit yang menenangkan.",
    foto: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Iced Cold", "Hot Steam", "Oat Milk Substitute (+5k)"],
    rekomendasi: true,
    badge: "JAPANESE UJI",
    specs: "Ceremonial Uji Matcha / Velvety Milk / Rich Umami",
  },
  // Rekomendasi 5: Signature Dark Chocolate
  {
    id: "signature-dark-chocolate",
    nama: "Signature Dark Chocolate",
    kategori: "non-kopi",
    harga: 22000,
    deskripsi:
      "Minuman cokelat kaya rasa dari racikan dark cocoa lokal Jawa Timur 70% dan susu segar gurih. Teksturnya kental dengan rasa manis pahit yang seimbang dan comforting.",
    foto: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Hot Dark", "Iced Creamy", "Extra Marshmallow (+3k)"],
    rekomendasi: true,
    badge: "HOUSE BLEND",
    specs: "70% Single Origin Cocoa / Fresh Dairy / Bitter-Sweet",
  },
  // Rekomendasi 6: Kentang Truffle Parmesan
  {
    id: "kentang-truffle",
    nama: "Kentang Truffle Parmesan",
    kategori: "camilan",
    harga: 20000,
    deskripsi:
      "Kentang goreng shoestring renyah berbalut aroma minyak white truffle mewah, ditaburi parutan keju parmesan gurih dan peterseli cincang. Disajikan dengan cocolan saus tartar homemade.",
    foto: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Porsi Sharing"],
    rasa: ["Truffle Parmesan", "Sea Salt Classic"],
    rekomendasi: true,
    badge: "CHEF'S FAVORITE",
    specs: "White Truffle Oil / Grated Parmesan / House Tartar",
  },

  // Menu Lainnya
  {
    id: "manual-brew-v60",
    nama: "Manual Brew V60",
    kategori: "kopi",
    harga: 22000,
    deskripsi:
      "Seduhan tangan metode pour-over V60 oleh barista handal. Menghasilkan karakter seduhan jernih dan menonjolkan profil tasting notes unik dari setiap varietas biji kopi nusantara.",
    foto: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Hot Servings (200ml)"],
    rasa: ["Flores Bajawa", "Mandheling", "Ethiopia Guji (+4k)"],
    rekomendasi: false,
    specs: "Pour-Over V60 / Micro-Lot Beans / Calibrated Water 92°C",
  },
  {
    id: "americano",
    nama: "Americano",
    kategori: "kopi",
    harga: 15000,
    deskripsi:
      "Kopi hitam klasik perpaduan double shot espresso pekat dan air mineral segar. Crema keemasan tipis dengan body medium dan aroma roasted cacao yang harum.",
    foto: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Hot", "Iced Cold"],
    rekomendasi: false,
    specs: "Double Shot Espresso / Clean Finish / Zero Calorie",
  },
  {
    id: "cafe-latte",
    nama: "Cafe Latte",
    kategori: "kopi",
    harga: 20000,
    deskripsi:
      "Paduan seimbang single shot espresso berkualitas dengan steamed milk lembut dan lapisan microfoam sutra halus. Sempurna untuk menemani obrolan santai sore.",
    foto: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Hot (Latte Art)", "Iced", "Oat Milk (+5k)"],
    rekomendasi: false,
    specs: "Smooth Microfoam / Balanced Roast / Creamy Texture",
  },
  {
    id: "artisan-earl-grey",
    nama: "Artisan Earl Grey Tea",
    kategori: "non-kopi",
    harga: 16000,
    deskripsi:
      "Seduhan daun teh hitam pilihan dengan infused minyak bergamot Italia murni. Memberikan aroma sitrus menyegarkan yang menenangkan pikiran dan tenggorokan.",
    foto: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Hot Tea Pot", "Iced Lemon Earl Grey"],
    rekomendasi: false,
    specs: "Whole Leaf Black Tea / Italian Bergamot / Relaxing Citrus",
  },
  {
    id: "berry-lemonade",
    nama: "Berry Lemonade Fizz",
    kategori: "non-kopi",
    harga: 18000,
    deskripsi:
      "Mocktail dingin berkarbonasi dengan perasan buah lemon segar, selai stroberi homemade, dan daun mint. Sangat menyegarkan dinikmati di tengah siang hari terik.",
    foto: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Large (16oz)"],
    rasa: ["Strawberry Lemon", "Blueberry Mint"],
    rekomendasi: false,
    specs: "Sparkling Soda / Fresh Strawberry Purée / Squeezed Lemon",
  },
  {
    id: "red-velvet-cream",
    nama: "Red Velvet Cream",
    kategori: "non-kopi",
    harga: 22000,
    deskripsi:
      "Paduan bubuk red velvet premium bernuansa cokelat manis gurih dengan susu vanila segar. Disajikan dingin dengan warna merah delima cantik dan krim lembut.",
    foto: "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Regular", "Large"],
    rasa: ["Original Creamy", "Cheese Foam Topping (+3k)"],
    rekomendasi: false,
    specs: "Premium Cocoa Beetroot / Vanilla Infusion / Silky Body",
  },
  {
    id: "croissant-butter",
    nama: "Croissant Butter",
    kategori: "camilan",
    harga: 20000,
    deskripsi:
      "Pastry gaya Prancis renyah berlapis dengan aroma butter asli yang harum. Bagian luar berkulit garing keemasan dengan tekstur dalam yang lembut dan berongga cantik.",
    foto: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["1 Pcs"],
    rasa: ["Warm Butter Toast", "Strawberry Jam Dip"],
    rekomendasi: false,
    specs: "French Butter / 24-Layer Lamination / Baked Fresh Daily",
  },
  {
    id: "pain-au-chocolat",
    nama: "Pain au Chocolat",
    kategori: "camilan",
    harga: 22000,
    deskripsi:
      "Pastry mentega renyah berlapis dengan isian batangan cokelat pekat ganda yang meleleh nikmat saat dihangatkan. Teman terbaik secangkir latte panas.",
    foto: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["1 Pcs"],
    rasa: ["Dark Chocolate Melt"],
    rekomendasi: false,
    specs: "Double Dark Chocolate Batons / Flaky Butter Pastry",
  },
  {
    id: "roti-bakar-senja",
    nama: "Roti Bakar Senja Cokelat Keju",
    kategori: "camilan",
    harga: 18000,
    deskripsi:
      "Roti tawar gandum tebal dipanggang dengan olesan mentega gurih, ditaburi cokelat meses melimpah, parutan keju cheddar gurih, dan kucuran susu kental manis.",
    foto: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["Porsi Berbagi (4 Potong)"],
    rasa: ["Cokelat Keju", "Matcha Keju", "Tiramisu"],
    rekomendasi: false,
    specs: "Artisan Brioche Bread / Cheddar Grated / Chocolate Melt",
  },
  {
    id: "cireng-rujak",
    nama: "Cireng Salju Bumbu Rujak",
    kategori: "camilan",
    harga: 15000,
    deskripsi:
      "Camilan khas bertekstur krispi di luar dan kenyal lembut di dalam. Disajikan hangat bersama cocolan sambal rujak gula aren pedas manis asam segar.",
    foto: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    ukuran: ["8 pcs (Sharing)"],
    rasa: ["Pedas Sedang", "Ekstra Pedas"],
    rekomendasi: false,
    specs: "Crispy Tapioca / Sweet Spicy Aren Sambal / Fresh Fry",
  },
];

export const GALLERY_ITEMS: CafeGalleryItem[] = [
  {
    id: "sudut-jendela",
    judul: "Sudut Jendela Senja",
    deskripsi:
      "Pencahayaan alami sore hari yang menembus kaca atelier, menciptakan bayangan sinematis yang hangat dan menenangkan bagi setiap pengunjung.",
    gambar: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    sudut_favorit: true,
    tag: "GOLDEN HOUR",
  },
  {
    id: "barista-manual-bar",
    judul: "Barista Manual Brew Bar",
    deskripsi:
      "Menyaksikan langsung ketelitian barista kami menyeduh kopi filter manual V60 dan espresso presisi menggunakan mesin atelier terpilih.",
    gambar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    sudut_favorit: false,
    tag: "SLOW CRAFT",
  },
  {
    id: "coffee-bar-area",
    judul: "Monolithic Coffee Bar",
    deskripsi:
      "Konter barista terbuka dari beton halus berpadu kayu natural ash, menciptakan ruang dialog hangat antara barista dan penikmat kopi.",
    gambar: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    sudut_favorit: false,
    tag: "SPATIAL PURITY",
  },
  {
    id: "meja-komunal-kerja",
    judul: "Meja Komunal Coworking",
    deskripsi:
      "Area meja kayu panjang ergonomis untuk nugas dan WFC produktif. Setiap kursi dilengkapi akses stopkontak dan jaringan Wi-Fi 100 Mbps.",
    gambar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    sudut_favorit: true,
    tag: "WFC & STUDY",
  },
  {
    id: "outdoor-garden",
    judul: "Outdoor Garden Rindang",
    deskripsi:
      "Area terbuka semi rindang beratap kanopi teduh dan pepohonan hijau. Suasana asri untuk mengobrol santai melepas penat di sore hingga malam.",
    gambar: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
    sudut_favorit: true,
    tag: "NATURAL BREEZE",
  },
  {
    id: "sudut-estetik-cahaya",
    judul: "Warm Amber Lounge",
    deskripsi:
      "Sudut sofa empuk dengan pencahayaan temaram amber gold 2700K. Spot paling nyaman untuk membaca buku atau menikmati secangkir pour-over hangat.",
    gambar: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    sudut_favorit: true,
    tag: "COZY CORNER",
  },
];

export const PROMO_ITEMS: CafePromoItem[] = [
  {
    id: "diskon-senja",
    judul: "Promo Senja Ceria 20%",
    deskripsi:
      "Dapatkan diskon 20% untuk semua varian menu kopi setiap pukul 16:00 - 18:00 WIB.",
    tipe: "promo",
    tanggal_mulai: "2026-01-01",
    tanggal_selesai: "2026-12-31",
    gambar:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    aktif: true,
  },
  {
    id: "paket-pelajar",
    judul: "Paket Nongkrong Pelajar & Mahasiswa Rp 25.000",
    deskripsi:
      "Dapatkan kombinasi 1 Es Kopi Susu Senja + 1 Porsi Cireng Rujak Salju hanya Rp 25.000 dengan menunjukkan kartu pelajar atau KTM aktif. Berlaku setiap Senin hingga Jumat.",
    tipe: "promo",
    tanggal_mulai: "2026-01-01",
    tanggal_selesai: "2026-12-31",
    gambar:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1200&auto=format&fit=crop",
    aktif: true,
  },
  {
    id: "live-music-akustik",
    judul: "Acoustic Night: Senja Berdendang",
    deskripsi:
      "Nikmati alunan musik akustik indie dan pop santai setiap hari Sabtu malam mulai pukul 19:30 WIB di area outdoor garden. Tanpa tiket masuk, cukup pesan menu favoritmu!",
    tipe: "kegiatan",
    tanggal_mulai: "2026-01-01",
    tanggal_selesai: "2026-12-31",
    gambar:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    aktif: true,
  },
];

export function getRecommendedItems(): CafeMenuItem[] {
  return MENU_ITEMS.filter((item) => item.rekomendasi);
}

export function formatPriceRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function getOpenStatusWIB(): {
  isOpen: boolean;
  statusText: string;
  badgeText: string;
  todayName: string;
  todaySchedule: CafeJamBuka;
  currentTimeStr: string;
} {
  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const now = new Date();
  // Hitung waktu WIB (UTC + 7)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);

  const dayIndex = wib.getDay();
  const todayName = daysOfWeek[dayIndex];
  const hours = String(wib.getHours()).padStart(2, "0");
  const minutes = String(wib.getMinutes()).padStart(2, "0");
  const currentTimeStr = `${hours}:${minutes}`;

  const schedule =
    CAFE_INFO.jamBuka.find((j) => j.hari.toLowerCase() === todayName.toLowerCase()) ||
    CAFE_INFO.jamBuka[0];

  const buka = schedule.buka;
  const tutup = schedule.tutup === "24:00" ? "23:59" : schedule.tutup;

  const isOpen = !schedule.libur && currentTimeStr >= buka && currentTimeStr <= tutup;

  let statusText = "";
  let badgeText = "";

  if (isOpen) {
    statusText = `Buka sekarang • Tutup pukul ${schedule.tutup} WIB`;
    badgeText = "BUKA SEKARANG";
  } else if (currentTimeStr < buka) {
    statusText = `Sedang tutup • Buka hari ini pukul ${buka} WIB`;
    badgeText = "SEDANG TUTUP";
  } else {
    // Cari jadwal hari esok
    const nextIdx = (dayIndex + 1) % 7;
    const nextDayName = daysOfWeek[nextIdx];
    const nextSchedule = CAFE_INFO.jamBuka.find(
      (j) => j.hari.toLowerCase() === nextDayName.toLowerCase()
    );
    statusText = nextSchedule
      ? `Sedang tutup • Buka besok (${nextSchedule.hari}) pukul ${nextSchedule.buka} WIB`
      : "Sedang tutup";
    badgeText = "SEDANG TUTUP";
  }

  return {
    isOpen,
    statusText,
    badgeText,
    todayName,
    todaySchedule: schedule,
    currentTimeStr,
  };
}

