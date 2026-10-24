import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrakan Coffee — Simple Moments, Great Coffee",
  description:
    "Ruang santai di Seturan, Yogyakarta. Menikmati Salted Caramel Latte, Aerocano, Mont Blanc, dan manual brew di kala senja.",
  openGraph: {
    title: "Kontrakan Coffee — Simple Moments, Great Coffee",
    description:
      "Ruang santai di Seturan, Yogyakarta. Kopi berkualitas segar, suasana hangat, dan waktu melambat.",
    locale: "id_ID",
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Reenie+Beanie&display=swap"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
