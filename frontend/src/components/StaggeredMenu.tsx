"use client";

/**
 * StaggeredMenu Component
 * 
 * A high-end navigation menu with staggered entrance animations, 
 * multiple background layers, and customizable social links.
 * Powered by GSAP and styled with the Kontrakan Coffee design system tokens.
 */

import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  /** Position of the menu panel */
  position?: "left" | "right";
  /** Background colors for the staggered layers (last one is main panel) */
  colors?: string[];
  /** Primary navigation items */
  items?: StaggeredMenuItem[];
  /** Social media links */
  socialItems?: StaggeredMenuSocialItem[];
  /** Whether to show social links section */
  displaySocials?: boolean;
  /** Whether to show '01', '02' numbering next to items */
  displayItemNumbering?: boolean;
  /** Custom class for the wrapper */
  className?: string;
  /** Custom logo or icon to display in the header */
  logo?: React.ReactNode;
  /** Center desktop navigation element */
  desktopNav?: React.ReactNode;
  /** Color of the menu button when closed */
  menuButtonColor?: string;
  /** Color of the menu button when open */
  openMenuButtonColor?: string;
  /** Brand accent color for highlights */
  accentColor?: string;
  /** Whether the menu wrapper should be fixed to viewport */
  isFixed?: boolean;
  /** Whether to animate the menu button color transition */
  changeMenuColorOnOpen?: boolean;
  /** Close menu when clicking outside the panel */
  closeOnClickAway?: boolean;
  /** Callback when menu starts opening */
  onMenuOpen?: () => void;
  /** Callback when menu starts closing */
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = "right",
  // Kontrakan Coffee 3-layer architecture: Deep Charcoal -> Amber Gold shimmer -> Dark Olive surface
  colors = ["#1C1A18", "#D99C5B", "#5B6653"],
  items = [
    { label: "Works", ariaLabel: "View selected architectural coffee works", link: "#works" },
    { label: "Manifesto", ariaLabel: "Read our spatial coffee manifesto", link: "#manifesto" },
    { label: "Contact", ariaLabel: "Contact our coffee atelier", link: "#contact" },
  ],
  socialItems = [
    { label: "Instagram", link: "https://instagram.com/kontrakancoffee" },
    { label: "Twitter / X", link: "https://x.com" },
    { label: "Behance", link: "https://behance.net" },
    { label: "Are.na", link: "https://are.na" },
  ],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logo,
  desktopNav,
  menuButtonColor = "#E8E3D9",
  openMenuButtonColor = "#D99C5B",
  changeMenuColorOnOpen = true,
  accentColor = "#D99C5B",
  isFixed = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const textInnerRef = useRef<HTMLDivElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(
          preContainer.querySelectorAll(".sm-prelayer")
        ) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel")
    ) as HTMLElement[];
    const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
    const socialLinks = Array.from(
      panel.querySelectorAll(".sm-socials-link")
    ) as HTMLElement[];

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.35,
      ease: "power3.in",
      stagger: {
        each: 0.05,
        from: "end",
      },
      overwrite: "auto",
      onComplete: () => {
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();

      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const seq = opening ? ["Menu", "...", "Close"] : ["Close", "...", "Menu"];

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current) {
        toggleMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMenu]);

  // Click outside listener
  useEffect(() => {
    if (!closeOnClickAway || !open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        toggleMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnClickAway, open, toggleMenu]);

  return (
    <div
      className={cn(
        "sm-scope select-none font-sans",
        isFixed ? "fixed inset-0 z-50 pointer-events-none" : "relative w-full h-full min-h-[600px]",
        className
      )}
    >
      {/* Dimmed backdrop when panel is open */}
      <div
        onClick={open ? toggleMenu : undefined}
        className={cn(
          "fixed inset-0 bg-[#1C1A18]/50 backdrop-blur-[2px] transition-opacity duration-500 z-[15]",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      <div
        className="staggered-menu-wrapper w-full h-full pointer-events-none"
        style={{ "--sm-accent": accentColor } as React.CSSProperties}
        data-position={position}
      >
        {/* Layer Backgrounds (Pre-layers) */}
        <div
          ref={preLayersRef}
          className={cn(
            "sm-prelayers absolute top-0 bottom-0 pointer-events-none z-[20] w-[100vw] sm:w-[60vw] md:w-[48vw] lg:w-[36vw]",
            position === "left" ? "left-0" : "right-0"
          )}
        >
          {colors.slice(0, -1).map((c, i) => (
            <div
              key={i}
              className="sm-prelayer absolute inset-0 shadow-2xl"
              style={{ background: c }}
            />
          ))}
        </div>

        {/* Global Navigation Bar / Header */}
        <header className="fixed top-0 left-0 w-full z-[30] px-6 py-5 bg-[#5B6653]/95 backdrop-blur-md border-b border-[#4D5746] transition-all pointer-events-auto">
          <nav className="max-w-7xl mx-auto w-full flex items-center justify-between text-[#E8E3D9]">
            {/* Logo / Brand Wordmark */}
            <div className="flex items-center">
              {logo || (
                <a
                  href="#"
                  className="text-[18px] font-bold tracking-tight uppercase hover:text-[#D99C5B] transition-colors font-sans text-[#E8E3D9]"
                >
                  KONTRAKAN COFFEE
                </a>
              )}
            </div>

            {/* Desktop Navigation Links (Optional center slot) */}
            {desktopNav && (
              <div className="hidden md:flex items-center gap-12">
                {desktopNav}
              </div>
            )}

            {/* Interactive Animated StaggeredMenu Toggle Button */}
            <button
              ref={toggleBtnRef}
              onClick={toggleMenu}
              className="sm-toggle flex items-center gap-3 px-4 py-2 sharp-edges bg-[#4D5746]/60 border border-[#4D5746] hover:border-[#D99C5B] hover:text-[#D99C5B] text-[#E8E3D9] transition-all focus:outline-none cursor-pointer group"
              aria-expanded={open}
              aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              <div className="relative h-[1.2em] overflow-hidden min-w-[48px] text-left">
                <div
                  ref={textInnerRef}
                  className="flex flex-col font-mono uppercase tracking-widest text-[12px] font-bold"
                >
                  {textLines.map((line, i) => (
                    <span key={i} className="h-[1.2em] leading-tight flex items-center">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
              <div ref={iconRef} className="relative w-3.5 h-3.5 flex items-center justify-center">
                <span
                  ref={plusHRef}
                  className="absolute top-1/2 left-0 w-full h-[2px] bg-current -translate-y-1/2"
                />
                <span
                  ref={plusVRef}
                  className="absolute top-0 left-1/2 w-[2px] h-full bg-current -translate-x-1/2"
                />
              </div>
            </button>
          </nav>
        </header>

        {/* Staggered Menu Panel (Main Content Layer) */}
        <aside
          ref={panelRef}
          className={cn(
            "staggered-menu-panel absolute top-0 bottom-0 z-[25] pointer-events-auto flex flex-col pt-32 pb-12 px-8 sm:px-14 overflow-y-auto w-[100vw] sm:w-[60vw] md:w-[48vw] lg:w-[36vw] border-l border-[#4D5746] shadow-2xl sharp-edges",
            position === "left" ? "left-0" : "right-0"
          )}
          style={{ background: colors[colors.length - 1] }}
        >
          <div className="flex-1 flex flex-col justify-between">
            {/* Primary Navigation Items */}
            <nav className="my-auto py-6">
              <div className="mb-8 border-b border-[#4D5746] pb-3">
                <span className="font-mono text-[13px] uppercase tracking-widest text-[#D99C5B] font-semibold">
                  [NAVIGATION // INDEX]
                </span>
              </div>
              <ul className="flex flex-col gap-6 list-none p-0 m-0">
                {items.map((item, idx) => (
                  <li key={idx} className="overflow-hidden">
                    <a
                      href={item.link}
                      onClick={() => {
                        if (open) toggleMenu();
                      }}
                      className="group relative flex items-baseline gap-4 no-underline"
                      aria-label={item.ariaLabel}
                    >
                      {displayItemNumbering && (
                        <span className="text-sm font-mono text-[#D99C5B] translate-y-[-0.3rem] font-medium select-none">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                      )}
                      <span className="sm-panel-itemLabel inline-block font-sans font-black text-4xl sm:text-5xl text-[#E8E3D9] uppercase tracking-[-0.03em] transition-colors group-hover:text-[#D99C5B]">
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Links & Legal Bottom Section */}
            {displaySocials && socialItems.length > 0 && (
              <div className="mt-auto pt-8 border-t border-[#4D5746]">
                <h3 className="sm-socials-title font-mono text-[12px] uppercase tracking-widest text-[#D99C5B] font-semibold mb-4">
                  [INDEX // SOCIAL]
                </h3>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none p-0 m-0">
                  {socialItems.map((social, i) => (
                    <li key={i}>
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link font-sans text-[15px] font-medium text-[#E8E3D9] no-underline hover:text-[#D99C5B] transition-colors py-1 inline-block"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Micro Atelier Tag */}
                <div className="mt-8 pt-4 border-t border-[#4D5746]/60 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-[#E8E3D9]/60 gap-1 tracking-wider">
                  <span>SPATIAL ATELIER & ROASTERY</span>
                  <span>© 2026 KONTRAKAN COFFEE</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StaggeredMenu;
