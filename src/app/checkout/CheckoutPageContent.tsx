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
import { loadRazorpay } from "@/lib/razorpay-loader";
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
  const [paymentStep, setPaymentStep] = useState<
    "idle" | "creating" | "modal" | "verifying"
  >("idle");
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

    const orderItems = [
      {
        productId: line.id,
        variantId: line.variant.id,
        quantity: line.quantity,
        ...(line.variant.grams != null ? { grams: line.variant.grams } : {}),
      },
    ];

    // ── Step 1: Create Razorpay order + save PENDING order to DB ──
    setPaymentStep("creating");
    const createRes = await fetch("/api/razorpay/create-order", {
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
        items: orderItems,
      }),
    });
    const createPayload = (await createRes.json().catch(() => ({}))) as {
      error?: string;
      orderId?: string;
      razorpayOrderId?: string;
      amount?: number;
      currency?: string;
    };
    if (!createRes.ok || !createPayload.razorpayOrderId) {
      setPaymentStep("idle");
      setError("root", {
        message:
          createPayload.error ?? "Could not initiate payment. Please try again.",
      });
      return;
    }

    const pendingOrderId = createPayload.orderId; // may be undefined if DB write failed

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    // ── Step 2: Ensure Razorpay SDK is loaded, then open modal ──
    try {
      await loadRazorpay();
    } catch {
      setPaymentStep("idle");
      setError("root", {
        message:
          "Could not load the payment window. Please check your internet connection and try again.",
      });
      return;
    }
    setPaymentStep("modal");

    const rzp = new window.Razorpay({
      key: keyId ?? "",
      amount: createPayload.amount ?? cartTotal * 100,
      currency: createPayload.currency ?? "INR",
      name: "Saffron Town",
      description: "Grade A++ Kashmiri Mongra Kesar",
      image: "/logo-horizon.svg",
      order_id: createPayload.razorpayOrderId,
      prefill: {
        name: data.name,
        email: data.email.trim().toLowerCase(),
        contact: data.phone,
      },
      theme: { color: "#9a2425" },
      modal: {
        ondismiss: () => {
          setPaymentStep("idle");
          // Clean up the PENDING order so it doesn't appear as a ghost in the dashboard
          if (pendingOrderId) {
            fetch("/api/razorpay/cancel-pending", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: pendingOrderId, razorpayOrderId: createPayload.razorpayOrderId }),
            }).catch(() => {});
          }
        },
      },
      handler: async (response) => {
        // ── Step 3: Verify payment + mark order PAID ──
        setPaymentStep("verifying");
        const verifyRes = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Fast path: orderId lets verify-payment update the PENDING order
            ...(pendingOrderId ? { orderId: pendingOrderId } : {}),
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            // Fallback fields used only when no orderId (create-order DB write failed)
            customerName: data.name,
            phone: data.phone,
            email: data.email.trim().toLowerCase(),
            pincode: data.pincode.trim(),
            deliveryAddress: data.deliveryAddress.trim(),
            heardAboutUs: data.heardAboutUs,
            notes: data.notes || undefined,
            items: orderItems,
          }),
        });
        const verifyPayload = (await verifyRes.json().catch(() => ({}))) as {
          error?: string;
          id?: string;
          receipt?: string;
        };
        if (!verifyRes.ok || !verifyPayload.id) {
          setPaymentStep("idle");
          setError("root", {
            message:
              verifyPayload.error ??
              "Payment received but order could not be saved. Please contact support with your Razorpay payment ID.",
          });
          return;
        }
        const receipt = verifyPayload.receipt ?? "";
        setRedirectingAfterOrder(true);
        const q = new URLSearchParams();
        if (receipt) q.set("receipt", receipt);
        router.replace(
          `/orders/${encodeURIComponent(verifyPayload.id)}/success${q.toString() ? `?${q}` : ""}`,
        );
      },
    });

    rzp.on("payment.failed", (response) => {
      setPaymentStep("idle");
      setError("root", {
        message:
          response.error?.description ??
          "Payment failed. Please try again or use a different payment method.",
      });
      // Clean up the PENDING order on payment failure too
      if (pendingOrderId) {
        fetch("/api/razorpay/cancel-pending", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: pendingOrderId, razorpayOrderId: createPayload.razorpayOrderId }),
        }).catch(() => {});
      }
    });

    rzp.open();
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
                  Fill in your delivery details and pay securely online. Your order is confirmed instantly after payment.
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
                  <div className="sticky top-28 space-y-5 rounded-3xl border border-secondary-border/20 bg-background-alt p-6 shadow-lg shadow-dark/5 sm:p-8">
                    <h2 className="font-display text-xl font-bold text-text-primary">
                      Payment
                    </h2>

                    {/* Payment method selector */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pay Online — active */}
                      <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 p-4">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            Pay Online
                          </p>
                          <p className="text-[10px] text-secondary font-body">
                            Cards, UPI, Netbanking
                          </p>
                        </div>
                      </div>
                      {/* COD — disabled */}
                      <div className="flex items-center gap-3 rounded-xl border border-secondary-border/20 bg-surface-muted/40 p-4 opacity-60">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-secondary-border/40">
                          <div className="h-2 w-2 rounded-full bg-transparent" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            Cash on Delivery
                          </p>
                          <p className="text-[10px] text-secondary font-body">
                            Not available
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 font-body border border-amber-100">
                      We are currently accepting <strong>prepaid orders only</strong>. COD is not available at this time.
                    </p>

                    {/* Order summary */}
                    <div className="space-y-2 border-t border-secondary-border/15 pt-4 text-sm font-body">
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

                    <div className="flex items-center justify-between border-t border-secondary-border/15 pt-4">
                      <span className="font-display text-lg font-bold">
                        Total
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">
                        {formattedTotal}
                      </span>
                    </div>

                    {(errors.root || hasFieldErrors) && (
                      <div
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900 font-body"
                        role="alert"
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
                      disabled={paymentStep !== "idle"}
                      aria-busy={paymentStep !== "idle"}
                    >
                      {paymentStep === "creating" ? (
                        <>
                          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden />
                          <span>Preparing payment…</span>
                        </>
                      ) : paymentStep === "modal" ? (
                        <>
                          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden />
                          <span>Payment window open…</span>
                        </>
                      ) : paymentStep === "verifying" ? (
                        <>
                          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden />
                          <span>Confirming payment…</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                          </svg>
                          Pay {formattedTotal} now
                        </>
                      )}
                    </Button>

                    <Link
                      href={PRODUCT_PAGE_URL}
                      className="flex min-h-10 w-full items-center justify-center rounded-2xl border border-secondary-border/40 text-sm font-semibold text-secondary transition-colors hover:bg-surface-muted"
                    >
                      Back to shop
                    </Link>

                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-text-muted font-body">
                      <svg className="h-3 w-3 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect width="11" height="11" x="3" y="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Secured by Razorpay — 256-bit SSL encryption
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
