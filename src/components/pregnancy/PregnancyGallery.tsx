"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { GalleryImage } from "@/lib/pregnancy-landing";

interface PregnancyGalleryProps {
  images: GalleryImage[];
}

/** Pixels per second the rail drifts on its own. Slow enough to read as ambient. */
const DRIFT_PX_PER_SECOND = 22;

/** How long after a manual swipe before the drift picks back up. */
const RESUME_DELAY_MS = 2500;

/**
 * Horizontal auto-scrolling lifestyle grid.
 *
 * Two lanes on tablet and up, one on phones, drifting continuously to the left
 * while staying a plain `overflow-x-auto` element underneath — so a thumb can
 * still grab it and flick it, with native momentum. The drift is the only part
 * that needs JS; if it never runs (no hydration, JS off, reduced motion) what is
 * left is the same swipeable rail, just sitting still.
 *
 * ── How the loop works, and why the copy count is measured ──
 * The track repeats the images end to end. Once the scroll position passes one
 * repeat's width we subtract that width, which is visually identical because
 * every copy is the same, so the loop never shows a seam.
 *
 * That trick only works if the scroller can actually *reach* the wrap point:
 * `scrollLeft` maxes out at `scrollWidth - clientWidth`, so a single repeat has
 * to be narrower than everything to its right. Two copies is enough on a phone
 * and not enough on a desktop, where one repeat is narrower than the viewport
 * and the rail would simply slide to the right wall and stop. So the count is
 * measured after mount and on resize rather than guessed.
 *
 * Images are lazy except the first, which is likely to be in view on arrival.
 * Renders nothing at all when the photography has not landed yet, rather than
 * shipping an empty scroller (see getGalleryImages).
 */
export function PregnancyGallery({ images }: PregnancyGalleryProps) {
  const railRef = useRef<HTMLDivElement>(null);
  /** Width of one repeat, including the gap that follows it. 0 until measured. */
  const cycleRef = useRef(0);
  /** Timestamp until which the drift stays parked after a manual interaction. */
  const pausedUntilRef = useRef(0);
  const [copies, setCopies] = useState(2);

  const pause = useCallback((ms: number = RESUME_DELAY_MS) => {
    pausedUntilRef.current = Math.max(
      pausedUntilRef.current,
      performance.now() + ms,
    );
  }, []);

  // Measure before paint so the extra copies are in place by the time the
  // drift's first frame runs.
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const lane = rail.firstElementChild as HTMLElement | null;
      if (!lane) return;
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      const cycle = lane.getBoundingClientRect().width + gap;
      cycleRef.current = cycle;
      if (cycle <= 0) return;
      // One repeat has to fit inside the scrollable overhang, so add a repeat
      // for the viewport plus one spare to wrap into.
      setCopies(Math.max(2, Math.ceil(rail.clientWidth / cycle) + 1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    // No deps: the observer stays attached for the life of the rail and
    // re-measures on any size change, including a different image count.
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;
    let last = performance.now();
    /** Sub-pixel remainder: scrollLeft rounds, so slow drift would stall without it. */
    let carry = 0;

    const step = (now: number) => {
      const elapsed = now - last;
      last = now;

      const cycle = cycleRef.current;
      if (cycle > 0) {
        if (now >= pausedUntilRef.current) {
          carry += (DRIFT_PX_PER_SECOND * elapsed) / 1000;
          const whole = Math.trunc(carry);
          if (whole !== 0) {
            carry -= whole;
            rail.scrollLeft += whole;
          }
        }
        // Keep the position inside the first repeat, in both directions — a
        // hard flick backwards should wrap too, not hit the left wall.
        if (rail.scrollLeft >= cycle) rail.scrollLeft -= cycle;
        else if (rail.scrollLeft < 0) rail.scrollLeft += cycle;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    // A backgrounded tab wakes up with a huge `elapsed`; reset the clock instead
    // of jumping the rail forward by however long the user was away.
    const onVisibility = () => {
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (images.length === 0) return null;

  /**
   * The unit that repeats. Two lanes fill column by column, so an odd number of
   * images leaves the bottom of the last column empty — and because the unit
   * repeats, that hole repeats down the whole rail. Doubling an odd set makes
   * the unit a whole number of columns, which fills every slot. Entries past
   * the first pass are decorative; only the first pass carries alt text.
   */
  const unit =
    images.length % 2 === 0
      ? images
      : ([...images, ...images] as GalleryImage[]);

  return (
    <section
      className="py-12 sm:py-16"
      aria-labelledby="pregnancy-gallery-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <h2
          id="pregnancy-gallery-heading"
          className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl"
        >
          A glass of kesar milk, the way it is made at home
        </h2>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-secondary font-body sm:text-base">
          A few threads, warm milk, and someone who wants you to have the good
          stuff. Swipe to see how families use it.
        </p>
      </div>

      {/* Full-bleed rail. The fade at either edge is what tells a first-time
          visitor the row continues past the viewport, now that the drift is
          doing the same job in motion. */}
      <div
        className="relative mt-6 sm:mt-8"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 3.5rem, #000 calc(100% - 3.5rem), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 3.5rem, #000 calc(100% - 3.5rem), transparent)",
        }}
      >
        <div
          ref={railRef}
          // Deliberately no scroll-snap: snap points and a continuous drift
          // fight each other — the browser re-snaps mid-animation and the rail
          // stutters, and it breaks the wrap-around jump outright.
          className="flex gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 sm:gap-5 sm:px-8 lg:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          // Any sign of a human — a hover, a thumb, a keyboard focus, a wheel —
          // parks the drift so it never fights the person using it.
          onPointerEnter={() => pause()}
          onPointerDown={() => pause()}
          onPointerMove={() => pause()}
          onTouchStart={() => pause()}
          onTouchMove={() => pause()}
          onWheel={() => pause()}
          onFocusCapture={() => pause(15000)}
        >
          {Array.from({ length: copies }, (_, copy) => (
            <div
              key={copy}
              // Only the first repeat is real content; the rest are scenery for
              // the wrap-around and would otherwise read as duplicates.
              aria-hidden={copy > 0 || undefined}
              className="grid grid-flow-col grid-rows-1 gap-4 sm:grid-rows-2 sm:gap-5"
            >
              {unit.map((img, i) => (
                <figure
                  // `unit` can hold the same image twice, so the src alone is
                  // not a stable key.
                  key={`${i}-${img.src}`}
                  // Smaller cards once there are two lanes, so the whole grid
                  // stays under a screen's height rather than swallowing it.
                  className="relative w-[72vw] shrink-0 overflow-hidden rounded-2xl bg-surface-muted sm:w-[26vw] lg:w-[14rem]"
                >
                  <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
                    <Image
                      src={img.src}
                      alt={copy === 0 && i < images.length ? img.alt : ""}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 26vw, 14rem"
                      loading={copy === 0 && i === 0 ? "eager" : "lazy"}
                      priority={copy === 0 && i === 0}
                      className="object-cover"
                    />
                  </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
