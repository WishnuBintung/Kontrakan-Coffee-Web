"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Sparkles, SlidersHorizontal, Filter } from "lucide-react";
import { formatPriceRupiah, CafeMenuItem } from "@/lib/cafeData";
import { useMenuData } from "@/hooks/useCafeData";
import { MenuDetailModal } from "./MenuDetailModal";
import { PhotoFrameTemplate } from "./PhotoFrameTemplate";
import { SplitWords } from "./EditorialMotion";

/** Fired by the category picker to pre-select a menu filter. */
export const CATEGORY_EVENT = "kc:select-category";

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc";

const CATEGORIES = [
  { id: "semua", label: "Semua Menu" },
  { id: "kopi", label: "Kopi" },
  { id: "non-kopi", label: "Non-Kopi" },
  { id: "camilan", label: "Camilan & Pastry" },
  { id: "rekomendasi", label: "Andalan Kafe ★" },
];

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);

  const { items: filteredItems } = useMenuData(activeCategory, searchQuery, sortBy);

  // Category picker (hero cards) → pre-select a filter
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

  return (
    <>
      <section
        id="menu"
        className="relative w-full bg-cream-light px-4 py-20 text-coffee sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-[90rem]">
          {/* Header */}
          <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
            <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)]">
                Menu Digital, Siap Dipilih.
              </h2>
            </div>
            <p className="max-w-md text-lg text-coffee/80">
              <SplitWords
                text="Jelajahi kopi spesialti, minuman non-kopi segar, dan pastry artisan. Ketuk kartu menu untuk melihat detail ukuran dan varian."
                staggerMs={22}
              />
            </p>
          </div>

          {/* Controls: Search, Category Filters, and Sort Options */}
          <div
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              {/* Search input */}
              <div className="relative max-w-lg flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-coffee/70">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kopi, espresso, matcha, camilan..."
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

              {/* Sort Selector */}
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

            {/* Category Filter Chips - Mobile Scrollable */}
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

          {/* Results Summary Bar */}
          <div className="mb-6 flex items-center justify-between border-b border-coffee/15 pb-3 text-sm uppercase text-coffee/70">
            <span>
              Menampilkan {filteredItems.length} menu{" "}
              {activeCategory !== "semua" ? `· ${activeCategory}` : ""}
            </span>
            {(searchQuery || activeCategory !== "semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("semua");
                }}
                className="font-bold text-coffee underline underline-offset-4 hover:text-earth-dark"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Menu Cards */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, idx) => (
                <article
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
                  className="group flex cursor-pointer flex-col rounded-[0.25rem] border border-coffee/15 bg-cream p-3 transition-colors duration-300 hover:border-coffee hover:bg-sunshine"
                >
                  {/* Photo + badges */}
                  <div className="relative">
                    <PhotoFrameTemplate
                      src={item.foto}
                      title={item.nama}
                      category={item.kategori}
                      aspectRatio="aspect-[4/3]"
                    />
                    <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                      {item.rekomendasi && (
                        <span className="tag">
                          <Sparkles className="h-3.5 w-3.5" />
                          Andalan
                        </span>
                      )}
                      {item.badge && !item.rekomendasi && (
                        <span className="tag">{item.badge}</span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                    <p className="text-sm font-medium uppercase tracking-wide text-coffee/70">
                      {item.kategori}
                      {item.ukuran && item.ukuran.length > 0 && (
                        <span> · {item.ukuran.join(" / ")}</span>
                      )}
                    </p>
                    <h3 className="font-display mt-1 text-[clamp(1.7rem,2.2vw,2.1rem)]">
                      {item.nama}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[16px] text-coffee/85">
                      {item.deskripsi}
                    </p>
                    {item.specs && (
                      <p className="mt-3 rounded-[0.15rem] bg-coffee/10 px-3 py-1.5 text-[14px]">
                        {item.specs}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <div className="rule-dashed text-coffee" aria-hidden="true" />
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-[1.35rem] font-bold">
                          {formatPriceRupiah(item.harga)}
                        </span>
                        <span className="btn btn-earth btn-sm group-hover:bg-coffee group-hover:text-sunshine">
                          Detail
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
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
        </div>
      </section>

      {/* Detail Modal */}
      <MenuDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}

export default MenuSection;
