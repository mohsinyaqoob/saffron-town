"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";

const SLIDES = [
  {
    src: "/images/gifting-packing.png",
    alt: "Saffron Town Mongra Saffron in a hand-carved wooden gift box lined with gold satin",
    step: "01",
    label: "The Gift",
    title: "Crafted to Impress",
    caption:
      "Grade A++ Mongra kesar, nestled in a hand-carved wooden box lined with gold satin. Every detail designed to delight — from Kashmir's saffron fields to your loved one's hands.",
  },
  {
    src: "/images/gifting-delivery.png",
    alt: "Saffron Town gift being delivered to a smiling recipient at her doorstep",
    step: "02",
    label: "The Delivery",
    title: "Right to Their Doorstep",
    caption:
      "Gift-wrapped and dispatched with care. Free delivery on every gift order across India — arriving exactly when it matters most.",
  },
  {
    src: "/images/gifting-unbox.png",
    alt: "A woman in traditional dress opening her Saffron Town wooden gift box with joy",
    step: "03",
    label: "The Moment",
    title: "Pure Joy, Unwrapped",
    caption:
      "The moment they open the box and discover pure Kashmiri Mongra kesar inside. A gift they'll remember — and reach for every single day.",
  },
] as const;

const ADVANCE_MS = 4800;

export function GiftingStorySection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function goTo(index: number) {
    setActive(index);
    setPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, active]);

  const slide = SLIDES[active];

  return (
    <section
      className="flex flex-col bg-dark"
      aria-label="The gifting experience — Saffron Town"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Full-width image ── larger on mobile, cinematic on desktop */}
      <div className="relative w-full overflow-hidden story-img-wrap">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={i !== active}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              quality={IMAGE_QUALITY_PHOTO}
              className="object-cover object-center"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Step badge pinned bottom-left */}
        <div className="absolute bottom-4 left-5 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3.5 py-1.5 backdrop-blur-sm">
          <span className="font-display text-xs font-bold text-primary">
            {slide.step}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
            {slide.label}
          </span>
        </div>
      </div>

      {/* ── Caption panel — full width, two-col on desktop ── */}
      <div className="px-5 py-8 sm:px-10 sm:py-10 lg:px-20 lg:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          {/* Text block */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
              {slide.step} / 03 · {slide.label}
            </p>
            <h2
              key={`title-${active}`}
              className="mt-2 font-display text-2xl font-bold leading-tight text-dark-text sm:text-3xl lg:text-4xl"
              style={{ animation: "fadeSlideUp 0.45s ease both" }}
            >
              {slide.title}
            </h2>
            <p
              key={`caption-${active}`}
              className="mt-3 max-w-xl font-body text-sm leading-relaxed text-dark-text-muted sm:text-base"
              style={{ animation: "fadeSlideUp 0.45s 0.06s ease both" }}
            >
              {slide.caption}
            </p>
          </div>

          {/* Nav + CTAs */}
          <div className="flex flex-col gap-4 lg:items-end lg:shrink-0">
            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`View ${s.label}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-dark-text/25 hover:bg-dark-text/45"
                  }`}
                />
              ))}
              <span className="ml-2 font-body text-[11px] text-dark-text/40">
                {active + 1} / {SLIDES.length}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#gift-picker"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Choose a Gift Size
              </Link>
              <Link
                href="/shop/saffron"
                className="inline-flex items-center justify-center rounded-2xl border border-dark-text/20 px-7 py-3.5 text-sm font-bold text-dark-text-muted transition-all hover:border-dark-text/40 hover:text-dark-text"
              >
                Shop all sizes
              </Link>
            </div>

            <p className="font-body text-[11px] text-dark-text/30 lg:text-right">
              20g · 30g · 50g · Free delivery · Money-back guarantee
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .story-img-wrap { height: 62vh; min-height: 280px; }
        @media (min-width: 640px) { .story-img-wrap { height: 60vh; } }
        @media (min-width: 1024px) { .story-img-wrap { height: 68vh; } }
      `}</style>
    </section>
  );
}
