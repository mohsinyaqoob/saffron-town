import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AmazonProductGallery } from "@/components/sections/AmazonProductGallery";
import { ProductBuyBox } from "@/components/sections/ProductBuyBox";
import { ProductDetailsAccordion } from "@/components/sections/ProductDetailsAccordion";
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
        {/* Main product area */}
        <div className="bg-background-alt">
          <div className="mx-auto max-w-7xl px-6 lg:px-20 py-6">
            {/* Desktop: gallery + reviews left, buy box right. Mobile: gallery, buy box, reviews at bottom */}
            <div className="grid grid-cols-1 grid-rows-[auto_auto_auto] gap-8 lg:grid-cols-[1fr_380px] lg:grid-rows-[auto_auto] lg:gap-10">
              {/* Left col, row 1 — gallery */}
              <div className="lg:col-start-1 lg:row-start-1">
                <AmazonProductGallery product={product} />
              </div>
              {/* Right col, spans 2 rows — buy box (sticky) */}
              <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
                <ProductBuyBox product={product} />
              </div>
              {/* Left col, row 2 — product details accordions (below gallery on desktop, at bottom on mobile) */}
              <div className="lg:col-start-1 lg:row-start-2">
                <ProductDetailsAccordion product={product} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
