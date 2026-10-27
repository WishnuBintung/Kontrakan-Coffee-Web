"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

interface ScrollLinkedZoomHeaderProps {
  title?: string;
  secondaryLabel?: string;
  headingScale?: MotionValue<number>;
  headingZ?: MotionValue<number>;
  titleY?: MotionValue<number>;
  titleOpacity?: MotionValue<number>;
  coffeeOpacity?: MotionValue<number>;
}

/**
 * Scroll-Linked Zoom Header
 * 
 * Spec (Panduan Mutlak):
 * - Container relative, overflow-hidden.
 * - Apply Framer Motion `useScroll` to capture Y-axis.
 * - Map scroll 0-30% of viewport to a scale of 1.0 to 0.89 on the main 12vw heading.
 * - Ensure `transform-style: preserve-3d` and `will-change: transform` are applied for GPU acceleration.
 * - Animasi menghilang lebih lama untuk kedua title (coffee tetap hilang duluan).
 * - Judul bebas capslock (tidak di-force uppercase).
 * - Warna Teks Utama: #1C1A18, Secondary Label: Amber Gold #D99C5B
 */
export function ScrollLinkedZoomHeader({
  title = "Kontrakan",
  secondaryLabel = "coffee",
  headingScale: externalHeadingScale,
  headingZ: externalHeadingZ,
  titleY: externalTitleY,
  titleOpacity: externalTitleOpacity,
  coffeeOpacity: externalCoffeeOpacity,
}: ScrollLinkedZoomHeaderProps) {
  const [viewportHeight, setViewportHeight] = useState(800);

  useEffect(() => {
    setViewportHeight(window.innerHeight || 800);
    const handleResize = () => setViewportHeight(window.innerHeight || 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollY } = useScroll();

  // Map scroll 0-30% of viewport to a scale of 1.0 to 0.89 on the main 12vw heading
  const internalHeadingScale = useTransform(
    scrollY,
    [0, viewportHeight * 0.3],
    [1.0, 0.89],
    { clamp: true }
  );

  // Optical receding effect along Z-axis (simulating depth into the screen)
  const internalHeadingZ = useTransform(
    scrollY,
    [0, viewportHeight * 0.3],
    [0, -45],
    { clamp: true }
  );

  // Subtle downward glide (smooth translation Y)
  const internalTitleY = useTransform(
    scrollY,
    [0, viewportHeight * 0.45],
    [0, 45],
    { clamp: true }
  );

  // Kata "coffee": pudar lebih lama dan halus, tetapi tetap hilang duluan (hilang total di 28% viewport)
  const internalCoffeeOpacity = useTransform(
    scrollY,
    [0, viewportHeight * 0.12, viewportHeight * 0.28],
    [1.0, 0.65, 0.0],
    { clamp: true }
  );

  // Title "Kontrakan": animasi menghilangnya lebih lama (bertahan penuh di awal, lalu pudar bertahap hingga 45% viewport)
  const internalTitleOpacity = useTransform(
    scrollY,
    [0, viewportHeight * 0.12, viewportHeight * 0.45],
    [1.0, 1.0, 0.0],
    { clamp: true }
  );

  const effectiveScale = externalHeadingScale ?? internalHeadingScale;
  const effectiveZ = externalHeadingZ ?? internalHeadingZ;
  const effectiveY = externalTitleY ?? internalTitleY;
  const effectiveTitleOpacity = externalTitleOpacity ?? internalTitleOpacity;
  const effectiveCoffeeOpacity = externalCoffeeOpacity ?? internalCoffeeOpacity;

  return (
    // Container relative, overflow-hidden dengan ruang vertikal yang cukup agar tidak terpotong
    <div
      className="relative overflow-hidden w-full flex items-center justify-center py-8 md:py-12"
      style={{ perspective: "1000px" }}
    >
      {/* Wrapper motion yang menyatukan pergerakan descent Kontrakan dan coffee */}
      <motion.div
        style={{
          y: effectiveY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative inline-flex items-center justify-center"
      >
        {/* Main 12vw heading: transform-style: preserve-3d, will-change: transform, GPU accelerated, warna teks #472F1D */}
        <motion.h1
          style={{
            scale: effectiveScale,
            z: effectiveZ,
            opacity: effectiveTitleOpacity,
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
          className="font-sans font-black text-[12vw] leading-none text-[#472F1D] tracking-[-0.03em] select-none text-center"
        >
          {title}
        </motion.h1>

        {/* Secondary label: 32px font-thin italic, ikut meluncur turun tapi memudar dan hilang duluan */}
        <motion.span
          style={{
            opacity: effectiveCoffeeOpacity,
            willChange: "opacity",
          }}
          className="hidden sm:inline-block absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 text-[32px] font-thin italic text-[#5F493C] whitespace-nowrap font-sans tracking-normal pointer-events-none select-none"
        >
          {secondaryLabel}
        </motion.span>
      </motion.div>
    </div>
  );
}
