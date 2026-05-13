// src/app/blog/page.tsx

import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { getBlogPostsPage } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/constants";

/** Blog listing — ISR: re-generates every 60s so new posts go live without full rebuild */
export const revalidate = 60;

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

export const metadata: Metadata = {
  title: "Saffron Blog — Benefits, Recipes & Buying Guides",
  description:
    "Everything you need to know about Kashmiri saffron — health benefits, recipes, how to spot fake saffron, and buying guides from the source.",
  alternates: { canonical: `${SITE_CONFIG.url}/blog` },
  openGraph: {
    title: "Saffron Blog — Benefits, Recipes & Buying Guides | Saffron Town",
    description:
      "Everything you need to know about Kashmiri saffron — health, recipes, buying guides.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
    locale: "en_IN",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Saffron Town blog — Kashmiri saffron guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Blog — Benefits, Recipes & Buying Guides | Saffron Town",
    description:
      "Everything you need to know about Kashmiri saffron — health, recipes, buying guides.",
    images: [OG_IMAGE],
  },
};

export default async function BlogListPage() {
  const { posts, totalPages, page } = await getBlogPostsPage(1);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
          ]}
          title="Saffron Blog — Benefits, Recipes & Buying Guides"
          description="Discover the stories behind our heritage crops and the science of natural well-being."
          badge="The Saffron Journal"
          size="compact"
          maxWidth="wide"
        />

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            {posts.length === 0 ? (
              <p className="text-center text-sm text-secondary font-body">
                No posts published yet. Check back soon.
              </p>
            ) : (
              <>
                <BlogListing posts={posts} />
                <BlogPagination page={page} totalPages={totalPages} />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
