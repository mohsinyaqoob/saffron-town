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
  title: "Privacy Policy | Saffron Box",
  description:
    "Privacy Policy for Saffron Box. How we collect, use, and protect your data when you shop for premium Kashmiri saffron.",
  alternates: { canonical: `${SITE_CONFIG.url}/privacy` },
  openGraph: {
    title: "Privacy Policy | Saffron Box",
    description:
      "How we collect, use, and protect your data when you shop at Saffron Box.",
    url: `${SITE_CONFIG.url}/privacy`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Saffron Box privacy policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Saffron Box",
    description: "How we handle your data at Saffron Box.",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: "/privacy" },
          ]}
          title="Privacy Policy"
          description="Last updated: March 2025"
        />

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 prose-headings:font-display prose-headings:font-bold prose-headings:text-text-primary prose-p:text-lg prose-p:leading-relaxed prose-p:text-secondary prose-p:mb-8">
            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              Information We Collect
            </h2>
            <p>
              When you place an order or contact us, we collect your name, email
              address, shipping address, and payment details. This information
              is used solely to process orders, deliver your saffron, and
              respond to your inquiries.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              How We Use Your Information
            </h2>
            <p>
              We use your information to fulfil orders, send delivery updates,
              answer questions about our products, and improve our service. We
              do not sell or share your personal data with third parties for
              marketing.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              Cookies & Analytics
            </h2>
            <p>
              Our website uses cookies and analytics tools to improve user
              experience and understand how visitors interact with our site. You
              can adjust your browser settings to limit or block cookies.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              Data Security
            </h2>
            <p>
              We take reasonable measures to protect your personal information
              from unauthorised access, loss, or misuse. Payment processing is
              handled by secure third-party providers.
            </p>

            <h2 className="font-display text-2xl font-bold mt-16 mb-6 text-text-primary">
              Contact
            </h2>
            <p>
              For privacy-related questions, contact us at{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-primary font-semibold hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>

            <div className="mt-20 pt-12 border-t border-secondary-border/20 text-center">
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
