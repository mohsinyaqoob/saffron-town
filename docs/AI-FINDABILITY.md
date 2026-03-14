# Making Saffron Town Findable to AI Agents & GPTs

This document describes how we've optimized the site for discovery by AI systems (ChatGPT, Perplexity, Claude, etc.).

## What We've Implemented

### 1. **robots.txt** (`/robots.txt`)
Explicitly allows major AI crawlers:
- **GPTBot** – OpenAI (ChatGPT)
- **ChatGPT-User** – OpenAI browsing
- **Perplexitybot** – Perplexity AI
- **Claudebot** – Anthropic (Claude)
- **OAI-SearchBot** – OpenAI search
- **anthropic-ai** – Anthropic
- **Google-Extended** – Google AI (Gemini)

### 2. **ai.txt** (`/ai.txt`)
AI-readable manifest following the [ai.txt specification](https://aitxt.ing/):
- **[identity]** – Business name, URL, description
- **[permissions]** – What AI may do (cite, summarize, attribute)
- **[restrictions]** – What AI must not do (fabricate claims)
- **[products]** – Full product list with URLs and details
- **[about]** – Key value props
- **[contact]** – Website URL

### 3. **Structured Data (JSON-LD)**
- **Organization** – Brand identity
- **WebSite** – Site metadata, search action
- **Product** – Per-product schema (name, price, rating, URL) on homepage + product pages

### 4. **Discovery**
- `<link rel="alternate" href="/ai.txt">` in HTML head for crawler discovery
- Sitemap at `/sitemap.xml` with all product URLs

### 5. **Semantic HTML**
- Clear heading hierarchy (h1, h2)
- Semantic sections (`<main>`, `<article>`, `<section>`)
- Meaningful alt text on images

## Best Practices for AI Findability

1. **Server-rendered content** – Our pages are static/SSR, so AI crawlers see full HTML without JS.
2. **Unique, canonical URLs** – Each product has one canonical URL.
3. **Plain text summaries** – ai.txt provides a crawlable, link-rich summary.
4. **Accurate metadata** – Title, description, Open Graph on every page.

## Verification

- Visit `https://yoursite.com/ai.txt` – Should return plain-text context
- Visit `https://yoursite.com/robots.txt` – Should list sitemap and allow AI bots
- Use [Google Rich Results Test](https://search.google.com/test/rich-results) for schema validation

## Further Improvements

- Add FAQ schema if you add an FAQ section
- Submit sitemap to Google Search Console
- Monitor crawler access logs for GPTBot, Perplexitybot, etc.
