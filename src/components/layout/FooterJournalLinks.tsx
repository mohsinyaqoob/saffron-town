import Link from "next/link";
import { getAllPosts } from "@/lib/blog-data";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/blog-redirects";

/**
 * Footer column listing every published blog post. Rendered on every page
 * (since the Footer is global), so every post sits one click away from every
 * other URL on the site — the strongest sitewide crawl signal we can give
 * Google for the "Discovered – currently not indexed" queue.
 *
 * Server component: fetches from Sanity at build time and is revalidated
 * on the same 60s ISR cadence as the blog listing. If Sanity is down we
 * silently render nothing rather than fail the page.
 */
export async function FooterJournalLinks() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    return null;
  }

  const visible = posts.filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug));
  if (visible.length === 0) return null;

  return (
    <nav
      aria-label="From the Saffron Town Journal"
      className="mt-10 border-t border-dark-text-muted/20 pt-8"
    >
      <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-dark-text">
        From the Journal
      </h2>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="text-sm font-body text-dark-text-muted hover:text-dark-text transition-colors"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
