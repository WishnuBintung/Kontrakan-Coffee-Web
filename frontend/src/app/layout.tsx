import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-roboto-serif",
});

export const metadata: Metadata = {
  title: "Kontrakan Coffee — Kopi Enak, Nongkrong Betah",
  description:
    "Kontrakan Coffee: kopi spesialti, menu non-kopi dan camilan, promo senja, serta ruang nongkrong dan nugas yang nyaman dengan Wi-Fi kencang dan stopkontak di tiap meja.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      className={`${roboto.variable} ${robotoSerif.variable} bg-cream text-coffee scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body
        className="bg-cream text-coffee antialiased min-h-[100svh] selection:bg-sunshine selection:text-coffee font-sans"
        suppressHydrationWarning
      >
        <Script id="identity-redirect" strategy="beforeInteractive">
          {`
            if (typeof window !== "undefined") {
              if (/(invite|recovery|confirmation)_token=/.test(window.location.hash)) {
                window.location.replace('/admin/' + window.location.hash);
              } else if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", function(user) {
                  if (!user) {
                    window.netlifyIdentity.on("login", function() {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
