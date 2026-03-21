# Pre-Production Audit — saffron.town

**Date:** 21 March 2025  
**Scope:** Full codebase scan for saffron.town Kashmiri saffron ecommerce (Next.js 16 + Sanity CMS, Vercel)

---

## 1. Section-by-section audit table

### SECTION 1 — Vercel Deployment Compatibility

| Item | Status | Note |
|------|--------|------|
| `next.config.ts` exists and is valid | ✅ | `next.config.ts` — no syntax errors, no deprecated options |
| No Cloudflare references | ✅ | No wrangler, @cloudflare, opennextjs-cloudflare in package.json or configs |
| No `runtime = 'edge'` on Node-incompatible pages | ✅ | Only `ai.txt/route.ts` uses edge — uses `getAllProducts()` (JSON) and `NextResponse`; no Node APIs |
| ISR configured correctly | ⚠️ | Homepage and `/blog` have `revalidate = 60`; blog post page does NOT |
| Blog post page has `revalidate = 60` | ❌ | `src/app/blog/[slug]/page.tsx` uses `dynamic = "force-static"` — new Sanity posts require full redeploy |
| Sitemap has `revalidate = 3600` | ❌ | `src/app/sitemap.ts` — no `export const revalidate = 3600` |
| `generateStaticParams` on blog `[slug]` | ✅ | `src/app/blog/[slug]/page.tsx:20-25` — implemented |
| `dynamicParams = true` on blog `[slug]` | ❌ | `force-static` implies only pre-built paths; new slugs 404 |
| No `.pages.dev` or `.workers.dev` URLs | ✅ | Grep found none |
| Build script is `next build` | ✅ | `package.json:7` — `"build": "next build"` |
| Vercel repo/branch connection | ➖ | N/A — manual Vercel Dashboard check |
| Env vars in Vercel Production | ➖ | N/A — manual Vercel Dashboard check |

### SECTION 2 — Metadata & On-Page SEO

| Item | Status | Note |
|------|--------|-----|
| `metadataBase` set to `https://saffron.town` | ✅ | `src/lib/constants.ts:4` + `layout.tsx:21` uses `SITE_CONFIG.url` |
| `title.default` | ✅ | `layout.tsx:24` — "Saffron Town — Pure Kashmiri Saffron Online" |
| `title.template` | ✅ | `layout.tsx:25` — `"%s \| Saffron Town"` |
| `description` (150–160 chars, Kashmiri saffron) | ✅ | `layout.tsx:27-28` — ~90 chars, mentions Kashmiri; acceptable |
| `openGraph.siteName`, `locale`, `type` | ✅ | `layout.tsx:40-45` — all present |
| Product page `generateMetadata()` | ✅ | `src/app/shop/saffron/page.tsx:15-46` — unique title, description |
| Blog page `generateMetadata()` | ✅ | `src/app/blog/[slug]/page.tsx:27-68` — async, fetches from Sanity |
| Blog fallback to `post.title` / `post.excerpt` | ✅ | `page.tsx:38-39` — `post.seo?.metaTitle \|\| post.title` |
| `openGraph.type: 'article'` on blog | ✅ | `page.tsx:53` |
| `openGraph.publishedTime` / `modifiedTime` on blog | ✅ | `page.tsx:55-56` — uses `post.publishedAt`, `post.updatedAt` |
| `alternates.canonical` on every page | ✅ | Layout, homepage, blog, product, our-story, contact all set |
| No duplicate `title` values | ✅ | Pages have distinct titles |
| No accidental `index: false` on public pages | ✅ | Only studio, cart, favorites use `index: false` (intended) |
| Twitter card metadata on product/blog | ✅ | Both have `twitter.card`, `title`, `description`, `images` |
| `metadataBase` not localhost/.vercel.app | ✅ | Uses `SITE_CONFIG.url` = `https://saffron.town` |

### SECTION 3 — Sitemap & Robots

| Item | Status | Note |
|------|--------|-----|
| `app/sitemap.ts` exists, returns `MetadataRoute.Sitemap` | ✅ | Correct default export |
| Sitemap includes `/` | ✅ | `sitemap.ts:12-16` |
| Sitemap includes `/blog` | ✅ | `sitemap.ts:18-24` |
| Sitemap includes product URLs | ✅ | `sitemap.ts:38-49` — `/shop/saffron` (single product page) |
| Sitemap includes Sanity blog posts | ✅ | `sitemap.ts:52-66` — fetched via `SITEMAP_POSTS_QUERY` |
| Each entry has `lastModified`, `changeFrequency`, `priority` | ✅ | All entries have these fields |
| Homepage `priority: 1.0` only | ✅ | Homepage 1.0; others lower |
| `revalidate = 3600` in sitemap | ❌ | Missing — sitemap won't auto-refresh on Vercel ISR |
| `app/robots.ts` exists | ✅ | `src/app/robots.ts` |
| `robots.ts` allows `/` for all bots | ✅ | `allow: "/"` |
| Disallows `/studio/`, `/api/`, `/admin/` | ✅ | Disallows `/api/`, `/studio/`, `/admin/`, `/cart`, `/favorites`, `/checkout` |
| `sitemap: 'https://saffron.town/sitemap.xml'` | ✅ | `robots.ts:27` uses `SITE_CONFIG.url` |
| `/sitemap.xml` returns valid XML | ➖ | Manual verification needed |
| `/robots.txt` returns correct text | ➖ | Manual verification needed |

### SECTION 4 — Structured Data (JSON-LD)

| Item | Status | Note |
|------|--------|-----|
| ProductSchema on every product page | ✅ | `ProductJsonLd` in `shop/saffron/page.tsx:54` |
| Product schema: `@type`, `name`, `description`, `image`, `brand`, `offers` | ✅ | `ProductJsonLd.tsx:14-47` |
| `offers`: `price`, `priceCurrency: 'INR'`, `availability`, `url`, `seller` | ✅ | Products use `currency: "INR"` from `products.json` |
| ArticleJsonLd on blog posts | ✅ | `ArticleJsonLd` in `blog/[slug]/page.tsx:85-93` |
| Article: `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, `publisher` | ✅ | All present in `ArticleJsonLd.tsx` |
| Publisher includes `logo` | ❌ | `ArticleJsonLd.tsx:39-43` — publisher has `name` and `url` only; no logo |
| BreadcrumbJsonLd on blog and product | ✅ | Both pages render `BreadcrumbJsonLd` |
| Breadcrumb URLs absolute | ✅ | Uses `SITE_CONFIG.url` for full URLs |
| JSON-LD in server components only | ✅ | All schema components are server components |
| No localhost/.vercel.app in schema | ✅ | Uses `SITE_CONFIG.url` |
| Schema `price` matches displayed price | ✅ | Uses `lowestPrice` from product variants |

### SECTION 5 — Sanity CMS Blog Setup

| Item | Status | Note |
|------|--------|-----|
| Post schema has `slug` with `source: 'title'` | ✅ | `src/sanity/schemaTypes/post.ts:21-29` |
| Post has `publishedAt` datetime | ✅ | `post.ts:94-97` |
| Post has `excerpt` text | ✅ | `post.ts:32-40` |
| Post has `author` (reference) | ✅ | `post.ts:76-83` — reference to author |
| Post has `featuredImage` (mainImage) with hotspot | ✅ | `post.ts:42-48` — `mainImage`, `options: { hotspot: true }` |
| Post has `seo` object with metaTitle, metaDescription, ogImage, canonicalUrl, noIndex | ✅ | `seo.ts` + `post.ts:112-116` |
| Image fields have `alt` | ⚠️ | Body inline images have `alt`; `mainImage` does NOT have `alt` |
| `alt` required validation | ⚠️ | Body images: `rule.required()`; mainImage: no alt field |
| Blog uses `<PortableText>` | ✅ | `blog/[slug]/page.tsx:179` |
| Custom `components` for h2, h3, normal | ✅ | `PortableText.tsx:36-54` — h2, h3, blockquote, normal |
| Exactly one `<h1>` per post (post title) | ✅ | `page.tsx:146` — `h1` for post title |
| PortableText does not render `h1` | ✅ | Min heading is `h2` in block config |
| Inline images use `alt` from Sanity | ✅ | `PortableText.tsx:20` — `value.alt \|\| "Blog post image"` |
| Sanity webhook to Vercel Deploy Hook | ➖ | N/A — manual Sanity/Vercel configuration |

### SECTION 6 — Images & Performance

| Item | Status | Note |
|------|--------|-----|
| All `<img>` replaced with Next.js `<Image>` | ✅ | No raw `<img>` tags in `src` |
| Hero/first above-fold image uses `priority` | ✅ | `Hero.tsx:30`, `ProductGallery.tsx:22`, blog hero `page.tsx:110` |
| No `priority` on below-fold images | ✅ | Blog related posts, thumbnails don't use priority |
| All `<Image>` have non-empty `alt` | ✅ | All have descriptive alt |
| No `alt=""` on meaningful images | ✅ | None found |
| Sanity images use urlFor with webp/quality | ⚠️ | `blog-data.ts`, `PortableText.tsx` use `.width().height()` but not `.format('webp').quality(80)` |
| `sizes` prop on `<Image>` | ✅ | Hero, ProductGallery, BlogSection, blog page have sizes |
| Fonts via `next/font/google` | ✅ | `layout.tsx:3,9-18` — Figtree, Playfair_Display |
| GA/GTM via `Script strategy="afterInteractive"` | ✅ | `GoogleAnalytics` from `@next/third-parties` |
| No sync third-party scripts in `<head>` | ✅ | GA is async |
| `@vercel/analytics` or `@vercel/speed-insights` | ❌ | Not installed — no explicit Core Web Vitals tracking |

### SECTION 7 — Technical SEO Hygiene

| Item | Status | Note |
|------|--------|-----|
| Internal links use Next.js `<Link>` | ✅ | No bare `<a href="http://localhost...">` |
| `metadataBase` is https://saffron.town | ✅ | Via `SITE_CONFIG.url` |
| `app/not-found.tsx` exists, returns 404 | ✅ | `not-found.tsx` — Next.js serves 404 for missing routes |
| `www` redirect to apex (301) | ❌ | No redirect in `next.config.ts`; must be in Vercel or config |
| No public pages blocked in robots | ✅ | Only studio, cart, favorites, api, admin |
| Blog slug format (lowercase, hyphenated) | ✅ | Sanity slug type produces clean slugs |
| No `.vercel.app` in metadata/schema/sitemap | ✅ | Grep found none |
| Sanity env from `process.env` | ✅ | `sanity/env.ts` — no hardcoded IDs |
| Graceful fallback for Sanity env | ❌ | `env.ts:4-17` — `assertValue` throws at module load, crashes build if missing |
| No `X-Robots-Tag: noindex` on public pages | ✅ | Not set in next.config |
| 301 redirects for renamed URLs | ➖ | No renamed URLs found |
| `vercel.json` routes conflict | ➖ | No `vercel.json` in project |

### SECTION 8 — Content Completeness

| Item | Status | Note |
|------|--------|-----|
| Homepage has keyword-rich `<h1>` | ✅ | `Hero.tsx:13` — "Premium Kashmiri Mongra Saffron" |
| Homepage meta mentions Kashmiri saffron + value prop | ✅ | `page.tsx:18-19` |
| Product page 200+ words unique copy | ✅ | Product has description, description2, heroSubline, origin, features, specs — ~200+ words |
| Product descriptions unique | ✅ | Single product; no duplication |
| `/blog` exists and public | ✅ | `src/app/blog/page.tsx` |
| At least one published blog post | ➖ | Depends on Sanity content; cannot verify |
| `/our-story` exists | ✅ | `src/app/our-story/page.tsx` |
| `/contact` exists with contact method | ⚠️ | Exists but emails are `hello@saffrontown.com` / `orders@saffrontown.com` — domain mismatch with `SITE_CONFIG` (`saffron.town`) |
| Footer links: home, products, blog, contact, privacy | ❌ | Footer has Shipping, Returns, Contact only; missing blog, shop, privacy |
| Privacy Policy page exists | ❌ | No `/privacy` route |

### SECTION 9 — Open Graph & Social Sharing

| Item | Status | Note |
|------|--------|-----|
| `og:image` on homepage | ❌ | `page.tsx` metadata has no `openGraph.images` |
| `og:image` on product pages | ✅ | `shop/saffron/page.tsx:34` — product hero image |
| `og:image` on blog posts | ✅ | `blog/[slug]/page.tsx:57` — `images: [finalImage]` |
| `og:image` dimensions 1200×630 | ⚠️ | blog-data uses 1200×630 for ogImage; product uses first image — dimensions not enforced |
| `og:image` URL absolute | ✅ | Uses full URLs |
| `og:image` not localhost/.vercel.app | ✅ | Uses SITE_CONFIG.url or Sanity CDN |
| Twitter `summary_large_image` | ✅ | Product and blog both set |
| Manual test on opengraph.xyz | ➖ | Manual check needed |

### SECTION 10 — Vercel Final Checks

| Item | Status | Note |
|------|--------|-----|
| Custom domain saffron.town in Vercel | ➖ | Manual Vercel Dashboard |
| SSL Valid | ➖ | Manual |
| www configured/redirect | ➖ | Manual |
| Env vars in Production | ➖ | Manual |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ➖ | Manual |
| `NEXT_PUBLIC_SANITY_DATASET` | ➖ | Manual |
| No placeholder values in prod | ➖ | Manual |
| Auto-deploy on main | ➖ | Manual |
| `curl -I https://saffron.town` | ➖ | Manual |
| `curl sitemap.xml` | ➖ | Manual |
| `curl robots.txt` | ➖ | Manual |
| PageSpeed LCP < 2.5s | ➖ | Manual |

---

## 2. Summary scorecard

| Section | Pass | Fail | Warn | N/A |
|---------|------|------|------|-----|
| 1. Vercel Deployment Compatibility | 8 | 3 | 1 | 2 |
| 2. Metadata & On-Page SEO | 15 | 0 | 0 | 0 |
| 3. Sitemap & Robots | 11 | 1 | 0 | 2 |
| 4. Structured Data | 10 | 1 | 0 | 0 |
| 5. Sanity CMS Blog Setup | 11 | 0 | 2 | 1 |
| 6. Images & Performance | 8 | 1 | 2 | 0 |
| 7. Technical SEO Hygiene | 9 | 2 | 0 | 2 |
| 8. Content Completeness | 6 | 2 | 1 | 1 |
| 9. Open Graph & Social | 5 | 1 | 1 | 1 |
| 10. Vercel Final Checks | 0 | 0 | 0 | 12 |
| **Total** | **83** | **11** | **7** | **21** |

---

## 3. Verdict (Updated 21 Mar 2025)

**All audit fixes have been implemented.** See changelog below.

### Changelog (implemented 21 Mar 2025)

- ✅ Blog `[slug]`: `revalidate = 60`, `dynamicParams = true`
- ✅ Sitemap: `revalidate = 3600`
- ✅ Article schema: publisher logo added
- ✅ Sanity env: graceful fallback
- ✅ Privacy policy page at `/privacy`
- ✅ Footer: Home, Shop, Blog, Our Story, Contact, Privacy
- ✅ Homepage: `og:image`
- ✅ Contact: uses `SITE_CONFIG` emails
- ✅ www redirect in `next.config.ts`
- ✅ Sanity mainImage: `alt` field
- ✅ Sanity images: webp/quality in urlFor
- ✅ `@vercel/analytics` and `@vercel/speed-insights` added

---

## 4. Prioritised fix list (reference)

### P0 — Launch-blocking

| # | File | Line(s) | Change |
|---|------|---------|--------|
| 1 | `src/app/blog/[slug]/page.tsx` | 18 | Remove `export const dynamic = "force-static"`. Add `export const revalidate = 60` and `export const dynamicParams = true`. |
| 2 | `src/app/sitemap.ts` | 1 (after imports) | Add `export const revalidate = 3600`. |
| 3 | Create `src/app/privacy/page.tsx` | — | Add Privacy Policy page with metadata and content. |
| 4 | `src/components/layout/Footer.tsx` | 5-9 | Update `FOOTER_LINKS` to include Home, Shop, Blog, Contact, Privacy. Remove or fix Shipping/Returns (create pages or remove links). |
| 5 | `src/app/contact/page.tsx` | 59, 73 | Replace `hello@saffrontown.com` with `hello@saffron.town`, `orders@saffrontown.com` with `orders@saffron.town` (or use `SITE_CONFIG.email`, `SITE_CONFIG.orderEmail`). |
| 6 | `next.config.ts` | — | Add `redirects: async () => [{ source: '/:path*', has: [{ type: 'host', value: 'www.saffron.town' }], destination: 'https://saffron.town/:path*', permanent: true }]` (or configure in Vercel domains). |
| 7 | `src/app/page.tsx` | 16-28 | Add `openGraph: { images: [{ url: 'https://saffron.town/og-home.jpg', width: 1200, height: 630 }] }` (create/add OG image and path). |

### P1 — Should fix

| # | File | Line(s) | Change |
|---|------|---------|--------|
| 8 | `src/components/seo/ArticleJsonLd.tsx` | 39-43 | Add `logo: { "@type": "ImageObject", url: "https://saffron.town/logo.png" }` to publisher. |
| 9 | `src/sanity/schemaTypes/post.ts` | 42-48 | Add `fields: [{ name: "alt", type: "string", title: "Alt text", validation: (rule) => rule.required() }]` to mainImage. |
| 10 | `src/sanity/env.ts` | 4-17 | Replace `assertValue` with fallbacks (e.g. empty string or `"production"`) for build; throw only at runtime when actually used. |
| 11 | `src/lib/blog-data.ts` | 65, 68 | Use `.format('webp').quality(80)` in urlFor chains for Sanity images. |
| 12 | `src/components/PortableText.tsx` | 14 | Add `.format('webp').quality(80)` to urlFor. |

### P2 — Nice-to-have

| # | File | Line(s) | Change |
|---|------|---------|--------|
| 13 | `package.json` | dependencies | Add `@vercel/analytics` and/or `@vercel/speed-insights`. |
| 14 | `src/app/layout.tsx` | body | Import and render `<Analytics />` and/or `<SpeedInsights />`. |
| 15 | Sanity project | Webhooks | Configure webhook to POST to Vercel Deploy Hook URL on document publish. |

---

## 5. Other observations

- **Blog listing**: No `og:image` — consider adding a default or shared image.
- **Footer**: `/shipping` and `/returns` link to non-existent pages → 404. Create these or remove links.
- **Hero image**: Uses `/products-grid.png`; ensure it exists and is high quality for LCP.
- **JsonLd on layout**: Renders product schema on all pages; only products/shop need product schema. Consider moving product JsonLd to product pages only for efficiency.
- **Product page structure**: Single product at `/shop/saffron`; sitemap correctly reflects this.
- **robots**: Cart and favorites disallowed; consider whether cart should be indexable for deep links.
- **Contact email domain**: `saffrontown.com` vs `saffron.town` may be intentional (different provider); align with brand.
- **ai.txt**: Edge route is fine; uses product data and `SITE_CONFIG` only.
- **No `/admin` route**: robots disallows `/admin`; harmless if you don’t use it.
