"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { SplitWords } from "./EditorialMotion";

export function HeroSection() {
  return (
    <section
      id="hero"
      data-scroll-stage="hero"
      className="stage-hero-pin relative w-full h-[300svh] bg-[#E8E3D9] text-[#1C1A18] select-none"
    >
      {/* Sticky 100svh Inner Pin (Prompt Layout & Choreography) */}
      <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center px-6 pt-24 sm:pt-28 pb-8 sm:pb-10 bg-[#E8E3D9] text-[#1C1A18] isolate">
        {/* Multiply-blended still-life photograph scaling 1.04 -> 1.11 and drifting up 3% */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/bg-hero.jpg"
            alt="Kontrakan Coffee Atelier Atmosphere"
            className="stage-hero-photo w-full h-full object-cover opacity-85"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallbackTried) {
                target.dataset.fallbackTried = "1";
                target.src = "./images/bg-hero.jpg";
              }
            }}
          />
        </div>

        {/* Top Mono Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between border-b border-[#1C1A18]/20 pb-3">
          <span
            data-rev
            style={{ "--d": "40ms" } as React.CSSProperties}
            className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18] font-semibold"
          >
            [00 // SPATIAL COFFEE ATELIER]
          </span>
          <span
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18] font-semibold hidden sm:inline-block"
          >
            7.7725° S, 110.4092° E // YOGYAKARTA
          </span>
          <span
            data-rev
            style={{ "--d": "140ms" } as React.CSSProperties}
            className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18] font-semibold"
          >
            EST. 2026
          </span>
        </div>

        {/* Center Type Block ABOVE the multiplied photograph — lifts 46px and fades out on scroll */}
        <div className="stage-hero-type my-auto relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
          {/* Rotated Overline Accent */}
          <span
            data-rev
            style={{ "--d": "70ms" } as React.CSSProperties}
            className="font-sans italic font-light text-lg sm:text-2xl text-[#D99C5B] inline-block -rotate-2 mb-3 tracking-normal"
          >
            Artisanal Spatial Roastery &amp; Slow Bar
          </span>

          {/* Main Heading: Kontrakan + coffee with original typography */}
          <div
            data-rev
            style={{ "--d": "120ms" } as React.CSSProperties}
            className="relative inline-flex items-center justify-center py-4 md:py-6"
          >
            <h1 className="font-sans font-black text-[12vw] leading-none text-[#1C1A18] tracking-[-0.03em] select-none text-center">
              Kontrakan
            </h1>
            <span className="hidden sm:inline-block absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 text-[32px] font-thin italic text-[#D99C5B] whitespace-nowrap font-sans tracking-normal pointer-events-none select-none">
              coffee
            </span>
          </div>

          {/* Mobile secondary label */}
          <span className="sm:hidden text-2xl font-thin italic text-[#D99C5B] font-sans -mt-2 mb-2">
            coffee
          </span>

          {/* Bottom hero paragraph (Per-word stagger animation) */}
          <div className="relative z-10 max-w-2xl mx-auto px-4 mt-4 sm:mt-6">
            <p className="text-[17px] md:text-[20px] font-light tracking-tight text-[#1C1A18]/90 leading-relaxed font-sans font-medium">
              <SplitWords
                text="The Kontrakan Coffee design system combines warm brick-reflected cream, dark olive green surfaces, and glowing amber gold accents to create an immersive, architectural coffee atelier experience."
                staggerMs={38}
                baseDelayMs={150}
              />
            </p>
          </div>
        </div>

        {/* Three Mono Straps Pinned Across the Base (Prompt Layout Spec) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-4 border-t border-[#1C1A18]/25">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center bg-[#E8E3D9]/80 backdrop-blur-[2px] px-4 py-2.5 border border-[#1C1A18]/20">
            <div
              data-rev
              style={{ "--d": "60ms" } as React.CSSProperties}
              className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18] font-bold text-left flex items-center gap-2"
            >
              <span className="text-[#D99C5B]">[01]</span>
              <span>JL. SETURAN RAYA NO. 45, SLEMAN</span>
            </div>

            <div
              data-rev
              style={{ "--d": "120ms" } as React.CSSProperties}
              className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18] font-bold sm:text-center hidden sm:block"
            >
              <span className="text-[#D99C5B]">[02]</span>{" "}
              <span>SINGLE ORIGIN &amp; ARTISANAL BREW</span>
            </div>

            <div
              data-rev
              style={{ "--d": "180ms" } as React.CSSProperties}
              className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#1C1A18] font-bold sm:text-right flex sm:justify-end items-center gap-2"
            >
              <span className="text-[#D99C5B]">[03]</span>
              <span>SCROLL UNTUK MENJELAJAH ↓</span>
            </div>
          </div>

          {/* Progress Rail in Accent Color */}
          <div className="w-full h-[2px] bg-[#1C1A18]/15 mt-2 overflow-hidden">
            <div
              data-stage-progress
              className="h-full w-full bg-[#D99C5B] origin-left scale-x-0 transition-transform duration-75"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
