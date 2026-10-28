"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  RefreshCw,
  Tag,
} from "lucide-react";
import { usePromoData } from "@/hooks/useCafeData";

/**
 * Format tanggal berakhir: hari, tanggal, dan bulan saja (Bahasa Indonesia).
 * Format UTC agar output di server dan klien selalu sinkron tanpa timezone shift.
 * Contoh input: "2026-12-31" → Output: "Kamis, 31 Desember"
 */
function formatEndDate(iso?: string): string {
  if (!iso) return "-";
  const cleanIso = String(iso).trim().split("T")[0];
  const d = new Date(`${cleanIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;

  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export function PromoSection() {
  const { promos, status, refetch } = usePromoData();

  const isSingle = promos.length === 1;

  return (
    <section
      id="promo"
      className="relative w-full bg-cream px-4 pb-20 pt-10 text-coffee sm:px-6 sm:pb-28 sm:pt-16"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <div data-rev style={{ "--d": "40ms" } as React.CSSProperties}>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)]">
              Promo &amp; Agenda Spesial.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-coffee/80">
              Diskon kopi sore hari, paket nongkrong hemat pelajar &amp;
              mahasiswa, serta agenda musik akustik santai di Kontrakan Coffee.
            </p>
          </div>
          <a
            data-rev
            style={{ "--d": "90ms" } as React.CSSProperties}
            href="#menu"
            className="btn self-start md:self-auto"
          >
            Lihat Semua Menu
          </a>
        </div>

        {/* State 1: Sedang Memuat Data */}
        {status === "loading" && (
          <div
            data-rev
            className="flex min-h-[220px] w-full items-center justify-center rounded-[0.25rem] border border-coffee/10 bg-latte/20 p-8 text-center text-coffee/60"
          >
            <div className="inline-flex items-center gap-3 text-[17px] font-medium">
              <Loader2 className="h-5 w-5 animate-spin text-coffee/70" />
              <span>Memuat agenda &amp; promo terbaru...</span>
            </div>
          </div>
        )}

        {/* State 2: CMS Tidak Terhubung / Gagal Koneksi (Error) */}
        {status === "error" && (
          <div
            data-rev
            className="flex w-full flex-col items-center justify-center rounded-[0.25rem] border border-coffee/20 bg-cream-surface px-6 py-12 text-center text-coffee sm:px-10 sm:py-16"
          >
            <div className="mx-auto max-w-lg space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-coffee/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-coffee">
                <AlertCircle className="h-4 w-4" />
                <span>Koneksi CMS Terputus</span>
              </div>
              <h3 className="font-display text-[clamp(2rem,3.2vw,2.8rem)] text-coffee">
                Data Tidak Dapat Ditemukan
              </h3>
              <p className="text-[17px] leading-relaxed text-coffee/80 sm:text-lg">
                Sistem tidak dapat terhubung ke server CMS untuk memuat informasi promo. Pastikan server backend sedang aktif atau coba muat ulang halaman.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="btn btn-earth inline-flex cursor-pointer items-center gap-2 px-6 py-2.5"
                >
                  <RefreshCw className="h-4 w-4" />
                  Coba Muat Ulang
                </button>
                <a
                  href="#menu"
                  className="btn inline-flex items-center gap-2 px-6 py-2.5"
                >
                  Lihat Semua Menu
                </a>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Terhubung ke CMS tetapi Promo Kosong (Array === 0) */}
        {status === "empty" && (
          <div
            data-rev
            className="flex w-full flex-col items-center justify-center rounded-[0.25rem] border border-coffee/15 bg-latte/30 px-6 py-12 text-center text-coffee sm:px-10 sm:py-16"
          >
            <div className="mx-auto max-w-lg space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-coffee/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-coffee">
                <Tag className="h-4 w-4" />
                <span>Informasi Promo</span>
              </div>
              <h3 className="font-display text-[clamp(2rem,3.2vw,2.8rem)] text-coffee">
                Promo Tidak Tersedia
              </h3>
              <p className="text-[17px] leading-relaxed text-coffee/80 sm:text-lg">
                Saat ini belum terdapat promo atau agenda kegiatan yang sedang berlangsung di Kontrakan Coffee. Seluruh seduhan reguler dan menu andalan tetap dapat Anda nikmati di meja kasir.
              </p>
              <div className="pt-2">
                <a
                  href="#menu"
                  className="btn btn-earth inline-flex items-center gap-2 px-6 py-2.5"
                >
                  Lihat Katalog Menu
                </a>
              </div>
            </div>
          </div>
        )}

        {/* State 4: Ada Promo Aktif (Success with Data) */}
        {status === "success" && promos.length > 0 && (
          <>
            {isSingle ? (
              /* Tampilan Khusus Jika Hanya Terdapat 1 Promo:
                 Card horizontal di desktop dengan perimbangan 50-50:
                 - Kolom kiri: Deskripsi & detail promo
                 - Kolom kanan: Foto promo
              */
              <div className="w-full">
                {promos.map((item) => {
                  const isEvent = item.tipe === "kegiatan";
                  const surface = isEvent ? "bg-latte" : "bg-cream-surface border border-coffee/15";
                  return (
                    <article
                      key={item.id}
                      data-rev
                      style={{ "--d": "60ms" } as React.CSSProperties}
                      className={`group grid grid-cols-1 items-stretch gap-8 rounded-[0.25rem] p-6 transition-all duration-300 sm:p-8 md:p-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 ${surface}`}
                    >
                      {/* Kolom Kiri: Deskripsi & Rincian Promo */}
                      <div className="flex flex-col justify-between space-y-6 lg:order-1">
                        <div className="space-y-4">
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="tag">
                              {isEvent ? (
                                <Calendar className="h-4 w-4" />
                              ) : (
                                <Tag className="h-4 w-4" />
                              )}
                              {isEvent ? "Agenda Acara" : "Promo Hemat"}
                            </span>
                            <span className="tag">Berlaku Aktif</span>
                          </div>

                          {/* Judul Promo */}
                          <h3 className="font-display text-[clamp(2.2rem,3.6vw,3.8rem)] leading-[1.05] text-coffee">
                            {item.judul}
                          </h3>

                          {/* Deskripsi */}
                          <p className="text-[17px] leading-relaxed text-coffee/90 sm:text-lg lg:text-[19px]">
                            {item.deskripsi}
                          </p>
                        </div>

                        {/* Rincian Berakhir, Garis Pemisah & Tindakan */}
                        <div className="space-y-4 pt-2">
                          {/* Period band */}
                          <p className="rounded-[0.15rem] bg-coffee/10 px-4 py-2.5 text-[15px] sm:text-[16px]">
                            <span className="font-medium">Berakhir sampai:</span>{" "}
                            {formatEndDate(item.tanggal_selesai)}
                          </p>

                          <div
                            className="rule-dashed text-coffee"
                            aria-hidden="true"
                          />

                          {/* Footer Info & CTA */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                            <span className="inline-flex items-center gap-2 text-[17px] font-medium text-coffee sm:text-[18px]">
                              <Clock className="h-4 w-4" />
                              {isEvent ? "Sabtu Malam" : "Sore & Hari Kerja"}
                            </span>
                            <a
                              href={isEvent ? "#lokasi" : "#menu"}
                              className="btn btn-earth px-6 py-2.5 text-[15px] sm:text-[16px]"
                            >
                              {isEvent ? "Ke Lokasi" : "Cek Menu"}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Kolom Kanan: Foto Promo (Seimbang 50% di Desktop) */}
                      <div className="order-first relative min-h-[260px] w-full overflow-hidden rounded-[0.25rem] bg-coffee/10 sm:min-h-[340px] lg:order-2 lg:min-h-[420px]">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Tampilan Grid Jika Terdapat Lebih Dari 1 Promo */
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {promos.map((item, idx) => {
                  const isEvent = item.tipe === "kegiatan";
                  const surface = idx % 2 === 1 ? "bg-latte" : "bg-cream-surface border border-coffee/15";
                  return (
                    <article
                      key={item.id}
                      data-rev
                      style={{ "--d": `${idx * 70}ms` } as React.CSSProperties}
                      className={`group flex flex-col rounded-[0.25rem] p-4 sm:p-5 ${surface}`}
                    >
                      {/* Tags */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="tag">
                          {isEvent ? (
                            <Calendar className="h-4 w-4" />
                          ) : (
                            <Tag className="h-4 w-4" />
                          )}
                          {isEvent ? "Agenda Acara" : "Promo Hemat"}
                        </span>
                        <span className="tag">Berlaku Aktif</span>
                      </div>

                      {/* Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.25rem] bg-coffee/10">
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <h3 className="font-display mt-5 text-[clamp(1.9rem,2.6vw,2.4rem)]">
                        {item.judul}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-[17px] text-coffee/90">
                        {item.deskripsi}
                      </p>

                      {/* Period band */}
                      <p className="mt-4 rounded-[0.15rem] bg-coffee/10 px-3 py-1.5 text-[15px]">
                        <span className="font-medium">Berakhir sampai:</span>{" "}
                        {formatEndDate(item.tanggal_selesai)}
                      </p>

                      <div
                        className="rule-dashed mt-5 text-coffee"
                        aria-hidden="true"
                      />

                      {/* Footer */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 text-[17px] font-medium">
                          <Clock className="h-4 w-4" />
                          {isEvent ? "Sabtu Malam" : "Sore & Hari Kerja"}
                        </span>
                        <a
                          href={isEvent ? "#lokasi" : "#menu"}
                          className="btn btn-earth btn-sm"
                        >
                          {isEvent ? "Ke Lokasi" : "Cek Menu"}
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default PromoSection;
