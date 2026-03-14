import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/sections/ProductCard";
import {
  getProductsByCategory,
  getCategoryDisplayName,
  isValidCategory,
} from "@/lib/product-data";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return [
    { category: "saffron" },
    { category: "dry-fruits" },
    { category: "honey" },
    { category: "gifting" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return {};
  const name = getCategoryDisplayName(category);
  return {
    title: `${name} | ${SITE_CONFIG.name}`,
    description: `Shop our ${name} collection. Fresh harvest, farm-direct from the Himalayas.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!isValidCategory(category)) notFound();

  const products = getProductsByCategory(category);
  const displayName = getCategoryDisplayName(category);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <section className="bg-surface-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <nav className="mb-10 text-sm">
              <Link
                href="/"
                className="text-secondary hover:text-primary transition-colors"
              >
                Home
              </Link>
              <span className="mx-2 text-text-muted">/</span>
              <Link
                href="/#products"
                className="text-secondary hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <span className="mx-2 text-text-muted">/</span>
              <span className="text-text-primary font-medium">{displayName}</span>
            </nav>
            <div className="mb-12">
              <h1 className="font-display text-4xl font-bold text-text-primary lg:text-5xl">
                {displayName}
              </h1>
              <p className="mt-4 text-lg text-secondary font-body max-w-2xl">
                Fresh from this harvest. {displayName} sourced directly from
                Himalayan farms.
              </p>
            </div>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-background-alt border border-secondary-border/20 p-12 text-center">
                <p className="text-secondary font-body">
                  No products in this category yet. Check back soon.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-primary font-semibold hover:underline"
                >
                  Browse our collection
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
