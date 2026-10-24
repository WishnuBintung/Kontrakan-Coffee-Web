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
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-8 pointer-events-none mix-blend-difference">
        <nav className="w-full flex items-center justify-between text-white">
          {/* Brand Wordmark */}
          <a
            href="#"
            className="text-[18px] font-medium tracking-tight uppercase pointer-events-auto transition-opacity duration-300 hover:opacity-70 font-sans"
          >
            CINEMATIC NOIR
          </a>

          {/* Desktop Navigation: Horizontal flex with 3rem gap (gap-12) */}
          <div className="hidden md:flex items-center gap-12 pointer-events-auto">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[18px] font-medium tracking-tight uppercase transition-opacity duration-300 hover:opacity-70 font-sans"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile: Single Lucide 'Menu' icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden pointer-events-auto focus:outline-none transition-opacity duration-300 hover:opacity-70"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[#000000] text-[#e5e5e5] px-6 py-8 flex flex-col justify-between sharp-edges"
          >
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-medium tracking-tight uppercase font-sans">
                CINEMATIC NOIR
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 focus:outline-none hover:opacity-70"
                aria-label="Close Navigation Menu"
              >
                <X className="w-7 h-7 stroke-[1.8]" />
              </button>
            </div>

            <div className="flex flex-col gap-8 my-auto">
              <span className="font-mono text-[14px] uppercase tracking-widest text-[#888]">
                [NAVIGATION // INDEX]
              </span>
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-5xl font-black uppercase tracking-[-0.03em] hover:text-[#888] transition-colors"
                >
                  <span className="text-sm font-mono text-[#888] mr-3 font-normal">
                    0{idx + 1}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between text-sm font-mono text-[#888] gap-2">
              <span>GALLERY & ARCHITECTURAL ATELIER</span>
              <span>© 2026 CINEMATIC NOIR</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
