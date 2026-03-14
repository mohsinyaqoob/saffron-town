# Saffron Town

Premium Kashmiri Saffron, Almonds, Walnuts & Honey ecommerce website. Built with Next.js 16, Tailwind CSS 4, and modern best practices.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 with design tokens
- **Fonts:** Playfair Display (display), Bricolage Grotesque (body)
- **Language:** TypeScript

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind + theme tokens
│   ├── robots.ts           # SEO: robots.txt
│   ├── sitemap.ts          # SEO: XML sitemap
│   ├── manifest.ts         # PWA manifest
│   └── ai.txt/
│       └── route.ts        # GPT/AI findability
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Hero, ProductGrid, Blog, etc.
│   ├── ui/                 # Button, Badge (reusable)
│   └── seo/                # JSON-LD structured data
└── lib/
    ├── constants.ts        # Site config, products, nav
    └── utils.ts            # cn() helper
```

## Design Tokens (globals.css)

- **Primary:** `#BC8034` - CTAs, accents
- **Secondary:** `#8C7A6B` - Body text, muted
- **Background:** `#F5EDE4` - Page background
- **Dark:** `#4A4038` - Footer, guarantee section

## SEO & GPT Findability

- **Meta:** Title, description, keywords, Open Graph
- **Structured data:** Organization, WebSite, Product (JSON-LD)
- **robots.txt:** Allows GPTBot, ChatGPT-User
- **sitemap.xml:** Auto-generated
- **/ai.txt:** Plain-text manifest for AI crawlers

## Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Start production server
```

## Getting Started

1. `npm install` (if dependencies missing)
2. Update `SITE_CONFIG.url` in `src/lib/constants.ts` for your domain
3. Replace placeholder images with your product assets
# saffron-town
