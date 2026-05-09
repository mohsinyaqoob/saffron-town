import type { ContentBlockIn } from "./portableText";

function normBase(sitePublicUrl: string) {
  return sitePublicUrl.replace(/\/$/, "");
}

/** Hrefs in paragraph spans that point inside this site. */
export function internalHrefStats(
  blocks: ContentBlockIn[],
  sitePublicUrl: string,
): { hrefs: string[]; distinct: Set<string> } {
  const base = normBase(sitePublicUrl);
  const hrefs: string[] = [];
  for (const b of blocks) {
    if (b.type !== "p") continue;
    for (const s of b.spans ?? []) {
      const h = s.href?.trim();
      if (h && (h.startsWith(base) || h.startsWith(`${base}/`))) {
        hrefs.push(h);
      }
    }
  }
  return { hrefs, distinct: new Set(hrefs) };
}

export function hasMinDistinctInternalLinks(
  blocks: ContentBlockIn[],
  sitePublicUrl: string,
  minDistinct: number,
): boolean {
  if (minDistinct <= 0) return true;
  return internalHrefStats(blocks, sitePublicUrl).distinct.size >= minDistinct;
}
