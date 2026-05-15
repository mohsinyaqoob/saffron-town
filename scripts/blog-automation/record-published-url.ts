/**
 * Append a live blog URL into the sheet cell (`published_blog_link`, `published_url`, …).
 *
 * Requires: GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SHEET_ID (service account needs Editor on the sheet)
 *
 * Usage:
 *   pnpm blog-automation:record-url -- <sheet_row_number> <https://www.saffron.town/blog/slug>
 */

import { loadAutomationEnv } from "./loadEnv";
import { appendPublishedUrlForRow, fetchSheetRows } from "./sheet";

async function main() {
  const argv = process.argv.slice(2);
  const rowArg = argv.find((a) => /^\d+$/.test(a));
  const urlArg = argv.find((a) => /^https?:\/\//i.test(a));

  if (!rowArg || !urlArg) {
    console.error(
      "Usage: pnpm blog-automation:record-url -- <sheet_row_number> <post_url>",
    );
    process.exit(1);
  }

  const sheetRowNumber = Number.parseInt(rowArg, 10);
  const env = loadAutomationEnv({
    needGemini: false,
    needSanityWrite: false,
  });

  const sheetFetch = await fetchSheetRows(env);
  await appendPublishedUrlForRow(env, sheetFetch, sheetRowNumber, urlArg);
  console.log(
    `[blog-automation] Recorded URL on sheet row ${sheetRowNumber}: ${urlArg}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
