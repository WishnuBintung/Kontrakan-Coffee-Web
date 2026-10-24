"use client";

import React from "react";
import { motion } from "motion/react";

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="bg-[#F5F0E6] text-[#241611] min-h-screen h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden text-center sharp-edges border-y border-[#E6DDCF]"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Category sub-label: 14px Mono */}
        <span className="font-mono text-[14px] uppercase tracking-widest text-[#735F53] mb-8 block font-medium">
          [02 // MANIFESTO]
        </span>

        {/* Centered text: 5vw-7vw font-weight 500, leading-tight, Warna Teks Espresso #241611 */}
        <h2 className="font-sans font-medium text-[6.5vw] md:text-[5.5vw] leading-tight tracking-[-0.03em] text-[#241611] uppercase">
          We strip away the superfluous until only aroma, light, and raw spatial substance remain.
        </h2>

        {/* Below text: a horizontal accent line (#5C3317) that animates its width from 0 to 100% (max-w 320px) on scroll-into-view */}
        <div className="w-full max-w-[320px] mx-auto mt-12 flex justify-center">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-[#5C3317]"
          />
        </div>

        <p className="font-mono text-[13px] text-[#735F53] uppercase tracking-widest mt-8">
          SPATIAL PURITY // ARTISANAL ROASTERY
        </p>
      </motion.div>
    </section>
  );
}
