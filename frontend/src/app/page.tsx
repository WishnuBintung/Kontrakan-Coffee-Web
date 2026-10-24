"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ManifestoSection } from "@/components/ManifestoSection";
import { ContactFooter } from "@/components/ContactFooter";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#000000] text-[#e5e5e5] overflow-x-hidden selection:bg-[#ef4444] selection:text-white">
      {/* 
        Fixed Navbar with mix-blend-difference 
        to ensure seamless visibility over dark and light sections 
      */}
      <Navbar />

      {/* 
        Full-screen Immersive Hero with Scroll-Linked Zoom Header:
        - Layer 1 (Back): Background image with radial tint & grain, scale 1.0 -> 1.27
        - Layer 2 (Mid): Large 12vw heading, scale 1.0 -> 0.89 on 0-30% scroll
        - Layer 3 (Overlay): Secondary label (32px) positioned left-[calc(100%+1rem)], fading out
        - Bottom: Description text in white/70%
      */}
      <HeroSection />

      {/* 
        Project Grid:
        - Background: #FFFFFF, Text: #000000
        - Heading: 'SELECTED WORKS' in 8vw Black weight, 'WORKS' in italic Thin weight
        - Grid: 2-column layout with 2rem gaps
        - Cards: Aspect ratio 16:10 / 4:5, zoom on hover, translateY reveal, white circular action button
      */}
      <ProjectGrid />

      {/* 
        Manifesto Section:
        - Background: #09090b, Height: 100vh
        - Centered text: 5vw-7vw, font-weight 500
        - Text slides up with opacity 0->1
        - Below: horizontal line animates width 0->100% (max-w 320px) on scroll-into-view
      */}
      <ManifestoSection />

      {/* 
        Project Contact Footer:
        - Background: #fafafa
        - Top: Full-width border-b text 'START A PROJECT' at 12vw, Black weight, uppercase
        - Bottom: 3-column grid (Social links with wavy underline, 3xl Email, Rights reserved)
      */}
      <ContactFooter />
    </main>
  );
}
