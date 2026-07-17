/**
 * Shop + prebook pack grid (2g–50g) is defined in `saffron-pack-variants.ts` and
 * priced in `data/products.json` so both surfaces stay in sync.
 */
export {
  getGridPackVariants,
  MONGRA_SAFFRON_SLUG,
  parsePackGramsFromSize,
  SHOP_PACK_GRID_GRAMS,
} from "./saffron-pack-variants";

export const SITE_CONFIG = {
  name: "Saffron Town",
  tagline: "Always the most recent harvest.",
  url: "https://www.saffron.town",
  description:
    "Premium Kashmiri Mongra Saffron dealer. Farm-direct, seed-to-harvest controlled. Grade A++ Pampore saffron—fresh harvest only, no compromise on quality. Money-back guarantee.",
  keywords: [
    "premium saffron dealer",
    "Kashmiri Mongra saffron",
    "fresh harvest saffron",
    "Pampore saffron",
    "seed to harvest saffron",
    "farm direct saffron",
    "Grade A++ saffron",
    "Kashmir saffron buy online",
  ],
  // E-E-A-T: Clear ownership and contact for trust signals
  email: "orders@saffron.town",
  orderEmail: "orders@saffron.town",
  /** E.164 — keep in sync with Google Business Profile primary phone */
  phone: "+917006846538",
  logo: "https://www.saffron.town/logo-horizon.svg",
  sameAs: [
    "https://instagram.com/saffrontown",
    "https://facebook.com/saffrontown",
  ],
} as const;

/** `next/image` quality for hero, product photos, and blog cards (default is 75). */
export const IMAGE_QUALITY_PHOTO = 68;

/** Inline article / thumbnail imagery — slightly higher than hero for text-adjacent photos. */
export const IMAGE_QUALITY_CONTENT = 70;

/** Product gallery thumbnails and small previews. */
export const IMAGE_QUALITY_THUMB = 65;

/**
 * Main navigation, grouped into dropdown menus (mirrors the footer's IA).
 * A top-level entry is either a single link (`href`) or a dropdown (`items`).
 * Home is reached via the logo, so it is not a nav item.
 */
export type NavLeaf = { href: string; label: string; description?: string };
export type NavEntry =
  | { label: string; href: string }
  | { label: string; items: readonly NavLeaf[] };

export const NAV_MENU: readonly NavEntry[] = [
  {
    label: "Shop",
    items: [
      {
        href: "/shop/saffron",
        label: "Mongra Saffron",
        description: "Our signature Grade A++ kesar",
      },
      {
        href: "/gifting",
        label: "Gifting",
        description: "Premium saffron gift boxes",
      },
      {
        href: "/bulk-orders",
        label: "Bulk & Wholesale",
        description: "Custom quantities for business",
      },
      {
        href: "/prebook-2026-harvest",
        label: "Prebook 2026 Harvest",
        description: "Reserve the fresh crop early",
      },
    ],
  },
  {
    label: "Discover",
    items: [
      {
        href: "/blog",
        label: "Journal",
        description: "Guides, recipes & saffron science",
      },
      {
        href: "/our-story",
        label: "Our Story",
        description: "Farm-direct from Pampore",
      },
      {
        href: "/lab-reports",
        label: "Quality & Testing",
        description: "GI tag, grade & bulk lab testing",
      },
    ],
  },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
] as const;

export const TRUST_BADGES = [
  {
    id: "fresh-harvest",
    title: "Fresh Harvest",
    description: "Only the current harvest. Never old stock.",
  },
  {
    id: "farm-direct",
    title: "Farm Direct",
    description: "Straight from Himalayan farms to your doorstep",
  },
  {
    id: "guarantee",
    title: "100% Guarantee",
    description: "No adulteration. Money-back promise.",
  },
] as const;
