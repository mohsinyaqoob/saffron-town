import type { PortableTextBlock } from "@portabletext/types";

type SpanIn = { text: string; href?: string };

export type ContentBlockIn =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; spans: SpanIn[] };

function blockKey() {
  return `b_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

function markKey() {
  return `m_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

function buildParagraphBlock(spans: SpanIn[]): PortableTextBlock {
  const markDefs: Array<{
    _key: string;
    _type: "link";
    href: string;
  }> = [];
  const children: Array<{
    _type: "span";
    text: string;
    marks?: string[];
  }> = [];

  for (const span of spans) {
    if (!span.text && !span.href) continue;
    if (span.href) {
      const mk = markKey();
      markDefs.push({ _type: "link", _key: mk, href: span.href });
      children.push({ _type: "span", text: span.text, marks: [mk] });
    } else {
      children.push({ _type: "span", text: span.text });
    }
  }

  if (children.length === 0) {
    children.push({ _type: "span", text: "\u00a0" });
  }

  return {
    _type: "block",
    _key: blockKey(),
    style: "normal",
    markDefs,
    children,
  } as unknown as PortableTextBlock;
}

export function blocksToPortableText(
  blocks: ContentBlockIn[],
): PortableTextBlock[] {
  const out: PortableTextBlock[] = [];
  for (const b of blocks) {
    if (b.type === "h2" || b.type === "h3") {
      const text = (b.text || "").trim();
      if (!text) continue;
      out.push({
        _type: "block",
        _key: blockKey(),
        style: b.type,
        markDefs: [],
        children: [{ _type: "span", text }],
      } as unknown as PortableTextBlock);
      continue;
    }
    if (b.type === "p") {
      const spans = b.spans?.length ? b.spans : [{ text: "\u00a0" }];
      out.push(buildParagraphBlock(spans));
    }
  }
  return out;
}
