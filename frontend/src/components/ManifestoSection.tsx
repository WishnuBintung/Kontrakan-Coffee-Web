"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { SplitWords } from "./EditorialMotion";

export function ManifestoSection() {
  return (
    <section
      id="pembuka"
      className="relative w-full bg-[#EEE6D7] text-[#472F1D] sharp-edges border-t border-b border-[#C7B8AE]"
    >
      {/* =======================================================================
          PART 1: 320svh Pinned Stage — Bottom-Up Coffee Image Reveal
          with Difference-Blended Headline that Fades Out on Scroll
         ======================================================================= */}
      <div
        data-scroll-stage="reveal"
        className="stage-reveal-pin relative w-full h-[320svh] bg-[#EEE6D7]"
      >
        <div className="sticky top-0 left-0 w-full h-screen h-[100svh] overflow-hidden flex items-center justify-center bg-[#5F493C]">
          {/* Second Photograph (Artisan Coffee Still Life) revealed from bottom up via clip-path */}
          <div className="stage-reveal-photo-wrap absolute inset-0 w-full h-full z-10 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=85&w=2000&auto=format&fit=crop"
              alt="Seduhan Kopi Spesialti Kontrakan Coffee"
              className="w-full h-full object-cover brightness-90 contrast-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#472F1D]/75 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Large Headline Above Image in mix-blend-mode: difference (#EEE6D7), fading out as reveal completes */}
          <div className="stage-reveal-headline relative z-20 max-w-5xl mx-auto px-6 text-center pointer-events-none select-none">
            <h2 className="font-sans font-medium text-[6.5vw] md:text-[5vw] leading-tight tracking-[-0.03em] uppercase">
              We strip away the superfluous until only aroma, light, and raw spatial substance remain.
            </h2>
          </div>

          {/* Bottom-Left Caption — Fades IN only after the reveal passes 45% */}
          <div className="stage-reveal-caption absolute bottom-8 sm:bottom-12 left-6 sm:left-10 md:left-14 z-30 max-w-md bg-[#472F1D]/90 backdrop-blur-sm text-[#EEE6D7] p-5 sm:p-6 border border-[#C7B8AE]/50 sharp-edges">
            <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed text-[#EEE6D7]/90">
              Setiap cangkir di Kontrakan Coffee dimulai dari biji sangrai segar
              petani lokal Aceh Gayo, Flores Bajawa, dan Jawa Barat — diseduh
              presisi untuk menemani waktu belajar, bekerja, dan bersantai Anda.
            </p>
          </div>
        </div>
      </div>

      {/* =======================================================================
          PART 2: Statement Band — Deskripsi & Tiga Pilar Kafe (3 Columns)
         ======================================================================= */}
      <div className="w-full bg-[#5F493C] text-[#EEE6D7] py-20 sm:py-28 px-4 sm:px-6 border-t border-[#472F1D]">
        <div className="max-w-7xl mx-auto">
          {/* Large Statement with Italic Clause & Per-Word Stagger */}
          <div className="max-w-5xl mb-14 sm:mb-20">
            <span
              data-rev
              style={{ "--d": "50ms" } as React.CSSProperties}
              className="font-sans font-thin italic text-xl sm:text-2xl text-[#C7B8AE] inline-block rotate-1 mb-4"
            >
              diseduh perlahan dengan ketelitian tangan
            </span>
            <h3 className="font-sans font-medium text-2xl sm:text-4xl md:text-5xl leading-tight tracking-[-0.03em] text-[#EEE6D7]">
              <SplitWords
                text="Kontrakan Coffee hadir sebagai rumah kedua bagi mahasiswa, pekerja kreatif, dan penikmat kopi di Yogyakarta —"
                staggerMs={38}
              />{" "}
              <span className="font-thin italic text-[#C7B8AE]">
                <SplitWords
                  text="mempertemukan hangatnya ruang arsitektural dengan harga yang jujur dan bersahabat."
                  staggerMs={38}
                  baseDelayMs={420}
                />
              </span>
            </h3>
          </div>

          {/* Three Columns of Bold-Label Paragraphs (Prompt Band Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-10 border-t border-[#472F1D]">
            <div
              data-rev
              style={{ "--d": "60ms" } as React.CSSProperties}
              className="space-y-3"
            >
              <h4 className="font-sans font-black text-xl sm:text-2xl text-[#EEE6D7] uppercase tracking-[-0.02em]">
                Biji Pilihan Nusantara
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#EEE6D7]/85 leading-relaxed">
                <SplitWords
                  text="Kami bekerja langsung dengan roastery lokal untuk menjaga kesegaran biji Arabika Gayo, Flores, dan cokelat Jawa Timur agar karakter rasa alami di setiap cangkir selalu konsisten."
                  staggerMs={24}
                />
              </p>
            </div>

            <div
              data-rev
              style={{ "--d": "140ms" } as React.CSSProperties}
              className="space-y-3"
            >
              <h4 className="font-sans font-black text-xl sm:text-2xl text-[#EEE6D7] uppercase tracking-[-0.02em]">
                Suasana Produktif &amp; Teduh
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#EEE6D7]/85 leading-relaxed">
                <SplitWords
                  text="Dilengkapi meja komunal kayu panjang, akses stopkontak di setiap sudut, Wi-Fi 100 Mbps, serta area taman semi-outdoor yang rindang untuk menemani fokus nugas maupun obrolan sore."
                  staggerMs={24}
                />
              </p>
            </div>

            <div
              data-rev
              style={{ "--d": "220ms" } as React.CSSProperties}
              className="space-y-3"
            >
              <h4 className="font-sans font-black text-xl sm:text-2xl text-[#EEE6D7] uppercase tracking-[-0.02em]">
                Informasi Jelas Tanpa Ribet
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#EEE6D7]/85 leading-relaxed">
                <SplitWords
                  text="Tak perlu menebak harga atau menggulir ratusan unggahan media sosial. Seluruh daftar menu, varian ukuran, jam operasional, dan titik lokasi dapat Anda periksa langsung di halaman ini."
                  staggerMs={24}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManifestoSection;
