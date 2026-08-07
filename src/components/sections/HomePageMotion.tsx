"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal for homepage sections.
 *
 * Deliberately NOT a JS-driven tween of opacity.
 *
 * The previous GSAP implementation animated `[data-home-hero]` from
 * `autoAlpha: 0`, which meant the hero headline, both CTAs and every trust line
 * were invisible until a JS tween completed. In production that tween stalled
 * partway and left the hero permanently frozen at ~31% opacity — the entire
 * above-the-fold pitch was unreadable for every visitor. Above-the-fold content
 * must never depend on JS having run correctly.
 *
 * The rule here: content is visible in the HTML/CSS baseline. JS may only
 * *temporarily* hide a below-the-fold section to reveal it on scroll, and it
 * only does so once it is certain it can also reveal it (observer supported,
 * motion allowed). If JS fails, is blocked, or never boots, the page still
 * reads completely.
 */
export function HomePageMotion() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-fade-up]"),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    // Arm the hidden state only now that the observer exists, so a section can
    // never be left hidden by a half-initialised script.
    for (const section of sections) {
      section.classList.add("will-reveal");
      observer.observe(section);
    }

    // Safety net: if anything prevents the observer from firing (bfcache
    // restore, layout thrash), reveal everything rather than hide content.
    const failsafe = window.setTimeout(() => {
      for (const section of sections) section.classList.add("is-revealed");
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      for (const section of sections) {
        section.classList.remove("will-reveal");
      }
    };
  }, []);

  return null;
}
