"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { trackAddToCart } from "@/lib/analytics";
import type { ProductPageData, ProductVariant } from "@/lib/product-data";

export interface CartItem extends Omit<ProductPageData, "price"> {
  cartItemId: string;
  variant: ProductVariant;
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  favorites: ProductPageData[];
  addToCart: (
    product: ProductPageData,
    variant: ProductVariant,
    quantity?: number,
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleFavorite: (product: ProductPageData) => void;
  isFavorite: (productId: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<ProductPageData[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("saffrontown_cart");
    const savedFavorites = localStorage.getItem("saffrontown_favorites");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    setMounted(true);
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("saffrontown_cart", JSON.stringify(cart));
      localStorage.setItem("saffrontown_favorites", JSON.stringify(favorites));
    }
  }, [cart, favorites, mounted]);

  const addToCart = (
    product: ProductPageData,
    variant: ProductVariant,
    quantity: number = 1,
  ) => {
    const cartItemId = `${product.id}-${variant.id}`;

    trackAddToCart({
      id: product.id,
      name: product.name,
      variant: variant.size,
      price: variant.price,
      quantity,
      currency: product.currency,
    });

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      // Omit original price from cart item to force using variant price
      const { price, ...productWithoutPrice } = product;
      return [
        ...prev,
        { ...productWithoutPrice, cartItemId, variant, quantity },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (product: ProductPageData) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId: string) =>
    favorites.some((item) => item.id === productId);

  const cartTotal = cart.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0,
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleFavorite,
        isFavorite,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
