/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrakan Coffee — Kopi Enak, Nongkrong Betah",
  description:
    "Kontrakan Coffee: kopi spesialti, menu non-kopi dan camilan, promo senja, serta ruang nongkrong dan nugas yang nyaman dengan Wi-Fi kencang dan stopkontak di tiap meja.",
  openGraph: {
    title: "Kontrakan Coffee — Kopi Enak, Nongkrong Betah",
    description:
      "Kopi spesialti, promo senja, dan ruang nongkrong yang nyaman untuk pelajar dan pekerja kreatif.",
    locale: "id_ID",
    type: "website",
    siteName: "Kontrakan Coffee",
  },
};

export const viewport: Viewport = {
  themeColor: "#23160C",
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
      lang="id"
      className="bg-cream text-coffee scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Serif:wdth,wght@50..150,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-cream text-coffee antialiased min-h-screen selection:bg-sunshine selection:text-coffee font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
