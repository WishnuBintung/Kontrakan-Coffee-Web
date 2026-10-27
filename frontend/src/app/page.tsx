"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { StatsMarquee } from "@/components/StatsMarquee";
import { PromoSection } from "@/components/PromoSection";
import { MenuSection } from "@/components/MenuSection";
import { WhySection } from "@/components/WhySection";
import { GallerySection } from "@/components/GallerySection";
import { LocationSection } from "@/components/LocationSection";
import { ContactFooter } from "@/components/ContactFooter";
import { useEditorialChoreography } from "@/components/EditorialMotion";

export default function Home() {
  // Single rAF-throttled scroll handler for pinned stages (--p)
  // + Single IntersectionObserver (threshold 0.12) for per-word spans and [data-rev] elements
  useEditorialChoreography();

  return (
    <main className="relative min-h-screen bg-cream text-coffee selection:bg-sunshine selection:text-coffee">
      {/* Announcement banner + fixed header */}
      <Navbar />

      {/* 1. HERO — full-bleed photo with oversized sunshine headline */}
      <HeroSection />

      {/* 2. MENU CATEGORY PICKER ("Where does your journey begin?") */}
      <CategorySection />

      {/* 3. TILTED STICKER RIBBON (facilities) */}
      <StatsMarquee />

      {/* 4. PROMO & KEGIATAN SPESIAL */}
      <PromoSection />

      {/* 5. LIST MENU & FILTER */}
      <MenuSection />

      {/* 6. WHY KONTRAKAN — sticky stacked facility cards */}
      <WhySection />

      {/* 7. GALLERY */}
      <GallerySection />

      {/* 8. ALAMAT & JADWAL OPERASIONAL KAFE */}
      <LocationSection />

      {/* 9. FOOTER */}
      <ContactFooter />
    </main>
  );
}
