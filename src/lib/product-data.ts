import products from "@/data/products.json";
import testimonialsData from "@/data/testimonials.json";

export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  mrp?: number; // Optional M.R.P. for strikethrough display
};

export type ProductPageData = {
  id: string;
  name: string;
  category: string;
  slug: string;
  subtitle: string;
  heroHeadline: string;
  heroSubline: string;
  heroBadge: string;
  description: string;
  description2: string;
  price: number;
  currency: string;
  unit: string;
  stock: number;
  mpn?: string;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  features: string[];
  specifications: Record<string, string>;
  origin: string;
};

/**
 * Live rating + review count derived from our testimonials source of truth.
 * Keeps aggregateRating in Product JSON-LD honest without a separate CMS field.
 */
function computeReviewStats(): { rating: number; reviewCount: number } {
  const rows = testimonialsData as { rating?: number }[];
  const withRating = rows.filter(
    (t) => typeof t.rating === "number" && t.rating > 0,
  );
  const reviewCount = rows.length;
  const rating =
    withRating.length > 0
      ? Number(
          (
            withRating.reduce((s, t) => s + (t.rating ?? 0), 0) /
            withRating.length
          ).toFixed(1),
        )
      : 5;
  return { rating, reviewCount };
}

const REVIEW_STATS = computeReviewStats();

function hydrate(p: ProductPageData): ProductPageData {
  // Only backfill if product didn't ship its own numbers
  if (p.reviewCount > 0 && p.rating > 0) return p;
  return {
    ...p,
    rating: REVIEW_STATS.rating,
    reviewCount: REVIEW_STATS.reviewCount,
  };
}

const VALID_CATEGORIES = ["saffron"] as const;
const CATEGORY_NAMES: Record<string, string> = {
  saffron: "Saffron",
};

export function getProductData(slug: string): ProductPageData | undefined {
  const match = (products as unknown as ProductPageData[]).find(
    (p) => p.slug === slug,
  );
  return match ? hydrate(match) : undefined;
}

export function getProductById(id: string): ProductPageData | undefined {
  const match = (products as unknown as ProductPageData[]).find(
    (p) => p.id === id,
  );
  return match ? hydrate(match) : undefined;
}

export function getDefaultProduct(): ProductPageData | undefined {
  const first = (products as unknown as ProductPageData[])[0];
  return first ? hydrate(first) : undefined;
}

export function getAllProducts(): ProductPageData[] {
  return (products as unknown as ProductPageData[]).map(hydrate);
}

/** Single product page URL - used for all product links */
export const PRODUCT_PAGE_URL = "/shop/saffron";

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_NAMES[category] || category;
}

export function isValidCategory(
  category: string,
): category is (typeof VALID_CATEGORIES)[number] {
  return (VALID_CATEGORIES as readonly string[]).includes(category);
}
