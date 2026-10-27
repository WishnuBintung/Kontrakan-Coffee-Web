"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[calc(100svh-7.5rem)] w-full flex-col justify-end overflow-hidden bg-coffee-dark text-cream"
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

      <div className="mx-auto w-full max-w-[90rem] px-6 pb-10 pt-24 sm:pb-14">
        <p
          data-rev
          style={{ "--d": "60ms" } as React.CSSProperties}
          className="eyebrow mb-3 text-xl text-latte-light sm:text-3xl"
        >
          Kopi spesialti · Ruang nongkrong &amp; nugas
        </p>

        <h1
          data-rev
          style={{ "--d": "140ms" } as React.CSSProperties}
          className="font-display text-[clamp(3.4rem,11.2vw,10.5rem)] text-sunshine"
        >
          Kopi Enak. Nongkrong Betah.
        </h1>

        <div
          data-rev
          style={{ "--d": "240ms" } as React.CSSProperties}
          className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-xl text-lg text-cream/90 sm:text-xl">
            Seduhan hangat, promo senja, Wi-Fi kencang, dan stopkontak di tiap
            meja — tempat yang pas untuk ngopi santai maupun nugas seharian.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#menu" className="btn">
              Lihat Menu
            </a>
            <a href="#lokasi" className="btn btn-outline-cream">
              Jam Buka &amp; Lokasi
            </a>
            <a
              href="#kategori"
              aria-label="Gulir ke bawah"
              className="btn btn-earth hidden !px-3 sm:inline-flex"
            >
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
