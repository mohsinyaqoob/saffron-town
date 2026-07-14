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
      className="flex flex-col bg-dark lg:min-h-dvh lg:flex-row"
      aria-label="The gifting experience — Saffron Town"
    >
      {/* ── Image panel ── */}
      <div
        className="relative w-full overflow-hidden lg:w-[58%] lg:flex-shrink-0"
        style={{ minHeight: "min(58vw, 62vh)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
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
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Mobile step badge pinned bottom-left */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 backdrop-blur-sm lg:hidden">
          <span className="font-display text-xs font-bold text-primary">
            {slide.step}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
            {slide.label}
          </span>
        </div>
      </div>

      {/* ── Caption panel ── */}
      <div className="flex flex-1 flex-col justify-start gap-5 px-7 py-10 sm:px-10 lg:justify-center lg:gap-0 lg:px-14 lg:py-20">
          {/* Step — desktop only */}
          <div className="hidden lg:flex items-baseline gap-3 mb-1">
            <span className="font-display text-5xl font-bold leading-none text-primary/20">
              {slide.step}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-dark-text-muted">
              / 03 · {slide.label}
            </span>
          </div>

          {/* Title */}
          <h2
            key={`title-${active}`}
            className="font-display text-3xl font-bold leading-tight text-dark-text sm:text-4xl lg:mt-4 lg:text-[2.6rem]"
            style={{ animation: "fadeSlideUp 0.5s ease both" }}
          >
            {slide.title}
          </h2>

          {/* Caption */}
          <p
            key={`caption-${active}`}
            className="max-w-sm font-body text-base leading-relaxed text-dark-text-muted sm:text-lg lg:mt-4"
            style={{ animation: "fadeSlideUp 0.5s 0.07s ease both" }}
          >
            {slide.caption}
          </p>

        {/* Navigation dots */}
        <div className="flex items-center gap-2.5 lg:mt-10">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View ${s.label}`}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === active
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-dark-text/25 hover:bg-dark-text/45"
              }`}
            />
          ))}
          <span className="ml-2 font-body text-[11px] text-dark-text-muted/60">
            {active + 1} / {SLIDES.length}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row lg:mt-10">
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

        {/* Fine print */}
        <p className="font-body text-[11px] text-dark-text/30 lg:mt-6">
          20g · 30g · 50g · Free delivery · Money-back guarantee
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
