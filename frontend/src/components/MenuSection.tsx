"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  X,
  Sparkles,
  Filter,
  AlertCircle,
  Loader2,
  RefreshCw,
  Coffee,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
} from "lucide-react";
import { CafeMenuItem } from "@/lib/cafeData";
import { useMenuData } from "@/hooks/useCafeData";
import { FloatingMenuCard } from "./FloatingMenuCard";
import { MenuDetailModal } from "./MenuDetailModal";
import { SplitWords } from "./EditorialMotion";

/** Fired by category picker or external cards to pre-select a filter. */
export const CATEGORY_EVENT = "kc:select-category";

const CATEGORIES = [
  { id: "semua", label: "Semua Kategori" },
  { id: "kopi", label: "Kopi Atelier" },
  { id: "non-kopi", label: "Non-Kopi" },
  { id: "camilan", label: "Camilan & Pastry" },
  { id: "rekomendasi", label: "Andalan Kafe" },
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

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
    "default"
  );

  // Tutup dropdown kategori saat klik di luar atau tekan tombol Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
      }
    }

    if (isCategoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCategoryOpen]);

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

  // Label kategori aktif saat ini
  const currentCategoryLabel = useMemo(() => {
    const found = CATEGORIES.find((c) => c.id === activeCategory);
    return found ? found.label : "Semua Kategori";
  }, [activeCategory]);

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

    // Batas aman horizontal layar
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
                <div data-ui="status-badge" className="inline-flex items-center gap-2 rounded-full bg-earth/15 px-4 py-1.5 text-sm font-semibold text-earth-dark">
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
                <div data-ui="status-badge" className="inline-flex items-center gap-2 rounded-full bg-coffee/10 px-4 py-1.5 text-sm font-semibold text-coffee">
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
              {/* Kontrol Pencarian & Filter Kategori Simbol Dropdown */}
              <div
                data-ui="menu-controls"
                className="mb-10 sm:mb-14"
              >
                <div className="flex items-center gap-2.5 sm:justify-between sm:gap-4">
                  {/* Input pencarian (fleksibel mengecil di mobile agar berdampingan dengan simbol kategori) */}
                  <div className="relative flex-1 sm:max-w-lg">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-coffee/70">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari seduhan kopi, espresso, camilan..."
                      className="h-[46px] w-full rounded-[0.25rem] border border-coffee/40 bg-cream pl-10 pr-10 text-[14px] text-coffee placeholder-coffee/55 transition-colors focus:border-coffee focus:outline-none focus:ring-2 focus:ring-sunshine sm:text-[15px]"
                      aria-label="Cari menu kafe"
                      suppressHydrationWarning
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-coffee/70 hover:text-coffee"
                        aria-label="Bersihkan pencarian"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Tombol Simbol Kategori (Mobile: Tombol Simbol Ikon, Desktop: Bilah Kanan dengan Label) */}
                  <div ref={categoryRef} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      aria-expanded={isCategoryOpen}
                      aria-haspopup="listbox"
                      aria-label="Filter kategori menu"
                      className={`relative flex h-[46px] cursor-pointer items-center justify-center rounded-[0.25rem] border transition-colors focus:outline-none focus:ring-2 focus:ring-sunshine ${
                        activeCategory !== "semua"
                          ? "border-coffee bg-coffee text-sunshine"
                          : "border-coffee/40 bg-cream text-coffee hover:border-coffee"
                      } w-[46px] sm:w-auto sm:justify-between sm:gap-2.5 sm:px-4`}
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 shrink-0" />
                        <span className="hidden text-sm font-medium text-coffee/75 sm:inline">
                          Kategori:
                        </span>
                        <span
                          className={`hidden text-sm font-semibold sm:inline ${
                            activeCategory !== "semua" ? "text-sunshine" : "text-coffee"
                          }`}
                        >
                          {currentCategoryLabel}
                        </span>
                      </div>
                      <ChevronDown
                        className={`hidden h-4 w-4 transition-transform duration-200 sm:inline-block ${
                          isCategoryOpen ? "rotate-180" : ""
                        }`}
                      />
                      {/* Indikator dot aktif di ponsel jika kategori terfilter */}
                      {activeCategory !== "semua" && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-cream-light bg-earth sm:hidden" />
                      )}
                    </button>

                    {/* UI Dropdown Kategori Kustom (Bukan Dropdown Bawaan Browser) */}
                    {isCategoryOpen && (
                      <div data-ui="category-popover" className="animate-in fade-in duration-150 absolute right-0 top-full z-30 mt-2 w-56 rounded-[0.35rem] border border-coffee/20 bg-cream p-1.5 shadow-[0_12px_32px_-8px_rgba(44,28,15,0.22)] sm:w-60" role="listbox" aria-label="Daftar kategori menu">
                        <div data-ui="popover-header" className="mb-1 border-b border-coffee/10 px-3 py-1.5 text-xs font-medium text-coffee/60">
                          Pilih Kategori Menu
                        </div>
                        <div className="space-y-0.5">
                          {CATEGORIES.map((cat) => {
                            const isSelected = activeCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setActiveCategory(cat.id);
                                  setIsCategoryOpen(false);
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-[0.25rem] px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                  isSelected
                                    ? "bg-coffee font-semibold text-sunshine"
                                    : "text-coffee hover:bg-coffee/10"
                                }`}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <span className="flex items-center gap-2">
                                  {cat.id === "rekomendasi" && (
                                    <Star className="h-3.5 w-3.5 fill-current text-current" />
                                  )}
                                  {cat.label}
                                </span>
                                {isSelected && (
                                  <Check className="h-4 w-4 shrink-0 text-sunshine" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pemberitahuan Khusus Mobile */}
              <div data-ui="mobile-hint" className="mb-4 flex items-center gap-2.5 rounded-[0.25rem] border border-earth/35 bg-earth/10 px-4 py-2.5 text-sm font-medium text-earth-dark sm:hidden">
                <Sparkles className="h-4 w-4 shrink-0 text-earth" />
                <span>Tekan menu untuk melihat detail &amp; foto</span>
              </div>

              {/* DAFTAR MENU MURNI (Hanya List Menu, Tanpa Ornamen Poster/Dekorasi) */}
              {filteredItems.length > 0 ? (
                <div
                  data-ui="menu-board"
                  onMouseLeave={handleMenuContainerMouseLeave}
                  className="relative rounded-[0.5rem] border border-coffee/15 bg-cream p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(44,28,15,0.08)]"
                >
                  {/* Kolom Kategori Menu dengan Logika Truncation (5.5 Baris Terpotong Transparan) */}
                  <div
                    className={`relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 transition-[max-height] duration-300 ease-out ${
                      hasLongList && !isExpanded
                        ? "max-h-[252px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]" /* taste-skill-ignore: editorial fade mask for truncation */
                        : "max-h-none"
                    }`}
                  >
                    {categorizedMenu.map((group) => (
                      <div key={group.id} className="space-y-3">
                        {/* Judul Kategori Sesuai CMS */}
                        <h3 data-ui="category-header" className="font-display text-xl sm:text-2xl font-bold tracking-wider text-coffee uppercase border-b border-coffee/15 pb-2">
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
                              <span className="font-medium text-[15px] sm:text-[16px] text-coffee group-hover:text-earth-dark transition-colors shrink-0 flex items-center">
                                {item.nama.toLowerCase()}
                                {item.rekomendasi && (
                                  <Star
                                    className="ml-1.5 inline h-3.5 w-3.5 fill-earth text-earth"
                                    aria-label="Andalan Kafe"
                                  />
                                )}
                              </span>

                              {/* Garis titik-titik pemisah (dotted leader line) */}
                              <span data-ui="dotted-leader" className="mx-2 flex-1 border-b border-dotted border-coffee/40 relative -top-1" aria-hidden="true" />

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
                    <div data-ui="expand-row" className="mt-8 flex justify-center border-t border-coffee/10 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="btn btn-earth inline-flex cursor-pointer items-center gap-2 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide transition-transform active:scale-95"
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
                    Tidak ada menu yang cocok dengan kriteria pencarian atau filter yang dipilih.
                    Silakan coba kata kunci lain atau tampilkan seluruh menu.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("semua");
                    }}
                    className="btn btn-coffee cursor-pointer"
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
