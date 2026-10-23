import Link from "next/link";
import { Coffee, MapPin, Clock, MessageCircle, Heart } from "lucide-react";
import type { InfoToko } from "@/lib/types";

interface FooterProps {
  infoToko: InfoToko;
}

export function Footer({ infoToko }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/40 border-t border-border mt-20 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/60">
          {/* Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                {infoToko.nama_toko}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Tempat berkumpul, bercerita, dan menikmati racikan kopi istimewa.
              Hadir untuk menemani setiap jeda dan senja Anda.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={infoToko.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground border border-border flex items-center justify-center text-muted-foreground transition-colors"
                aria-label="Instagram Kopi Senja"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${infoToko.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground border border-border flex items-center justify-center text-muted-foreground transition-colors"
                aria-label="WhatsApp Kopi Senja"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#menu" className="hover:text-foreground transition-colors">
                  Menu Digital
                </Link>
              </li>
              <li>
                <Link href="#galeri" className="hover:text-foreground transition-colors">
                  Galeri Suasana Kafe
                </Link>
              </li>
              <li>
                <Link href="#lokasi" className="hover:text-foreground transition-colors">
                  Jam Buka & Peta Lokasi
                </Link>
              </li>
              <li>
                <a
                  href="/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors text-xs text-muted-foreground/80"
                >
                  Panel Admin Toko
                </a>
              </li>
            </ul>
          </div>

          {/* Info Singkat */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Lokasi Kafe</h4>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
              <span>{infoToko.alamat}</span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Buka setiap hari (lihat jadwal lengkap di bawah)</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4 text-center sm:text-left">
          <p>© {currentYear} {infoToko.nama_toko}. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk penikmat kopi senja.
          </p>
        </div>
      </div>
    </footer>
  );
}

