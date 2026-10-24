import {
  getInfoToko,
  getActivePromo,
  getKategori,
  getMenu,
  getGaleri,
  formatRupiah,
} from "@/lib/content";
import { toHeroFlavors } from "@/lib/hero-flavors";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Coffee,
  MapPin,
  Clock,
  Sparkles,
  Tag,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Star,
} from "lucide-react";

export default function Home() {
  const infoToko = getInfoToko();
  const activePromos = getActivePromo();
  const kategoriList = getKategori();
  const menuList = getMenu();
  const galeriList = getGaleri();

  const promoUtama = activePromos.length > 0 ? activePromos[0] : undefined;
  const heroFlavors = toHeroFlavors(menuList);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* 1. Header & Navigation (Container Panjang di Tengah) */}
      <Navbar infoToko={infoToko} />

      <main className="flex-1">
        {/* 2. Hero Section (Dua Sisi: Headline & Interactive 3D Cup) */}
        <HeroSection
          infoToko={infoToko}
          promoTerbaru={promoUtama}
          flavors={heroFlavors}
        />

        {/* 3. Banner Promo Aktif (Bila Ada - PRD Fase 3) */}
        {promoUtama && (
          <section id="promo" className="py-6 bg-amber-500/10 border-y border-amber-500/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        {promoUtama.tipe === "promo" ? "Promo Hari Ini" : "Kegiatan Mendatang"}
                      </span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground">
                      {promoUtama.judul}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {promoUtama.deskripsi}
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 shrink-0"
                >
                  <a
                    href={`https://wa.me/${infoToko.whatsapp}?text=Halo,%20saya%20mau%20tanya%20tentang%20${encodeURIComponent(
                      promoUtama.judul
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tanya Promo Ini
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 4. Kerangka Section Menu Digital (PRD Fase 1) */}
        <section id="menu" className="py-16 sm:py-20 border-b border-border/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12 space-y-3">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
                <Coffee className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Menu Digital & Harga
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Pilihan Minuman & Camilan
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Harga transparan tanpa biaya tersembunyi. Silakan lihat menu andalan kami lalu datang langsung ke kedai untuk menikmati racikan barista.
              </p>
            </div>

            {/* Preview Grid Menu Awal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuList.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-amber-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {item.nama}
                      </h3>
                      {item.rekomendasi && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/20 text-[10px] font-semibold px-2 py-0.5 shrink-0"
                        >
                          <Star className="w-3 h-3 mr-0.5 fill-amber-500 text-amber-500" />
                          Favorit
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                    {item.ukuran && item.ukuran.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.ukuran.map((uk) => (
                          <span
                            key={uk}
                            className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-md"
                          >
                            {uk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="font-extrabold text-base text-primary">
                      {formatRupiah(item.harga)}
                    </span>
                    <span className="text-[11px] text-muted-foreground uppercase font-medium">
                      {item.kategori}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-xs text-muted-foreground mb-4">
                * Menu digital ini bersifat informatif, pemesanan dilakukan langsung di meja kasir.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Kerangka Section Galeri & Suasana (PRD Fase 2) */}
        <section id="galeri" className="py-16 sm:py-20 bg-secondary/30 border-b border-border/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12 space-y-3">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Suasana & Sudut Favorit
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ruang Nyaman untuk Cerita & Tugas
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Suasana syahdu dengan pencahayaan hangat, colokan di setiap meja, dan area balkon lantai 2 untuk menikmati angin sore.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {galeriList.map((foto) => (
                <div
                  key={foto.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="h-48 sm:h-64 bg-secondary flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-4">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium text-sm text-foreground">{foto.judul}</p>
                      {foto.sudut_favorit && (
                        <span className="text-xs text-amber-600 font-semibold block mt-1">
                          ⭐ Sudut Favorit Pengunjung
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Kerangka Section Jam Buka & Lokasi (PRD Fase 2) */}
        <section id="lokasi" className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Info Jadwal Jam Buka */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <Badge variant="secondary" className="px-3 py-1 text-xs font-medium mb-3">
                    <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Jadwal Operasional
                  </Badge>
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Jam Buka & Kunjungan
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Kami buka setiap hari untuk menemani pagi santai hingga malam produktif Anda.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
                  {infoToko.jam_buka.map((jadwal) => (
                    <div
                      key={jadwal.hari}
                      className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0 text-sm"
                    >
                      <span className="font-medium text-foreground">{jadwal.hari}</span>
                      <span className="text-muted-foreground font-mono text-xs">
                        {jadwal.libur ? "Libur" : `${jadwal.buka} - ${jadwal.tutup}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="rounded-full text-xs font-semibold px-5">
                    <a href={infoToko.link_peta} target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      Buka di Google Maps
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full text-xs font-semibold px-5">
                    <a
                      href={`https://wa.me/${infoToko.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                      Tanya via WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Lokasi & Embed Map */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    Alamat Lengkap
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{infoToko.alamat}</p>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden h-72 sm:h-96 shadow-xs bg-secondary">
                  {infoToko.embed_peta ? (
                    <iframe
                      src={infoToko.embed_peta}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lokasi Kopi Senja di Google Maps"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      Peta Google Maps
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer infoToko={infoToko} />
    </div>
  );
}
