import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardAccordionItemProps = {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
};

function ChevronIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-secondary transition-transform duration-200 group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

/** Expandable dashboard row — native `<details>` for accessibility without extra JS. */
export function DashboardAccordionItem({
  summary,
  children,
  className,
}: DashboardAccordionItemProps) {
  return (
    <details
      className={cn(
        "group rounded-2xl border border-secondary-border/20 bg-background-alt shadow-sm open:ring-1 open:ring-primary/10",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-4 transition-colors hover:bg-surface-muted/25 sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">{summary}</div>
        <ChevronIcon />
      </summary>
      <div className="border-t border-secondary-border/15 px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
        {children}
      </div>
    </details>
  );
}
