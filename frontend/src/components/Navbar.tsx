"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Coffee, MessageCircle, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InfoToko } from "@/lib/types";

interface NavbarProps {
  infoToko: InfoToko;
}

export function Navbar({ infoToko }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waUrl = `https://wa.me/${infoToko.whatsapp}?text=Halo%20Kopi%20Senja,%20saya%20mau%20tanya-tanya%20info%20menu%20dan%20tempatnya`;

  return (
    <div className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Centered Long Island Container Navbar */}
      <header
        className={`w-full max-w-4xl transition-all duration-300 pointer-events-auto rounded-full border ${
          scrolled
            ? "bg-background/85 backdrop-blur-md shadow-md border-border/80 py-2.5 px-4 sm:px-6"
            : "bg-background/70 backdrop-blur-sm shadow-xs border-border/50 py-3 px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            aria-label="Kopi Senja Home"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">
              {infoToko.nama_toko}
            </span>
          </Link>

          {/* Navigation Links (Semua Section) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors cursor-pointer"
            >
              Beranda
            </Link>
            <Link
              href="#promo"
              className="px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors cursor-pointer"
            >
              Promo
            </Link>
            <Link
              href="#menu"
              className="px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors cursor-pointer"
            >
              Menu Digital
            </Link>
            <Link
              href="#galeri"
              className="px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors cursor-pointer"
            >
              Suasana Kafe
            </Link>
            <Link
              href="#lokasi"
              className="px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors cursor-pointer"
            >
              Jadwal & Lokasi
            </Link>
          </nav>

          {/* CTA Button & Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer rounded-full text-xs font-semibold px-4 h-8"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Tanya Kami
              </a>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full text-foreground hover:bg-secondary cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/60 mt-3 pt-3 pb-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-secondary text-foreground"
            >
              Beranda
            </Link>
            <Link
              href="#promo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-secondary text-foreground"
            >
              Promo & Kegiatan
            </Link>
            <Link
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-secondary text-foreground"
            >
              Menu Digital & Harga
            </Link>
            <Link
              href="#galeri"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-secondary text-foreground"
            >
              Suasana Kafe & Sudut Favorit
            </Link>
            <Link
              href="#lokasi"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-secondary text-foreground"
            >
              Jadwal Jam Buka & Lokasi Peta
            </Link>

            <div className="pt-2">
              <Button
                asChild
                className="w-full justify-center bg-primary text-primary-foreground rounded-full text-xs h-8"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-3.5 h-3.5 mr-2" />
                  Hubungi via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
