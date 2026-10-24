"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollLinkedZoomHeaderProps {
  title?: string;
  secondaryLabel?: string;
}

/**
 * Scroll-Linked Zoom Header
 * 
 * Spec:
 * - Container relative, overflow-hidden.
 * - Apply Framer Motion `useScroll` to capture Y-axis.
 * - Map scroll 0-30% of viewport to a scale of 1.0 to 0.89 on the main 12vw heading.
 * - Ensure `transform-style: preserve-3d` and `will-change: transform` are applied for GPU acceleration.
 * - Simulates physical depth into the screen as user scrolls down.
 */
export function ScrollLinkedZoomHeader({
  title = "CINEMATIC",
  secondaryLabel = "NOIR",
}: ScrollLinkedZoomHeaderProps) {
  // Capture dynamic viewport height to precisely calculate 30% of viewport
  const [viewportHeight, setViewportHeight] = useState(857);

  useEffect(() => {
    setViewportHeight(window.innerHeight || 857);
    const handleResize = () => setViewportHeight(window.innerHeight || 857);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion useScroll to capture Y-axis
  const { scrollY } = useScroll();

  // Map scroll 0-30% of viewport to a scale of 1.0 to 0.89 on the main 12vw heading
  const headingScale = useTransform(
    scrollY,
    [0, viewportHeight * 0.3],
    [1.0, 0.89],
    { clamp: true }
  );

  // Optical receding effect into the screen (simulating physical depth)
  const headingZ = useTransform(
    scrollY,
    [0, viewportHeight * 0.3],
    [0, -45],
    { clamp: true }
  );

  // Secondary label (32px) fading out on scroll
  const labelOpacity = useTransform(
    scrollY,
    [0, viewportHeight * 0.25],
    [1.0, 0],
    { clamp: true }
  );

  return (
    // Container relative, overflow-hidden
    <div
      className="relative overflow-hidden w-full flex items-center justify-center py-4"
      style={{ perspective: "1000px" }}
    >
      <div className="relative inline-flex items-center justify-center">
        {/* Main 12vw heading with transform-style: preserve-3d and will-change: transform */}
        <motion.h1
          style={{
            scale: headingScale,
            z: headingZ,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="font-serif font-black text-[12vw] leading-none text-[#e5e5e5] uppercase tracking-[-0.03em] select-none text-center"
        >
          {title}
        </motion.h1>

        {/* Secondary label (32px) positioned absolute 'left-[calc(100%+1rem)]' relative to heading, fading out on scroll */}
        <motion.span
          style={{
            opacity: labelOpacity,
            willChange: "opacity",
          }}
          className="hidden sm:inline-block absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 text-[32px] font-thin italic text-[#e5e5e5]/80 whitespace-nowrap font-serif tracking-normal pointer-events-none select-none"
        >
          {secondaryLabel}
        </motion.span>
      </div>
    </div>
  );
}

