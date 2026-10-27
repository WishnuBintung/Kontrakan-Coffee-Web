"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Calendar, Clock, Tag } from "lucide-react";
import { usePromoData } from "@/hooks/useCafeData";

/** "2026-12-31" → "31 Des 2026" (UTC, so server and client always agree). */
function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function PromoSection() {
  const promos = usePromoData();

  return (
    <section
      id="promo"
      className="relative w-full bg-cream px-4 pb-20 pt-10 text-coffee sm:px-6 sm:pb-28 sm:pt-16"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)]">
              Promo &amp; Agenda Spesial.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-coffee/80">
              Diskon kopi sore hari, paket nongkrong hemat pelajar &amp;
              mahasiswa, serta agenda musik akustik santai di Kontrakan Coffee.
            </p>
          </div>
          <a
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            href="#menu"
            className="btn self-start md:self-auto"
          >
            Lihat Semua Menu
          </a>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promos.map((item, idx) => {
            const isEvent = item.tipe === "kegiatan";
            const surface = idx % 3 === 1 ? "bg-latte" : "bg-sunshine";
            return (
              <article
                key={item.id}
                data-rev
                style={{ "--d": `${idx * 70}ms` } as React.CSSProperties}
                className={`group flex flex-col rounded-[0.25rem] p-4 sm:p-5 ${surface}`}
              >
                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="tag">
                    {isEvent ? (
                      <Calendar className="h-4 w-4" />
                    ) : (
                      <Tag className="h-4 w-4" />
                    )}
                    {isEvent ? "Agenda Acara" : "Promo Hemat"}
                  </span>
                  <span className="tag">Berlaku Aktif</span>
                </div>

                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.25rem] bg-coffee/10">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <h3 className="font-display mt-5 text-[clamp(1.9rem,2.6vw,2.4rem)]">
                  {item.judul}
                </h3>
                <p className="mt-2 line-clamp-3 text-[17px] text-coffee/90">
                  {item.deskripsi}
                </p>

                {/* Period band (Bettr's "Duration:" strip) */}
                <p className="mt-4 rounded-[0.15rem] bg-coffee/10 px-3 py-1.5 text-[15px]">
                  <span className="font-medium">Periode:</span>{" "}
                  {formatDate(item.tanggal_mulai)} – {formatDate(item.tanggal_selesai)}
                </p>

                <div className="rule-dashed mt-5 text-coffee" aria-hidden="true" />

                {/* Footer */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[17px] font-medium">
                    <Clock className="h-4 w-4" />
                    {isEvent ? "Sabtu Malam" : "Sore & Hari Kerja"}
                  </span>
                  <a
                    href={isEvent ? "#lokasi" : "#menu"}
                    className="btn btn-earth btn-sm"
                  >
                    {isEvent ? "Ke Lokasi" : "Cek Menu"}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PromoSection;
