# SEO Audit Report — saffron.town

**Project:** Next.js 14 (App Router) + Sanity CMS  
**Domain:** saffron.town (note: `SITE_CONFIG.url` currently `https://saffron.town`)  
**Audit date:** 2025-03-20

---

## 1. Rendering & Metadata

| # | Status | Item | Note |
|---|--------|------|------|
| 1 | ✅ | Root metadata | `app/layout.tsx:21-58` — metadataBase, title.default, title.template, description, openGraph |
| 2 | ✅ | Product generateMetadata | `app/shop/saffron/page.tsx:13-43` — unique title, description, alternates.canonical |
| 3 | ✅ | Blog generateMetadata | `app/blog/[slug]/page.tsx:27-65` — fetches from Sanity, returns title, description, canonical, openGraph |
| 4 | ✅ | Blog SEO fallbacks | `app/blog/[slug]/page.tsx:35-36` — post.seo?.metaTitle \|\| post.title, post.seo?.metaDescription \|\| post.excerpt |
| 5 | ✅ | openGraph.type article | `app/blog/[slug]/page.tsx:51` — type: "article" |
| 6 | ✅ | openGraph.publishedTime | `app/blog/[slug]/page.tsx:54` — publishedTime: post.publishedAt |
| 7 | ✅ | No duplicate titles | Layout template `%s | Saffron Town`; each page sets unique title |
| 8 | ✅ | Product force-static | `app/shop/saffron/page.tsx:11` — export const dynamic = "force-static" |
| 9 | ✅ | Blog revalidate | `app/blog/[slug]/page.tsx:18` — export const revalidate = 60 |
| 10 | ✅ | generateStaticParams | `app/blog/[slug]/page.tsx:20-25` — pre-builds all Sanity slugs |
| 11 | ⚠️ | No client-rendered content | ProductView (`ProductView.tsx:1`) and PortableText (`PortableText.tsx:1`) are `"use client"` — product description and blog body render client-side. Google indexes JS, but server-rendered is more reliable. |

---

## 2. Sitemap & Crawling

| # | Status | Item | Note |
|---|--------|------|------|
| 12 | ✅ | app/sitemap.ts exists | `app/sitemap.ts` — returns MetadataRoute.Sitemap |
| 13 | ⚠️ | Products listing page | Sitemap has /, /blog, /our-story, /contact, /shop/saffron. No separate /shop or /products listing page — only one product. Acceptable for single-product store. |
| 14 | ✅ | Sitemap includes blog | `app/sitemap.ts:36-46` — fetches Sanity posts dynamically |
| 15 | ✅ | Sitemap includes products | `app/sitemap.ts:22-33` — product URLs included |
| 16 | ✅ | Sitemap entry fields | Each entry has lastModified, changeFrequency, priority |
| 17 | ✅ | app/robots.ts exists | `app/robots.ts` — valid robots config |
| 18 | ✅ | robots allows / | `app/robots.ts:9` — allow: "/" |
| 19 | ✅ | robots disallows /studio/, /api/ | `app/robots.ts:10` — disallow: ["/api/", "/studio/", "/admin/", ...] |
| 20 | ❌ | robots sitemap URL | `app/robots.ts:20` — sitemap uses SITE_CONFIG.url = `https://saffron.town` — audit expects `https://saffron.town` |

---

## 3. Structured Data (JSON-LD)

| # | Status | Item | Note |
|---|--------|------|------|
| 21 | ✅ | ProductSchema on product page | `ProductJsonLd` in `app/shop/saffron/page.tsx:50` |
| 22 | ✅ | Product schema fields | name, description, image, brand, offers (price, priceCurrency, availability, url, seller) |
| 23 | ✅ | ArticleSchema on blog | `ArticleJsonLd` in `app/blog/[slug]/page.tsx:80-88` |
| 24 | ✅ | Article schema fields | headline, description, image, datePublished, dateModified, author, publisher |
| 25 | ⚠️ | BreadcrumbList on blog | Product page has BreadcrumbJsonLd; **blog post page does not** |
| 26 | ✅ | JSON-LD in page (not client) | ProductJsonLd, ArticleJsonLd, BreadcrumbJsonLd are server components |
| 27 | ✅ | Absolute URLs in schema | SITE_CONFIG.url used for all url/item values |

---

## 4. Sanity CMS Blog Setup

| # | Status | Item | Note |
|---|--------|------|------|
| 28 | ✅ | slug with source: title | `sanity/schemaTypes/post.ts:26-28` — options: { source: "title" } |
| 29 | ✅ | publishedAt | `sanity/schemaTypes/post.ts:91-96` |
| 30 | ✅ | excerpt | `sanity/schemaTypes/post.ts:32-39` |
| 31 | ✅ | author | `sanity/schemaTypes/post.ts:76-82` |
| 32 | ✅ | featuredImage (mainImage) | `sanity/schemaTypes/post.ts:42-47` — mainImage with hotspot |
| 33 | ✅ | seo object | `sanity/schemaTypes/post.ts:112-117` — metaTitle, metaDescription, ogImage |
| 34 | ✅ | Inline image alt | `sanity/schemaTypes/post.ts:59-66` — alt field in body image |
| 35 | ✅ | alt required | `sanity/schemaTypes/post.ts:65` — validation: rule.required() |
| 36 | ✅ | PortableText | `PortableText.tsx` — uses @portabletext/react |
| 37 | ✅ | Custom block components | h2, h3, normal, blockquote, lists mapped |
| 38 | ✅ | One h1 per post | Post title is h1 outside PortableText; block mapping has no h1 |
| 39 | ✅ | No h1 in PortableText | Block mapping only h2, h3 — no h1 |
| 40 | ✅ | Inline images with alt | `PortableText.tsx:21` — alt={value.alt \|\| ""}; schema requires alt |

---

## 5. Images & Performance

| # | Status | Item | Note |
|---|--------|------|------|
| 41 | ✅ | All next/image | No raw `<img>` tags in src |
| 42 | ⚠️ | priority only on hero | Hero, Header logo, ProductView main, Blog hero all use priority — Header logo is LCP-critical, acceptable. Multiple above-fold images per page. |
| 43 | ✅ | Descriptive alt | All Image components have non-empty alt |
| 44 | ⚠️ | Empty alt fallback | `PortableText.tsx:21` — value.alt \|\| "" — fallback to empty if missing (schema requires alt) |
| 45 | ✅ | next/font | `app/layout.tsx:7-17` — Playfair_Display, Figtree from next/font/google |
| 46 | ⚠️ | GA script strategy | Uses @next/third-parties GoogleAnalytics — loads via next/script; strategy not explicitly afterInteractive |

---

## 6. Technical SEO Hygiene

| # | Status | Item | Note |
|---|--------|------|------|
| 47 | ✅ | No localhost links | No hardcoded localhost in src |
| 48 | ❌ | metadataBase domain | `SITE_CONFIG.url` = `https://saffron.town` — audit expects `https://saffron.town` |
| 49 | ✅ | No accidental noindex | Only post.seo?.noIndex when explicitly set |
| 50 | ✅ | Unique product content | Single product with unique description |
| 51 | ✅ | Blog slugs | Sanity slug.current — lowercase, hyphenated |
| 52 | ❌ | 404 page | No `app/not-found.tsx` |
| 53 | ✅ | No redirects needed | next.config has no redirects (none required) |
| 54 | ✅ | No X-Robots noindex | next.config has no headers() blocking indexing |

---

## 7. Launch Readiness

| # | Status | Item | Note |
|---|--------|------|------|
| 55 | ⚠️ | sitemap.xml live | Depends on deploy; SITE_CONFIG.url must match production domain |
| 56 | ⚠️ | robots.txt live | Same as above |
| 57 | ✅ | JSON-LD in source | Schema in server components — in initial HTML |
| 58 | ✅ | title/meta in source | generateMetadata outputs server-rendered |
| 59 | ✅ | GA from env | `app/layout.tsx:85-86` — process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID |
| 60 | ⚠️ | Sanity from env | `src/sanity/client.ts:3-4` — fallback to "abc12345"/"production" if env missing; should require env in production |

---

## Summary by Section

| Section | ✅ | ⚠️ | ❌ |
|---------|---:|---:|---:|
| 1. Rendering & Metadata | 10 | 1 | 0 |
| 2. Sitemap & Crawling | 8 | 1 | 1 |
| 3. Structured Data | 6 | 1 | 0 |
| 4. Sanity CMS | 13 | 0 | 0 |
| 5. Images & Performance | 4 | 2 | 0 |
| 6. Technical SEO | 6 | 0 | 2 |
| 7. Launch Readiness | 4 | 2 | 0 |
| **Total** | **51** | **7** | **3** |

---

## Prioritised Fix List

### ❌ Critical (fix first)

#### 1. Add 404 page
**File:** `src/app/not-found.tsx` (create)

```tsx
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-4">Page not found</h1>
        <p className="text-secondary font-body mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/" className="text-primary font-semibold hover:underline">
          Return home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
```

#### 2. Set domain to saffron.town
**File:** `src/lib/constants.ts`

```ts
// Line 4: Change from
url: "https://saffron.town",
// To
url: "https://saffron.town",
```

Also update `email` and `orderEmail` if using @saffron.town.

#### 3. Sanity client: require env in production
**File:** `src/sanity/client.ts`

```ts
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (process.env.NODE_ENV === "production" && (!projectId || !dataset)) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required in production");
}

export const client = createClient({
  projectId: projectId || "abc12345",
  dataset: dataset || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});
```

---

### ⚠️ Important (fix next)

#### 4. Add BreadcrumbJsonLd to blog post page
**File:** `src/app/blog/[slug]/page.tsx`

Add import:
```ts
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
```

Add inside the return, after `<ArticleJsonLd>`:
```tsx
<BreadcrumbJsonLd
  items={[
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
    { name: post.title, url: `${SITE_CONFIG.url}/blog/${slug}` },
  ]}
/>
```

#### 5. PortableText inline images: non-empty alt fallback
**File:** `src/components/PortableText.tsx`

Change line 21 from:
```ts
alt={value.alt || ""}
```
To:
```ts
alt={value.alt || "Blog post image"}
```

#### 6. Consider server-rendering product/blog content
- **ProductView:** Split into a server-rendered wrapper that passes product data, and a client-only part for add-to-cart, variant selection, etc. The description/hero text can stay server-rendered.
- **PortableText:** Refactor to a server component if possible, or ensure the blog page fetches and passes content so the initial HTML includes it (Next.js may already stream it; verify with View Source).

#### 7. Products listing in sitemap
If you add a `/shop` listing page, add it to the sitemap in `app/sitemap.ts`:
```ts
{ url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
```

---

## Additional SEO Issues (not in checklist)

1. **Blog post openGraph authors format** — `authors: [post.author]` is a string; Open Graph expects an array of author URLs or names. Consider `author` (singular) or proper `article:author` format.

2. **ArticleJsonLd image** — Receives `post.seo?.ogImage || post.image`; ensure `image` is always an absolute URL (blog-data already uses urlFor for mainImage).

3. **BreadcrumbJsonLd schema** — For richer results, use `"item": { "@id": "https://..." }` instead of `"item": "https://..."`.

4. **Twitter handle** — Layout has `site: "@saffrontown"`; confirm this matches the real handle for saffron.town.

5. **EstimatedReadingTime** — Sanity has 1–60 min validation; blog-data fallback is 5. Ensure Sanity content sets this.
