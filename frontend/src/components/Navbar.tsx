"use client";

import React from "react";
import { StaggeredMenu } from "./StaggeredMenu";

export function Navbar() {
  const navLinks = [
    { label: "Deskripsi", href: "#pembuka" },
    { label: "Menu", href: "#menu" },
    { label: "Galeri", href: "#galeri" },
    { label: "Informasi", href: "#lokasi" },
  ];

  return (
    <StaggeredMenu
      logo={
        <a
          href="#"
          className="text-[18px] font-bold tracking-tight uppercase hover:text-[#C7B8AE] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] font-sans text-[#EEE6D7]"
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
              className="relative py-1 text-[17px] font-medium tracking-tight uppercase text-[#EEE6D7] hover:text-[#C7B8AE] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] font-sans after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#C7B8AE] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]"
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
        { label: "Instagram", link: "https://www.instagram.com/kontrakan.coffee?dlrf=aHpsbXB6ajE4dmQ3" },
        { label: "Twitter / X", link: "https://x.com" },
        { label: "Behance", link: "https://behance.net" },
        { label: "Are.na", link: "https://are.na" },
      ]}
      colors={["#472F1D", "#C7B8AE", "#5F493C"]}
      accentColor="#C7B8AE"
      menuButtonColor="#EEE6D7"
      openMenuButtonColor="#C7B8AE"
      displayItemNumbering={false}
      displaySocials={true}
      isFixed={true}
      shrinkOnScroll={true}
      scrollThreshold={80}
    />
  );
}
export default Navbar;
