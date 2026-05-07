import Link from "next/link";

export function BlogPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const prevHref = page <= 2 ? "/blog" : `/blog/page/${page - 1}`;
  const nextHref = page >= totalPages ? null : `/blog/page/${page + 1}`;

  const hrefForPage = (n: number) => (n <= 1 ? "/blog" : `/blog/page/${n}`);

  return (
    <nav
      className="mt-14 flex flex-col items-center gap-6 border-t border-secondary-border/15 pt-12"
      aria-label="Blog pagination"
    >
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
        {page > 1 ? (
          <Link
            href={prevHref}
            rel="prev"
            className="rounded-full border border-secondary-border/40 bg-background-alt px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-muted font-body"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-text-muted opacity-50 font-body">
            Previous
          </span>
        )}

        <p className="text-sm tabular-nums text-secondary font-body">
          Page <span className="font-semibold text-text-primary">{page}</span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">{totalPages}</span>
        </p>

        {nextHref ? (
          <Link
            href={nextHref}
            rel="next"
            className="rounded-full border border-secondary-border/40 bg-background-alt px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-muted font-body"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-text-muted opacity-50 font-body">
            Next
          </span>
        )}
      </div>

      {totalPages <= 12 ? (
        <ul className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <li key={n}>
              {n === page ? (
                <span
                  className="flex min-w-[2.25rem] justify-center rounded-lg bg-primary/15 px-3 py-1.5 text-sm font-bold text-primary font-body"
                  aria-current="page"
                >
                  {n}
                </span>
              ) : (
                <Link
                  href={hrefForPage(n)}
                  className="flex min-w-[2.25rem] justify-center rounded-lg px-3 py-1.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary font-body"
                >
                  {n}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
