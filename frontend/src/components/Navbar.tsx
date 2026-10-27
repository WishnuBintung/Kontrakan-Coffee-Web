"use client";

import React from "react";
import { StaggeredMenu } from "./StaggeredMenu";

export function Navbar() {
  const navLinks = [
    { label: "Deskripsi", href: "#pembuka" },
    { label: "Menu", href: "#menu" },
    { label: "Jam Buka", href: "#jam-buka" },
    { label: "Galeri", href: "#galeri" },
    { label: "Lokasi", href: "#lokasi" },
  ];

  return (
    <StaggeredMenu
      logo={
        <a
          href="#"
          className="text-[18px] font-bold tracking-tight uppercase hover:text-[#D99C5B] transition-colors font-sans text-[#E8E3D9]"
        >
          KONTRAKAN COFFEE
        </a>
      }
      desktopNav={
        <>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[17px] font-medium tracking-tight uppercase text-[#E8E3D9] hover:text-[#D99C5B] transition-colors font-sans"
            >
              {link.label}
            </a>
          ))}
        </>
      }
      items={[
        {
          label: "Deskripsi",
          ariaLabel: "Baca kalimat pembuka dan deskripsi Kontrakan Coffee",
          link: "#pembuka",
        },
        {
          label: "Menu",
          ariaLabel: "Lihat daftar menu lengkap dan harga",
          link: "#menu",
        },
        {
          label: "Jam Buka",
          ariaLabel: "Cek jadwal jam operasional kafe",
          link: "#jam-buka",
        },
        {
          label: "Galeri",
          ariaLabel: "Jelajahi foto suasana kafe",
          link: "#galeri",
        },
        {
          label: "Lokasi",
          ariaLabel: "Kunjungi kami di lokasi kafe",
          link: "#lokasi",
        },
      ]}
      socialItems={[
        { label: "Instagram", link: "https://instagram.com/kontrakancoffee" },
        { label: "Twitter / X", link: "https://x.com" },
        { label: "Behance", link: "https://behance.net" },
        { label: "Are.na", link: "https://are.na" },
      ]}
      colors={["#1C1A18", "#D99C5B", "#5B6653"]}
      accentColor="#D99C5B"
      menuButtonColor="#E8E3D9"
      openMenuButtonColor="#D99C5B"
      displayItemNumbering={true}
      displaySocials={true}
      isFixed={true}
      shrinkOnScroll={true}
      scrollThreshold={100}
    />
  );
}
export default Navbar;
