"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[85svh] sm:min-h-[calc(100svh-4.5rem)] w-full flex-col justify-end overflow-hidden bg-zinc-950 text-cream"
      style={{ marginTop: "var(--header-h)" }}
    >
      {/* Photograph — Dilapisi gradient abu-abu netral untuk kontras tipografi */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/images/bg-hero.jpg"
          alt="Latte art di Kontrakan Coffee"
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = "1";
            }
            target.src = "./images/bg-hero.jpg";
          }}
        />
        {/* Neutral grey scrim gradient — gradasi abu-abu untuk kedalaman visual & keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/45 to-transparent" /> {/* taste-skill-ignore: neutral scrim over photo */}
      </div>

      {/* Hero Content Container — 12-column architectural split baseline composition */}
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-8 pt-16 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
        <div className="grid grid-cols-1 items-end gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Main Headline (Cols 1-7 on lg, Cols 1-8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h1
              data-rev
              style={{ "--d": "140ms" } as React.CSSProperties}
              className="font-display text-[clamp(2.6rem,7.2vw,7.8rem)] leading-[0.96] tracking-tight text-sunshine [text-wrap:balance]"
            >
              Kopi Enak.
              <br />
              Nongkrong Betah.
            </h1>
          </div>

          {/* Supporting Statement (Cols 8-12 on lg, Cols 9-12 on xl) — docked to the shared bottom baseline */}
          <div
            data-rev
            style={{ "--d": "240ms" } as React.CSSProperties}
            className="lg:col-span-5 xl:col-span-4 lg:pb-2.5"
          >
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-cream/90 sm:text-base lg:text-[1.125rem] [text-wrap:pretty]">
              Seduhan hangat, promo senja, Wi-Fi kencang, dan stopkontak di tiap
              meja — tempat yang pas untuk ngopi santai maupun nugas seharian.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
