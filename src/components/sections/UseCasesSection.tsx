import Link from "next/link";

const USE_CASES = [
  {
    emoji: "🍳",
    title: "Cooking & Recipes",
    description:
      "Elevate biryanis, kheer, and curries with the world's most prized spice. A few threads is all it takes.",
    href: "/blog",
    linkLabel: "Explore recipes →",
  },
  {
    emoji: "🤰",
    title: "Pregnancy & Wellness",
    description:
      "Trusted by thousands of Indian mothers. GI-tagged Grade A++ Mongra kesar, farm-direct from Pampore.",
    href: "/blog/saffron-for-pregnancy",
    linkLabel: "Read the guide →",
  },
  {
    emoji: "🎁",
    title: "Gifting",
    description:
      "Premium Kashmiri kesar — a luxurious, meaningful gift for families, festivals, and occasions.",
    href: "/gifting",
    linkLabel: "Gift saffron →",
  },
  {
    emoji: "📦",
    title: "Bulk & Wholesale",
    description:
      "Custom quantities for restaurants, caterers, and retailers. Same Grade A++ quality at scale.",
    href: "/bulk-orders",
    linkLabel: "Get a quote →",
  },
] as const;

export function UseCasesSection() {
  return (
    <section
      className="bg-background-alt py-16 lg:py-20"
      aria-labelledby="use-cases-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
        <div className="mb-10 text-center lg:mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Every Purpose
          </p>
          <h2
            id="use-cases-heading"
            className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl"
          >
            Pure Saffron for Every Use
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-secondary font-body sm:text-base">
            From the kitchen to wellness rituals — the same Grade A++ Mongra
            kesar, farm-direct from Pampore.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {USE_CASES.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col rounded-2xl border border-secondary-border/15 bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/8 sm:p-6"
            >
              <span className="mb-3 text-3xl" role="img" aria-label={item.title}>
                {item.emoji}
              </span>
              <h3 className="font-display text-base font-bold text-text-primary sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-secondary font-body sm:text-sm">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-4 text-xs font-bold text-primary hover:underline sm:text-sm"
              >
                {item.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
