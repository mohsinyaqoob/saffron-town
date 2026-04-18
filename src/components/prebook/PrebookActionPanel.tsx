"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { getUpcomingHarvestSeason } from "@/lib/prebook-season";
import { getProductData, type ProductVariant } from "@/lib/product-data";
import {
  getGridPackVariants,
  MONGRA_SAFFRON_SLUG,
  parsePackGramsFromSize,
} from "@/lib/saffron-pack-variants";

function formatInr(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getPrebookPackImage(size: string) {
  const grams = parsePackGramsFromSize(size);
  if (!grams) return null;
  return `/images/prebook/${grams}grams-pack.png`;
}

export function PrebookActionPanel() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useShop();

  const product = useMemo(() => getProductData(MONGRA_SAFFRON_SLUG), []);
  const season = useMemo(() => getUpcomingHarvestSeason(), []);
  const packVariants = useMemo(
    () => (product ? getGridPackVariants(product) : []),
    [product],
  );

  const [selectedPack, setSelectedPack] = useState<ProductVariant | null>(null);
  const [error, setError] = useState("");

  const stripMongraGridPacksFromCart = () => {
    if (!product || packVariants.length === 0) return;
    const packIds = new Set(packVariants.map((v) => v.id));
    const toRemove = cart
      .filter((i) => i.id === product.id && packIds.has(i.variant.id))
      .map((i) => i.cartItemId);
    for (const cid of toRemove) {
      removeFromCart(cid);
    }
  };

  const handleContinueToCheckout = () => {
    setError("");
    if (!product) {
      setError("Product data is unavailable. Please try again later.");
      return;
    }
    if (!selectedPack) {
      setError("Select a pack size to continue.");
      return;
    }

    stripMongraGridPacksFromCart();
    addToCart(product, selectedPack, 1);
    router.push("/checkout");
  };

  return (
    <div
      id="prebook-action"
      className="mx-auto max-w-3xl rounded-[1.75rem] border border-secondary-border/20 bg-background p-6 shadow-lg shadow-dark/5 sm:p-10"
    >
      <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
        Prebook a pack
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-secondary font-body">
        Select a pack from the{" "}
        <span className="font-semibold text-text-primary">
          same pack sizes and prices as our shop
        </span>
        , then continue to checkout for dispatch in {season.dispatchMonthLabel}.
      </p>

      <div className="mt-8 space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
          Select pack size
        </p>
        {!product || packVariants.length === 0 ? (
          <p className="text-sm text-secondary font-body">
            Pack options are loading or unavailable. Please try the{" "}
            <Link
              href="/shop/saffron"
              className="font-semibold text-primary underline"
            >
              shop page
            </Link>
            .
          </p>
        ) : (
          <fieldset>
            <legend className="sr-only">Saffron pack size</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {packVariants.map((v) => {
                const selected = selectedPack?.id === v.id;
                const packImage = getPrebookPackImage(v.size);
                return (
                  <label
                    key={v.id}
                    className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                      selected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/25"
                        : "border-secondary-border/25 bg-background-alt hover:border-primary/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="prebook-pack"
                      value={v.id}
                      checked={selected}
                      onChange={() => {
                        setSelectedPack(v);
                        setError("");
                      }}
                      className="sr-only"
                    />
                    {packImage ? (
                      <div className="relative aspect-[4/3] w-full bg-surface-muted p-2">
                        <Image
                          src={packImage}
                          alt=""
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 45vw, 180px"
                          aria-hidden
                        />
                      </div>
                    ) : null}
                    <div className="p-3 sm:p-4">
                      <span className="font-display text-lg font-bold text-text-primary">
                        {v.size}
                      </span>
                      <span className="mt-1 block font-body text-sm font-semibold text-primary">
                        {formatInr(v.price, product.currency)}
                      </span>
                      {v.mrp && v.mrp > v.price ? (
                        <span className="mt-0.5 block text-xs text-text-muted line-through">
                          {formatInr(v.mrp, product.currency)}
                        </span>
                      ) : null}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {selectedPack && product ? (
          <p
            className="rounded-xl border border-secondary-border/20 bg-background-alt/80 px-4 py-3 text-sm text-secondary font-body"
            aria-live="polite"
          >
            Selected:{" "}
            <span className="font-semibold text-text-primary">
              {selectedPack.size}
            </span>{" "}
            —{" "}
            <span className="font-semibold text-text-primary">
              {formatInr(selectedPack.price, product.currency)}
            </span>
            . You will confirm address and payment on checkout.
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="button"
          size="lg"
          className="w-full min-h-14 rounded-2xl"
          onClick={handleContinueToCheckout}
          disabled={!product || packVariants.length === 0}
        >
          Continue to checkout
        </Button>
        <p className="text-center text-xs text-text-muted font-body">
          Uses the same product data as /shop/saffron. Other cart lines stay
          until you remove them.
        </p>
      </div>

      <p className="mt-8 border-t border-secondary-border/15 pt-6 text-center text-sm text-secondary font-body">
        Prefer in-stock saffron now?{" "}
        <Link
          href="/shop/saffron"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          Buy current harvest
        </Link>
      </p>
    </div>
  );
}
