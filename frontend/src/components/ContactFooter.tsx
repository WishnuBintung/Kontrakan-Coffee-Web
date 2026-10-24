"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export function ContactFooter() {
  const [copied, setCopied] = useState(false);
  const email = "atelier@kontrakancoffee.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="w-full bg-[#5B6653] text-[#E8E3D9] py-20 px-6 relative sharp-edges border-t border-[#4D5746]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top element: Full-width border-b text 'START A PROJECT' at 12vw, Black weight, uppercase, hover turns #D99C5B */}
        <div className="border-b border-[#4D5746] pb-10 md:pb-16 mb-16 md:mb-20">
          <a
            href={`mailto:${email}`}
            className="block font-sans font-black text-[12vw] leading-none text-[#E8E3D9] uppercase tracking-[-0.03em] hover:text-[#D99C5B] transition-colors select-none"
          >
            START A PROJECT
          </a>
        </div>

        {/* Bottom: 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Column 1: Social links with wavy underline hover */}
          <div className="flex flex-col space-y-4">
            <span className="font-mono text-[14px] text-[#D99C5B] uppercase tracking-widest block font-semibold">
              [INDEX // SOCIAL]
            </span>
            <ul className="space-y-2">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "Twitter / X", href: "https://x.com" },
                { label: "Behance", href: "https://behance.net" },
                { label: "Are.na", href: "https://are.na" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[18px] font-medium tracking-tight text-[#E8E3D9] wavy-hover inline-block font-sans"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact email (3xl font) with Amber Action button */}
          <div className="flex flex-col space-y-4">
            <span className="font-mono text-[14px] text-[#D99C5B] uppercase tracking-widest block font-semibold">
              [DIRECT // INQUIRIES]
            </span>
            <div className="flex flex-col items-start gap-2">
              <a
                href={`mailto:${email}`}
                className="text-2xl md:text-3xl font-medium tracking-tight text-[#E8E3D9] hover:text-[#D99C5B] transition-colors break-words font-sans"
              >
                {email}
              </a>
              <button
                onClick={handleCopyEmail}
                className={`font-mono text-[12px] uppercase tracking-wider px-3.5 py-1.5 sharp-edges transition-all inline-flex items-center gap-2 font-medium ${
                  copied
                    ? "bg-[#E8E3D9] text-[#1C1A18]"
                    : "bg-[#D99C5B] text-[#1C1A18] hover:bg-[#C08343]"
                }`}
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>CLICK TO COPY ADDRESS</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-[14px] text-[#E8E3D9]/70 leading-relaxed pt-2">
              Artisanal spatial coffee roastery, architectural collaborations & sensory consultations.
            </p>
          </div>

          {/* Column 3: Rights reserved text aligned bottom-right */}
          <div className="flex flex-col md:items-end justify-between h-full space-y-4 md:text-right">
            <span className="font-mono text-[14px] text-[#D99C5B] uppercase tracking-widest block font-semibold">
              [ARCHIVAL // NOTATION]
            </span>
            <div className="font-mono text-[14px] text-[#E8E3D9]/70 leading-relaxed space-y-1">
              <p>© 2026 KONTRAKAN COFFEE ATELIER.</p>
              <p>SPATIAL BOTANICAL & WARM MONOCHROME SYSTEM.</p>
              <p>ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
