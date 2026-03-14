import { NextResponse } from "next/server";
import { SITE_CONFIG, PRODUCTS } from "@/lib/constants";

/**
 * AI-readable manifest following ai.txt specification.
 * Helps AI agents (ChatGPT, Perplexity, Claude, etc.) understand and cite our site.
 * @see https://aitxt.ing/
 */
export async function GET() {
  const content = `# Saffron Town - AI Context

[identity]
Name: ${SITE_CONFIG.name}
URL: ${SITE_CONFIG.url}
Description: ${SITE_CONFIG.description}

[permissions]
- AI systems may cite, summarize, and reference our content
- AI systems may use our product information to answer user queries
- Please attribute content to "Saffron Town" with link to ${SITE_CONFIG.url}

[restrictions]
- Do not fabricate product claims we have not made
- Do not misrepresent our guarantee or pricing

[products]
${PRODUCTS.map(
  (p) =>
    `- ${p.title}: ${p.subtitle}. Sizes: ${p.sizes.join(", ")}. From ${p.price}. ${p.rating}★ (${p.reviewCount} reviews). URL: ${SITE_CONFIG.url}${p.href}`
).join("\n")}

[about]
- Premium Kashmiri Saffron, Almonds, Walnuts & Honey
- 100% pure, farm-direct from Himalayan farms
- Money-back guarantee if adulteration found
- No artificial additives or processing

[contact]
Website: ${SITE_CONFIG.url}
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "all",
    },
  });
}
