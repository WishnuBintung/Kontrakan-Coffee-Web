"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ArrowUpRight, Sparkles, SlidersHorizontal, Filter } from "lucide-react";
import { MENU_ITEMS, formatPriceRupiah, CafeMenuItem } from "@/lib/cafeData";
import { MenuDetailModal } from "./MenuDetailModal";
import { SplitWords } from "./EditorialMotion";

const CATEGORIES = [
  { id: "semua", label: "Semua Menu" },
  { id: "kopi", label: "Kopi Atelier" },
  { id: "non-kopi", label: "Non-Kopi" },
  { id: "camilan", label: "Camilan & Pastry" },
  { id: "rekomendasi", label: "Andalan Kafe ★" },
];

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name-asc">("default");
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);

  const filteredItems = useMemo(() => {
    let items = [...MENU_ITEMS];

    // Filter by Category or Recommended
    if (activeCategory === "rekomendasi") {
      items = items.filter((item) => item.rekomendasi);
    } else if (activeCategory !== "semua") {
      items = items.filter((item) => item.kategori === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.nama.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          (item.specs && item.specs.toLowerCase().includes(q)) ||
          (item.rasa && item.rasa.some((r) => r.toLowerCase().includes(q)))
      );
    }

    // Sort items
    if (sortBy === "price-asc") {
      items.sort((a, b) => a.harga - b.harga);
    } else if (sortBy === "price-desc") {
      items.sort((a, b) => b.harga - a.harga);
    } else if (sortBy === "name-asc") {
      items.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    return items;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <>
      <section
        id="menu"
        className="w-full bg-[#EEE6D7] text-[#472F1D] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#C7B8AE]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section (Original Typography) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div
              data-rev
              style={{ "--d": "40ms" } as React.CSSProperties}
            >
              <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#472F1D]">
                <span className="font-black">DIGITAL </span>
                <span className="font-thin italic text-[#5F493C]">MENU</span>
              </h2>
            </div>
            <p className="text-[15px] sm:text-[17px] text-[#5F493C] font-sans max-w-md leading-relaxed">
              <SplitWords
                text="Jelajahi sajian kopi spesialti, minuman non-kopi segar, dan hidangan pastry artisan dalam daftar rapi. Ketuk baris menu untuk melihat detail ukuran dan varian."
                staggerMs={26}
              />
            </p>
          </div>

          {/* Controls: Search, Category Filters, and Sort Options */}
          <div
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="space-y-4 mb-10 sm:mb-12"
          >
            {/* Top row: Search Bar & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F493C]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kopi, espresso, matcha, camilan..."
                  className="w-full pl-10 pr-10 py-3 bg-[#EEE6D7] border border-[#5F493C] text-[#472F1D] placeholder-[#5F493C]/75 font-sans text-[14px] sm:text-[15px] focus:outline-none focus:ring-1 focus:ring-[#472F1D] focus:border-[#472F1D] transition-all sharp-edges"
                  aria-label="Cari menu kafe"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F493C] hover:text-[#472F1D]"
                    aria-label="Bersihkan pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#5F493C] uppercase">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Urutkan:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "default" | "price-asc" | "price-desc" | "name-asc"
                    )
                  }
                  className="bg-[#5F493C] text-[#EEE6D7] font-mono text-[12px] sm:text-[13px] px-3.5 py-3 border border-[#472F1D] focus:outline-none focus:border-[#C7B8AE] cursor-pointer sharp-edges uppercase"
                  aria-label="Urutkan menu berdasarkan"
                >
                  <option value="default">Rekomendasi Atelier</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                  <option value="name-asc">Nama Menu A-Z</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips - Mobile Scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2.5 font-mono text-[12px] sm:text-[13px] uppercase tracking-wider transition-all sharp-edges shrink-0 flex items-center gap-2 border cursor-pointer ${
                      isActive
                        ? "bg-[#5F493C] text-[#EEE6D7] border-[#5F493C] shadow-md"
                        : "bg-transparent text-[#5F493C] border-[#C7B8AE] hover:border-[#5F493C] hover:text-[#472F1D]"
                    }`}
                  >
                    <span className="font-semibold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#C7B8AE] font-mono text-[12px] text-[#5F493C] uppercase">
            <span>
              Menampilkan {filteredItems.length} menu{" "}
              {activeCategory !== "semua" ? `kategori ${activeCategory}` : ""}
            </span>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("semua");
                }}
                className="text-[#472F1D] font-bold underline hover:text-[#5F493C]"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Table Column Headers (Desktop >=700px) */}
          <div className="hidden md:grid grid-cols-[52px_minmax(200px,1.3fr)_minmax(240px,2fr)_auto] gap-5 py-3 border-b-2 border-[#472F1D] font-mono text-[11px] uppercase tracking-widest text-[#5F493C] font-semibold">
            <span>NO.</span>
            <span>NAMA MENU &amp; KATEGORI</span>
            <span>DESKRIPSI &amp; KOMPOSISI</span>
            <span className="text-right">HARGA</span>
          </div>

          {/* Clean Ruled List Without Images (Prompt Layout + Original Typography) */}
          {filteredItems.length > 0 ? (
            <div className="divide-y divide-[#C7B8AE] border-b-2 border-[#472F1D]">
              {filteredItems.map((item, idx) => {
                const indexStr = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={item.id}
                    data-rev
                    style={{ "--d": `${Math.min(idx * 45, 360)}ms` } as React.CSSProperties}
                    onClick={() => setSelectedItem(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedItem(item);
                      }
                    }}
                    aria-label={`Lihat detail menu ${item.nama}`}
                    className="group py-5 sm:py-6 px-3 sm:px-4 -mx-3 sm:-mx-4 hover:bg-[#5F493C] hover:text-[#EEE6D7] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer sharp-edges"
                  >
                    <div className="menu-ruled-row">
                      {/* Col 1: Index Numeral */}
                      <span className="hidden md:inline-block font-mono text-[13px] font-bold text-[#5F493C] group-hover:text-[#C7B8AE] transition-colors duration-400 tracking-widest">
                        {indexStr}
                      </span>

                      {/* Col 2: Menu Name, Badges & Sizes */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="md:hidden font-mono text-[12px] font-bold text-[#5F493C] group-hover:text-[#C7B8AE] mr-1">
                            {indexStr}.
                          </span>
                          <h3 className="font-sans font-black text-xl sm:text-2xl text-[#472F1D] uppercase tracking-[-0.02em] leading-snug group-hover:text-[#EEE6D7] group-hover:translate-x-1 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                            {item.nama}
                          </h3>
                          {item.rekomendasi && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C7B8AE] text-[#472F1D] font-mono text-[10px] font-bold uppercase tracking-widest sharp-edges">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>REKOMENDASI</span>
                            </span>
                          )}
                          {item.badge && !item.rekomendasi && (
                            <span className="px-2 py-0.5 border border-[#5F493C]/40 text-[#5F493C] group-hover:text-[#EEE6D7]/80 group-hover:border-[#EEE6D7]/30 font-mono text-[10px] uppercase tracking-wider sharp-edges">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-[#5F493C] group-hover:text-[#EEE6D7]/75">
                          <span className="text-[#472F1D] group-hover:text-[#C7B8AE] font-semibold">
                            {item.kategori}
                          </span>
                          {item.ukuran && item.ukuran.length > 0 && (
                            <span>• {item.ukuran.join(" / ")}</span>
                          )}
                        </div>
                      </div>

                      {/* Mobile Price Col (<700px) */}
                      <div className="md:hidden text-right self-start">
                        <span className="font-mono text-[16px] font-bold text-[#472F1D] group-hover:text-[#C7B8AE] whitespace-nowrap block">
                          {formatPriceRupiah(item.harga)}
                        </span>
                        <span className="font-mono text-[10px] text-[#5F493C] group-hover:text-[#EEE6D7]/70 uppercase inline-flex items-center gap-0.5">
                          <span>DETAIL</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>

                      {/* Col 3: Description & Specs */}
                      <div className="col-span-2 md:col-span-1 space-y-1 pt-1 md:pt-0">
                        <p className="font-sans italic text-[14px] sm:text-[15px] text-[#472F1D]/85 group-hover:text-[#EEE6D7]/90 leading-relaxed">
                          {item.deskripsi}
                        </p>
                        {item.specs && (
                          <p className="font-mono text-[11px] text-[#5F493C] group-hover:text-[#C7B8AE] uppercase tracking-wider pt-0.5">
                            {item.specs}
                          </p>
                        )}
                      </div>

                      {/* Col 4: Desktop Right-Aligned Price */}
                      <div className="hidden md:flex items-center justify-end gap-4 text-right whitespace-nowrap">
                        <div>
                          <span className="font-mono text-[18px] sm:text-[20px] font-bold text-[#472F1D] group-hover:text-[#C7B8AE] transition-colors block">
                            {formatPriceRupiah(item.harga)}
                          </span>
                          <span className="font-mono text-[10px] text-[#5F493C] group-hover:text-[#EEE6D7]/70 uppercase tracking-wider">
                            TAP UNTUK DETAIL
                          </span>
                        </div>
                        <div className="w-9 h-9 bg-[#C7B8AE] text-[#472F1D] flex items-center justify-center shrink-0 sharp-edges transition-transform duration-300 group-hover:scale-105">
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-[#5F493C]/10 border border-[#C7B8AE] p-8 sharp-edges">
              <Filter className="w-10 h-10 text-[#5F493C] mx-auto mb-3" />
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-[#472F1D] mb-2">
                Menu Tidak Ditemukan
              </h3>
              <p className="font-sans text-[15px] text-[#5F493C] max-w-md mx-auto mb-6">
                Tidak ada menu yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;. Silakan coba kata kunci lain atau reset filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("semua");
                }}
                className="px-6 py-3 bg-[#5F493C] text-[#EEE6D7] font-mono text-[13px] uppercase tracking-wider hover:bg-[#472F1D] transition-colors sharp-edges cursor-pointer"
              >
                Tampilkan Semua Menu
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <MenuDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}

export default MenuSection;
