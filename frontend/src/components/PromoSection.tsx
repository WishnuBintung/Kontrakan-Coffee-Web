"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Sparkles, Tag, Calendar, Clock, ArrowRight } from "lucide-react";
import { usePromoData } from "@/hooks/useCafeData";

export function PromoSection() {
  const promos = usePromoData();

  return (
    <section
      id="promo"
      className="w-full bg-[#EEE6D7] text-[#472F1D] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-t border-b border-[#C7B8AE]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                <Sparkles className="w-3 h-3" />
                <span>PENAWARAN & AGENDA</span>
              </span>
            </div>
            <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#472F1D]">
              <span className="font-black">SPECIAL </span>
              <span className="font-thin italic text-[#5F493C]">OFFERS</span>
            </h2>
          </div>

          <p
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="text-[15px] sm:text-[17px] text-[#5F493C] font-sans max-w-md leading-relaxed"
          >
            Nikmati diskon kopi sore hari, paket nongkrong hemat pelajar &amp; mahasiswa, serta agenda musik akustik santai di Kontrakan Coffee.
          </p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {promos.map((item, idx) => {
            const isEvent = item.tipe === "kegiatan";
            return (
              <div
                key={item.id}
                data-rev
                style={{ "--d": `${idx * 70}ms` } as React.CSSProperties}
                className="group relative bg-[#5F493C] border border-[#472F1D] overflow-hidden sharp-edges flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-[#C7B8AE]"
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#472F1D]">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />

                  {/* Top-Left Type Badge */}
                  <div className="absolute top-3 left-3">
                    {isEvent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest bg-[#C7B8AE] text-[#472F1D] sharp-edges shadow-md">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>AGENDA ACARA</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest bg-[#472F1D]/90 backdrop-blur-sm text-[#EEE6D7] border border-[#C7B8AE]/40 sharp-edges shadow-md">
                        <Tag className="w-3.5 h-3.5 text-[#C7B8AE]" />
                        <span>PROMO HEMAT</span>
                      </span>
                    )}
                  </div>

                  {/* Top-Right Status Badge */}
                  <div className="absolute top-3 right-3 bg-[#472F1D]/85 backdrop-blur-sm text-[#C7B8AE] font-mono text-[10px] font-bold px-2 py-0.5 sharp-edges border border-[#C7B8AE]/30 uppercase tracking-wider">
                    BERLAKU AKTIF
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 bg-[#5F493C] flex-1 flex flex-col justify-between border-t border-[#472F1D]">
                  <div>
                    <h3 className="font-sans font-black text-xl sm:text-2xl text-[#EEE6D7] uppercase tracking-[-0.02em] group-hover:text-[#C7B8AE] transition-colors duration-300 leading-snug">
                      {item.judul}
                    </h3>
                    <p className="font-sans text-[13px] sm:text-[14px] text-[#EEE6D7]/80 mt-2.5 line-clamp-3 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Card Action Row */}
                  <div className="mt-6 pt-4 border-t border-[#472F1D] flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] text-[#C7B8AE] uppercase tracking-wider inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C7B8AE]" />
                      <span>{isEvent ? "Sabtu Malam" : "Sore & Hari Kerja"}</span>
                    </span>

                    <a
                      href={isEvent ? "#lokasi" : "#menu"}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider bg-[#C7B8AE] text-[#472F1D] hover:bg-[#EEE6D7] transition-colors sharp-edges shrink-0"
                    >
                      <span>{isEvent ? "Ke Lokasi" : "Cek Menu"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PromoSection;

