"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Star, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlavorItem {
  id: "kopi-susu" | "matcha";
  nama: "Es Kopi Susu Senja" | "Matcha Creamy Latte";
  kategori: string;
  harga: string;
  deskripsi: string;
  accentColor: string;
  glowColor: string;
  badge: string;
  cupColor: string;
  liquidColor: string;
}

const FLAVORS: FlavorItem[] = [
  {
    id: "kopi-susu",
    nama: "Es Kopi Susu Senja",
    kategori: "Signature Kopi",
    harga: "Rp 18.000",
    deskripsi: "Double shot espresso, susu segar creamy, & gula aren murni.",
    accentColor: "#D97706", // Amber 600
    glowColor: "rgba(217, 119, 6, 0.25)",
    badge: "Menu Rekomendasi No. 1",
    cupColor: "from-amber-800 to-amber-950",
    liquidColor: "#5B331A",
  },
  {
    id: "matcha",
    nama: "Matcha Creamy Latte",
    kategori: "Non-Kopi Favorit",
    harga: "Rp 22.000",
    deskripsi: "Matcha murni Uji, steamed fresh milk lembut, & sedikit vanila.",
    accentColor: "#65A30D", // Lime/Olive 600
    glowColor: "rgba(101, 163, 13, 0.25)",
    badge: "Pilihan Santai Sore",
    cupColor: "from-emerald-800 to-lime-950",
    liquidColor: "#3B5323",
  },
];

// Initial coffee beans positions around the central cup
const INITIAL_BEANS = [
  { id: 1, x: -140, y: -110, size: 28, rot: 25, z: 1 },
  { id: 2, x: 130, y: -90, size: 24, rot: -40, z: 2 },
  { id: 3, x: -160, y: 70, size: 26, rot: 60, z: 2 },
  { id: 4, x: 145, y: 80, size: 30, rot: -15, z: 1 },
  { id: 5, x: -80, y: -150, size: 20, rot: 80, z: 1 },
  { id: 6, x: 80, y: 140, size: 22, rot: -75, z: 2 },
  { id: 7, x: 0, y: -165, size: 18, rot: 15, z: 1 },
  { id: 8, x: -40, y: 155, size: 20, rot: 45, z: 1 },
];

export function CoffeeHeroInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorItem>(FLAVORS[0]);
  const [isSwitching, setIsSwitching] = useState(false);
  const [cupRotation, setCupRotation] = useState({ x: 0, y: 0, spin: 0 });
  const [blurAmount, setBlurAmount] = useState(0);

  // Mouse tracking states
  const mousePos = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  // Beans position and repulsion states
  const [beansState, setBeansState] = useState(
    INITIAL_BEANS.map((b) => ({
      ...b,
      currentX: b.x,
      currentY: b.y,
      repelX: 0,
      repelY: 0,
      scale: 1,
      opacity: 1,
    }))
  );

  // Handle Mouse movement inside or around container
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized coordinates (-1 to 1)
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    mousePos.current = {
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Main interactive animation loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      // 1. Smooth interpolation (lerp) for 3D cup tilt
      currentTilt.current.x += (mousePos.current.x - currentTilt.current.x) * 0.08;
      currentTilt.current.y += (mousePos.current.y - currentTilt.current.y) * 0.08;

      if (!isSwitching) {
        setCupRotation((prev) => ({
          ...prev,
          x: currentTilt.current.y * -18, // tilt up/down
          y: currentTilt.current.x * 24, // tilt left/right
        }));

        // 2. Coffee beans repulsion physics (force field like prompt)
        setBeansState((prevBeans) =>
          prevBeans.map((bean) => {
            const beanCanvasX = 200 + bean.x;
            const beanCanvasY = 200 + bean.y;

            const diffX = mousePos.current.px - beanCanvasX;
            const diffY = mousePos.current.py - beanCanvasY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            const repulsionRadius = 160;
            let targetRepelX = 0;
            let targetRepelY = 0;

            if (distance < repulsionRadius && distance > 0) {
              const force = (repulsionRadius - distance) / repulsionRadius;
              targetRepelX = (diffX / distance) * force * -45;
              targetRepelY = (diffY / distance) * force * -45;
            }

            // Lerp bean repulsion
            const rx = bean.repelX + (targetRepelX - bean.repelX) * 0.12;
            const ry = bean.repelY + (targetRepelY - bean.repelY) * 0.12;

            return {
              ...bean,
              repelX: rx,
              repelY: ry,
            };
          })
        );
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isSwitching]);

  // Switch flavor transition (choreographed spin + implode/explode beans)
  const handleFlavorSelect = (flavor: FlavorItem) => {
    if (isSwitching || selectedFlavor.id === flavor.id) return;
    setIsSwitching(true);

    // 1. Spin cup 360° with motion blur
    setBlurAmount(8);
    setCupRotation((prev) => ({ ...prev, spin: prev.spin + 360 }));

    // 2. Implode beans to center
    setBeansState((prev) =>
      prev.map((b) => ({
        ...b,
        repelX: -b.x * 0.85,
        repelY: -b.y * 0.85,
        scale: 0.1,
        opacity: 0,
      }))
    );

    // Peak transition (swap flavor)
    setTimeout(() => {
      setSelectedFlavor(flavor);
      setBlurAmount(0);

      // 3. Explode beans back with random scatter
      setBeansState((prev) =>
        prev.map((b) => ({
          ...b,
          repelX: (Math.random() - 0.5) * 40,
          repelY: (Math.random() - 0.5) * 40,
          scale: 1,
          opacity: 1,
        }))
      );

      setTimeout(() => {
        setIsSwitching(false);
      }, 600);
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg aspect-square flex items-center justify-center select-none"
    >
      {/* Dynamic Ambient Glow morphing on flavor switch */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10"
        style={{
          background: `radial-gradient(circle, ${selectedFlavor.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Steam / Aroma Particle Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl -z-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-500/10 blur-xs animate-bounce"
            style={{
              width: `${10 + i * 4}px`,
              height: `${10 + i * 4}px`,
              left: `${15 + i * 16}%`,
              bottom: "10%",
              animationDuration: `${3.5 + i * 0.8}s`,
              animationIterationCount: "infinite",
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Interactive 3D Coffee Cup (Interactive tilt & spin) */}
      <div
        className="relative z-20 cursor-grab active:cursor-grabbing transition-transform"
        style={{
          transform: `perspective(900px) rotateX(${cupRotation.x}deg) rotateY(${cupRotation.y + cupRotation.spin}deg)`,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
          transition: isSwitching
            ? "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease"
            : "none",
        }}
      >
        {/* Visual Cup Shell */}
        <div className="relative w-52 sm:w-60 h-64 sm:h-72 flex flex-col items-center justify-center">
          {/* Cup Saucer / Plate shadow */}
          <div className="absolute -bottom-4 w-44 h-8 bg-black/25 dark:bg-black/50 rounded-full blur-md" />

          {/* Cup Body Container */}
          <div
            className={`relative w-40 sm:w-48 h-48 sm:h-56 rounded-b-[48px] rounded-t-lg bg-gradient-to-b ${selectedFlavor.cupColor} shadow-2xl border border-white/20 p-3 flex flex-col items-center justify-between text-white overflow-hidden transition-all duration-500`}
          >
            {/* Top Rim of Cup */}
            <div className="w-full h-8 rounded-full bg-stone-900/60 border border-white/25 flex items-center justify-center shadow-inner">
              {/* Coffee Liquid & Latte Art */}
              <div
                className="w-[94%] h-[82%] rounded-full flex items-center justify-center relative overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: selectedFlavor.liquidColor }}
              >
                {/* Simulated Latte Art Swirl */}
                <div className="w-8 h-4 rounded-full border-2 border-amber-100/70 border-t-transparent rotate-12" />
                <div className="absolute w-3 h-3 rounded-full bg-amber-100/60" />
              </div>
            </div>

            {/* Cup Brand Label in Center */}
            <div className="my-auto text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200/80">
                Kopi Senja
              </span>
              <p className="font-extrabold text-sm sm:text-base leading-tight tracking-tight drop-shadow-md">
                {selectedFlavor.id === "kopi-susu" ? "Senja Aren" : "Uji Matcha"}
              </p>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/15 font-mono">
                {selectedFlavor.harga}
              </span>
            </div>

            {/* Bottom Accent Ring */}
            <div className="w-16 h-1 rounded-full bg-white/20 mb-1" />

            {/* Glass/Gloss Reflection Highlight */}
            <div className="absolute top-0 left-3 w-4 h-full bg-gradient-to-r from-white/20 to-transparent skew-x-[-12deg] pointer-events-none" />
          </div>

          {/* Cup Handle (Ear) */}
          <div className="absolute right-0 top-16 w-12 h-20 rounded-r-3xl border-6 border-amber-950/80 dark:border-stone-800 -z-10 shadow-md" />
        </div>
      </div>

      {/* Floating Coffee Beans with Pointer Repulsion (Force Field) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {beansState.map((bean) => (
          <div
            key={bean.id}
            className="absolute transition-transform duration-75 ease-out"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${bean.x + bean.repelX}px), calc(-50% + ${bean.y + bean.repelY}px)) rotate(${bean.rot}deg) scale(${bean.scale})`,
              opacity: bean.opacity,
            }}
          >
            {/* Realistic Coffee Bean SVG */}
            <svg
              width={bean.size}
              height={bean.size * 1.3}
              viewBox="0 0 24 32"
              fill="none"
              className="drop-shadow-md"
            >
              <ellipse
                cx="12"
                cy="16"
                rx="10"
                ry="14"
                fill={
                  selectedFlavor.id === "kopi-susu" ? "#4A2511" : "#365314"
                }
              />
              {/* Bean Center Crease Line */}
              <path
                d="M12 4C14 10 10 22 12 28"
                stroke={
                  selectedFlavor.id === "kopi-susu" ? "#2B1408" : "#1A2E05"
                }
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <ellipse
                cx="9"
                cy="11"
                rx="3"
                ry="6"
                fill="white"
                fillOpacity="0.12"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Flavor Switcher Cards (Bottom Right - Same as Layers Carousel Concept) */}
      <div className="absolute -bottom-4 sm:bottom-0 right-0 sm:right-2 z-40 flex items-center gap-2 bg-background/85 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-lg">
        {FLAVORS.map((flavor) => {
          const isActive = selectedFlavor.id === flavor.id;
          return (
            <button
              key={flavor.id}
              onClick={() => handleFlavorSelect(flavor)}
              disabled={isSwitching}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: flavor.accentColor }}
              />
              <span className="truncate max-w-[100px] sm:max-w-[120px]">
                {flavor.id === "kopi-susu" ? "Kopi Susu" : "Matcha"}
              </span>
              {isActive && <Check className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Top Floating Badge */}
      <div className="absolute top-2 sm:top-4 left-0 sm:left-4 z-40 pointer-events-none">
        <Badge
          variant="secondary"
          className="bg-background/90 backdrop-blur-md border border-border text-foreground shadow-sm px-3 py-1 text-xs font-medium flex items-center gap-1.5"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{selectedFlavor.badge}</span>
        </Badge>
      </div>
    </div>
  );
}

