import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductActions } from "@/components/sections/ProductActions";
import { ProductGallery } from "@/components/sections/ProductGallery";
import { ProductInfo } from "@/components/sections/ProductInfo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import { getDefaultProduct } from "@/lib/product-data";

/** Static product page — built once at deploy, served from CDN */
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const product = getDefaultProduct();
  if (!product) return {};

  const url = `${SITE_CONFIG.url}/shop/saffron`;
  const title = `${product.name} | ${product.heroBadge} | Fresh Harvest`;
  const description =
    "Premium Kashmiri Mongra saffron. Grade A++ from Pampore. Seed-to-harvest controlled. Fresh harvest only. 1g to 50g. Farm-direct. 100% pure. Money-back guarantee.";
  const ogImage = product.images?.[0]?.url?.startsWith("http")
    ? product.images[0].url
    : `${SITE_CONFIG.url}${product.images?.[0]?.url || "/images/products/mongra-saffron-1.png"}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description:
        "The World's Finest Saffron Stigmas. Grade A++ from Pampore, Kashmir. Fresh harvest. Seed-to-harvest controlled.",
      images: [ogImage],
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Premium Pampore saffron. Fresh harvest. Farm-direct. Seed-to-harvest controlled.",
      images: [ogImage],
    },
  };
}

export default function SaffronProductPage() {
  const product = getDefaultProduct();
  if (!product) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_CONFIG.url },
          { name: "Saffron", url: `${SITE_CONFIG.url}/shop/saffron` },
        ]}
      />
      <Header />
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-background-alt pt-12 pb-20 lg:pt-20 lg:pb-32">
          <div className="container mx-auto max-w-7xl px-6 lg:px-20 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <ProductGallery product={product} />
              <div className="flex flex-col gap-8">
                <ProductInfo product={product} />
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-surface-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
                  Specifications
                </h2>
                <div className="grid grid-cols-1 gap-y-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-secondary-border/20 pb-2"
                      >
                        <span className="text-sm font-medium text-secondary">
                          {key}
                        </span>
                        <span className="text-sm text-text-primary">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">
                  Why Choose Us?
                </h2>
                <ul className="space-y-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
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
