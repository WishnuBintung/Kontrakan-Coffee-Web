import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kopi Senja — Coffee Shop",
  description: "Landing page resmi Kopi Senja. Temukan menu kopi & camilan, galeri suasana, jam buka, dan lokasi kami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="identity-redirect" strategy="beforeInteractive">
          {`if (/(invite|recovery|confirmation)_token=/.test(location.hash)) location.replace('/admin/' + location.hash);`}
        </Script>
        {children}
      </body>
    </html>
  );
}
