"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrollLinkedZoomHeader } from "./ScrollLinkedZoomHeader";

export function HeroSection() {
  const [viewportHeight, setViewportHeight] = useState(800);

  useEffect(() => {
    setViewportHeight(window.innerHeight || 800);
    const handleResize = () => setViewportHeight(window.innerHeight || 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion useScroll capturing Y-axis
  const { scrollY } = useScroll();

  // Layer 1 (Back): Background image scale linked to scroll (1.0 to 1.27)
  const bgScale = useTransform(scrollY, [0, viewportHeight], [1.0, 1.27], {
    clamp: true,
  });

  // Main 12vw heading scale: Map scroll 0-30% of viewport to a scale of 1.0 to 0.89
  const headingScale = useTransform(
    scrollY,
    [0, viewportHeight * 0.3],
    [1.0, 0.89],
    { clamp: true }
  );

  // Optical receding effect along Z-axis (simulating depth into the screen)
  const headingZ = useTransform(
    scrollY,
    [0, viewportHeight * 0.3],
    [0, -45],
    { clamp: true }
  );

  // Gentle downward glide (turun perlahan seiring scroll)
  const titleY = useTransform(
    scrollY,
    [0, viewportHeight * 0.45],
    [0, 45],
    { clamp: true }
  );

  // Kata "coffee": pudar lebih lama dan halus, tetapi tetap hilang duluan (hilang total di 28% viewport)
  const coffeeOpacity = useTransform(
    scrollY,
    [0, viewportHeight * 0.12, viewportHeight * 0.28],
    [1.0, 0.65, 0.0],
    { clamp: true }
  );

  // Title "Kontrakan": animasi menghilang dibuat lebih lama (bertahan penuh di awal, lalu pudar bertahap hingga 45% viewport)
  const titleOpacity = useTransform(
    scrollY,
    [0, viewportHeight * 0.12, viewportHeight * 0.45],
    [1.0, 1.0, 0.0],
    { clamp: true }
  );

  // Kalimat di bagian bawah hero: pudar bertahap selaras dengan title
  const bottomTextOpacity = useTransform(
    scrollY,
    [0, viewportHeight * 0.12, viewportHeight * 0.4],
    [1.0, 1.0, 0.0],
    { clamp: true }
  );

  return (
    // Hero section berukuran full satu layar penuh di semua device (100dvh) dengan Warna Dasar Krem Hangat (#E8E3D9) dan stacking context terisolasi (isolate)
    <section className="relative w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center px-6 pt-28 pb-12 bg-[#E8E3D9] text-[#1C1A18] isolate">
      {/* Layer 1 (Back): Background image jernih tanpa efek blur/filter, scale linked to scroll (1.0 to 1.27) */}
      <motion.div
        style={{
          scale: bgScale,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
      >
        {/* Coffee atelier background image - jernih tanpa efek blur atau filter apapun */}
        <img
          src="/images/bg-hero.jpg"
          alt="Kontrakan Coffee Atelier Atmosphere"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = "1";
              target.src = "./images/bg-hero.jpg";
            }
          }}
        />
      </motion.div>

      {/* Spacer atas */}
      <div className="h-6 relative z-10" aria-hidden="true" />

      {/* Layer 2 (Mid) & Layer 3 (Overlay): Scroll-Linked Zoom Header Component */}
      <div className="my-auto relative z-10 w-full flex items-center justify-center">
        <ScrollLinkedZoomHeader
          title="Kontrakan"
          secondaryLabel="coffee"
          headingScale={headingScale}
          headingZ={headingZ}
          titleY={titleY}
          titleOpacity={titleOpacity}
          coffeeOpacity={coffeeOpacity}
        />
      </div>

      {/* Bottom: Kalimat di bagian bawah hero dengan Warna Teks (#1C1A18) */}
      <motion.div
        style={{
          opacity: bottomTextOpacity,
          willChange: "opacity",
        }}
        className="relative z-10 max-w-2xl mx-auto px-4"
      >
        <p className="text-[17px] md:text-[20px] font-light tracking-tight text-[#1C1A18]/90 leading-relaxed font-sans font-medium">
          The Kontrakan Coffee design system combines warm brick-reflected cream, dark olive green surfaces,
          and glowing amber gold accents to create an immersive, architectural coffee atelier experience.
        </p>
      </motion.div>
    </section>
  );
}
