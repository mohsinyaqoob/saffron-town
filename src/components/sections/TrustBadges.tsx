import { TRUST_BADGES } from "@/lib/constants";

export function TrustBadges() {
  return (
    <section className="bg-background-alt py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-12 px-6 lg:flex-row lg:gap-12 lg:px-20">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.title}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted" />
            <h3 className="font-display text-base font-semibold text-text-primary">
              {badge.title}
            </h3>
            <p className="max-w-[240px] text-sm leading-snug text-secondary font-body">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
