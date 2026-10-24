/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrakan Coffee — Spatial Atelier & Roastery",
  description:
    "An artisanal spatial coffee atelier built on warm cream, dark olive green surfaces, deep charcoal typography, and glowing amber gold accents.",
  openGraph: {
    title: "Kontrakan Coffee — Spatial Atelier & Roastery",
    description:
      "Warm cream, dark olive green surfaces, deep charcoal typography, and glowing amber gold accents.",
    locale: "en_US",
    type: "website",
    siteName: "Kontrakan Coffee",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8E3D9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-[#E8E3D9] text-[#1C1A18] scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Saira+Extra+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#E8E3D9] text-[#1C1A18] antialiased min-h-screen selection:bg-[#D99C5B] selection:text-[#1C1A18] font-sans"
        suppressHydrationWarning
      >
        {/* Subtle tactile noise grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
