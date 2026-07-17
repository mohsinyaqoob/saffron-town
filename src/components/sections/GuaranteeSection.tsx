import Link from "next/link";

const PROMISES = [
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "100% Purity",
    description: "No fillers, no artificial colour. If you find any adulteration, full refund — no questions asked.",
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    title: "Fresh Harvest Only",
    description: "We sell only the current season's harvest. Zero old stock. Ever.",
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
      </svg>
    ),
    title: "GI-Tagged Origin",
    description: "GI-tagged Mongra saffron, farm-direct from Pampore. Independent ISO 3632 batch testing is available on request for bulk orders over 1 kg.",
  },
] as const;

export function GuaranteeSection() {
  return (
    <section className="bg-dark py-16 lg:py-20" aria-labelledby="guarantee-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-20">
        <div className="mb-10 text-center lg:mb-12">
          <h2
            id="guarantee-heading"
            className="font-display text-3xl font-medium text-dark-text sm:text-4xl"
          >
            Our Promise
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-dark-text-muted font-body sm:text-base">
            100% pure. Only the current harvest. If you find any adulteration,
            full refund — no questions asked.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {PROMISES.map((p) => (
            <div
              key={p.title}
              className="flex flex-col items-start gap-3 rounded-2xl border border-white/8 bg-white/5 p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary">
                {p.icon}
              </div>
              <h3 className="font-display text-base font-semibold text-dark-text">{p.title}</h3>
              <p className="text-sm leading-relaxed text-dark-text-muted font-body">{p.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/lab-reports"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-dark-text transition-all hover:bg-white/15 active:scale-[0.98]"
          >
            View Lab Reports
          </Link>
        </div>
      </div>
    </section>
  );
}
