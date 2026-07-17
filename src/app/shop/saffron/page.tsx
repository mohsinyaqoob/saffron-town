import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AmazonProductGallery } from "@/components/sections/AmazonProductGallery";
import { ProductBuyBox } from "@/components/sections/ProductBuyBox";
import { ProductDetailsAccordion } from "@/components/sections/ProductDetailsAccordion";
import { ProductSeoContent } from "@/components/sections/ProductSeoContent";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { TestimonialsWidget } from "@/components/testimonials";
import { SITE_CONFIG } from "@/lib/constants";
import { getDefaultProduct } from "@/lib/product-data";
import { SHOP_FAQS } from "@/lib/shop-faqs";

/** Static product page — built once at deploy, served from CDN */
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const product = getDefaultProduct();
  if (!product) return {};

  const url = `${SITE_CONFIG.url}/shop/saffron`;
  const title = "Buy Kashmiri Mongra Kesar Online — Grade A++ | Saffron Town";
  const description =
    "Buy original Pampore Kashmiri Mongra kesar online (Kashmir's saffron town). Grade A++ Mongra, high crocin, GI-tagged. 1,240+ reviews. Ships across India. Money-back guarantee.";
  const ogImage = product.images?.[0]?.url?.startsWith("http")
    ? product.images[0].url
    : `${SITE_CONFIG.url}${product.images?.[0]?.url || "/images/products/mongra-saffron-1.png"}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      images: [ogImage],
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function SaffronProductPage() {
  const product = getDefaultProduct();
  if (!product) return null;

  const faqs = SHOP_FAQS.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProductJsonLd product={product} />
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 py-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Mongra Saffron", href: "/shop/saffron" },
            ]}
          />
        </div>
        {/* Main product area */}
        <div className="bg-surface-muted/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-20 py-6">
            <div className="grid grid-cols-1 grid-rows-[auto_auto_auto] gap-8 lg:grid-cols-[1fr_380px] lg:grid-rows-[auto_auto] lg:gap-10">
              <div className="lg:col-start-1 lg:row-start-1">
                <AmazonProductGallery product={product} />
              </div>
              <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
                <ProductBuyBox product={product} />
              </div>
              <div className="lg:col-start-1 lg:row-start-2">
                <ProductDetailsAccordion product={product} />
              </div>
            </div>
            <ProductSeoContent />
            <FAQSection faqs={faqs} />
            <div className="mt-16">
              <TestimonialsWidget
                variant="top"
                limit={3}
                title="What Customers Say"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
