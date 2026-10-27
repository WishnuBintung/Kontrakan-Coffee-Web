"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GALLERY_ITEMS, CafeGalleryItem } from "@/lib/cafeData";

const GALLERY_CATEGORIES = [
  { id: "semua", label: "Semua Sudut" },
  { id: "Sudut Favorit", label: "Sudut Favorit (Instagramable)" },
  { id: "Manual Bar", label: "Manual Brew Bar" },
  { id: "Komunal Kerja", label: "Meja Komunal WFC" },
  { id: "Outdoor Garden", label: "Outdoor Garden" },
];

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedPhoto, setSelectedPhoto] = useState<CafeGalleryItem | null>(null);

  const filteredPhotos =
    activeCategory === "semua"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.kategori === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "Escape") setSelectedPhoto(null);
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto, filteredPhotos]);

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  return (
    <>
      <section
        id="galeri"
        className="w-full bg-[#EEE6D7] text-[#472F1D] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#C7B8AE]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div
              data-rev
              style={{ "--d": "40ms" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                  <Sparkles className="w-3 h-3" />
                  <span>SUDUT FAVORIT</span>
                </span>
              </div>
              <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#472F1D]">
                <span className="font-black">OUR </span>
                <span className="font-thin italic text-[#5F493C]">GALLERY</span>
              </h2>
            </div>

            <p
              data-rev
              style={{ "--d": "90ms" } as React.CSSProperties}
              className="text-[15px] sm:text-[17px] text-[#5F493C] font-sans max-w-md leading-relaxed"
            >
              Jelajahi suasana ruang, meja komunal kerja, bar seduhan manual, dan taman terbuka Kontrakan Coffee sebelum Anda berkunjung langsung.
            </p>
          </div>

          {/* Filter Chips - Mobile Scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 sm:mb-10 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2.5 font-mono text-[12px] sm:text-[13px] uppercase tracking-wider transition-all sharp-edges shrink-0 border cursor-pointer ${
                    isActive
                      ? "bg-[#5F493C] text-[#EEE6D7] border-[#5F493C] shadow-md"
                      : "bg-transparent text-[#5F493C] border-[#C7B8AE] hover:border-[#5F493C] hover:text-[#472F1D]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Gallery Architectural Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                data-rev
                style={{ "--d": `${idx * 60}ms` } as React.CSSProperties}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-[#5F493C] border border-[#472F1D] overflow-hidden cursor-pointer sharp-edges flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-[#C7B8AE]"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPhoto(photo);
                  }
                }}
                aria-label={`Lihat foto ${photo.judul} layar penuh`}
              >
                {/* Photo container */}
                <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#472F1D]">
                  <img
                    src={photo.gambar}
                    alt={photo.judul}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />

                  {/* Tag Overlay */}
                  <div className="absolute top-3 left-3 bg-[#472F1D]/85 backdrop-blur-sm text-[#C7B8AE] font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sharp-edges border border-[#C7B8AE]/40 uppercase tracking-widest">
                    {photo.tag}
                  </div>

                  {photo.sudut_favorit && (
                    <div className="absolute top-3 right-3 bg-[#C7B8AE] text-[#472F1D] font-mono text-[10px] font-bold px-2 py-0.5 sharp-edges shadow-md uppercase tracking-wider">
                      SPOT FAVORIT
                    </div>
                  )}

                  {/* Expand Icon Button */}
                  <div className="absolute bottom-3 right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#472F1D]/85 backdrop-blur-md text-[#EEE6D7] flex items-center justify-center border border-[#EEE6D7]/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#C7B8AE] group-hover:text-[#472F1D]">
                    <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-5 sm:p-6 bg-[#5F493C] flex-1 flex flex-col justify-between border-t border-[#472F1D]">
                  <div>
                    <span className="font-mono text-[11px] text-[#C7B8AE] uppercase tracking-widest block mb-1 font-semibold">
                      {photo.kategori.toUpperCase()}
                    </span>
                    <h3 className="font-sans font-black text-xl sm:text-2xl text-[#EEE6D7] uppercase tracking-[-0.02em] group-hover:text-[#C7B8AE] transition-colors duration-300">
                      {photo.judul}
                    </h3>
                    <p className="font-sans text-[13px] sm:text-[14px] text-[#EEE6D7]/80 mt-2 line-clamp-2 leading-relaxed">
                      {photo.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-[#472F1D]/90 backdrop-blur-md"
            />

            {/* Lightbox Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-[#EEE6D7] text-[#472F1D] border border-[#C7B8AE] shadow-2xl z-10 flex flex-col sharp-edges"
            >
              {/* Lightbox Top Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 bg-[#5F493C] text-[#EEE6D7] border-b border-[#472F1D] sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#C7B8AE] font-semibold">
                    {selectedPhoto.tag}
                  </span>
                  {selectedPhoto.sudut_favorit && (
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                      SPOT FAVORIT
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors focus:outline-none"
                  aria-label="Tutup foto layar penuh"
                >
                  <X className="w-6 h-6 stroke-[2]" />
                </button>
              </div>

              {/* Image with Left/Right Navigation and Smooth Crossfade */}
              <div className="relative w-full bg-[#472F1D] flex items-center justify-center min-h-[300px] sm:min-h-[460px] md:min-h-[520px] max-h-[70vh] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedPhoto.id}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    src={selectedPhoto.gambar}
                    alt={selectedPhoto.judul}
                    className="w-full h-full max-h-[70vh] object-contain"
                  />
                </AnimatePresence>

                {/* Left arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#472F1D]/85 text-[#EEE6D7] hover:bg-[#C7B8AE] hover:text-[#472F1D] flex items-center justify-center sharp-edges border border-[#EEE6D7]/20 transition-colors shadow-lg"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPhoto();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#472F1D]/85 text-[#EEE6D7] hover:bg-[#C7B8AE] hover:text-[#472F1D] flex items-center justify-center sharp-edges border border-[#EEE6D7]/20 transition-colors shadow-lg"
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Caption & Info */}
              <div className="p-5 sm:p-8 bg-[#EEE6D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#C7B8AE]">
                <div>
                  <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-[-0.02em] text-[#472F1D]">
                    {selectedPhoto.judul}
                  </h3>
                  <p className="font-sans text-[14px] sm:text-[16px] text-[#472F1D]/85 mt-1 max-w-2xl leading-relaxed">
                    {selectedPhoto.deskripsi}
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href="#lokasi"
                    onClick={() => setSelectedPhoto(null)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C7B8AE] text-[#472F1D] font-bold text-[14px] uppercase tracking-tight hover:bg-[#472F1D] hover:text-[#EEE6D7] transition-colors sharp-edges shadow-md"
                  >
                    <span>Kunjungi Sudut Ini</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GallerySection;
