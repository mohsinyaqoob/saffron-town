"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/sections/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FavoritesPage() {
  const { favorites } = useShop();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="mb-12 border-b border-secondary-border/20 pb-8 flex items-end justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-5xl">
                Your Collection
              </h1>
              <p className="mt-4 text-lg text-secondary font-body">
                Curated favorites from the Himalayas.
              </p>
            </div>
            <span className="text-secondary font-bold text-sm tracking-widest uppercase">
                {favorites.length} Items
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-muted/30 rounded-[3rem] border border-secondary-border/10">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                 <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">No favorites yet</h2>
              <p className="text-secondary font-body mb-8 max-w-md">
                You haven't added any products to your collection. Discover our pure Kashmiri saffron and premium dry fruits.
              </p>
              <Link href="/">
                <Button size="lg" className="rounded-full px-8">Discover Saffron Town</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
