"use client";

import Image from "next/image";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useShop();

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cartTotal);

  return (
    <div className="flex min-h-screen flex-col bg-background-alt text-text-primary">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 pt-6">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
            ]}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-20 py-20 lg:py-32">
          <div className="flex items-end justify-between border-b border-secondary-border/20 pb-8 mb-12">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-5xl">
                Your Shopping Cart
              </h1>
              <p className="mt-4 text-lg text-secondary font-body">
                Authentic Kashmiri products waiting for you.
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-text-muted hover:text-red-500 transition-colors uppercase tracking-widest underline decoration-transparent hover:decoration-red-500 underline-offset-4"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-muted/30 rounded-[3rem] border border-secondary-border/10">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                Your cart is empty
              </h2>
              <p className="text-secondary font-body mb-8 max-w-md">
                It looks like you haven't added any products to your cart yet.
                Discover our premium collection and start shopping.
              </p>
              <Link href="/shop/saffron">
                <Button size="lg" className="rounded-full px-8">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-8">
                {cart.map((item) => {
                  return (
                    <article
                      key={item.cartItemId}
                      className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-background border border-secondary-border/10 shadow-lg shadow-dark/5"
                    >
                      <Link
                        href="/shop/saffron"
                        className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden bg-surface-muted"
                      >
                        <Image
                          src={item.images[0].url}
                          alt={item.images[0].alt}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl font-bold text-text-primary">
                            {item.name}
                          </h3>
                          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                            {item.variant.size}
                          </span>
                        </div>
                        <span className="text-sm font-body text-secondary mb-4">
                          {item.subtitle}
                        </span>
                        <div className="flex items-center gap-4 border border-secondary-border/30 rounded-full px-4 py-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            className="text-text-muted hover:text-primary transition-colors disabled:opacity-50 font-bold"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-bold text-sm tracking-widest">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            className="text-text-muted hover:text-primary transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center sm:items-end justify-between h-full min-h-[120px] pb-2">
                        <div className="text-center sm:text-right mb-4">
                          <p className="font-display text-xl font-bold text-text-primary">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: item.currency,
                              maximumFractionDigits: 0,
                            }).format(item.variant.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-text-muted mt-1 font-body">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: item.currency,
                                maximumFractionDigits: 0,
                              }).format(item.variant.price)}{" "}
                              each
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-xs font-bold text-text-muted hover:text-red-500 transition-colors uppercase tracking-widest underline decoration-secondary-border/30 hover:decoration-red-500 underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <aside>
                <div className="p-8 rounded-[2rem] bg-surface-muted/50 border border-secondary-border/10 shadow-xl shadow-dark/5 sticky top-32">
                  <h2 className="font-display text-2xl font-bold mb-8">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-8 text-sm font-body border-b border-secondary-border/10 pb-8">
                    <div className="flex justify-between">
                      <span className="text-secondary">Subtotal</span>
                      <span className="font-bold text-text-primary">
                        {formattedTotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Shipping</span>
                      <span className="font-bold text-text-primary">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Taxes</span>
                      <span className="font-bold text-text-primary text-xs tracking-widest text-right">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-10">
                    <span className="font-display text-xl font-bold text-text-primary">
                      Total
                    </span>
                    <span className="font-display text-3xl font-bold text-text-primary">
                      {formattedTotal}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full rounded-2xl mb-4 py-5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    onClick={() => {
                      const transactionId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                      trackBeginCheckout(cart, cartTotal, "INR");
                      trackPurchase(cart, cartTotal, transactionId, "INR");
                      const orderLines = cart
                        .map(
                          (item) =>
                            `- ${item.name} (${item.variant.size}) x${item.quantity}: ₹${item.variant.price * item.quantity}`,
                        )
                        .join("\n");
                      const body = encodeURIComponent(
                        `Order Request\n\nTotal: ₹${cartTotal}\n\nItems:\n${orderLines}\n\n---\nPlease confirm availability and share payment details.`,
                      );
                      window.location.href = `mailto:${SITE_CONFIG.orderEmail}?subject=Order%20Request%20-%20₹${cartTotal}&body=${body}`;
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-text-muted text-center flex items-center justify-center gap-2 tracking-widest">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    SSL Secure Checkout
                  </p>
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
