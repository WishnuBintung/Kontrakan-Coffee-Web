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
            className="fixed inset-0 bg-[#1C1A18]/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#E8E3D9] text-[#1C1A18] border border-[#D6CFC2] shadow-2xl z-10 flex flex-col sharp-edges"
          >
            {/* Header bar: Surface Hijau Zaitun #5B6653 */}
            <div className="flex items-center justify-between p-4 sm:p-6 bg-[#5B6653] text-[#E8E3D9] border-b border-[#4D5746] sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                  [{item.kategori.toUpperCase()} // CATALOGUE]
                </span>
                {item.rekomendasi && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-[#D99C5B] text-[#1C1A18] font-bold uppercase tracking-wider sharp-edges">
                    <Sparkles className="w-3 h-3" />
                    <span>REKOMENDASI</span>
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[#E8E3D9] hover:text-[#D99C5B] transition-colors focus:outline-none"
                aria-label="Tutup detail menu"
              >
                <X className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 bg-[#E8E3D9]">
              {/* Image / Frame Template Preview with price overlay */}
              <div className="relative w-full">
                <PhotoFrameTemplate
                  src={item.foto}
                  title={item.nama}
                  category={item.kategori}
                  badge={item.badge}
                  aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
                />
                <div className="absolute bottom-4 right-4 bg-[#5B6653]/95 backdrop-blur-md px-4 py-1.5 border border-[#4D5746] sharp-edges text-[#E8E3D9] z-20 shadow-md">
                  <span className="font-mono text-[16px] sm:text-[18px] font-bold text-[#D99C5B]">
                    {formatPriceRupiah(item.harga)}
                  </span>
                </div>
              </div>

              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D6CFC2] pb-5">
                <div>
                  <h3 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-[-0.03em] text-[#1C1A18]">
                    {item.nama}
                  </h3>
                  <p className="font-mono text-[13px] text-[#666158] uppercase tracking-wider mt-1">
                    KONTRAKAN ATELIER RECIPE
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#D99C5B]">
                    {formatPriceRupiah(item.harga)}
                  </span>
                  <span className="block font-mono text-[11px] text-[#666158] uppercase">
                    Harga dasar bersih
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#5B6653] block mb-2 font-bold">
                  DESKRIPSI RASA & BAHAN
                </span>
                <p className="text-[16px] sm:text-[18px] font-normal tracking-tight text-[#1C1A18]/90 leading-relaxed font-sans">
                  {item.deskripsi}
                </p>
              </div>

              {/* Specs & Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Size options */}
                <div className="bg-[#5B6653]/10 border border-[#D6CFC2] p-4 sharp-edges">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#5B6653] block mb-2 font-bold">
                    PILIHAN UKURAN (SIZE)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.ukuran && item.ukuran.length > 0 ? (
                      item.ukuran.map((sz) => (
                        <span
                          key={sz}
                          className="px-2.5 py-1 text-[12px] font-mono bg-[#5B6653] border border-[#4D5746] text-[#E8E3D9] sharp-edges"
                        >
                          {sz}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] font-mono text-[#666158]">
                        Standard Serving (1 Porsi)
                      </span>
                    )}
                  </div>
                </div>

                {/* Flavor / Variation options */}
                <div className="bg-[#5B6653]/10 border border-[#D6CFC2] p-4 sharp-edges">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#5B6653] block mb-2 font-bold">
                    PILIHAN RASA / VARIAN
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.rasa && item.rasa.length > 0 ? (
                      item.rasa.map((rs) => (
                        <span
                          key={rs}
                          className="px-2.5 py-1 text-[12px] font-mono bg-[#5B6653] border border-[#4D5746] text-[#E8E3D9] sharp-edges"
                        >
                          {rs}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] font-mono text-[#666158]">
                        Original Barista Preset
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs note */}
              {item.specs && (
                <div className="p-3 bg-[#1C1A18]/5 border border-[#D6CFC2] sharp-edges">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#666158] block mb-1 font-semibold">
                    FORMULA CATATAN ATELIER:
                  </span>
                  <p className="font-mono text-[13px] text-[#1C1A18] font-medium">
                    {item.specs}
                  </p>
                </div>
              )}

              {/* Informative Note: Not an ordering platform */}
              <div className="p-4 bg-[#5B6653] text-[#E8E3D9] border-l-4 border-[#D99C5B] sharp-edges">
                <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-[#E8E3D9]/95">
                  <strong className="text-[#D99C5B] font-semibold">Catatan Kunjungan:</strong> Menu digital ini bersifat informatif. Pemesanan dan pembayaran dilakukan langsung di meja kasir kafe saat Anda berkunjung ke lokasi Kontrakan Coffee.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-[#D6CFC2]">
                <a
                  href="#lokasi"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D99C5B] text-[#1C1A18] font-bold text-[14px] sm:text-[15px] tracking-tight uppercase hover:bg-[#C08343] transition-colors sharp-edges shadow-md"
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#5B6653] text-[#5B6653] font-mono text-[13px] tracking-wider uppercase hover:bg-[#5B6653] hover:text-[#E8E3D9] transition-colors sharp-edges"
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

