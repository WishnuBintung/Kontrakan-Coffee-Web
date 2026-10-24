"use client";

import { useId, type Ref } from "react";
import type { HeroTheme, ParticleKind, TastingProfile } from "@/lib/hero-flavors";

/* ------------------------------------------------------------------ */
/* Consts & Dimensions                                                */
/* ------------------------------------------------------------------ */
export const CUP_LABEL_TILE = 120; // lebar 1 tile label (px viewBox)
export const CUP_CIRCUMFERENCE = 240; // keliling semu silinder

/* ------------------------------------------------------------------ */
/* IcedCup — Gelas es kopi "3D" berbasis SVG silinder interaktif.     */
/* ------------------------------------------------------------------ */
type IcedCupProps = {
  theme: HeroTheme;
  labelRef?: Ref<SVGGElement>;
  className?: string;
  title?: string;
};

export function IcedCup({ theme, labelRef, className, title }: IcedCupProps) {
  const uid = useId().replace(/:/g, "");
  const clip = `iced-clip-${uid}`;
  const shade = `iced-shade-${uid}`;
  const liquid = `iced-liquid-${uid}`;
  const straw = `iced-straw-${uid}`;

  const tiles = [-1, 0, 1, 2, 3];
  const strawColor = theme.strawColor || "#fdba74";

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
          <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="14%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="28%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.48" />
        </linearGradient>
        <linearGradient id={liquid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={theme.liquid.top} />
          <stop offset="36%" stopColor={theme.liquid.top} />
          <stop offset="58%" stopColor={theme.liquid.bottom} />
          <stop offset="100%" stopColor={theme.liquid.bottom} />
        </linearGradient>
        <pattern id={straw} width="12" height="16" patternUnits="userSpaceOnUse">
          <rect width="12" height="16" fill={strawColor} />
          <rect width="12" height="6" fill="#fff8ee" />
        </pattern>
      </defs>

      {/* Sedotan (di sumbu rotasi) */}
      <rect
        x="104"
        y="2"
        width="13"
        height="120"
        rx="6.5"
        fill={`url(#${straw})`}
        transform="rotate(9 110 60)"
      />

      {/* Tutup dome transparan */}
      <path
        d="M30 82 Q100 18 170 82 Z"
        fill="#ffffff"
        fillOpacity="0.22"
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <path
        d="M58 60 Q82 40 104 38"
        stroke="#ffffff"
        strokeOpacity="0.65"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x="22"
        y="78"
        width="156"
        height="16"
        rx="8"
        fill="#ffffff"
        fillOpacity="0.38"
        stroke="#ffffff"
        strokeOpacity="0.6"
      />

      {/* Isi Gelas */}
      <g clipPath={`url(#${clip})`}>
        {/* Cairan Minuman */}
        <rect x="0" y="90" width="200" height="230" fill={`url(#${liquid})`} />

        {/* Gelombang Crema / Susu di Atas */}
        <path
          d="M0 150 Q25 140 50 150 T100 150 T150 150 T200 150 V170 H0 Z"
          fill={theme.liquid.top}
          fillOpacity="0.6"
        />

        {/* Bongkahan Es Batu Berkilau */}
        <g fill="#ffffff" fillOpacity="0.32" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5">
          <rect x="52" y="102" width="34" height="32" rx="8" transform="rotate(-12 69 118)" />
          <rect x="104" y="98" width="38" height="34" rx="8" transform="rotate(14 123 115)" />
          <rect x="76" y="130" width="32" height="28" rx="7" transform="rotate(6 92 144)" />
        </g>

        {/* Label Silinder yang Berputar Bersama Kursor */}
        <rect x="0" y="196" width="200" height="58" fill="#fff8ee" fillOpacity="0.95" />
        <g ref={labelRef}>
          {tiles.map((t) => (
            <g key={t} transform={`translate(${t * CUP_LABEL_TILE} 0)`}>
              <circle cx="22" cy="225" r="13" fill="none" stroke="#2b1408" strokeWidth="2.5" />
              <path d="M16 225 Q22 216 28 225 Q22 234 16 225 Z" fill="#2b1408" />
              <text
                x="42"
                y="221"
                fill="#2b1408"
                fontSize="13"
                fontWeight="800"
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
                fontWeight="700"
                letterSpacing="2.5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                SENJA
              </text>
            </g>
          ))}
        </g>
        <rect x="0" y="196" width="200" height="2" fill="#2b1408" fillOpacity="0.15" />
        <rect x="0" y="252" width="200" height="2" fill="#2b1408" fillOpacity="0.15" />

        {/* Butiran Embun Dingin */}
        <g fill="#ffffff" fillOpacity="0.6">
          <circle cx="60" cy="176" r="2.2" />
          <circle cx="70" cy="268" r="1.8" />
          <circle cx="138" cy="182" r="2.2" />
          <circle cx="128" cy="280" r="2.4" />
          <circle cx="56" cy="290" r="1.6" />
        </g>

        {/* Bayangan Silinder 3D */}
        <rect x="0" y="90" width="200" height="230" fill={`url(#${shade})`} />
      </g>

      {/* Garis Luar Gelas */}
      <path
        d="M32 92 L168 92 L150 298 Q149 310 137 310 L63 310 Q51 310 50 298 Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* HotCup — Cangkir keramik hangat dengan latte art & uap aroma.      */
/* ------------------------------------------------------------------ */
type HotCupProps = {
  theme: HeroTheme;
  className?: string;
  title?: string;
};

export function HotCup({ theme, className, title }: HotCupProps) {
  const uid = useId().replace(/:/g, "");
  const glazeGrad = `mug-glaze-${uid}`;
  const cremaGrad = `mug-crema-${uid}`;
  const shadeGrad = `mug-shade-${uid}`;

  const { base, rim, accent, latteArt } = theme.glaze;

  return (
    <svg
      viewBox="0 0 240 260"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        {/* Gradien Keramik */}
        <linearGradient id={glazeGrad} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={base} />
          <stop offset="35%" stopColor={rim} />
          <stop offset="65%" stopColor={base} />
          <stop offset="100%" stopColor="#0d0603" />
        </linearGradient>

        {/* Gradien Crema / Minuman */}
        <radialGradient id={cremaGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.liquid.top} />
          <stop offset="60%" stopColor={theme.liquid.bottom} />
          <stop offset="100%" stopColor="#1a0c06" />
        </radialGradient>

        {/* Shading Silinder */}
        <linearGradient id={shadeGrad} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="85%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Uap Hangat Animasi (Vector Steam) */}
      <g className="animate-pulse" style={{ animationDuration: "3s" }}>
        <path
          d="M85 50 Q75 35 90 20 T80 0"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M115 45 Q125 30 110 15 T120 -5"
          stroke="#ffffff"
          strokeOpacity="0.45"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M140 50 Q130 35 145 22 T135 2"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Gagang Cangkir Keramik (Handle) */}
      <path
        d="M170 100 C218 100 218 190 162 190"
        stroke={base}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
        className="drop-shadow-md"
      />
      <path
        d="M170 100 C218 100 218 190 162 190"
        stroke={rim}
        strokeOpacity="0.4"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Piring Alas (Saucer) */}
      <ellipse
        cx="115"
        cy="225"
        rx="95"
        ry="18"
        fill="#140a05"
        stroke={rim}
        strokeOpacity="0.35"
        strokeWidth="3"
      />
      <ellipse cx="115" cy="223" rx="88" ry="14" fill={base} fillOpacity="0.8" />

      {/* Badan Cangkir Keramik */}
      <path
        d="M45 80 L185 80 L174 192 Q172 215 145 215 L85 215 Q58 215 56 192 Z"
        fill={`url(#${glazeGrad})`}
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* Shading Silinder Mug */}
      <path
        d="M45 80 L185 80 L174 192 Q172 215 145 215 L85 215 Q58 215 56 192 Z"
        fill={`url(#${shadeGrad})`}
      />

      {/* Bibir Atas Cangkir (Rim Ellipse) */}
      <ellipse
        cx="115"
        cy="80"
        rx="70"
        ry="20"
        fill={rim}
        stroke="#ffffff"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <ellipse cx="115" cy="81" rx="66" ry="17" fill="#1c0c05" />

      {/* Permukaan Crema & Kopi */}
      <ellipse cx="115" cy="83" rx="62" ry="15" fill={`url(#${cremaGrad})`} />

      {/* Latte Art di Permukaan Minuman */}
      {latteArt === "heart" && (
        <g transform="translate(115, 83) scale(0.9)">
          <path
            d="M0 -7 C-8 -15 -17 -5 0 9 C17 -5 8 -15 0 -7 Z"
            fill="#ffffff"
            fillOpacity="0.85"
          />
          <path
            d="M0 -4 C-5 -10 -11 -3 0 6 C11 -3 5 -10 0 -4 Z"
            fill={theme.liquid.top}
            fillOpacity="0.5"
          />
        </g>
      )}

      {latteArt === "rosetta" && (
        <g transform="translate(115, 83) scale(0.9)">
          <path
            d="M0 8 C-3 4 -12 2 -4 -4 C-2 -6 -10 -9 -3 -11 C0 -12 0 -13 0 -13 C0 -13 0 -12 3 -11 C10 -9 2 -6 4 -4 C12 2 3 4 0 8 Z"
            fill="#ffffff"
            fillOpacity="0.85"
          />
          <circle cx="0" cy="9" r="2" fill="#ffffff" fillOpacity="0.9" />
        </g>
      )}

      {latteArt === "swirl" && (
        <g transform="translate(115, 83) scale(0.9)">
          <circle cx="0" cy="0" r="8" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2.5" />
          <path
            d="M-5 -2 Q0 -8 5 -2 T-5 2"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.85"
            strokeWidth="2"
          />
        </g>
      )}

      {/* Medallion Cap Segel "Kopi Senja" di Badan Cangkir */}
      <g transform="translate(115, 145)">
        <circle cx="0" cy="0" r="22" fill="#140a05" stroke={accent} strokeWidth="2" strokeOpacity="0.8" />
        <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M-6 0 Q0 -9 6 0 Q0 9 -6 0 Z" fill={accent} />
        <text
          x="0"
          y="11"
          textAnchor="middle"
          fill="#fff8ee"
          fontSize="7"
          fontWeight="800"
          letterSpacing="1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          SENJA
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Particle — Objek melayang (biji kopi / daun matcha / es / cokelat)  */
/* ------------------------------------------------------------------ */
export function Particle({ kind, className }: { kind: ParticleKind; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const g = `particle-grad-${uid}`;

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
          <ellipse cx="38" cy="34" rx="7" ry="13" fill="#ffffff" fillOpacity="0.18" />
        </>
      )}
      {kind === "leaf" && (
        <>
          <defs>
            <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#bef264" />
              <stop offset="45%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#365314" />
            </linearGradient>
          </defs>
          <path d="M50 4 C82 22 90 62 50 96 C10 62 18 22 50 4 Z" fill={`url(#${g})`} />
          <path d="M50 12 V90 M50 40 L34 30 M50 54 L66 42 M50 68 L36 60" stroke="#1f3b0c" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
      {kind === "ice" && (
        <>
          <defs>
            <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect x="16" y="16" width="68" height="68" rx="16" fill={`url(#${g})`} stroke="#ffffff" strokeOpacity="0.85" strokeWidth="3" />
          <path d="M30 30 L48 26" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <rect x="30" y="56" width="18" height="14" rx="5" fill="#ffffff" fillOpacity="0.35" />
        </>
      )}
      {kind === "cocoa" && (
        <>
          <defs>
            <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="50%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#1e0209" />
            </linearGradient>
          </defs>
          <path d="M14 30 L60 12 L88 42 L74 86 L24 80 Z" fill={`url(#${g})`} />
          <path d="M38 22 L50 82 M14 52 L82 62" stroke="#1c050a" strokeWidth="4" strokeOpacity="0.6" />
          <path d="M22 34 L56 20" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* TastingMeter — Komponen bar sensori profil rasa                    */
/* ------------------------------------------------------------------ */
type TastingMeterProps = {
  profile: TastingProfile;
  className?: string;
};

export function TastingMeter({ profile, className }: TastingMeterProps) {
  const metrics = [
    { label: "Manis", value: profile.sweetness, max: 5 },
    { label: "Pekat", value: profile.boldness, max: 5 },
    { label: "Asam", value: profile.acidity, max: 5 },
    { label: "Aroma", value: profile.aroma, max: 5 },
  ];

  return (
    <div className={`grid grid-cols-2 gap-2 text-xs ${className}`}>
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] text-white/80">
            <span>{m.label}</span>
            <span className="font-semibold text-senja-soft">{m.value}/5</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-senja-soft transition-all duration-500 ease-out"
              style={{ width: `${(m.value / m.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
