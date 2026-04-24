export const runtime = "edge";

import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * llms.txt — follows the llmstxt.org convention (distinct from ai.txt):
 *   1. H1 = site/product name
 *   2. Blockquote = one-line description
 *   3. Optional H2 "## Details" paragraph
 *   4. H2 sections whose body is a bulleted list of markdown links with
 *      short descriptions
 *
 * Served at /llms.txt so crawlers like Perplexity, ChatGPT Search, and
 * Anthropic Web can discover the canonical entry points without having
 * to parse full HTML pages. Paired with ai.txt (richer, prose-oriented)
 * at /ai.txt for crawlers that prefer that format.
 */
export async function GET() {
  const u = SITE_CONFIG.url;

  const content = `# Saffron Town

> Premium Kashmiri Mongra Kesar (Saffron) dealer — farm-direct from Pampore, ISO 3632 lab-tested, GI-tagged (Kashmir Saffron, GI-635). Fresh harvest only, no old stock. Ships across India with a money-back purity guarantee.

## Shop

- [Shop Pure Kashmiri Mongra Kesar](${u}/shop/saffron): Grade A++ Kashmiri saffron from Pampore. 1g to 50g packs. ISO 3632 Category I. Crocin >250.
- [Pre-book 2026 Harvest](${u}/prebook-2026-harvest): Reserve the current-year harvest before it ships.
- [Gifting](${u}/gifting): Ready-to-gift saffron sets.

## Buyer Guides

- [Kashmiri Saffron Price in India (2026)](${u}/kashmiri-saffron-price): Live rate card per gram, pack-size pricing, and market-rate context.
- [Kashmiri vs Iranian Saffron](${u}/kashmiri-saffron-vs-iranian): Side-by-side lab and price comparison between Kashmiri Mongra and Iranian Sargol/Negin.
- [Mongra vs Lacha Saffron Grades](${u}/mongra-vs-lacha-saffron): The difference between Mongra, Lacha and Gucchi — the three traditional Kashmiri saffron grades.
- [Real vs Fake Saffron Test](${u}/real-vs-fake-saffron-test): Five at-home tests (warm milk, cold water, rub, taste, baking soda) to verify saffron purity.
- [Kesar for Pregnancy](${u}/kesar-for-pregnancy): Safe dosage, timing, and kesar-milk recipe for expecting mothers.

## Proof & Provenance

- [ISO 3632 Lab Reports](${u}/lab-reports): Downloadable lab certificates per harvest batch (crocin, picrocrocin, safranal).
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

- Product: Kashmiri Mongra Saffron (Grade A++ · ISO 3632 Category I)
- Origin: Pampore, Kashmir — GI-tagged Kashmir Saffron (GI-635)
- Typical lab specs: Crocin >250, Picrocrocin >70, Safranal 20–50
- Price range: ₹499 (1g) to ₹19,999 (50g). Effective rate ₹400–₹500/g for pure Mongra.
- Contact: ${SITE_CONFIG.email}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "all",
    },
  });
}
