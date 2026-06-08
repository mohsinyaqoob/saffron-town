import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-data";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";

export async function BlogSection() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <section className="bg-background py-14 lg:py-18" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="mb-10 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              The Saffron Journal
            </p>
            <h2
              id="blog-heading"
              className="mt-1 font-display text-2xl font-bold text-text-primary sm:text-3xl"
            >
              Insights &amp; Stories
            </h2>
          </div>
          <Link
            href="/blog"
            className="mt-3 text-sm font-semibold text-primary hover:underline md:mt-0"
          >
            Explore journal →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] bg-background shadow-xl shadow-dark/5 ring-1 ring-secondary-border/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block aspect-[16/10] w-full overflow-hidden bg-surface-muted"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                  loading="lazy"
                  quality={IMAGE_QUALITY_PHOTO}
                />
              </Link>
              <div className="flex flex-col flex-grow p-8">
                <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-secondary-border" />
                  <span className="text-primary">{post.category}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-4 text-sm text-secondary font-body line-clamp-2 mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-secondary-border/5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    {post.readTime}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-primary hover:text-primary-hover font-body flex items-center gap-1 group/btn"
                  >
                    Read Story
                    <svg
                      className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
