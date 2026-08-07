import Image from "next/image";

/**
 * The grower credential card that floats over the hero.
 *
 * Conversion rationale: this is the highest-leverage element in the hero. Every
 * competitor can write "100% authentic"; almost none can put a named person with
 * a place next to it. Identity is the one claim a reseller cannot copy, which is
 * why it sits at eye level rather than buried in an "Our Story" page.
 *
 * `photo` is optional on purpose. Until a real photograph of the grower exists,
 * the card renders a monogram — which reads as a considered design choice. Do
 * not fill this slot with stock or generated portraiture: a face a customer
 * clocks as synthetic destroys precisely the credibility the card exists to
 * build, and it is the first thing a sceptical buyer reverse-image-searches.
 *
 * To add the real photo: drop it in `public/images/grower/` and pass the path.
 */
export interface GrowerCardProps {
  name: string;
  title: string;
  location: string;
  quote: string;
  /** Path under /public. Omit until a genuine photograph is available. */
  photo?: string;
  className?: string;
}

export function GrowerCard({
  name,
  title,
  location,
  quote,
  photo,
  className = "",
}: GrowerCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <figure
      className={`rounded-2xl border border-white/15 bg-background-alt/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        {photo ? (
          <Image
            src={photo}
            alt={`${name}, ${title}`}
            width={56}
            height={56}
            className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
          />
        ) : (
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/12 font-display text-base font-bold text-primary sm:h-14 sm:w-14 sm:text-lg"
            aria-hidden
          >
            {initials}
          </span>
        )}
        <figcaption className="min-w-0">
          <p className="font-display text-sm font-bold leading-tight text-primary sm:text-base">
            {name}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-text-secondary font-body">
            {title}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-text-muted font-body">
            <svg
              className="h-3 w-3 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
            {location}
          </p>
        </figcaption>
      </div>
      <blockquote className="mt-3 border-t border-secondary-border/25 pt-3 font-display text-sm italic leading-relaxed text-text-primary">
        “{quote}”
      </blockquote>
    </figure>
  );
}
