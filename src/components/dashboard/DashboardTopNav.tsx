"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const MORE_HREFS = ["/dashboard/products", "/dashboard/settings"] as const;

function linkClass(active: boolean) {
  return [
    "rounded-lg px-3 py-2 text-sm font-semibold font-body transition-colors",
    active
      ? "bg-primary/12 text-primary"
      : "text-secondary hover:bg-surface-muted hover:text-text-primary",
  ].join(" ");
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active =
    href === "/dashboard"
      ? pathname === "/dashboard" || pathname === "/dashboard/"
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={linkClass(active)}>
      {children}
    </Link>
  );
}

export function DashboardTopNav() {
  const pathname = usePathname();
  const moreActive = MORE_HREFS.some(
    (h) => pathname === h || pathname.startsWith(`${h}/`),
  );

  return (
    <nav
      className="flex flex-wrap items-center gap-1 sm:gap-0.5"
      aria-label="Dashboard sections"
    >
      <NavLink href="/dashboard">Orders</NavLink>
      <NavLink href="/dashboard/customers">Customers</NavLink>
      <NavLink href="/dashboard/invoices">Invoices</NavLink>
      <NavLink href="/dashboard/bulk-enquiries">Bulk leads</NavLink>
      <details className="relative">
        <summary
          className={[
            "cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-semibold font-body transition-colors [&::-webkit-details-marker]:hidden",
            moreActive
              ? "bg-primary/12 text-primary"
              : "text-secondary hover:bg-surface-muted hover:text-text-primary",
          ].join(" ")}
        >
          More
        </summary>
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[11rem] rounded-xl border border-secondary-border/25 bg-background py-1 shadow-lg">
          <Link
            href="/dashboard/products"
            className="block px-4 py-2.5 text-sm font-body text-text-primary hover:bg-surface-muted"
          >
            Products
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2.5 text-sm font-body text-text-primary hover:bg-surface-muted"
          >
            Settings
          </Link>
          <div className="my-1 border-t border-secondary-border/20" />
          <Link
            href="/"
            className="block px-4 py-2.5 text-sm font-body text-primary hover:bg-surface-muted"
          >
            View storefront
          </Link>
        </div>
      </details>
    </nav>
  );
}
