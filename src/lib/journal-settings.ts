import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "@/sanity/client";
import {
  JOURNAL_SETTINGS_DOCUMENT_ID,
  JOURNAL_SETTINGS_QUERY,
} from "@/sanity/queries";
import { buildPillarInjectRules } from "./blog-internal-links";

export type JournalPromotion = {
  slug: string;
  title: string | null;
  href: `/blog/${string}`;
};

export type ResolvedJournalSettings = {
  pregnancy: JournalPromotion | null;
  price: JournalPromotion | null;
  fakeSaffron: JournalPromotion | null;
  pillarKashmiriVsIranian: JournalPromotion | null;
  pillarMongraVsLacha: JournalPromotion | null;
};

type RawJournalSettings = {
  pregnancySlug?: string | null;
  pregnancyTitle?: string | null;
  priceSlug?: string | null;
  priceTitle?: string | null;
  fakeSlug?: string | null;
  fakeTitle?: string | null;
  kashmiriVsIranianSlug?: string | null;
  kashmiriVsIranianTitle?: string | null;
  mongraVsLachaSlug?: string | null;
  mongraVsLachaTitle?: string | null;
};

function toPromotion(
  slug: string | null | undefined,
  title: string | null | undefined,
): JournalPromotion | null {
  if (!slug) return null;
  return {
    slug,
    title: title ?? null,
    href: `/blog/${slug}`,
  };
}

async function fetchRawJournalSettings(): Promise<RawJournalSettings | null> {
  try {
    return await client.fetch<RawJournalSettings | null>(
      JOURNAL_SETTINGS_QUERY,
      {
        docId: JOURNAL_SETTINGS_DOCUMENT_ID,
      },
    );
  } catch {
    return null;
  }
}

/** If Journal settings pillar refs are empty, link to the first matching post by slug. */
const PILLAR_SLUG_FALLBACKS = {
  kashmiriVsIranian: [
    "kashmiri-saffron-vs-iranian-saffron",
    "kashmiri-saffron-vs-iranian",
  ],
  mongraVsLacha: ["mongra-vs-lacha-saffron"],
} as const;

async function promotionFromSlugCandidates(
  candidates: readonly string[],
): Promise<JournalPromotion | null> {
  if (candidates.length === 0) return null;
  try {
    const rows = await client.fetch<
      { slug: string; title: string | null }[] | null
    >(
      groq`*[_type == "post" && !noIndex && slug.current in $slugs]{
        "slug": slug.current,
        title
      }`,
      { slugs: [...candidates] },
    );
    if (!rows?.length) return null;
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    for (const s of candidates) {
      const hit = bySlug.get(s);
      if (hit) return toPromotion(hit.slug, hit.title);
    }
  } catch {
    /* empty */
  }
  return null;
}

async function withPillarFallbacks(
  row: RawJournalSettings | null,
): Promise<ResolvedJournalSettings> {
  let pillarKashmiriVsIranian = row
    ? toPromotion(row.kashmiriVsIranianSlug, row.kashmiriVsIranianTitle)
    : null;
  let pillarMongraVsLacha = row
    ? toPromotion(row.mongraVsLachaSlug, row.mongraVsLachaTitle)
    : null;

  const needKash = !pillarKashmiriVsIranian;
  const needMon = !pillarMongraVsLacha;
  if (needKash || needMon) {
    const [fbKash, fbMon] = await Promise.all([
      needKash
        ? promotionFromSlugCandidates(PILLAR_SLUG_FALLBACKS.kashmiriVsIranian)
        : Promise.resolve(null),
      needMon
        ? promotionFromSlugCandidates(PILLAR_SLUG_FALLBACKS.mongraVsLacha)
        : Promise.resolve(null),
    ]);
    if (needKash) pillarKashmiriVsIranian = fbKash;
    if (needMon) pillarMongraVsLacha = fbMon;
  }

  return {
    pregnancy: row ? toPromotion(row.pregnancySlug, row.pregnancyTitle) : null,
    price: row ? toPromotion(row.priceSlug, row.priceTitle) : null,
    fakeSaffron: row ? toPromotion(row.fakeSlug, row.fakeTitle) : null,
    pillarKashmiriVsIranian,
    pillarMongraVsLacha,
  };
}

/**
 * De-duplicated Sanity fetch per server request (`react/cache`).
 * Editors wire posts in Studio → Journal settings; URLs follow `slug.current`.
 */
export const getJournalSettings = cache(
  async (): Promise<ResolvedJournalSettings> => {
    const row = await fetchRawJournalSettings();
    return withPillarFallbacks(row);
  },
);

/** Rules consumed by `injectInternalLinks` — built from Sanity pillar picks. */
export const getJournalPillarInjectRules = cache(buildPillarRulesFromSanity);

async function buildPillarRulesFromSanity() {
  const s = await getJournalSettings();
  return buildPillarInjectRules({
    kashmiriVsIranianHref: s.pillarKashmiriVsIranian?.href ?? null,
    mongraVsLachaHref: s.pillarMongraVsLacha?.href ?? null,
  });
}
