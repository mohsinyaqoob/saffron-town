"use client";

import { useRouter } from "next/navigation";

export function OrdersFilterToggle({ showArchived }: { showArchived: boolean }) {
  const router = useRouter();

  function toggle() {
    const url = new URL(window.location.href);
    if (showArchived) {
      url.searchParams.delete("archived");
    } else {
      url.searchParams.set("archived", "1");
    }
    router.push(url.pathname + url.search);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold font-body transition-colors ${
        showArchived
          ? "border-accent-gold/50 bg-accent-gold/10 text-accent-gold"
          : "border-border-subtle bg-surface-primary text-text-secondary hover:border-accent-gold/30 hover:text-text-primary"
      }`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${showArchived ? "bg-accent-gold" : "bg-text-muted"}`}
        aria-hidden="true"
      />
      {showArchived ? "Showing archived" : "Show archived"}
    </button>
  );
}
