"use client";

import React from "react";
import { motion } from "motion/react";

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="bg-[#09090b] min-h-screen h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden text-center sharp-edges"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Category sub-label: 14px Mono */}
        <span className="font-mono text-[14px] uppercase tracking-widest text-[#888] mb-8 block">
          [02 // MANIFESTO]
        </span>

        {/* Centered text: 5vw-7vw font-weight 500, leading-tight */}
        <h2 className="font-serif font-medium text-[6.5vw] md:text-[5.5vw] leading-tight tracking-[-0.03em] text-[#e5e5e5] uppercase">
          We strip away the superfluous until only light, shadow, and raw substance remain.
        </h2>

        {/* Below text: a horizontal line (#ffffff/30% opacity) that animates its width from 0 to 100% (max-w 320px) on scroll-into-view */}
        <div className="w-full max-w-[320px] mx-auto mt-12 flex justify-center">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] bg-white/30"
          />
        </div>

        <p className="font-mono text-[13px] text-[#888] uppercase tracking-widest mt-8">
          ARCHITECTURAL PURITY // ABSOLUTE SILENCE
        </p>
      </motion.div>
    </section>
  );
}
