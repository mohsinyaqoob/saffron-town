import { Button } from "@/components/ui/Button";

export function GuaranteeSection() {
  return (
    <section
      className="bg-dark py-20"
      aria-labelledby="guarantee-heading"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center lg:px-20">
        <h2
          id="guarantee-heading"
          className="font-display text-4xl font-medium text-dark-text"
        >
          Our Promise
        </h2>
        <p className="text-lg leading-relaxed text-dark-text-muted font-body">
          100% pure. Only the current harvest. If you find any adulteration, full refund—no questions asked.
        </p>
        <Button variant="primary" size="md" className="tracking-widest uppercase text-sm">
          Money-back guarantee
        </Button>
      </div>
    </section>
  );
}
