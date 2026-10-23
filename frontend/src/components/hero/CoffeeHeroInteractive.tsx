"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Award, MapPin, Plus, Wifi } from "lucide-react";
import type { HeroFlavor } from "@/lib/hero-flavors";
import type { InfoToko } from "@/lib/types";
import { computeLiveStatus, formatRupiahClient, type LiveStatus } from "@/lib/store";
import { ease, lerp, mixHex, tween, type TweenHandle } from "@/lib/tween";
import { CUP_CIRCUMFERENCE, CUP_LABEL_TILE, IcedCup, Particle } from "./HeroArt";

/* ------------------------------------------------------------------ */
/* Layout objek melayang — diadaptasi 1:1 dari konsep (b1–b9, l1–l4),  */
/* ukuran diskalakan agar proporsional untuk biji kopi.                */
/* ------------------------------------------------------------------ */
type Slot = { top: number; left: number; size: number; opacity?: number; mobileHidden?: boolean };

const FG_SLOTS: Slot[] = [
  { top: 25, left: 30, size: 132, mobileHidden: true },
  { top: 60, left: 42, size: 64 },
  { top: 30, left: 62, size: 150, mobileHidden: true },
  { top: 15, left: 48, size: 84 },
  { top: 75, left: 20, size: 72 },
  { top: 45, left: 75, size: 108, mobileHidden: true },
];
const BG_SLOTS: Slot[] = [
  { top: 15, left: 40, size: 52, opacity: 0.7 },
  { top: 50, left: 55, size: 46, opacity: 0.6 },
  { top: 80, left: 35, size: 48, opacity: 0.7 },
];
const FAR_SLOTS: Slot[] = [
  { top: 10, left: 15, size: 40 },
  { top: 40, left: 80, size: 90, opacity: 0.4 },
  { top: 70, left: 75, size: 56 },
  { top: 85, left: 20, size: 80, opacity: 0.3 },
];
const FLOAT_DUR = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];

/** Efek melayang per-objek (amplitudo 15px / 6deg, durasi berbeda per index — sesuai konsep). */
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
  // nilai yang terakhir dirender (dipakai saat transisi)
  tx: number;
  ty: number;
  rot: number;
  scale: number;
  opacity: number;
};

const FALLBACK_FLAVOR: HeroFlavor = {
  id: "es-kopi-susu",
  nama: "Es Kopi Susu",
  harga: 18000,
  kategori: "kopi",
  deskripsi: "Espresso, susu segar, dan gula aren pilihan.",
  theme: {
    bg: { inner: "#a0582a", mid: "#55290f", outer: "#170a04" },
    liquid: { top: "#ecd2ab", bottom: "#6b3a1e" },
    particle: "bean",
    tagline: ["Manis", "Aren"],
    shortName: "Es Kopi Susu",
  },
};

type Props = {
  flavors: HeroFlavor[];
  infoToko: InfoToko;
};

export function CoffeeHeroInteractive({ flavors: flavorsProp, infoToko }: Props) {
  const flavors = flavorsProp.length > 0 ? flavorsProp : [FALLBACK_FLAVOR];
  const reduceMotion = useReducedMotion();

  // selectedIndex → state UI kartu (langsung), activeIndex → visual (ditukar di puncak spin)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [status, setStatus] = useState<LiveStatus | null>(null);

  const active = flavors[activeIndex];
  const selected = flavors[selectedIndex];

  // CSS variable awal (stabil agar React tidak menimpa nilai imperatif)
  const [initialBg] = useState(() => flavors[0].theme.bg);

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
      angle: (i * 137.5) % 360, // deterministik (aman untuk hydration)
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
  const currentBg = useRef({ ...flavors[0].theme.bg });
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

  const floatAt = floatOffset;

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

    // Reduced motion: posisikan statis, tanpa loop
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

      // 1. Tilt gelas mengikuti kursor + spin transisi
      const theta = s.x * 40 + spin.current;
      const off = (theta / 360) * CUP_CIRCUMFERENCE;
      const tx = -(((off % CUP_LABEL_TILE) + CUP_LABEL_TILE) % CUP_LABEL_TILE);
      labelRef.current?.setAttribute("transform", `translate(${tx} 0)`);
      if (cupTiltRef.current) {
        cupTiltRef.current.style.transform = `perspective(1200px) rotateX(${-s.y * 20}deg) rotateY(${s.x * 14}deg) rotateZ(${8 + s.x * 6}deg)`;
        cupTiltRef.current.style.filter = blur.current > 0.05 ? `blur(${blur.current}px)` : "none";
      }

      // 2. Parallax layer
      if (fgRef.current) fgRef.current.style.transform = `translate3d(${s.x * 60}px, ${s.y * 60}px, 0)`;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${s.x * -30}px, ${s.y * -30}px, 0)`;
      if (farRef.current) farRef.current.style.transform = `translate3d(${s.x * -15}px, ${s.y * -15}px, 0)`;

      // 3. Biji kopi: repulsion + float (atau nilai tween saat transisi)
      beanRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = beans.current[i];
        if (!switching.current) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return; // tersembunyi (mobile)
          const dx = m.px - (r.left + r.width / 2);
          const dy = m.py - (r.top + r.height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          let trx = 0;
          let tryy = 0;
          let speed = 1;
          if (dist < 400) {
            const force = (400 - dist) / 400;
            trx = (dx / dist) * force * -80;
            tryy = (dy / dist) * force * -80;
            speed = 1 + force * 5;
          }
          b.rx += (trx - b.rx) * 0.1;
          b.ry += (tryy - b.ry) * 0.1;
          b.angle += 0.2 * speed;
          const f = floatAt(i, time);
          b.tx = b.rx + b.baseX;
          b.ty = b.ry + b.baseY + f.y;
          b.rot = b.angle + f.a;
          b.scale = 1;
          b.opacity = 1;
        }
        el.style.transform = `translate3d(${b.tx}px, ${b.ty}px, 0) rotate(${b.rot}deg) scale(${b.scale})`;
        el.style.opacity = String(Math.max(0, Math.min(1, b.opacity)));
      });

      // 4. Objek jauh: selalu melayang
      farItemRefs.current.forEach((el, i) => {
        if (!el) return;
        const dur = 10 + i * 2;
        const phase = (time + i * 1.2) * ((Math.PI * 2) / dur);
        el.style.transform = `translate(${Math.cos(phase * 0.5) * 15}px, ${Math.sin(phase) * 20}px) rotate(${Math.sin(phase * 0.3) * 15}deg)`;
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

    // Hemat baterai: loop hanya jalan saat hero terlihat
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

  /* ------------------------ bubble generator ---------------------- */
  useEffect(() => {
    if (reduceMotion) return;
    const container = bubblesRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(section);

    const interval = window.innerWidth < 768 ? 700 : 400;
    const id = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const bubble = document.createElement("span");
      const size = Math.random() * 20 + 10;
      const duration = Math.random() * 6 + 4;
      bubble.className = "hero-bubble";
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.setProperty("--bubble-opacity", String(Math.random() * 0.4 + 0.2));
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

  // Bersihkan tween saat unmount
  useEffect(() => () => tweens.current.forEach((t) => t.cancel()), []);

  /* --------------------- koreografi ganti menu -------------------- */
  const switchFlavor = useCallback(
    (nextIndex: number) => {
      if (switching.current || nextIndex === selectedIndex) return;
      const next = flavors[nextIndex];
      setSelectedIndex(nextIndex);

      if (reduceMotion) {
        setActiveIndex(nextIndex);
        applyBg(next.theme.bg);
        return;
      }

      switching.current = true;
      setIsSwitching(true);
      const run = (t: TweenHandle) => tweens.current.push(t);

      // 1. Morph warna latar (1.5s power2.inOut)
      const fromBg = { ...currentBg.current };
      run(
        tween({
          duration: 1.5,
          ease: ease.power2InOut,
          onUpdate: (p) =>
            applyBg({
              inner: mixHex(fromBg.inner, next.theme.bg.inner, p),
              mid: mixHex(fromBg.mid, next.theme.bg.mid, p),
              outer: mixHex(fromBg.outer, next.theme.bg.outer, p),
            }),
        })
      );

      // 2. Gelas spin 360° + motion blur → tukar rasa di puncak → spin ke 720° (back.out)
      run(
        tween({
          duration: 0.6,
          ease: ease.power2In,
          onUpdate: (p) => {
            spin.current = 360 * p;
            blur.current = 15 * p;
          },
          onComplete: () => {
            setActiveIndex(nextIndex);
            run(
              tween({
                duration: 1.5,
                ease: ease.backOut(0.7),
                onUpdate: (p) => {
                  spin.current = 360 + 360 * p;
                  blur.current = Math.max(0, 15 * (1 - p));
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

      // 3. Biji kopi implode → tukar objek → explode ke posisi acak baru
      let done = 0;
      const els = beanRefs.current;
      const total = els.filter(Boolean).length;
      els.forEach((el, i) => {
        if (!el) return;
        const b = beans.current[i];
        const layer = el.parentElement;
        const lw = layer?.clientWidth ?? window.innerWidth;
        const lh = layer?.clientHeight ?? window.innerHeight;
        const cx = lw / 2 - el.offsetLeft - el.offsetWidth / 2;
        const cy = lh / 2 - el.offsetTop - el.offsetHeight / 2;
        const x0 = b.tx;
        const y0 = b.ty;
        const r0 = b.rot;
        const nx = (Math.random() - 0.5) * 200;
        const ny = (Math.random() - 0.5) * 200;

        run(
          tween({
            duration: 0.5,
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
                  delay: 0.3,
                  duration: 0.9,
                  ease: ease.backOut(1.5),
                  onUpdate: (p) => {
                    b.tx = lerp(cx, nx, p);
                    b.ty = lerp(cy, ny, p);
                    b.rot = r0 + 45 + 45 * p;
                    b.scale = lerp(0.1, 1, p);
                    b.opacity = p;
                  },
                  onComplete: () => {
                    const f = floatAt(i, performance.now() / 1000);
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
    [applyBg, flavors, reduceMotion, selectedIndex]
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

  /* ----------------------------- render ---------------------------- */
  const particle = active.theme.particle;
  const minPrice = useMemo(() => Math.min(...flavors.map((f) => f.harga)), [flavors]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const } },
  };

  return (
    <section
      id="beranda"
      ref={sectionRef}
      aria-label="Kopi Senja — menu rekomendasi"
      className="relative isolate overflow-hidden text-white min-h-[100svh]"
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
      {/* Bubbles */}
      <div ref={bubblesRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />

      {/* Objek jauh (paling belakang) */}
      <div ref={farRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 will-change-transform">
        {FAR_SLOTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              farItemRefs.current[i] = el;
            }}
            className="absolute blur-[1.5px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.25)]"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, opacity: s.opacity ?? 0.8 }}
          >
            <Particle kind={particle} className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Biji kopi belakang (di belakang gelas) */}
      <div ref={bgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] will-change-transform">
        {BG_SLOTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              beanRefs.current[FG_SLOTS.length + i] = el;
            }}
            className="absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          >
            <div className="h-full w-full" style={{ opacity: s.opacity ?? 1 }}>
              <Particle kind={particle} className="h-full w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-10 pt-28 sm:px-8 lg:flex-row lg:items-stretch lg:justify-between lg:px-[4%] lg:pb-0 lg:pt-24">
        {/* ---------------- Kolom kiri ---------------- */}
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="relative z-20 flex flex-col items-center gap-6 text-center lg:items-start lg:gap-7 lg:py-14 lg:text-left"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              {status?.isOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  status ? (status.isOpen ? "bg-emerald-400" : "bg-rose-400") : "bg-white/60"
                }`}
              />
            </span>
            <span>{status ? status.label : "Coffee & Space · Sleman"}</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(4.5rem,10vw,11rem)] font-normal leading-[0.8] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.25)]"
          >
            <span className="block">Ngopi</span>
            <span className="block text-senja-soft">Senja</span>
          </motion.h1>

          <motion.p variants={item} className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Tempat rehat, ngopi, dan nugas nyaman di Sleman — biji kopi nusantara, camilan hangat, dan harga
            ramah mahasiswa.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="#menu"
              className="btn-shine group inline-flex min-h-12 items-center gap-5 rounded-full bg-black/50 py-1.5 pl-6 pr-1.5 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/70"
            >
              Lihat Menu
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-senja-soft text-on-senja transition-transform duration-300 group-hover:rotate-90">
                <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
              </span>
            </Link>
            <a
              href={infoToko.link_peta}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Petunjuk Arah
            </a>
          </motion.div>

          <motion.div variants={item} className="hidden items-center gap-4 lg:mt-auto lg:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/5">
              <Award className="h-6 w-6 text-senja-soft" aria-hidden="true" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                Menu Rekomendasi
              </span>
              <span className="text-sm font-bold">
                {flavors.length} andalan barista · mulai {formatRupiahClient(minPrice)}
              </span>
            </div>
            <span className="mx-1 h-8 w-px bg-white/15" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 text-xs text-white/75">
              <Wifi className="h-4 w-4" aria-hidden="true" /> WiFi & colokan
            </span>
          </motion.div>
        </motion.div>

        {/* ---------------- Gelas tengah ---------------- */}
        <div
          className="pointer-events-none relative z-10 my-2 flex h-[340px] items-center justify-center sm:h-[420px] lg:absolute lg:inset-0 lg:my-0 lg:h-auto"
          aria-hidden="true"
        >
          <div className="absolute h-[70%] w-[70%] max-w-[620px] rounded-full bg-[radial-gradient(circle,rgba(253,186,116,0.18)_0%,transparent_65%)]" />
          <div className="hero-cup-stage">
            <div ref={cupTiltRef} className="will-change-transform" style={{ transform: "rotateZ(8deg)" }}>
              <IcedCup
                theme={active.theme}
                labelRef={labelRef}
                className="h-[300px] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)] sm:h-[380px] lg:h-[min(62vh,560px)]"
              />
            </div>
          </div>
        </div>

        {/* ---------------- Kolom kanan ---------------- */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative z-20 flex w-full flex-col items-center gap-6 lg:w-[460px] lg:items-end lg:justify-between lg:py-14 lg:text-right"
        >
          <div className="flex w-full flex-col items-center gap-4 lg:items-end">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Pilih menu andalan</p>

            <div
              ref={carouselRef}
              role="group"
              aria-label="Menu rekomendasi"
              aria-busy={isSwitching}
              className="no-scrollbar relative flex w-full max-w-[460px] snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pt-24"
            >
              {flavors.map((f, i) => {
                const isActive = i === selectedIndex;
                return (
                  <button
                    key={f.id}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${f.nama}, ${formatRupiahClient(f.harga)}`}
                    onClick={() => {
                      switchFlavor(i);
                      scrollCardIntoView(i);
                    }}
                    className={`group relative flex w-[140px] shrink-0 snap-center cursor-pointer flex-col items-center gap-4 rounded-[28px] border bg-white/5 px-3 pb-4 pt-16 text-center backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:border-white/40 hover:bg-white/12 ${
                      isActive ? "border-senja-soft bg-white/10" : "border-white/10"
                    }`}
                  >
                    <IcedCup
                      theme={f.theme}
                      className={`absolute -top-20 left-1/2 h-[140px] w-auto -translate-x-1/2 drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-6 group-hover:-rotate-12 group-hover:scale-110 ${
                        isActive ? "" : "brightness-75"
                      }`}
                    />
                    <span className="mt-6 flex w-full flex-col text-xs">
                      <span className="font-bold">{f.theme.shortName}</span>
                      <span className="text-white/70">{formatRupiahClient(f.harga)}</span>
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="hero-card-dot"
                        className="absolute bottom-1.5 h-1 w-6 rounded-full bg-senja-soft"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {flavors.length > 1 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Menu sebelumnya"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all duration-300 hover:-translate-x-0.5 hover:bg-white/15 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Menu berikutnya"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all duration-300 hover:translate-x-0.5 hover:bg-white/15 active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Info menu terpilih */}
            <div className="min-h-[72px] max-w-xs" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-sm font-bold">
                    {selected.nama} <span className="font-semibold text-senja-soft">· {formatRupiahClient(selected.harga)}</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/70">{selected.deskripsi}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Judul samping (berganti sesuai menu) */}
          <div className="hidden lg:block" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.h2
                key={active.id}
                className="font-display whitespace-nowrap text-right text-[clamp(4rem,8vw,9.5rem)] font-normal leading-[0.8]"
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                exit="exit"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.035 } },
                  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                }}
              >
                {active.theme.tagline.map((line, li) => (
                  <span key={li} className={`block ${li === 1 ? "text-senja-soft" : ""}`}>
                    {Array.from(line).map((ch, ci) => (
                      <motion.span
                        key={ci}
                        className="inline-block"
                        variants={{
                          hidden: { opacity: 0, y: "0.4em", rotate: 8 },
                          show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
                          exit: { opacity: 0, y: "-0.3em", transition: { duration: 0.2 } },
                        }}
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Biji kopi depan (di atas teks & gelas) */}
      <div ref={fgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 will-change-transform">
        {FG_SLOTS.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              beanRefs.current[i] = el;
            }}
            className={`absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${s.mobileHidden ? "hidden md:block" : ""}`}
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          >
            <Particle kind={particle} className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <a
        href="#menu"
        aria-label="Gulir ke menu"
        className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white lg:flex"
      >
        Gulir
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-white/70 to-transparent"
          animate={reduceMotion ? undefined : { scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </a>
    </section>
  );
}
