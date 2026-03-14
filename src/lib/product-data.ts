import products from "@/data/products.json";

export type ProductVariant = {
  id: string;
  size: string;
  price: number;
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

const VALID_CATEGORIES = ["saffron", "dry-fruits", "honey", "gifting"] as const;
const CATEGORY_NAMES: Record<string, string> = {
  saffron: "Saffron (Kesar)",
  "dry-fruits": "Dry Fruits",
  honey: "Honey",
  gifting: "Gifting",
};

export function getProductData(slug: string): ProductPageData | undefined {
  return (products as unknown as ProductPageData[]).find((p) => p.slug === slug);
}

export function getAllProducts(): ProductPageData[] {
  return products as unknown as ProductPageData[];
}

export function getProductsByCategory(category: string): ProductPageData[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_NAMES[category] || category;
}

export function isValidCategory(category: string): category is (typeof VALID_CATEGORIES)[number] {
  return VALID_CATEGORIES.includes(category as any);
}
