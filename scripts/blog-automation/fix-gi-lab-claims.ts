import "dotenv/config";
import { createClient } from "@sanity/client";

/**
 * One-off: correct the now-inaccurate "ships with a lab report" claims in the
 * four GI-tagging blog posts. Retail saffron is not individually lab-certified;
 * batch testing is only offered for bulk orders over 1 kg.
 *
 * Two safe passes, both preserving structure and all non-lab links:
 *  1. Relabel any span that LINKS to /lab-reports to "Quality and Testing page"
 *     (leaves generic plain-text mentions of "lab report" as legitimate advice).
 *  2. Replace specific plain-text claim fragments (unique per post).
 *
 *   npx tsx scripts/blog-automation/fix-gi-lab-claims.ts --dry
 *   npx tsx scripts/blog-automation/fix-gi-lab-claims.ts
 */

const dry = process.argv.includes("--dry");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  // Read + patch the PUBLISHED document the site serves (not a stray draft).
  perspective: "published",
});

const LAB_LINK_ANCHOR = "Quality and Testing page";

// Plain-text sentence fragments (each lives within a single non-link span).
const FRAGMENTS: Record<string, [string, string][]> = {
  "gi-tagged-kashmiri-saffron": [
    [
      "Every batch we sell ships with its own ",
      "You can see what a lab test of Kashmir Mongra typically shows on our ",
    ],
    [
      ", so you are never taking the origin on trust alone.",
      ". Every order is GI-tagged from Pampore.",
    ],
    [
      "is farm-direct from Pampore and ships with a ",
      "is farm-direct from Pampore and GI-tagged. See our ",
    ],
  ],
  "how-to-verify-gi-tagged-saffron": [
    [
      "We publish the ",
      "We explain what a lab test of Kashmir Mongra typically shows on our ",
    ],
    [
      " for our harvests for exactly this reason. Paperwork you cannot see is paperwork you cannot trust.",
      ". Independent ISO 3632 batch testing is available on request for bulk orders over 1 kg.",
    ],
    [
      " ships farm-direct from Pampore with its own ",
      " is farm-direct from Pampore and GI-tagged. See our ",
    ],
  ],
  "kashmir-saffron-gi-tag-2020": [
    [
      "is farm-direct from Pampore and ships with its own ",
      "is farm-direct from Pampore and GI-tagged. See our ",
    ],
  ],
  "what-is-a-gi-tag": [
    [
      " ships farm-direct with its paperwork attached.",
      " is farm-direct and GI-tagged.",
    ],
  ],
};

type MarkDef = { _key?: string; _type?: string; href?: string };
type Span = { _type?: string; text?: string; marks?: string[] };
type Block = { _type?: string; children?: Span[]; markDefs?: MarkDef[] };

async function main() {
  for (const [slug, fragments] of Object.entries(FRAGMENTS)) {
    const doc = await client.fetch<{ _id: string; body: Block[] } | null>(
      `*[_type == "post" && slug.current == $slug][0]{ _id, body }`,
      { slug },
    );
    if (!doc) {
      console.log(`MISS  ${slug} (not found)`);
      continue;
    }

    let anchorHits = 0;
    let fragmentHits = 0;
    const remaining = new Set(fragments.map((f) => f[0]));

    const body = (doc.body || []).map((block) => {
      if (!Array.isArray(block.children)) return block;
      const labKeys = new Set(
        (block.markDefs || [])
          .filter((m) => m._type === "link" && (m.href || "").includes("/lab-reports"))
          .map((m) => m._key),
      );
      const children = block.children.map((span) => {
        if (typeof span.text !== "string") return span;
        // Pass 1: relabel lab-reports link anchors
        const isLabLink = (span.marks || []).some((k) => labKeys.has(k));
        if (isLabLink && span.text !== LAB_LINK_ANCHOR) {
          anchorHits++;
          return { ...span, text: LAB_LINK_ANCHOR };
        }
        // Pass 2: plain-text fragment replacements
        let text = span.text;
        for (const [find, repl] of fragments) {
          if (text.includes(find)) {
            text = text.split(find).join(repl);
            remaining.delete(find);
            fragmentHits++;
          }
        }
        return text === span.text ? span : { ...span, text };
      });
      return { ...block, children };
    });

    if (remaining.size > 0) {
      console.log(
        `WARN  ${slug}: fragment(s) not found: ${[...remaining].map((s) => JSON.stringify(s.slice(0, 40))).join(", ")}`,
      );
    }

    if (anchorHits === 0 && fragmentHits === 0) {
      console.log(`SKIP  ${slug} (nothing to change)`);
      continue;
    }

    if (dry) {
      console.log(
        `DRY   ${slug}: ${anchorHits} lab-link anchor(s) + ${fragmentHits} fragment(s)`,
      );
      continue;
    }

    await client
      .patch(doc._id)
      .set({ body, updatedAt: new Date().toISOString() })
      .commit();
    console.log(
      `FIXED ${slug}: ${anchorHits} lab-link anchor(s) + ${fragmentHits} fragment(s)`,
    );
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
