"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PromoSection } from "@/components/PromoSection";
import { MenuSection } from "@/components/MenuSection";
import { GallerySection } from "@/components/GallerySection";
import { LocationSection } from "@/components/LocationSection";
import { ContactFooter } from "@/components/ContactFooter";
import { useEditorialChoreography } from "@/components/EditorialMotion";

export default function Home() {
  // Single rAF-throttled scroll handler for pinned stages (--p)
  // + Single IntersectionObserver (threshold 0.12) for per-word spans and [data-rev] elements
  useEditorialChoreography();

  return (
    <main className="relative min-h-screen bg-[#EEE6D7] text-[#472F1D] selection:bg-[#C7B8AE] selection:text-[#472F1D]">
      {/* Sticky/Fixed Navbar */}
      <Navbar />

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. PROMO & KEGIATAN SPESIAL */}
      <PromoSection />

      {/* 3. LIST MENU & FILTER */}
      <MenuSection />

      {/* 4. OUR GALLERY */}
      <GallerySection />

      {/* 5. ALAMAT & JADWAL OPERASIONAL KAFE */}
      <LocationSection />

      {/* 6. DIV 'KONTRAKAN COFFEE' + 3-COLUMN FOOTER */}
      <ContactFooter />
    </main>
  );
}
