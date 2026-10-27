"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { MenuSection } from "@/components/MenuSection";
import { HoursSection } from "@/components/HoursSection";
import { GallerySection } from "@/components/GallerySection";
import { LocationSection } from "@/components/LocationSection";
import { ContactFooter } from "@/components/ContactFooter";
import { useEditorialChoreography } from "@/components/EditorialMotion";

export default function Home() {
  // Single rAF-throttled scroll handler for pinned stages (--p)
  // + Single IntersectionObserver (threshold 0.12) for per-word spans and [data-rev] elements
  useEditorialChoreography();

  return (
    <main className="relative min-h-screen bg-[#E8E3D9] text-[#1C1A18] selection:bg-[#D99C5B] selection:text-[#1C1A18]">
      {/* Sticky/Fixed Navbar */}
      <Navbar />

      {/* 1. HERO SECTION (Multiply-Blended Photographic Pin, Poster Didone Wordmark, Script Overline, 3 Base Straps) */}
      <HeroSection />

      {/* 2. DESKRIPSI / KALIMAT PEMBUKA (Bottom-Up Coffee Image Reveal with Difference Headline that Fades on Scroll + 3-Column Statement Band) */}
      <ManifestoSection />

      {/* 3. LIST MENU & FILTER (Ruled Editorial Price Table Without Images + Category Filter, Search, Sort & Detail Modal) */}
      <MenuSection />

      {/* 4. JAM BUKA (Live WIB Status Beacon & 7-Day Schedule) */}
      <HoursSection />

      {/* 5. OUR GALLERY (Space & Atmosphere Filterable Grid + Fullscreen Lightbox) */}
      <GallerySection />

      {/* 6. ALAMAT LOKASI KAFE (Address, Copy Button, Contacts, Facilities & Google Maps Live Embed) */}
      <LocationSection />

      {/* 7. DIV 'KONTRAKAN COFFEE' (Updated from Visit Kontrakan) + 3-COLUMN FOOTER */}
      <ContactFooter />
    </main>
  );
}
