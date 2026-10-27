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
  /** Whether the header shrinks on scroll past threshold */
  shrinkOnScroll?: boolean;
  /** Scroll distance threshold in pixels to trigger shrinking header */
  scrollThreshold?: number;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = "right",
  // Kontrakan Coffee 3-layer architecture: Deep Espresso -> Latte Taupe shimmer -> Roasted Mocha surface
  colors = ["#472F1D", "#C7B8AE", "#5F493C"],
  items = [
    { label: "Works", ariaLabel: "View selected architectural coffee works", link: "#works" },
    { label: "Manifesto", ariaLabel: "Read our spatial coffee manifesto", link: "#manifesto" },
    { label: "Contact", ariaLabel: "Contact our coffee atelier", link: "#contact" },
  ],
  socialItems = [
    { label: "Instagram", link: "https://www.instagram.com/kontrakan.coffee?dlrf=aHpsbXB6ajE4dmQ3" },
    { label: "Twitter / X", link: "https://x.com" },
    { label: "Behance", link: "https://behance.net" },
    { label: "Are.na", link: "https://are.na" },
  ],
  displaySocials = true,
  className,
  logo,
  desktopNav,
  menuButtonColor = "#EEE6D7",
  openMenuButtonColor = "#C7B8AE",
  changeMenuColorOnOpen = true,
  accentColor = "#C7B8AE",
  isFixed = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  shrinkOnScroll = true,
  scrollThreshold = 80,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      if (!panel) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(
          preContainer.querySelectorAll(".sm-prelayer")
        ) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, force3D: true });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  // Strict Scroll Lock: When sidebar is open, ONLY the sidebar can scroll; outside page cannot scroll at all
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    if (open) {
      htmlEl.style.overflow = "hidden";
      bodyEl.style.overflow = "hidden";
    } else {
      htmlEl.style.overflow = "";
      bodyEl.style.overflow = "";
    }

    const preventOutsideScroll = (e: TouchEvent | WheelEvent) => {
      if (!openRef.current) return;
      const panel = panelRef.current;
      if (panel && panel.contains(e.target as Node)) {
        return; // Allow scrolling inside the sidebar panel
      }
      e.preventDefault();
    };

    if (open) {
      window.addEventListener("wheel", preventOutsideScroll, { passive: false });
      window.addEventListener("touchmove", preventOutsideScroll, { passive: false });
    }

    return () => {
      htmlEl.style.overflow = "";
      bodyEl.style.overflow = "";
      window.removeEventListener("wheel", preventOutsideScroll);
      window.removeEventListener("touchmove", preventOutsideScroll);
    };
  }, [open]);

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

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 8, force3D: true });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0, force3D: true });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.55, ease: "power4.out", force3D: true },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.7;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out", force3D: true },
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
          force3D: true,
          stagger: { each: 0.09, from: "start" },
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
            force3D: true,
            stagger: { each: 0.08, from: "start" },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
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
      duration: 0.48,
      ease: "power3.inOut",
      force3D: true,
      stagger: {
        each: 0.045,
        from: "end",
      },
      overwrite: "auto",
      onComplete: () => {
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();

      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

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

    animateColor(target);
  }, [playOpen, playClose, animateColor, onMenuOpen, onMenuClose]);

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

  // Shrinking Sticky Header scroll listener with hysteresis
  useEffect(() => {
    if (!shrinkOnScroll) return;
    let rafId: number | null = null;
    const upperThreshold = scrollThreshold;
    const lowerThreshold = Math.max(20, scrollThreshold - 36);

    const checkScroll = () => {
      rafId = null;
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > upperThreshold) return true;
        if (prev && y < lowerThreshold) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(checkScroll);
      }
    };

    checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [shrinkOnScroll, scrollThreshold]);

  return (
    <div
      className={cn(
        "sm-scope select-none font-sans",
        isFixed ? "fixed inset-0 z-50 pointer-events-none" : "relative w-full h-full min-h-[600px]",
        className
      )}
    >
      {/* Dimmed backdrop when panel is open — blocks outside clicks & scroll */}
      <div
        ref={backdropRef}
        onClick={open ? toggleMenu : undefined}
        className={cn(
          "fixed inset-0 bg-[#472F1D]/50 backdrop-blur-[2px] transition-opacity duration-500 z-[15] touch-none",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      <div
        className="staggered-menu-wrapper w-full h-full pointer-events-none"
        style={{ "--sm-accent": accentColor } as React.CSSProperties}
        data-position={position}
      >
        {/* Layer Backgrounds (Pre-layers) — Restored Full-Screen Mobile Width w-[100vw] */}
        <div
          ref={preLayersRef}
          className={cn(
            "sm-prelayers absolute top-0 bottom-0 pointer-events-none z-[20] w-[100vw] sm:w-[60vw] md:w-[48vw] lg:w-[36vw] will-change-transform",
            position === "left" ? "left-0" : "right-0"
          )}
        >
          {colors.slice(0, -1).map((c, i) => (
            <div
              key={i}
              className="sm-prelayer absolute inset-0 shadow-2xl will-change-transform"
              style={{ background: c }}
              suppressHydrationWarning
            />
          ))}
        </div>

        {/* Global Navigation Bar / Shrinking Sticky Header */}
        <header
          className={cn(
            "fixed top-0 left-0 w-full z-[30] px-6 transition-[padding,height,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto flex items-center",
            "bg-[#5F493C]/90 backdrop-blur-md border-b border-[#472F1D]",
            (shrinkOnScroll && isScrolled) || open
              ? "h-16 py-3 shadow-md shadow-black/15"
              : "h-20 py-5 shadow-none"
          )}
        >
          <nav className="max-w-7xl mx-auto w-full flex items-center justify-between text-[#EEE6D7]">
            {/* Logo / Brand Wordmark */}
            <div className="flex items-center">
              {logo || (
                <a
                  href="#"
                  className="text-[18px] font-bold tracking-tight uppercase hover:text-[#C7B8AE] transition-colors font-sans text-[#EEE6D7]"
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

            {/* 3-Line Hamburger Toggle Button with Rounded Square (Retained as requested) */}
            <button
              ref={toggleBtnRef}
              onClick={toggleMenu}
              className={cn(
                "sm-toggle relative w-11 h-11 rounded-xl flex items-center justify-center",
                "bg-[#472F1D]/75 border border-[#C7B8AE]/45 hover:border-[#C7B8AE] hover:bg-[#472F1D]",
                "text-[#EEE6D7] hover:text-[#C7B8AE] shadow-sm",
                "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none cursor-pointer group",
                open && "bg-[#472F1D] border-[#C7B8AE] text-[#C7B8AE]"
              )}
              aria-expanded={open}
              aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              <div className="relative w-5 h-3.5 flex flex-col justify-between items-center">
                <span
                  className={cn(
                    "block w-5 h-[2px] rounded-full bg-current transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center",
                    open ? "translate-y-[6px] rotate-45" : "translate-y-0 rotate-0"
                  )}
                />
                <span
                  className={cn(
                    "block w-5 h-[2px] rounded-full bg-current transform-gpu transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center",
                    open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  )}
                />
                <span
                  className={cn(
                    "block w-5 h-[2px] rounded-full bg-current transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center",
                    open ? "-translate-y-[6px] -rotate-45" : "translate-y-0 rotate-0"
                  )}
                />
              </div>
            </button>
          </nav>
        </header>

        {/* Staggered Menu Panel (Main Content Layer — Full-Screen Mobile w-[100vw], Left-Aligned, No Numbers, Contained Scroll) */}
        <aside
          ref={panelRef}
          className={cn(
            "staggered-menu-panel absolute top-0 bottom-0 z-[25] pointer-events-auto flex flex-col pt-28 pb-12 pl-6 pr-6 sm:pl-9 sm:pr-10 overflow-y-auto overscroll-contain w-[100vw] sm:w-[60vw] md:w-[48vw] lg:w-[36vw] border-l border-[#472F1D] shadow-2xl sharp-edges will-change-transform",
            position === "left" ? "left-0" : "right-0"
          )}
          style={{ background: colors[colors.length - 1] }}
          suppressHydrationWarning
        >
          <div className="flex-1 flex flex-col justify-between items-start text-left">
            {/* Primary Navigation Items — Shifted Left, No Section Numbers */}
            <nav className="my-auto py-6 w-full">
              <ul className="flex flex-col gap-6 list-none p-0 m-0 items-start text-left">
                {items.map((item, idx) => (
                  <li key={idx} className="overflow-hidden w-full">
                    <a
                      href={item.link}
                      onClick={() => {
                        if (open) toggleMenu();
                      }}
                      className="group relative flex items-baseline justify-start no-underline text-left"
                      aria-label={item.ariaLabel}
                    >
                      <span className="sm-panel-itemLabel inline-block font-sans font-black text-4xl sm:text-5xl text-[#EEE6D7] uppercase tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#C7B8AE]">
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Links & Legal Bottom Section */}
            {displaySocials && socialItems.length > 0 && (
              <div className="mt-auto pt-8 border-t border-[#472F1D] w-full text-left">
                <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none p-0 m-0">
                  {socialItems.map((social, i) => (
                    <li key={i}>
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link font-sans text-[15px] font-medium text-[#EEE6D7] no-underline hover:text-[#C7B8AE] transition-colors py-1 inline-block"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Micro Atelier Tag */}
                <div className="mt-8 pt-4 border-t border-[#472F1D]/60 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-[#EEE6D7]/60 gap-1 tracking-wider">
                  <span>SPATIAL ATELIER &amp; ROASTERY</span>
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
