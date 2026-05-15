import { google } from "googleapis";
import type { AutomationEnv } from "./loadEnv";

export type SheetRow = {
  scheduledOn: string; // YYYY-MM-DD
  keyword: string;
  /** Resolved Sanity blog category when the sheet supplies a valid slug or mappable `type`. */
  category: string | null;
  postsForRow: number | null;
  /** Optional comma-separated title suggestions from the sheet (for agents). */
  titleIdeas: string | null;
  /** Raw `type` column (e.g. Transactional, Educational) before category mapping. */
  intentType: string | null;
  /** Parsed `search_volume` when present. */
  searchVolume: number | null;
  /** Raw `indexed` cell (e.g. pending, yes); reserved for tooling — not written by automation yet. */
  indexed: string | null;
  /** 1-based spreadsheet row numbers backing this schedule (write-back targets). */
  sourceSheetRows: number[];
};

export type SheetFetchResult = {
  headers: string[];
  rows: SheetRow[];
  publishedUrlColumnIndex: number | null;
};

/** Lowercase trim; underscores become spaces so `published_blog_link` matches `published blog link`. */
function norm(s: string) {
  return s.trim().toLowerCase().replace(/_/g, " ").replace(/\s+/g, " ");
}

const SANITY_BLOG_CATEGORIES = new Set([
  "health",
  "recipes",
  "buying-guide",
  "about-saffron",
]);

/** Cell value is already a Sanity `category` slug (with optional spaced label). */
function parseExplicitBlogCategory(
  cell: string | null | undefined,
): string | null {
  if (cell == null || !String(cell).trim()) return null;
  const slug = norm(String(cell)).replace(/\s+/g, "-");
  return SANITY_BLOG_CATEGORIES.has(slug) ? slug : null;
}

/**
 * Map editorial `type` labels (Transactional, Educational, …) to Sanity categories.
 * Prefer an explicit Category column when present; this fills gaps.
 */
export function mapSheetTypeToBlogCategory(
  typeRaw: string | null,
): string | null {
  if (typeRaw == null || !String(typeRaw).trim()) return null;
  const t = norm(String(typeRaw));
  if (/\btransaction\w*|\bcommercial\b/.test(t)) return "buying-guide";
  if (/\beducational\b/.test(t)) return "health";
  if (/\binformational\b/.test(t)) return "about-saffron";
  if (/\brecipe\b|\bcooking\b|\bkitchen\b/.test(t)) return "recipes";
  if (/\bhealth\b|\bwellness\b|\bnutrition\b|\bpregnancy\b/.test(t)) {
    return "health";
  }
  return null;
}

function parseSearchVolumeCell(cell: string | null | undefined): number | null {
  if (cell == null || !String(cell).trim()) return null;
  const n = Number.parseInt(String(cell).replace(/,/g, "").trim(), 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function resolveRowCategory(
  categoryCell: string | null | undefined,
  typeCell: string | null | undefined,
): string | null {
  const explicit =
    categoryCell != null
      ? parseExplicitBlogCategory(String(categoryCell))
      : null;
  if (explicit) return explicit;
  const raw = typeCell == null ? null : String(typeCell).trim() || null;
  return mapSheetTypeToBlogCategory(raw);
}

/**
 * Merge duplicate sheet lines with the same calendar date + keyword.
 *
 * - If every merged row has an empty **total_posts** / **Posts** column: effective count =
 *   `max(defaultPostsPerKeyword, number of sheet rows)` so one row still yields
 *   the default (e.g. 3), while three identical rows yield 3 total posts, not 9.
 * - If any row has **total_posts** set: effective count = sum of those values (missing
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
  const titleIdeas =
    group.map((r) => r.titleIdeas).find((t) => t?.trim()) ?? null;
  const intentType =
    group.map((r) => r.intentType).find((t) => t?.trim()) ?? null;
  const searchVolume =
    group.map((r) => r.searchVolume).find((v) => v != null) ?? null;
  const indexed = group.map((r) => r.indexed).find((x) => x?.trim()) ?? null;
  const sourceSheetRows = [
    ...new Set(group.flatMap((r) => r.sourceSheetRows)),
  ].sort((a, b) => a - b);

  return {
    scheduledOn: first.scheduledOn,
    keyword: first.keyword.trim(),
    category: category ? category.trim() : null,
    postsForRow: posts,
    titleIdeas: titleIdeas ? titleIdeas.trim() : null,
    intentType: intentType ? intentType.trim() : null,
    searchVolume,
    indexed: indexed ? indexed.trim() : null,
    sourceSheetRows,
  };
}

function parseYmd(cell: string): string | null {
  const t = cell.trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;

  const two = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2})$/);
  if (two) {
    const y = 2000 + Number.parseInt(two[3], 10);
    return slashDayMonthToIso(two[1], two[2], y);
  }

  const four = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (four) {
    return slashDayMonthToIso(four[1], four[2], Number.parseInt(four[3], 10));
  }

  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return null;
}

/**
 * DD/MM/YYYY and DD/MM/YY (India-style) when the first day segment is >12,
 * otherwise MM/DD for US-style when the second segment is >12; if both ≤12,
 * assume DD/MM (matches common editorial calendars in IST).
 */
function slashDayMonthToIso(a: string, b: string, year: number): string | null {
  const n1 = Number.parseInt(a, 10);
  const n2 = Number.parseInt(b, 10);
  let day: number;
  let month: number;
  if (n1 > 12) {
    day = n1;
    month = n2;
  } else if (n2 > 12) {
    month = n1;
    day = n2;
  } else {
    day = n1;
    month = n2;
  }
  if (
    !Number.isFinite(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function headerIndex(headerRow: string[], candidates: string[]): number | null {
  const lowered = headerRow.map((h) => norm(h));
  for (const c of candidates) {
    const i = lowered.indexOf(norm(c));
    if (i !== -1) return i;
  }
  return null;
}

/** When headers include suffixes like `title_ideas (comma separated)`. */
function headerIndexStartsWith(
  headerRow: string[],
  prefixes: string[],
): number | null {
  const lowered = headerRow.map((h) => norm(h));
  for (let i = 0; i < lowered.length; i++) {
    const h = lowered[i];
    for (const p of prefixes) {
      const np = norm(p);
      if (h === np || h.startsWith(`${np} `) || h.startsWith(`${np}(`)) {
        return i;
      }
    }
  }
  return null;
}

/** Tab name portion of GOOGLE_SHEET_RANGE (e.g. `Planning` from `Planning!A:Z`). */
export function sheetTabNameOnly(tabOrRange: string): string {
  const raw = tabOrRange.includes("!")
    ? tabOrRange.slice(0, tabOrRange.indexOf("!"))
    : tabOrRange;
  return raw.replace(/^'+|'+$/g, "") || "Sheet1";
}

function escapeSheetTabForRange(tab: string): string {
  const t = tab.replace(/^'+|'+$/g, "");
  return /[\s']/.test(t) ? `'${t.replace(/'/g, "''")}'` : t;
}

function columnIndexToA1Letters(zeroBased: number): string {
  let n = zeroBased + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function sheetsClient(env: AutomationEnv) {
  const creds = JSON.parse(env.googleServiceAccountJson);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/**
 * Expected sheet (row 1 = headers), common layout:
 *
 * date | keyword | title_ideas | search_volume | type | published_blog_link | indexed | total_posts
 *
 * Also supported: legacy **Category**, **Posts**, **published_url**, etc.
 * Headers are matched case-insensitively; underscores in headers normalize like spaces.
 *
 * **`published_blog_link`** (and synonyms) receives live URLs after publish (comma-append).
 */
export async function fetchSheetRows(
  env: AutomationEnv,
): Promise<SheetFetchResult> {
  const sheets = sheetsClient(env);
  const credsObj = JSON.parse(env.googleServiceAccountJson) as {
    client_email?: string;
  };

  const range = env.sheetTab.includes("!")
    ? env.sheetTab
    : `${env.sheetTab}!A:Z`;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range,
    });
    const values = res.data.values;
    if (!values?.length) {
      return { headers: [], rows: [], publishedUrlColumnIndex: null };
    }

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
    const postsI = headerIndex(headerRow, [
      "posts",
      "count",
      "posts per row",
      "total_posts",
      "total posts",
    ]);
    let titleIdeasI = headerIndex(headerRow, [
      "title_ideas",
      "title ideas",
      "titles",
      "title options",
    ]);
    if (titleIdeasI === null) {
      titleIdeasI = headerIndexStartsWith(headerRow, [
        "title_ideas",
        "title ideas",
      ]);
    }
    const searchVolI = headerIndex(headerRow, [
      "search_volume",
      "search volume",
      "volume",
    ]);
    const typeI = headerIndex(headerRow, ["type", "intent"]);
    const indexedI = headerIndex(headerRow, ["indexed", "index status"]);
    const publishedUrlI = headerIndex(headerRow, [
      "published_blog_link",
      "published blog link",
      "published_url",
      "published url",
      "live url",
      "post url",
    ]);

    const rows: SheetRow[] = [];
    for (let r = 1; r < values.length; r++) {
      const line = values[r];
      const dateRaw = line?.[dateI] != null ? String(line[dateI]) : "";
      const keywordRaw = line?.[keyI] != null ? String(line[keyI]) : "";
      const ymd = parseYmd(dateRaw);
      const keyword = keywordRaw.trim();
      if (!ymd || !keyword) continue;

      let categoryCell: string | null = null;
      if (catI !== null && line?.[catI] != null) {
        const c = String(line[catI]).trim();
        categoryCell = c || null;
      }

      let intentType: string | null = null;
      if (typeI !== null && line?.[typeI] != null) {
        const t = String(line[typeI]).trim();
        intentType = t || null;
      }

      const category = resolveRowCategory(categoryCell, intentType);

      let postsForRow: number | null = null;
      if (postsI !== null && line?.[postsI] != null) {
        const n = Number.parseInt(String(line[postsI]).trim(), 10);
        if (Number.isFinite(n) && n > 0) postsForRow = n;
      }

      let titleIdeas: string | null = null;
      if (titleIdeasI !== null && line?.[titleIdeasI] != null) {
        const t = String(line[titleIdeasI]).trim();
        titleIdeas = t || null;
      }

      let searchVolume: number | null = null;
      if (searchVolI !== null && line?.[searchVolI] != null) {
        searchVolume = parseSearchVolumeCell(line[searchVolI]);
      }

      let indexed: string | null = null;
      if (indexedI !== null && line?.[indexedI] != null) {
        const x = String(line[indexedI]).trim();
        indexed = x || null;
      }

      rows.push({
        scheduledOn: ymd,
        keyword,
        category,
        postsForRow,
        titleIdeas,
        intentType,
        searchVolume,
        indexed,
        sourceSheetRows: [r + 1],
      });
    }
    return {
      headers: headerRow,
      rows,
      publishedUrlColumnIndex: publishedUrlI,
    };
  } catch (err: unknown) {
    const gaxios = err as { code?: number; message?: string };
    const serviceEmail =
      typeof credsObj.client_email === "string" ? credsObj.client_email : null;
    if (gaxios.code === 403) {
      throw new Error(
        `Google Sheets returned 403 (permission denied). Share the spreadsheet (${env.spreadsheetId}) with the service account email from GOOGLE_SERVICE_ACCOUNT_JSON — client_email: ${serviceEmail ?? "(missing in JSON)"}. In Sheets: Share → Editor (required to write published_blog_link / published_url). Enable "Google Sheets API" on the GCP project.`,
        { cause: err },
      );
    }
    throw err;
  }
}

/**
 * Append `url` to the live-URL column (`published_blog_link`, `published_url`, …).
 */
export async function appendPublishedUrlForRow(
  env: AutomationEnv,
  fetchResult: SheetFetchResult,
  sheetRowNumber: number,
  url: string,
): Promise<void> {
  if (fetchResult.publishedUrlColumnIndex === null) {
    console.warn(
      "[blog-automation] No published_blog_link / published_url column on sheet — skipping URL write-back.",
    );
    return;
  }

  const sheets = sheetsClient(env);
  const tab = escapeSheetTabForRange(sheetTabNameOnly(env.sheetTab));
  const col = columnIndexToA1Letters(fetchResult.publishedUrlColumnIndex);
  const range = `${tab}!${col}${sheetRowNumber}`;

  let prev = "";
  try {
    const cur = await sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range,
    });
    const cell = cur.data.values?.[0]?.[0];
    prev = cell != null ? String(cell).trim() : "";
  } catch {
    prev = "";
  }

  const next = prev && prev.length > 0 ? `${prev}, ${url.trim()}` : url.trim();

  await sheets.spreadsheets.values.update({
    spreadsheetId: env.spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[next]] },
  });
}
