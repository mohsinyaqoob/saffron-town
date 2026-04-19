"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ProductPageData } from "@/lib/product-data";

interface ShopContextType {
  favorites: ProductPageData[];
  toggleFavorite: (product: ProductPageData) => void;
  isFavorite: (productId: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<ProductPageData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("saffrontown_favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("saffrontown_favorites", JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

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

  return (
    <ShopContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
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
