import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-data";
import { IMAGE_QUALITY_PHOTO } from "@/lib/constants";

const CATEGORY_LABELS: Record<string, string> = {
  health: "Health & wellness",
  recipes: "Recipes",
  "buying-guide": "Buying guide",
  "about-saffron": "About saffron",
};

function formatCategory(value: string) {
  return CATEGORY_LABELS[value] || value;
}

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group flex flex-col overflow-hidden rounded-[2rem] bg-background-alt shadow-xl shadow-dark/5 ring-1 ring-secondary-border/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
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
              sizes="(max-width: 768px) 100vw, (max-width: 1920px) 50vw, 900px"
              loading="lazy"
              quality={IMAGE_QUALITY_PHOTO}
            />
            {post.category && (
              <div className="absolute top-4 left-4">
                <span className="backdrop-blur-md bg-background-alt/80 text-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-dark/5">
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
  );
}
