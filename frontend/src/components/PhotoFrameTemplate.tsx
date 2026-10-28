"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { Coffee } from "lucide-react";

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
  forceTemplate = false,
  aspectRatio = "aspect-[16/10]",
  className = "",
}: PhotoFrameTemplateProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidPhoto =
    Boolean(src) &&
    src !== "" &&
    !src?.includes("placeholder-coffee.svg") &&
    !imageError &&
    !forceTemplate;

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden rounded-[0.15rem] bg-latte select-none group ${className}`}
    >
      {/* LAYER 1: Active CMS Photo (Instant render, no delay) */}
      {hasValidPhoto && (
        <img
          src={src}
          alt={title}
          loading="eager"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      )}

      {/* LAYER 2: Fallback frame while photo is missing / error */}
      {!hasValidPhoto && (
        <div className="halftone absolute inset-0 flex flex-col items-center justify-center gap-2 bg-latte p-4 text-center text-coffee">
          <div className="flex h-12 w-12 items-center justify-center rounded-[0.25rem] bg-cream text-coffee">
            <Coffee className="h-6 w-6" />
          </div>
          <h4 className="font-display line-clamp-1 max-w-xs text-2xl">{title}</h4>
          <span className="text-xs font-medium uppercase tracking-wider text-coffee/70">
            {category} · foto segera hadir
          </span>
        </div>
      )}

      {/* Floating Badge */}
      {badge && (
        <div className="tag absolute left-3 top-3 z-20">{badge}</div>
      )}
    </div>
  );
}

export default PhotoFrameTemplate;
