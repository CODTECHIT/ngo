# SEO, AEO, Sitemap, Keywords & Audit Report - Srishree Vision Foundation

Audit date: 2026-08-07
Site: https://srishreevisionfoundation.org
Stack: Vite + React SPA (client-side rendering), Express API, Vercel hosting

---

## 1. Audit findings (before this work)

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | `index.html` had `<meta name="robots" content="noindex, nofollow">` blocking the entire site from search engines | Critical | Fixed |
| 2 | No per-page titles or descriptions (SPA renders one title for every route) | High | Fixed |
| 3 | No canonical URLs, Open Graph, or Twitter card tags | High | Fixed |
| 4 | No `robots.txt` or `sitemap.xml` | High | Fixed |
| 5 | No structured data (JSON-LD) - no NGO/Organization/FAQ schema for AEO | High | Fixed |
| 6 | No favicon / theme-color / geo meta for local SEO | Medium | Fixed |
| 7 | Inconsistent brand spelling in meta copy (Srivree/Srvishree/Srishree) | Low | Fixed |
| 8 | 2.5-second forced splash screen delays content render (impacts Core Web Vitals + crawl rendering) | Medium | Not changed (see recommendations) |
| 9 | No SSR/prerendering - content is JS-rendered; Google indexes it, but other crawlers may see an empty shell | Medium | Documented |

---

## 2. What was implemented

### 2.1 Central SEO engine - `src/lib/seo.ts`
- Single `SITE_URL` constant (`https://srishreevisionfoundation.org`) used for canonical, OG, JSON-LD.
- Per-route configuration map (`ROUTE_SEO`) with unique `title`, `description`, `keywords` for every public page.
- `applySeo(pathname)` rewrites at runtime: document title, meta description, meta keywords, robots directive, canonical, Open Graph (og:title/description/url/image/locale), Twitter cards, and JSON-LD.
- Executed from the `Layout` component on every route change (`src/app/components/Layout.tsx`).

### 2.2 `index.html` (baseline for every route)
- Removed `noindex, nofollow`; now `index, follow, max-snippet:-1, max-image-preview:large`.
- Added description, keywords, author, theme-color, geo.region / geo.position / ICBM (Hyderabad, IN-TG).
- Added canonical, favicon (logo), Open Graph + Twitter tags.
- Added base JSON-LD `NGO` schema as a crawl-time fallback (enhanced per route at runtime).

### 2.3 Sitemap & robots
- `public/sitemap.xml` - 14 URLs covering all public routes with priorities and image entry for the logo.
- `public/robots.txt` - allows crawling, blocks admin/auth pages, references the sitemap.
- Vercel serves static `public/` files before the SPA rewrite, so these resolve correctly.

### 2.4 AEO (Answer Engine Optimization)
- `FAQPage` JSON-LD with Q&A pairs injected on Home and Services (question + concise answer format preferred by AI/answer engines).
- `NGO` + `WebSite` (with SearchAction) JSON-LD on every public page.
- `Service` schema on /services.
- Visible FAQ section (native `<details>`) on /services so the same questions exist as real on-page content.

---

## 3. Keyword strategy

### 3.1 Primary keywords (money/intent)
- NGO in Telangana, donate to NGO India, volunteer NGO Hyderabad, charity in Hyderabad

### 3.2 Secondary keywords (content/topic)
- free eye camp, health camps, blood donation camp, women empowerment, education skill development, rural development India, CSR partner NGO India, drug free India pledge, Netra Suraksha

### 3.3 Long-tail / question keywords (AEO)
- "Does the foundation conduct free eye camps?", "How can I volunteer with the foundation?", "Is it a registered NGO?"

### 3.4 Page-to-keyword mapping
| Route | Primary target |
|-------|----------------|
| / | NGO in Telangana, charity in Hyderabad |
| /services | health & eye care camps, women empowerment |
| /events | medical camps Hyderabad, community outreach |
| /donate | donate NGO India, charity Telangana |
| /apply | volunteer NGO Hyderabad, CSR partner NGO India |
| /nasha-mukt-pledge | drug free India pledge, Nasha Mukt |
| /netra-suraksha-pledge | eye donation NGO, Netra Suraksha |

Keywords are used once per page (title or description), not stuffed.

---

## 4. Files changed
- `index.html` - full meta/OG/Twitter/JSON-LD rewrite
- `src/lib/seo.ts` - new central SEO/AEO engine + config
- `src/app/components/Layout.tsx` - calls `applySeo()` on route change
- `src/app/pages/Services.tsx` - added visible FAQ section
- `public/robots.txt` - new
- `public/sitemap.xml` - new

---

## 5. Recommended follow-ups (not yet done)
1. **Remove or shorten the 2.5s splash screen** (or gate it to first visit) - improves LCP and reduces crawl-render risk.
2. **Prerender/SSR**: adopt `vite-plugin-prerender` or a static prerender of key routes, or a small SSR middleware, so non-JS crawlers (Bing, LinkedIn, WhatsApp) see real content.
3. **Google Search Console + Bing Webmaster**: verify the domain, submit sitemap.xml, submit URL inspection for /, /services, /donate.
4. **GA4 + Microsoft Clarity**: add analytics + session recording for search-query and bounce analysis.
5. **Use real photos on public pages** (many images currently come from third-party CDNs/Unsplash) and add descriptive `alt` text (already present on some).
6. **OG image**: create a branded 1200x630 share image and set it as the default `page.image`.
7. **Speed**: compress/cache `/logo.jpeg`; add `<link rel="preload" as="image">` for the hero; consider a WebP hero.
8. **Local SEO**: create a Google Business Profile and link it from the Contact page (add `sameAs` URLs to the NGO JSON-LD).
9. **404s**: NotFound page returns HTTP 200; add `meta robots=noindex` for unknown paths, or a real 404 handler.
10. **hreflang** only if a Hindi/regional version is added later.

---

## 6. How to verify
- `npm run build` - confirm build succeeds (done).
- Locally: `npm run dev`, open any route, right-click > View Source is the SPA shell; use DevTools > Elements to inspect `document.head` after navigation (title/description/canonical/JSON-LD are set per route).
- Deploy to Vercel, then check `https://srishreevisionfoundation.org/robots.txt` and `/sitemap.xml` are served (not the SPA shell).
- Use Google's Rich Results Test for `/` and `/services` to validate NGO/FAQPage/Service schema.
- Submit sitemap in Google Search Console after domain verification.
