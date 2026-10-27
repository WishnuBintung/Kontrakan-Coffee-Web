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
      className="w-full bg-[#E8E3D9] text-[#1C1A18] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#D6CFC2]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <span className="font-mono text-[13px] sm:text-[14px] text-[#666158] uppercase tracking-widest block mb-3 font-semibold">
              [05 // VISIT ATELIER]
            </span>
            <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#1C1A18]">
              <span className="font-black">FIND US AT </span>
              <span className="font-thin italic">THE LOCATION</span>
            </h2>
          </div>

          <p className="text-[15px] sm:text-[17px] text-[#666158] font-sans max-w-md leading-relaxed">
            Berada di pusat denyut kreatif Seturan, Sleman, Yogyakarta. Singgahlah untuk menikmati seduhan berkualitas, suasana tenang, dan ruang kolaboratif.
          </p>
        </div>

        {/* 2-Column Layout: Left (Info & Actions), Right (Interactive Google Maps Embed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address, Quick Contact & Amenities (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Main Address Card */}
            <div className="bg-[#5B6653] text-[#E8E3D9] p-6 sm:p-8 border border-[#4D5746] sharp-edges shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#4D5746] pb-4">
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>ALAMAT LENGKAP KAFE</span>
                </span>
                <span className="font-mono text-[11px] text-[#E8E3D9]/70">
                  {CAFE_INFO.koordinat}
                </span>
              </div>

              <div>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#E8E3D9] uppercase tracking-tight">
                  {CAFE_INFO.nama}
                </h3>
                <p className="font-sans text-[16px] sm:text-[18px] text-[#E8E3D9]/90 mt-2 leading-relaxed">
                  {CAFE_INFO.alamat}
                </p>
                <p className="font-mono text-[13px] text-[#D99C5B] mt-2 leading-normal">
                  Patokan: {CAFE_INFO.patokan}
                </p>
              </div>

              {/* Action Buttons for Address */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#D99C5B] text-[#1C1A18] font-bold text-[14px] uppercase tracking-tight hover:bg-[#C08343] transition-colors sharp-edges shadow-md"
                >
                  <Navigation className="w-4 h-4 stroke-[2.5]" />
                  <span>Buka di Google Maps</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-[#E8E3D9]/40 text-[#E8E3D9] font-mono text-[12px] uppercase tracking-wider hover:bg-[#E8E3D9] hover:text-[#1C1A18] transition-colors sharp-edges"
                  aria-label="Salin alamat ke clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#D99C5B]" />
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
                href={`https://wa.me/${CAFE_INFO.whatsapp}?text=${encodeURIComponent(CAFE_INFO.whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                className="group p-5 bg-[#5B6653]/15 border border-[#5B6653] hover:border-[#D99C5B] hover:bg-[#5B6653]/25 transition-all sharp-edges flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] text-[#666158] uppercase tracking-widest block mb-2 font-bold">
                    [TANYA // WHATSAPP]
                  </span>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-[#5B6653] group-hover:text-[#D99C5B] transition-colors" />
                    <span className="font-sans font-bold text-[16px] text-[#1C1A18]">
                      {CAFE_INFO.whatsappDisplay}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#666158] mt-3 group-hover:text-[#D99C5B] flex items-center gap-1">
                  <span>Chat CS Kafe</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>

              {/* Instagram Card */}
              <a
                href={CAFE_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="group p-5 bg-[#5B6653]/15 border border-[#5B6653] hover:border-[#D99C5B] hover:bg-[#5B6653]/25 transition-all sharp-edges flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] text-[#666158] uppercase tracking-widest block mb-2 font-bold">
                    [VISUAL // INSTAGRAM]
                  </span>
                  <div className="flex items-center gap-2.5">
                    <InstagramIcon className="w-5 h-5 text-[#5B6653] group-hover:text-[#D99C5B] transition-colors" />
                    <span className="font-sans font-bold text-[16px] text-[#1C1A18]">
                      {CAFE_INFO.instagramHandle}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#666158] mt-3 group-hover:text-[#D99C5B] flex items-center gap-1">
                  <span>Lihat Update Story</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>

            {/* Facilities & Amenities Badges */}
            <div className="bg-[#5B6653]/10 border border-[#D6CFC2] p-5 sm:p-6 sharp-edges">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[#5B6653] block mb-3 font-bold">
                [FASILITAS // LOKASI KAFE]
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CAFE_INFO.fasilitas.map((f) => (
                  <div
                    key={f.title}
                    className="p-3 bg-[#E8E3D9] border border-[#D6CFC2] sharp-edges flex items-start gap-2.5"
                  >
                    <div className="text-[#5B6653] shrink-0 mt-0.5">
                      {getFacilityIcon(f.icon)}
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-[12px] sm:text-[13px] text-[#1C1A18] leading-snug">
                        {f.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Frame (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col min-h-[380px] sm:min-h-[460px] lg:min-h-[580px]">
            <div className="relative w-full h-full bg-[#5B6653] border border-[#4D5746] sharp-edges overflow-hidden shadow-2xl flex flex-col">
              {/* Maps Frame Top Bar */}
              <div className="p-3.5 sm:p-4 bg-[#5B6653] border-b border-[#4D5746] flex items-center justify-between text-[#E8E3D9]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D99C5B] inline-block" />
                  <span className="font-mono text-[12px] uppercase tracking-wider font-semibold">
                    GOOGLE MAPS LIVE EMBED
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#D99C5B]">
                  SETURAN • SLEMAN
                </span>
              </div>

              {/* Google Maps Iframe with client-only mounting & hydration suppression for browser extensions */}
              <div className="relative flex-1 w-full min-h-[340px] bg-[#4D5746]">
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
                  <div className="w-full h-full min-h-[340px] flex items-center justify-center bg-[#4D5746] text-[#E8E3D9]">
                    <div className="flex flex-col items-center gap-2">
                      <MapPin className="w-8 h-8 text-[#D99C5B] animate-pulse" />
                      <span className="font-mono text-[12px] uppercase tracking-wider text-[#E8E3D9]/80">
                        Memuat Peta Navigasi...
                      </span>
                    </div>
                  </div>
                )}

                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 left-4 bg-[#1C1A18]/90 text-[#E8E3D9] backdrop-blur-md p-3.5 border border-[#D99C5B]/40 sharp-edges shadow-xl pointer-events-none max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#D99C5B]" />
                    <span className="font-mono text-[11px] text-[#D99C5B] font-bold uppercase tracking-wider">
                      LOKASI RESMI
                    </span>
                  </div>
                  <h4 className="font-sans font-black text-[15px] uppercase text-[#E8E3D9]">
                    KONTRAKAN COFFEE
                  </h4>
                  <p className="text-[12px] text-[#E8E3D9]/80 font-sans mt-0.5">
                    Jl. Seturan Raya No. 45, Sleman
                  </p>
                </div>

                {/* Open in Google Maps Overlay Button */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={CAFE_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D99C5B] text-[#1C1A18] font-bold text-[12px] sm:text-[13px] uppercase tracking-tight hover:bg-[#C08343] transition-colors sharp-edges shadow-lg"
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
