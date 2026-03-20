# Cloudflare Workers Deployment

## 3 MB Size Limit (Free Plan)

Your Worker exceeds the **3 MiB** limit on Cloudflare's free plan. Current gzipped size: ~4.9 MiB.

### Options

#### 1. Upgrade to Workers Paid Plan (Recommended)

- **Cost:** $5/month
- **Limit:** 10 MiB per Worker
- **Your app:** Would fit (4.9 MiB < 10 MiB)

[Upgrade at Cloudflare Dashboard](https://dash.cloudflare.com) → Workers → Plans

#### 2. Deploy to Vercel

Next.js is built by Vercel. No Worker size limits on the free tier.

```bash
pnpm add -D vercel
pnpm vercel
```

#### 3. Use Custom Image Loader (Already Configured)

We use a custom loader with Cloudflare's `/cdn-cgi/image/` so images are transformed at the CDN edge—no Images binding needed. Add allowed origins in Cloudflare Dashboard → Images → Transformations → Allowed origins: `cdn.sanity.io`, `images.unsplash.com`, `plus.unsplash.com`.
