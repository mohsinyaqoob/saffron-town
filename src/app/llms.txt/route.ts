export const runtime = "edge";

import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";
import type {
  JournalPromotion,
  ResolvedJournalSettings,
} from "@/lib/journal-settings";
import { getJournalSettings } from "@/lib/journal-settings";

/**
 * llms.txt — follows the llmstxt.org convention (distinct from ai.txt):
 *   1. H1 = site/product name
 *   2. Blockquote = one-line description
 *   3. Optional H2 "## Details" paragraph
 *   4. H2 sections whose body is a bulleted list of markdown links with
 *      short descriptions
 *
 * Buyer-guide links resolve from Sanity → Journal settings (GROQ), so adding
 * a new Journal post requires no codebase change.
 */

function markdownBuyerGuideSection(
  baseUrl: string,
  journal: ResolvedJournalSettings,
): string {
  type Line = string;
  const lines: Line[] = [];

  const push = (
    fallbackTitle: string,
    entry: JournalPromotion | null | undefined,
    blurb: string,
  ) => {
    if (!entry) return;
    const title =
      typeof entry.title === "string" && entry.title.trim().length > 0
        ? entry.title.trim()
        : fallbackTitle;
    lines.push(`- [${title}](${baseUrl}${entry.href}): ${blurb}`);
  };

  push(
    "Kashmiri Saffron Price in India (2026)",
    journal.price,
    "Rates, packs, fake-price thresholds, market context.",
  );
  push(
    "Kashmiri vs Iranian Saffron",
    journal.pillarKashmiriVsIranian,
    "Lab and price comparison (Kashmiri Mongra vs Iranian Sargol/Negin).",
  );
  push(
    "Mongra vs Lacha Saffron Grades",
    journal.pillarMongraVsLacha,
    "Traditional Kashmiri grades explained.",
  );
  push(
    "Identify fake vs real saffron",
    journal.fakeSaffron,
    "Home checks and label cues for purity.",
  );
  push(
    "Kesar for pregnancy",
    journal.pregnancy,
    "Timing, cautious use, recipes — GI-tagged context.",
  );

  if (!lines.length) {
    lines.push(
      `- [Saffron Town Journal](${baseUrl}/blog): All buying guides; link featured guides in Sanity Studio → Journal settings.`,
    );
  }

  return `## Buyer Guides (Journal)\n\n${lines.join("\n")}\n`;
}

export async function GET() {
  const u = SITE_CONFIG.url;

  let journalSection: string;
  try {
    journalSection = markdownBuyerGuideSection(u, await getJournalSettings());
  } catch {
    journalSection = `## Buyer Guides (Journal)\n\n- [Saffron Town Journal](${u}/blog)\n`;
  }

  const content = `# Saffron Town

> Premium Kashmiri Mongra Kesar (Saffron) dealer — farm-direct from Pampore, GI-tagged (Kashmir Saffron, GI-635). Fresh harvest only, no old stock. Ships across India with a money-back purity guarantee.

## Shop

- [Shop Pure Kashmiri Mongra Kesar](${u}/shop/saffron): Grade A++ GI-tagged Kashmiri Mongra saffron from Pampore. 1g to 50g packs.
- [Bulk orders & wholesale](${u}/bulk-orders): Restaurants, sweet shops, gifting, and trade — call, WhatsApp, or request a structured quote.
- [Pre-book 2026 Harvest](${u}/prebook-2026-harvest): Reserve the current-year harvest before it ships.
- [Gifting](${u}/gifting): Ready-to-gift saffron sets.

${journalSection}
## Proof & Provenance

- [Quality & Testing](${u}/lab-reports): GI-tagged origin, Mongra grade, and independent ISO 3632 batch testing available on request for bulk orders over 1 kg (retail batches are not individually certified).
- [Our Story](${u}/our-story): Farm-direct origin story from the Pampore saffron belt.
- [Customer Reviews](${u}/reviews): Verified buyer reviews.

## Journal

- [Saffron Town Blog](${u}/blog): Long-form articles on Kashmiri saffron, cooking, health, and the harvest.

## About

- [Founder — Mohsin Yaqoob](${u}/authors/mohsin-yaqoob): Founder bio, credentials, and sameAs links.
- [Contact](${u}/contact): Customer-service contact details.
- [Sitemap](${u}/sitemap.xml): Full site index.
- [AI manifest (ai.txt)](${u}/ai.txt): Extended prose context for AI agents.

## Key Facts

- Product: Kashmiri Mongra Saffron (Grade A++, GI-tagged)
- Origin: Pampore, Kashmir — GI-tagged Kashmir Saffron (GI-635)
- Assurance: retail sold on GI-tagged origin + Mongra grade; retail batches not individually lab-certified. Independent ISO 3632 batch testing available on request for bulk orders over 1 kg (customer pays for the test).
- Typical ISO 3632 ranges for Kashmir Mongra (indicative, not per-pack results): Crocin ~200–270, Picrocrocin ~80–100, Safranal 20–45
- Price range: ₹650 (1g tester), ₹1,299 (2g), up to ₹26,499 (50g). Effective rate varies by pack—premium Mongra tier roughly ₹530–₹650/g.
- Contact: ${SITE_CONFIG.phone} (phone), ${SITE_CONFIG.email} (email)
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "all",
    },
  });
}
