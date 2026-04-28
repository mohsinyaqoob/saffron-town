"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  { value: "", label: "Let AI choose" },
  { value: "health", label: "Health & wellness" },
  { value: "recipes", label: "Recipes" },
  { value: "buying-guide", label: "Buying guide" },
  { value: "about-saffron", label: "About saffron" },
] as const;

type CreateOk = {
  ok: true;
  documentId: string;
  slug: string;
  previewUrl: string;
  studioUrl: string;
};

type Props = {
  initiallyAuthenticated: boolean;
  gateConfigured: boolean;
  toolReady: boolean;
  readinessHint: string;
};

export function SeoContentApp({
  initiallyAuthenticated,
  gateConfigured,
  toolReady,
  readinessHint,
}: Props) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);

  const [keywords, setKeywords] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryHint, setCategoryHint] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);
  const [lastResult, setLastResult] = useState<CreateOk | null>(null);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginPending(true);
    try {
      const res = await fetch("/api/seo-content/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setLoginError(data.error ?? "Could not sign in.");
        return;
      }
      setAuthenticated(true);
      setPassword("");
      router.refresh();
    } finally {
      setLoginPending(false);
    }
  }

  async function onLogout() {
    await fetch("/api/seo-content/logout", { method: "POST" });
    setAuthenticated(false);
    setLastResult(null);
    router.refresh();
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setLastResult(null);
    setCreatePending(true);
    try {
      const res = await fetch("/api/seo-content/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords,
          instructions,
          categoryHint: categoryHint || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
        documentId?: string;
        slug?: string;
        previewUrl?: string;
        studioUrl?: string;
      };
      if (!res.ok) {
        setCreateError(data.error ?? "Request failed.");
        return;
      }
      if (
        data.ok &&
        data.documentId &&
        data.slug &&
        data.previewUrl &&
        data.studioUrl
      ) {
        setLastResult({
          ok: true,
          documentId: data.documentId,
          slug: data.slug,
          previewUrl: data.previewUrl,
          studioUrl: data.studioUrl,
        });
        setKeywords("");
        setInstructions("");
      }
    } finally {
      setCreatePending(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12 font-body">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
        Internal
      </p>
      <h1 className="mt-1 font-display text-2xl font-bold text-text-primary">
        SEO blog draft
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Generates a draft{" "}
        <code className="rounded bg-surface-muted px-1">post</code> in Sanity
        (noindex) from keywords and instructions. Replace images and review in
        Studio before publishing.
      </p>

      {!gateConfigured && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          This tool is not configured for this environment (missing password or
          signing secret).
        </p>
      )}

      {gateConfigured && !authenticated && (
        <form onSubmit={onLogin} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-text-primary">
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
          {loginError && (
            <p className="text-sm text-red-600" role="alert">
              {loginError}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-2xl"
            disabled={loginPending}
          >
            {loginPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      )}

      {authenticated && (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-secondary">Signed in.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              Sign out
            </Button>
          </div>

          {!toolReady && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {readinessHint ||
                "Add the required environment variables before creating drafts."}
            </p>
          )}

          <form onSubmit={onCreate} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-text-primary">
              Keywords / topic
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-xl border border-secondary-border/40 bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 focus:ring-2"
                placeholder="Primary keyword, secondary terms, search intent…"
                required
                disabled={!toolReady || createPending}
              />
            </label>
            <label className="block text-sm font-semibold text-text-primary">
              Instructions for the writer (AI)
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={8}
                className="mt-1.5 w-full rounded-xl border border-secondary-border/40 bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 focus:ring-2"
                placeholder="Angle, word count, internal links to mention, CTA, tone, what to avoid…"
                required
                disabled={!toolReady || createPending}
              />
            </label>
            <label className="block text-sm font-semibold text-text-primary">
              Category (optional)
              <select
                value={categoryHint}
                onChange={(e) => setCategoryHint(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-secondary-border/40 bg-background px-3 py-2.5 text-sm text-text-primary outline-none ring-primary/30 focus:ring-2"
                disabled={!toolReady || createPending}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value || "auto"} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            {createError && (
              <p className="text-sm text-red-600" role="alert">
                {createError}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-2xl"
              disabled={!toolReady || createPending}
            >
              {createPending
                ? "Generating & saving…"
                : "Create draft in Sanity"}
            </Button>
          </form>

          {lastResult && (
            <div className="mt-8 rounded-xl border border-secondary-border/30 bg-background-alt p-4 text-sm text-text-primary">
              <p className="font-semibold text-primary">Draft created</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-secondary">
                <li>
                  Slug:{" "}
                  <code className="rounded bg-surface-muted px-1 text-text-primary">
                    {lastResult.slug}
                  </code>
                </li>
                <li>
                  Document ID:{" "}
                  <code className="break-all rounded bg-surface-muted px-1 text-text-primary">
                    {lastResult.documentId}
                  </code>
                </li>
                <li>
                  <Link
                    href={`/blog/${lastResult.slug}`}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Preview on site (noindex draft)
                  </Link>
                </li>
                <li>
                  <a
                    href={lastResult.studioUrl}
                    className="text-primary underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Sanity Studio
                  </a>{" "}
                  to edit images, then turn off noindex when ready.
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      <Link
        href="/"
        className="mt-10 inline-block text-sm text-primary underline-offset-2 hover:underline"
      >
        ← Back to site
      </Link>
    </div>
  );
}
