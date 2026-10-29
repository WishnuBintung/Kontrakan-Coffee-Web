"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { StaggeredMenu } from "./StaggeredMenu";
import { useCafeInfo } from "@/hooks/useCafeData";

export function Navbar() {
  const CAFE_INFO = useCafeInfo();

  const igUrl =
    CAFE_INFO.instagram ||
    "https://www.instagram.com/kontrakan.coffee?dlrf=aHpsbXB6ajE4dmQ3";
  const tiktokUrl =
    CAFE_INFO.tiktok ||
    "https://www.tiktok.com/@kontrakancoffee?_r=1&_t=ZS-9AubeEe0g5M";
  const waUrl = CAFE_INFO.whatsapp
    ? `https://wa.me/${CAFE_INFO.whatsapp.replace(/\D/g, "")}`
    : "https://wa.me/6281234567890";
  const mapsUrl =
    CAFE_INFO.googleMapsUrl ||
    "https://maps.app.goo.gl/7kn5wi3aeE15r61T9?g_st=ic";

  const navLinks = [
    { label: "Promo", href: "#promo" },
    { label: "Menu", href: "#menu" },
    { label: "Fasilitas", href: "#fasilitas" },
    { label: "Galeri", href: "#galeri" },
    { label: "Informasi", href: "#lokasi" },
  ];

  return (
    <StaggeredMenu
      logo={
        <a
          href="#"
          aria-label="Kontrakan Coffee — beranda"
          className="group flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine rounded-[0.25rem]"
        >
          <img
            src="/images/logo.png"
            alt="Logo Kontrakan Coffee"
            className="h-10 w-auto max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-11 md:h-12"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.attempt) {
                target.dataset.attempt = "1";
                target.src = "/images/logo.jpeg";
              } else if (target.dataset.attempt === "1") {
                target.dataset.attempt = "2";
                target.src = "/images/logo.svg";
              }
            }}
          />
        </a>
      }
      desktopNav={
        <>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-1 text-[15px] font-bold uppercase tracking-tight text-white transition-colors duration-300 hover:text-sunshine after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-right after:scale-x-0 after:bg-sunshine after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:origin-left hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </>
      }
      items={[
        {
          label: "Promo",
          ariaLabel: "Lihat promo spesial dan kegiatan di Kontrakan Coffee",
          link: "#promo",
        },
        {
          label: "Menu",
          ariaLabel: "Lihat daftar menu lengkap dan harga",
          link: "#menu",
        },
        {
          label: "Fasilitas",
          ariaLabel: "Lihat fasilitas dan kenyamanan di Kontrakan Coffee",
          link: "#fasilitas",
        },
        {
          label: "Galeri",
          ariaLabel: "Jelajahi foto suasana kafe",
          link: "#galeri",
        },
        {
          label: "Informasi",
          ariaLabel: "Lihat informasi lokasi dan jadwal jam operasional kafe",
          link: "#lokasi",
        },
      ]}
      socialItems={[
        { label: "Instagram", link: igUrl },
        { label: "WhatsApp", link: waUrl },
        { label: "TikTok", link: tiktokUrl },
        { label: "Google Maps", link: mapsUrl },
      ]}
      colors={["#fcbf27", "#ed612f", "#23160c"]}
      accentColor="#fcbf27"
      menuButtonColor="#2c1c0f"
      openMenuButtonColor="#2c1c0f"
      displayItemNumbering={false}
      displaySocials={true}
      isFixed={true}
      shrinkOnScroll={true}
      scrollThreshold={80}
      topOffset={0}
    />
  );
}
export default Navbar;
