"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CafeMenuItem, formatPriceRupiah } from "@/lib/cafeData";
import { PhotoFrameTemplate } from "./PhotoFrameTemplate";

interface MenuDetailModalProps {
  item: CafeMenuItem | null;
  onClose: () => void;
  triggerMode?: "hover" | "click";
}

export function MenuDetailModal({
  item,
  onClose,
  triggerMode = "click",
}: MenuDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item && triggerMode === "click") {
      document.body.style.overflow = "hidden";
    }
    if (item) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, triggerMode]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
            className={`fixed inset-0 ${
              triggerMode === "hover"
                ? "bg-coffee-darker/35 backdrop-blur-[1px] pointer-events-none"
                : "bg-coffee-darker/80 backdrop-blur-sm pointer-events-auto cursor-pointer"
            }`}
          />

          {/* Modal Container: Tanpa animasi lambat, update instan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.1 }}
            className={`relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto rounded-[0.5rem] bg-cream text-coffee shadow-2xl ${
              triggerMode === "hover" ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            {/* Header bar: Kategori Menu & Tombol Tutup */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-coffee-dark px-5 py-4 text-cream sm:px-6 sm:py-5">
              <span className="text-[13px] font-medium uppercase tracking-widest text-sunshine">
                {item.kategori}
              </span>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-[0.2rem] p-1 text-cream transition-colors hover:text-sunshine pointer-events-auto"
                aria-label="Tutup detail menu"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body: Foto, Nama, Harga, dan Deskripsi Menu */}
            <div className="space-y-5 bg-cream p-5 sm:p-7">
              {/* Foto Menu Utama (Tampil Instan Tanpa Delay) */}
              <div className="relative w-full">
                <PhotoFrameTemplate
                  src={item.foto}
                  title={item.nama}
                  category={item.kategori}
                  aspectRatio="aspect-[16/10]"
                />
              </div>

              {/* Nama & Harga Menu */}
              <div className="flex flex-col justify-between gap-3 border-b border-coffee/15 pb-4 sm:flex-row sm:items-baseline">
                <h3 className="font-display text-4xl sm:text-5xl">
                  {item.nama}
                </h3>
                <span className="whitespace-nowrap text-2xl font-bold sm:text-3xl">
                  {formatPriceRupiah(item.harga)}
                </span>
              </div>

              {/* Deskripsi Menu */}
              <div>
                <p className="text-[16px] leading-relaxed text-coffee/90 sm:text-[17px]">
                  {item.deskripsi}
                </p>
              </div>

              {/* Detail Varian, Profil Rasa & Spesifikasi */}
              {(item.ukuran?.length || item.rasa?.length || item.specs) && (
                <div className="space-y-3 rounded-[0.25rem] border border-coffee/10 bg-latte/20 p-3.5 text-coffee sm:p-4">
                  {item.ukuran && item.ukuran.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold uppercase tracking-wider text-coffee/70">
                        Varian:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.ukuran.map((uk) => (
                          <span
                            key={uk}
                            className="rounded-[0.2rem] border border-coffee/15 bg-cream px-2.5 py-0.5 text-xs font-semibold text-coffee"
                          >
                            {uk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.rasa && item.rasa.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold uppercase tracking-wider text-coffee/70">
                        Profil Rasa:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.rasa.map((r) => (
                          <span
                            key={r}
                            className="rounded-[0.2rem] bg-coffee/10 px-2 py-0.5 text-xs font-medium text-coffee"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.specs && (
                    <p className="text-xs text-coffee/80">
                      <strong className="font-semibold text-coffee">Spesifikasi:</strong>{" "}
                      {item.specs}
                    </p>
                  )}
                </div>
              )}

              {/* Catatan Informatif Kunjungan Fisik (Non-Pemesanan Online) */}
              <div className="rounded-[0.25rem] border-l-4 border-sunshine bg-coffee p-3.5 text-cream sm:p-4">
                <p className="text-[14px] leading-relaxed text-cream/95">
                  <strong className="font-medium text-sunshine">Catatan Kunjungan:</strong> Menu digital ini bersifat informatif. Pemesanan dan pembayaran dilakukan langsung di meja kasir saat Anda berkunjung ke lokasi Kontrakan Coffee.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MenuDetailModal;
