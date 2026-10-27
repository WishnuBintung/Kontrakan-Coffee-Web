"use client";

import React, { useMemo } from "react";
import { useCafeInfo, useMenuData } from "@/hooks/useCafeData";

const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5];

/** Tilted sticker ribbon — adapted from Bettr's "20,000+ Students…" stat ribbon. */
export function StatsMarquee() {
  const info = useCafeInfo();
  const { allItems } = useMenuData();

  const stickers = useMemo(() => {
    const list = [
      `${allItems.length} Menu Pilihan`,
      ...info.fasilitas.map((f) => f.title),
    ];
    return list;
  }, [allItems.length, info.fasilitas]);

  const renderSet = (hidden: boolean) =>
    stickers.map((label, i) => (
      <li
        key={`${hidden ? "b" : "a"}-${label}`}
        aria-hidden={hidden || undefined}
        style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
        className="halftone mx-3 shrink-0 whitespace-nowrap rounded-[0.6rem] border border-coffee/25 bg-latte-light px-6 py-3 shadow-[0_1px_0_rgba(44,28,15,0.12)]"
      >
        <span className="font-display text-[clamp(1.6rem,3vw,2.4rem)]">{label}</span>
      </li>
    ));

  return (
    <div
      className="relative w-full overflow-hidden bg-[linear-gradient(to_bottom,var(--color-coffee)_50%,var(--color-cream)_50%)] py-12 sm:py-16"
      aria-label="Fasilitas Kontrakan Coffee"
    >
      <div className="marquee-ribbon -mx-[5%] w-[110%] -rotate-[1.5deg] bg-latte py-6 text-coffee">
        <ul className="marquee-track list-none p-0">
          {renderSet(false)}
          {renderSet(true)}
        </ul>
      </div>
    </div>
  );
}

export default StatsMarquee;

