"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export function ContactFooter() {
  return (
    <footer
      id="contact"
      className="w-full bg-[#5F493C] text-[#EEE6D7] py-16 sm:py-20 px-6 relative sharp-edges border-t border-[#472F1D]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Full-width Wordmark Closing Scene (.agents §8: "The footer is a designed close, not a sitemap") */}
        <div
          data-rev
          style={{ "--d": "40ms" } as React.CSSProperties}
          className="border-b border-[#472F1D] pb-10 md:pb-14 mb-12 md:mb-16"
        >
          <span className="block font-sans font-black text-[9vw] md:text-[9.5vw] leading-none text-[#EEE6D7] uppercase tracking-[-0.03em] select-none">
            KONTRAKAN COFFEE
          </span>
        </div>

        {/* 2-Column Balanced Flank Layout (.agents §5: Equal margins, balanced left & right flanks) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 lg:gap-16">
          {/* Kolom Kiri: Link Media Sosial & Kanal Digital */}
          <div
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="flex flex-col space-y-3"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C7B8AE] font-semibold">
              MEDIA SOSIAL
            </span>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a
                  href="https://www.instagram.com/kontrakan.coffee?dlrf=aHpsbXB6ajE4dmQ3"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[16px] sm:text-[17px] font-medium tracking-tight text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors"
                >
                  <span>Instagram (@kontrakan.coffee)</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C7B8AE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[16px] sm:text-[17px] font-medium tracking-tight text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors"
                >
                  <span>WhatsApp Direct Chat</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C7B8AE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Kontrakan+Coffee+Yogyakarta"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[16px] sm:text-[17px] font-medium tracking-tight text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors"
                >
                  <span>Google Maps Navigation</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C7B8AE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom Kanan (Desktop: Kanan): Alamat Lengkap & Kalimat © 2026 KONTRAKAN COFFEE */}
          <div
            data-rev
            style={{ "--d": "150ms" } as React.CSSProperties}
            className="flex flex-col md:text-right md:items-end space-y-4"
          >
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C7B8AE] font-semibold block">
                ALAMAT LENGKAP
              </span>
              <p className="font-sans text-[15px] sm:text-[16px] text-[#EEE6D7]/90 leading-relaxed max-w-sm md:ml-auto">
                Jl. Seturan Raya No. 45, Caturtunggal, Depok, Sleman, D.I. Yogyakarta 55281
              </p>
            </div>

            <div className="font-mono text-[12px] sm:text-[13px] text-[#EEE6D7]/65 tracking-wider pt-3 border-t border-[#472F1D] md:border-t-0 md:pt-0">
              © 2026 KONTRAKAN COFFEE
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ContactFooter;
