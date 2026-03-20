import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PortableText } from "@/components/PortableText";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Badge } from "@/components/ui/Badge";
import { getAllPosts, getPostBySlug } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const postUrl = `${SITE_CONFIG.url}/blog/${slug}`;
  const imageUrl = post.seo?.ogImage || post.image;
  const finalImage = imageUrl.startsWith("http")
    ? imageUrl
    : `${SITE_CONFIG.url}${imageUrl}`;
  /** Use template for brand suffix — pass only page-specific title */
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;

  const metadata: { robots?: { index: boolean; follow: boolean } } = {};
  if (post.seo?.noIndex) {
    metadata.robots = { index: false, follow: true };
  }

  return {
    title,
    description,
    alternates: { canonical: post.seo?.canonicalUrl || postUrl },
    openGraph: {
      title,
      description,
      url: postUrl,
      type: "article",
      authors: [post.author],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [finalImage],
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImage],
    },
    ...metadata,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Simple related posts based on category
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ArticleJsonLd
        title={post.title}
        excerpt={post.excerpt}
        author={post.author}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        slug={post.slug}
        image={post.seo?.ogImage || post.image}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_CONFIG.url },
          { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
          { name: post.title, url: `${SITE_CONFIG.url}/blog/${slug}` },
        ]}
      />
      <Header />
      <main className="flex-grow">
        {/* Editorial Header Section */}
        <section className="relative w-full min-h-[60vh] lg:min-h-[75vh] flex flex-col">
          <div className="absolute inset-0 z-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Black overlay 40% + gradient for text contrast at bottom */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
          </div>

          <div className="relative z-20 flex flex-col flex-1 justify-end mx-auto w-full max-w-5xl px-6 lg:px-20 pb-16 pt-24 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-white/90 hover:text-dark-text transition-colors mx-auto"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Journal Home
            </Link>
            <div className="flex justify-center mb-6">
              <Badge
                variant="primary"
                className="bg-primary/95 backdrop-blur-sm px-5 text-white border-0"
              >
                {post.category}
              </Badge>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight lg:text-6xl mb-8 leading-[1.15] text-white drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-body text-white/95">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center font-bold text-white uppercase text-xs shrink-0">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="font-semibold text-white">{post.author}</span>
              </div>
              <span
                className="hidden sm:inline h-1 w-1 rounded-full bg-white/50 shrink-0"
                aria-hidden
              />
              <span className="text-white/90">{post.date}</span>
              <span
                className="hidden sm:inline h-1 w-1 rounded-full bg-white/50 shrink-0"
                aria-hidden
              />
              <span className="text-white/90">{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <div className="mx-auto max-w-7xl px-6 lg:px-20 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-20">
          <article className="max-w-3xl">
            {/* Content rendering */}
            <div className="article-content">
              {Array.isArray(post.content) ? (
                <PortableText value={post.content as PortableTextBlock[]} />
              ) : null}
            </div>

            {/* Author Card Footer */}
            <div className="mt-24 p-12 rounded-[2.5rem] bg-surface-muted/30 border border-secondary-border/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-32 w-32 shrink-0 rounded-[2rem] bg-primary relative overflow-hidden ring-4 ring-white shadow-xl shadow-primary/10">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-display font-bold text-white">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                    Written by {post.author}
                  </h3>
                  <p className="text-secondary font-body leading-relaxed mb-4">
                    Specialist in Himalayan biodiversity and sustainable
                    agricultural practices. Committed to preserving the heritage
                    of Kashmiri crops through science-backed wellness insights.
                  </p>
                  <div className="flex justify-center md:justify-start gap-4">
                    <Link
                      href="#"
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Full Bio
                    </Link>
                    <Link
                      href="#"
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Twitter
                    </Link>
                    <Link
                      href="#"
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Instagram
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar / Recommended Articles */}
          <aside className="space-y-16">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-8 pb-4 border-b border-secondary-border/10">
                Related Stories
              </h4>
              <div className="space-y-12">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-dark/5 shadow-lg group-hover:shadow-xl transition-all duration-500">
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h5 className="font-display font-bold text-lg text-text-primary group-hover:text-primary transition-colors leading-snug">
                      {rp.title}
                    </h5>
                    <span className="text-[10px] font-bold text-text-muted">
                      {rp.date}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-primary text-white space-y-4 shadow-2xl shadow-primary/20">
              <h4 className="font-display text-xl font-bold italic">
                &quot;Bring the Himalayas to your home.&quot;
              </h4>
              <p className="text-sm font-body text-white/80 leading-relaxed">
                Join 5,000+ wellness seekers waiting for our harvest updates.
              </p>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-surface-muted transition-colors text-sm uppercase tracking-widest shadow-lg">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
