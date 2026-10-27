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
        <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-12">
          {/* Left Column (6 cols) */}
          <div className="flex flex-col gap-2 lg:col-span-6">
            {/* Main Address Card */}
            <div
              data-rev
              style={{ "--d": "60ms" } as React.CSSProperties}
              className="space-y-5 rounded-[0.5rem] bg-roast p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="tag">
                  <MapPin className="h-4 w-4" />
                  Alamat Lengkap
                </span>
                <span className="text-sm text-cream/60">{CAFE_INFO.koordinat}</span>
              </div>

              <div>
                <h3 className="font-display text-4xl text-cream sm:text-5xl">
                  {CAFE_INFO.nama}
                </h3>
                <p className="mt-3 text-lg text-cream/90">{CAFE_INFO.alamat}</p>
                <p className="mt-2 text-[15px] text-sunshine">
                  Patokan: {CAFE_INFO.patokan || "Dekat kampus UNNES"}
                </p>
              </div>

              <a
                href={CAFE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn inline-flex"
              >
                Buka di Google Maps
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </a>
            </div>

            {/* Jadwal Operasional Mingguan */}
            <div
              id="jam-buka"
              data-rev
              style={{ "--d": "100ms" } as React.CSSProperties}
              className="flex flex-1 flex-col justify-between overflow-hidden rounded-[0.5rem] bg-roast"
            >
              {/* Header Jadwal */}
              <div className="flex items-center justify-between border-b border-cream/15 p-4 sm:p-5">
                <span className="inline-flex items-center gap-2 text-[15px] font-medium uppercase tracking-wide text-sunshine">
                  <Calendar className="h-4 w-4" />
                  Jadwal Operasional
                </span>
                <span className="text-sm uppercase text-cream/60">Senin – Minggu</span>
              </div>

              {/* Status Live Beacon Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream/15 bg-coffee/50 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                        isOpen ? "bg-sunshine" : "bg-earth"
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-3 w-3 rounded-full ${
                        isOpen ? "bg-sunshine" : "bg-earth"
                      }`}
                    />
                  </span>
                  <span
                    suppressHydrationWarning
                    className={`text-[13px] font-bold uppercase tracking-wider ${
                      isOpen ? "text-sunshine" : "text-earth"
                    }`}
                  >
                    {isMounted ? badgeText : "STATUS OPERASIONAL"}
                  </span>
                  <span suppressHydrationWarning className="text-[13px] text-cream/60">
                    {isMounted ? `(Pukul ${currentTime} WIB)` : "(Zona Waktu WIB)"}
                  </span>
                </div>
                <p
                  suppressHydrationWarning
                  className="text-[14px] font-medium text-cream/90"
                >
                  {isMounted ? statusText : "Buka setiap hari"}
                </p>
              </div>

              {/* 7-Day Schedule List */}
              <div className="flex-1 divide-y divide-cream/10">
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
                        <span className="w-20 text-base font-bold uppercase tracking-tight">
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
                        <span className="text-[15px] font-bold">
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

          {/* Right Column: Google Maps Interactive Frame (6 cols) */}
          <div
            data-rev
            style={{ "--d": "120ms" } as React.CSSProperties}
            className="flex min-h-[380px] flex-col sm:min-h-[460px] lg:col-span-6 lg:min-h-[580px]"
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[0.5rem] bg-roast">
              {/* Maps Frame Top Bar */}
              <div className="flex items-center justify-between border-b border-cream/15 p-3.5 text-cream sm:p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-sunshine" />
                  <span className="text-[13px] font-medium uppercase tracking-wider">
                    Peta Lokasi
                  </span>
                </div>
                <span className="text-[12px] uppercase text-cream/60">Tampilan interaktif</span>
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
                  className="h-full w-full grayscale-[25%] contrast-[105%] transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
