import products from "@/data/products.json";

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
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  features: string[];
  specifications: Record<string, string>;
  origin: string;
};

const VALID_CATEGORIES = ["saffron"] as const;
const CATEGORY_NAMES: Record<string, string> = {
  saffron: "Saffron",
};

export function getProductData(slug: string): ProductPageData | undefined {
  return (products as unknown as ProductPageData[]).find(
    (p) => p.slug === slug,
  );
}

export function getDefaultProduct(): ProductPageData | undefined {
  return (products as unknown as ProductPageData[])[0];
}

export function getAllProducts(): ProductPageData[] {
  return products as unknown as ProductPageData[];
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
