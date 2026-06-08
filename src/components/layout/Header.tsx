"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY < 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const transparentMode = isHome && isAtTop && !drawerOpen;

  return (
    <>
      <header
        className={cn(
          "z-50 w-full max-w-full min-w-0 overflow-x-hidden transition-all duration-300",
          "pt-[env(safe-area-inset-top,0px)]",
          isHome ? "fixed left-0 right-0 top-0" : "sticky top-0 left-0 right-0",
          transparentMode
            ? "bg-transparent border-b border-transparent shadow-none"
            : "bg-background border-b border-secondary-border/30 shadow-sm shadow-dark/5",
        )}
      >
        <div
          className={cn(
            "mx-auto flex min-w-0 w-full max-w-7xl items-center justify-between",
            "h-20 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]",
            "sm:pl-6 sm:pr-6 lg:pl-20 lg:pr-20",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center" aria-label="Saffron Town home">
            <Image
              src="/logo-horizon.svg"
              alt={SITE_CONFIG.name}
              width={180}
              height={40}
              unoptimized
              priority
              className={cn(
                "h-8 w-auto max-h-8 max-w-[150px] object-contain object-left transition-[filter] duration-300 sm:h-9 sm:max-h-9 lg:max-w-[200px]",
                transparentMode && "brightness-0 invert",
              )}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-body transition-colors",
                    transparentMode
                      ? active ? "font-semibold text-white" : "text-white/85 hover:text-white"
                      : active ? "font-semibold text-primary" : "text-secondary hover:text-text-primary",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/shop/saffron"
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
                transparentMode
                  ? "border border-white/30 bg-white/10 text-white hover:bg-white/20"
                  : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20",
              )}
            >
              Shop now
            </Link>
          </div>

          {/* Mobile right-side group: Chat + Hamburger */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">

          {/* Mobile: Live Chat button */}
          <button
            type="button"
            onClick={() => {
              const w = window as unknown as Record<string, unknown>;
              const zoho = w.$zoho as Record<string, unknown> | undefined;
              const salesiq = zoho?.salesiq as Record<string, unknown> | undefined;
              const fw = salesiq?.floatwindow as { open?: () => void } | undefined;
              fw?.open?.();
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors",
              transparentMode
                ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
                : "border border-secondary-border/30 bg-surface-muted text-secondary hover:text-primary",
            )}
            aria-label="Open live chat"
          >
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              transparentMode
                ? "text-white hover:bg-white/10"
                : "text-secondary hover:bg-surface-muted hover:text-text-primary",
            )}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            {drawerOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            )}
          </button>

          </div>{/* end mobile right-side group */}
        </div>
      </header>

      {/* ── Mobile drawer ── */}

      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-dark/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
      />

      {/* Drawer panel — slides in from the right */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-[min(85vw,340px)] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          "pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-secondary-border/15 px-6 py-5">
          <Link href="/" onClick={() => setDrawerOpen(false)} aria-label="Saffron Town home">
            <Image
              src="/logo-horizon.svg"
              alt={SITE_CONFIG.name}
              width={140}
              height={32}
              unoptimized
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-secondary hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, pathname);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base transition-colors",
                      active
                        ? "bg-primary/8 font-semibold text-primary"
                        : "text-text-primary hover:bg-surface-muted",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Shop CTA */}
          <div className="mt-6 px-0">
            <Link
              href="/shop/saffron"
              onClick={() => setDrawerOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              Shop pure saffron →
            </Link>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-secondary-border/15 px-6 py-5 space-y-3">
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.42 2 2 0 0 1 3.69 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span>{SITE_CONFIG.phone}</span>
          </a>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <span>{SITE_CONFIG.email}</span>
          </a>
        </div>
      </div>
    </>
  );
}
