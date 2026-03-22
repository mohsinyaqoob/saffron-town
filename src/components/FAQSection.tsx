import { JsonLd } from "@/components/JsonLd";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

/**
 * Renders FAQ items as an accessible accordion (details/summary, no JS libs)
 * and automatically injects FAQPage JSON-LD schema from the same faqs array.
 */
export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs?.length) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="mt-24 py-16 border-t border-secondary-border/20"
    >
      <JsonLd schema={faqSchema} />
      <h2
        id="faq-heading"
        className="font-display text-2xl font-bold text-text-primary mb-10"
      >
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group border border-secondary-border/20 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-6 cursor-pointer list-none font-semibold text-text-primary hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <svg
                className="w-4 h-4 text-secondary transition-transform group-open:rotate-180 shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 pt-0 text-secondary font-body leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
