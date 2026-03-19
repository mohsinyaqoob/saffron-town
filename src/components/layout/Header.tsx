"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, favorites } = useShop();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-background sticky top-0 z-50 border-b-2 border-secondary-border/50 shadow-sm shadow-dark/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-horizon.svg"
            alt={SITE_CONFIG.name}
            width={180}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav
          className="hidden lg:flex items-center gap-6 lg:gap-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-body transition-colors",
                link.href === "/"
                  ? "font-medium text-text-primary"
                  : "text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-surface-muted/50"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>

          <Link
            href="/favorites"
            className="group relative p-2 text-secondary transition-colors hover:text-primary"
            aria-label="Favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {favorites.length > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-background-alt">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="group relative p-2 text-secondary transition-colors hover:text-primary"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute right-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-background-alt">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 top-20 bg-dark/40 z-30 transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Close menu"
      />

      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-20 z-40 pt-2 px-4 pointer-events-none",
          "transition-all duration-300 ease-out",
          !mobileMenuOpen && "invisible opacity-0"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <nav
          className={cn(
            "pointer-events-auto w-full rounded-xl border border-secondary-border/30 bg-background-alt shadow-xl overflow-y-auto max-h-[calc(100vh-6rem)] px-6 py-6 space-y-1",
            "transition-all duration-300 ease-out",
            mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          )}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-3 -mx-3 text-base font-body text-secondary hover:text-text-primary hover:bg-surface-muted/50 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
