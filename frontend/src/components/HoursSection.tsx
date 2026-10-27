"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, ArrowUpRight, Coffee, Wifi, Zap } from "lucide-react";
import { getOpenStatusWIB } from "@/lib/cafeData";
import { useStoreStatus, useCafeInfo } from "@/hooks/useCafeData";

export function HoursSection() {
  const localInitial = getOpenStatusWIB();
  const [storeStatus, setStoreStatus] = useState(localInitial);
  const [isMounted, setIsMounted] = useState(false);
  const { status: liveStatus } = useStoreStatus();
  const cafeInfo = useCafeInfo();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync storeStatus with live status from backend if available
  const isOpen = liveStatus.isOpen ?? storeStatus.isOpen;
  const badgeText = liveStatus.pesanStatus ? (liveStatus.isOpen ? "BUKA SEKARANG" : "SEDANG TUTUP") : storeStatus.badgeText;
  const statusText = liveStatus.pesanStatus || storeStatus.statusText;
  const currentTime = liveStatus.sekarangJam || storeStatus.currentTimeStr;
  const currentDay = liveStatus.hariIni || storeStatus.todayName;

  return (
    <section
      id="jam-buka"
      className="w-full bg-[#5F493C] text-[#EEE6D7] py-20 sm:py-28 px-4 sm:px-6 relative sharp-edges border-b border-[#472F1D]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div
            data-rev
            style={{ "--d": "40ms" } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[11px] bg-[#EEE6D7] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                <Clock className="w-3 h-3" />
                <span>WIB TIMEZONE</span>
              </span>
            </div>
            <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#EEE6D7]">
              <span className="font-black">OPENING </span>
              <span className="font-thin italic text-[#C7B8AE]">HOURS</span>
            </h2>
          </div>

          <p
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="text-[15px] sm:text-[17px] text-[#EEE6D7]/80 font-sans max-w-md leading-relaxed"
          >
            Buka setiap hari dari Senin hingga Minggu. Tempat tepat untuk seduhan kopi pagi, nugas produktif siang hari, hingga nongkrong santai larut malam.
          </p>
        </div>

        {/* Live Status Card: Pulsing Beacon Indicator */}
        <div
          data-rev
          style={{ "--d": "80ms" } as React.CSSProperties}
          className="mb-10 sm:mb-12 bg-[#472F1D] border border-[#5F493C] p-5 sm:p-7 sharp-edges shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            {/* Status Beacon Circle */}
            <div className="relative flex items-center justify-center shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75 ${
                  isOpen ? "bg-[#C7B8AE]" : "bg-[#5F493C]"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-4 w-4 ${
                  isOpen ? "bg-[#C7B8AE]" : "bg-[#5F493C]"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  suppressHydrationWarning
                  className="font-mono text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#C7B8AE]"
                >
                  {isMounted ? badgeText : "STATUS OPERASIONAL"}
                </span>
                <span
                  suppressHydrationWarning
                  className="font-mono text-[12px] text-[#EEE6D7]/60"
                >
                  {isMounted
                    ? `(Pukul ${currentTime} WIB)`
                    : "(Zona Waktu WIB)"}
                </span>
              </div>
              <p
                suppressHydrationWarning
                className="font-sans text-[15px] sm:text-[17px] text-[#EEE6D7] font-medium mt-0.5"
              >
                {isMounted
                  ? statusText
                  : "Buka setiap hari • Cek jadwal lengkap di bawah"}
              </p>
            </div>
          </div>

          <a
            href="#lokasi"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C7B8AE] text-[#472F1D] font-bold text-[13px] sm:text-[14px] uppercase tracking-tight hover:bg-[#EEE6D7] transition-colors sharp-edges shrink-0"
          >
            <span>Petunjuk Arah Kafe</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Schedule Grid: Monday through Sunday */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 7-Day Schedule List (8 Columns) */}
          <div className="lg:col-span-8 bg-[#472F1D]/60 border border-[#472F1D] sharp-edges overflow-hidden shadow-lg">
            <div className="p-4 sm:p-5 bg-[#472F1D] border-b border-[#5F493C] flex items-center justify-between">
              <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#C7B8AE] font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>JADWAL OPERASIONAL MINGGUAN</span>
              </span>
              <span className="font-mono text-[11px] sm:text-[12px] text-[#EEE6D7]/70 uppercase">
                SENIN – MINGGU
              </span>
            </div>

            <div className="divide-y divide-[#5F493C]">
              {cafeInfo.jamBuka.map((item, idx) => {
                const isToday =
                  isMounted &&
                  item.hari.toLowerCase() === currentDay.toLowerCase();
                return (
                  <div
                    key={item.hari}
                    data-rev
                    style={{ "--d": `${idx * 50}ms` } as React.CSSProperties}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 transition-colors ${
                      isToday
                        ? "bg-[#5F493C] border-l-4 border-l-[#C7B8AE]"
                        : "hover:bg-[#472F1D]/80"
                    }`}
                  >
                    {/* Day & Today Badge */}
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-black text-lg sm:text-xl uppercase tracking-[-0.02em] text-[#EEE6D7] w-24">
                        {item.hari}
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                          HARI INI
                        </span>
                      )}
                      {item.catatan && (
                        <span className="hidden md:inline font-mono text-[12px] text-[#EEE6D7]/60">
                          {item.catatan}
                        </span>
                      )}
                    </div>

                    {/* Opening Hours & Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {item.catatan && (
                        <span className="md:hidden font-mono text-[11px] text-[#EEE6D7]/60">
                          {item.catatan}
                        </span>
                      )}
                      <div className="text-right">
                        <span
                          className={`font-mono text-[16px] sm:text-[18px] font-bold ${
                            isToday ? "text-[#C7B8AE]" : "text-[#EEE6D7]"
                          }`}
                        >
                          {item.buka} – {item.tutup}
                        </span>
                        <span className="font-mono text-[11px] text-[#EEE6D7]/60 block">
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
            <div
              data-rev
              style={{ "--d": "120ms" } as React.CSSProperties}
              className="bg-[#472F1D]/60 border border-[#472F1D] p-6 sharp-edges space-y-4"
            >
              <h3 className="font-sans font-black text-2xl uppercase tracking-[-0.02em] text-[#EEE6D7]">
                SUASANA PRODUKTIF &amp; NYAMAN
              </h3>
              <p className="font-sans text-[14px] text-[#EEE6D7]/80 leading-relaxed">
                Didesain khusus untuk mahasiswa dan pekerja kreatif. Dapatkan ketenangan seduhan pagi dan suasana fokus tanpa gangguan.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C7B8AE] text-[#472F1D] flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[13px] font-bold text-[#EEE6D7] uppercase">
                      Wi-Fi 100 Mbps Stabil
                    </h4>
                    <p className="text-[12px] text-[#EEE6D7]/70 font-sans">
                      Lancar untuk Google Meet, upload tugas besar, dan browsing tanpa buffering.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C7B8AE] text-[#472F1D] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[13px] font-bold text-[#EEE6D7] uppercase">
                      Stopkontak Tersedia Penuh
                    </h4>
                    <p className="text-[12px] text-[#EEE6D7]/70 font-sans">
                      Colokan listrik ganda di meja komunal kayu panjang dan area sofa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C7B8AE] text-[#472F1D] flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[13px] font-bold text-[#EEE6D7] uppercase">
                      Last Order Kafe
                    </h4>
                    <p className="text-[12px] text-[#EEE6D7]/70 font-sans">
                      Pemesanan terakhir diterima 30 menit sebelum jam operasional tutup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Friday Note Card */}
            <div
              data-rev
              style={{ "--d": "180ms" } as React.CSSProperties}
              className="p-4 bg-[#5F493C] border-l-4 border-l-[#C7B8AE] border border-[#472F1D] sharp-edges text-[13px] text-[#EEE6D7]/90 font-sans leading-relaxed"
            >
              <strong className="text-[#C7B8AE] font-semibold">Khusus Hari Jumat:</strong> Kafe buka mulai pukul 13:00 WIB setelah pelaksanaan ibadah Sholat Jumat, dan beroperasi hingga 23:30 WIB.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HoursSection;
