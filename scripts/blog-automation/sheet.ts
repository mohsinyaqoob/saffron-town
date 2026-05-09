import { google } from "googleapis";
import type { AutomationEnv } from "./loadEnv";

export type SheetRow = {
  scheduledOn: string; // YYYY-MM-DD
  keyword: string;
  category: string | null;
  postsForRow: number | null;
};

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Merge duplicate sheet lines with the same calendar date + keyword.
 *
 * - If every merged row has an empty **Posts** column: effective count =
 *   `max(defaultPostsPerKeyword, number of sheet rows)` so one row still yields
 *   the default (e.g. 3), while three identical rows yield 3 total posts, not 9.
 * - If any row has **Posts** set: effective count = sum of those values (missing
 *   treated as 0); if the sum is 0, fall back to `max(default, rowCount)`.
 */
export function consolidateDuplicateDayKeywords(
  rows: SheetRow[],
  defaultPostsPerKeyword: number,
): SheetRow[] {
  const groups = new Map<string, SheetRow[]>();
  for (const r of rows) {
    const key = `${r.scheduledOn}\t${norm(r.keyword)}`;
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }

  const out: SheetRow[] = [];
  for (const group of groups.values()) {
    out.push(mergeSheetRowGroup(group, defaultPostsPerKeyword));
  }
  return out;
}

function mergeSheetRowGroup(
  group: SheetRow[],
  defaultPostsPerKeyword: number,
): SheetRow {
  const first = group[0];
  const rowCount = group.length;
  const allPostsNull = group.every((r) => r.postsForRow == null);

  let posts: number;
  if (allPostsNull) {
    posts = Math.max(defaultPostsPerKeyword, rowCount);
  } else {
    const sum = group.reduce((s, r) => s + (r.postsForRow ?? 0), 0);
    posts = sum > 0 ? sum : Math.max(defaultPostsPerKeyword, rowCount);
  }

  const category = group.map((r) => r.category).find((c) => c?.trim()) ?? null;

  return {
    scheduledOn: first.scheduledOn,
    keyword: first.keyword.trim(),
    category: category ? category.trim() : null,
    postsForRow: posts,
  };
}

function parseYmd(cell: string): string | null {
  const t = cell.trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const slash = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slash) {
    const [, a, b, y] = slash;
    const mm = a.length === 2 ? a : a.padStart(2, "0");
    const dd = b.length === 2 ? b : b.padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return null;
}

function headerIndex(headerRow: string[], candidates: string[]): number | null {
  const lowered = headerRow.map((h) => norm(h));
  for (const c of candidates) {
    const i = lowered.indexOf(norm(c));
    if (i !== -1) return i;
  }
  return null;
}

/**
 * Expected sheet (row 1 = headers):
 * - Date | Keyword | Category (optional) | Posts (optional)
 * Extra columns ignored. Header names are matched case-insensitively.
 */
export async function fetchSheetRows(env: AutomationEnv): Promise<SheetRow[]> {
  const creds = JSON.parse(env.googleServiceAccountJson);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const range = env.sheetTab.includes("!")
    ? env.sheetTab
    : `${env.sheetTab}!A:Z`;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range,
    });
    const values = res.data.values;
    if (!values?.length) return [];

    const headerRow = values[0].map((c) => String(c ?? ""));
    const dateI = headerIndex(headerRow, [
      "date",
      "scheduled",
      "scheduled date",
      "publish date",
      "day",
    ]);
    const keyI = headerIndex(headerRow, ["keyword", "topic", "query", "key"]);
    if (dateI === null || keyI === null) {
      throw new Error(
        "Sheet must have headers for Date and Keyword (any common synonym).",
      );
    }
    const catI = headerIndex(headerRow, ["category", "cat"]);
    const postsI = headerIndex(headerRow, ["posts", "count", "posts per row"]);

    const rows: SheetRow[] = [];
    for (let r = 1; r < values.length; r++) {
      const line = values[r];
      const dateRaw = line?.[dateI] != null ? String(line[dateI]) : "";
      const keywordRaw = line?.[keyI] != null ? String(line[keyI]) : "";
      const ymd = parseYmd(dateRaw);
      const keyword = keywordRaw.trim();
      if (!ymd || !keyword) continue;

      let category: string | null = null;
      if (catI !== null && line?.[catI] != null) {
        const c = String(line[catI]).trim();
        category = c || null;
      }

      let postsForRow: number | null = null;
      if (postsI !== null && line?.[postsI] != null) {
        const n = Number.parseInt(String(line[postsI]).trim(), 10);
        if (Number.isFinite(n) && n > 0) postsForRow = n;
      }

      rows.push({ scheduledOn: ymd, keyword, category, postsForRow });
    }
    return rows;
  } catch (err: unknown) {
    const gaxios = err as { code?: number; message?: string };
    const serviceEmail =
      typeof creds.client_email === "string" ? creds.client_email : null;
    if (gaxios.code === 403) {
      throw new Error(
        `Google Sheets returned 403 (permission denied). Share the spreadsheet (${env.spreadsheetId}) with the service account email from GOOGLE_SERVICE_ACCOUNT_JSON — client_email: ${serviceEmail ?? "(missing in JSON)"}. In Sheets: Share → add that address as Viewer. Also enable "Google Sheets API" for the same GCP project as the key.`,
        { cause: err },
      );
    }
    throw err;
  }
}
