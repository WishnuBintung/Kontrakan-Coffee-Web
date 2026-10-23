import Link from "next/link";
import {
  Coffee,
  MapPin,
  Sparkles,
  Wifi,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoffeeHeroInteractive } from "@/components/CoffeeHeroInteractive";
import type { InfoToko, Promo } from "@/lib/types";

interface HeroSectionProps {
  infoToko: InfoToko;
  promoTerbaru?: Promo;
}

export function HeroSection({ infoToko, promoTerbaru }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28">
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-amber-500/10 via-orange-400/8 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* SISI KIRI: Headline, Value Proposition, & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs text-foreground font-medium shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Coffee & Space di Sleman, Yogyakarta</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Secangkir Cerita, <br className="hidden sm:inline" />
              di Setiap{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:to-orange-400">
                Suasana Senja.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Tempat rehat, ngopi, dan nugas nyaman di Sleman. Menyajikan biji kopi
              pilihan nusantara, camilan hangat, dan suasana syahdu dengan harga
              yang ramah mahasiswa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm"
              >
                <Link href="#menu">
                  Lihat Menu & Harga
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:bg-secondary text-foreground font-medium px-6 py-6 rounded-full transition-all duration-200 cursor-pointer text-sm"
              >
                <a
                  href={infoToko.link_peta}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                  Petunjuk Arah
                </a>
              </Button>
            </div>

            {/* Perk Badges (Target: Students & Pelajar) */}
            <div className="pt-4 border-t border-border/60 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Wifi className="w-3.5 h-3.5" />
                </div>
                <span>Free WiFi Cepat & Colokan</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <span>100% Kopi Nusantara</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Mulai Rp 15.000-an</span>
              </div>
            </div>
          </div>

          {/* SISI KANAN: Interactive 3D Cup & Repelling Coffee Beans (Konsep Layers Prompt) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <CoffeeHeroInteractive />
          </div>
        </div>
      </div>
    </section>
  );
}
