"use client";

import React, { useEffect } from "react";

interface SplitWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  staggerMs?: number;
  baseDelayMs?: number;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}

/**
  * Splits a string into per-word inline-block spans rising on a smooth incremental delay.
  * Revealed when the parent or element enters the viewport via IntersectionObserver (threshold 0.12).
  */
export function SplitWords({
  text,
  className = "",
  wordClassName = "",
  staggerMs = 28,
  baseDelayMs = 0,
  as: Tag = "span",
}: SplitWordsProps) {
  const words = text.trim().split(/\s+/);

  return (
    <Tag data-words className={`inline ${className}`}>
      {words.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span className="word-wrap">
            <span
              className={`word-span ${wordClassName}`}
              style={
                {
                  "--wd": `${baseDelayMs + idx * staggerMs}ms`,
                } as React.CSSProperties
              }
            >
              {word}
            </span>
          </span>
          {idx < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/**
  * Frame-rate-independent velvety lerp + rAF scroll choreography handler
  * + single IntersectionObserver (threshold 0.12).
  */
export function useEditorialChoreography() {
  useEffect(() => {
    let rafId: number | null = null;
    let lastTime = performance.now();

    interface StageState {
      current: number;
      target: number;
      initialized: boolean;
    }

    const stageMap = new Map<HTMLElement, StageState>();

    const measureTargets = (immediate = false) => {
      const stages = document.querySelectorAll<HTMLElement>("[data-scroll-stage]");
      const vh = window.innerHeight || 1;

      stages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        const scrollable = Math.max(1, rect.height - vh);
        const scrolled = -rect.top;
        const rawP = Math.min(1, Math.max(0, scrolled / scrollable));

        let state = stageMap.get(stage);
        if (!state) {
          state = { current: rawP, target: rawP, initialized: false };
          stageMap.set(stage, state);
        }

        state.target = rawP;
        if (immediate || !state.initialized) {
          state.current = rawP;
          state.initialized = true;
          applyStageProgress(stage, rawP);
        }
      });
    };

    const applyStageProgress = (stage: HTMLElement, p: number) => {
      // Smootherstep / Smoothstep easing curve for silky organic acceleration & deceleration
      const smoothP = p * p * (3 - 2 * p);
      // Soft eased fade curve for Hero typography (gradually fades from p=0 to p=0.82 without harsh clamp)
      const heroT = Math.min(1, Math.max(0, p / 0.82));
      const heroFade = 1 - heroT * heroT * (3 - 2 * heroT);

      stage.style.setProperty("--p", p.toFixed(5));
      stage.style.setProperty("--p-smooth", smoothP.toFixed(5));
      stage.style.setProperty("--p-hero-opacity", heroFade.toFixed(5));

      const progressFill = stage.querySelector<HTMLElement>("[data-stage-progress]");
      if (progressFill) {
        progressFill.style.transform = `scaleX(${smoothP.toFixed(5)})`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Refresh targets from live layout in case momentum scroll is active
      measureTargets(false);

      // Velvety frame-rate independent damping factor (~60-120fps fluid glide)
      const damping = 1 - Math.exp(-6.8 * dt);
      let stillAnimating = false;

      stageMap.forEach((state, stage) => {
        const diff = state.target - state.current;
        if (Math.abs(diff) > 0.00006) {
          state.current += diff * damping;
          stillAnimating = true;
        } else {
          state.current = state.target;
        }
        applyStageProgress(stage, state.current);
      });

      if (stillAnimating) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Initial synchronous measurement
    measureTargets(true);

    window.addEventListener("scroll", startLoop, { passive: true });
    window.addEventListener("resize", startLoop, { passive: true });

    // Single IntersectionObserver at threshold 0.12 for [data-rev] and [data-words]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );

    const observeTargets = (fromMutation = false) => {
      const vh = window.innerHeight || 1;
      const revEls = document.querySelectorAll<HTMLElement>(
        "[data-rev]:not(.is-revealed), [data-words]:not(.is-revealed)"
      );
      revEls.forEach((el) => {
        if (fromMutation) {
          const rect = el.getBoundingClientRect();
          if (rect.top < vh * 0.95 && rect.bottom > 0) {
            window.requestAnimationFrame(() => {
              el.classList.add("is-revealed");
            });
            return;
          }
        }
        io.observe(el);
      });
    };

    observeTargets(false);

    // MutationObserver in case menu or gallery filter changes add new [data-rev] rows
    const mo = new MutationObserver(() => {
      observeTargets(true);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", startLoop);
      window.removeEventListener("resize", startLoop);
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
