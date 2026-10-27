"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useCafeInfo } from "@/hooks/useCafeData";

export function ContactFooter() {
  const CAFE_INFO = useCafeInfo();

  const igUrl =
    CAFE_INFO.instagram ||
    "https://www.instagram.com/kontrakan.coffee?dlrf=aHpsbXB6ajE4dmQ3";
  const igHandle = CAFE_INFO.instagramHandle || "@kontrakan.coffee";
  const waUrl = CAFE_INFO.whatsapp
    ? `https://wa.me/${CAFE_INFO.whatsapp.replace(/\D/g, "")}`
    : "https://wa.me/6281234567890";
  const tiktokUrl =
    CAFE_INFO.tiktok ||
    "https://www.tiktok.com/@kontrakancoffee?_r=1&_t=ZS-9AubeEe0g5M";
  const mapsUrl =
    CAFE_INFO.googleMapsUrl ||
    "https://maps.app.goo.gl/7kn5wi3aeE15r61T9?g_st=ic";
  const addressText =
    CAFE_INFO.alamat ||
    "Jl. Nyai Ketrik, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229";

  return (
    <footer
      id="contact"
      className="w-full bg-[#5F493C] text-[#EEE6D7] py-16 sm:py-20 px-6 relative sharp-edges border-t border-[#472F1D]"
    >
      <div className="max-w-7xl mx-auto">
        {/* 2-Column Balanced Flank Layout (.agents §5) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 lg:gap-16">
          {/* Kolom Kiri: Link Media Sosial Dinamis dari CMS (Instagram, WhatsApp, TikTok) */}
          <div
            data-rev
            style={{ "--d": "40ms" } as React.CSSProperties}
            className="flex flex-col space-y-3"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C7B8AE] font-semibold">
              MEDIA SOSIAL
            </span>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[16px] sm:text-[17px] font-medium tracking-tight text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors"
                >
                  <span>Instagram ({igHandle})</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C7B8AE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href={waUrl}
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
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[16px] sm:text-[17px] font-medium tracking-tight text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors"
                >
                  <span>TikTok (@kontrakancoffee)</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C7B8AE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom Kanan (Desktop: Kanan): Alamat Lengkap Dinamis & Kalimat © 2026 KONTRAKAN COFFEE */}
          <div
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="flex flex-col md:text-right md:items-end space-y-4"
          >
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C7B8AE] font-semibold block">
                ALAMAT LENGKAP
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group block font-sans text-[15px] sm:text-[16px] text-[#EEE6D7]/90 hover:text-[#C7B8AE] transition-colors leading-relaxed max-w-sm md:ml-auto"
                title="Buka lokasi di Google Maps"
              >
                <span>{addressText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 inline-block ml-1 text-[#C7B8AE] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
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
