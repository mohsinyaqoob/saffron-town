// src/app/lab-reports/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_CONFIG } from "@/lib/constants";

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Lab Reports | ISO 3632 Kashmiri Saffron Tests",
  description:
    "ISO 3632 lab reports for Saffron Box's pure Kashmiri Mongra saffron. Third-party tested for purity and crocin content.",
  alternates: { canonical: `${SITE_CONFIG.url}/lab-reports` },
  openGraph: {
    title: "Lab Reports | ISO 3632 Kashmiri Saffron Tests | Saffron Box",
    description:
      "ISO 3632 lab reports. Third-party tested for purity and crocin content. Download your batch certificate.",
    url: `${SITE_CONFIG.url}/lab-reports`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ISO 3632 lab-tested Kashmiri saffron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab Reports | ISO 3632 Kashmiri Saffron Tests | Saffron Box",
    description:
      "ISO 3632 lab reports. Third-party tested for purity and crocin content.",
    images: [OG_IMAGE],
  },
};

export default function LabReportsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 pt-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Lab Reports", href: "/lab-reports" },
            ]}
          />
        </div>
        <section className="bg-surface-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-6xl">
              Kashmiri Saffron Lab Reports
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary font-body">
              Our saffron is tested by third-party labs for ISO 3632 compliance
              and purity.
            </p>
          </div>
        </section>
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-20 text-center">
            <p className="text-secondary font-body mb-8">
              Lab reports are included with every order. Contact us for detailed
              certificates.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Shop saffron
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
