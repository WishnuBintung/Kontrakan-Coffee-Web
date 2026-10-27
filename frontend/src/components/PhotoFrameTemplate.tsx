"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { Coffee, Image as ImageIcon, Sparkles } from "lucide-react";

export interface PhotoFrameTemplateProps {
  /** Source URL of the photo (e.g. from CMS) */
  src?: string;
  /** Alt title of the menu item */
  title: string;
  /** Category code or label (e.g. KOPI, NON-KOPI, CAMILAN) */
  category?: string;
  /** Custom badge text (e.g. BEST SELLER) */
  badge?: string;
  /** Frame index or slot number (e.g. 01, 02) */
  slotIndex?: string | number;
  /** Whether to force displaying the template frame mockup regardless of src */
  forceTemplate?: boolean;
  /** Aspect ratio class, defaults to aspect-[16/10] */
  aspectRatio?: string;
  /** Additional container classes */
  className?: string;
}

/**
 * PhotoFrameTemplate Component
 * 
 * An architectural photo frame engineered for Kontrakan Coffee.
 * - Displays high-resolution CMS images when available.
 * - Gracefully falls back to a branded architectural mockup frame
 *   with crosshairs, dimension guides, and CMS upload specifications
 *   when an image is missing, 404, or pending CMS integration.
 */
export function PhotoFrameTemplate({
  src,
  title,
  category = "KOPI",
  badge,
  slotIndex = "01",
  forceTemplate = false,
  aspectRatio = "aspect-[16/10]",
  className = "",
}: PhotoFrameTemplateProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Consider an image empty if it's missing, placeholder svg, or errored
  const hasValidPhoto =
    Boolean(src) &&
    src !== "" &&
    !src?.includes("placeholder-coffee.svg") &&
    !imageError &&
    !forceTemplate;

  const formattedSlot = String(slotIndex).padStart(2, "0");

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden bg-[#4D5746] border border-[#5B6653] sharp-edges select-none group ${className}`}
    >
      {/* 
        LAYER 1: Active CMS Photo (if available and loaded)
      */}
      {hasValidPhoto && (
        <img
          src={src}
          alt={title}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* 
        LAYER 2: Architectural Frame Template (Mockup Mode or Fallback)
        Shows when there is no CMS image or if imageError occurs.
      */}
      {(!hasValidPhoto || !isLoaded) && (
        <div className="absolute inset-0 w-full h-full bg-[#5B6653] flex flex-col justify-between p-4 sm:p-5 text-[#E8E3D9] overflow-hidden">
          {/* Subtle blueprint grid background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #E8E3D9 1px, transparent 1px), linear-gradient(to bottom, #E8E3D9 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Frame Top Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#4D5746] pb-2 text-[11px] font-mono text-[#D99C5B]">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider">[SLOT // {formattedSlot}]</span>
              <span className="text-[#E8E3D9]/60 uppercase">{category}</span>
            </div>
            <span className="text-[#E8E3D9]/60 tracking-wider">FRAME 16:10</span>
          </div>

          {/* Central Frame Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 py-2">
            {/* Atelier Graphic Icon Frame */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#4D5746] border border-[#D99C5B]/40 flex items-center justify-center mb-3 shadow-inner sharp-edges group-hover:border-[#D99C5B] transition-colors">
              <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#D99C5B] stroke-[1.75]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D99C5B]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#D99C5B]" />
            </div>

            <h4 className="font-sans font-black text-[15px] sm:text-[18px] uppercase tracking-[-0.01em] text-[#E8E3D9] max-w-xs line-clamp-1">
              {title}
            </h4>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] bg-[#D99C5B] text-[#1C1A18] font-bold uppercase tracking-wider sharp-edges">
                <Sparkles className="w-2.5 h-2.5" />
                <span>TEMPLATE FRAME CMS</span>
              </span>
            </div>

            <p className="font-mono text-[10px] sm:text-[11px] text-[#E8E3D9]/60 mt-2 uppercase tracking-wide">
              Siap Menerima Foto CMS • Min. 1200×750px
            </p>
          </div>

          {/* Frame Bottom Registration Marks */}
          <div className="relative z-10 flex items-center justify-between border-t border-[#4D5746] pt-2 text-[10px] font-mono text-[#E8E3D9]/60">
            <span>KONTRAKAN ATELIER SYSTEM</span>
            <span className="text-[#D99C5B]">READY FOR INTEGRATION</span>
          </div>
        </div>
      )}

      {/* 
        LAYER 3: Frame Overlays (Corner Crosshairs & Badges)
      */}
      {/* Corner crosshairs (+) */}
      <span className="absolute top-2 left-2 font-mono text-[12px] text-[#D99C5B] pointer-events-none z-20 leading-none select-none">
        +
      </span>
      <span className="absolute top-2 right-2 font-mono text-[12px] text-[#D99C5B] pointer-events-none z-20 leading-none select-none">
        +
      </span>
      <span className="absolute bottom-2 left-2 font-mono text-[12px] text-[#D99C5B] pointer-events-none z-20 leading-none select-none">
        +
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[12px] text-[#D99C5B] pointer-events-none z-20 leading-none select-none">
        +
      </span>

      {/* Floating Badge (e.g. BEST SELLER or CMS READY) */}
      {badge && (
        <div className="absolute top-3 left-3 bg-[#1C1A18]/85 backdrop-blur-md border border-[#D99C5B]/40 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] text-[#D99C5B] uppercase tracking-widest font-semibold sharp-edges z-20 shadow-md">
          {badge}
        </div>
      )}

      {/* CMS Indicator Pill in bottom left when photo is loaded */}
      {hasValidPhoto && isLoaded && (
        <div className="absolute bottom-3 left-3 bg-[#1C1A18]/85 backdrop-blur-md px-2 py-0.5 border border-[#D99C5B]/30 font-mono text-[9px] text-[#D99C5B] uppercase tracking-wider sharp-edges z-20">
          CMS PHOTO // 16:10
        </div>
      )}
    </div>
  );
}

export default PhotoFrameTemplate;

