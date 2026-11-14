import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ContactFooter } from "@/components/layout/ContactFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategorySection } from "@/components/sections/CategorySection";
import { StatsMarquee } from "@/components/sections/StatsMarquee";
import { PromoSection } from "@/components/sections/PromoSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { WhySection } from "@/components/sections/WhySection";
import { GallerySection } from "@/components/sections/GallerySection";
import { LocationSection } from "@/components/sections/LocationSection";
import { EditorialChoreography } from "@/components/ui/EditorialMotion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cream text-coffee selection:bg-sunshine selection:text-coffee">
      <EditorialChoreography />
      {/* Announcement banner + fixed header */}
      <Navbar />

      <main>
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
      </main>

      {/* 9. FOOTER */}
      <ContactFooter />
    </div>
  );
}
