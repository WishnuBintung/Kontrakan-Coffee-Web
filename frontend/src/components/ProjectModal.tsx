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
            className="fixed inset-0 bg-[#000000]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#09090b] text-[#e5e5e5] border border-white/10 z-10 flex flex-col sharp-edges"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10">
              <span className="font-mono text-[14px] uppercase tracking-widest text-[#888]">
                {project.category}
              </span>
              <button
                onClick={onClose}
                className="p-1 text-[#888] hover:text-white transition-colors focus:outline-none"
                aria-label="Close project modal"
              >
                <X className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 space-y-8">
              {/* Image Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#18181b] border border-white/5 sharp-edges">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>

              {/* Title & Year */}
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-white/10 pb-6">
                <h3 className="font-serif font-black text-4xl md:text-6xl uppercase tracking-[-0.03em] text-[#e5e5e5]">
                  {project.title}
                </h3>
                <span className="font-mono text-[14px] text-[#888] tracking-widest uppercase">
                  YEAR // {project.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-[20px] font-light tracking-tight text-white/80 leading-relaxed font-sans max-w-2xl">
                {project.description}
              </p>

              {/* Specs & Characteristics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div>
                  <span className="font-mono text-[12px] uppercase tracking-widest text-[#888] block mb-2">
                    SPECIFICATIONS
                  </span>
                  <p className="font-mono text-[15px] text-[#e5e5e5]">
                    {project.specs}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[12px] uppercase tracking-widest text-[#888] block mb-2">
                    KEY ELEMENTS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.notes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 text-[13px] font-mono border border-white/15 text-[#888]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 flex justify-between items-center">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black font-medium text-[16px] tracking-tight uppercase hover:bg-[#e5e5e5] transition-colors sharp-edges"
                >
                  <span>Inquire About Project</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
                <span className="font-mono text-[12px] text-[#888] uppercase">
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
