/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrakan Coffee — Spatial Atelier & Roastery",
  description:
    "An artisanal spatial coffee atelier built on warm cream, deep espresso brown, and pure white canvas.",
  openGraph: {
    title: "Kontrakan Coffee — Spatial Atelier & Roastery",
    description:
      "Warm cream, deep espresso brown, and pure white canvas with refined coffee aesthetics.",
    locale: "en_US",
    type: "website",
    siteName: "Kontrakan Coffee",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
      className="bg-[#FFFFFF] text-[#241611] scroll-smooth"
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
        className="bg-[#FFFFFF] text-[#241611] antialiased min-h-screen selection:bg-[#5C3317] selection:text-white font-sans"
        suppressHydrationWarning
      >
        {/* Subtle tactile noise grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
