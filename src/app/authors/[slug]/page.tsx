import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAllAuthors, getAuthorBySlug } from "@/lib/authors-data";
import { SITE_CONFIG } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  const url = `${SITE_CONFIG.url}/authors/${author.slug}`;
  const title = `${author.name} — ${author.jobTitle} | Saffron Town`;
  return {
    title,
    description: author.shortBio,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: author.shortBio,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description: author.shortBio,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const url = `${SITE_CONFIG.url}/authors/${author.slug}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: author.name,
    url,
    jobTitle: author.jobTitle,
    description: author.longBio,
    sameAs: author.sameAs,
    knowsAbout: [
      "Kashmiri saffron",
      "Mongra saffron",
      "Pampore saffron farming",
      "ISO 3632 saffron grading",
      "Saffron authenticity testing",
    ],
    worksFor: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: SITE_CONFIG.logo,
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd schema={personSchema} />
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-5xl px-6 lg:px-20 py-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Authors", href: "/authors" },
              { label: author.name, href: `/authors/${author.slug}` },
            ]}
          />
        </div>

        <section className="mx-auto max-w-4xl px-6 lg:px-20 py-10 lg:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
            {author.jobTitle}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-text-primary">
            {author.name}
          </h1>
          <p className="mt-6 text-lg text-secondary font-body leading-relaxed">
            {author.longBio}
          </p>

          <h2 className="mt-12 font-display text-2xl font-bold text-text-primary">
            Credentials
          </h2>
          <ul className="mt-4 space-y-2 text-secondary font-body list-disc pl-5">
            {author.credentials.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          {author.sameAs.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-2xl font-bold text-text-primary">
                Elsewhere
              </h2>
              <ul className="mt-4 space-y-2 text-secondary font-body">
                {author.sameAs.map((href) => (
                  <li key={href}>
                    <a
                      href={href}
                      rel="me noopener noreferrer"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      {href.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-12 pt-8 border-t border-secondary-border/20">
            <Link
              href="/blog"
              className="text-sm font-semibold text-primary hover:underline"
            >
              ← Read articles by {author.name.split(" ")[0]}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
