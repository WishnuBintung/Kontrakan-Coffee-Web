"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Works", href: "#works" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-5 bg-[#5B6653]/95 backdrop-blur-md border-b border-[#4D5746] transition-all">
        <nav className="max-w-7xl mx-auto w-full flex items-center justify-between text-[#E8E3D9]">
          {/* Brand Wordmark */}
          <a
            href="#"
            className="text-[18px] font-bold tracking-tight uppercase hover:text-[#D99C5B] transition-colors font-sans"
          >
            KONTRAKAN COFFEE
          </a>

          {/* Desktop Navigation: Horizontal flex with 3rem gap (gap-12) */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[17px] font-medium tracking-tight uppercase text-[#E8E3D9] hover:text-[#D99C5B] transition-colors font-sans"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile: Single Lucide 'Menu' icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-[#E8E3D9] hover:text-[#D99C5B] focus:outline-none transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay: Menggunakan Warna Sekunder Hijau Zaitun (#5B6653) untuk Panel Navigasi */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[#5B6653] text-[#E8E3D9] px-6 py-8 flex flex-col justify-between sharp-edges"
          >
            <div className="flex items-center justify-between border-b border-[#4D5746] pb-6">
              <span className="text-[18px] font-bold tracking-tight uppercase font-sans text-[#E8E3D9]">
                KONTRAKAN COFFEE
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#E8E3D9] hover:text-[#D99C5B] focus:outline-none transition-colors"
                aria-label="Close Navigation Menu"
              >
                <X className="w-7 h-7 stroke-[2]" />
              </button>
            </div>

            <div className="flex flex-col gap-8 my-auto">
              <span className="font-mono text-[14px] uppercase tracking-widest text-[#E8E3D9]/70">
                [NAVIGATION // INDEX]
              </span>
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-5xl font-black uppercase tracking-[-0.03em] text-[#E8E3D9] hover:text-[#D99C5B] transition-colors"
                >
                  <span className="text-sm font-mono text-[#D99C5B] mr-4 font-normal">
                    0{idx + 1}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="border-t border-[#4D5746] pt-6 flex flex-col sm:flex-row justify-between text-sm font-mono text-[#E8E3D9]/70 gap-2">
              <span>SPATIAL ATELIER & ROASTERY</span>
              <span>© 2026 KONTRAKAN COFFEE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
