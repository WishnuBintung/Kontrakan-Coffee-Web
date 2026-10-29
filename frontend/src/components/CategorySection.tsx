"use client";

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

/** "Where does your Bettr journey begin?" — adapted as a menu category picker without images. */
export function CategorySection() {
  const { allItems } = useMenuData();

  const cards = useMemo(
    () =>
      CATEGORY_CARDS.map((card) => {
        const inCategory = allItems.filter((m) => m.kategori === card.id);
        return { ...card, count: inCategory.length };
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
              className="group flex min-h-[16rem] sm:min-h-[18rem] flex-col justify-between overflow-hidden rounded-[0.5rem] bg-sunshine p-6 text-left text-coffee transition-all duration-300 hover:bg-sunshine-light hover:-translate-y-1 sm:p-8"
              aria-label={`${card.title}: ${card.cta}`}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-5xl sm:text-6xl">{card.title}</h3>
                  <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.2rem] bg-coffee text-sunshine transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>

                <p className="mt-4 max-w-sm text-lg text-coffee/90">{card.blurb}</p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-coffee/20 pt-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-coffee/75">
                  {card.count} menu
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-coffee transition-colors group-hover:text-roast">
                  {card.cta} →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;

