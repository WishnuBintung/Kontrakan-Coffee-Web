"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CafeGalleryItem } from "@/lib/cafeData";
import { useGalleryData } from "@/hooks/useCafeData";

export function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<CafeGalleryItem | null>(null);
  const galleryItems = useGalleryData();

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
  }, [selectedPhoto, galleryItems]);

  const handleNextPhoto = () => {
    if (!selectedPhoto || galleryItems.length === 0) return;
    const currentIndex = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedPhoto(galleryItems[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto || galleryItems.length === 0) return;
    const currentIndex = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedPhoto(galleryItems[prevIndex]);
  };

  return (
    <>
      <section
        id="galeri"
        className="relative w-full bg-cream px-4 py-20 text-coffee sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-[90rem]">
          {/* Section Header */}
          <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
            <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
              <span className="tag mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Sudut Favorit
              </span>
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)]">
                Intip Suasananya.
              </h2>
            </div>

            <p
              data-rev
              style={{ "--d": "90ms" } as React.CSSProperties}
              className="max-w-md text-lg text-coffee/80"
            >
              Jelajahi suasana ruang, meja komunal kerja, bar seduhan manual, dan
              taman terbuka Kontrakan Coffee sebelum Anda berkunjung langsung.
            </p>
          </div>

          {/* Gallery grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((photo, idx) => (
              <div
                key={photo.id}
                data-rev
                style={{ "--d": `${idx * 60}ms` } as React.CSSProperties}
                onClick={() => setSelectedPhoto(photo)}
                className={`group flex cursor-pointer flex-col rounded-[0.25rem] p-3 transition-colors duration-300 hover:bg-sunshine sm:p-4 ${
                  idx % 3 === 1 ? "bg-sunshine" : "bg-latte-light"
                }`}
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
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[0.2rem] bg-coffee/10 sm:aspect-[4/3]">
                  <img
                    src={photo.gambar}
                    alt={photo.judul}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />

                  {photo.sudut_favorit && (
                    <span className="tag absolute left-3 top-3">
                      <Sparkles className="h-3.5 w-3.5" />
                      Spot Favorit
                    </span>
                  )}

                  {/* Expand icon */}
                  <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-[0.2rem] bg-earth text-coffee transition-colors duration-300 group-hover:bg-coffee group-hover:text-sunshine">
                    <Maximize2 className="h-4 w-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* Caption */}
                <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                  <h3 className="font-display text-[clamp(1.8rem,2.4vw,2.2rem)]">
                    {photo.judul}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[16px] text-coffee/85">
                    {photo.deskripsi}
                  </p>
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
              className="fixed inset-0 bg-coffee-darker/90 backdrop-blur-md"
            />

            {/* Lightbox Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex max-h-[95vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[0.5rem] bg-cream text-coffee shadow-2xl"
            >
              {/* Lightbox Top Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between bg-coffee-dark p-4 text-cream sm:p-6">
                <div className="flex items-center gap-3">
                  {selectedPhoto.sudut_favorit && (
                    <span className="tag">Spot Favorit</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="rounded-[0.2rem] p-1.5 text-cream transition-colors hover:text-sunshine"
                  aria-label="Tutup foto layar penuh"
                >
                  <X className="h-6 w-6 stroke-[2]" />
                </button>
              </div>

              {/* Image with Left/Right Navigation and Smooth Crossfade */}
              <div className="relative flex max-h-[70vh] min-h-[300px] w-full items-center justify-center overflow-hidden bg-coffee sm:min-h-[460px] md:min-h-[520px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedPhoto.id}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    src={selectedPhoto.gambar}
                    alt={selectedPhoto.judul}
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                </AnimatePresence>

                {/* Left arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
                  }}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[0.2rem] bg-sunshine text-coffee shadow-lg transition-colors hover:bg-earth"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Right arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPhoto();
                  }}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[0.2rem] bg-sunshine text-coffee shadow-lg transition-colors hover:bg-earth"
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Lightbox Caption & Info */}
              <div className="flex flex-col justify-between gap-4 bg-cream p-5 sm:flex-row sm:items-center sm:p-8">
                <div>
                  <h3 className="font-display text-4xl sm:text-5xl">
                    {selectedPhoto.judul}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-coffee/85 sm:text-[17px]">
                    {selectedPhoto.deskripsi}
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href="#lokasi"
                    onClick={() => setSelectedPhoto(null)}
                    className="btn btn-coffee"
                  >
                    Kunjungi Sudut Ini
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
