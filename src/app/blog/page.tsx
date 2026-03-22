// src/app/blog/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { getAllPosts } from "@/lib/blog-data";
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
    title: "Saffron Blog — Benefits, Recipes & Buying Guides | Saffron Box",
    description:
      "Everything you need to know about Kashmiri saffron — health, recipes, buying guides.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Saffron Box blog — Kashmiri saffron guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Blog — Benefits, Recipes & Buying Guides | Saffron Box",
    description:
      "Everything you need to know about Kashmiri saffron — health, recipes, buying guides.",
    images: [OG_IMAGE],
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  health: "Health & wellness",
  recipes: "Recipes",
  "buying-guide": "Buying guide",
  "about-saffron": "About saffron",
};

function formatCategory(value: string) {
  return CATEGORY_LABELS[value] || value;
}

export default async function BlogListPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 pt-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
            ]}
          />
        </div>
        {/* Hero Section */}
        <section className="bg-surface-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-20 text-center">
            <Badge variant="outline" className="mb-6">
              The Saffron Journal
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-6xl">
              Saffron Blog — Benefits, Recipes & Buying Guides
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary font-body max-w-2xl mx-auto">
              Discover the stories behind our heritage crops and the science of
              natural well-being.
            </p>
          </div>
        </section>

        {/* Blog Post List */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid gap-12 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-dark/5 ring-1 ring-secondary-border/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted"
                  >
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 400px"
                      loading="lazy"
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="backdrop-blur-md bg-white/70 text-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-dark/5">
                          {formatCategory(post.category)}
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col flex-grow p-8">
                    <div className="flex items-center gap-3 text-xs text-text-muted font-body mb-4">
                      <span>{post.date}</span>
                      {post.author && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-secondary-border" />
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-display text-2xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-4 text-sm text-secondary font-body line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
