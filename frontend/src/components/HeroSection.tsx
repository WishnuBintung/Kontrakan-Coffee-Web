"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { SplitWords } from "./EditorialMotion";

export function HeroSection() {
  return (
    <section
      id="hero"
      data-scroll-stage="hero"
      className="stage-hero-pin relative w-full h-[300svh] bg-[#EEE6D7] text-[#472F1D] select-none"
    >
      {/* Sticky 100svh Inner Pin (Prompt Layout & Choreography) */}
      <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-center items-center text-center px-6 py-16 bg-[#EEE6D7] text-[#472F1D] isolate">
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

        {/* Center Type Block ABOVE the multiplied photograph — lifts 46px and fades out on scroll */}
        <div className="stage-hero-type my-auto relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
          {/* Rotated Overline Accent */}
          <span
            data-rev
            style={{ "--d": "70ms" } as React.CSSProperties}
            className="font-sans italic font-light text-lg sm:text-2xl text-[#5F493C] inline-block -rotate-2 mb-3 tracking-normal"
          >
            Artisanal Spatial Roastery &amp; Slow Bar
          </span>

          {/* Main Heading: Kontrakan + coffee with original typography */}
          <div
            data-rev
            style={{ "--d": "120ms" } as React.CSSProperties}
            className="relative inline-flex items-center justify-center py-4 md:py-6"
          >
            <h1 className="font-sans font-black text-[12vw] leading-none text-[#472F1D] tracking-[-0.03em] select-none text-center">
              Kontrakan
            </h1>
            <span className="hidden sm:inline-block absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 text-[32px] font-thin italic text-[#5F493C] whitespace-nowrap font-sans tracking-normal pointer-events-none select-none">
              coffee
            </span>
          </div>

          {/* Mobile secondary label */}
          <span className="sm:hidden text-2xl font-thin italic text-[#5F493C] font-sans -mt-2 mb-2">
            coffee
          </span>

          {/* Bottom hero paragraph (Per-word stagger animation) */}
          <div className="relative z-10 max-w-2xl mx-auto px-4 mt-4 sm:mt-6">
            <p className="text-[17px] md:text-[20px] font-light tracking-tight text-[#472F1D]/90 leading-relaxed font-sans font-medium">
              <SplitWords
                text="The Kontrakan Coffee design system combines warm oat cream, roasted mocha surfaces, deep espresso typography, and latte taupe accents to create an immersive, architectural coffee atelier experience."
                staggerMs={26}
                baseDelayMs={160}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
