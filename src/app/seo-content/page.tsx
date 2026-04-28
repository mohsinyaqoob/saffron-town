import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  isSeoContentGateConfigured,
  SEO_CONTENT_COOKIE_NAME,
  verifySeoContentToken,
} from "@/lib/seo-content-session";
import { getSanityWriteClient } from "@/sanity/write-client";
import { SeoContentApp } from "./SeoContentApp";

export const metadata: Metadata = {
  title: "SEO blog draft (internal)",
  robots: { index: false, follow: false },
};

export default async function SeoContentPage() {
  const jar = await cookies();
  const initiallyAuthenticated = verifySeoContentToken(
    jar.get(SEO_CONTENT_COOKIE_NAME)?.value,
  );
  const gateConfigured = isSeoContentGateConfigured();
  const writeOk = Boolean(getSanityWriteClient());
  const openaiOk = Boolean(process.env.OPENAI_API_KEY?.trim());

  const parts: string[] = [];
  if (!gateConfigured) {
    parts.push(
      "Set SEO_CONTENT_PASSWORD and SEO_CONTENT_AUTH_SECRET (min 16 characters), or set DASHBOARD_AUTH_SECRET (min 16) to reuse cookie signing.",
    );
  }
  if (!writeOk) {
    parts.push(
      "Set SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID for Sanity writes.",
    );
  }
  if (!openaiOk) {
    parts.push("Set OPENAI_API_KEY for AI generation.");
  }

  return (
    <SeoContentApp
      initiallyAuthenticated={initiallyAuthenticated}
      gateConfigured={gateConfigured}
      toolReady={gateConfigured && writeOk && openaiOk}
      readinessHint={parts.join(" ")}
    />
  );
}
