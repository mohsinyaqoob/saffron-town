// src/lib/blog-internal-links.ts

/**
 * Auto-injects internal links into Sanity Portable Text bodies using **pillar
 * hrefs from Studio** (`journalSettings` → pillar references, resolved via
 * `journal-settings.ts`).
 *
 * Idempotent: re-running does not double-link because linked spans are skipped.
 */

import type { PortableTextBlock } from "@portabletext/types";

export type InternalLinkRule = {
  href: string;
  patterns: RegExp[];
};

const KASHMIRI_VS_IRANIAN_PATTERNS: RegExp[] = [
  /\bkashmiri\s+(?:saffron\s+)?vs\.?\s+iranian(?:\s+saffron)?\b/i,
  /\bkashmiri\s+(?:saffron\s+)?(?:and|or|versus)\s+iranian(?:\s+saffron)?\b/i,
  /\biranian\s+saffron\b/i,
  /\biranian\s+(?:sargol|negin|super\s+negin|mongra)\b/i,
];

const MONGRA_VS_LACHA_PATTERNS: RegExp[] = [
  /\bmongra\s+vs\.?\s+lacha\b/i,
  /\bmongra\s+(?:and|or|versus)\s+lacha\b/i,
  /\blachha?\s+saffron\b/i,
  /\bsaffron\s+grades?\b/i,
  /\bgrade\s+a\+{1,2}\b/i,
];

/** Build inject rules from Sanity-resolved `/blog/...` URLs (may be empty). */
export function buildPillarInjectRules(hrefs: {
  kashmiriVsIranianHref: string | null | undefined;
  mongraVsLachaHref: string | null | undefined;
}): InternalLinkRule[] {
  const rules: InternalLinkRule[] = [];
  if (hrefs.kashmiriVsIranianHref) {
    rules.push({
      href: hrefs.kashmiriVsIranianHref,
      patterns: KASHMIRI_VS_IRANIAN_PATTERNS,
    });
  }
  if (hrefs.mongraVsLachaHref) {
    rules.push({
      href: hrefs.mongraVsLachaHref,
      patterns: MONGRA_VS_LACHA_PATTERNS,
    });
  }
  return rules;
}

/** Minimal shape we touch — keeps us decoupled from full Sanity types */
type Span = {
  _key?: string;
  _type: "span";
  text?: string;
  marks?: string[];
};

type MarkDef = {
  _key: string;
  _type: string;
  href?: string;
};

type BlockLike = {
  _type?: string;
  _key?: string;
  children?: Span[];
  markDefs?: MarkDef[];
  [extra: string]: unknown;
};

function spanHasLinkMark(span: Span, markDefs: MarkDef[]): boolean {
  if (!span.marks?.length) return false;
  const linkKeys = new Set(
    markDefs.filter((m) => m._type === "link").map((m) => m._key),
  );
  return span.marks.some((m) => linkKeys.has(m));
}

/** Cheap, deterministic key — Sanity only requires uniqueness within parent */
function makeKey(prefix: string, blockKey: string | undefined, index: number) {
  const base = blockKey || "blk";
  return `${base}-al-${prefix}-${index}`;
}

/**
 * Injects `link` marks into plain text spans per `rules` (earliest match wins).
 * Skips the current post slug so pillar pages never self-link.
 */
export function injectInternalLinks(
  body: unknown,
  currentSlug?: string,
  rules: InternalLinkRule[] = [],
): unknown {
  if (!Array.isArray(body) || rules.length === 0) return body;

  const usedHrefs = new Set<string>();
  if (currentSlug) {
    usedHrefs.add(`/blog/${currentSlug}`);
    usedHrefs.add(`/${currentSlug}`);
  }

  return (body as BlockLike[]).map((rawBlock) => {
    if (!rawBlock || rawBlock._type !== "block") return rawBlock;
    if (!Array.isArray(rawBlock.children)) return rawBlock;

    const markDefs: MarkDef[] = Array.isArray(rawBlock.markDefs)
      ? [...rawBlock.markDefs]
      : [];
    const newChildren: Span[] = [];

    for (const span of rawBlock.children) {
      if (
        !span ||
        span._type !== "span" ||
        typeof span.text !== "string" ||
        spanHasLinkMark(span, markDefs)
      ) {
        newChildren.push(span);
        continue;
      }

      let working: Span = span;
      let consumed = false;

      while (typeof working.text === "string" && working.text.length > 0) {
        let earliest: {
          rule: InternalLinkRule;
          index: number;
          length: number;
        } | null = null;

        for (const rule of rules) {
          if (usedHrefs.has(rule.href)) continue;
          for (const pattern of rule.patterns) {
            const m = working.text.match(new RegExp(pattern.source, "i"));
            if (!m || typeof m.index !== "number") continue;
            if (!earliest || m.index < earliest.index) {
              earliest = {
                rule,
                index: m.index,
                length: m[0].length,
              };
            }
            break;
          }
        }

        if (!earliest) break;

        const start = earliest.index;
        const end = start + earliest.length;
        const before = working.text.slice(0, start);
        const matched = working.text.slice(start, end);
        const after = working.text.slice(end);

        const linkKey = makeKey(
          earliest.rule.href.replace(/[^a-z0-9]+/gi, "-"),
          rawBlock._key,
          newChildren.length,
        );
        markDefs.push({
          _key: linkKey,
          _type: "link",
          href: earliest.rule.href,
        });

        if (before) {
          newChildren.push({
            ...working,
            _key: makeKey("pre", working._key, newChildren.length),
            text: before,
          });
        }

        newChildren.push({
          ...working,
          _key: makeKey("hit", working._key, newChildren.length),
          marks: [...(working.marks ?? []), linkKey],
          text: matched,
        });

        usedHrefs.add(earliest.rule.href);
        consumed = true;

        working = {
          ...working,
          _key: makeKey("rest", working._key, newChildren.length),
          text: after,
        };
      }

      if (consumed) {
        if (typeof working.text === "string" && working.text.length > 0) {
          newChildren.push(working);
        }
      } else {
        newChildren.push(span);
      }
    }

    return {
      ...rawBlock,
      children: newChildren,
      markDefs,
    } as PortableTextBlock;
  }) as unknown;
}
