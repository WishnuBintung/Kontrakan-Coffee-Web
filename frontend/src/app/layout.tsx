/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrakan Coffee — Spatial Atelier & Roastery",
  description:
    "An artisanal spatial coffee atelier built on warm oat cream (#EEE6D7), roasted mocha surfaces (#5F493C), deep espresso typography (#472F1D), and latte taupe accents (#C7B8AE).",
  openGraph: {
    title: "Kontrakan Coffee — Spatial Atelier & Roastery",
    description:
      "Warm oat cream, roasted mocha surfaces, deep espresso typography, and latte taupe accents.",
    locale: "en_US",
    type: "website",
    siteName: "Kontrakan Coffee",
  },
};

export const viewport: Viewport = {
  themeColor: "#EEE6D7",
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
      className="bg-[#EEE6D7] text-[#472F1D] scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Saira+Extra+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#EEE6D7] text-[#472F1D] antialiased min-h-screen selection:bg-[#C7B8AE] selection:text-[#472F1D] font-sans"
        suppressHydrationWarning
      >
        {/* Subtle tactile noise grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
