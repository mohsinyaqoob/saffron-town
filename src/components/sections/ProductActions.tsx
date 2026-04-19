"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { trackAddToCart } from "@/lib/analytics";
import { checkoutHref } from "@/lib/checkout-line";
import type { ProductPageData } from "@/lib/product-data";

interface ProductActionsProps {
  product: ProductPageData;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useShop();

  const goCheckout = () => {
    trackAddToCart({
      id: product.id,
      name: product.name,
      variant: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      currency: product.currency,
    });
    router.push(checkoutHref(product.id, selectedVariant.id, quantity));
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-4 flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-sm text-text-muted font-body uppercase tracking-wider mb-1">
            Premium Price
          </span>
          <span className="font-display text-3xl font-bold text-text-primary">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: product.currency,
              maximumFractionDigits: 0,
            }).format(selectedVariant.price)}
            <span className="text-sm font-medium text-text-muted ml-1">
              / {selectedVariant.size}
            </span>
          </span>
        </div>
        <div className="h-10 w-px bg-secondary-border/20" />
        <div className="flex flex-col max-w-[14rem]">
          {product.reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-1 text-primary/80 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "fill-secondary-border/30 text-secondary-border/30"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-text-muted font-body">
                Based on {product.reviewCount} reviews
              </span>
            </>
          ) : (
            <span className="text-xs text-text-muted font-body leading-relaxed">
              Be among the first—farm-direct Mongra, lab-tested, no inflated
              review counts.
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-secondary-border/20">
        {product.variants.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">
              Select Weight
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                    selectedVariant.id === variant.id
                      ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                      : "border-secondary-border/30 text-secondary hover:border-primary/50"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">
              Quantity
            </h3>
            <div className="flex items-center gap-4 border border-secondary-border/30 rounded-xl px-4 py-2 bg-background">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-text-muted hover:text-primary transition-colors disabled:opacity-50 font-bold px-2"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="font-bold text-base tracking-widest w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-text-muted hover:text-primary transition-colors font-bold px-2"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={goCheckout}
          size="xl"
          className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-6 px-12 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
        >
          Buy now —{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: product.currency,
            maximumFractionDigits: 0,
          }).format(selectedVariant.price * quantity)}
        </Button>
        <Button
          onClick={() => toggleFavorite(product)}
          variant="outline"
          className={`flex-none aspect-square p-0 w-[4.5rem] h-[4.5rem] rounded-full transition-all ${
            isFavorite(product.id)
              ? "border-primary bg-primary/5 text-primary"
              : "border-secondary-border/30 text-secondary hover:bg-surface-muted hover:text-primary"
          }`}
        >
          <svg
            className="h-6 w-6"
            fill={isFavorite(product.id) ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </Button>
      </div>

      <div className="mt-8 flex items-center gap-8 py-6 border-t border-b border-secondary-border/10">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-tighter text-text-primary">
            Guaranteed Pure
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-tighter text-text-primary">
            Farm Direct
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-tighter text-text-primary">
            Fast Delivery
          </span>
        </div>
      </div>
    </div>
  );
}
