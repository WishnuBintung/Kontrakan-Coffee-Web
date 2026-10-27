"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useMenuData } from "@/hooks/useCafeData";
import { CATEGORY_EVENT } from "./MenuSection";

const CATEGORY_CARDS = [
  {
    id: "kopi",
    title: "Kopi",
    blurb:
      "Espresso, manual brew, sampai cold brew — diseduh pelan dari biji pilihan.",
    cta: "Lihat Menu Kopi",
  },
  {
    id: "non-kopi",
    title: "Non-Kopi",
    blurb:
      "Matcha, cokelat, teh, dan minuman segar untuk yang lagi pengin selain kopi.",
    cta: "Lihat Non-Kopi",
  },
  {
    id: "camilan",
    title: "Camilan",
    blurb:
      "Pastry, roti bakar, dan camilan gurih — teman ngobrol atau ngerjain tugas.",
    cta: "Lihat Camilan",
  },
] as const;

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  kopi: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
  "non-kopi":
    "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1200&auto=format&fit=crop",
  camilan:
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop",
};

/** "Where does your Bettr journey begin?" — adapted as a menu category picker. */
export function CategorySection() {
  const { allItems } = useMenuData();

  const cards = useMemo(
    () =>
      CATEGORY_CARDS.map((card) => {
        const inCategory = allItems.filter((m) => m.kategori === card.id);
        const cover =
          inCategory.find((m) => m.rekomendasi && m.foto)?.foto ??
          inCategory.find((m) => m.foto)?.foto ??
          CATEGORY_FALLBACK_IMAGES[card.id];
        return { ...card, count: inCategory.length, cover };
      }),
    [allItems]
  );

  const pick = (id: string) => {
    window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: id }));
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="kategori"
      className="w-full bg-coffee px-4 pb-8 pt-16 text-cream sm:px-6 sm:pt-24"
    >
      <div className="mx-auto max-w-[90rem]">
        <div
          data-rev
          className="mb-2 rounded-[0.75rem] bg-roast px-6 py-8 sm:px-8 sm:py-10"
        >
          <h2 className="font-display text-[clamp(2.4rem,5.6vw,5rem)] text-sunshine">
            Mau Ngopi Apa Hari Ini?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              onClick={() => pick(card.id)}
              data-rev
              style={{ "--d": `${idx * 80}ms` } as React.CSSProperties}
              className="group flex min-h-[28rem] flex-col overflow-hidden rounded-[0.5rem] bg-sunshine p-6 text-left text-coffee transition-colors duration-300 hover:bg-sunshine-light sm:p-8"
              aria-label={`${card.title}: ${card.cta}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-5xl sm:text-6xl">{card.title}</h3>
                <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.2rem] bg-coffee text-sunshine transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>

              <p className="mt-4 max-w-sm text-lg">{card.blurb}</p>

              <div className="mt-auto pt-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[0.25rem] bg-coffee/10">
                  {card.cover && (
                    <img
                      src={card.cover}
                      alt={`Contoh menu ${card.title}`}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = CATEGORY_FALLBACK_IMAGES[card.id];
                        if (fallback && target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  )}
                  <span className="tag absolute left-3 top-3">
                    {card.count} menu
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;

