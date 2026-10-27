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
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
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
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#EEE6D7] text-[#472F1D] border border-[#C7B8AE] shadow-2xl z-10 flex flex-col sharp-edges"
          >
            {/* Header bar: Kategori Menu & Tombol Tutup */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 bg-[#5F493C] text-[#EEE6D7] border-b border-[#472F1D] sticky top-0 z-20">
              <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#C7B8AE] font-semibold">
                {item.kategori}
              </span>
              <button
                onClick={onClose}
                className="p-1 text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors focus:outline-none cursor-pointer"
                aria-label="Tutup detail menu"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body: Foto, Nama, Harga, dan Deskripsi Menu */}
            <div className="p-5 sm:p-7 space-y-5 bg-[#EEE6D7]">
              {/* Foto Menu */}
              <div className="relative w-full">
                <PhotoFrameTemplate
                  src={item.foto}
                  title={item.nama}
                  category={item.kategori}
                  aspectRatio="aspect-[16/10]"
                />
              </div>

              {/* Nama & Harga Menu */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#C7B8AE] pb-4">
                <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-[-0.02em] text-[#472F1D]">
                  {item.nama}
                </h3>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#5F493C] whitespace-nowrap">
                  {formatPriceRupiah(item.harga)}
                </span>
              </div>

              {/* Deskripsi Menu */}
              <div>
                <p className="font-sans text-[15px] sm:text-[16px] font-normal tracking-tight text-[#472F1D]/90 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              {/* Catatan Informatif Kunjungan Fisik (Non-Pemesanan Online) */}
              <div className="p-3.5 sm:p-4 bg-[#5F493C] text-[#EEE6D7] border-l-4 border-[#C7B8AE] sharp-edges">
                <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-[#EEE6D7]/95">
                  <strong className="text-[#C7B8AE] font-semibold">Catatan Kunjungan:</strong> Menu digital ini bersifat informatif. Pemesanan dan pembayaran dilakukan langsung di meja kasir saat Anda berkunjung ke lokasi Kontrakan Coffee.
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
