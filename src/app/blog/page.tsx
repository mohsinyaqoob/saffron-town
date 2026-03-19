import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `The Saffron Journal | Himalayan Wisdom & Wellness | ${SITE_CONFIG.name}`,
  description: "Discover stories behind heritage Kashmiri saffron, wellness insights, and the science of natural well-being from India's premium saffron dealer.",
  alternates: { canonical: `${SITE_CONFIG.url}/blog` },
  openGraph: {
    title: `The Saffron Journal | ${SITE_CONFIG.name}`,
    description: "Himalayan wisdom & wellness. Stories behind our heritage saffron and natural well-being.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `The Saffron Journal | ${SITE_CONFIG.name}`,
    description: "Himalayan wisdom & wellness. Stories behind heritage Kashmiri saffron.",
  },
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-surface-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-20 text-center">
            <Badge variant="outline" className="mb-6">The Saffron Journal</Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-6xl">
                Himalayan Wisdom & Wellness
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary font-body max-w-2xl mx-auto">
                Discover the stories behind our heritage crops and the science of natural well-being.
            </p>
          </div>
        </section>

        {/* Blog Post List */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-dark/5 ring-1 ring-secondary-border/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                  <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="backdrop-blur-md bg-white/70 text-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-dark/5">
                            {post.category}
                        </span>
                    </div>
                  </Link>
                  <div className="flex flex-col flex-grow p-8">
                    <div className="flex items-center gap-3 text-xs text-text-muted font-body mb-4">
                        <span>{post.date}</span>
                        <span className="h-1 w-1 rounded-full bg-secondary-border" />
                        <span>{post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-display text-2xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-4 text-sm text-secondary font-body line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {post.author.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <span className="text-xs font-semibold text-text-primary">{post.author}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1 group/link">
                            Read More
                            <svg className="h-3 w-3 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
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
