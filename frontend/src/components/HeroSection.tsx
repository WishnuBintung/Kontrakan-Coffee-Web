"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[85svh] sm:min-h-[calc(100svh-4.5rem)] w-full flex-col justify-end overflow-hidden bg-coffee-dark text-cream"
      style={{ marginTop: "var(--header-h)" }}
    >
      {/* Photograph — toned down by a warm coffee wash, like Bettr's moody hero */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/images/bg-hero.jpg"
          alt="Latte art di Kontrakan Coffee"
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = "1";
              target.src = "./images/bg-hero.jpg";
            }
          }}
        />
        <div className="absolute inset-0 bg-coffee/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-darker/90 via-coffee/35 to-coffee/10" />
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-5 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24">
        {/* Eyebrow: concise on mobile, editorial on desktop */}
        <p
          data-rev
          style={{ "--d": "60ms" } as React.CSSProperties}
          className="eyebrow mb-2 sm:mb-3 text-xs sm:text-2xl uppercase tracking-widest text-sunshine-light sm:tracking-normal sm:text-latte-light"
        >
          Kopi spesialti · Ruang nongkrong &amp; nugas
        </p>

        {/* Headline: responsive and well-spaced */}
        <h1
          data-rev
          style={{ "--d": "140ms" } as React.CSSProperties}
          className="font-display text-[2.6rem] sm:text-[clamp(3.4rem,11.2vw,10.5rem)] leading-[1.08] sm:leading-none text-sunshine"
        >
          Kopi Enak.
          <br className="sm:hidden" /> Nongkrong Betah.
        </h1>

        <div
          data-rev
          style={{ "--d": "240ms" } as React.CSSProperties}
          className="mt-6 sm:mt-8"
        >
          {/* Paragraph: clean readable text */}
          <p className="max-w-xl text-[15px] sm:text-xl text-cream/85 leading-relaxed">
            Seduhan hangat, promo senja, Wi-Fi kencang, dan stopkontak di tiap
            meja — tempat yang pas untuk ngopi santai maupun nugas seharian.
          </p>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
