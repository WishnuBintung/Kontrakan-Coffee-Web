"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export function ContactFooter() {
  const [copied, setCopied] = useState(false);
  const email = "atelier@cinematicnoir.studio";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="w-full bg-[#fafafa] text-[#000000] py-20 px-6 relative sharp-edges"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top element: Full-width border-b text 'START A PROJECT' at 12vw, Black weight, uppercase */}
        <div className="border-b border-[#000000]/15 pb-10 md:pb-16 mb-16 md:mb-20">
          <a
            href={`mailto:${email}`}
            className="block font-serif font-black text-[12vw] leading-none text-[#000000] uppercase tracking-[-0.03em] hover:text-[#888] transition-colors select-none"
          >
            START A PROJECT
          </a>
        </div>

        {/* Bottom: 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Column 1: Social links with wavy underline hover */}
          <div className="flex flex-col space-y-4">
            <span className="font-mono text-[14px] text-[#888] uppercase tracking-widest block">
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
                    className="text-[18px] font-medium tracking-tight text-[#000000] wavy-hover inline-block font-sans"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact email (3xl font) */}
          <div className="flex flex-col space-y-4">
            <span className="font-mono text-[14px] text-[#888] uppercase tracking-widest block">
              [DIRECT // INQUIRIES]
            </span>
            <div className="flex flex-col items-start gap-2">
              <a
                href={`mailto:${email}`}
                className="text-2xl md:text-3xl font-medium tracking-tight text-[#000000] hover:text-[#888] transition-colors break-words font-sans"
              >
                {email}
              </a>
              <button
                onClick={handleCopyEmail}
                className="font-mono text-[12px] uppercase tracking-wider text-[#888] hover:text-black transition-colors inline-flex items-center gap-1.5 py-1"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>CLICK TO COPY ADDRESS</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-[14px] text-[#888] leading-relaxed pt-2">
              International gallery exhibitions, spatial commissions & architectural consultations.
            </p>
          </div>

          {/* Column 3: Rights reserved text aligned bottom-right */}
          <div className="flex flex-col md:items-end justify-between h-full space-y-4 md:text-right">
            <span className="font-mono text-[14px] text-[#888] uppercase tracking-widest block">
              [ARCHIVAL // NOTATION]
            </span>
            <div className="font-mono text-[14px] text-[#888] leading-relaxed space-y-1">
              <p>© 2026 CINEMATIC NOIR ATELIER.</p>
              <p>HIGH-CONTRAST MONOCHROMATIC SYSTEM.</p>
              <p>ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
