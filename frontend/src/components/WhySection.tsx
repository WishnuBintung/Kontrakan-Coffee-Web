"use client";

import React, { useMemo } from "react";
import {
  BookOpen,
  Car,
  Clock,
  Coffee,
  Plug,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Wifi,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGalleryData, useWhyData } from "@/hooks/useCafeData";

const ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  plug: Plug,
  wind: Wind,
  trees: Trees,
  car: Car,
  sparkles: Sparkles,
  coffee: Coffee,
  book: BookOpen,
  shield: ShieldCheck,
  clock: Clock,
  users: Users,
};

const SURFACES = [
  "bg-sunshine text-coffee",
  "bg-cream text-coffee",
  "bg-latte text-coffee",
];

/**
 * "A way that's 100% Better. But why Bettr?" — Bettr's sticky stacked cards
 * over a photograph, adapted to the cafe's facilities (Wi-Fi, outlets, …).
 * Fully editable via Decap CMS (content/why.json).
 */
export function WhySection() {
  const whyData = useWhyData();
  const gallery = useGalleryData();

  const backdrop = useMemo(() => {
    if (whyData.foto_backdrop && !whyData.foto_backdrop.includes("placeholder")) {
      return whyData.foto_backdrop;
    }
    const garden = gallery.find((g) => /garden|taman|outdoor/i.test(`${g.judul} ${g.id}`));
    return (garden ?? gallery[0])?.gambar;
  }, [whyData.foto_backdrop, gallery]);

  return (
    <section
      id="fasilitas"
      className="relative isolate w-full overflow-clip px-4 pb-24 pt-20 sm:px-6 sm:pt-28"
    >
      {/* Photo backdrop with coffee wash */}
      <div className="absolute inset-0 -z-10 bg-coffee">
        {backdrop && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backdrop}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-60"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-coffee/55" />
      </div>

      <div className="mx-auto max-w-5xl">
        <h2
          data-rev
          className="font-display mb-10 text-[clamp(2.6rem,6vw,5.5rem)] text-sunshine sm:mb-14"
        >
          {whyData.judul || "Betah Berjam-jam. Kenapa Kontrakan?"}
        </h2>

        {whyData.deskripsi && (
          <p className="mb-8 max-w-2xl text-lg text-cream/90 -mt-6">
            {whyData.deskripsi}
          </p>
        )}

        <div className="flex flex-col gap-6">
          {whyData.items.map((f, i) => {
            const Icon = ICONS[f.icon.toLowerCase()] ?? Coffee;
            return (
              <article
                key={`${f.title}-${i}`}
                style={{ "--i": i } as React.CSSProperties}
                className={`stack-card relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[0.25rem] p-6 shadow-[0_-8px_24px_-12px_rgba(17,11,6,0.45)] sm:p-10 ${SURFACES[i % SURFACES.length]}`}
              >
                {/* Watermark icon (Bettr's faded illustration) */}
                <Icon
                  aria-hidden="true"
                  strokeWidth={1}
                  className="pointer-events-none absolute -right-6 top-1/2 h-64 w-64 -translate-y-1/2 text-coffee/15 sm:right-8 sm:h-80 sm:w-80"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <h3 className="font-display max-w-md text-[clamp(2.2rem,4vw,3.4rem)]">
                    {f.title}
                  </h3>
                </div>

                <div className="relative mt-16 max-w-md">
                  <div className="rule-dashed mb-4 text-coffee" aria-hidden="true" />
                  <p className="text-lg">{f.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhySection;
