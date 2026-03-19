# Launch Checklist: Search Console & GA4

## Google Search Console

Search Console is **manual** — no code changes needed. Do this after deploy.

### 1. Add Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add property**
3. Choose **URL prefix** and enter your domain (e.g. `https://saffron.town`)
4. Verify ownership using one of:
   - **HTML tag** — Add the meta tag to your layout (see below)
   - **HTML file** — Upload the verification file to `/public`
   - **DNS** — Add a TXT record to your domain

### 2. Verification Meta Tag (Optional)

The layout already supports the HTML tag method. Add to `.env.local`:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code_here
```

### 3. Submit Sitemap

1. In Search Console, go to **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**

Your sitemap is at `https://yourdomain.com/sitemap.xml` and includes:

- Homepage
- Blog listing + all blog posts
- Product page(s)
- Our Story, Contact

### 4. Request Indexing (After Launch)

1. Go to **URL Inspection**
2. Paste your homepage URL
3. Click **Request Indexing**

Repeat for: homepage, main product page, first 2–3 blog posts. Don’t spam — 5–10 key URLs is enough.

---

## Google Analytics 4 (GA4)

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. **Admin** → **Create property** → Choose **GA4**
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Environment Variable

Add to `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

GA4 only loads when this variable is set. Omit it in development if you prefer.

### 3. Events Implemented

| Event          | When it fires                          |
|----------------|----------------------------------------|
| `page_view`    | Automatic on every page (via GA script)|
| `add_to_cart`  | User adds product to cart              |
| `begin_checkout` | User clicks "Proceed to Checkout"    |
| `purchase`     | User clicks "Proceed to Checkout" (conversion) |

### 4. Verify in GA4

1. **Admin** → **Data streams** → Your web stream
2. **Configure tag** → **Test in debug mode**
3. Or use [GA4 Realtime](https://analytics.google.com) → **Realtime** to see events as you browse

---

## Weekly / Monthly Checks

- **Search Console** → Performance (queries, impressions, clicks)
- **Search Console** → Coverage (crawl errors)
- **GA4** → Acquisition → Traffic acquisition (organic growth)
