"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { RecommendedSection } from "@/components/RecommendedSection";
import { MenuSection } from "@/components/MenuSection";
import { HoursSection } from "@/components/HoursSection";
import { GallerySection } from "@/components/GallerySection";
import { LocationSection } from "@/components/LocationSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { ContactFooter } from "@/components/ContactFooter";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#E8E3D9] text-[#1C1A18] overflow-x-hidden selection:bg-[#D99C5B] selection:text-[#1C1A18]">
      {/* 
        Sticky/Fixed Navbar with dark olive green support and amber gold interactive highlights
      */}
      <Navbar />

      {/* 
        Full-screen Immersive Hero with Scroll-Linked Zoom Header:
        - Dominant Canvas: #E8E3D9 (Warm Cream)
        - Main Heading: "Kontrakan" in #1C1A18 (Deep Warm Charcoal)
        - Glow Accent: "coffee" in #D99C5B (Amber Gold)
      */}
      <HeroSection />

      {/* 
        [01 // SIGNATURE SELECTIONS]
        Section Menu Rekomendasi:
        - WebGL Circular Gallery with OGL
        - Mobile-first responsiveness (custom touch inertia, scaling, and curvature)
        - Active spotlight bar with direct detail modal trigger
      */}
      <RecommendedSection />

      {/* 
        [02 // DIGITAL CATALOGUE]
        Section Menu:
        - Category tabs (Semua, Kopi, Non-Kopi, Camilan)
        - Instant search by keyword & sort options
        - Architectural Dark Olive Green cards (#5B6653) on Warm Cream (#E8E3D9)
        - Interactive detail modal with sizes, variants, and notes
      */}
      <MenuSection />

      {/* 
        [03 // OPERATING SCHEDULE]
        Section Jam Buka (Senin - Minggu):
        - Live WIB opening status beacon (Buka Sekarang / Sedang Tutup)
        - 7-Day operational schedule highlighting today
        - WFC & student study session amenities
      */}
      <HoursSection />

      {/* 
        [04 // SPACE & ATMOSPHERE]
        Section Our Gallery:
        - Filter chips (Sudut Favorit, Manual Bar, Komunal Kerja, Outdoor)
        - Architectural responsive masonry grid
        - Fullscreen interactive lightbox modal
      */}
      <GallerySection />

      {/* 
        [05 // VISIT ATELIER]
        Section Kunjungi Kami di Lokasi:
        - Alamat lengkap dengan tombol satu ketukan "Salin Alamat"
        - Google Maps Live Embed with directional link
        - Direct WhatsApp & Instagram contact channels (informational only)
        - Facility badges (WiFi 100 Mbps, Colokan ganda, AC, Garden)
      */}
      <LocationSection />

      {/* 
        [06 // MANIFESTO]
        Section Manifesto (dipertahankan sesuai permintaan):
        - Surface Background: #5B6653 (Dark Olive Green)
        - Main Quote: #E8E3D9 (Warm Cream)
        - Animated Accent Line: #D99C5B (Amber Gold)
      */}
      <ManifestoSection />

      {/* 
        Contact & Informational Footer:
        - Supporting Ground Surface: #5B6653 (Dark Olive Green)
        - Direct navigation anchors & social channels
      */}
      <ContactFooter />
    </main>
  );
}
