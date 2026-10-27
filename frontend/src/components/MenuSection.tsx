"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from "react";
import { Search, X, ArrowUpRight, Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import { MENU_ITEMS, formatPriceRupiah, CafeMenuItem } from "@/lib/cafeData";
import { MenuDetailModal } from "./MenuDetailModal";
import { PhotoFrameTemplate } from "./PhotoFrameTemplate";

const CATEGORIES = [
  { id: "semua", label: "Semua Menu", code: "00" },
  { id: "kopi", label: "Kopi Atelier", code: "01" },
  { id: "non-kopi", label: "Non-Kopi", code: "02" },
  { id: "camilan", label: "Camilan & Pastry", code: "03" },
];

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name-asc">("default");
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);

  const filteredItems = useMemo(() => {
    let items = [...MENU_ITEMS];

    // Filter by Category
    if (activeCategory !== "semua") {
      items = items.filter((item) => item.kategori === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.nama.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          (item.specs && item.specs.toLowerCase().includes(q))
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
        className="w-full bg-[#E8E3D9] text-[#1C1A18] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#D6CFC2]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="font-mono text-[13px] sm:text-[14px] text-[#666158] uppercase tracking-widest block mb-3 font-semibold">
                [02 // DIGITAL CATALOGUE]
              </span>
              <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#1C1A18]">
                <span className="font-black">DIGITAL </span>
                <span className="font-thin italic">MENU</span>
              </h2>
            </div>
            <p className="text-[15px] sm:text-[17px] text-[#666158] font-sans max-w-md leading-relaxed">
              Jelajahi sajian kopi spesialti, minuman non-kopi segar, dan hidangan pastry artisan. Setiap menu disajikan dengan bahan terbaik.
            </p>
          </div>

          {/* Controls: Search, Category Filters, and Sort Options */}
          <div className="space-y-4 mb-10 sm:mb-12">
            {/* Top row: Search Bar & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search input with tactile sharp styling */}
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666158]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kopi, espresso, matcha, camilan..."
                  className="w-full pl-10 pr-10 py-3 bg-[#E8E3D9] border border-[#5B6653] text-[#1C1A18] placeholder-[#666158] font-sans text-[14px] sm:text-[15px] focus:outline-none focus:ring-1 focus:ring-[#D99C5B] focus:border-[#D99C5B] transition-all sharp-edges"
                  aria-label="Cari menu kafe"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666158] hover:text-[#1C1A18]"
                    aria-label="Bersihkan pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#666158] uppercase">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Urutkan:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#5B6653] text-[#E8E3D9] font-mono text-[12px] sm:text-[13px] px-3.5 py-3 border border-[#4D5746] focus:outline-none focus:border-[#D99C5B] cursor-pointer sharp-edges uppercase"
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
                    className={`whitespace-nowrap px-4 py-2.5 font-mono text-[12px] sm:text-[13px] uppercase tracking-wider transition-all sharp-edges shrink-0 flex items-center gap-2 border ${
                      isActive
                        ? "bg-[#5B6653] text-[#E8E3D9] border-[#5B6653] shadow-md"
                        : "bg-transparent text-[#666158] border-[#D6CFC2] hover:border-[#5B6653] hover:text-[#1C1A18]"
                    }`}
                  >
                    <span className="text-[11px] opacity-70">[{cat.code}]</span>
                    <span className="font-semibold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D6CFC2] font-mono text-[12px] text-[#666158] uppercase">
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
                className="text-[#D99C5B] underline hover:text-[#C08343]"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Menu Items Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-[#5B6653] border border-[#4D5746] overflow-hidden cursor-pointer sharp-edges flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-[#D99C5B]/70"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedItem(item);
                    }
                  }}
                  aria-label={`Lihat detail menu ${item.nama}`}
                >
                  {/* Image container with PhotoFrameTemplate */}
                  <div className="relative aspect-[16/10] overflow-hidden w-full bg-[#4D5746]">
                    <PhotoFrameTemplate
                      src={item.foto}
                      title={item.nama}
                      category={item.kategori}
                      slotIndex={idx + 1}
                      aspectRatio="aspect-[16/10]"
                    />

                    {/* Badge Rekomendasi */}
                    {item.rekomendasi && (
                      <div className="absolute top-3 left-3 bg-[#D99C5B] text-[#1C1A18] font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 sharp-edges shadow-md flex items-center gap-1 z-20">
                        <Sparkles className="w-3 h-3" />
                        <span>REKOMENDASI</span>
                      </div>
                    )}

                    {/* Price Tag Floating Overlay */}
                    <div className="absolute bottom-3 right-3 bg-[#1C1A18]/85 backdrop-blur-md text-[#D99C5B] font-mono text-[15px] sm:text-[16px] font-bold px-3 py-1 sharp-edges border border-[#D99C5B]/30 z-20">
                      {formatPriceRupiah(item.harga)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 bg-[#5B6653] flex-1 flex flex-col justify-between border-t border-[#4D5746]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] text-[#D99C5B] uppercase tracking-widest font-semibold">
                          [0{idx + 1} // {item.kategori.toUpperCase()}]
                        </span>
                        {item.badge && (
                          <span className="font-mono text-[10px] text-[#E8E3D9]/70 uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-sans font-black text-xl sm:text-2xl text-[#E8E3D9] uppercase tracking-[-0.02em] leading-snug group-hover:text-[#D99C5B] transition-colors duration-300">
                        {item.nama}
                      </h3>

                      <p className="font-sans text-[13px] sm:text-[14px] text-[#E8E3D9]/80 mt-2 line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>

                    {/* Card Action Footer */}
                    <div className="pt-4 mt-4 border-t border-[#4D5746] flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#E8E3D9]/60 uppercase">
                        TAP UNTUK DETAIL
                      </span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#D99C5B] text-[#1C1A18] flex items-center justify-center shrink-0 shadow-md transition-all duration-300 group-hover:bg-[#C08343] group-hover:scale-105">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-[#5B6653]/10 border border-[#D6CFC2] p-8 sharp-edges">
              <Filter className="w-10 h-10 text-[#666158] mx-auto mb-3" />
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-[#1C1A18] mb-2">
                Menu Tidak Ditemukan
              </h3>
              <p className="font-sans text-[15px] text-[#666158] max-w-md mx-auto mb-6">
                Tidak ada menu yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;. Silakan coba kata kunci lain atau reset filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("semua");
                }}
                className="px-6 py-3 bg-[#5B6653] text-[#E8E3D9] font-mono text-[13px] uppercase tracking-wider hover:bg-[#D99C5B] hover:text-[#1C1A18] transition-colors sharp-edges"
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

