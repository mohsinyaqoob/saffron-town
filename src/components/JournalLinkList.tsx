import Link from "next/link";

/**
 * Compact "Further reading on the Journal" block. Used at the bottom of
 * the AI-overview landing pages (`/real-vs-fake-saffron-test`, etc.) to
 * pass crawl signal from those high-priority pages down into the blog
 * posts that GSC currently lists as "Discovered – currently not indexed".
 *
 * Each entry should be an evergreen blog post; pages own their own copy
 * so the surrounding section reads in context.
 */
type JournalLink = {
  /** Display title shown to the reader */
  title: string;
  /** Blog slug, without the leading /blog/ */
  slug: string;
  /** Short blurb used as anchor context for ranking */
  blurb: string;
};

type Props = {
  /** Section heading shown above the list */
  heading?: string;
  /** Lead paragraph explaining the connection — adds keyword context */
  lede?: string;
  /** Posts to surface; order matters (first = most relevant) */
  links: JournalLink[];
};

export function JournalLinkList({
  heading = "Continue reading on the Journal",
  lede,
  links,
}: Props) {
  if (links.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-4xl px-6 lg:px-20 py-12 border-t border-secondary-border/20"
      aria-labelledby="journal-link-list-heading"
    >
      <h2
        id="journal-link-list-heading"
        className="font-display text-3xl font-bold text-text-primary"
      >
        {heading}
      </h2>
      {lede && (
        <p className="mt-4 text-secondary font-body leading-relaxed text-lg">
          {lede}
        </p>
      )}
      <ul className="mt-8 space-y-5">
        {links.map((l) => (
          <li
            key={l.slug}
            className="rounded-2xl border border-secondary-border/20 bg-background p-6 transition-shadow hover:shadow-md"
          >
            <Link
              href={`/blog/${l.slug}`}
              className="group flex flex-col gap-2"
            >
              <span className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                {l.title}
              </span>
              <span className="text-sm text-secondary font-body leading-relaxed">
                {l.blurb}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary mt-1">
                Read the full guide →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
