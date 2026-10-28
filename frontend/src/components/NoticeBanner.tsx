"use client";

import React from "react";
import { usePromoData } from "@/hooks/useCafeData";

/** Height of the banner in px — the fixed header offsets itself by this amount. */
export const NOTICE_BANNER_HEIGHT = 40;

/**
 * Slim announcement strip above the header (the "Up to 70% SkillsFuture
 * funding…" bar on bettr.academy). Surfaces the first active promo from the
 * CMS and falls back to a general opening notice.
 */
export function NoticeBanner() {
  const promos = usePromoData();
  const active =
    promos.find((p) => p.aktif && p.tipe === "promo") ?? promos.find((p) => p.aktif);

  return (
    <div
      className="relative z-[5] flex items-center justify-center bg-coffee-darker px-4 text-center text-[15px] leading-none text-cream"
      style={{ height: NOTICE_BANNER_HEIGHT }}
      role="region"
      aria-label="Pengumuman"
    >
      <a
        href="#promo"
        className="max-w-full truncate transition-colors hover:text-latte"
      >
        {active ? (
          <>
            <span className="font-medium text-latte">{active.judul}</span>
            <span className="hidden sm:inline"> — {active.deskripsi}</span>
          </>
        ) : (
          <span>Buka setiap hari · Wi-Fi kencang · Stopkontak di tiap meja</span>
        )}
      </a>
    </div>
  );
}

export default NoticeBanner;

