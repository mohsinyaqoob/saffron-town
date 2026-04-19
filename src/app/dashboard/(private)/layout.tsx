import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import {
  DASHBOARD_COOKIE_NAME,
  verifyDashboardToken,
} from "@/lib/dashboard-session";
import { LogoutButton } from "../LogoutButton";

export default async function DashboardPrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const jar = await cookies();
  const token = jar.get(DASHBOARD_COOKIE_NAME)?.value;
  if (!verifyDashboardToken(token)) {
    redirect("/dashboard/login");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-secondary-border/20 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2">
            <div className="shrink-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                Internal
              </p>
              <p className="font-display text-lg font-bold leading-tight text-text-primary sm:text-xl">
                Dashboard
              </p>
            </div>
            <DashboardTopNav />
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
