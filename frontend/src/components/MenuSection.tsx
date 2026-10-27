"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  X,
  Sparkles,
  SlidersHorizontal,
  Filter,
  AlertCircle,
  Loader2,
  RefreshCw,
  Coffee,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CafeMenuItem } from "@/lib/cafeData";
import { useMenuData } from "@/hooks/useCafeData";
import { FloatingMenuCard } from "./FloatingMenuCard";
import { MenuDetailModal } from "./MenuDetailModal";
import { SplitWords } from "./EditorialMotion";

/** Fired by category picker or external cards to pre-select a filter. */
export const CATEGORY_EVENT = "kc:select-category";

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc";

const CATEGORIES = [
  { id: "semua", label: "Semua Menu" },
  { id: "kopi", label: "Kopi Atelier" },
  { id: "non-kopi", label: "Non-Kopi" },
  { id: "camilan", label: "Camilan & Pastry" },
  { id: "rekomendasi", label: "Andalan Kafe ★" },
];

const CMS_CATEGORY_NAMES: Record<string, string> = {
  kopi: "Kopi",
  "non-kopi": "Non-Kopi",
  camilan: "Camilan",
};

/**
 * Format harga ringkas untuk baris menu (misal: Rp 11.000 → 11k).
 */
function formatBoardPrice(price: number): string {
  if (!price || isNaN(price)) return "0";
  if (price >= 1000) {
    const thousands = Math.round(price / 1000);
    return `${thousands}k`;
  }
  return String(price);
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("default");

  // State card detail melayang (mengikuti kursor tanpa delay & tanpa backdrop gelap)
  const [hoveredItem, setHoveredItem] = useState<CafeMenuItem | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // State modal terkunci (saat pengguna klik/tap di mobile)
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);

  // State ekspansi daftar (5.5 baris terpotong vs semua)
  const [isExpanded, setIsExpanded] = useState(false);

  const { items: filteredItems, status, refetch } = useMenuData(
    activeCategory,
    searchQuery,
    sortBy
  );

  // Handler event navigasi kategori dari section lain
  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (typeof id === "string" && CATEGORIES.some((c) => c.id === id)) {
        setActiveCategory(id);
        setSearchQuery("");
      }
    };
    window.addEventListener(CATEGORY_EVENT, onPick);
    return () => window.removeEventListener(CATEGORY_EVENT, onPick);
  }, []);

  // Pengelompokan dinamis murni berdasarkan kategori yang ada di CMS (Kopi, Non-Kopi, Camilan)
  const categorizedMenu = useMemo(() => {
    const groups: { [key: string]: { id: string; title: string; items: CafeMenuItem[] } } = {};

    // Urutan kategori baku CMS: Kopi, Non-Kopi, Camilan
    const defaultOrder = ["kopi", "non-kopi", "camilan"];
    defaultOrder.forEach((key) => {
      groups[key] = {
        id: key,
        title: CMS_CATEGORY_NAMES[key] || key,
        items: [],
      };
    });

    filteredItems.forEach((item) => {
      const cat = (item.kategori || "kopi").toLowerCase();
      if (!groups[cat]) {
        groups[cat] = {
          id: cat,
          title: cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " "),
          items: [],
        };
      }
      groups[cat].items.push(item);
    });

    // Kembalikan hanya kategori yang memiliki menu terdaftar
    return Object.values(groups).filter((g) => g.items.length > 0);
  }, [filteredItems]);

  // Cek apakah terdapat kolom yang memiliki lebih dari 5 item
  const hasLongList = useMemo(() => {
    return categorizedMenu.some((group) => group.items.length > 5);
  }, [categorizedMenu]);

  // Kalkulasi posisi cerdas card melayang mengikuti kursor (Smart Collision Detection)
  const CARD_WIDTH = 295;
  const CARD_HEIGHT = 330;
  const OFFSET = 18;

  const updateCursorPosition = (clientX: number, clientY: number) => {
    if (typeof window === "undefined") return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Logika Sisi Layar:
    // Jika kursor berada di sisi kanan (clientX > viewportWidth / 2) atau card meluap ke kanan:
    // Card muncul di sebelah KIRI kursor.
    // Jika di sisi kiri, card muncul di sebelah KANAN kursor.
    let x = clientX + OFFSET;
    if (clientX > viewportWidth / 2 || x + CARD_WIDTH > viewportWidth - 14) {
      x = clientX - CARD_WIDTH - OFFSET;
    }

    // Batas batas aman horizontal layar
    if (x < 14) x = 14;
    if (x + CARD_WIDTH > viewportWidth - 14) {
      x = viewportWidth - CARD_WIDTH - 14;
    }

    // Batas aman vertikal layar
    let y = clientY - 70;
    if (y < 14) {
      y = 14;
    } else if (y + CARD_HEIGHT > viewportHeight - 14) {
      y = viewportHeight - CARD_HEIGHT - 14;
    }

    setCursorPos({ x, y });
  };

  const handleItemMouseEnter = (item: CafeMenuItem, e: React.MouseEvent) => {
    setHoveredItem(item);
    updateCursorPosition(e.clientX, e.clientY);
  };

  const handleItemMouseMove = (e: React.MouseEvent) => {
    updateCursorPosition(e.clientX, e.clientY);
  };

  const handleMenuContainerMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleItemClick = (item: CafeMenuItem) => {
    setHoveredItem(null);
    setSelectedItem(item);
  };

  return (
    <>
      <section
        id="menu"
        className="relative w-full bg-cream-light px-4 py-20 text-coffee sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-[90rem]">
          {/* Section Header */}
          <div className="mb-8 flex flex-col justify-between gap-6 sm:mb-12 md:flex-row md:items-end">
            <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)]">
                Menu Digital, Siap Dipilih.
              </h2>
            </div>
            <p className="max-w-md text-lg text-coffee/80">
              <SplitWords
                text="Jelajahi seduhan kopi spesialti, racikan non-kopi segar, dan kudapan artisan. Arahkan kursor atau ketuk menu untuk melihat foto dan detail lengkap."
                staggerMs={22}
              />
            </p>
          </div>

          {/* State 1: Sedang Memuat Data dari CMS */}
          {status === "loading" && (
            <div
              data-rev
              className="flex min-h-[260px] w-full items-center justify-center rounded-[0.25rem] border border-coffee/10 bg-latte/20 p-8 text-center text-coffee/60"
            >
              <div className="inline-flex items-center gap-3 text-[17px] font-medium">
                <Loader2 className="h-5 w-5 animate-spin text-coffee/70" />
                <span>Memuat katalog menu dari CMS...</span>
              </div>
            </div>
          )}

          {/* State 2: CMS Tidak Terhubung / Gagal Koneksi (Error) */}
          {status === "error" && (
            <div
              data-rev
              className="flex w-full flex-col items-center justify-center rounded-[0.25rem] border border-earth/25 bg-cream px-6 py-12 text-center text-coffee sm:px-10 sm:py-16"
            >
              <div className="mx-auto max-w-lg space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-earth/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-earth-dark">
                  <AlertCircle className="h-4 w-4" />
                  <span>Koneksi CMS Terputus</span>
                </div>
                <h3 className="font-display text-[clamp(2rem,3.2vw,2.8rem)] text-coffee">
                  Sistem Tidak Dapat Terhubung ke CMS
                </h3>
                <p className="text-[17px] leading-relaxed text-coffee/80 sm:text-lg">
                  Sistem tidak dapat terhubung ke server CMS untuk memuat katalog menu. Pastikan server backend sedang aktif atau coba muat ulang halaman.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="btn btn-earth inline-flex cursor-pointer items-center gap-2 px-6 py-2.5"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Coba Muat Ulang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State 3: Terhubung ke CMS tetapi Menu Kosong (Array === 0) */}
          {status === "empty" && (
            <div
              data-rev
              className="flex w-full flex-col items-center justify-center rounded-[0.25rem] border border-coffee/15 bg-latte/30 px-6 py-12 text-center text-coffee sm:px-10 sm:py-16"
            >
              <div className="mx-auto max-w-lg space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-coffee/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-coffee">
                  <Coffee className="h-4 w-4" />
                  <span>Katalog Menu Digital</span>
                </div>
                <h3 className="font-display text-[clamp(2rem,3.2vw,2.8rem)] text-coffee">
                  Menu Belum Dimasukkan
                </h3>
                <p className="text-[17px] leading-relaxed text-coffee/80 sm:text-lg">
                  Saat ini belum terdapat menu yang dimasukkan ke dalam sistem CMS. Silakan periksa kembali nanti atau tanyakan ketersediaan seduhan langsung kepada barista kami.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="btn btn-earth inline-flex cursor-pointer items-center gap-2 px-6 py-2.5"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Periksa Pembaruan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State 4: Ada Menu Aktif dari CMS */}
          {status === "success" && (
            <>
              {/* Kontrol Pencarian, Filter Kategori & Sort */}
              <div
                data-rev
                style={{ "--d": "90ms" } as React.CSSProperties}
                className="mb-8 space-y-4"
              >
                <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                  {/* Input pencarian */}
                  <div className="relative max-w-lg flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-coffee/70">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari menu kopi, espresso, coklat, camilan..."
                      className="w-full rounded-[0.2rem] border border-coffee/40 bg-cream py-3 pl-10 pr-10 text-[15px] text-coffee placeholder-coffee/55 transition-colors focus:border-coffee focus:outline-none focus:ring-2 focus:ring-sunshine"
                      aria-label="Cari menu kafe"
                      suppressHydrationWarning
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-coffee/70 hover:text-coffee"
                        aria-label="Bersihkan pencarian"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Pengurutan */}
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium uppercase text-coffee/70">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Urutkan:</span>
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortKey)}
                      className="cursor-pointer rounded-[0.2rem] border border-coffee bg-transparent px-3.5 py-3 text-sm font-medium uppercase text-coffee transition-colors hover:bg-coffee hover:text-sunshine focus:outline-none focus:ring-2 focus:ring-sunshine"
                      aria-label="Urutkan menu berdasarkan"
                    >
                      <option value="default">Rekomendasi Kafe</option>
                      <option value="price-asc">Harga Terendah</option>
                      <option value="price-desc">Harga Tertinggi</option>
                      <option value="name-asc">Nama Menu A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Filter Kategori Chips */}
                <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 pt-1 sm:mx-0 sm:px-0">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        aria-pressed={isActive}
                        className={`btn btn-sm shrink-0 ${isActive ? "btn-coffee" : "btn-outline"}`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pemberitahuan Khusus Mobile */}
              <div className="mb-4 flex items-center gap-2.5 rounded-[0.25rem] border border-earth/35 bg-earth/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-earth-dark sm:hidden">
                <Sparkles className="h-4 w-4 shrink-0 text-earth" />
                <span>Tekan menu untuk melihat detail &amp; foto</span>
              </div>

              {/* DAFTAR MENU MURNI (Hanya List Menu, Tanpa Ornamen Poster/Dekorasi) */}
              {filteredItems.length > 0 ? (
                <div
                  onMouseLeave={handleMenuContainerMouseLeave}
                  className="relative rounded-[0.5rem] border border-coffee/15 bg-cream p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(44,28,15,0.08)]"
                >
                  {/* Kolom Kategori Menu dengan Logika Truncation (5.5 Baris Terpotong Transparan) */}
                  <div
                    className={`relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 transition-all duration-300 ease-out ${
                      hasLongList && !isExpanded
                        ? "max-h-[252px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]"
                        : "max-h-none"
                    }`}
                  >
                    {categorizedMenu.map((group) => (
                      <div key={group.id} className="space-y-3">
                        {/* Judul Kategori Sesuai CMS */}
                        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wider text-coffee uppercase border-b border-coffee/15 pb-2">
                          {group.title}
                        </h3>

                        {/* List Menu dengan Dotted Leader */}
                        <ul className="list-none p-0 space-y-1">
                          {group.items.map((item) => (
                            <li
                              key={item.id}
                              onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                              onMouseMove={handleItemMouseMove}
                              onClick={() => handleItemClick(item)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleItemClick(item);
                                }
                              }}
                              aria-label={`Lihat detail ${item.nama}`}
                              className="group relative flex items-baseline justify-between py-1.5 px-2 -mx-2 rounded-[0.2rem] transition-colors hover:bg-coffee/10 cursor-pointer select-none"
                            >
                              <span className="font-medium text-[15px] sm:text-[16px] text-coffee group-hover:text-earth-dark transition-colors shrink-0">
                                {item.nama.toLowerCase()}
                                {item.rekomendasi && (
                                  <span className="ml-1 text-xs text-earth font-bold" title="Andalan Kafe">
                                    ★
                                  </span>
                                )}
                              </span>

                              {/* Garis titik-titik pemisah (dotted leader line) */}
                              <span
                                className="mx-2 flex-1 border-b border-dotted border-coffee/40 relative -top-1"
                                aria-hidden="true"
                              />

                              {/* Harga nominal terformat */}
                              <span className="font-bold text-[15px] sm:text-[16px] text-coffee tabular-nums shrink-0">
                                {formatBoardPrice(item.harga)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Tombol Lihat Semua Menu / Tampilkan Lebih Sedikit */}
                  {hasLongList && (
                    <div className="mt-8 flex justify-center border-t border-coffee/10 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="btn btn-earth inline-flex cursor-pointer items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
                      >
                        <span>
                          {isExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Semua Menu"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Search / Filter Empty State */
                <div className="rounded-[0.25rem] bg-latte-light p-8 py-16 text-center">
                  <Filter className="mx-auto mb-3 h-10 w-10 text-coffee/70" />
                  <h3 className="font-display mb-2 text-4xl">Menu Tidak Ditemukan</h3>
                  <p className="mx-auto mb-6 max-w-md text-[17px] text-coffee/80">
                    Tidak ada menu yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                    Silakan coba kata kunci lain atau reset filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("semua");
                    }}
                    className="btn btn-coffee"
                  >
                    Tampilkan Semua Menu
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Card Detail Melayang: Mengikuti kursor di desktop tanpa delay, tanpa backdrop gelap */}
      <FloatingMenuCard
        item={hoveredItem}
        x={cursorPos.x}
        y={cursorPos.y}
      />

      {/* Modal Detail Menu Terkunci: Dibuka saat pengguna klik/tap menu (misal di mobile) */}
      <MenuDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        triggerMode="click"
      />
    </>
  );
}

export default MenuSection;
