import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { CheckoutLoadingShell } from "@/components/shop/ShopPageLoaders";
import { CheckoutPageContent } from "./CheckoutPageContent";

export default function CheckoutPage() {
  const footer = <Footer />;
  return (
    <Suspense fallback={<CheckoutLoadingShell footer={footer} />}>
      <CheckoutPageContent footer={footer} />
    </Suspense>
  );
}
