import { TRUST_BADGES } from "@/lib/constants";

type BadgeId = (typeof TRUST_BADGES)[number]["id"];

const iconClass = "h-6 w-6 shrink-0 text-primary";

function TrustBadgeIcon({ id }: { id: BadgeId }) {
  const svgProps = {
    className: iconClass,
    viewBox: "0 0 24 24" as const,
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "fresh-harvest":
      return (
        <svg {...svgProps}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case "farm-direct":
      return (
        <svg {...svgProps}>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      );
    case "guarantee":
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

export function TrustBadges() {
  return (
    <section className="bg-background py-10 border-b border-secondary-border/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="grid grid-cols-3 gap-4 lg:gap-0 lg:divide-x lg:divide-secondary-border/15">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2.5 text-center lg:px-10"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-muted"
                aria-hidden
              >
                <TrustBadgeIcon id={badge.id} />
              </div>
              <h3 className="font-display text-sm font-semibold text-text-primary sm:text-base">
                {badge.title}
              </h3>
              <p className="hidden text-xs leading-snug text-secondary font-body sm:block max-w-[200px]">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
