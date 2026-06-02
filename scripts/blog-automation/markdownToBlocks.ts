import type { ContentBlockIn } from "./portableText";

export type SpanIn = {
  text: string;
  href?: string;
  strong?: boolean;
  em?: boolean;
};

export function parseInlineSpans(text: string): SpanIn[] {
  const spans: SpanIn[] = [];
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const link = rest.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (link) {
      spans.push({ text: link[1], href: link[2] });
      i += link[0].length;
      continue;
    }
    const bold = rest.match(/^\*\*([^*]+)\*\*/);
    if (bold) {
      spans.push({ text: bold[1], strong: true });
      i += bold[0].length;
      continue;
    }
    const italic = rest.match(/^\*([^*]+)\*/);
    if (italic) {
      spans.push({ text: italic[1], em: true });
      i += italic[0].length;
      continue;
    }
    const next = rest.search(/\*\*|\*|\[/);
    const end = next === -1 ? rest.length : next;
    if (end > 0) spans.push({ text: rest.slice(0, end) });
    i += end || 1;
  }
  return spans.length ? spans : [{ text }];
}

function parseTableCells(line: string): string[] {
  return line
    .split("|")
    .map((c) => c.trim())
    .filter(
      (c, idx, arr) => !(idx === 0 && !c) && !(idx === arr.length - 1 && !c),
    );
}

function isTableSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function appendTableBlocks(rows: string[][], blocks: ContentBlockIn[]) {
  if (!rows.length) return;
  let header: string[] | null = null;
  let data = rows;
  if (rows.length > 1 && !isTableSeparatorRow(rows[0])) {
    header = rows[0];
    data = rows.slice(1);
  }
  for (const row of data) {
    if (isTableSeparatorRow(row)) continue;
    const line = row
      .map((cell, idx) => {
        const clean = cell.trim();
        if (!clean) return "";
        const label = header?.[idx];
        return label ? `${label}: ${clean}` : clean;
      })
      .filter(Boolean)
      .join(" · ");
    if (line) blocks.push({ type: "p", spans: parseInlineSpans(line) });
  }
}

export function markdownToBlocks(md: string): ContentBlockIn[] {
  const blocks: ContentBlockIn[] = [];
  const lines = md.split(/\r?\n/);
  let paragraph: string[] = [];
  let tableRows: string[][] = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (text) blocks.push({ type: "p", spans: parseInlineSpans(text) });
  };
  const flushTable = () => {
    if (tableRows.length) {
      appendTableBlocks(tableRows, blocks);
      tableRows = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      flushParagraph();
      const cells = parseTableCells(trimmed);
      if (cells.length) tableRows.push(cells);
      continue;
    }
    flushTable();
    if (!trimmed) {
      flushParagraph();
      continue;
    }
    if (trimmed === "---" || trimmed.startsWith("# ")) continue;
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      continue;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      blocks.push({
        type: "p",
        spans: parseInlineSpans(`• ${trimmed.replace(/^[-*]\s+/, "")}`),
      });
      continue;
    }
    paragraph.push(trimmed);
  }
  flushTable();
  flushParagraph();
  return blocks;
}
