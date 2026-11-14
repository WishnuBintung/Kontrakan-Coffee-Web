"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, ChevronDown, ArrowUpRight } from "lucide-react";
import { getOpenStatusWIB } from "@/lib/cafeData";
import { useCafeInfo, useStoreStatus } from "@/hooks/useCafeData";

export function LocationSection() {
  const CAFE_INFO = useCafeInfo();
  const [isMounted, setIsMounted] = useState(false);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
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
  const currentDay = liveStatus.hariIni || storeStatus.todayName;

  return (
    <section
      id="lokasi"
      className="relative w-full bg-coffee px-4 py-20 text-cream sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] text-sunshine">
              Mampir, Yuk. Ini Lokasinya.
            </h2>
          </div>

          <p
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            className="max-w-md text-lg text-cream/85"
          >
            {CAFE_INFO.patokan
              ? `${CAFE_INFO.patokan}. Singgahlah untuk menikmati seduhan berkualitas, suasana tenang, dan ruang kolaboratif.`
              : `Berada di ${CAFE_INFO.alamat}. Singgahlah untuk menikmati seduhan berkualitas dan ruang kolaboratif.`}
          </p>
        </div>

        {/* 2-Column Layout: Left (Address & Jadwal Operasional), Right (Google Maps Embed) */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Left Column: Alamat Lengkap & Jadwal Operasional (6 cols) */}
          <div className="flex flex-col lg:col-span-6">
            <div
              id="jam-buka"
              data-ui="address-card"
              className="flex flex-col overflow-hidden rounded-[0.5rem] bg-roast"
            >
              {/* Main Address Card Info */}
              <div className="space-y-4 p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="tag">
                    <MapPin className="h-3.5 w-3.5" />
                    Alamat Lengkap
                  </span>
                  <span className="text-xs text-cream/60 sm:text-sm">
                    {CAFE_INFO.koordinat}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
                    {CAFE_INFO.nama}
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-cream/90 sm:text-lg">
                    {CAFE_INFO.alamat}
                  </p>
                  <p className="mt-2 text-sm font-medium text-sunshine sm:text-[15px]">
                    Patokan: {CAFE_INFO.patokan || "Dekat kampus UNNES"}
                  </p>
                </div>
              </div>

              {/* Jadwal Operasional Mingguan - Menempel langsung di bawah alamat tanpa sisa ruang */}
              <div data-ui="schedule-accordion" className="border-t border-cream/15">
                {/* Header Jadwal (Dropdown Toggle Button) */}
                <button
                  type="button"
                  onClick={() => setIsScheduleDropdownOpen(!isScheduleDropdownOpen)}
                  aria-expanded={isScheduleDropdownOpen}
                  aria-controls="weekly-schedule-panel"
                  className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-coffee/40 sm:p-5"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-sunshine" />
                    <span className="text-[14px] font-medium uppercase tracking-wide text-sunshine sm:text-[15px]">
                      Jadwal Operasional
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase text-cream/75 sm:text-sm">
                    <span>{isScheduleDropdownOpen ? "Tutup Jadwal" : "Lihat Jadwal 7 Hari"}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-sunshine transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isScheduleDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {/* Status Bar Ringkas */}
                <div data-ui="status-bar" className="flex items-center justify-between gap-3 border-t border-cream/10 bg-coffee/50 px-4 py-3 sm:px-5">
                  <p
                    suppressHydrationWarning
                    className="text-[13px] font-medium text-cream/90 sm:text-[14px]"
                  >
                    {isMounted ? statusText : "Buka setiap hari"}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        isOpen ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span
                      suppressHydrationWarning
                      className="text-[11px] font-bold uppercase tracking-wider text-cream/70"
                    >
                      {isMounted ? badgeText : "WIB"}
                    </span>
                  </div>
                </div>

                {/* 7-Day Schedule List dengan Animasi Smooth Accordion (Tertarik ke Bawah) */}
                <div
                  id="weekly-schedule-panel"
                  data-ui="schedule-accordion-content"
                  aria-hidden={!isScheduleDropdownOpen}
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    gridTemplateRows: isScheduleDropdownOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      data-ui="schedule-list"
                      className={`divide-y divide-cream/10 border-t border-cream/15 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isScheduleDropdownOpen
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-2 opacity-0 pointer-events-none"
                      }`}
                    >
                      {CAFE_INFO.jamBuka.map((item) => {
                        const isToday =
                          isMounted && item.hari.toLowerCase() === currentDay.toLowerCase();
                        return (
                          <div
                            key={item.hari}
                            className={`flex items-center justify-between gap-2 px-4 py-2.5 transition-colors sm:px-5 sm:py-3 ${
                              isToday ? "bg-sunshine text-coffee" : "hover:bg-coffee/40"
                            }`}
                          >
                            {/* Hari & Badge Hari Ini */}
                            <div className="flex items-center gap-2.5">
                              <span className="w-20 text-sm font-bold uppercase tracking-tight sm:text-base">
                                {item.hari}
                              </span>
                              {isToday && (
                                <span className="rounded-[0.2rem] bg-coffee px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sunshine">
                                  Hari Ini
                                </span>
                              )}
                            </div>

                            {/* Jam Buka / Tutup */}
                            <div className="text-right">
                              <span className="text-[14px] font-bold sm:text-[15px]">
                                {item.libur ? "LIBUR" : `${item.buka} – ${item.tutup}`}
                              </span>
                              <span
                                className={`mt-0.5 block text-[11px] leading-none ${
                                  isToday ? "text-coffee/70" : "text-cream/60"
                                }`}
                              >
                                {item.libur ? "Tutup" : "WIB"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Frame (6 cols) - Solid Always Visible */}
          <div
            data-ui="maps-column"
            className="flex h-[420px] min-h-[380px] flex-col sm:h-[480px] lg:col-span-6 lg:h-[580px]"
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[0.5rem] bg-roast">
              {/* Maps Frame Top Bar */}
              <div data-ui="maps-bar" className="flex items-center justify-between border-b border-cream/15 p-3.5 text-cream sm:p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-sunshine" />
                  <span className="text-[13px] font-medium uppercase tracking-wider">
                    Peta Lokasi
                  </span>
                </div>
                <a
                  href={CAFE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-wider text-sunshine transition-opacity hover:opacity-80"
                >
                  <span>Buka Google Maps</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Responsive Iframe Container */}
              <div className="relative min-h-[340px] w-full flex-1 bg-coffee">
                <iframe
                  title={`Peta Lokasi ${CAFE_INFO.nama}`}
                  src={CAFE_INFO.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale-[25%] contrast-[105%] transition-[filter] duration-500 hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
