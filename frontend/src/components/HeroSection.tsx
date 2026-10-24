"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrollLinkedZoomHeader } from "./ScrollLinkedZoomHeader";

export function HeroSection() {
  const [viewportHeight, setViewportHeight] = useState(857);

  useEffect(() => {
    setViewportHeight(window.innerHeight || 857);
    const handleResize = () => setViewportHeight(window.innerHeight || 857);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion useScroll capturing Y-axis
  const { scrollY } = useScroll();

  // Layer 1 (Back): Background image scale linked to scroll (1.0 to 1.27)
  const bgScale = useTransform(scrollY, [0, viewportHeight], [1.0, 1.27], {
    clamp: true,
  });

  return (
    <section className="relative w-full h-screen min-h-[857px] overflow-hidden flex flex-col justify-between items-center text-center px-6 pt-32 pb-16 bg-[#000000]">
      {/* Layer 1 (Back): Background image with radial tint and grain, scale linked to scroll (1.0 to 1.27) */}
      <motion.div
        style={{
          scale: bgScale,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      >
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2160&auto=format&fit=crop"
          alt="Architectural Noir Background"
          className="w-full h-full object-cover grayscale contrast-125 brightness-[0.4]"
        />

        {/* Radial gradient background: radial-gradient(ellipse at center, rgba(139,69,69,0.4) 0%, rgba(20,20,20,0.8) 60%, rgba(0,0,0,0.95) 100%) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(139,69,69,0.4) 0%, rgba(20,20,20,0.8) 60%, rgba(0,0,0,0.95) 100%)",
          }}
        />
      </motion.div>

      {/* Top element: Mono sub-label */}
      <div className="z-10">
        <span className="font-mono text-[14px] uppercase tracking-widest text-[#888] block">
          [00 // IMMERSIVE GALLERY]
        </span>
      </div>

      {/* Layer 2 (Mid) & Layer 3 (Overlay): Scroll-Linked Zoom Header Component */}
      <div className="my-auto z-10 w-full flex items-center justify-center">
        <ScrollLinkedZoomHeader title="CINEMATIC" secondaryLabel="NOIR" />
      </div>

      {/* Bottom: Description text (max-w-2xl) in white/70% opacity, 1.25rem (20px), font-weight 300 or 400, tracking tight */}
      <div className="z-10 max-w-2xl mx-auto px-4 flex flex-col items-center gap-6">
        <p className="text-[20px] font-light tracking-tight text-white/70 leading-relaxed font-sans">
          The Cinematic Noir design system leverages deep blacks, crisp off-whites,
          and a sophisticated typographic scale to create an immersive, gallery-like experience.
        </p>

        <div className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-widest text-[#888]">
          <span>SCROLL FOR REVEAL</span>
          <span className="w-8 h-[1px] bg-white/30" />
          <span>DEPTH // 1.27x</span>
        </div>
      </div>
    </section>
  );
}
