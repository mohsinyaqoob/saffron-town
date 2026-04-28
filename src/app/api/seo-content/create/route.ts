import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";
import {
  SEO_CONTENT_COOKIE_NAME,
  verifySeoContentToken,
} from "@/lib/seo-content-session";
import { createSeoDraftPost } from "@/lib/seo-sanity-create-post";
import { getSanityWriteClient } from "@/sanity/write-client";

const MAX_KEYWORDS = 4000;
const MAX_INSTRUCTIONS = 12000;

export async function POST(request: Request) {
  const jar = await cookies();
  const token = jar.get(SEO_CONTENT_COOKIE_NAME)?.value;
  if (!verifySeoContentToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const client = getSanityWriteClient();
  if (!client) {
    return NextResponse.json(
      {
        error:
          "Sanity write client is not configured. Set SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID.",
      },
      { status: 503 },
    );
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const keywords =
    typeof (body as { keywords?: unknown })?.keywords === "string"
      ? (body as { keywords: string }).keywords.trim()
      : "";
  const instructions =
    typeof (body as { instructions?: unknown })?.instructions === "string"
      ? (body as { instructions: string }).instructions.trim()
      : "";
  const categoryHintRaw = (body as { categoryHint?: unknown }).categoryHint;
  const categoryHint =
    typeof categoryHintRaw === "string" && categoryHintRaw.trim()
      ? categoryHintRaw.trim()
      : undefined;

  if (!keywords || keywords.length > MAX_KEYWORDS) {
    return NextResponse.json(
      { error: `Keywords are required (max ${MAX_KEYWORDS} characters).` },
      { status: 400 },
    );
  }
  if (!instructions || instructions.length > MAX_INSTRUCTIONS) {
    return NextResponse.json(
      {
        error: `Instructions are required (max ${MAX_INSTRUCTIONS} characters).`,
      },
      { status: 400 },
    );
  }

  const result = await createSeoDraftPost({
    client,
    keywords,
    instructions,
    categoryHint,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    documentId: result.documentId,
    slug: result.slug,
    previewUrl: `${SITE_CONFIG.url}/blog/${result.slug}`,
    studioUrl: `${SITE_CONFIG.url}/studio`,
  });
}
