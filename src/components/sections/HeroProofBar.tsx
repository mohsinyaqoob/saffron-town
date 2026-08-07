import Link from "next/link";

/**
 * The hero's single proof widget.
 *
 * Replaces the two stacked panels this hero used to carry (a cream service bar
 * and a purple stats band). Between those two and the icon row above them, the
 * hero stated "Fresh Harvest" four times, "GI Tagged" three times and "Money
 * Back" three times — the noise, not the styling, is what made the section read
 * as unfinished. Each claim now appears exactly once, in one card.
 *
 * The rating leads because it is the strongest single trust signal on a page
 * asking a stranger for ₹1,299, and it links out so the claim can be checked.
 */

interface HeroProofBarProps {
  reviewCount: number;
  rating: number;
  /** Derived harvest label, e.g. "Autumn 2025". */
  harvestLabel: string;
}

const ICON = {
  hand: "M9 11V5.5a1.5 1.5 0 013 0V11m0-1.5a1.5 1.5 0 013 0V13m0-2a1.5 1.5 0 013 0v4a6 6 0 01-6 6h-1.5a6 6 0 01-5.2-3l-2.1-3.6a1.5 1.5 0 012.5-1.6L9 15",
  farm: "M12 13V8.5M12 8.5C12 6.3 10.2 4.5 8 4.5c0 2.2 1.8 4 4 4zM12 10.5c0-2.2 1.8-4 4-4 0 2.2-1.8 4-4 4zM3.5 14.5l3.6 4.2a3 3 0 002.3 1.05h5.2a3 3 0 002.3-1.05l3.6-4.2",
  sprout:
    "M12 22V10M12 10C12 6 9 3 5 3c0 4 3 7 7 7zM12 13c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6z",
  truck:
    "M1 4h13v12H1zM14 8h3.5l3.5 4v4h-7zM5.5 20a2 2 0 100-4 2 2 0 000 4zM17.5 20a2 2 0 100-4 2 2 0 000 4z",
} as const;

function ProofIcon({ path }: { path: string }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e8c07a]/12 text-[#e8c07a] ring-1 ring-inset ring-[#e8c07a]/20 sm:h-9 sm:w-9"
      aria-hidden
    >
      <svg
        className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </span>
  );
}

export function HeroProofBar({
  reviewCount,
  rating,
  harvestLabel,
}: HeroProofBarProps) {
  // GI is deliberately absent — the eyebrow pill above the headline already
  // carries it, and repeating it here is what made the old hero read as noise.
  const cells = [
    { icon: ICON.farm, value: "Farm Direct", label: "No middlemen" },
    { icon: ICON.hand, value: "Hand Sorted", label: "Red stigma tips only" },
    { icon: ICON.sprout, value: harvestLabel, label: "Current harvest" },
    { icon: ICON.truck, value: "Free Delivery", label: "Above ₹499" },
  ];

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="grid grid-cols-2 divide-white/10 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
        {/* Rating — the lead cell, visually weighted above the rest */}
        {reviewCount > 0 && (
          <Link
            href="/reviews"
            className="group col-span-2 flex items-center gap-3 border-b border-white/10 px-5 py-4 transition-colors hover:bg-white/[0.05] sm:col-span-3 lg:col-span-1 lg:border-b-0"
          >
            <span className="font-display text-2xl font-bold leading-none text-[#e8c07a]">
              {rating.toFixed(1)}
            </span>
            <span className="min-w-0">
              <span
                className="flex gap-0.5"
                role="img"
                aria-label={`Rated ${rating} out of 5`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className="h-3 w-3 fill-[#e8c07a]"
                    viewBox="0 0 20 20"
                    aria-hidden
                  >
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                ))}
              </span>
              <span className="mt-1 block text-[11px] leading-tight text-white/60 font-body group-hover:text-white/85 group-hover:underline">
                {reviewCount} verified reviews
              </span>
            </span>
          </Link>
        )}

        {cells.map((cell, i) => (
          <div
            key={cell.value}
            className={`flex items-center gap-2.5 px-3.5 py-3.5 sm:gap-3 sm:px-5 sm:py-4 ${
              // Hairlines between rows on the 2-up mobile grid, without a
              // trailing rule under the final row.
              i < cells.length - 2
                ? "border-b border-white/10 lg:border-b-0"
                : ""
            } ${i % 2 === 1 ? "border-l border-white/10 lg:border-l-0" : ""}`}
          >
            <ProofIcon path={cell.icon} />
            {/* No `truncate` here: at 375px the 2-up grid clipped every label
                to "Hand Sort…" / "Free Deliv…". Wrapping to a second line costs
                a few pixels and keeps the claim readable, which is the whole
                point of the widget. */}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight text-white sm:text-sm">
                {cell.value}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-white/55 font-body">
                {cell.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
