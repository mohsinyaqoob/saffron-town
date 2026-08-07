import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { CheckoutLoadingShell } from "@/components/shop/ShopPageLoaders";
import {
  getFreedomSaleEndsAt,
  isFreedomSaleEnabled,
  isSaleLive,
} from "@/lib/freedom-sale";
import { CheckoutPageContent } from "./CheckoutPageContent";

/**
 * Checkout is rendered per-request so the Freedom Sale flag is read live —
 * turning the promotion off takes effect on the next page load, with no
 * redeploy. (The product page is `force-static`, so its banner is baked at
 * build time; pricing is never stale because the payment routes re-read the
 * flag on every request.)
 */
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const footer = <Footer />;
  const saleEndsAt = getFreedomSaleEndsAt();
  const saleEnabled = isFreedomSaleEnabled() && isSaleLive(saleEndsAt);

  return (
    <Suspense fallback={<CheckoutLoadingShell footer={footer} />}>
      <CheckoutPageContent
        footer={footer}
        saleEnabled={saleEnabled}
        saleEndsAt={saleEndsAt}
      />
    </Suspense>
  );
}
