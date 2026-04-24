/**
 * Named author registry — the E-E-A-T source of truth.
 *
 * Blog posts reference authors by *name* (legacy Sanity data); we look them
 * up here to build Person JSON-LD with real bios + sameAs links. Unknown
 * authors fall back to the Saffron Town organisation so we never ship
 * invalid schema.
 */

export interface AuthorProfile {
  slug: string;
  name: string;
  jobTitle: string;
  shortBio: string;
  longBio: string;
  credentials: string[];
  image?: string;
  sameAs: string[];
}

export const AUTHORS: Record<string, AuthorProfile> = {
  "mohsin-yaqoob": {
    slug: "mohsin-yaqoob",
    name: "Mohsin Yaqoob",
    jobTitle: "Founder, Saffron Town",
    shortBio:
      "Founder of Saffron Town. Works directly with heritage saffron growers in Pampore to bring single-origin Mongra kesar from farm to table.",
    longBio:
      "Mohsin founded Saffron Town to give Indian homes honest, lab-verified Kashmiri Mongra kesar with zero middlemen. He works on the ground with heritage saffron-growing families in Pampore — the GI-tagged saffron belt of Kashmir — and personally oversees the harvest, ISO 3632 testing, and fulfilment for every batch. Before Saffron Town, Mohsin spent a decade in software engineering; today that same rigour shows up in the traceability and lab evidence behind every gram we ship.",
    credentials: [
      "Works directly with GI-tagged Pampore saffron growers",
      "Oversees every harvest from seeding to packing",
      "Commissions ISO 3632 lab testing on every batch",
    ],
    sameAs: [
      "https://instagram.com/saffrontown",
      "https://facebook.com/saffrontown",
    ],
  },
  "saffron-town-editorial": {
    slug: "saffron-town-editorial",
    name: "Saffron Town Editorial",
    jobTitle: "Editorial Team, Saffron Town",
    shortBio:
      "The Saffron Town editorial team — saffron growers, food writers and lab technicians writing together on Kashmiri kesar, Ayurveda and cooking.",
    longBio:
      "Our editorial team combines voices from the field (Pampore growers), the lab (ISO 3632 testing partners), and the kitchen (food writers) so every article on saffron.town reflects first-hand experience, not rewritten content.",
    credentials: [
      "First-hand access to heritage Pampore saffron farms",
      "ISO 3632 lab-verified claims",
      "Reviewed by the Saffron Town founder before publication",
    ],
    sameAs: [
      "https://instagram.com/saffrontown",
      "https://facebook.com/saffrontown",
    ],
  },
};

const NAME_INDEX: Record<string, AuthorProfile> = Object.fromEntries(
  Object.values(AUTHORS).map((a) => [a.name.toLowerCase(), a]),
);

export function getAuthorBySlug(slug: string): AuthorProfile | undefined {
  return AUTHORS[slug];
}

/** Match by display name (case-insensitive) — blog posts store the author as a
 * free-form string, so this is our bridge back to the profile. */
export function getAuthorByName(name?: string): AuthorProfile | undefined {
  if (!name) return undefined;
  return NAME_INDEX[name.toLowerCase()];
}

export function getAllAuthors(): AuthorProfile[] {
  return Object.values(AUTHORS);
}
