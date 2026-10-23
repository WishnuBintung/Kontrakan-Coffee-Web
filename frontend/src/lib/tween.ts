/**
 * Mini tween engine (pengganti GSAP untuk koreografi hero) — tanpa dependency tambahan.
 * Easing meniru nama GSAP yang dipakai di konsep: power2.in, power2.inOut, back.out(s).
 */
export type Ease = (t: number) => number;

export const ease = {
  linear: (t: number) => t,
  power2In: (t: number) => t * t * t,
  power2InOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  backOut:
    (s = 1.70158): Ease =>
    (t: number) => {
      const c3 = s + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
    },
};

export type TweenHandle = { cancel: () => void; finished: Promise<void> };

export function tween(opts: {
  duration: number; // detik
  ease?: Ease;
  delay?: number; // detik
  onUpdate: (p: number) => void;
  onComplete?: () => void;
}): TweenHandle {
  const { duration, ease: e = ease.linear, delay = 0, onUpdate, onComplete } = opts;
  let raf = 0;
  let cancelled = false;
  let resolve!: () => void;
  const finished = new Promise<void>((r) => (resolve = r));
  const start = performance.now() + delay * 1000;

  const step = (now: number) => {
    if (cancelled) return;
    if (now < start) {
      raf = requestAnimationFrame(step);
      return;
    }
    const t = duration <= 0 ? 1 : Math.min(1, (now - start) / (duration * 1000));
    onUpdate(e(t));
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      onComplete?.();
      resolve();
    }
  };
  raf = requestAnimationFrame(step);

  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resolve();
    },
    finished,
  };
}

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mixHex(a: string, b: string, p: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const c = (x: number, y: number) => Math.round(lerp(x, y, p)).toString(16).padStart(2, "0");
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

