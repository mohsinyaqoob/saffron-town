import "dotenv/config";

const TZ_DEFAULT = "Asia/Kolkata";
const SITE_URL_DEFAULT = "https://www.saffron.town";

function req(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function opt(name: string, fallback: string): string {
  const v = process.env[name]?.trim();
  return v || fallback;
}

function optInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Google returns 404 for some IDs on newer API keys (e.g. gemini-2.0-flash). */
function resolveGeminiTextModel(model: string): string {
  const deprecated: Record<string, string> = {
    "gemini-2.0-flash": "gemini-2.5-flash",
    "gemini-2.0-flash-001": "gemini-2.5-flash",
    "gemini-2.0-flash-exp": "gemini-2.5-flash",
  };
  const m = model.trim();
  const replacement = deprecated[m];
  if (replacement) {
    console.warn(
      `[blog-automation] GEMINI_MODEL "${m}" is not available for your API key; using "${replacement}". Set GEMINI_MODEL=${replacement} in .env.`,
    );
    return replacement;
  }
  return m || "gemini-2.5-flash";
}

export type AutomationEnv = {
  timeZone: string;
  sitePublicUrl: string;
  spreadsheetId: string;
  sheetTab: string;
  postsPerKeyword: number;
  maxPostsPerRun: number;
  geminiModel: string;
  geminiImageModel: string;
  minDistinctInternalLinks: number;
  skipImageGeneration: boolean;
  defaultCategory: string;
  forceDate: string | null;
  projectId: string;
  dataset: string;
  apiVersion: string;
  googleServiceAccountJson: string;
  sanityWriteToken: string | null;
  geminiApiKey: string | null;
  defaultImageAssetRef: string | null;
  defaultAuthorId: string | null;
};

export type EnvRequirements = {
  /** Call Gemini (full run or --print-only). */
  needGemini: boolean;
  /** Create documents in Sanity. */
  needSanityWrite: boolean;
};

/** Placeholder / example IDs that still pass `opt()` but break Sanity API (e.g. undetected CI misconfiguration). */
function assertRealSanityProjectId(projectId: string): void {
  const id = projectId.trim();
  const lower = id.toLowerCase();
  const bad =
    lower === "your-project-id" ||
    lower === "your_project_id" ||
    lower === "changeme" ||
    lower === "placeholder" ||
    /^your[-_]project/i.test(id);
  if (bad) {
    throw new Error(
      `NEXT_PUBLIC_SANITY_PROJECT_ID looks like a placeholder (${JSON.stringify(id)}). ` +
        `Set your real Sanity project ID: GitHub repo → Settings → Secrets and variables → Actions → Variables, ` +
        `same value as NEXT_PUBLIC_SANITY_PROJECT_ID in local .env (manage.sanity.io → Project → Project ID).`,
    );
  }
}

export function loadAutomationEnv(reqs: EnvRequirements): AutomationEnv {
  const googleServiceAccountJson = req("GOOGLE_SERVICE_ACCOUNT_JSON");
  const spreadsheetId = opt("GOOGLE_SHEET_ID", "");
  if (!spreadsheetId) {
    throw new Error(
      "Missing GOOGLE_SHEET_ID (spreadsheet document id from the URL).",
    );
  }

  const sanityWriteToken = process.env.SANITY_API_WRITE_TOKEN?.trim() || null;
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim() || null;
  const defaultImageAssetRef =
    process.env.SANITY_DEFAULT_IMAGE_ASSET_REF?.trim() || null;
  const projectIdRaw = opt("NEXT_PUBLIC_SANITY_PROJECT_ID", "");

  if (reqs.needSanityWrite) {
    if (!sanityWriteToken) throw new Error("Missing SANITY_API_WRITE_TOKEN");
    if (!geminiApiKey) throw new Error("Missing GEMINI_API_KEY");
    const skipImg =
      process.env.AUTOMATION_SKIP_IMAGE_GENERATION?.trim() === "1";
    if (skipImg && !defaultImageAssetRef) {
      throw new Error(
        "AUTOMATION_SKIP_IMAGE_GENERATION=1 requires SANITY_DEFAULT_IMAGE_ASSET_REF as the static hero image.",
      );
    }
  }

  if (reqs.needGemini && !geminiApiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  if ((reqs.needGemini || reqs.needSanityWrite) && !projectIdRaw) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID (needed for internal links and/or publishing).",
    );
  }

  if (reqs.needGemini || reqs.needSanityWrite) {
    assertRealSanityProjectId(projectIdRaw);
  }

  return {
    timeZone: opt("AUTOMATION_TZ", TZ_DEFAULT),
    sitePublicUrl: opt("SITE_PUBLIC_URL", SITE_URL_DEFAULT).replace(/\/$/, ""),
    spreadsheetId,
    sheetTab: opt("GOOGLE_SHEET_RANGE", "Sheet1"),
    postsPerKeyword: optInt("AUTOMATION_POSTS_PER_KEYWORD", 3),
    maxPostsPerRun: optInt("AUTOMATION_MAX_POSTS_PER_RUN", 24),
    geminiModel: resolveGeminiTextModel(
      opt("GEMINI_MODEL", "gemini-2.5-flash"),
    ),
    geminiImageModel: opt("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image"),
    minDistinctInternalLinks: optInt("AUTOMATION_MIN_INTERNAL_LINKS", 3),
    skipImageGeneration:
      process.env.AUTOMATION_SKIP_IMAGE_GENERATION?.trim() === "1",
    defaultCategory: opt("AUTOMATION_DEFAULT_CATEGORY", "about-saffron"),
    forceDate: process.env.AUTOMATION_FORCE_DATE?.trim() || null,
    projectId: projectIdRaw,
    dataset: opt("NEXT_PUBLIC_SANITY_DATASET", "production"),
    apiVersion: opt("NEXT_PUBLIC_SANITY_API_VERSION", "2026-03-19"),
    googleServiceAccountJson,
    sanityWriteToken,
    geminiApiKey,
    defaultImageAssetRef,
    defaultAuthorId: process.env.SANITY_DEFAULT_AUTHOR_ID?.trim() || null,
  };
}
