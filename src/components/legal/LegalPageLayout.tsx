import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { LEGAL_CONFIG } from "@/lib/legal";

/**
 * Shared shell for the policy pages so they stay visually and structurally
 * identical. Content is plain prose — deliberately readable rather than clever,
 * since these pages exist to be understood and to be checked by payment
 * providers and regulators.
 */
export function LegalPageLayout({
  title,
  slug,
  intro,
  children,
}: {
  title: string;
  slug: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: title, href: `/${slug}` },
          ]}
          title={title}
          description={`Last updated: ${LEGAL_CONFIG.lastUpdated}`}
        />

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-20">
            {intro ? (
              <p className="mb-10 text-lg leading-relaxed text-secondary font-body">
                {intro}
              </p>
            ) : null}
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/** A titled clause block. */
export function Clause({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="font-display text-2xl font-bold text-text-primary">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-secondary font-body [&_a]:font-semibold [&_a]:text-primary hover:[&_a]:underline [&_strong]:text-text-primary">
        {children}
      </div>
    </section>
  );
}

/** Bulleted list styled for policy prose. */
export function ClauseList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-2">
      {items.map((item, i) => (
        // Static policy copy — never reordered, so the index is a stable key.
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Emphasised callout for the clauses customers most often miss. */
export function ClauseCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 text-base leading-relaxed text-text-primary font-body [&_strong]:font-bold">
      {children}
    </div>
  );
}
