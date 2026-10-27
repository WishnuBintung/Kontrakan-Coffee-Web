"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { SplitWords } from "./EditorialMotion";

export function ManifestoSection() {
  return (
    <section
      id="pembuka"
      className="relative w-full bg-[#E8E3D9] text-[#1C1A18] sharp-edges border-t border-b border-[#D6CFC2]"
    >
      {/* =======================================================================
          PART 1: 320svh Pinned Stage — Bottom-Up Coffee Image Reveal
          with Difference-Blended Headline that Fades Out on Scroll
         ======================================================================= */}
      <div
        data-scroll-stage="reveal"
        className="stage-reveal-pin relative w-full h-[320svh] bg-[#E8E3D9]"
      >
        <div className="sticky top-0 left-0 w-full h-screen h-[100svh] overflow-hidden flex items-center justify-center bg-[#5B6653]">
          {/* Top-left & Top-right Mono Sub-labels inside the Pin */}
          <div className="absolute top-24 left-6 sm:left-10 md:left-14 right-6 sm:right-10 md:right-14 z-20 flex items-center justify-between border-b border-[#E8E3D9]/20 pb-3 pointer-events-none">
            <span className="font-mono text-[13px] sm:text-[14px] uppercase tracking-widest text-[#D99C5B] font-semibold">
              [01 // KALIMAT PEMBUKA &amp; DESKRIPSI]
            </span>
            <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-widest text-[#E8E3D9]/70 hidden sm:inline">
              SPATIAL PURITY // ARTISANAL ROASTERY
            </span>
          </div>

          {/* Second Photograph (Artisan Coffee Still Life) revealed from bottom up via clip-path */}
          <div className="stage-reveal-photo-wrap absolute inset-0 w-full h-full z-10 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=85&w=2000&auto=format&fit=crop"
              alt="Seduhan Kopi Spesialti Kontrakan Coffee"
              className="w-full h-full object-cover brightness-90 contrast-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1C1A18]/75 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Large Headline Above Image in mix-blend-mode: difference (#fff), fading out as reveal completes */}
          <div className="stage-reveal-headline relative z-20 max-w-5xl mx-auto px-6 text-center pointer-events-none select-none">
            <span className="font-mono text-[13px] sm:text-[14px] uppercase tracking-widest block mb-6 font-semibold opacity-90">
              [01 // DESKRIPSI &amp; KALIMAT PEMBUKA]
            </span>
            <h2 className="font-sans font-medium text-[6.5vw] md:text-[5vw] leading-tight tracking-[-0.03em] uppercase">
              We strip away the superfluous until only aroma, light, and raw spatial substance remain.
            </h2>
          </div>

          {/* Bottom-Left Caption — Fades IN only after the reveal passes 45% */}
          <div className="stage-reveal-caption absolute bottom-8 sm:bottom-12 left-6 sm:left-10 md:left-14 z-30 max-w-md bg-[#1C1A18]/90 backdrop-blur-sm text-[#E8E3D9] p-5 sm:p-6 border border-[#D99C5B]/50 sharp-edges">
            <div className="flex items-center justify-between mb-2 border-b border-[#E8E3D9]/20 pb-2">
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                [FIG. 01 // EKSTRAKSI HARIAN]
              </span>
              <span className="font-mono text-[11px] text-[#E8E3D9]/70 uppercase">
                92°C // V60 &amp; ESPRESSO
              </span>
            </div>
            <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed text-[#E8E3D9]/90">
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
      <div className="w-full bg-[#5B6653] text-[#E8E3D9] py-20 sm:py-28 px-4 sm:px-6 border-t border-[#4D5746]">
        <div className="max-w-7xl mx-auto">
          {/* Top Sub-label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-10 border-b border-[#4D5746]">
            <span
              data-rev
              style={{ "--d": "40ms" } as React.CSSProperties}
              className="font-mono text-[13px] sm:text-[14px] uppercase tracking-widest text-[#D99C5B] font-semibold"
            >
              [01.B // PROFIL &amp; DESKRIPSI RUANG]
            </span>
            <span
              data-rev
              style={{ "--d": "90ms" } as React.CSSProperties}
              className="font-sans font-thin italic text-xl sm:text-2xl text-[#D99C5B] inline-block rotate-1"
            >
              diseduh perlahan dengan ketelitian tangan
            </span>
          </div>

          {/* Large Statement with Italic Clause & Per-Word Stagger */}
          <div className="max-w-5xl mb-14 sm:mb-20">
            <h3 className="font-sans font-medium text-2xl sm:text-4xl md:text-5xl leading-tight tracking-[-0.03em] text-[#E8E3D9]">
              <SplitWords
                text="Kontrakan Coffee hadir sebagai rumah kedua bagi mahasiswa, pekerja kreatif, dan penikmat kopi di Yogyakarta —"
                staggerMs={38}
              />{" "}
              <span className="font-thin italic text-[#D99C5B]">
                <SplitWords
                  text="mempertemukan hangatnya ruang arsitektural dengan harga yang jujur dan bersahabat."
                  staggerMs={38}
                  baseDelayMs={420}
                />
              </span>
            </h3>
          </div>

          {/* Three Columns of Bold-Label Paragraphs (Prompt Band Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-10 border-t border-[#4D5746]">
            <div
              data-rev
              style={{ "--d": "60ms" } as React.CSSProperties}
              className="space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#4D5746] pb-2.5">
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                  [01 // HULU]
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#E8E3D9]/70">
                  SINGLE ORIGIN &amp; HOUSE BLEND
                </span>
              </div>
              <h4 className="font-sans font-black text-xl sm:text-2xl text-[#E8E3D9] uppercase tracking-[-0.02em]">
                Biji Pilihan Nusantara
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#E8E3D9]/85 leading-relaxed">
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
              <div className="flex items-center justify-between border-b border-[#4D5746] pb-2.5">
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                  [02 // RUANG]
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#E8E3D9]/70">
                  WFC &amp; DISKUSI TENANG
                </span>
              </div>
              <h4 className="font-sans font-black text-xl sm:text-2xl text-[#E8E3D9] uppercase tracking-[-0.02em]">
                Suasana Produktif &amp; Teduh
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#E8E3D9]/85 leading-relaxed">
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
              <div className="flex items-center justify-between border-b border-[#4D5746] pb-2.5">
                <span className="font-mono text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                  [03 // AKSES]
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#E8E3D9]/70">
                  KATALOG TRANSPARAN
                </span>
              </div>
              <h4 className="font-sans font-black text-xl sm:text-2xl text-[#E8E3D9] uppercase tracking-[-0.02em]">
                Informasi Jelas Tanpa Ribet
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#E8E3D9]/85 leading-relaxed">
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
