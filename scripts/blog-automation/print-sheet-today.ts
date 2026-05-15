/**
 * Print today's scheduled sheet rows as JSON (for agents running `/saffron-new-blog`).
 *
 * Requires: GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SHEET_ID
 * Optional: GOOGLE_SHEET_RANGE, AUTOMATION_TZ, AUTOMATION_FORCE_DATE=YYYY-MM-DD
 *
 * Usage: pnpm blog-automation:sheet-today
 */

import { ymdInTimeZone } from "./dates";
import { loadAutomationEnv } from "./loadEnv";
import { consolidateDuplicateDayKeywords, fetchSheetRows } from "./sheet";

async function main() {
  const env = loadAutomationEnv({
    needGemini: false,
    needSanityWrite: false,
  });

  const today =
    env.forceDate && /^\d{4}-\d{2}-\d{2}$/.test(env.forceDate)
      ? env.forceDate
      : ymdInTimeZone(env.timeZone);

  const sheetFetch = await fetchSheetRows(env);
  const dueRaw = sheetFetch.rows.filter((r) => r.scheduledOn === today);
  const schedules = consolidateDuplicateDayKeywords(
    dueRaw,
    env.postsPerKeyword,
  );

  console.log(
    JSON.stringify(
      {
        date: today,
        timeZone: env.timeZone,
        spreadsheetId: env.spreadsheetId,
        sheetTab: env.sheetTab,
        publishedUrlColumnConfigured:
          sheetFetch.publishedUrlColumnIndex !== null,
        schedules: schedules.map((s) => ({
          keyword: s.keyword,
          category: s.category,
          type: s.intentType,
          searchVolume: s.searchVolume,
          indexed: s.indexed,
          postsForRow: s.postsForRow ?? env.postsPerKeyword,
          titleIdeas: s.titleIdeas,
          sourceSheetRows: s.sourceSheetRows,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
