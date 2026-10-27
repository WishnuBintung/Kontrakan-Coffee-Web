"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Coffee, Wifi, Zap } from "lucide-react";
import { CAFE_INFO, getOpenStatusWIB } from "@/lib/cafeData";

export function HoursSection() {
  const [storeStatus, setStoreStatus] = useState(() => getOpenStatusWIB());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setStoreStatus(getOpenStatusWIB());

    // Update status every 30 seconds
    const timer = setInterval(() => {
      setStoreStatus(getOpenStatusWIB());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="jam-buka"
      className="w-full bg-[#5B6653] text-[#E8E3D9] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#4D5746]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[13px] sm:text-[14px] text-[#D99C5B] uppercase tracking-widest font-semibold">
                [03 // OPERATING SCHEDULE]
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[11px] bg-[#E8E3D9] text-[#1C1A18] font-bold uppercase tracking-wider sharp-edges">
                <Clock className="w-3 h-3" />
                <span>WIB TIMEZONE</span>
              </span>
            </div>
            <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#E8E3D9]">
              <span className="font-black">OPENING </span>
              <span className="font-thin italic">HOURS</span>
            </h2>
          </div>

          <p className="text-[15px] sm:text-[17px] text-[#E8E3D9]/80 font-sans max-w-md leading-relaxed">
            Buka setiap hari dari Senin hingga Minggu. Tempat tepat untuk seduhan kopi pagi, nugas produktif siang hari, hingga nongkrong santai larut malam.
          </p>
        </div>

        {/* Live Status Card: Pulsing Beacon Indicator */}
        <div className="mb-10 sm:mb-12 bg-[#4D5746] border border-[#5B6653] p-5 sm:p-7 sharp-edges shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Status Beacon Circle */}
            <div className="relative flex items-center justify-center shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75 ${
                  storeStatus.isOpen ? "bg-[#D99C5B]" : "bg-red-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-4 w-4 ${
                  storeStatus.isOpen ? "bg-[#D99C5B]" : "bg-red-500"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  suppressHydrationWarning
                  className="font-mono text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#D99C5B]"
                >
                  {isMounted ? storeStatus.badgeText : "STATUS OPERASIONAL"}
                </span>
                <span
                  suppressHydrationWarning
                  className="font-mono text-[12px] text-[#E8E3D9]/60"
                >
                  {isMounted
                    ? `(Pukul ${storeStatus.currentTimeStr} WIB)`
                    : "(Zona Waktu WIB)"}
                </span>
              </div>
              <p
                suppressHydrationWarning
                className="font-sans text-[15px] sm:text-[17px] text-[#E8E3D9] font-medium mt-0.5"
              >
                {isMounted
                  ? storeStatus.statusText
                  : "Buka setiap hari • Cek jadwal lengkap di bawah"}
              </p>
            </div>
          </div>

          <a
            href="#lokasi"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D99C5B] text-[#1C1A18] font-bold text-[13px] sm:text-[14px] uppercase tracking-tight hover:bg-[#C08343] transition-colors sharp-edges shrink-0"
          >
            <span>Petunjuk Arah Kafe</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Schedule Grid: Monday through Sunday */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 7-Day Schedule List (8 Columns) */}
          <div className="lg:col-span-8 bg-[#4D5746]/60 border border-[#4D5746] sharp-edges overflow-hidden shadow-lg">
            <div className="p-4 sm:p-5 bg-[#4D5746] border-b border-[#5B6653] flex items-center justify-between">
              <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#D99C5B] font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>JADWAL OPERASIONAL MINGGUAN</span>
              </span>
              <span className="font-mono text-[11px] sm:text-[12px] text-[#E8E3D9]/70 uppercase">
                SENIN – MINGGU
              </span>
            </div>

            <div className="divide-y divide-[#5B6653]">
              {CAFE_INFO.jamBuka.map((item) => {
                const isToday =
                  item.hari.toLowerCase() === storeStatus.todayName.toLowerCase();
                return (
                  <div
                    key={item.hari}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 transition-colors ${
                      isToday
                        ? "bg-[#5B6653] border-l-4 border-l-[#D99C5B]"
                        : "hover:bg-[#4D5746]/80"
                    }`}
                  >
                    {/* Day & Today Badge */}
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-black text-lg sm:text-xl uppercase tracking-[-0.02em] text-[#E8E3D9] w-24">
                        {item.hari}
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[#D99C5B] text-[#1C1A18] font-bold uppercase tracking-wider sharp-edges">
                          HARI INI
                        </span>
                      )}
                      {item.catatan && (
                        <span className="hidden md:inline font-mono text-[12px] text-[#E8E3D9]/60">
                          // {item.catatan}
                        </span>
                      )}
                    </div>

                    {/* Opening Hours & Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {item.catatan && (
                        <span className="md:hidden font-mono text-[11px] text-[#E8E3D9]/60">
                          {item.catatan}
                        </span>
                      )}
                      <div className="text-right">
                        <span
                          className={`font-mono text-[16px] sm:text-[18px] font-bold ${
                            isToday ? "text-[#D99C5B]" : "text-[#E8E3D9]"
                          }`}
                        >
                          {item.buka} – {item.tutup}
                        </span>
                        <span className="font-mono text-[11px] text-[#E8E3D9]/60 block">
                          WIB
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Roastery Notes & Facility Highlights (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Highlights Box */}
            <div className="bg-[#4D5746]/60 border border-[#4D5746] p-6 sharp-edges space-y-4">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[#D99C5B] block font-semibold">
                [STUDY & WFC SESSIONS]
              </span>
              <h3 className="font-sans font-black text-2xl uppercase tracking-[-0.02em] text-[#E8E3D9]">
                SUASANA PRODUKTIF & NYAMAN
              </h3>
              <p className="font-sans text-[14px] text-[#E8E3D9]/80 leading-relaxed">
                Didesain khusus untuk mahasiswa dan pekerja kreatif. Dapatkan ketenangan seduhan pagi dan suasana fokus tanpa gangguan.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D99C5B] text-[#1C1A18] flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[13px] font-bold text-[#E8E3D9] uppercase">
                      Wi-Fi 100 Mbps Stabil
                    </h4>
                    <p className="text-[12px] text-[#E8E3D9]/70 font-sans">
                      Lancar untuk Google Meet, upload tugas besar, dan browsing tanpa buffering.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D99C5B] text-[#1C1A18] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[13px] font-bold text-[#E8E3D9] uppercase">
                      Stopkontak Tersedia Penuh
                    </h4>
                    <p className="text-[12px] text-[#E8E3D9]/70 font-sans">
                      Colokan listrik ganda di meja komunal kayu panjang dan area sofa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D99C5B] text-[#1C1A18] flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[13px] font-bold text-[#E8E3D9] uppercase">
                      Last Order Kafe
                    </h4>
                    <p className="text-[12px] text-[#E8E3D9]/70 font-sans">
                      Pemesanan terakhir diterima 30 menit sebelum jam operasional tutup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Friday Note Card */}
            <div className="p-4 bg-[#5B6653] border-l-4 border-l-[#D99C5B] border border-[#4D5746] sharp-edges text-[13px] text-[#E8E3D9]/90 font-sans leading-relaxed">
              <strong className="text-[#D99C5B] font-semibold">Khusus Hari Jumat:</strong> Kafe buka mulai pukul 13:00 WIB setelah pelaksanaan ibadah Sholat Jumat, dan beroperasi hingga 23:30 WIB.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HoursSection;

