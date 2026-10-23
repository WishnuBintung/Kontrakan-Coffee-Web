import type { Metadata, Viewport } from "next";
import { Fredoka, Galada, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const galada = Galada({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-galada",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kopi Senja — Coffee & Space di Sleman",
  description:
    "Landing page resmi Kopi Senja. Temukan menu kopi & camilan, galeri suasana, jam buka, dan lokasi kami.",
  openGraph: {
    title: "Kopi Senja — Coffee & Space di Sleman",
    description:
      "Menu kopi & camilan ramah mahasiswa, suasana hangat, WiFi & colokan di setiap meja.",
    locale: "id_ID",
    type: "website",
    siteName: "Kopi Senja",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c0f08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(nunito.variable, fredoka.variable, galada.variable)}
    >
      <body suppressHydrationWarning className="font-sans antialiased">
        <Script id="identity-redirect" strategy="beforeInteractive">
          {`if (/(invite|recovery|confirmation)_token=/.test(location.hash)) location.replace('/admin/' + location.hash);`}
        </Script>
        {children}
      </body>
    </html>
  );
}
