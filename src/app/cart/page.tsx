"use client";

import Image from "next/image";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ShopCartHydratingLayout } from "@/components/shop/ShopPageLoaders";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { trackBeginCheckout } from "@/lib/analytics";

function formatInr(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
    isCartHydrated,
  } = useShop();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = formatInr(cartTotal);

  if (!isCartHydrated) {
    return <ShopCartHydratingLayout />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-20">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-20 lg:py-12">
          <div className="flex flex-col gap-4 border-b border-secondary-border/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Shopping cart
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary font-body sm:text-base">
                {cart.length === 0
                  ? "Browse farm-direct Mongra saffron and add a pack when you are ready."
                  : `${itemCount} item${itemCount === 1 ? "" : "s"} · Review sizes and quantities, then continue to checkout.`}
              </p>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => clearCart()}
                className="self-start text-xs font-bold uppercase tracking-widest text-text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-primary sm:self-auto"
              >
                Clear cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-secondary-border/20 bg-background-alt/80 px-8 py-14 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Your cart is empty
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary font-body">
                Start with a lab-tested pack, or prebook the next harvest—same
                quality promise either way.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/shop/saffron">
                  <Button size="lg" className="w-full rounded-2xl sm:w-auto">
                    Shop saffron
                  </Button>
                </Link>
                <Link href="/prebook-2026-harvest">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl sm:w-auto"
                  >
                    Prebook harvest
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
              <section className="lg:col-span-7" aria-labelledby="cart-items">
                <h2 id="cart-items" className="sr-only">
                  Cart items
                </h2>
                <ul className="space-y-4">
                  {cart.map((item) => {
                    const lineTotal = item.variant.price * item.quantity;
                    return (
                      <li key={item.cartItemId}>
                        <article className="flex gap-4 rounded-2xl border border-secondary-border/20 bg-background-alt p-4 shadow-sm sm:gap-5 sm:p-5">
                          <Link
                            href="/shop/saffron"
                            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted ring-1 ring-secondary-border/15 sm:h-28 sm:w-28"
                          >
                            <Image
                              src={item.images[0].url}
                              alt={item.images[0].alt}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 gap-y-1">
                                <h3 className="font-display text-lg font-bold leading-snug text-text-primary sm:text-xl">
                                  {item.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] uppercase tracking-wider"
                                >
                                  {item.variant.size}
                                </Badge>
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm text-secondary font-body">
                                {item.subtitle}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="inline-flex items-center rounded-full border border-secondary-border/40 bg-background px-1 py-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary disabled:opacity-40"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-0">
                                <p className="font-display text-lg font-bold text-text-primary sm:text-xl">
                                  {formatInr(lineTotal, item.currency)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-text-muted font-body">
                                    {formatInr(
                                      item.variant.price,
                                      item.currency,
                                    )}{" "}
                                    each
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col items-end justify-between">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                              aria-label={`Remove ${item.name}`}
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8">
                  <Link
                    href="/shop/saffron"
                    className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    ← Continue shopping
                  </Link>
                </div>
              </section>

              <aside className="lg:col-span-5">
                <div className="sticky top-28 space-y-6 rounded-3xl border border-secondary-border/20 bg-background-alt p-6 shadow-lg shadow-dark/5 sm:p-8">
                  <h2 className="font-display text-xl font-bold text-text-primary">
                    Order summary
                  </h2>

                  <ul className="space-y-3 border-b border-secondary-border/15 pb-6 text-sm font-body">
                    {cart.map((item) => (
                      <li
                        key={`sum-${item.cartItemId}`}
                        className="flex justify-between gap-3 text-secondary"
                      >
                        <span className="min-w-0 truncate">
                          {item.name}{" "}
                          <span className="text-text-muted">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="shrink-0 font-semibold text-text-primary">
                          {formatInr(
                            item.variant.price * item.quantity,
                            item.currency,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 text-sm font-body">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal</span>
                      <span className="font-semibold text-text-primary">
                        {formattedTotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Shipping</span>
                      <span className="font-semibold text-primary">
                        Free (India)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-secondary-border/15 pt-6">
                    <span className="font-display text-lg font-bold">
                      Estimated total
                    </span>
                    <span className="font-display text-2xl font-bold text-primary">
                      {formattedTotal}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-text-muted font-body">
                    Taxes, if any, are included or confirmed by our team after
                    your order. We will share payment details when we confirm
                    your order.
                  </p>

                  <Link
                    href="/checkout"
                    onClick={() => trackBeginCheckout(cart, cartTotal, "INR")}
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full rounded-2xl shadow-md shadow-primary/20"
                    >
                      Proceed to checkout
                    </Button>
                  </Link>

                  <ul className="space-y-2 text-xs text-text-muted font-body">
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ✓
                      </span>
                      Farm-direct Kashmiri Mongra, lab-tested batches
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ✓
                      </span>
                      Questions?{" "}
                      <Link
                        href="/contact"
                        className="font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        Contact us
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
