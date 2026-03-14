import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductView } from "@/components/sections/ProductView";
import { getProductData, getAllProducts } from "@/lib/product-data";
import { SITE_CONFIG } from "@/lib/constants";

type Props = {
  params: Promise<{ category: string; product: string }>;
};

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    category: product.category,
    product: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params;
  const data = getProductData(slug);
  if (!data) return {};

  return {
    title: `${data.name} | ${SITE_CONFIG.name}`,
    description: `${data.subtitle}. ${data.description.slice(0, 120)}...`,
    openGraph: {
      title: `${data.name} | ${SITE_CONFIG.name}`,
      description: data.subtitle,
      images: [data.images[0].url],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { product: slug } = await params;
  const data = getProductData(slug);

  if (!data) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <ProductView product={data as any} />
        
        <section className="bg-surface-muted/30 py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-20">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">Specifications</h2>
                        <div className="grid grid-cols-1 gap-y-4">
                            {Object.entries(data.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b border-secondary-border/20 pb-2">
                                    <span className="text-sm font-medium text-secondary">{key}</span>
                                    <span className="text-sm text-text-primary">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">Why Choose Us?</h2>
                        <ul className="space-y-4">
                            {data.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-secondary">{feature}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
