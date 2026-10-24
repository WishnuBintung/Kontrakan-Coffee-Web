"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectGrid } from "@/components/ProjectGrid";
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
        Project Grid:
        - Canvas Background: #E8E3D9 (Warm Cream)
        - Support Cards: #5B6653 (Dark Olive Green)
        - Headings on Cards: #E8E3D9
        - Interactive Action Buttons: #D99C5B (Amber Gold)
      */}
      <ProjectGrid />

      {/* 
        Manifesto Section:
        - Surface Background: #5B6653 (Dark Olive Green untuk jeda kedalaman spasial)
        - Main Quote: #E8E3D9
        - Accent Line: #D99C5B (Amber Gold)
      */}
      <ManifestoSection />

      {/* 
        Project Contact Footer:
        - Supporting Ground Surface: #5B6653 (Dark Olive Green)
        - Heading 'START A PROJECT' with #D99C5B hover
        - 3-column grid with #D99C5B wavy hover links and copy button
      */}
      <ContactFooter />
    </main>
  );
}
