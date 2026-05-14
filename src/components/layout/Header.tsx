"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isLinkActive(href: string, pathname: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  if (href.startsWith("/shop") && pathname === "/shop") return true;
  return false;
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { favorites } = useShop();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY < 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparentMode = isHome && isAtTop && !mobileMenuOpen;

  /** Height of main header row (must match Hero top inset). */
  const headerBarH = "5rem";

  return (
    <header
      className={cn(
        "z-50 w-full max-w-full min-w-0 overflow-x-hidden transition-all duration-300",
        "pt-[env(safe-area-inset-top,0px)]",
        isHome ? "fixed left-0 right-0 top-0" : "sticky top-0 left-0 right-0",
        transparentMode
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-background border-b-2 border-secondary-border/50 shadow-sm shadow-dark/5",
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-w-0 w-full max-w-7xl items-center justify-between gap-1.5 sm:gap-2",
          "h-20 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]",
          "sm:pl-6 sm:pr-6 lg:pl-20 lg:pr-20",
        )}
      >
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center overflow-hidden pr-1"
        >
          <Image
            src="/logo-horizon.svg"
            alt={SITE_CONFIG.name}
            width={180}
            height={40}
            unoptimized
            priority
            className={cn(
              "h-8 w-auto max-h-8 max-w-full object-contain object-left transition-[filter] duration-300 sm:h-10 sm:max-h-10 lg:max-w-[200px]",
              transparentMode && "brightness-0 invert",
            )}
            priority
          />
        </Link>

        <nav
          className="hidden lg:flex items-center gap-6 lg:gap-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-body transition-colors",
                  transparentMode
                    ? active
                      ? "font-semibold text-white"
                      : "text-white/90 hover:text-white"
                    : active
                      ? "font-semibold text-primary"
                      : "text-secondary hover:text-text-primary",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-0 sm:gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={cn(
              "lg:hidden shrink-0 p-1.5 transition-colors rounded-md sm:p-2",
              transparentMode
                ? "text-white hover:text-white hover:bg-white/10"
                : "text-secondary hover:text-text-primary hover:bg-surface-muted/50",
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>

          <Link
            href="/favorites"
            className={cn(
              "group relative shrink-0 p-1.5 transition-colors sm:p-2",
              transparentMode
                ? "text-white/85 hover:text-white"
                : "text-secondary hover:text-primary",
            )}
            aria-label="Favorites"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:scale-110"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {favorites.length > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-background-alt">
                {favorites.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 z-30 bg-dark/40 transition-opacity duration-300",
          `top-[calc(env(safe-area-inset-top,0px)+${headerBarH})]`,
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-label="Close menu"
      />

      <div
        className={cn(
          "lg:hidden fixed inset-x-0 z-40 max-w-[100vw] pt-2 pointer-events-none",
          "pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]",
          "sm:pl-4 sm:pr-4",
          `top-[calc(env(safe-area-inset-top,0px)+${headerBarH})]`,
          "transition-all duration-300 ease-out",
          !mobileMenuOpen && "invisible opacity-0",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <nav
          className={cn(
            "pointer-events-auto w-full rounded-xl border border-secondary-border/30 bg-background-alt shadow-xl overflow-y-auto space-y-1 px-6 py-6",
            "max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-5rem-3rem)]",
            "transition-all duration-300 ease-out",
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0",
          )}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-3 px-3 -mx-3 text-base font-body rounded-lg transition-colors",
                  active
                    ? "font-semibold text-primary bg-primary/10"
                    : "text-secondary hover:text-text-primary hover:bg-surface-muted/50",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
