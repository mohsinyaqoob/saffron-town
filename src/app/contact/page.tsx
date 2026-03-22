import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { SITE_CONFIG } from "@/lib/constants";

/** Static page — built once at deploy */
export const dynamic = "force-static";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Contact Saffron Box | Kashmiri Saffron Inquiries",
  description:
    "Contact Saffron Box—India's premium saffron dealer. Questions about Kashmiri Mongra saffron, orders, or partnerships. We respond within 24-48 hours.",
  alternates: { canonical: `${SITE_CONFIG.url}/contact` },
  openGraph: {
    title: "Contact Saffron Box | Kashmiri Saffron Inquiries",
    description:
      "Get in touch. Premium Kashmiri saffron inquiries, orders, partnerships. Response within 24-48 hours.",
    url: `${SITE_CONFIG.url}/contact`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Contact Saffron Box for Kashmiri saffron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Saffron Box | Kashmiri Saffron Inquiries",
    description:
      "Premium Kashmiri saffron inquiries, orders, partnerships. Response within 24-48 hours.",
    images: [OG_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
          title="Contact Saffron Box"
          description="Have a question? We'd love to hear from you."
        />

        {/* Content */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-2xl px-6 lg:px-20">
            <div className="rounded-2xl bg-background-alt border border-secondary-border/20 p-8 lg:p-12 shadow-lg shadow-dark/5">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-6">
                Get in Touch
              </h2>
              <p className="text-secondary font-body mb-8">
                For orders, product inquiries, or partnerships, reach out via
                email. We typically respond within 24–48 hours.
              </p>

              <dl className="space-y-6">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
                    Orders & Support
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${SITE_CONFIG.orderEmail}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {SITE_CONFIG.orderEmail}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-10 pt-8 border-t border-secondary-border/20">
                <p className="text-sm text-text-muted font-body">
                  India-wide shipping. Fresh harvest delivered to your doorstep.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Back to home
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
