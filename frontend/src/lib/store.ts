/**
 * Helper client-safe (tanpa `fs`) untuk komponen interaktif:
 * - kalkulasi status buka/tutup real-time WIB (UTC+7)
 * - tautan kontak (WhatsApp bila tersedia, fallback Instagram)
 */
import type { InfoToko, JamBuka } from "./types";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

export type LiveStatus = {
  isOpen: boolean;
  label: string;
  hariIni: string;
};

function toWib(date: Date) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

export function getHariIniWib(date: Date = new Date()): string {
  return HARI[toWib(date).getDay()];
}

export function computeLiveStatus(jamBuka: JamBuka[], date: Date = new Date()): LiveStatus {
  const wib = toWib(date);
  const idx = wib.getDay();
  const hariIni = HARI[idx];
  const now = `${String(wib.getHours()).padStart(2, "0")}:${String(wib.getMinutes()).padStart(2, "0")}`;
  const find = (h: string) => jamBuka.find((j) => j.hari.toLowerCase() === h.toLowerCase());
  const today = find(hariIni);

  const nextOpen = () => {
    for (let i = 1; i <= 7; i++) {
      const s = find(HARI[(idx + i) % 7]);
      if (s && !s.libur) return i === 1 ? `besok ${s.buka}` : `${s.hari} ${s.buka}`;
    }
    return "";
  };

  if (!today || today.libur) {
    const n = nextOpen();
    return { isOpen: false, label: n ? `Tutup • Buka ${n}` : "Tutup", hariIni };
  }
  const tutup = today.tutup === "24:00" ? "23:59" : today.tutup;
  if (now >= today.buka && now <= tutup) {
    return { isOpen: true, label: `Buka • Tutup ${today.tutup}`, hariIni };
  }
  if (now < today.buka) {
    return { isOpen: false, label: `Tutup • Buka ${today.buka}`, hariIni };
  }
  const n = nextOpen();
  return { isOpen: false, label: n ? `Tutup • Buka ${n}` : "Tutup", hariIni };
}

export function contactLink(info: InfoToko, message?: string): { href: string; label: string } {
  if (info.whatsapp) {
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return { href: `https://wa.me/${info.whatsapp}${text}`, label: "WhatsApp" };
  }
  return { href: info.instagram, label: "Instagram" };
}

export function formatRupiahClient(nominal: number): string {
  if (typeof nominal !== "number" || Number.isNaN(nominal)) return "Rp 0";
  return `Rp ${nominal.toLocaleString("id-ID")}`;
}

