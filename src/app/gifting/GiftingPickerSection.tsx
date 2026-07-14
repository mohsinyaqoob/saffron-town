"use client";

import Link from "next/link";
import { useState } from "react";

const GIFT_SIZES = [
  {
    id: "mongra-20g",
    grams: "20g",
    occasion: "Family Gift",
    tagline: "Close friends & family",
    price: 11299,
    mrp: 13799,
    popular: false,
  },
  {
    id: "mongra-30g",
    grams: "30g",
    occasion: "Wedding Gift",
    tagline: "Weddings, Diwali & baby showers",
    price: 16999,
    mrp: 20499,
    popular: true,
  },
  {
    id: "mongra-50g",
    grams: "50g",
    occasion: "Grand Gift",
    tagline: "VIPs, corporates & grand occasions",
    price: 26499,
    mrp: 32499,
    popular: false,
  },
] as const;

export function GiftingPickerSection() {
  const [selected, setSelected] = useState<string>("mongra-30g");
  const variant = GIFT_SIZES.find((s) => s.id === selected)!;
  const savings = variant.mrp - variant.price;
  const checkoutUrl = `/checkout?pid=mongra-saffron&vid=${selected}&qty=1`;

  return (
    <section id="gift-picker" className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-20">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Choose Your Gift
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
            Select a Gift Size
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary font-body">
            Each gift comes in our signature airtight glass jar, ready to give.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {GIFT_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setSelected(size.id)}
              className={`relative rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                selected === size.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-secondary-border/20 bg-background hover:border-primary/30"
              }`}
            >
              {size.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                  Most Popular
                </span>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary font-body">
                    {size.occasion}
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold text-text-primary">
                    {size.grams}
                  </p>
                </div>
                <div
                  className={`mt-1 h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors ${
                    selected === size.id
                      ? "border-primary bg-primary"
                      : "border-secondary-border/40"
                  }`}
                >
                  {selected === size.id && (
                    <svg
                      className="h-full w-full p-0.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-secondary font-body">
                {size.tagline}
              </p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-text-primary">
                  ₹{size.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-secondary line-through font-body">
                  ₹{size.mrp.toLocaleString("en-IN")}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm text-secondary font-body">
            <span className="font-semibold text-text-primary">
              {variant.grams} Kashmiri Mongra Saffron
            </span>
            {" · "}
            <span className="font-semibold text-primary">
              Save ₹{savings.toLocaleString("en-IN")}
            </span>
          </p>
          <Link
            href={checkoutUrl}
            className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.98]"
          >
            Gift This Now — ₹{variant.price.toLocaleString("en-IN")}
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </Link>
          <p className="text-xs text-secondary font-body">
            Free delivery · Secure checkout · Money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
