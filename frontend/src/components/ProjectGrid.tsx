"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectItem, ProjectModal } from "./ProjectModal";

const PROJECTS: ProjectItem[] = [
  {
    id: "monolith-roastery",
    title: "MONOLITH ROASTERY",
    category: "01 // ARCHITECTURAL ROASTERY",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    description:
      "A monumental roasting atelier sculpted from board-formed concrete and warm natural ash timber. Deep natural light wells illuminate precision roasting operations throughout the morning.",
    specs: "Board-Formed Concrete / Micro-Batch Roasting / Natural Light Wells",
    notes: ["Spatial Roastery", "Olive Bar Planes", "Amber Glow"],
  },
  {
    id: "chroma-brew-bar",
    title: "CHROMA SLOW BAR",
    category: "02 // SPATIAL TASTING",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
    description:
      "A minimalist pour-over gallery space engineered with calibrated ambient lux and acoustic dampening. Designed to isolate sensory perception for single-origin tasting flights.",
    specs: "Dark Olive Timber / Calibrated Lux / Acoustic Solitude",
    notes: ["Sensory Isolation", "Manual Extraction", "Warm Amber Lux"],
  },
  {
    id: "kinetic-sculpture",
    title: "KINETIC BREW LAB",
    category: "03 // EXPERIMENTAL EXTRACTION",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop",
    description:
      "A modular extraction bar featuring counterweighted siphon apparatus and architectural stainless steel work surfaces. Designed for rapid collaborative brewing experiments.",
    specs: "Brushed Steel / Siphon Matrix / Modular Workflows",
    notes: ["Fluid Workflow", "Thermal Stability", "Precision Extraction"],
  },
  {
    id: "aether-pavilion",
    title: "AETHER PAVILION",
    category: "04 // TEMPORARY MONOLITH",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    description:
      "An open-air coffee pavilion featuring an unpolished basalt foundation topped by an ultra-thin cantilevered canopy. Celebrates architectural permanence and outdoor community gathering.",
    specs: "Basalt Foundation / Planar Steel / Razor Edges",
    notes: ["Basalt Core", "Planar Canopy", "Community Space"],
  },
];

export function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <>
      <section
        id="works"
        className="w-full bg-[#E8E3D9] text-[#1C1A18] py-24 px-6 relative sharp-edges"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 md:mb-24">
            <span className="font-mono text-[14px] text-[#666158] uppercase tracking-widest block mb-4 font-medium">
              [01 // SELECTED PORTFOLIO]
            </span>

            {/* Heading: 'SELECTED WORKS' in 8vw Black weight, 'WORKS' in italic Thin weight, Warna #1C1A18 */}
            <h2 className="text-[8vw] leading-none tracking-[-0.03em] uppercase font-sans text-[#1C1A18]">
              <span className="font-black">SELECTED </span>
              <span className="font-thin italic">WORKS</span>
            </h2>
          </div>

          {/* Grid: 2-column layout with 2rem (gap-8) gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProject(item)}
                className="group relative bg-[#5B6653] border border-[#4D5746] overflow-hidden cursor-pointer sharp-edges flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-[#D99C5B]/50"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(item);
                  }
                }}
                aria-label={`View details for ${item.title}`}
              >
                {/* Image container: aspect 16/10 with zoom on hover */}
                <div className="relative aspect-[16/10] overflow-hidden w-full bg-[#5B6653]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale contrast-105 brightness-95 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>

                {/* Info area: Surface Hijau Zaitun #5B6653, Teks Krem #E8E3D9, Tombol Aksi Amber Gold #D99C5B */}
                <div className="p-6 md:p-8 bg-[#5B6653] flex items-center justify-between border-t border-[#4D5746]">
                  <div className="flex-1 pr-4">
                    <span className="font-mono text-[13px] text-[#D99C5B] uppercase tracking-widest block mb-1 font-medium">
                      {item.category}
                    </span>
                    <h3 className="font-sans font-black text-2xl md:text-3xl text-[#E8E3D9] uppercase tracking-[-0.03em] leading-tight group-hover:text-[#D99C5B] transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Action button: circular #D99C5B, charcoal icon #1C1A18, hover #C08343 */}
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#D99C5B] text-[#1C1A18] flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 group-hover:bg-[#C08343] group-hover:scale-105">
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
