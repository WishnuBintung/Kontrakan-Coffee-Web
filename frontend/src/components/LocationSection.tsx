"use client";

import React, { useState } from "react";
import {
  MapPin,
  ArrowUpRight,
  Copy,
  Check,
  MessageCircle,
  Navigation,
  Wifi,
  Plug,
  Wind,
  Trees,
  Car,
  Sparkles,
} from "lucide-react";
import { CAFE_INFO } from "@/lib/cafeData";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function LocationSection() {
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CAFE_INFO.alamat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "plug":
        return <Plug className="w-4 h-4" />;
      case "wind":
        return <Wind className="w-4 h-4" />;
      case "trees":
        return <Trees className="w-4 h-4" />;
      case "car":
        return <Car className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="lokasi"
      className="w-full bg-[#EEE6D7] text-[#472F1D] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#C7B8AE]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#472F1D]">
              <span className="font-black">FIND US AT </span>
              <span className="font-thin italic text-[#5F493C]">THE LOCATION</span>
            </h2>
          </div>

          <p className="text-[15px] sm:text-[17px] text-[#5F493C] font-sans max-w-md leading-relaxed">
            Berada di pusat denyut kreatif Seturan, Sleman, Yogyakarta. Singgahlah untuk menikmati seduhan berkualitas, suasana tenang, dan ruang kolaboratif.
          </p>
        </div>

        {/* 2-Column Layout: Left (Info & Actions), Right (Interactive Google Maps Embed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address, Quick Contact & Amenities (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Main Address Card */}
            <div
              data-rev
              style={{ "--d": "60ms" } as React.CSSProperties}
              className="bg-[#5F493C] text-[#EEE6D7] p-6 sm:p-8 border border-[#472F1D] sharp-edges shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#472F1D] pb-4">
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#C7B8AE] font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>ALAMAT LENGKAP KAFE</span>
                </span>
                <span className="font-mono text-[11px] text-[#EEE6D7]/70">
                  {CAFE_INFO.koordinat}
                </span>
              </div>

              <div>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#EEE6D7] uppercase tracking-tight">
                  {CAFE_INFO.nama}
                </h3>
                <p className="font-sans text-[16px] sm:text-[18px] text-[#EEE6D7]/90 mt-2 leading-relaxed">
                  {CAFE_INFO.alamat}
                </p>
                <p className="font-mono text-[13px] text-[#C7B8AE] mt-2 leading-normal">
                  Patokan: {CAFE_INFO.patokan}
                </p>
              </div>

              {/* Action Buttons for Address */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#C7B8AE] text-[#472F1D] font-bold text-[14px] uppercase tracking-tight hover:bg-[#EEE6D7] transition-colors sharp-edges shadow-md"
                >
                  <Navigation className="w-4 h-4 stroke-[2.5]" />
                  <span>Buka di Google Maps</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-[#EEE6D7]/40 text-[#EEE6D7] font-mono text-[12px] uppercase tracking-wider hover:bg-[#EEE6D7] hover:text-[#472F1D] transition-colors sharp-edges"
                  aria-label="Salin alamat ke clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#C7B8AE]" />
                      <span>Alamat Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Contact Links: WhatsApp & Instagram (Informational only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <a
                data-rev
                style={{ "--d": "110ms" } as React.CSSProperties}
                href={`https://wa.me/${CAFE_INFO.whatsapp}?text=${encodeURIComponent(CAFE_INFO.whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                className="group p-5 bg-[#5F493C]/10 border border-[#5F493C] hover:border-[#472F1D] hover:bg-[#5F493C]/20 transition-all sharp-edges flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] text-[#5F493C] uppercase tracking-widest block mb-2 font-bold">
                    WHATSAPP
                  </span>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-[#5F493C] group-hover:text-[#472F1D] transition-colors" />
                    <span className="font-sans font-bold text-[16px] text-[#472F1D]">
                      {CAFE_INFO.whatsappDisplay}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#5F493C] mt-3 group-hover:text-[#472F1D] flex items-center gap-1">
                  <span>Chat CS Kafe</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>

              {/* Instagram Card */}
              <a
                data-rev
                style={{ "--d": "160ms" } as React.CSSProperties}
                href={CAFE_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="group p-5 bg-[#5F493C]/10 border border-[#5F493C] hover:border-[#472F1D] hover:bg-[#5F493C]/20 transition-all sharp-edges flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] text-[#5F493C] uppercase tracking-widest block mb-2 font-bold">
                    INSTAGRAM
                  </span>
                  <div className="flex items-center gap-2.5">
                    <InstagramIcon className="w-5 h-5 text-[#5F493C] group-hover:text-[#472F1D] transition-colors" />
                    <span className="font-sans font-bold text-[16px] text-[#472F1D]">
                      {CAFE_INFO.instagramHandle}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#5F493C] mt-3 group-hover:text-[#472F1D] flex items-center gap-1">
                  <span>Lihat Update Story</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>

            {/* Facilities & Amenities Badges */}
            <div
              data-rev
              style={{ "--d": "210ms" } as React.CSSProperties}
              className="bg-[#5F493C]/10 border border-[#C7B8AE] p-5 sm:p-6 sharp-edges"
            >
              <span className="font-mono text-[12px] uppercase tracking-widest text-[#5F493C] block mb-3 font-bold">
                FASILITAS LOKASI KAFE
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CAFE_INFO.fasilitas.map((f) => (
                  <div
                    key={f.title}
                    className="p-3 bg-[#EEE6D7] border border-[#C7B8AE] sharp-edges flex items-start gap-2.5"
                  >
                    <div className="text-[#5F493C] shrink-0 mt-0.5">
                      {getFacilityIcon(f.icon)}
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-[12px] sm:text-[13px] text-[#472F1D] leading-snug">
                        {f.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Frame (6 Cols) */}
          <div
            data-rev
            style={{ "--d": "120ms" } as React.CSSProperties}
            className="lg:col-span-6 flex flex-col min-h-[380px] sm:min-h-[460px] lg:min-h-[580px]"
          >
            <div className="relative w-full h-full bg-[#5F493C] border border-[#472F1D] sharp-edges overflow-hidden shadow-2xl flex flex-col">
              {/* Maps Frame Top Bar */}
              <div className="p-3.5 sm:p-4 bg-[#5F493C] border-b border-[#472F1D] flex items-center justify-between text-[#EEE6D7]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C7B8AE] inline-block" />
                  <span className="font-mono text-[12px] uppercase tracking-wider font-semibold">
                    GOOGLE MAPS LIVE EMBED
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#C7B8AE]">
                  SETURAN • SLEMAN
                </span>
              </div>

              {/* Google Maps Iframe */}
              <div className="relative flex-1 w-full min-h-[340px] bg-[#472F1D]">
                {isMounted ? (
                  <iframe
                    title="Lokasi Kontrakan Coffee Yogyakarta"
                    src={CAFE_INFO.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "340px" }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    suppressHydrationWarning
                    className="w-full h-full grayscale contrast-110 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full min-h-[340px] flex items-center justify-center bg-[#472F1D] text-[#EEE6D7]">
                    <div className="flex flex-col items-center gap-2">
                      <MapPin className="w-8 h-8 text-[#C7B8AE] animate-pulse" />
                      <span className="font-mono text-[12px] uppercase tracking-wider text-[#EEE6D7]/80">
                        Memuat Peta Navigasi...
                      </span>
                    </div>
                  </div>
                )}

                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 left-4 bg-[#472F1D]/90 text-[#EEE6D7] backdrop-blur-md p-3.5 border border-[#C7B8AE]/40 sharp-edges shadow-xl pointer-events-none max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#C7B8AE]" />
                    <span className="font-mono text-[11px] text-[#C7B8AE] font-bold uppercase tracking-wider">
                      LOKASI RESMI
                    </span>
                  </div>
                  <h4 className="font-sans font-black text-[15px] uppercase text-[#EEE6D7]">
                    KONTRAKAN COFFEE
                  </h4>
                  <p className="text-[12px] text-[#EEE6D7]/80 font-sans mt-0.5">
                    Jl. Seturan Raya No. 45, Sleman
                  </p>
                </div>

                {/* Open in Google Maps Overlay Button */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={CAFE_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C7B8AE] text-[#472F1D] font-bold text-[12px] sm:text-[13px] uppercase tracking-tight hover:bg-[#EEE6D7] transition-colors sharp-edges shadow-lg"
                  >
                    <span>Rute Google Maps</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocationSection;
