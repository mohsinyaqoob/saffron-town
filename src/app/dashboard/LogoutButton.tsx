"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/dashboard/logout", { method: "POST" });
      router.replace("/dashboard/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={pending}
      className="rounded-xl border border-secondary-border/40 px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface-muted disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
