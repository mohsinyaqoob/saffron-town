/**
 * "How to tell real saffron from fake" — objection handling as education.
 *
 * Conversion rationale: the blocker on a ₹1,299 saffron purchase from an unknown
 * brand is not price, it is "how do I know this is real". Asserting purity
 * harder does not answer that — every reseller asserts purity too. Teaching the
 * customer the actual tests does three things at once: it transfers a skill they
 * keep, it implicitly invites them to test *our* pack (only a seller confident in
 * the product does this), and it arms them against the competitors who would
 * fail those tests. The customer leaves trusting their own judgement rather than
 * our adjectives.
 *
 * Every test listed is one a buyer can genuinely run at their kitchen table.
 */

const TESTS = [
  {
    n: "01",
    title: "The cold water test",
    real: "Colour bleeds slowly. After 10–15 minutes the water is golden-yellow, and the threads stay red.",
    fake: "Colour floods out in seconds, and the water turns red or orange. That is dye, not crocin.",
  },
  {
    n: "02",
    title: "Look at the shape",
    real: "Each thread flares into a trumpet at one end — that is the stigma tip. Mongra is the tip only, deep crimson end to end.",
    fake: "Uniform straight strands with no flare are usually dyed corn silk or safflower petals.",
  },
  {
    n: "03",
    title: "Taste it",
    real: "Saffron tastes bitter, never sweet. The aroma is honeyed and hay-like.",
    fake: "A sweet taste means it has been soaked in sugar syrup or honey to add weight.",
  },
  {
    n: "04",
    title: "Rub a damp thread",
    real: "A wet thread leaves a yellow-orange stain on your fingers.",
    fake: "A red stain on your fingers is added colour coming off.",
  },
  {
    n: "05",
    title: "Check the price honestly",
    real: "One flower gives three stigmas. It takes roughly 150 flowers to make a single gram.",
    fake: "Saffron sold at a few hundred rupees a gram cannot be pure Mongra. The arithmetic does not work.",
  },
] as const;

export function SpotFakeSaffron() {
  return (
    <section
      className="bg-dark py-14 sm:py-20"
      aria-labelledby="spot-fake-saffron-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f0c070]">
          Before you buy from anyone
        </p>
        <h2
          id="spot-fake-saffron-heading"
          className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-4xl"
        >
          How to tell real saffron from fake
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 font-body sm:text-base">
          Most saffron sold online in India is cut, dyed or mislabelled. You do
          not have to take our word for it — these are the tests, and they work
          on our pack too. Run them when your order arrives.
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {TESTS.map((test) => (
            <li
              key={test.n}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display text-sm font-bold text-[#f0c070]"
                  aria-hidden
                >
                  {test.n}
                </span>
                <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                  {test.title}
                </h3>
              </div>
              <p className="mt-3 flex gap-2.5 text-sm leading-relaxed text-white/80 font-body">
                <span
                  className="mt-px shrink-0 font-bold text-[#7fbf7f]"
                  aria-hidden
                >
                  ✓
                </span>
                <span>
                  <span className="sr-only">Real saffron: </span>
                  {test.real}
                </span>
              </p>
              <p className="mt-2 flex gap-2.5 text-sm leading-relaxed text-white/55 font-body">
                <span
                  className="mt-px shrink-0 font-bold text-white/40"
                  aria-hidden
                >
                  ✕
                </span>
                <span>
                  <span className="sr-only">Fake or adulterated: </span>
                  {test.fake}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
