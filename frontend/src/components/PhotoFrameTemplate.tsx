"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { Coffee, Sparkles } from "lucide-react";

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

  const hasValidPhoto =
    Boolean(src) &&
    src !== "" &&
    !src?.includes("placeholder-coffee.svg") &&
    !imageError &&
    !forceTemplate;

  const formattedSlot = String(slotIndex).padStart(2, "0");

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden bg-[#472F1D] border border-[#5F493C] sharp-edges select-none group ${className}`}
    >
      {/* LAYER 1: Active CMS Photo */}
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

      {/* LAYER 2: Architectural Frame Template */}
      {(!hasValidPhoto || !isLoaded) && (
        <div className="absolute inset-0 w-full h-full bg-[#5F493C] flex flex-col justify-between p-4 sm:p-5 text-[#EEE6D7] overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #EEE6D7 1px, transparent 1px), linear-gradient(to bottom, #EEE6D7 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Frame Top Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#472F1D] pb-2 text-[11px] font-mono text-[#C7B8AE]">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider">{formattedSlot}</span>
              <span className="text-[#EEE6D7]/60 uppercase">{category}</span>
            </div>
            <span className="text-[#EEE6D7]/60 tracking-wider">FRAME 16:10</span>
          </div>

          {/* Central Frame Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 py-2">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#472F1D] border border-[#C7B8AE]/40 flex items-center justify-center mb-3 shadow-inner sharp-edges group-hover:border-[#C7B8AE] transition-colors">
              <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#C7B8AE] stroke-[1.75]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C7B8AE]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#C7B8AE]" />
            </div>

            <h4 className="font-sans font-black text-[15px] sm:text-[18px] uppercase tracking-[-0.01em] text-[#EEE6D7] max-w-xs line-clamp-1">
              {title}
            </h4>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                <Sparkles className="w-2.5 h-2.5" />
                <span>TEMPLATE FRAME CMS</span>
              </span>
            </div>

            <p className="font-mono text-[10px] sm:text-[11px] text-[#EEE6D7]/60 mt-2 uppercase tracking-wide">
              Siap Menerima Foto CMS • Min. 1200×750px
            </p>
          </div>

          {/* Frame Bottom Registration Marks */}
          <div className="relative z-10 flex items-center justify-between border-t border-[#472F1D] pt-2 text-[10px] font-mono text-[#EEE6D7]/60">
            <span>KONTRAKAN ATELIER SYSTEM</span>
            <span className="text-[#C7B8AE]">READY FOR INTEGRATION</span>
          </div>
        </div>
      )}

      {/* Corner crosshairs (+) */}
      <span className="absolute top-2 left-2 font-mono text-[12px] text-[#C7B8AE] pointer-events-none z-20 leading-none select-none">
        +
      </span>
      <span className="absolute top-2 right-2 font-mono text-[12px] text-[#C7B8AE] pointer-events-none z-20 leading-none select-none">
        +
      </span>
      <span className="absolute bottom-2 left-2 font-mono text-[12px] text-[#C7B8AE] pointer-events-none z-20 leading-none select-none">
        +
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[12px] text-[#C7B8AE] pointer-events-none z-20 leading-none select-none">
        +
      </span>

      {/* Floating Badge */}
      {badge && (
        <div className="absolute top-3 left-3 bg-[#472F1D]/85 backdrop-blur-md border border-[#C7B8AE]/40 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] text-[#C7B8AE] uppercase tracking-widest font-semibold sharp-edges z-20 shadow-md">
          {badge}
        </div>
      )}
    </div>
  );
}

export default PhotoFrameTemplate;
