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
 * Splits a string into per-word inline-block spans rising on a 38ms incremental delay.
 * Revealed when the parent or element enters the viewport via IntersectionObserver (threshold 0.12).
 */
export function SplitWords({
  text,
  className = "",
  wordClassName = "",
  staggerMs = 38,
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
 * Single rAF-throttled scroll handler + single IntersectionObserver (threshold 0.12)
 * as specified in the Didone Editorial choreography prompt.
 */
export function useEditorialChoreography() {
  useEffect(() => {
    let rafId: number | null = null;

    const updateStages = () => {
      rafId = null;
      const stages = document.querySelectorAll<HTMLElement>("[data-scroll-stage]");
      const vh = window.innerHeight || 1;

      stages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        const scrollable = Math.max(1, rect.height - vh);
        const scrolled = -rect.top;
        const p = Math.min(1, Math.max(0, scrolled / scrollable));
        stage.style.setProperty("--p", p.toFixed(4));

        // Optional progress bar or numeric readouts inside the stage
        const progressFill = stage.querySelector<HTMLElement>("[data-stage-progress]");
        if (progressFill) {
          progressFill.style.transform = `scaleX(${p.toFixed(4)})`;
        }
      });
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateStages);
      }
    };

    updateStages();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

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

    const observeTargets = () => {
      const revEls = document.querySelectorAll<HTMLElement>(
        "[data-rev]:not(.is-revealed), [data-words]:not(.is-revealed)"
      );
      revEls.forEach((el) => io.observe(el));
    };

    observeTargets();

    // MutationObserver in case menu filter changes add new [data-rev] rows
    const mo = new MutationObserver(() => {
      observeTargets();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

