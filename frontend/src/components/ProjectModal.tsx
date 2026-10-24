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
            className="fixed inset-0 bg-[#241611]/60 backdrop-blur-sm"
          />

          {/* Modal Container: Kanvas Putih #FFFFFF dengan elemen Krem #F5F0E6 */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] text-[#241611] border border-[#E6DDCF] shadow-2xl z-10 flex flex-col sharp-edges"
          >
            {/* Header bar: Surface Krem #F5F0E6 */}
            <div className="flex items-center justify-between p-6 md:p-8 bg-[#F5F0E6] border-b border-[#E6DDCF]">
              <span className="font-mono text-[14px] uppercase tracking-widest text-[#241611] font-medium">
                {project.category}
              </span>
              <button
                onClick={onClose}
                className="p-1 text-[#241611] hover:text-[#5C3317] transition-colors focus:outline-none"
                aria-label="Close project modal"
              >
                <X className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 space-y-8 bg-[#FFFFFF]">
              {/* Image Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F5F0E6] border border-[#E6DDCF] sharp-edges">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>

              {/* Title & Year */}
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[#E6DDCF] pb-6">
                <h3 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-[-0.03em] text-[#241611]">
                  {project.title}
                </h3>
                <span className="font-mono text-[14px] text-[#735F53] tracking-widest uppercase">
                  YEAR // {project.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-[19px] font-light tracking-tight text-[#241611]/90 leading-relaxed font-sans max-w-2xl">
                {project.description}
              </p>

              {/* Specs & Characteristics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E6DDCF]">
                <div className="bg-[#F5F0E6]/70 border border-[#E6DDCF] p-5">
                  <span className="font-mono text-[12px] uppercase tracking-widest text-[#735F53] block mb-2 font-medium">
                    SPECIFICATIONS
                  </span>
                  <p className="font-mono text-[14px] text-[#241611]">
                    {project.specs}
                  </p>
                </div>
                <div className="bg-[#F5F0E6]/70 border border-[#E6DDCF] p-5">
                  <span className="font-mono text-[12px] uppercase tracking-widest text-[#735F53] block mb-2 font-medium">
                    KEY ELEMENTS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.notes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 text-[13px] font-mono bg-[#F5F0E6] border border-[#E6DDCF] text-[#241611]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Roasted Coffee #5C3317 */}
              <div className="pt-6 flex justify-between items-center border-t border-[#E6DDCF]">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#5C3317] text-white font-medium text-[16px] tracking-tight uppercase hover:bg-[#432410] transition-colors sharp-edges shadow-md"
                >
                  <span>Inquire About Project</span>
                  <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                </a>
                <span className="font-mono text-[12px] text-[#735F53] uppercase">
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
