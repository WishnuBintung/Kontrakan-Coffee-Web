"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Sparkles } from "lucide-react";
import { useGalleryData } from "@/hooks/useCafeData";

export function GallerySection() {
  const galleryItems = useGalleryData();

  return (
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

        {/* Gallery grid: Borderless clean image cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((photo, idx) => (
            <div
              key={photo.id}
              data-rev
              style={{ "--d": `${idx * 60}ms` } as React.CSSProperties}
              className="group relative aspect-[16/11] w-full overflow-hidden rounded-[0.25rem] bg-coffee/10 sm:aspect-[4/3]"
            >
              <img
                src={photo.gambar || "/images/bg-hero.jpg"}
                alt={photo.judul}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
