"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";

export function ManifestoSection() {
  return (
    <section
      id="pembuka"
      className="relative w-full bg-[#EEE6D7] text-[#472F1D] sharp-edges border-t border-b border-[#C7B8AE]"
    >
      {/* =======================================================================
          320svh Pinned Stage — Smooth Top-Down Coffee Image Reveal
          with Difference-Blended Headline that Fades Out on Scroll
         ======================================================================= */}
      <div
        data-scroll-stage="reveal"
        className="stage-reveal-pin relative w-full h-[320svh] bg-[#EEE6D7]"
      >
        <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center bg-[#5F493C]">
          {/* Second Photograph (Artisan Coffee Still Life) revealed smoothly from top to bottom */}
          <div className="stage-reveal-photo-wrap absolute inset-0 w-full h-full z-10 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=85&w=2000&auto=format&fit=crop"
              alt="Seduhan Kopi Spesialti Kontrakan Coffee"
              className="stage-reveal-photo w-full h-full object-cover brightness-90 contrast-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#472F1D]/75 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Large Headline Above Image in mix-blend-mode: difference (#EEE6D7), fading out as reveal completes */}
          <div className="stage-reveal-headline relative z-20 max-w-5xl mx-auto px-6 text-center pointer-events-none select-none">
            <h2 className="font-sans font-medium text-[6.5vw] md:text-[5vw] leading-tight tracking-[-0.03em] uppercase">
              We strip away the superfluous until only aroma, light, and raw spatial substance remain.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManifestoSection;
