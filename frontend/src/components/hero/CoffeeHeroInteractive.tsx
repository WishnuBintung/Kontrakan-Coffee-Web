"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Coffee,
  Flame,
  MapPin,
  Snowflake,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import type { HeroFlavor } from "@/lib/hero-flavors";
import type { InfoToko, Promo } from "@/lib/types";
import { computeLiveStatus, formatRupiahClient, type LiveStatus } from "@/lib/store";
import { ease, lerp, mixHex, tween, type TweenHandle } from "@/lib/tween";
import {
  CUP_CIRCUMFERENCE,
  CUP_LABEL_TILE,
  IcedCup,
  HotCup,
  Particle,
  TastingMeter,
} from "./HeroArt";

/* ------------------------------------------------------------------ */
/* Layout partikel melayang (biji kopi, daun matcha, es, kakao)       */
/* ------------------------------------------------------------------ */
type Slot = { top: number; left: number; size: number; opacity?: number; mobileHidden?: boolean };

const FG_SLOTS: Slot[] = [
  { top: 22, left: 28, size: 120, mobileHidden: true },
  { top: 62, left: 38, size: 68 },
  { top: 28, left: 68, size: 130, mobileHidden: true },
  { top: 16, left: 52, size: 80 },
  { top: 76, left: 18, size: 74 },
  { top: 48, left: 78, size: 100, mobileHidden: true },
];

const BG_SLOTS: Slot[] = [
  { top: 18, left: 42, size: 56, opacity: 0.7 },
  { top: 52, left: 58, size: 48, opacity: 0.6 },
  { top: 82, left: 32, size: 52, opacity: 0.7 },
];

const FAR_SLOTS: Slot[] = [
  { top: 12, left: 16, size: 42 },
  { top: 42, left: 82, size: 84, opacity: 0.4 },
  { top: 72, left: 72, size: 58 },
  { top: 86, left: 22, size: 76, opacity: 0.35 },
];

const FLOAT_DUR = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];

function floatOffset(i: number, time: number) {
  const dur = FLOAT_DUR[i % FLOAT_DUR.length];
  const phase = (time + i * 0.7) * ((Math.PI * 2) / dur);
  return { y: Math.sin(phase) * 15, a: Math.cos(phase) * 6 };
}

type BeanState = {
  angle: number;
  baseX: number;
  baseY: number;
  rx: number;
  ry: number;
  tx: number;
  ty: number;
  rot: number;
  scale: number;
  opacity: number;
};

const FALLBACK_FLAVOR: HeroFlavor = {
  id: "es-kopi-susu",
  nama: "Es Kopi Susu Senja",
  harga: 18000,
  kategori: "kopi",
  deskripsi: "Espresso, susu segar, dan gula aren pilihan dengan rasa seimbang dan creamy.",
  theme: {
    bg: { inner: "#a0582a", mid: "#55290f", outer: "#170a04" },
    liquid: { top: "#ecd2ab", bottom: "#6b3a1e" },
    particle: "bean",
    tagline: ["Manis", "Aren"],
    shortName: "Es Kopi Susu",
    strawColor: "#fdba74",
    glaze: {
      base: "#452414",
      rim: "#d4a373",
      accent: "#f4a261",
      latteArt: "heart",
    },
  },
  tastingNotes: ["Double Shot Espresso", "Gula Aren Organik", "Fresh Milk Gurih"],
  profile: { sweetness: 4, boldness: 4, acidity: 2, aroma: 5 },
  supportsHot: true,
};

type Props = {
  flavors?: HeroFlavor[];
  infoToko: InfoToko;
  promoTerbaru?: Promo;
};

export function CoffeeHeroInteractive({ flavors: flavorsProp, infoToko, promoTerbaru }: Props) {
  const flavors = flavorsProp && flavorsProp.length > 0 ? flavorsProp : [FALLBACK_FLAVOR];
  const reduceMotion = useReducedMotion();

  // State menu rekomendasi terpilih
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [servingMode, setServingMode] = useState<"iced" | "hot">("iced");
  const [tapReaction, setTapReaction] = useState<string | null>(null);
  const [status, setStatus] = useState<LiveStatus | null>(null);

  const active = flavors[activeIndex] ?? FALLBACK_FLAVOR;
  const selected = flavors[selectedIndex] ?? FALLBACK_FLAVOR;

  // CSS variable awal
  const [initialBg] = useState(() => (flavors[0] ?? FALLBACK_FLAVOR).theme.bg);

  /* ---------------------------- refs ---------------------------- */
  const sectionRef = useRef<HTMLElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const cupTiltRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<SVGGElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const beanRefs = useRef<(HTMLDivElement | null)[]>([]);
  const farItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const beanCount = FG_SLOTS.length + BG_SLOTS.length;
  const beans = useRef<BeanState[]>([]);
  if (beans.current.length === 0) {
    beans.current = Array.from({ length: beanCount }, (_, i) => ({
      angle: (i * 137.5) % 360,
      baseX: 0,
      baseY: 0,
      rx: 0,
      ry: 0,
      tx: 0,
      ty: 0,
      rot: 0,
      scale: 1,
      opacity: 1,
    }));
  }

  const mouse = useRef({ x: 0, y: 0, px: -9999, py: -9999 });
  const smooth = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const blur = useRef(0);
  const switching = useRef(false);
  const currentBg = useRef({ ...initialBg });
  const tweens = useRef<TweenHandle[]>([]);

  /* ----------------------- status buka (WIB) ---------------------- */
  useEffect(() => {
    const update = () => setStatus(computeLiveStatus(infoToko.jam_buka));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [infoToko.jam_buka]);

  /* --------------------------- helpers --------------------------- */
  const applyBg = useCallback((bg: { inner: string; mid: string; outer: string }) => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--hero-inner", bg.inner);
    el.style.setProperty("--hero-mid", bg.mid);
    el.style.setProperty("--hero-outer", bg.outer);
    currentBg.current = { ...bg };
  }, []);

  /* ------------------- pointer: tilt + repulsion ------------------ */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
      mouse.current.px = e.clientX;
      mouse.current.py = e.clientY;
    };
    const onLeave = () => {
      mouse.current.px = -9999;
      mouse.current.py = -9999;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ---------------------- main animation loop --------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reduceMotion) {
      beanRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotate(${beans.current[i].angle}deg)`;
      });
      return;
    }

    let raf = 0;
    let running = false;

    const tick = () => {
      const time = performance.now() / 1000;
      const m = mouse.current;
      const s = smooth.current;
      s.x += (m.x - s.x) * 0.05;
      s.y += (m.y - s.y) * 0.05;

      // 1. Tilt gelas / cangkir mengikuti kursor + spin
      const theta = s.x * 40 + spin.current;
      const off = (theta / 360) * CUP_CIRCUMFERENCE;
      const tx = -(((off % CUP_LABEL_TILE) + CUP_LABEL_TILE) % CUP_LABEL_TILE);
      labelRef.current?.setAttribute("transform", `translate(${tx} 0)`);
      if (cupTiltRef.current) {
        cupTiltRef.current.style.transform = `perspective(1200px) rotateX(${-s.y * 18}deg) rotateY(${s.x * 16}deg) rotateZ(${6 + s.x * 5}deg)`;
        cupTiltRef.current.style.filter = blur.current > 0.05 ? `blur(${blur.current}px)` : "none";
      }

      // 2. Parallax layers
      if (fgRef.current) fgRef.current.style.transform = `translate3d(${s.x * 50}px, ${s.y * 50}px, 0)`;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${s.x * -25}px, ${s.y * -25}px, 0)`;
      if (farRef.current) farRef.current.style.transform = `translate3d(${s.x * -12}px, ${s.y * -12}px, 0)`;

      // 3. Partikel: gaya tolak kursor + float
      beanRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = beans.current[i];
        if (!switching.current) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          const dx = m.px - (r.left + r.width / 2);
          const dy = m.py - (r.top + r.height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          let trx = 0;
          let tryy = 0;
          let speed = 1;
          if (dist < 380) {
            const force = (380 - dist) / 380;
            trx = (dx / dist) * force * -75;
            tryy = (dy / dist) * force * -75;
            speed = 1 + force * 4.5;
          }
          b.rx += (trx - b.rx) * 0.1;
          b.ry += (tryy - b.ry) * 0.1;
          b.angle += 0.2 * speed;
          const f = floatOffset(i, time);
          b.tx = b.rx + b.baseX;
          b.ty = b.ry + b.baseY + f.y;
          b.rot = b.angle + f.a;
          b.scale = 1;
          b.opacity = 1;
        }
        el.style.transform = `translate3d(${b.tx}px, ${b.ty}px, 0) rotate(${b.rot}deg) scale(${b.scale})`;
        el.style.opacity = String(Math.max(0, Math.min(1, b.opacity)));
      });

      // 4. Objek latar jauh
      farItemRefs.current.forEach((el, i) => {
        if (!el) return;
        const dur = 10 + i * 2;
        const phase = (time + i * 1.2) * ((Math.PI * 2) / dur);
        el.style.transform = `translate(${Math.cos(phase * 0.5) * 15}px, ${Math.sin(phase) * 18}px) rotate(${Math.sin(phase * 0.3) * 12}deg)`;
      });

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(section);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduceMotion]);

  /* ----------------- gelembung aroma latar belakang ---------------- */
  useEffect(() => {
    if (reduceMotion) return;
    const container = bubblesRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(section);

    const interval = typeof window !== "undefined" && window.innerWidth < 768 ? 800 : 450;
    const id = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const bubble = document.createElement("span");
      const size = Math.random() * 18 + 8;
      const duration = Math.random() * 6 + 4;
      bubble.className = "hero-bubble";
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.setProperty("--bubble-opacity", String(Math.random() * 0.35 + 0.15));
      bubble.style.setProperty("--bubble-duration", `${duration}s`);
      container.appendChild(bubble);
      window.setTimeout(() => bubble.remove(), duration * 1000);
    }, interval);

    return () => {
      window.clearInterval(id);
      io.disconnect();
      container.replaceChildren();
    };
  }, [reduceMotion]);

  useEffect(() => () => tweens.current.forEach((t) => t.cancel()), []);

  /* ------------------- koreografi ganti menu ---------------------- */
  const switchFlavor = useCallback(
    (nextIndex: number) => {
      if (switching.current || nextIndex === selectedIndex) return;
      const next = flavors[nextIndex];
      setSelectedIndex(nextIndex);

      // Bila menu berikutnya tidak mendukung panas (mis. cold brew), kembalikan ke dingin
      if (!next.supportsHot && servingMode === "hot") {
        setServingMode("iced");
      }

      if (reduceMotion) {
        setActiveIndex(nextIndex);
        applyBg(next.theme.bg);
        return;
      }

      switching.current = true;
      setIsSwitching(true);
      const run = (t: TweenHandle) => tweens.current.push(t);

      // 1. Morph warna latar bertahap
      const fromBg = { ...currentBg.current };
      run(
        tween({
          duration: 1.4,
          ease: ease.power2InOut,
          onUpdate: (p) =>
            applyBg({
              inner: mixHex(fromBg.inner, next.theme.bg.inner, p),
              mid: mixHex(fromBg.mid, next.theme.bg.mid, p),
              outer: mixHex(fromBg.outer, next.theme.bg.outer, p),
            }),
        })
      );

      // 2. Putaran 360 gelas di puncak transisi
      run(
        tween({
          duration: 0.55,
          ease: ease.power2In,
          onUpdate: (p) => {
            spin.current = 360 * p;
            blur.current = 12 * p;
          },
          onComplete: () => {
            setActiveIndex(nextIndex);
            run(
              tween({
                duration: 1.3,
                ease: ease.backOut(0.7),
                onUpdate: (p) => {
                  spin.current = 360 + 360 * p;
                  blur.current = Math.max(0, 12 * (1 - p));
                },
                onComplete: () => {
                  spin.current = 0;
                  blur.current = 0;
                },
              })
            );
          },
        })
      );

      // 3. Partikel implode & explode
      let done = 0;
      const els = beanRefs.current;
      const total = els.filter(Boolean).length;
      els.forEach((el, i) => {
        if (!el) return;
        const b = beans.current[i];
        const layer = el.parentElement;
        const lw = layer?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1000);
        const lh = layer?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 800);
        const cx = lw / 2 - el.offsetLeft - el.offsetWidth / 2;
        const cy = lh / 2 - el.offsetTop - el.offsetHeight / 2;
        const x0 = b.tx;
        const y0 = b.ty;
        const r0 = b.rot;
        const nx = (Math.random() - 0.5) * 180;
        const ny = (Math.random() - 0.5) * 180;

        run(
          tween({
            duration: 0.45,
            ease: ease.power2In,
            onUpdate: (p) => {
              b.tx = lerp(x0, cx, p);
              b.ty = lerp(y0, cy, p);
              b.rot = r0 + 45 * p;
              b.scale = lerp(1, 0.1, p);
              b.opacity = 1 - p;
            },
            onComplete: () => {
              run(
                tween({
                  delay: 0.25,
                  duration: 0.85,
                  ease: ease.backOut(1.4),
                  onUpdate: (p) => {
                    b.tx = lerp(cx, nx, p);
                    b.ty = lerp(cy, ny, p);
                    b.rot = r0 + 45 + 45 * p;
                    b.scale = lerp(0.1, 1, p);
                    b.opacity = p;
                  },
                  onComplete: () => {
                    const f = floatOffset(i, performance.now() / 1000);
                    b.angle = r0 + 90 - f.a;
                    b.baseX = nx;
                    b.baseY = ny - f.y;
                    b.rx = 0;
                    b.ry = 0;
                    done += 1;
                    if (done === total) {
                      switching.current = false;
                      setIsSwitching(false);
                      tweens.current = [];
                    }
                  },
                })
              );
            },
          })
        );
      });

      if (total === 0) {
        switching.current = false;
        setIsSwitching(false);
      }
    },
    [applyBg, flavors, reduceMotion, selectedIndex, servingMode]
  );

  const scrollCardIntoView = (i: number) => {
    const c = carouselRef.current;
    const card = cardRefs.current[i];
    if (!c || !card) return;
    c.scrollTo({
      left: card.offsetLeft - c.clientWidth / 2 + card.clientWidth / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const step = (dir: 1 | -1) => {
    if (switching.current) return;
    const n = flavors.length;
    const next = (selectedIndex + dir + n) % n;
    switchFlavor(next);
    scrollCardIntoView(next);
  };

  // Reaksi interaktif saat cangkir diklik / diketuk
  const handleCupTap = () => {
    if (tapReaction) return;
    const reactions = [
      "✨ Double shot espresso berpadu sempurna!",
      "🌿 Diracik segar oleh barista Senja!",
      "🍯 Gula aren murni organik tercium harum!",
      "☕ Nikmat diminum santai saat senja!",
    ];
    const chosen = reactions[Math.floor(Math.random() * reactions.length)];
    setTapReaction(chosen);
    window.setTimeout(() => setTapReaction(null), 2400);
  };

  const particle = active.theme.particle;
  const minPrice = useMemo(() => Math.min(...flavors.map((f) => f.harga)), [flavors]);

  return (
    <section
      id="beranda"
      ref={sectionRef}
      aria-label="Kopi Senja — Beranda & Menu Rekomendasi"
      className="relative isolate overflow-hidden text-white min-h-[100svh] flex flex-col justify-between pt-24 pb-8 transition-colors duration-1000"
      style={
        {
          "--hero-inner": initialBg.inner,
          "--hero-mid": initialBg.mid,
          "--hero-outer": initialBg.outer,
          background:
            "radial-gradient(circle at 50% 50%, var(--hero-inner) 0%, var(--hero-mid) 50%, var(--hero-outer) 100%)",
        } as React.CSSProperties
      }
    >
      {/* Gelembung Uap Aroma */}
      <div ref={bubblesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />

      {/* Partikel Lapis Jauh */}
      <div ref={farRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 will-change-transform">
        {FAR_SLOTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              farItemRefs.current[i] = el;
            }}
            className="absolute blur-[1.5px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, opacity: s.opacity ?? 0.8 }}
          >
            <Particle kind={particle} className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Partikel Belakang Gelas */}
      <div ref={bgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] will-change-transform">
        {BG_SLOTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              beanRefs.current[FG_SLOTS.length + i] = el;
            }}
            className="absolute drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          >
            <div className="h-full w-full" style={{ opacity: s.opacity ?? 1 }}>
              <Particle kind={particle} className="h-full w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Container Utama Dua Sisi */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 my-auto">
        {/* ==================== SISI KIRI: Headline & Value Proposition ==================== */}
        <div className="w-full lg:max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 pt-4 lg:pt-0">
          {/* Status Buka Toko Real-Time WIB */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              {status?.isOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  status ? (status.isOpen ? "bg-emerald-400" : "bg-rose-400") : "bg-white/60"
                }`}
              />
            </span>
            <span className="text-white/90">
              {status ? `${status.label} • Sleman, DIY` : "Coffee & Space • Sleman"}
            </span>
          </div>

          {/* Main Headline (Aturan Anti-Slop: <= 2 baris) */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            Secangkir Cerita, <br className="hidden sm:inline" />
            di Setiap <span className="text-senja-soft underline decoration-amber-500/40 decoration-wavy underline-offset-8">Suasana Senja.</span>
          </h1>

          {/* Subheadline (Jelas, Jujur, Bersahabat Mahasiswa) */}
          <p className="max-w-lg text-base sm:text-lg leading-relaxed text-white/85">
            Tempat rehat, ngopi, dan nugas nyaman di Sleman. Menyajikan biji kopi nusantara pilihan, camilan hangat, WiFi kencang, dan colokan di tiap meja dengan harga ramah mahasiswa.
          </p>

          {/* Tombol Aksi Utama (CTA Standar Web, Bukan Pemesanan) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 w-full sm:w-auto">
            <Link
              href="#menu"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-3 text-sm shadow-lg hover:shadow-amber-500/25 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Coffee className="w-4 h-4 text-stone-950" />
              <span>Lihat Menu & Harga</span>
              <ArrowDown className="w-4 h-4 text-stone-950 ml-0.5 animate-bounce" />
            </Link>

            <a
              href={infoToko.link_peta}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 text-sm backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
            >
              <MapPin className="w-4 h-4 text-senja-soft" />
              <span>Petunjuk Arah</span>
            </a>
          </div>

          {/* Banner Promo Ringkas (Bila Ada Promo Aktif) */}
          {promoTerbaru && (
            <div className="w-full max-w-lg p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold text-xs">
                  %
                </span>
                <div className="text-xs">
                  <p className="font-bold text-white line-clamp-1">{promoTerbaru.judul}</p>
                  <p className="text-white/70 line-clamp-1 text-[11px]">{promoTerbaru.deskripsi}</p>
                </div>
              </div>
              <a
                href="#promo"
                className="text-[11px] font-bold text-senja-soft hover:underline shrink-0"
              >
                Cek Promo →
              </a>
            </div>
          )}

          {/* Nilai Tambah Pelajar & Mahasiswa */}
          <div className="pt-4 border-t border-white/15 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/80">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <span>WiFi Cepat & Colokan</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <span>100% Kopi Nusantara</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Mulai {formatRupiahClient(minPrice)}</span>
            </div>
          </div>
        </div>

        {/* ==================== SISI TENGAH & KANAN: Model 3D & Showcase Menu Rekomendasi ==================== */}
        <div className="w-full lg:max-w-xl flex flex-col items-center justify-center relative">
          {/* Stage Model Kopi Interaktif */}
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center select-none py-4">
            {/* Glow Ambient di Sekeliling Gelas */}
            <div
              className="absolute inset-4 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10"
              style={{
                background: `radial-gradient(circle, ${active.theme.bg.inner} 0%, transparent 70%)`,
                opacity: 0.6,
              }}
            />

            {/* Objek Cangkir 3D Interaktif */}
            <div
              role="button"
              tabIndex={0}
              aria-label={`Model cangkir 3D ${active.nama}. Ketuk untuk reaksi rasa.`}
              onClick={handleCupTap}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCupTap();
                }
              }}
              className="relative z-20 cursor-pointer active:scale-95 transition-transform duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-3xl"
            >
              <div ref={cupTiltRef} className="will-change-transform flex items-center justify-center">
                {servingMode === "iced" ? (
                  <IcedCup
                    theme={active.theme}
                    labelRef={labelRef}
                    className="h-[310px] sm:h-[360px] w-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
                    title={active.nama}
                  />
                ) : (
                  <HotCup
                    theme={active.theme}
                    className="h-[270px] sm:h-[310px] w-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
                    title={`${active.nama} (Hangat)`}
                  />
                )}
              </div>

              {/* Toast Reaksi Ketuk */}
              <AnimatePresence>
                {tapReaction && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-stone-900/90 border border-amber-400/40 px-3.5 py-1 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md pointer-events-none z-40"
                  >
                    {tapReaction}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hint Interaksi Cangkir */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] uppercase font-bold tracking-wider text-white/50 whitespace-nowrap">
              Gerakkan kursor • Ketuk cangkir
            </div>
          </div>

          {/* Kotak Kontrol & Detail Menu Rekomendasi Terpilih */}
          <div className="w-full max-w-lg mt-2 p-5 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col gap-4 text-left">
            {/* Header Kontrol: Pilihan Menu & Mode Suhu */}
            <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  Menu Rekomendasi Barista
                </span>
                <h2 className="font-heading text-lg font-bold text-white leading-tight">
                  {selected.nama}
                </h2>
              </div>

              {/* Switcher Suhu Minuman: Dingin (Es) vs Hangat (Cangkir) */}
              <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/15 shrink-0">
                <button
                  type="button"
                  onClick={() => setServingMode("iced")}
                  aria-pressed={servingMode === "iced"}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    servingMode === "iced"
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>Dingin</span>
                </button>

                <button
                  type="button"
                  disabled={!selected.supportsHot}
                  onClick={() => setServingMode("hot")}
                  aria-pressed={servingMode === "hot"}
                  title={
                    selected.supportsHot
                      ? "Sajikan hangat"
                      : "Menu ini khusus diseduh dingin 16 jam"
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    !selected.supportsHot
                      ? "opacity-40 cursor-not-allowed text-white/40"
                      : servingMode === "hot"
                      ? "bg-amber-500 text-stone-950 shadow-xs cursor-pointer"
                      : "text-white/70 hover:text-white cursor-pointer"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hangat</span>
                </button>
              </div>
            </div>

            {/* Carousel Kartu Pilihan Menu (5 Menu Rekomendasi CMS) */}
            <div className="relative">
              <div
                ref={carouselRef}
                role="region"
                aria-label="Daftar Menu Rekomendasi"
                className="no-scrollbar flex items-center gap-2.5 overflow-x-auto py-1 scroll-smooth snap-x"
              >
                {flavors.map((item, idx) => {
                  const isCurrent = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      type="button"
                      aria-pressed={isCurrent}
                      onClick={() => {
                        switchFlavor(idx);
                        scrollCardIntoView(idx);
                      }}
                      disabled={isSwitching}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold shrink-0 snap-start transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-white/20 border-amber-400 text-white shadow-md scale-102"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.theme.liquid.top }}
                      />
                      <span className="truncate max-w-[110px]">{item.theme.shortName}</span>
                      <span className="text-[10px] opacity-80 font-mono">
                        {formatRupiahClient(item.harga)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tombol Geser Prev / Next */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-white/60">
                  {selectedIndex + 1} dari {flavors.length} menu andalan
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    disabled={isSwitching}
                    aria-label="Menu andalan sebelumnya"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-all disabled:opacity-40"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    disabled={isSwitching}
                    aria-label="Menu andalan berikutnya"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-all disabled:opacity-40"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Flavor Notes & Bar Sensori Rasa */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              {/* Tasting Notes Chips */}
              <div className="flex flex-wrap gap-1.5">
                {selected.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="text-[11px] bg-white/10 text-amber-200/90 border border-white/10 px-2.5 py-0.5 rounded-md font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Bar Sensori Profil Rasa */}
              <TastingMeter profile={selected.profile} />

              {/* Harga & Deskripsi Singkat */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <p className="text-xs text-white/75 line-clamp-2 leading-relaxed">
                  {selected.deskripsi}
                </p>
                <div className="text-right shrink-0">
                  <span className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Harga
                  </span>
                  <span className="font-heading text-lg font-extrabold text-amber-300">
                    {formatRupiahClient(selected.harga)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partikel Lapis Depan (Melayang di Atas) */}
      <div ref={fgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 will-change-transform">
        {FG_SLOTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              beanRefs.current[i] = el;
            }}
            className={`absolute drop-shadow-[0_10px_22px_rgba(0,0,0,0.35)] ${s.mobileHidden ? "hidden md:block" : ""}`}
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          >
            <Particle kind={particle} className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Petunjuk Gulir ke Bawah */}
      <div className="relative z-20 mx-auto pt-6 text-center">
        <a
          href="#menu"
          aria-label="Gulir ke daftar menu lengkap"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <span>Gulir untuk melihat seluruh menu</span>
          <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
