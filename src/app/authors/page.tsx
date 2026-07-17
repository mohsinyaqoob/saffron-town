import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAllAuthors } from "@/lib/authors-data";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Authors — Saffron Town",
  description:
    "The growers, founders and editors writing on Saffron Town about Kashmiri Mongra kesar, Pampore saffron farming and ISO 3632 testing.",
  alternates: { canonical: `${SITE_CONFIG.url}/authors` },
};

export default function AuthorsIndexPage() {
  const authors = getAllAuthors();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-5xl px-6 lg:px-20 py-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Authors", href: "/authors" },
            ]}
          />
        </div>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-10 lg:py-16">
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
            Authors
          </h1>
          <p className="mt-4 text-lg text-secondary font-body max-w-2xl">
            Every article on Saffron Town is written by someone who has stood in
            the saffron field, worked with the growers, or cooked the recipe.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {authors.map((a) => (
              <Link
                key={a.slug}
                href={`/authors/${a.slug}`}
                className="block rounded-2xl border border-secondary-border/20 p-6 hover:border-primary/40 transition-colors"
              >
                <h2 className="font-display text-xl font-bold text-text-primary">
                  {a.name}
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  {a.jobTitle}
                </p>
                <p className="mt-3 text-sm text-secondary font-body leading-relaxed">
                  {a.shortBio}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
