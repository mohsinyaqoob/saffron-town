export const SITE_CONFIG = {
  name: "Saffron Town",
  tagline: "Always the most recent harvest.",
  url: "https://saffron.town",
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
  email: "hello@saffron.town",
  orderEmail: "orders@saffron.town",
  logo: "https://saffron.town/logo.png",
  sameAs: [
    "https://instagram.com/saffrontown",
    "https://facebook.com/saffrontown",
  ],
} as const;

/* Main nav: Home | Shop | Our Story | About | Reviews | Blog | Contact */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/about", label: "About" },
  { href: "/shop/saffron", label: "Shop" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const TRUST_BADGES = [
  {
    title: "Fresh Harvest",
    description: "Only the current harvest. Never old stock.",
  },
  {
    title: "Farm Direct",
    description: "Straight from Himalayan farms to your doorstep",
  },
  {
    title: "100% Guarantee",
    description: "No adulteration. Money-back promise.",
  },
] as const;
