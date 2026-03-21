const TESTIMONIALS = [
  {
    name: "Priya M.",
    location: "Mumbai",
    rating: 5,
    date: "Dec 2024",
    text: "Best saffron I've ever bought. The colour and aroma are incredible. Every strand is deep red with no yellow—exactly what you want from Grade A++ Mongra. Will order again.",
  },
  {
    name: "Rahul S.",
    location: "Bangalore",
    rating: 5,
    date: "Jan 2025",
    text: "Fresh harvest as promised. Used it in biryani and it made such a difference. The farm-direct promise really shows in quality. Fast delivery too.",
  },
  {
    name: "Anita K.",
    location: "Delhi",
    rating: 5,
    date: "Nov 2024",
    text: "Finally found authentic Kashmiri saffron online. No adulteration, pure threads. The packaging was also premium. Highly recommend for anyone serious about quality.",
  },
];

export function ProductReviews() {
  return (
    <section className="mt-8 lg:mt-10" aria-labelledby="reviews-heading">
      <h2
        id="reviews-heading"
        className="font-display text-xl font-bold text-text-primary mb-4"
      >
        Customer Reviews
      </h2>
      <div className="space-y-6">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-secondary-border/50 bg-background p-4 lg:p-5"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    className={
                      j < t.rating ? "text-primary" : "text-secondary-border"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-text-primary font-body">
                {t.name}
              </span>
              <span className="text-xs text-text-muted font-body">
                {t.date} · {t.location}
              </span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed font-body">
              {t.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
