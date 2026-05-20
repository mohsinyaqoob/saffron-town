"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  type FieldErrors,
  type Resolver,
  useForm,
} from "react-hook-form";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { HearAboutCombobox } from "@/components/checkout/HearAboutCombobox";
import { Header } from "@/components/layout/Header";
import { CheckoutOrderRedirectLayout } from "@/components/shop/ShopPageLoaders";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { trackBeginCheckout } from "@/lib/analytics";
import {
  type CheckoutFormValues,
  checkoutFormSchema,
} from "@/lib/checkout-form-schema";
import { parseCheckoutQuery, resolveCheckoutLine } from "@/lib/checkout-line";
import { PRODUCT_PAGE_URL } from "@/lib/product-data";
import { cn } from "@/lib/utils";

function formatInr(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const fieldErrorClass =
  "border-red-400/80 ring-2 ring-red-200/60 focus:border-red-400 focus:ring-red-200/80";

export function CheckoutPageContent({ footer }: { footer: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const line = useMemo(() => {
    const parsed = parseCheckoutQuery(searchParams);
    if (!parsed.ok) return null;
    return resolveCheckoutLine(parsed);
  }, [searchParams]);

  const lines = line ? [line] : [];
  const cartTotal = line
    ? line.variant.price * line.quantity
    : 0; /* bulk: price is line total, quantity 1 */

  const [redirectingAfterOrder, setRedirectingAfterOrder] = useState(false);
  const lastBeginCheckoutSig = useRef("");

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema) as Resolver<CheckoutFormValues>,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      pincode: "",
      deliveryAddress: "",
      heardAboutUs: "",
      notes: "",
    },
  });

  const formattedTotal = formatInr(cartTotal);
  const itemCount = line ? line.quantity : 0;
  const subtotalSummary =
    line && line.variant.grams != null
      ? `1 line · ${line.variant.grams}g saffron`
      : itemCount === 1
        ? "1 item"
        : `${itemCount} items`;

  useEffect(() => {
    if (!line) return;
    const sig = `${cartTotal}|${line.cartItemId}:${line.quantity}`;
    if (lastBeginCheckoutSig.current === sig) return;
    lastBeginCheckoutSig.current = sig;
    trackBeginCheckout([line], cartTotal, "INR");
  }, [line, cartTotal]);

  async function onSubmit(data: CheckoutFormValues) {
    clearErrors("root");
    if (!line) {
      setError("root", {
        message:
          "Your checkout session is missing. Go back to the shop and use Buy now.",
      });
      return;
    }
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: data.name,
        phone: data.phone,
        email: data.email.trim().toLowerCase(),
        pincode: data.pincode.trim(),
        deliveryAddress: data.deliveryAddress.trim(),
        heardAboutUs: data.heardAboutUs,
        notes: data.notes || undefined,
        items: [
          {
            productId: line.id,
            variantId: line.variant.id,
            quantity: line.quantity,
            ...(line.variant.grams != null
              ? { grams: line.variant.grams }
              : {}),
          },
        ],
      }),
    });
    const payload = (await res.json().catch(() => ({}))) as {
      error?: string;
      id?: string;
      receipt?: string;
    };
    if (!res.ok) {
      setError("root", {
        message: payload.error ?? "Something went wrong. Please try again.",
      });
      return;
    }
    if (!payload.id) {
      setError("root", {
        message: "Order was not saved. Please try again.",
      });
      return;
    }
    const receipt = payload.receipt ?? "";
    setRedirectingAfterOrder(true);
    const q = new URLSearchParams();
    if (receipt) q.set("receipt", receipt);
    const successPath = `/orders/${encodeURIComponent(payload.id)}/success${q.toString() ? `?${q}` : ""}`;
    window.setTimeout(() => {
      router.replace(successPath);
    }, 0);
  }

  const onInvalidSubmit = (submitErrors: FieldErrors<CheckoutFormValues>) => {
    const order: (keyof CheckoutFormValues)[] = [
      "name",
      "phone",
      "email",
      "pincode",
      "deliveryAddress",
      "heardAboutUs",
      "notes",
    ];
    const first = order.find((name) => submitErrors[name]);
    if (first) {
      setFocus(first);
      requestAnimationFrame(() => {
        const el = document.getElementById(`checkout-field-${first}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  };

  const inputBaseClass =
    "mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 placeholder:text-text-muted focus:ring-2";

  const hasFieldErrors =
    errors.name ||
    errors.phone ||
    errors.email ||
    errors.pincode ||
    errors.deliveryAddress ||
    errors.heardAboutUs ||
    errors.notes;

  if (redirectingAfterOrder) {
    return <CheckoutOrderRedirectLayout footer={footer} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-20">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Shop", href: PRODUCT_PAGE_URL },
              { label: "Checkout", href: "/checkout" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-20 lg:py-12">
          {!line ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-secondary-border/20 bg-background-alt/80 px-8 py-14 text-center shadow-sm">
              <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                Nothing to check out yet
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-secondary font-body">
                Choose a pack on the shop page (or prebook), then tap{" "}
                <strong className="text-text-primary">Buy now</strong> to open
                checkout with your selection.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href={PRODUCT_PAGE_URL}>
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
            <>
              <div className="border-b border-secondary-border/15 pb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Secure checkout
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                  Checkout
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary font-body sm:text-base">
                  Review your order, add delivery details, then place the order.
                  We will reach out with payment and dispatch options.
                </p>
              </div>

              <form
                noValidate
                onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
                className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12"
              >
                <section
                  className="lg:col-span-7"
                  aria-labelledby="checkout-review"
                >
                  <h2
                    id="checkout-review"
                    className="font-display text-lg font-bold text-text-primary"
                  >
                    Order review
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {lines.map((item) => (
                      <li key={item.cartItemId}>
                        <div className="flex gap-4 rounded-2xl border border-secondary-border/20 bg-background-alt p-4 sm:p-5">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted ring-1 ring-secondary-border/10 sm:h-24 sm:w-24">
                            <Image
                              src={item.images[0].url}
                              alt={item.images[0].alt}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-display font-bold text-text-primary">
                                {item.name}
                              </p>
                              <Badge
                                variant="outline"
                                className="px-2 py-0.5 text-[9px]"
                              >
                                {item.variant.size}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-1 text-xs text-secondary font-body">
                              {item.subtitle}
                            </p>
                            <p className="mt-2 text-xs text-text-muted font-body">
                              {item.variant.grams != null ? (
                                <>
                                  Net weight:{" "}
                                  <span className="font-semibold text-text-primary">
                                    {item.variant.grams}g
                                  </span>
                                </>
                              ) : (
                                <>
                                  Qty{" "}
                                  <span className="font-semibold text-text-primary">
                                    {item.quantity}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-display text-base font-bold text-text-primary sm:text-lg">
                              {formatInr(
                                item.variant.price * item.quantity,
                                item.currency,
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 rounded-2xl border border-secondary-border/20 bg-surface-muted/30 p-5 sm:p-6">
                    <h3 className="font-display text-base font-bold text-text-primary">
                      Your details
                    </h3>
                    <p className="mt-1 text-xs text-text-muted font-body">
                      We use this for delivery updates and order confirmation.
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div id="checkout-field-name" className="sm:col-span-1">
                        <label
                          className="block text-sm font-semibold text-text-primary font-body"
                          htmlFor="checkout-input-name"
                        >
                          Name
                          <span className="text-red-600" aria-hidden>
                            {" "}
                            *
                          </span>
                          <input
                            id="checkout-input-name"
                            type="text"
                            autoComplete="name"
                            aria-invalid={errors.name ? true : undefined}
                            aria-describedby={
                              errors.name ? "err-name" : undefined
                            }
                            className={cn(
                              inputBaseClass,
                              "border-secondary-border/40",
                              errors.name && fieldErrorClass,
                            )}
                            placeholder="Full name"
                            {...register("name")}
                          />
                        </label>
                        {errors.name && (
                          <p
                            id="err-name"
                            className="mt-1.5 text-xs text-red-700 font-body"
                            role="alert"
                          >
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div id="checkout-field-phone" className="sm:col-span-1">
                        <label
                          className="block text-sm font-semibold text-text-primary font-body"
                          htmlFor="checkout-input-phone"
                        >
                          Phone
                          <span className="text-red-600" aria-hidden>
                            {" "}
                            *
                          </span>
                          <input
                            id="checkout-input-phone"
                            type="tel"
                            autoComplete="tel"
                            aria-invalid={errors.phone ? true : undefined}
                            aria-describedby={
                              errors.phone ? "err-phone" : undefined
                            }
                            className={cn(
                              inputBaseClass,
                              "border-secondary-border/40",
                              errors.phone && fieldErrorClass,
                            )}
                            placeholder="WhatsApp / mobile"
                            {...register("phone")}
                          />
                        </label>
                        {errors.phone && (
                          <p
                            id="err-phone"
                            className="mt-1.5 text-xs text-red-700 font-body"
                            role="alert"
                          >
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div id="checkout-field-email" className="sm:col-span-1">
                        <label
                          className="block text-sm font-semibold text-text-primary font-body"
                          htmlFor="checkout-input-email"
                        >
                          Email
                          <span className="text-red-600" aria-hidden>
                            {" "}
                            *
                          </span>
                          <input
                            id="checkout-input-email"
                            type="email"
                            autoComplete="email"
                            aria-invalid={errors.email ? true : undefined}
                            aria-describedby={
                              errors.email ? "err-email" : undefined
                            }
                            className={cn(
                              inputBaseClass,
                              "border-secondary-border/40",
                              errors.email && fieldErrorClass,
                            )}
                            placeholder="you@example.com"
                            {...register("email")}
                          />
                        </label>
                        {errors.email && (
                          <p
                            id="err-email"
                            className="mt-1.5 text-xs text-red-700 font-body"
                            role="alert"
                          >
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div
                        id="checkout-field-pincode"
                        className="sm:col-span-1"
                      >
                        <label
                          className="block text-sm font-semibold text-text-primary font-body"
                          htmlFor="checkout-input-pincode"
                        >
                          PIN code
                          <span className="text-red-600" aria-hidden>
                            {" "}
                            *
                          </span>
                          <input
                            id="checkout-input-pincode"
                            type="text"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            maxLength={6}
                            aria-invalid={errors.pincode ? true : undefined}
                            aria-describedby={
                              errors.pincode ? "err-pincode" : undefined
                            }
                            className={cn(
                              inputBaseClass,
                              "border-secondary-border/40",
                              errors.pincode && fieldErrorClass,
                            )}
                            placeholder="6 digits"
                            {...register("pincode")}
                          />
                        </label>
                        {errors.pincode && (
                          <p
                            id="err-pincode"
                            className="mt-1.5 text-xs text-red-700 font-body"
                            role="alert"
                          >
                            {errors.pincode.message}
                          </p>
                        )}
                      </div>
                      <div
                        id="checkout-field-deliveryAddress"
                        className="sm:col-span-2"
                      >
                        <label
                          className="block text-sm font-semibold text-text-primary font-body"
                          htmlFor="checkout-input-address"
                        >
                          Delivery address
                          <span className="text-red-600" aria-hidden>
                            {" "}
                            *
                          </span>
                          <textarea
                            id="checkout-input-address"
                            rows={3}
                            autoComplete="street-address"
                            aria-invalid={
                              errors.deliveryAddress ? true : undefined
                            }
                            aria-describedby={
                              errors.deliveryAddress
                                ? "err-deliveryAddress"
                                : undefined
                            }
                            className={cn(
                              inputBaseClass,
                              "resize-none border-secondary-border/40",
                              errors.deliveryAddress && fieldErrorClass,
                            )}
                            placeholder="Building, street, area, city, state"
                            {...register("deliveryAddress")}
                          />
                        </label>
                        {errors.deliveryAddress && (
                          <p
                            id="err-deliveryAddress"
                            className="mt-1.5 text-xs text-red-700 font-body"
                            role="alert"
                          >
                            {errors.deliveryAddress.message}
                          </p>
                        )}
                      </div>
                      <div
                        id="checkout-field-heardAboutUs"
                        className="sm:col-span-2"
                      >
                        <Controller
                          name="heardAboutUs"
                          control={control}
                          render={({ field }) => (
                            <HearAboutCombobox
                              ref={field.ref}
                              id="checkout-input-heard"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              error={errors.heardAboutUs?.message}
                              disabled={isSubmitting}
                              inputClassName={cn(
                                inputBaseClass,
                                "border-secondary-border/40",
                                errors.heardAboutUs && fieldErrorClass,
                              )}
                            />
                          )}
                        />
                      </div>
                      <div id="checkout-field-notes" className="sm:col-span-2">
                        <label
                          className="block text-sm font-semibold text-text-primary font-body"
                          htmlFor="checkout-input-notes"
                        >
                          Order notes
                          <textarea
                            id="checkout-input-notes"
                            rows={3}
                            className={cn(
                              inputBaseClass,
                              "resize-none border-secondary-border/40",
                              errors.notes && fieldErrorClass,
                            )}
                            placeholder="Gifting, preferred delivery window, batch questions…"
                            {...register("notes")}
                          />
                        </label>
                        {errors.notes && (
                          <p
                            className="mt-1.5 text-xs text-red-700 font-body"
                            role="alert"
                          >
                            {errors.notes.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <aside className="lg:col-span-5">
                  <div className="sticky top-28 space-y-6 rounded-3xl border border-secondary-border/20 bg-background-alt p-6 shadow-lg shadow-dark/5 sm:p-8">
                    <h2 className="font-display text-xl font-bold text-text-primary">
                      Payment & next steps
                    </h2>
                    <p className="text-sm leading-relaxed text-secondary font-body">
                      We confirm every order manually. After you place this
                      order, our team will reply with an invoice or UPI details
                      and expected dispatch date.
                    </p>

                    <div className="space-y-2 border-t border-secondary-border/15 pt-6 text-sm font-body">
                      <div className="flex justify-between text-secondary">
                        <span>Subtotal ({subtotalSummary})</span>
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
                        Total
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">
                        {formattedTotal}
                      </span>
                    </div>

                    {(errors.root || hasFieldErrors) && (
                      <div
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 font-body"
                        role="status"
                      >
                        {errors.root ? (
                          <p>{errors.root.message}</p>
                        ) : (
                          <p>
                            Please complete the required fields in{" "}
                            <strong>Your details</strong> above.
                          </p>
                        )}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-3 rounded-2xl shadow-md shadow-primary/20"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
                            aria-hidden
                          />
                          <span>Placing order…</span>
                        </>
                      ) : (
                        "Place order"
                      )}
                    </Button>

                    <Link
                      href={PRODUCT_PAGE_URL}
                      className="flex min-h-11 w-full items-center justify-center rounded-2xl border border-secondary-border/40 text-sm font-semibold text-secondary transition-colors hover:bg-surface-muted"
                    >
                      Back to shop
                    </Link>

                    <p className="text-center text-[11px] leading-relaxed text-text-muted font-body">
                      No payment is taken on this website. Prices are confirmed
                      from our catalog when you submit.
                    </p>
                  </div>
                </aside>
              </form>
            </>
          )}
        </div>
      </main>
      {footer}
    </div>
  );
}
