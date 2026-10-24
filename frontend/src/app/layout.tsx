import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Galada&family=Nunito:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        <Script id="identity-redirect" strategy="beforeInteractive">
          {`if (/(invite|recovery|confirmation)_token=/.test(location.hash)) location.replace('/admin/' + location.hash);`}
        </Script>
        {children}
      </body>
    </html>
  );
}
