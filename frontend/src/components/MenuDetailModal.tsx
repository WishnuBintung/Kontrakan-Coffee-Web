"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import { X, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CafeMenuItem, formatPriceRupiah, CAFE_INFO } from "@/lib/cafeData";
import { PhotoFrameTemplate } from "./PhotoFrameTemplate";

interface MenuDetailModalProps {
  item: CafeMenuItem | null;
  onClose: () => void;
}

export function MenuDetailModal({ item, onClose }: MenuDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#472F1D]/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#EEE6D7] text-[#472F1D] border border-[#C7B8AE] shadow-2xl z-10 flex flex-col sharp-edges"
          >
            {/* Header bar: Surface Roasted Mocha #5F493C */}
            <div className="flex items-center justify-between p-4 sm:p-6 bg-[#5F493C] text-[#EEE6D7] border-b border-[#472F1D] sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#C7B8AE] font-semibold">
                  {item.kategori.toUpperCase()}
                </span>
                {item.rekomendasi && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-[#C7B8AE] text-[#472F1D] font-bold uppercase tracking-wider sharp-edges">
                    <Sparkles className="w-3 h-3" />
                    <span>REKOMENDASI</span>
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors focus:outline-none"
                aria-label="Tutup detail menu"
              >
                <X className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 bg-[#EEE6D7]">
              {/* Image / Frame Template Preview with price overlay */}
              <div className="relative w-full">
                <PhotoFrameTemplate
                  src={item.foto}
                  title={item.nama}
                  category={item.kategori}
                  badge={item.badge}
                  aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
                />
                <div className="absolute bottom-4 right-4 bg-[#5F493C]/95 backdrop-blur-md px-4 py-1.5 border border-[#472F1D] sharp-edges text-[#EEE6D7] z-20 shadow-md">
                  <span className="font-mono text-[16px] sm:text-[18px] font-bold text-[#C7B8AE]">
                    {formatPriceRupiah(item.harga)}
                  </span>
                </div>
              </div>

              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#C7B8AE] pb-5">
                <div>
                  <h3 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-[-0.03em] text-[#472F1D]">
                    {item.nama}
                  </h3>
                  <p className="font-mono text-[13px] text-[#5F493C] uppercase tracking-wider mt-1">
                    KONTRAKAN ATELIER RECIPE
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#5F493C]">
                    {formatPriceRupiah(item.harga)}
                  </span>
                  <span className="block font-mono text-[11px] text-[#5F493C] uppercase">
                    Harga dasar bersih
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#5F493C] block mb-2 font-bold">
                  DESKRIPSI RASA &amp; BAHAN
                </span>
                <p className="text-[16px] sm:text-[18px] font-normal tracking-tight text-[#472F1D]/90 leading-relaxed font-sans">
                  {item.deskripsi}
                </p>
              </div>

              {/* Specs & Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Size options */}
                <div className="bg-[#5F493C]/10 border border-[#C7B8AE] p-4 sharp-edges">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#5F493C] block mb-2 font-bold">
                    PILIHAN UKURAN (SIZE)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.ukuran && item.ukuran.length > 0 ? (
                      item.ukuran.map((sz) => (
                        <span
                          key={sz}
                          className="px-2.5 py-1 text-[12px] font-mono bg-[#5F493C] border border-[#472F1D] text-[#EEE6D7] sharp-edges"
                        >
                          {sz}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] font-mono text-[#5F493C]">
                        Standard Serving (1 Porsi)
                      </span>
                    )}
                  </div>
                </div>

                {/* Flavor / Variation options */}
                <div className="bg-[#5F493C]/10 border border-[#C7B8AE] p-4 sharp-edges">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#5F493C] block mb-2 font-bold">
                    PILIHAN RASA / VARIAN
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.rasa && item.rasa.length > 0 ? (
                      item.rasa.map((rs) => (
                        <span
                          key={rs}
                          className="px-2.5 py-1 text-[12px] font-mono bg-[#5F493C] border border-[#472F1D] text-[#EEE6D7] sharp-edges"
                        >
                          {rs}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] font-mono text-[#5F493C]">
                        Original Barista Preset
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs note */}
              {item.specs && (
                <div className="p-3 bg-[#472F1D]/5 border border-[#C7B8AE] sharp-edges">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#5F493C] block mb-1 font-semibold">
                    FORMULA CATATAN ATELIER:
                  </span>
                  <p className="font-mono text-[13px] text-[#472F1D] font-medium">
                    {item.specs}
                  </p>
                </div>
              )}

              {/* Informative Note: Not an ordering platform */}
              <div className="p-4 bg-[#5F493C] text-[#EEE6D7] border-l-4 border-[#C7B8AE] sharp-edges">
                <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-[#EEE6D7]/95">
                  <strong className="text-[#C7B8AE] font-semibold">Catatan Kunjungan:</strong> Menu digital ini bersifat informatif. Pemesanan dan pembayaran dilakukan langsung di meja kasir kafe saat Anda berkunjung ke lokasi Kontrakan Coffee.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-[#C7B8AE]">
                <a
                  href="#lokasi"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C7B8AE] text-[#472F1D] font-bold text-[14px] sm:text-[15px] tracking-tight uppercase hover:bg-[#472F1D] hover:text-[#EEE6D7] transition-colors sharp-edges shadow-md"
                >
                  <MapPin className="w-4 h-4 stroke-[2.5]" />
                  <span>Kunjungi di Lokasi Kafe</span>
                </a>
                <a
                  href={`https://wa.me/${CAFE_INFO.whatsapp}?text=${encodeURIComponent(
                    `Halo Kontrakan Coffee, saya ingin menanyakan ketersediaan menu ${item.nama}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#5F493C] text-[#5F493C] font-mono text-[13px] tracking-wider uppercase hover:bg-[#5F493C] hover:text-[#EEE6D7] transition-colors sharp-edges"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tanya via WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MenuDetailModal;
