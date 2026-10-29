"use client";

import React from "react";
import { CafeMenuItem, formatPriceRupiah } from "@/lib/cafeData";
import { PhotoFrameTemplate } from "./PhotoFrameTemplate";
import { Sparkles } from "lucide-react";

interface FloatingMenuCardProps {
  item: CafeMenuItem | null;
  x: number;
  y: number;
}

export function FloatingMenuCard({ item, x, y }: FloatingMenuCardProps) {
  if (!item) return null;

  return (
    <div
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      className="fixed top-0 left-0 z-[90] pointer-events-none w-[280px] sm:w-[295px] overflow-hidden rounded-[0.35rem] border border-coffee/20 bg-cream text-coffee shadow-[0_20px_40px_-10px_rgba(44,28,15,0.42),0_0_0_1px_rgba(44,28,15,0.08)] transition-transform duration-75 ease-out will-change-transform"
    >
      {/* Foto Menu Ringkas & Tajam (Tanpa Delay) */}
      <div className="relative w-full">
        <PhotoFrameTemplate
          src={item.foto}
          title={item.nama}
          category={item.kategori}
          aspectRatio="aspect-[16/10]"
        />
        {item.rekomendasi && (
          <div className="tag absolute left-2.5 top-2.5 text-[10px] py-0.5 px-2 bg-sunshine text-coffee font-bold">
            <Sparkles className="h-3 w-3 inline mr-1" />
            Andalan
          </div>
        )}
      </div>

      {/* Konten Detail Menu */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2 border-b border-coffee/10 pb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-coffee/70">
            {item.kategori}
          </span>
          {item.ukuran && item.ukuran.length > 0 && (
            <span className="text-[10px] font-medium text-coffee/60">
              {item.ukuran.join(" / ")}
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-display text-lg sm:text-xl font-bold leading-tight text-coffee">
            {item.nama}
          </h4>
          <span className="whitespace-nowrap text-sm font-bold text-coffee tabular-nums">
            {formatPriceRupiah(item.harga)}
          </span>
        </div>

        {item.deskripsi && (
          <p className="text-[12px] leading-relaxed text-coffee/80 line-clamp-2">
            {item.deskripsi}
          </p>
        )}

        {item.rasa && item.rasa.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.rasa.slice(0, 3).map((r) => (
              <span
                key={r}
                className="rounded-[0.15rem] bg-latte/40 px-1.5 py-0.5 text-[10px] font-medium text-coffee/85 uppercase"
              >
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FloatingMenuCard;

