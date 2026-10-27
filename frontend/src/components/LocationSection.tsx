"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { getOpenStatusWIB } from "@/lib/cafeData";
import { useCafeInfo, useStoreStatus } from "@/hooks/useCafeData";

export function LocationSection() {
  const CAFE_INFO = useCafeInfo();
  const [isMounted, setIsMounted] = useState(false);
  const localInitial = getOpenStatusWIB();
  const [storeStatus] = useState(localInitial);
  const { status: liveStatus } = useStoreStatus();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isOpen = liveStatus.isOpen ?? storeStatus.isOpen;
  const badgeText = liveStatus.pesanStatus
    ? liveStatus.isOpen
      ? "BUKA SEKARANG"
      : "SEDANG TUTUP"
    : storeStatus.badgeText;
  const statusText = liveStatus.pesanStatus || storeStatus.statusText;
  const currentTime = liveStatus.sekarangJam || storeStatus.currentTimeStr;
  const currentDay = liveStatus.hariIni || storeStatus.todayName;

  return (
    <section
      id="lokasi"
      className="w-full bg-[#EEE6D7] text-[#472F1D] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#C7B8AE]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div
            data-rev
            style={{ "--d": "40ms" } as React.CSSProperties}
          >
            <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#472F1D]">
              <span className="font-black">FIND US AT </span>
              <span className="font-thin italic text-[#5F493C]">THE LOCATION</span>
            </h2>
          </div>

          <p
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="text-[15px] sm:text-[17px] text-[#5F493C] font-sans max-w-md leading-relaxed"
          >
            {CAFE_INFO.patokan
              ? `${CAFE_INFO.patokan}. Singgahlah untuk menikmati seduhan berkualitas, suasana tenang, dan ruang kolaboratif.`
              : `Berada di ${CAFE_INFO.alamat}. Singgahlah untuk menikmati seduhan berkualitas dan ruang kolaboratif.`}
          </p>
        </div>

        {/* 2-Column Layout: Left (Address & Jadwal Operasional), Right (Interactive Google Maps Embed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address Card & Jadwal Operasional (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Main Address Card */}
            <div
              data-rev
              style={{ "--d": "60ms" } as React.CSSProperties}
              className="bg-[#5F493C] text-[#EEE6D7] p-6 sm:p-7 border border-[#472F1D] sharp-edges shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#472F1D] pb-3">
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
                <p className="font-sans text-[15px] sm:text-[17px] text-[#EEE6D7]/90 mt-2 leading-relaxed">
                  {CAFE_INFO.alamat}
                </p>
                <p className="font-mono text-[12px] text-[#C7B8AE] mt-2 leading-normal">
                  Patokan: {CAFE_INFO.patokan || "Dekat kampus UNNES"}
                </p>
              </div>
            </div>

            {/* Jadwal Operasional Mingguan — Menggantikan kontak & fasilitas sesuai permintaan */}
            <div
              id="jam-buka"
              data-rev
              style={{ "--d": "100ms" } as React.CSSProperties}
              className="bg-[#5F493C] text-[#EEE6D7] border border-[#472F1D] sharp-edges shadow-xl overflow-hidden flex-1 flex flex-col justify-between"
            >
              {/* Header Jadwal */}
              <div className="p-4 sm:p-5 bg-[#472F1D] border-b border-[#5F493C] flex items-center justify-between">
                <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#C7B8AE] font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>JADWAL OPERASIONAL MINGGUAN</span>
                </span>
                <span className="font-mono text-[11px] sm:text-[12px] text-[#EEE6D7]/70 uppercase">
                  SENIN – MINGGU
                </span>
              </div>

              {/* Status Live Beacon Bar */}
              <div className="px-4 sm:px-5 py-3 bg-[#472F1D]/70 border-b border-[#5F493C] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isOpen ? "bg-[#C7B8AE]" : "bg-[#5F493C]"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        isOpen ? "bg-[#C7B8AE]" : "bg-[#5F493C]"
                      }`}
                    />
                  </span>
                  <span
                    suppressHydrationWarning
                    className="font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#C7B8AE]"
                  >
                    {isMounted ? badgeText : "STATUS OPERASIONAL"}
                  </span>
                  <span
                    suppressHydrationWarning
                    className="font-mono text-[11px] text-[#EEE6D7]/60"
                  >
                    {isMounted ? `(Pukul ${currentTime} WIB)` : "(Zona Waktu WIB)"}
                  </span>
                </div>
                <p
                  suppressHydrationWarning
                  className="font-sans text-[12px] sm:text-[13px] text-[#EEE6D7]/90 font-medium"
                >
                  {isMounted ? statusText : "Buka setiap hari"}
                </p>
              </div>

              {/* 7-Day Schedule List */}
              <div className="divide-y divide-[#472F1D] flex-1">
                {CAFE_INFO.jamBuka.map((item, idx) => {
                  const isToday =
                    isMounted &&
                    item.hari.toLowerCase() === currentDay.toLowerCase();
                  return (
                    <div
                      key={item.hari}
                      className={`px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 transition-colors ${
                        isToday
                          ? "bg-[#472F1D] border-l-4 border-l-[#C7B8AE]"
                          : "hover:bg-[#472F1D]/40"
                      }`}
                    >
                      {/* Hari & Badge Hari Ini */}
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans font-black text-sm sm:text-base uppercase tracking-[-0.01em] text-[#EEE6D7] w-20">
                          {item.hari}
                        </span>
                        {isToday && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                            HARI INI
                          </span>
                        )}
                      </div>

                      {/* Jam Buka / Tutup */}
                      <div className="text-right">
                        <span
                          className={`font-mono text-[13px] sm:text-[15px] font-bold ${
                            isToday ? "text-[#C7B8AE]" : "text-[#EEE6D7]"
                          }`}
                        >
                          {item.libur ? "LIBUR" : `${item.buka} – ${item.tutup}`}
                        </span>
                        <span className="font-mono text-[10px] text-[#EEE6D7]/60 block leading-none mt-0.5">
                          {item.libur ? "Tutup" : "WIB"}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                <span className="font-mono text-[11px] text-[#EEE6D7]/60">
                  INTERACTIVE VIEW
                </span>
              </div>

              {/* Responsive Iframe Container */}
              <div className="relative flex-1 w-full min-h-[340px] bg-[#472F1D]">
                <iframe
                  title={`Peta Lokasi ${CAFE_INFO.nama}`}
                  src={CAFE_INFO.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[25%] contrast-[105%] hover:grayscale-0 transition-all duration-500"
                />

                {/* Pin Location Overlay Chip */}
                <div className="absolute top-4 left-4 bg-[#5F493C]/90 backdrop-blur-md text-[#EEE6D7] px-3.5 py-1.5 text-[11px] sm:text-[12px] font-mono border border-[#472F1D] sharp-edges shadow-lg flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C7B8AE]" />
                  <span className="font-bold">{CAFE_INFO.alamat ? CAFE_INFO.alamat.split(",").slice(1, 3).join(",").trim() || CAFE_INFO.alamat.split(",")[0] : "Sekaran, Gunungpati, Semarang"}</span>
                </div>

                {/* Bottom Navigation Button Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 p-3.5 bg-[#472F1D]/90 backdrop-blur-md border border-[#5F493C] sharp-edges">
                  <span className="font-mono text-[12px] text-[#EEE6D7] truncate">
                    Klik untuk navigasi rute langsung
                  </span>
                  <a
                    href={CAFE_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C7B8AE] text-[#472F1D] font-mono text-[11px] font-bold uppercase tracking-wider sharp-edges shrink-0 hover:bg-[#EEE6D7] transition-colors"
                  >
                    <span>Google Maps</span>
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
