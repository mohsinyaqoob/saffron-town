export type Product = (typeof PRODUCTS)[number];

export const SITE_CONFIG = {
  name: "Saffron Town",
  tagline: "Always the most recent harvest.",
  url: "https://saffrontown.com",
  description: "Premium Kashmiri Saffron, Almonds, Walnuts & Honey. Only the current harvest. Farm-direct from the Himalayas. Money-back guarantee.",
  keywords: [
    "Kashmiri saffron",
    "premium saffron",
    "fresh harvest saffron",
    "current harvest",
    "almonds",
    "walnuts",
    "raw honey",
    "farm direct",
    "Himalayan products",
  ],
} as const;

export const SHOP_NAV_ITEMS = [
  {
    category: "Saffron (Kesar)",
    href: "/shop/saffron/mongra-saffron",
    description: "Current harvest — Mongra & Lacha grades",
    items: [
      { label: "Mongra Saffron", href: "/shop/saffron/mongra-saffron", desc: "Pure stigmas only — highest grade, dark red, most potent" },
      { label: "Lacha Saffron", href: "/shop/saffron/lacha-saffron", desc: "Stigma + style — mid-grade, slightly lighter" },
    ],
  },
  {
    category: "Dry Fruits",
    href: "/shop/dry-fruits/mamra-almonds",
    description: "Premium walnuts, almonds, apricots & more",
    items: [
      { label: "Walnuts (Akhrot)", href: "/shop/dry-fruits/walnut-kernels", desc: "Premium Snow White Kernels" },
      { label: "Almonds (Badam)", href: "/shop/dry-fruits/mamra-almonds", desc: "Kashmiri Mamra — highest oil content" },
    ],
  },
  {
    category: "Honey",
    href: "/shop/honey/saffron-honey",
    description: "Raw, unprocessed — farm-direct from the Himalayas",
    items: [
      { label: "Saffron Honey", href: "/shop/honey/saffron-honey", desc: "Saffron-infused — premium, gifting favourite" },
      { label: "Multiflora Honey", href: "/shop/honey/multiflora-honey", desc: "Raw, organic mountain honey" },
    ],
  },
] as const;

export const GIFTING_NAV_ITEMS = [
  { label: "Luxury Saffron Box", href: "/shop/gifting/luxury-saffron-box", desc: "Saffron + saffron honey + almonds" },
  { label: "Royal Kashmir Hamper", href: "/shop/gifting/royal-kashmir-hamper", desc: "Premium assortment — walnuts, almonds, saffron, honey" },
] as const;

/* Main nav: Home | Shop ▼ | Gifting ▼ | Our Story | Blog | Contact */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { type: "dropdown" as const, label: "Shop", items: SHOP_NAV_ITEMS },
  { type: "dropdown" as const, label: "Gifting", items: GIFTING_NAV_ITEMS },
  { href: "/our-story", label: "Our Story" },
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

export const PRODUCTS = [
  {
    id: "saffron",
    title: "Kashmiri Saffron",
    subtitle: "Finest-grade threads from Kashmir valleys",
    price: "₹2,499",
    priceFrom: true,
    rating: 4.2,
    reviewCount: "1.4k",
    sizes: ["1g", "2g", "5g", "10g"],
    href: "/shop/saffron",
    image: "https://images.unsplash.com/photo-1608797178976-1a275d1f2a02?w=560&q=80",
  },
  {
    id: "almonds",
    title: "Premium Almonds",
    subtitle: "Crunchy, nutrient-rich from Himalayan orchards",
    price: "₹899",
    priceFrom: true,
    rating: 4.5,
    reviewCount: "2.1k",
    sizes: ["1kg", "2kg", "3kg"],
    href: "/shop/almonds",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=560&q=80",
  },
  {
    id: "walnuts",
    title: "Walnuts",
    subtitle: "Fresh kernels, packed with omega-3",
    price: "₹749",
    priceFrom: true,
    rating: 4.3,
    reviewCount: "1.8k",
    sizes: ["1kg", "2kg", "3kg"],
    href: "/shop/walnuts",
    image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f2?w=560&q=80",
  },
  {
    id: "honey",
    title: "Raw Honey",
    subtitle: "Pure, unfiltered from mountain apiaries",
    price: "₹599",
    priceFrom: true,
    rating: 4.7,
    reviewCount: "3.2k",
    sizes: ["500g", "1kg"],
    href: "/shop/honey",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=560&q=80",
  },
] as const;


