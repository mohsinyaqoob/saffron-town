import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-10 w-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Full-page loader (e.g. Suspense fallback for checkout). */
export function CheckoutLoadingShell({
  title = "Loading checkout",
  description = "One moment…",
  footer,
}: {
  title?: string;
  description?: string;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex flex-grow flex-col items-center justify-center px-4 pb-20 pt-8">
        <Spinner />
        <h1 className="mt-6 font-display text-xl font-bold text-text-primary sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2 max-w-sm text-center text-sm text-secondary font-body">
          {description}
        </p>
      </main>
      {footer}
    </div>
  );
}

/** Full-screen state after order succeeds, until navigation to the confirmation page. */
export function CheckoutOrderRedirectLayout({ footer }: { footer: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex flex-grow flex-col items-center justify-center px-4 pb-20 pt-8">
        <div className="flex flex-col items-center">
          <Spinner className="h-12 w-12" />
          <h1 className="mt-8 font-display text-xl font-bold text-text-primary sm:text-2xl">
            Order placed
          </h1>
          <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-secondary font-body">
            Taking you to your confirmation and order summary…
          </p>
        </div>
      </main>
      {footer}
    </div>
  );
}
