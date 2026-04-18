"use client";

import Image from "next/image";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { trackBeginCheckout } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";

export default function CheckoutPage() {
  const { cart, cartTotal } = useShop();

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  const sendOrderMail = () => {
    trackBeginCheckout(cart, cartTotal, "INR");
    const orderLines = cart
      .map(
        (item) =>
          `- ${item.name} (${item.variant.size}) × ${item.quantity}: ${new Intl.NumberFormat("en-IN", { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(item.variant.price * item.quantity)}`,
      )
      .join("\n");
    const body = encodeURIComponent(
      `Order request\n\nTotal: ₹${cartTotal}\n\nItems:\n${orderLines}\n\n---\nPlease confirm availability and share payment details.`,
    );
    window.location.href = `mailto:${SITE_CONFIG.orderEmail}?subject=${encodeURIComponent(`Order request — ${formattedTotal}`)}&body=${body}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-alt text-text-primary">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-20">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Checkout", href: "/checkout" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-20 lg:py-24">
          {cart.length === 0 ? (
            <div className="rounded-[2rem] border border-secondary-border/20 bg-background p-10 text-center">
              <h1 className="font-display text-3xl font-bold text-text-primary">
                Your cart is empty
              </h1>
              <p className="mt-4 text-secondary font-body">
                Add a prebook line from the harvest page, or shop in-stock
                saffron.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/prebook-2026-harvest"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  Prebook 2026 harvest
                </Link>
              </div>
              <p className="mt-4">
                <Link
                  href="/shop/saffron"
                  className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Shop current harvest
                </Link>
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                Checkout
              </h1>
              <p className="mt-3 text-secondary font-body">
                Review your order and send the request to our team by email.
              </p>

              <ul className="mt-10 space-y-6">
                {cart.map((item) => (
                  <li
                    key={item.cartItemId}
                    className="flex gap-4 rounded-2xl border border-secondary-border/15 bg-background p-4"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                      <Image
                        src={item.images[0].url}
                        alt={item.images[0].alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="font-display font-semibold text-text-primary">
                        {item.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {item.variant.size}
                      </p>
                      <p className="mt-1 text-sm text-secondary">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-text-primary">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: item.currency,
                        maximumFractionDigits: 0,
                      }).format(item.variant.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center justify-between border-t border-secondary-border/20 pt-8">
                <span className="font-display text-xl font-bold">Total</span>
                <span className="font-display text-2xl font-bold">
                  {formattedTotal}
                </span>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  type="button"
                  size="lg"
                  className="flex-1 rounded-2xl"
                  onClick={sendOrderMail}
                >
                  Email order request
                </Button>
                <Link
                  href="/cart"
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-secondary-border px-8 py-3.5 text-base font-semibold text-secondary transition-colors hover:bg-surface-muted"
                >
                  Edit cart
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
