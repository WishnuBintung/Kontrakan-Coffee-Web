"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  specs: string;
  notes: string[];
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1C1A18]/70 backdrop-blur-sm"
          />

          {/* Modal Container: Kanvas Krem Hangat #E8E3D9 dengan elemen Hijau Zaitun #5B6653 */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#E8E3D9] text-[#1C1A18] border border-[#D6CFC2] shadow-2xl z-10 flex flex-col sharp-edges"
          >
            {/* Header bar: Surface Hijau Zaitun #5B6653 */}
            <div className="flex items-center justify-between p-6 md:p-8 bg-[#5B6653] text-[#E8E3D9] border-b border-[#4D5746]">
              <span className="font-mono text-[14px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                {project.category}
              </span>
              <button
                onClick={onClose}
                className="p-1 text-[#E8E3D9] hover:text-[#D99C5B] transition-colors focus:outline-none"
                aria-label="Close project modal"
              >
                <X className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body: Kanvas Krem #E8E3D9 */}
            <div className="p-6 md:p-10 space-y-8 bg-[#E8E3D9]">
              {/* Image Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#5B6653] border border-[#D6CFC2] sharp-edges">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>

              {/* Title & Year */}
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[#D6CFC2] pb-6">
                <h3 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-[-0.03em] text-[#1C1A18]">
                  {project.title}
                </h3>
                <span className="font-mono text-[14px] text-[#666158] tracking-widest uppercase">
                  YEAR // {project.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-[19px] font-light tracking-tight text-[#1C1A18]/90 leading-relaxed font-sans max-w-2xl">
                {project.description}
              </p>

              {/* Specs & Characteristics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D6CFC2]">
                <div className="bg-[#5B6653]/10 border border-[#D6CFC2] p-5">
                  <span className="font-mono text-[12px] uppercase tracking-widest text-[#5B6653] block mb-2 font-bold">
                    SPECIFICATIONS
                  </span>
                  <p className="font-mono text-[14px] text-[#1C1A18]">
                    {project.specs}
                  </p>
                </div>
                <div className="bg-[#5B6653]/10 border border-[#D6CFC2] p-5">
                  <span className="font-mono text-[12px] uppercase tracking-widest text-[#5B6653] block mb-2 font-bold">
                    KEY ELEMENTS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.notes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 text-[13px] font-mono bg-[#5B6653] border border-[#4D5746] text-[#E8E3D9]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Amber Gold #D99C5B */}
              <div className="pt-6 flex justify-between items-center border-t border-[#D6CFC2]">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#D99C5B] text-[#1C1A18] font-bold text-[16px] tracking-tight uppercase hover:bg-[#C08343] transition-colors sharp-edges shadow-md"
                >
                  <span>Inquire About Project</span>
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </a>
                <span className="font-mono text-[12px] text-[#666158] uppercase">
                  ARCHIVE // FEATURED
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
