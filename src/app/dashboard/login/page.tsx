"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not sign in.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-secondary font-body">
        Sign in with the password configured for this environment.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold text-text-primary font-body">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-secondary-border/40 bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 focus:ring-2"
            required
          />
        </label>
        {error && (
          <p className="text-sm text-red-600 font-body" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-2xl"
          disabled={pending}
        >
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <Link
        href="/"
        className="mt-8 text-center text-sm text-primary underline-offset-2 hover:underline"
      >
        ← Back to site
      </Link>
    </div>
  );
}
