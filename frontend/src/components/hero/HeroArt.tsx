"use client";

import { useId, type Ref } from "react";
import type { HeroTheme, ParticleKind } from "@/lib/hero-flavors";

/* ------------------------------------------------------------------ */
/* IcedCup — gelas es kopi "3D" berbasis SVG.                          */
/* Rotasi pada sumbu vertikal disimulasikan dengan menggeser label     */
/* silinder (labelRef) sementara shading tetap → terasa seperti objek  */
/* 3D yang berputar (pengganti <model-viewer> kaleng pada konsep).     */
/* ------------------------------------------------------------------ */

export const CUP_LABEL_TILE = 120; // lebar 1 tile label (px viewBox)
export const CUP_CIRCUMFERENCE = 240; // keliling semu silinder

type IcedCupProps = {
  theme: HeroTheme;
  labelRef?: Ref<SVGGElement>;
  className?: string;
  title?: string;
};

export function IcedCup({ theme, labelRef, className, title }: IcedCupProps) {
  const uid = useId().replace(/:/g, "");
  const clip = `cup-clip-${uid}`;
  const shade = `cup-shade-${uid}`;
  const liquid = `cup-liquid-${uid}`;
  const straw = `cup-straw-${uid}`;

  const tiles = [-1, 0, 1, 2, 3];

  return (
    <svg
      viewBox="0 0 200 330"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <clipPath id={clip}>
          <path d="M32 92 L168 92 L150 298 Q149 310 137 310 L63 310 Q51 310 50 298 Z" />
        </clipPath>
        <linearGradient id={shade} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.42" />
          <stop offset="16%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="68%" stopColor="#000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={liquid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={theme.liquid.top} />
          <stop offset="34%" stopColor={theme.liquid.top} />
          <stop offset="52%" stopColor={theme.liquid.bottom} />
          <stop offset="100%" stopColor={theme.liquid.bottom} />
        </linearGradient>
        <pattern id={straw} width="12" height="16" patternUnits="userSpaceOnUse">
          <rect width="12" height="16" fill="#fdba74" />
          <rect width="12" height="6" fill="#fff8ee" />
        </pattern>
      </defs>

      {/* Sedotan (berada di sumbu putar sehingga tetap di tengah) */}
      <rect
        x="104"
        y="2"
        width="13"
        height="120"
        rx="6.5"
        fill={`url(#${straw})`}
        transform="rotate(9 110 60)"
      />

      {/* Tutup dome */}
      <path d="M30 82 Q100 18 170 82 Z" fill="#fff" fillOpacity="0.22" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M58 60 Q82 40 104 38" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="22" y="78" width="156" height="16" rx="8" fill="#fff" fillOpacity="0.4" stroke="#fff" strokeOpacity="0.6" />

      {/* Isi gelas */}
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="90" width="200" height="230" fill={`url(#${liquid})`} />
        <path
          d="M0 150 Q25 140 50 150 T100 150 T150 150 T200 150 V170 H0 Z"
          fill={theme.liquid.top}
          fillOpacity="0.55"
        />
        {/* Es batu */}
        <g fill="#fff" fillOpacity="0.28" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5">
          <rect x="52" y="100" width="34" height="32" rx="8" transform="rotate(-12 69 116)" />
          <rect x="104" y="96" width="38" height="34" rx="8" transform="rotate(14 123 113)" />
          <rect x="78" y="128" width="30" height="28" rx="7" transform="rotate(6 93 142)" />
        </g>

        {/* Label silinder yang "berputar" */}
        <rect x="0" y="196" width="200" height="58" fill="#fff8ee" fillOpacity="0.94" />
        <g ref={labelRef}>
          {tiles.map((t) => (
            <g key={t} transform={`translate(${t * CUP_LABEL_TILE} 0)`}>
              <circle cx="22" cy="225" r="13" fill="none" stroke="#3b2012" strokeWidth="2.5" />
              <path d="M16 225 Q22 216 28 225 Q22 234 16 225 Z" fill="#3b2012" />
              <text
                x="42"
                y="221"
                fill="#3b2012"
                fontSize="13"
                fontWeight="700"
                letterSpacing="1.5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                KOPI
              </text>
              <text
                x="42"
                y="236"
                fill="#b45309"
                fontSize="11"
                fontWeight="600"
                letterSpacing="2.5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                SENJA
              </text>
            </g>
          ))}
        </g>
        <rect x="0" y="196" width="200" height="2" fill="#3b2012" fillOpacity="0.15" />
        <rect x="0" y="252" width="200" height="2" fill="#3b2012" fillOpacity="0.15" />

        {/* Embun */}
        <g fill="#fff" fillOpacity="0.55">
          <circle cx="60" cy="176" r="2.2" />
          <circle cx="70" cy="268" r="1.8" />
          <circle cx="138" cy="182" r="2" />
          <circle cx="128" cy="280" r="2.4" />
          <circle cx="56" cy="290" r="1.5" />
        </g>

        {/* Shading silinder (diam) */}
        <rect x="0" y="90" width="200" height="230" fill={`url(#${shade})`} />
      </g>

      {/* Outline gelas */}
      <path
        d="M32 92 L168 92 L150 298 Q149 310 137 310 L63 310 Q51 310 50 298 Z"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Particle — objek melayang (biji kopi / daun matcha / es / cokelat)  */
/* ------------------------------------------------------------------ */

export function Particle({ kind, className }: { kind: ParticleKind; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const g = `p-${uid}`;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {kind === "bean" && (
        <>
          <defs>
            <radialGradient id={g} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#8a4f2a" />
              <stop offset="60%" stopColor="#4a2511" />
              <stop offset="100%" stopColor="#24110a" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="50" rx="30" ry="41" fill={`url(#${g})`} />
          <path d="M50 12 C64 36 36 64 50 88" stroke="#1a0b04" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="38" cy="34" rx="7" ry="13" fill="#fff" fillOpacity="0.16" />
        </>
      )}
      {kind === "leaf" && (
        <>
          <defs>
            <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#a6d36a" />
              <stop offset="100%" stopColor="#3f6b1f" />
            </linearGradient>
          </defs>
          <path d="M50 4 C82 22 90 62 50 96 C10 62 18 22 50 4 Z" fill={`url(#${g})`} />
          <path d="M50 12 V90 M50 40 L34 30 M50 54 L66 42 M50 68 L36 60" stroke="#2d4f15" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
      {kind === "ice" && (
        <>
          <defs>
            <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#bfe3ff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <rect x="16" y="16" width="68" height="68" rx="16" fill={`url(#${g})`} stroke="#fff" strokeOpacity="0.8" strokeWidth="3" />
          <path d="M30 30 L48 26" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <rect x="30" y="56" width="18" height="14" rx="5" fill="#fff" fillOpacity="0.35" />
        </>
      )}
      {kind === "cocoa" && (
        <>
          <defs>
            <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#7a3b26" />
              <stop offset="100%" stopColor="#2a0f08" />
            </linearGradient>
          </defs>
          <path d="M14 30 L60 12 L88 42 L74 86 L24 80 Z" fill={`url(#${g})`} />
          <path d="M38 22 L50 82 M14 52 L82 62" stroke="#1c0804" strokeWidth="4" strokeOpacity="0.6" />
          <path d="M22 34 L56 20" stroke="#fff" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

