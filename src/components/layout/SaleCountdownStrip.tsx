"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SaleCountdownStripProps {
  /** ISO instant the sale closes. Server-provided via getFreedomSaleEndsAt(). */
  endsAt: string;
  /** Checkout URL carrying the pre-applied coupon. */
  claimHref: string;
}

/**
 * Indian tricolour, drawn inline.
 *
 * Deliberately an SVG rather than the 🇮🇳 emoji: flag emoji do not render at all
 * on Windows (which shows "IN" letters instead) and vary in shape across
 * platforms, so an emoji would look broken for a meaningful slice of traffic on
 * a bar that is meant to read as deliberate.
 */
function IndiaFlag() {
  return (
    <svg
      viewBox="0 0 36 24"
      className="h-4 w-6 shrink-0 rounded-[2px] shadow-sm ring-1 ring-black/20 sm:h-[18px] sm:w-7"
      role="img"
      aria-label="India"
    >
      <rect width="36" height="8" fill="#FF9933" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#138808" />
      {/* Ashoka Chakra — 24 spokes, as on the flag */}
      <g stroke="#000080" strokeWidth="0.5">
        <circle cx="18" cy="12" r="3.1" fill="none" strokeWidth="0.7" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI) / 12;
          return (
            <line
              key={i}
              x1={18 + Math.cos(a) * 0.7}
              y1={12 + Math.sin(a) * 0.7}
              x2={18 + Math.cos(a) * 3.1}
              y2={12 + Math.sin(a) * 3.1}
            />
          );
        })}
        <circle cx="18" cy="12" r="0.6" fill="#000080" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Site-wide Freedom Sale strip, pinned above the header on every page.
 *
 * `fixed`, not `sticky`: html/body carry `overflow-x: hidden`, which makes them
 * a scroll container and stops `position: sticky` pinning anywhere on this site.
 * `body` carries a matching `padding-top: var(--promo-h)` so nothing hides
 * underneath — see globals.css. Keep the height here and that variable in sync.
 *
 * The deadline is real and server-supplied; the same instant is enforced when
 * the coupon is redeemed, so the clock cannot promise what checkout refuses. At
 * zero the strip removes itself rather than sitting at 00:00:00.
 */
export function SaleCountdownStrip({
  endsAt,
  claimHref,
}: SaleCountdownStripProps) {
  // `null` until the first client tick so the server HTML and the first client
  // render agree — the remaining time necessarily differs between them.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(endsAt).getTime();
    if (!Number.isFinite(target)) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  if (remaining === 0) return null;

  const s = remaining == null ? null : Math.floor(remaining / 1000);
  const days = s == null ? null : Math.floor(s / 86400);
  const hours = s == null ? null : Math.floor((s % 86400) / 3600);
  const mins = s == null ? null : Math.floor((s % 3600) / 60);
  const secs = s == null ? null : s % 60;
  const pad = (n: number | null) =>
    n == null ? "--" : String(n).padStart(2, "0");

  const units = [
    { v: days, l: "d" },
    { v: hours, l: "h" },
    { v: mins, l: "m" },
    { v: secs, l: "s" },
  ];

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] w-full overflow-x-clip"
      data-promo-strip
    >
      {/* Tricolour hairline — carries the Independence Day cue without turning
          the whole bar into flag colours, which would fight the brand palette
          and make the CTA harder to pick out. */}
      <div
        aria-hidden
        className="h-[3px] w-full bg-[linear-gradient(90deg,#FF9933_0%,#FF9933_33.3%,#FFFFFF_33.3%,#FFFFFF_66.6%,#138808_66.6%,#138808_100%)]"
      />

      <div className="bg-[linear-gradient(100deg,#5c1112_0%,#7f1d1e_45%,#9a2425_100%)]">
        <div className="mx-auto flex h-11 max-w-7xl items-center gap-2 px-3 sm:h-12 sm:gap-4 sm:px-6 lg:px-20">
          {/* Offer */}
          <p className="flex min-w-0 shrink items-center gap-2">
            <IndiaFlag />
            <span className="text-[11px] font-extrabold uppercase leading-none tracking-[0.08em] text-[#f5c86a] sm:text-[13px]">
              Freedom Sale
            </span>
            <span
              aria-hidden
              className="hidden h-3 w-px bg-white/25 min-[430px]:block"
            />
            <span className="hidden whitespace-nowrap text-[11px] font-bold text-white min-[430px]:inline sm:text-sm">
              Flat 25% OFF
            </span>
          </p>

          {/* Countdown — sans-serif, tabular figures so the digits do not
              jitter as the seconds tick over. */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-white/55 lg:inline">
              Ends in
            </span>
            <span
              role="timer"
              // `timer` defaults to aria-live="off", so this is read on demand
              // instead of being announced every second.
              aria-live="off"
              aria-label={
                s == null
                  ? "Loading time remaining"
                  : `Offer ends in ${days} days, ${hours} hours, ${mins} minutes`
              }
              className="flex items-center gap-1 font-body tabular-nums"
            >
              {units.map((u) => (
                <span
                  key={u.l}
                  aria-hidden
                  className="flex items-baseline rounded-md bg-black/35 px-1.5 py-1 leading-none ring-1 ring-inset ring-white/10"
                >
                  <span className="text-[12px] font-bold text-white sm:text-[13px]">
                    {pad(u.v)}
                  </span>
                  <span className="ml-px text-[9px] font-semibold text-white/50">
                    {u.l}
                  </span>
                </span>
              ))}
            </span>
          </div>

          <Link
            href={claimHref}
            className="shrink-0 rounded-full bg-[#f5c86a] px-3 py-1.5 text-[11px] font-extrabold text-[#5c1112] shadow-sm transition-colors hover:bg-[#e8b94f] active:scale-[0.98] sm:px-4 sm:py-2 sm:text-xs"
          >
            Claim<span className="hidden sm:inline"> offer</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
