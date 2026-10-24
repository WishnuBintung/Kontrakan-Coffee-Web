"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectItem, ProjectModal } from "./ProjectModal";

const PROJECTS: ProjectItem[] = [
  {
    id: "monolith-haus",
    title: "MONOLITH HAUS",
    category: "01 // ARCHITECTURAL VOLUME",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    description:
      "A monumental private residence sculpted from board-formed obsidian concrete. Strategic deep light wells cast moving chiaroscuro shadows across monolithic stone planes throughout the day.",
    specs: "Board-Formed Concrete / Monolithic / Light Wells",
    notes: ["Brutalism", "Obsidian Core", "Planar Balance"],
  },
  {
    id: "chroma-zero",
    title: "CHROMA ZERO",
    category: "02 // SPATIAL EXHIBITION",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
    description:
      "A high-contrast gallery installation engineered with zero ambient reflection. An architectural study in absolute shadow, focused aperture lighting, and visceral sensory deprivation.",
    specs: "Zero Reflection / Calibrated Lux / Spatial Void",
    notes: ["Ultra-Matte", "Aperture Study", "Pure Silence"],
  },
  {
    id: "kinetic-sculpture",
    title: "KINETIC MATRIX",
    category: "03 // EXPERIMENTAL SCENOGRAPHY",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop",
    description:
      "A suspended geometric tensegrity structure made of carbon fiber rods and counterweighted pivots. Modulates its spatial envelope in real time based on environmental airflow and visitor acoustics.",
    specs: "Carbon Tensegrity / Harmonic Pacing / Dynamic Shadow",
    notes: ["Fluid Form", "Acoustic Shift", "Tension System"],
  },
  {
    id: "aether-pavilion",
    title: "AETHER PAVILION",
    category: "04 // TEMPORARY MONOLITH",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    description:
      "A public pavilion featuring an unpolished basalt foundation topped by an ultra-thin cantilevered blackened steel roof plane. Celebrates architectural permanence and razor-sharp geometry.",
    specs: "Basalt Foundation / Planar Steel / Razor Edges",
    notes: ["Basalt Core", "Planar Canopy", "Geometric Rigor"],
  },
];

export function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <>
      <section
        id="works"
        className="w-full bg-[#FFFFFF] text-[#000000] py-24 px-6 relative sharp-edges"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 md:mb-24">
            <span className="font-mono text-[14px] text-[#888] uppercase tracking-widest block mb-4">
              [01 // SELECTED PORTFOLIO]
            </span>

            {/* Heading: 'SELECTED WORKS' in 8vw Black weight, 'WORKS' in italic Thin weight */}
            <h2 className="text-[8vw] leading-none tracking-[-0.03em] uppercase font-serif text-[#000000]">
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
                className="group relative aspect-[4/5] md:aspect-[16/10] bg-[#18181b] overflow-hidden cursor-pointer sharp-edges"
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
                {/* Image layer: scales 1.05 on hover */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-[0.75] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay to ensure contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/40 to-transparent pointer-events-none" />

                {/* Info layer: absolute bottom-0, p-10 (responsive p-6 md:p-10) */}
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex items-end justify-between z-10">
                  <div className="flex-1 pr-4">
                    {/* Metadata: translates Y from 4px to 0px on hover */}
                    <span className="font-mono text-[14px] text-[#888] uppercase tracking-widest block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-1 group-hover:translate-y-0">
                      {item.category}
                    </span>

                    {/* Title: 5xl font, transition from translateY(1rem) to 0 */}
                    <h3 className="font-serif font-black text-3xl md:text-5xl text-white uppercase tracking-[-0.03em] leading-tight mt-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-4 group-hover:translate-y-0">
                      {item.title}
                    </h3>
                  </div>

                  {/* Action button: white circle, fades from 0 to 1 opacity with 300ms duration */}
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 shadow-2xl">
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.2]" />
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
