"use client";

import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/* Types & Authentic Menu Data from @kontrakan.coffee & PRD           */
/* ------------------------------------------------------------------ */

interface SignatureDrink {
  id: string;
  name: string;
  tagline: string;
  category: "signature" | "espresso" | "iced";
  price: number;
  description: string;
  tastingNotes: string[];
  composition: {
    foam: number; // percentage
    milk: number; // percentage
    coffee: number; // percentage
    syrup: number; // percentage
  };
  liquidColor: string;
  milkColor: string;
  foamColor: string;
  temp: "cold" | "hot";
  sweetness: "Normal" | "Less Sweet" | "No Sugar";
}

const SIGNATURE_DRINKS: SignatureDrink[] = [
  {
    id: "salted-caramel-latte",
    name: "Salted Caramel Latte",
    tagline: "Simple Moments, Great Coffee",
    category: "signature",
    price: 24000,
    description:
      "Perpaduan double espresso arabika dengan susu segar dingin, saus salted caramel buatan sendiri, dan cream foam gurih yang lumer lembut di lidah.",
    tastingNotes: ["Salted Caramel", "Velvety Cream", "Buttery Sweet"],
    composition: { foam: 22, milk: 42, coffee: 26, syrup: 10 },
    liquidColor: "#54331C",
    milkColor: "#F5EFE6",
    foamColor: "#EADDCF",
    temp: "cold",
    sweetness: "Normal",
  },
  {
    id: "aerocano",
    name: "Aerocano",
    tagline: "Fresh Quality Coffee for Everyone",
    category: "espresso",
    price: 18000,
    description:
      "Espresso arabika segar yang di-steam aerasi dengan micro-bubbles halus, menghasilkan tekstur selembut sutra dengan lapisan crema tebal keemasan.",
    tastingNotes: ["Silky Crema", "Sweet Cocoa", "Citrus Spark"],
    composition: { foam: 30, milk: 0, coffee: 70, syrup: 0 },
    liquidColor: "#3E271D",
    milkColor: "#3E271D",
    foamColor: "#C87D32",
    temp: "cold",
    sweetness: "No Sugar",
  },
  {
    id: "mont-blanc",
    name: "Mont Blanc",
    tagline: "Simple Moments, Great Coffee",
    category: "signature",
    price: 26000,
    description:
      "Inovasi kopi dingin khas Kontrakan: Cold brew arabika pekat berpadu lapisan citrus cream lembut dan parutan kulit jeruk segar yang wangi.",
    tastingNotes: ["Citrus Orange Zest", "Whipped Cream", "Dark Plum"],
    composition: { foam: 32, milk: 0, coffee: 60, syrup: 8 },
    liquidColor: "#2F1B12",
    milkColor: "#2F1B12",
    foamColor: "#F7E6BA",
    temp: "cold",
    sweetness: "Less Sweet",
  },
  {
    id: "es-kopi-susu-senja",
    name: "Es Kopi Susu Senja",
    tagline: "Klasik Aren Yogyakarta",
    category: "signature",
    price: 18000,
    description:
      "Double ristretto arabika dipadukan susu segar dingin dan lelehan gula aren murni Kulon Progo dengan rasa seimbang dan creamy.",
    tastingNotes: ["Aren Legit", "Creamy Lembut", "Aftertaste Nutty"],
    composition: { foam: 12, milk: 48, coffee: 25, syrup: 15 },
    liquidColor: "#4A2E1B",
    milkColor: "#F5EFE6",
    foamColor: "#E8DDD0",
    temp: "cold",
    sweetness: "Normal",
  },
];

interface ScenarioCard {
  id: string;
  time: string;
  text: string;
}

const SCENARIOS: ScenarioCard[] = [
  {
    id: "s1",
    time: "07:45 AM · Pagi Kampus",
    text: "Sruput Aerocano dingin berbusa sutra sebelum kelas pagi di Seturan.",
  },
  {
    id: "s2",
    time: "11:00 AM · Transisi Belajar",
    text: "Tiga tarikan napas panjang di sela tugas kuliah yang padat.",
  },
  {
    id: "s3",
    time: "01:30 PM · Jeda Layar Laptop",
    text: "Alihkan mata ke pepohonan luar jendela kaca kafe yang teduh.",
  },
  {
    id: "s4",
    time: "05:45 PM · Menikmati Senja",
    text: "Segelas Salted Caramel Latte dingin sambil menatap langit jingga.",
  },
  {
    id: "s5",
    time: "08:30 PM · Obrolan Santai",
    text: "Tulis satu catatan di buku harian ditemani camilan hangat.",
  },
  {
    id: "s6",
    time: "10:15 PM · Malam Tenang",
    text: "Mont Blanc citrus brew untuk menyegarkan pikiran sebelum pulang.",
  },
];

interface TestimonialNote {
  id: string;
  quote: string;
  author: string;
  date: string;
  rotation: "rotate-note-pos" | "rotate-note-neg";
}

const TESTIMONIALS: TestimonialNote[] = [
  {
    id: "t1",
    quote:
      "Salted Caramel Latte-nya beneran enak banget! Creamy, gurih, kopinya tetep berasa nendang. Tempat paling aman kalau mau ngerjain tugas tanpa terdistraksi.",
    author: "Rian Aditya · Mahasiswa UPN Veteran",
    date: "Kamis sore, meja no. 4",
    rotation: "rotate-note-pos",
  },
  {
    id: "t2",
    quote:
      "Aerocano-nya unik banget, busa cremanyanya tebel kayak nitro coffee tapi harganya tetap ramah di kantong. Teras luarnya adem banget pas jam lima sore.",
    author: "Dinda & Maya · Pengunjung Setia",
    date: "Sabtu santai",
    rotation: "rotate-note-neg",
  },
  {
    id: "t3",
    quote:
      "Nggak ada musik bising jedag-jedug. Suasananya beneran 'digital living room'—nyaman buat buka laptop, ngetik kode, atau sekadar baca buku sampai malam.",
    author: "Bagus Prasetyo · Freelance Designer",
    date: "Selasa, 14:30 WIB",
    rotation: "rotate-note-neg",
  },
  {
    id: "t4",
    quote:
      "Mont Blanc dengan citrus creamnya segar banget! Perpaduan kopi pekat sama hint jeruknya pas. Suasana kafenya hangat dan stafnya selalu ramah.",
    author: "Siti Rahma · Penikmat Kopi Sleman",
    date: "Minggu senja",
    rotation: "rotate-note-pos",
  },
];

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Mengapa Kontrakan Coffee menyebut dirinya 'digital living room'?",
    a: "Banyak kedai kopi modern dirancang untuk perputaran cepat pelanggan. Kami merancang ruang tamu yang tenang, taktil, dan unhurried—tempat Anda bisa bernapas lega, bekerja dengan laptop, atau menikmati secangkir kopi tanpa merasa diburu-buru.",
  },
  {
    q: "Apakah tersedia Wi-Fi kencang dan colokan di setiap meja?",
    a: "Ya. Seluruh area indoor dan sebagian besar meja outdoor kami dilengkapi stopkontak dan akses internet cepat 100 Mbps, cocok untuk nugas kuliah maupun remote working.",
  },
  {
    q: "Apa yang membuat menu Aerocano dan Mont Blanc istimewa?",
    a: "Aerocano adalah espresso arabika yang di-steam aerasi menghasilkan busa sutra tebal tanpa susu, sedangkan Mont Blanc memadukan cold brew arabika pekat dengan citrus cream dan parutan kulit jeruk segar khas resep orisinal kami.",
  },
  {
    q: "Apakah ada pilihan menu non-kopi dan camilan hangat?",
    a: "Tersedia lengkap! Mulai dari Matcha Latte, Artisan Earl Grey, Berry Lemonade segar, hingga camilan favorit seperti Roti Bakar Senja, Croissant Butter, dan Kentang Truffle.",
  },
  {
    q: "Bagaimana akses lokasi dan jam operasional di Seturan?",
    a: "Kami berlokasi di Jl. Seturan Raya No. 45, Sleman. Buka setiap hari: Senin–Kamis (09:00–23:00), Jumat (13:00–23:30), Sabtu (09:00–24:00), dan Minggu (09:00–23:00 WIB).",
  },
];

/* ------------------------------------------------------------------ */
/* Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function KontrakanCoffeePage() {
  // Drink recommendation selector state
  const [selectedDrinkIdx, setSelectedDrinkIdx] = useState(0);
  const currentDrink = SIGNATURE_DRINKS[selectedDrinkIdx];

  // Interactive cup options
  const [tempChoice, setTempChoice] = useState<"cold" | "hot">(currentDrink.temp);
  const [sweetnessChoice, setSweetnessChoice] = useState<"Normal" | "Less Sweet" | "No Sugar">(
    currentDrink.sweetness
  );
  const [milkChoice, setMilkChoice] = useState<"Fresh Milk" | "Oat Milk" | "Susu Kedelai">(
    "Fresh Milk"
  );
  const [savedRecipeNotice, setSavedRecipeNotice] = useState(false);

  // Breathing & brew ritual state for center mockup
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathSeconds, setBreathSeconds] = useState(4);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Waitlist / Circle form state
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client hydration guard for maps iframe & browser extensions
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update options when drink changes
  useEffect(() => {
    setTempChoice(currentDrink.temp);
    setSweetnessChoice(currentDrink.sweetness);
  }, [selectedDrinkIdx, currentDrink]);

  // Reveal-on-scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll("[data-rev]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // Breathing cycle timer
  useEffect(() => {
    if (!isBreathing) {
      setBreathPhase("Inhale");
      setBreathSeconds(4);
      return;
    }

    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev > 1) return prev - 1;
        if (breathPhase === "Inhale") {
          setBreathPhase("Hold");
          return 4;
        } else if (breathPhase === "Hold") {
          setBreathPhase("Exhale");
          return 4;
        } else {
          setBreathPhase("Inhale");
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, breathPhase]);

  const handleSaveRecipe = () => {
    setSavedRecipeNotice(true);
    setTimeout(() => setSavedRecipeNotice(false), 3000);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#1F1A17] selection:bg-[#C87D32] selection:text-white">
      {/* ------------------------------------------------------------ */}
      {/* Global Grain / Paper Texture Overlay                         */}
      {/* ------------------------------------------------------------ */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ------------------------------------------------------------ */}
      {/* Navigation: Floating Pill-Shaped                             */}
      {/* ------------------------------------------------------------ */}
      <header className="fixed top-5 left-0 right-0 z-40 flex justify-center px-4">
        <nav
          className="w-[calc(100%-32px)] max-w-4xl flex items-center justify-between px-5 sm:px-7 py-3 rounded-full border border-[#E8DDD0] shadow-soft backdrop-blur-[20px]"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }}
          aria-label="Navigasi Utama"
        >
          {/* Logo with Caramel circle & white dot */}
          <a href="#" className="flex items-center gap-3 group">
            <span
              className="w-7 h-7 rounded-full bg-[#C87D32] flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
              aria-hidden="true"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </span>
            <div className="flex flex-col text-left">
              <span className="font-sans font-medium text-lg leading-tight tracking-tight text-[#1F1A17]">
                Kontrakan Coffee
              </span>
              <span className="text-[10px] text-[#786C62] font-medium tracking-wide">
                SETURAN · SLEMAN
              </span>
            </div>
          </a>

          {/* Desktop Nav Links (14px Outfit Medium) */}
          <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#786C62]">
            <a href="#rituals" className="hover:text-[#1F1A17] transition-colors">
              Momen harian
            </a>
            <a href="#experience" className="hover:text-[#1F1A17] transition-colors">
              Model kopi
            </a>
            <a href="#notes" className="hover:text-[#1F1A17] transition-colors">
              Catatan meja
            </a>
            <a href="#faq" className="hover:text-[#1F1A17] transition-colors">
              Pertanyaan
            </a>
            <a href="#lokasi" className="hover:text-[#1F1A17] transition-colors">
              Lokasi &amp; jam
            </a>
          </div>

          {/* Dark Espresso (#1F1A17) Pill CTA Button */}
          <div className="flex items-center gap-2">
            <a
              href="#lokasi"
              className="bg-[#1F1A17] text-white hover:bg-[#3E271D] text-[13.5px] font-medium px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
            >
              Kunjungi kafe
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1F1A17] rounded-full hover:bg-stone-100"
              aria-label="Buka menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-40 bg-white/95 backdrop-blur-xl border border-[#E8DDD0] rounded-3xl p-6 shadow-xl flex flex-col gap-4 text-center md:hidden">
          <a
            href="#rituals"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[#1F1A17] font-medium"
          >
            Momen harian
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[#1F1A17] font-medium"
          >
            Model kopi interaktif
          </a>
          <a
            href="#notes"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[#1F1A17] font-medium"
          >
            Catatan meja
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[#1F1A17] font-medium"
          >
            Pertanyaan umum
          </a>
          <a
            href="#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[#1F1A17] font-medium"
          >
            Lokasi &amp; jam buka
          </a>
          <a
            href="#waitlist"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 bg-[#C87D32] text-white py-3 rounded-full font-medium"
          >
            Gabung lingkaran senja
          </a>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Hero Section: Center-Aligned with Warm Cream Blobs           */}
      {/* ------------------------------------------------------------ */}
      <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 overflow-hidden bg-white">
        {/* Warm Ambient Floating Blobs (#F7EADB & #EBE2D5 at 60% opacity) */}
        <div
          className="absolute -top-16 left-1/4 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full pointer-events-none animate-float-1"
          style={{
            backgroundColor: "#F7EADB",
            opacity: 0.6,
            filter: "blur(80px)",
            transform: "translate3d(0,0,0)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-32 right-1/4 w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full pointer-events-none animate-float-2"
          style={{
            backgroundColor: "#EBE2D5",
            opacity: 0.6,
            filter: "blur(80px)",
            transform: "translate3d(0,0,0)",
          }}
          aria-hidden="true"
        />

        <div className="w-full max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div
            className="inline-flex items-center gap-2 bg-[#FAF6F0] border border-[#E8DDD0] px-4 py-1.5 rounded-full text-xs font-medium text-[#786C62] shadow-soft mb-8"
            data-rev
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <span className="w-2 h-2 rounded-full bg-[#C87D32]" />
            <span>Simple Moments, Great Coffee</span>
            <span className="text-[#E8DDD0]">·</span>
            <span className="text-[#1F1A17] font-semibold">@kontrakan.coffee</span>
          </div>

          {/* Headline (Outfit with handwritten cursive word inserted for emphasis) */}
          <h1
            className="h-display max-w-3xl mx-auto text-[#1F1A17]"
            data-rev
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            Ruang teduh untuk rehat dan{" "}
            <span className="font-cursive text-5xl sm:text-7xl md:text-8xl text-[#C87D32] font-normal px-1.5 inline-block transform -rotate-1">
              menikmati senja
            </span>{" "}
            dengan secangkir kopi.
          </h1>

          {/* Sub-headline (max-width 500px, color #786C62) */}
          <p
            className="max-w-[500px] mx-auto mt-6 text-[#786C62] text-lg sm:text-xl font-normal leading-relaxed"
            data-rev
            style={{ "--d": "200ms" } as React.CSSProperties}
          >
            Kopi Senja menyeduh biji arabika pilihan Nusantara dengan gula aren murni
            di Seturan, Sleman. Tanpa buru-buru, nikmati waktu mengalir pelan bersama kawan.
          </p>

          {/* Dual CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9"
            data-rev
            style={{ "--d": "300ms" } as React.CSSProperties}
          >
            {/* Primary pill in Caramel Amber #C87D32 with soft shadow */}
            <a
              href="#experience"
              className="w-full sm:w-auto bg-[#C87D32] hover:bg-[#B46924] text-white px-8 py-3.5 rounded-full font-medium text-[16px] shadow-soft active:scale-95 transition-all text-center"
            >
              Coba model kopi interaktif
            </a>
            {/* Secondary pill in white with 1px border */}
            <a
              href="#lokasi"
              className="w-full sm:w-auto bg-white border border-[#E8DDD0] text-[#1F1A17] px-8 py-3.5 rounded-full font-medium text-[16px] hover:bg-[#F5EFE6] active:scale-95 transition-all text-center shadow-soft"
            >
              Lihat lokasi kafe
            </a>
          </div>

          {/* Trust Caption */}
          <p
            className="mt-6 text-xs text-[#786C62]/90 tracking-wide font-normal"
            data-rev
            style={{ "--d": "380ms" } as React.CSSProperties}
          >
            Stopkontak di setiap meja · Wi-Fi kencang 100 Mbps · Area indoor AC &amp; outdoor senja
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Horizontal Scenario Scroll                                   */}
      {/* ------------------------------------------------------------ */}
      <section id="rituals" className="py-20 bg-[#FAF6F0] border-y border-[#E8DDD0]/70 overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#786C62] font-semibold mb-2" data-rev>
                Skenario harian
              </p>
              <h2
                className="h-section text-[#1F1A17]"
                data-rev
                style={{ "--d": "80ms" } as React.CSSProperties}
              >
                Momen kopi yang menemani harimu.
              </h2>
            </div>
            <p
              className="text-sm text-[#786C62] max-w-xs"
              data-rev
              style={{ "--d": "160ms" } as React.CSSProperties}
            >
              Geser horizontal untuk menemukan ritme unhurried di setiap sudut harimu
              di Kontrakan Coffee.
            </p>
          </div>
        </div>

        {/* Horizontal Track of Cards (288px width, 160px height, white bg, rounded-3xl) */}
        <div
          className="scroll-no-bar flex gap-5 overflow-x-auto px-4 sm:px-8 pb-6 pt-2 snap-x snap-mandatory"
          data-rev
          style={
            {
              paddingLeft: "max(1.25rem, calc((100vw - 1160px) / 2 + 1.25rem))",
              paddingRight: "max(1.25rem, calc((100vw - 1160px) / 2 + 1.25rem))",
              "--d": "240ms",
            } as React.CSSProperties
          }
        >
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className="group flex-none w-[288px] h-[160px] bg-white rounded-3xl p-6 shadow-soft border border-[#E8DDD0] flex flex-col justify-between snap-start cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#C87D32]"
            >
              {/* Top-left timestamp in 14px stone-400 */}
              <div className="text-[14px] text-[#786C62] font-medium">
                {scenario.time}
              </div>
              {/* Bottom text in 20px stone-800, hover color changes to Caramel #C87D32 */}
              <div className="text-[19px] font-medium text-[#1F1A17] leading-snug group-hover:text-[#C87D32] transition-colors duration-300">
                {scenario.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* App Experience Preview: Three-Mockup Cascading Layout        */}
      {/* ------------------------------------------------------------ */}
      <section
        id="experience"
        className="py-24 sm:py-32 bg-white overflow-hidden relative"
      >
        <div className="w-full max-w-4xl mx-auto px-4 text-center mb-16 sm:mb-20">
          <p className="text-xs uppercase tracking-widest text-[#786C62] font-semibold mb-3" data-rev>
            MODEL SEDUH INTERAKTIF
          </p>
          <h2
            className="h-section max-w-2xl mx-auto text-[#1F1A17]"
            data-rev
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            Rekomendasi Rasa dari Barista Kontrakan.
          </h2>
          <p
            className="text-base sm:text-lg text-[#786C62] max-w-xl mx-auto mt-4"
            data-rev
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Eksplorasi layering kopi, tekstur susu, dan tingkat manis secara visual
            sebelum Anda memesan langsung di kasir kafe kami.
          </p>
        </div>

        {/* Three Mockup Stacked Layout */}
        <div className="w-full max-w-5xl mx-auto px-4 relative flex justify-center items-center">
          <div className="relative w-full max-w-5xl flex justify-center items-start pt-6 pb-20">
            {/* 1. Left Phone Mockup: 280x580px, 80% opacity, Surface Warm Oat (#F5EFE6), +48px down */}
            <div
              className="hidden lg:block absolute left-8 top-12 w-[280px] h-[580px] rounded-[40px] p-3 shadow-float border border-[#E8DDD0] transition-all duration-500 hover:opacity-100"
              data-rev
              style={
                {
                  backgroundColor: "#FFFFFF",
                  opacity: 0.88,
                  transform: "translate3d(0, 48px, 0)",
                  "--d": "200ms",
                } as React.CSSProperties
              }
            >
              <div
                className="w-full h-full rounded-[32px] p-5 flex flex-col justify-between overflow-hidden"
                style={{ backgroundColor: "#F5EFE6" }}
              >
                {/* Mockup Status Bar */}
                <div className="flex justify-between items-center text-[11px] font-medium text-[#786C62]">
                  <span>Seturan</span>
                  <div className="w-16 h-3 bg-[#1F1A17]/10 rounded-full" />
                  <span>25°C Sore</span>
                </div>

                {/* Left Screen Content */}
                <div className="mt-4">
                  <span className="text-[12px] font-medium uppercase tracking-wider text-[#C87D32]">
                    Suasana Kafe
                  </span>
                  <h3 className="text-xl font-medium text-[#1F1A17] mt-1">
                    Ruang Tamu Seturan
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    <div className="bg-white/90 p-3 rounded-2xl text-xs text-[#1F1A17] shadow-sm border border-[#E8DDD0]/50">
                      ☕ Aerocano &amp; Salted Caramel disajikan dingin.
                    </div>
                    <div className="bg-white/90 p-3 rounded-2xl text-xs text-[#1F1A17] shadow-sm border border-[#E8DDD0]/50">
                      ⚡ Stopkontak &amp; Wi-Fi 100 Mbps di setiap meja.
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl text-xs text-[#786C62] border border-dashed border-[#E8DDD0]">
                      + Teras luar senja siap dinikmati
                    </div>
                  </div>
                </div>

                {/* Bottom status pill */}
                <div className="bg-white/90 p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-[#E8DDD0]/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-medium text-[#1F1A17]">
                    Buka Hari Ini s/d 23:00 WIB
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Center Phone Mockup: 300x620px, 100% opaque, with Caramel (#C87D32) interactive model */}
            <div
              className="relative z-20 w-[300px] h-[620px] rounded-[44px] p-3.5 shadow-float border border-[#E8DDD0] bg-white"
              data-rev
              style={{ "--d": "100ms" } as React.CSSProperties}
            >
              <div className="w-full h-full rounded-[34px] bg-[#FAF6F0] p-6 flex flex-col justify-between relative overflow-hidden border border-[#E8DDD0]/60">
                {/* Screen Header / Status */}
                <div>
                  <div className="flex justify-between items-center text-[12px] font-medium text-[#786C62] mb-3">
                    <span>09:41</span>
                    <div className="w-20 h-4 bg-[#1F1A17] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-stone-700" />
                    </div>
                    <span>Tenang</span>
                  </div>

                  {/* Drink Selector Tabs */}
                  <div className="flex items-center justify-between gap-1 p-1 bg-white rounded-full border border-[#E8DDD0] mb-3">
                    {SIGNATURE_DRINKS.map((drink, idx) => (
                      <button
                        key={drink.id}
                        type="button"
                        onClick={() => setSelectedDrinkIdx(idx)}
                        className={`flex-1 py-1 rounded-full text-[10px] font-medium transition-all ${
                          selectedDrinkIdx === idx
                            ? "bg-[#C87D32] text-white font-semibold shadow-sm"
                            : "text-[#786C62] hover:text-[#1F1A17]"
                        }`}
                      >
                        {idx === 0 ? "Caramel" : idx === 1 ? "Aerocano" : idx === 2 ? "Mont Blanc" : "Kopi Susu"}
                      </button>
                    ))}
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-[10px] text-[#C87D32] uppercase tracking-wider font-semibold">
                      {currentDrink.tagline}
                    </span>
                    <h3 className="text-xl font-semibold text-[#1F1A17] mt-0.5">
                      {currentDrink.name}
                    </h3>
                    <p className="text-xs font-bold text-[#3E271D] mt-0.5">
                      Rp {currentDrink.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Central Interactive Coffee Cup Model with Dynamic Layers */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="relative w-36 h-44 rounded-b-[36px] rounded-t-[10px] border-4 border-[#1F1A17] bg-white p-1.5 flex flex-col justify-end overflow-hidden shadow-cup transition-all duration-700">
                    {/* Inner Layers */}
                    <div className="w-full h-full rounded-b-[28px] rounded-t-[6px] flex flex-col justify-end overflow-hidden relative">
                      {/* Top Foam / Crema Layer */}
                      <div
                        className="w-full transition-all duration-700 flex items-center justify-center relative z-10"
                        style={{
                          height: `${currentDrink.composition.foam}%`,
                          backgroundColor: currentDrink.foamColor,
                        }}
                      >
                        {/* Crema pattern */}
                        <div className="w-8 h-2 border-b border-dashed border-[#3E271D]/40 rounded-full opacity-60" />
                      </div>

                      {/* Steamed Milk Layer */}
                      {currentDrink.composition.milk > 0 && (
                        <div
                          className="w-full transition-all duration-700 relative"
                          style={{
                            height: `${currentDrink.composition.milk}%`,
                            backgroundColor:
                              milkChoice === "Oat Milk"
                                ? "#EFE4D3"
                                : milkChoice === "Susu Kedelai"
                                ? "#F8F1E5"
                                : currentDrink.milkColor,
                          }}
                        />
                      )}

                      {/* Coffee Liquid Extract Layer */}
                      <div
                        className="w-full transition-all duration-700 relative"
                        style={{
                          height: `${currentDrink.composition.coffee + currentDrink.composition.syrup}%`,
                          backgroundColor: currentDrink.liquidColor,
                        }}
                      >
                        {currentDrink.composition.syrup > 0 && (
                          <div className="absolute bottom-0 inset-x-0 h-3 bg-[#24130A] opacity-90" />
                        )}
                      </div>
                    </div>

                    {/* Glass highlight */}
                    <div className="absolute inset-y-0 left-2 w-2 bg-white/40 rounded-full pointer-events-none" />
                  </div>

                  {/* Pulsing 'Breathe & Brew' Action Circle */}
                  <button
                    type="button"
                    onClick={() => setIsBreathing(!isBreathing)}
                    aria-label="Mulai ritual napas dan seduh santai"
                    className={`mt-4 px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-500 shadow-sm ${
                      isBreathing ? "bg-[#3E271D] text-white" : "bg-[#C87D32] text-white animate-breathe"
                    }`}
                  >
                    {isBreathing ? `${breathPhase}: ${breathSeconds}s` : "Sentuh: Ritual Seduh"}
                  </button>
                </div>

                {/* Bottom Sound Bar Pill */}
                <div className="bg-white p-2.5 rounded-2xl border border-[#E8DDD0] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C87D32] animate-pulse" />
                    <div className="text-left">
                      <div className="text-[10.5px] font-medium text-[#1F1A17]">
                        Suara Mesin Espresso &amp; Rintik
                      </div>
                      <div className="text-[9px] text-[#786C62]">
                        Ambient tenang Kontrakan Coffee
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-end h-3">
                    <span className="w-0.5 bg-[#C87D32] h-2 rounded-full animate-bounce" />
                    <span className="w-0.5 bg-[#C87D32] h-3 rounded-full animate-bounce delay-100" />
                    <span className="w-0.5 bg-[#C87D32] h-1.5 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Right Phone Mockup: 280x580px, 80% opacity, Surface Warm Oat (#F5EFE6), +96px down */}
            <div
              className="hidden lg:block absolute right-8 top-12 w-[280px] h-[580px] rounded-[40px] p-3 shadow-float border border-[#E8DDD0] transition-all duration-500 hover:opacity-100"
              data-rev
              style={
                {
                  backgroundColor: "#FFFFFF",
                  opacity: 0.88,
                  transform: "translate3d(0, 96px, 0)",
                  "--d": "300ms",
                } as React.CSSProperties
              }
            >
              <div
                className="w-full h-full rounded-[32px] p-5 flex flex-col justify-between overflow-hidden"
                style={{ backgroundColor: "#F5EFE6" }}
              >
                {/* Mockup Status Bar */}
                <div className="flex justify-between items-center text-[11px] font-medium text-[#786C62]">
                  <span>Menu Favorit</span>
                  <div className="w-16 h-3 bg-[#1F1A17]/10 rounded-full" />
                  <span>Sleman</span>
                </div>

                {/* Right Screen Content */}
                <div className="mt-4">
                  <span className="text-[12px] font-medium uppercase tracking-wider text-[#C87D32]">
                    Signature Drinks
                  </span>
                  <h3 className="text-xl font-medium text-[#1F1A17] mt-1">
                    Pilihan Utama
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    <div className="bg-white/90 p-3 rounded-2xl flex items-center justify-between shadow-sm border border-[#E8DDD0]/50">
                      <div>
                        <span className="text-xs text-[#1F1A17] font-semibold block">
                          Salted Caramel Latte
                        </span>
                        <span className="text-[10px] text-[#786C62]">
                          Double espresso &amp; cream
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#C87D32]">24k</span>
                    </div>

                    <div className="bg-white/90 p-3 rounded-2xl flex items-center justify-between shadow-sm border border-[#E8DDD0]/50">
                      <div>
                        <span className="text-xs text-[#1F1A17] font-semibold block">
                          Aerocano
                        </span>
                        <span className="text-[10px] text-[#786C62]">
                          Silky microfoam espresso
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#C87D32]">18k</span>
                    </div>

                    <div className="bg-white/90 p-3 rounded-2xl flex items-center justify-between shadow-sm border border-[#E8DDD0]/50">
                      <div>
                        <span className="text-xs text-[#1F1A17] font-semibold block">
                          Mont Blanc
                        </span>
                        <span className="text-[10px] text-[#786C62]">
                          Citrus cream cold brew
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#C87D32]">26k</span>
                    </div>
                  </div>
                </div>

                {/* Contact phone pill from social media */}
                <div className="bg-white/90 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-[#E8DDD0]/60">
                  <span className="text-xs font-medium text-[#786C62]">
                    Hotline Kafe:
                  </span>
                  <span className="text-xs font-semibold text-[#1F1A17]">
                    +6082241760864
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Diary Entry Testimonials: Rotating Paper Cards               */}
      {/* ------------------------------------------------------------ */}
      <section id="notes" className="py-24 sm:py-32 bg-[#FAF6F0] border-t border-[#E8DDD0]/70">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-widest text-[#786C62] font-semibold mb-3" data-rev>
              Catatan meja
            </p>
            <h2
              className="h-section text-[#1F1A17]"
              data-rev
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              Cerita yang tertinggal di atas meja.
            </h2>
            <p
              className="text-[#786C62] mt-3 text-base"
              data-rev
              style={{ "--d": "160ms" } as React.CSSProperties}
            >
              Catatan jujur dari mahasiswa, pekerja kreatif, dan penikmat senja di Seturan.
            </p>
          </div>

          {/* Testimonial Cards Grid with Subtle Physical Rotation (+1 or -1 deg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((item, idx) => (
              <article
                key={item.id}
                className={`bg-white p-8 sm:p-9 rounded-[2rem] border border-[#E8DDD0] shadow-soft flex flex-col justify-between transition-transform duration-300 ${item.rotation}`}
                data-rev
                style={{ "--d": `${idx * 100 + 120}ms` } as React.CSSProperties}
              >
                <div>
                  <span className="text-[12px] font-medium text-[#786C62] block mb-4 uppercase tracking-wider">
                    {item.date}
                  </span>
                  <p className="text-[#1F1A17] text-lg leading-relaxed font-normal">
                    “{item.quote}”
                  </p>
                </div>

                {/* Signature style: 32px line followed by Reenie Beanie cursive text in 24px stone-500 */}
                <div className="mt-8 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-[#C87D32]" aria-hidden="true" />
                  <span className="font-cursive text-2xl text-[#786C62]">
                    {item.author}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Interactive FAQ Accordion: 500ms Smooth Height & Plus Rotate */}
      {/* ------------------------------------------------------------ */}
      <section id="faq" className="py-20 sm:py-28 bg-white border-t border-[#E8DDD0]/70">
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-[#786C62] font-semibold mb-2" data-rev>
              Pertanyaan umum
            </p>
            <h2
              className="h-section text-[#1F1A17]"
              data-rev
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              Hal yang sering ditanyakan tentang Kontrakan Coffee.
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8DDD0] shadow-soft overflow-hidden transition-all duration-300"
                  data-rev
                  style={{ "--d": `${idx * 60 + 100}ms` } as React.CSSProperties}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-lg text-[#1F1A17] focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`flex-none w-7 h-7 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#1F1A17] transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-[#C87D32] text-white" : "rotate-0"
                      }`}
                      aria-hidden="true"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>

                  <div className={`faq-content ${isOpen ? "open" : ""}`}>
                    <div className="faq-inner px-6 pb-6 text-[#786C62] text-[15.5px] leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Waitlist Conversion: Full-Width with Central Focus           */}
      {/* ------------------------------------------------------------ */}
      <section
        id="waitlist"
        className="py-24 sm:py-32 relative overflow-hidden bg-[#FAF6F0]"
      >
        {/* Blurred Floating Warm Gradients */}
        <div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full pointer-events-none animate-float-2"
          style={{
            backgroundColor: "#F7EADB",
            opacity: 0.7,
            filter: "blur(90px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] rounded-full pointer-events-none animate-float-1"
          style={{
            backgroundColor: "#EBE2D5",
            opacity: 0.6,
            filter: "blur(90px)",
          }}
          aria-hidden="true"
        />

        <div className="w-full max-w-2xl mx-auto px-4 relative z-10 text-center">
          {/* Dark espresso rounded-square icon at top with caramel dot */}
          <div
            className="w-14 h-14 bg-[#1F1A17] rounded-2xl flex items-center justify-center shadow-float mx-auto mb-7"
            data-rev
          >
            <span className="w-3 h-3 rounded-full bg-[#C87D32]" />
          </div>

          <h2
            className="h-section text-[#1F1A17]"
            data-rev
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            Langkah masuk ke ruang tamu kami.
          </h2>

          <p
            className="mt-4 text-[#786C62] text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
            data-rev
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            Daftarkan email Anda untuk menerima kabar menu musiman, jadwal live music
            akustik, dan catatan senja mingguan dari barista kami.
          </p>

          {/* Form: Email input (rounded-full, bg-stone-50) & black button scaling on hover */}
          <div
            className="mt-8 max-w-md mx-auto"
            data-rev
            style={{ "--d": "260ms" } as React.CSSProperties}
          >
            {submitted ? (
              <div className="bg-white border border-[#E8DDD0] text-[#1F1A17] p-6 rounded-3xl shadow-soft">
                <span className="font-cursive text-3xl text-[#C87D32] block mb-1">
                  Selamat datang di Kontrakan Coffee.
                </span>
                <p className="text-sm text-[#786C62]">
                  Anda adalah kawan senja #1,428. Silakan tarik napas perlahan dan
                  singgah ke Seturan kapan pun Anda butuh ketenangan.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col sm:flex-row gap-3 items-center"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ketik email santai Anda..."
                  required
                  className="w-full bg-white border border-[#E8DDD0] px-6 py-4 rounded-full text-[#1F1A17] placeholder:text-[#786C62]/60 focus:outline-none focus:ring-2 focus:ring-[#C87D32] shadow-sm text-sm"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-none bg-[#1F1A17] hover:bg-[#3E271D] text-white px-8 py-4 rounded-full font-medium text-sm transition-transform duration-300 hover:scale-105 active:scale-95 shadow-md"
                >
                  Gabung senja
                </button>
              </form>
            )}
          </div>

          <p
            className="mt-5 text-xs text-[#786C62]/70"
            data-rev
            style={{ "--d": "320ms" } as React.CSSProperties}
          >
            Tanpa spam promosi berisik · Berhenti langganan kapan saja dengan satu klik
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Lokasi & Informasi Kafe (Sesuai kopi-senja-PRD.md)          */}
      {/* ------------------------------------------------------------ */}
      <section id="lokasi" className="py-24 sm:py-32 bg-white border-t border-[#E8DDD0]">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FAF6F0] rounded-[2.5rem] border border-[#E8DDD0] p-8 sm:p-14 shadow-float grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Info Column */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DDD0] text-[#1F1A17] text-xs font-semibold mb-5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>KEDAI BUKA HARI INI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F1A17] leading-tight">
                Singgah di Kontrakan Coffee Seturan.
              </h2>

              <p className="mt-4 text-[#786C62] text-base leading-relaxed">
                Jl. Seturan Raya No. 45, Caturtunggal, Depok, Sleman, D.I. Yogyakarta 55281
              </p>

              {/* Operating Hours Table */}
              <div className="mt-6 p-5 bg-white rounded-2xl border border-[#E8DDD0] space-y-2 text-sm shadow-sm">
                <div className="flex justify-between items-center text-[#1F1A17]">
                  <span className="font-medium">Senin — Kamis:</span>
                  <span className="font-semibold text-[#786C62]">09:00 — 23:00 WIB</span>
                </div>
                <div className="flex justify-between items-center text-[#1F1A17]">
                  <span className="font-medium">Jumat:</span>
                  <span className="font-semibold text-[#786C62]">13:00 — 23:30 WIB</span>
                </div>
                <div className="flex justify-between items-center text-[#1F1A17]">
                  <span className="font-medium">Sabtu (Malam Minggu):</span>
                  <span className="font-semibold text-[#C87D32]">09:00 — 24:00 WIB</span>
                </div>
                <div className="flex justify-between items-center text-[#1F1A17]">
                  <span className="font-medium">Minggu:</span>
                  <span className="font-semibold text-[#786C62]">09:00 — 23:00 WIB</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=Kopi+Senja+Yogyakarta"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#1F1A17] hover:bg-[#3E271D] text-white px-6 py-3.5 rounded-full font-medium text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <span>📍</span>
                  <span>Buka di Google Maps</span>
                </a>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Kontrakan%20Coffee%2C%20mau%20tanya%20info%20kafe"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-[#E8DDD0] text-[#1F1A17] hover:bg-[#F5EFE6] px-6 py-3.5 rounded-full font-medium text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <span>💬</span>
                  <span>Tanya via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Map Embed Preview with isMounted guard and suppressHydrationWarning */}
            <div
              className="relative w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden border border-[#E8DDD0] shadow-sm bg-white"
              suppressHydrationWarning
            >
              {isMounted ? (
                <iframe
                  suppressHydrationWarning
                  title="Peta Lokasi Kontrakan Coffee Yogyakarta"
                  src="https://maps.google.com/maps?q=Kopi+Senja+Yogyakarta&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  aria-label="Peta Google Maps Kontrakan Coffee"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-[#FAF6F0] text-[#786C62] text-xs gap-2"
                  suppressHydrationWarning
                >
                  <span className="w-6 h-6 rounded-full bg-[#E8DDD0] animate-pulse" />
                  <span>Memuat peta lokasi...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Footer                                                       */}
      {/* ------------------------------------------------------------ */}
      <footer className="py-14 border-t border-[#E8DDD0] bg-white text-sm text-[#786C62]">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#C87D32] flex items-center justify-center shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
            <span className="font-sans font-medium text-[#1F1A17]">Kontrakan Coffee</span>
            <span className="text-[#E8DDD0]">·</span>
            <span className="text-xs text-[#786C62]">
              Simple Moments, Great Coffee
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#786C62]">
            <a href="#rituals" className="hover:text-[#1F1A17] transition-colors">
              Momen harian
            </a>
            <a href="#experience" className="hover:text-[#1F1A17] transition-colors">
              Model kopi
            </a>
            <a href="#notes" className="hover:text-[#1F1A17] transition-colors">
              Catatan meja
            </a>
            <a
              href="https://instagram.com/kontrakan.coffee"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1F1A17] transition-colors font-medium text-[#C87D32]"
            >
              @kontrakan.coffee ↗
            </a>
          </div>

          <div className="text-xs text-[#786C62]">
            © 2026 Kontrakan Coffee. Waktu melambat di sini.
          </div>
        </div>
      </footer>
    </div>
  );
}
