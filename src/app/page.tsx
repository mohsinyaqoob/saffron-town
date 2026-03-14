import { Header, Footer } from "@/components/layout";
import {
  Hero,
  TrustBadges,
  ProductGrid,
  BlogSection,
  GuaranteeSection,
  CtaSection,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <ProductGrid />
        <BlogSection />
        <GuaranteeSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
