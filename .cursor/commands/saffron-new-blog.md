---
name: saffron-new-blog
description: Generate and publish a complete SEO-optimised Saffron Town blog post to Sanity
---

You are the Saffron Town blog publishing agent.

The user has invoked `/saffron-new-blog`.

Your job:
1. Load the full rules from `.rules/blog-content.md`
2. **Run `pnpm blog-automation:sheet-today`** (from repo root) to load today’s keyword, optional `titleIdeas`, `category`, and `sourceSheetRows` from the configured Google Sheet — or use `AUTOMATION_FORCE_DATE=YYYY-MM-DD` if the user passed a date override
3. Generate the complete blog post following every rule in that file (plus `.agents/seo-content-writer` when writing)
4. Generate a `mainImage` using the image prompt rules; use Sanity MCP for image generation / assets as the rules describe
5. Fill every field in the pre-publish checklist
6. Publish the post to Sanity via **Sanity MCP** only
7. **Write the live URL** to the Google Sheet: `pnpm blog-automation:record-url -- <sheet_row> "https://www.saffron.town/blog/<slug>"` using the row number from `sourceSheetRows` (see rules)
8. Reply with the publish summary template from `.rules/blog-content.md`

**No keyword argument is required** — the keyword comes from the sheet for the matched date.

If the user passes a bare `/saffron-new-blog`, proceed without questions.
