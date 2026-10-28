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

  const navLinks = [
    { label: "Promo", href: "#promo" },
    { label: "Menu", href: "#menu" },
    { label: "Fasilitas", href: "#fasilitas" },
    { label: "Galeri", href: "#galeri" },
    { label: "Jam Buka & Lokasi", href: "#lokasi" },
  ];

  const socialLinks = [
    { label: `Instagram (${igHandle})`, href: igUrl },
    { label: "WhatsApp Direct Chat", href: waUrl },
    { label: "TikTok (@kontrakancoffee)", href: tiktokUrl },
  ];

  const linkClass =
    "group inline-flex items-center gap-1.5 text-[17px] font-medium transition-colors text-cream/85 hover:text-latte";
  const arrowClass =
    "h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

  return (
    <footer
      id="contact"
      className="relative w-full bg-coffee px-4 pb-8 pt-16 text-cream sm:px-6 sm:pt-24"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Navigation & Contact Columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-cream/20">
          {/* Brand Bio */}
          <div data-rev style={{ "--d": "30ms" } as React.CSSProperties}>
            <span className="font-display block text-3xl mb-3 text-cream">
              Kontrakan Coffee
            </span>
            <p className="text-[16px] leading-relaxed text-cream/80">
              Ruang seduh, nongkrong, dan kerja produktif di kawasan Sekaran, Gunungpati, Semarang. Kopi enak, Wi-Fi 100 Mbps, dan suasana tenang.
            </p>
          </div>

          {/* Jelajahi */}
          <div
            data-rev
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-latte">
              Jelajahi
            </h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Media sosial */}
          <div
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
          >
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-latte">
              Media Sosial
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                    <span>{l.label}</span>
                    <ArrowUpRight className={arrowClass} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Alamat */}
          <div
            data-rev
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-latte">
              Alamat Lengkap
            </h3>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              title="Buka lokasi di Google Maps"
              className="group block text-[16px] leading-relaxed transition-colors text-cream/85 hover:text-latte"
            >
              <span>{addressText}</span>
              <ArrowUpRight className={`ml-1 inline-block ${arrowClass}`} />
            </a>
          </div>
        </div>

        {/* Monumental Brand Display Wordmark */}
        <div
          data-rev
          style={{ "--d": "160ms" } as React.CSSProperties}
          className="pt-10 pb-6 overflow-hidden"
        >
          <a
            href="#"
            aria-label="Kembali ke atas"
            className="group block w-full text-center no-underline"
          >
            <span className="font-display block text-[clamp(3.8rem,14.5vw,13rem)] uppercase leading-none tracking-tight text-cream transition-colors duration-300 group-hover:text-latte">
              Kontrakan
            </span>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-base font-bold uppercase tracking-[0.35em] text-cream/70">
              <span>Kopi Spesialti</span>
              <span className="hidden sm:inline">•</span>
              <span>Sekaran, Gn. Pati</span>
              <span className="hidden sm:inline">•</span>
              <span>Kota Semarang</span>
            </div>
          </a>
        </div>

        <div className="rule-dashed mt-6 text-cream/30" aria-hidden="true" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-[15px] sm:flex-row sm:items-center text-cream/70">
          <span>© 2026 Kontrakan Coffee. Seluruh hak cipta dilindungi.</span>
          <a href="#" className="btn btn-outline-cream btn-sm">
            Kembali ke atas
          </a>
        </div>
      </div>
    </footer>
  );
}

export default ContactFooter;
