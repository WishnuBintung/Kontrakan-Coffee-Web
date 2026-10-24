"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ManifestoSection } from "@/components/ManifestoSection";
import { ContactFooter } from "@/components/ContactFooter";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FFFFFF] text-[#241611] overflow-x-hidden selection:bg-[#5C3317] selection:text-white">
      {/* 
        Sticky/Fixed Navbar with blurred cream backdrop and deep espresso typography
      */}
      <Navbar />

      {/* 
        Full-screen Immersive Hero with Scroll-Linked Zoom Header:
        - Canvas: #FFFFFF (Putih)
        - Heading: "Kontrakan" in #241611 (Coklat Espresso)
        - Secondary label: "coffee"
      */}
      <HeroSection />

      {/* 
        Project Grid:
        - Canvas Background: #FFFFFF (Putih)
        - Card Surface: #F5F0E6 (Krem)
        - Text: #241611 (Coklat Espresso)
        - Action Buttons: #5C3317 (Coklat Roasted Coffee)
      */}
      <ProjectGrid />

      {/* 
        Manifesto Section:
        - Surface Background: #F5F0E6 (Krem untuk kedalaman tata letak)
        - Text: #241611 (Coklat Espresso)
        - Accent line: #5C3317
      */}
      <ManifestoSection />

      {/* 
        Project Contact Footer:
        - Canvas Background: #FFFFFF (Putih)
        - Dividers: #E6DDCF (Krem halus)
        - Heading 'START A PROJECT' with #5C3317 hover
        - 3-column grid with #5C3317 wavy hover links and copy button
      */}
      <ContactFooter />
    </main>
  );
}
