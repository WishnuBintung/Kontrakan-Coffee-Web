"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowDown, Eye, Layers } from "lucide-react";
import { CircularGallery, CircularGalleryRef } from "./CircularGallery";
import { MenuDetailModal } from "./MenuDetailModal";
import { PhotoFrameTemplate } from "./PhotoFrameTemplate";
import { getRecommendedItems, formatPriceRupiah, CafeMenuItem } from "@/lib/cafeData";

export function RecommendedSection() {
  const recommendedItems = getRecommendedItems();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);
  const galleryRef = useRef<CircularGalleryRef>(null);

  const activeItem = recommendedItems[activeIndex] || recommendedItems[0];

  const galleryItems = recommendedItems.map((item, idx) => ({
    image: item.foto || "",
    text: item.nama,
    category: item.kategori,
    slotIndex: idx + 1,
    raw: item,
  }));

  const handleNext = () => {
    galleryRef.current?.next();
  };

  const handlePrev = () => {
    galleryRef.current?.prev();
  };

  const handleItemClick = (galleryItem: any) => {
    if (galleryItem?.raw) {
      setSelectedItem(galleryItem.raw);
    } else {
      setSelectedItem(activeItem);
    }
  };

  return (
    <>
      <section
        id="rekomendasi"
        className="w-full bg-[#E8E3D9] text-[#1C1A18] py-16 sm:py-24 px-4 sm:px-6 relative sharp-edges overflow-hidden border-b border-[#D6CFC2]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[12px] sm:text-[14px] text-[#666158] uppercase tracking-widest font-semibold">
                  [01 // SIGNATURE SELECTIONS]
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] bg-[#D99C5B] text-[#1C1A18] font-bold uppercase tracking-wider sharp-edges">
                  <Sparkles className="w-3 h-3" />
                  <span>CURATED</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] bg-[#5B6653] text-[#E8E3D9] uppercase tracking-wider sharp-edges">
                  <Layers className="w-3 h-3" />
                  <span>CMS READY FRAMES</span>
                </span>
              </div>
              <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#1C1A18]">
                <span className="font-black">RECOMMENDED </span>
                <span className="font-thin italic">MENU</span>
              </h2>
            </div>

            <p className="text-[15px] sm:text-[17px] text-[#666158] font-sans max-w-md leading-relaxed">
              Kompilasi kreasi kopi & sajian atelier yang paling digemari. Format frame foto modular siap menerima integrasi aset foto berkas dari Decap CMS.
            </p>
          </div>

          {/* 
            Circular Gallery Container:
            - Mobile-optimized height (400px - 460px on mobile, 520px - 600px on desktop)
            - Rounded architectural frame with subtle border
          */}
          <div className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[580px] bg-[#5B6653]/10 border border-[#D6CFC2] overflow-hidden sharp-edges select-none">
            {/* Ambient gold glow highlight inside the frame */}
            <div className="absolute inset-0 bg-radial from-[#D99C5B]/10 via-transparent to-transparent pointer-events-none" />

            {/* Circular Gallery WebGL Component with In-Memory Frame Template */}
            <CircularGallery
              ref={galleryRef}
              items={galleryItems}
              bend={2.5}
              textColor="#1C1A18"
              borderRadius={0.04}
              font='bold 24px "Plus Jakarta Sans", sans-serif'
              scrollSpeed={2.4}
              scrollEase={0.06}
              className="w-full h-full"
              onActiveIndexChange={(idx) => setActiveIndex(idx)}
              onItemClick={handleItemClick}
            />

            {/* Mobile swipe hint overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <span className="font-mono text-[10px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18]/70 bg-[#E8E3D9]/90 px-3 py-1 border border-[#D6CFC2] backdrop-blur-sm sharp-edges">
                ← Geser / Swipe untuk jelajah →
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px] text-[#666158] bg-[#E8E3D9]/90 px-2.5 py-1 border border-[#D6CFC2] sharp-edges">
                DRAG OR SCROLL
              </span>
            </div>

            {/* Floating Navigation Controls (Tactile Prev & Next Buttons) */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
              <button
                onClick={handlePrev}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-[#5B6653] text-[#E8E3D9] flex items-center justify-center hover:bg-[#D99C5B] hover:text-[#1C1A18] transition-all sharp-edges border border-[#4D5746] shadow-md active:scale-95"
                aria-label="Menu rekomendasi sebelumnya"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-[#5B6653] text-[#E8E3D9] flex items-center justify-center hover:bg-[#D99C5B] hover:text-[#1C1A18] transition-all sharp-edges border border-[#4D5746] shadow-md active:scale-95"
                aria-label="Menu rekomendasi selanjutnya"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Active Highlighted Item: Split Frame Template & Details */}
          {activeItem && (
            <div className="mt-6 sm:mt-8 bg-[#5B6653] text-[#E8E3D9] p-5 sm:p-7 border border-[#4D5746] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 sharp-edges shadow-xl">
              {/* Photo Frame Template Preview */}
              <div className="w-full md:w-72 lg:w-80 shrink-0">
                <PhotoFrameTemplate
                  src={activeItem.foto}
                  title={activeItem.nama}
                  category={activeItem.kategori}
                  badge={activeItem.badge}
                  slotIndex={activeIndex + 1}
                  className="shadow-md"
                />
              </div>

              {/* Item Metadata & Description */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                      [SLOT // 0{activeIndex + 1}]
                    </span>
                    {activeItem.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-[#D99C5B] text-[#1C1A18] font-bold uppercase tracking-wider sharp-edges">
                        {activeItem.badge}
                      </span>
                    )}
                    <span className="font-mono text-[12px] text-[#E8E3D9]/70">
                      {activeItem.kategori.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-[-0.02em] text-[#E8E3D9]">
                      {activeItem.nama}
                    </h3>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#D99C5B]">
                      {formatPriceRupiah(activeItem.harga)}
                    </span>
                  </div>

                  <p className="font-sans text-[13px] sm:text-[15px] text-[#E8E3D9]/85 line-clamp-2 mt-2 leading-relaxed">
                    {activeItem.deskripsi}
                  </p>

                  {activeItem.specs && (
                    <p className="font-mono text-[11px] sm:text-[12px] text-[#D99C5B] mt-2 tracking-wide">
                      // {activeItem.specs}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#4D5746]">
                  <button
                    onClick={() => setSelectedItem(activeItem)}
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#D99C5B] text-[#1C1A18] font-bold text-[13px] sm:text-[14px] uppercase tracking-tight hover:bg-[#C08343] transition-colors sharp-edges shadow-sm"
                  >
                    <Eye className="w-4 h-4 stroke-[2.5]" />
                    <span>Lihat Detail Menu</span>
                  </button>
                  <a
                    href="#menu"
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#E8E3D9]/40 text-[#E8E3D9] font-mono text-[12px] sm:text-[13px] uppercase tracking-wider hover:bg-[#E8E3D9] hover:text-[#1C1A18] transition-colors sharp-edges"
                  >
                    <span>Daftar Menu</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Detail Modal for Recommended Items */}
      <MenuDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}

export default RecommendedSection;
