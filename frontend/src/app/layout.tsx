import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinematic Noir — Gallery & Design System",
  description:
    "An immersive, gallery-like experience leveraging deep blacks, crisp off-whites, extreme typography pairings, and scroll-linked depth.",
  openGraph: {
    title: "Cinematic Noir — Gallery & Design System",
    description:
      "Deep blacks, crisp off-whites, extreme typography pairings, and scroll-linked depth.",
    locale: "en_US",
    type: "website",
    siteName: "Cinematic Noir",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
      className="bg-[#000000] text-[#e5e5e5] scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className="bg-[#000000] text-[#e5e5e5] antialiased min-h-screen selection:bg-[#ef4444] selection:text-white"
        suppressHydrationWarning
      >
        {/* Subtle noise grain overlay at 15% opacity using mix-blend-overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
