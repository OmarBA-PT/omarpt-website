# Site Audit Report
**Project:** Omarpt Website (Next.js 16 + Sanity CMS)
**Date:** 2026-03-02
**Audited Areas:** SEO · Security · Performance · Accessibility

---

## How to Read This Report

Each finding includes:
- A short description of the issue
- The relevant file(s) and line numbers where applicable
- The impact or risk level
- A recommended fix

**Severity labels used:**
- 🔴 **Critical** — Must fix before launch / fix immediately
- 🟠 **High** — Fix soon; significant impact on UX, SEO, or security
- 🟡 **Medium** — Fix within the next sprint; moderate impact
- 🟢 **Low** — Nice-to-have improvement; minor or negligible impact

---

---

# SECTION 1: SEO

---

## 1.1 Infrastructure & Indexing

### ✅ Robots meta tag — correctly conditional
`src/app/layout.tsx`
Noindex is applied only in non-production environments and during maintenance mode. Production pages will be indexable.

### ✅ robots.txt — well-configured
`src/app/robots.txt/route.ts`
Disallows `/admin/`, `/api/`, `/draft/`, `/studio/`, `/dev-test/`. Sitemap reference included. No issues.

### ✅ XML sitemap — well-structured
`src/app/sitemap.xml/route.ts`
Covers homepage, FAQ, apply, contact, legal pages, and all dynamic Sanity pages. Dev-test routes are excluded. ISR revalidation configured at 1 hour.

### ✅ Canonical URLs — correctly generated
`src/lib/metadata.ts`
All pages generate canonical tags with absolute HTTPS URLs. No trailing slash inconsistencies.

### ✅ Open Graph & Twitter Card tags — implemented
`src/lib/metadata.ts`
Full OG and Twitter Card metadata generated per page from Sanity data. OG image at `/public/images/og-image.png`.

### ✅ Geographic meta tags — implemented
`src/lib/metadata.ts` lines 82–106
`geo.region`, `geo.placename`, `geo.position`, and `ICBM` tags generated when business location data is available in Sanity.

---

## 1.2 Structured Data / Schema Markup

### ✅ Organization schema — implemented
`src/lib/structuredData.ts` lines 114–127
Includes name, URL, description, logo, email, phone, address, and `sameAs` social links. Rendered in root layout.

### ✅ LocalBusiness schema — implemented
`src/lib/structuredData.ts` lines 129–164
Includes full postal address, geo coordinates, opening hours, price range, area served, and social profiles. Rendered via `BaseLayout`.

### ✅ WebSite schema — implemented
`src/lib/structuredData.ts` lines 166–181
Present on all pages via `BaseLayout`.

### ✅ Article schema — implemented on all pages
All page components generate Article schema with date published, date modified, author, and publisher.

### ✅ FAQPage schema — implemented
`src/app/(frontend)/faq/page.tsx`
FAQPage structured data generated from Sanity FAQ blocks. Enables Google FAQ rich snippets.

### ✅ BreadcrumbList schema — implemented
`src/components/StructuredData/BreadcrumbStructuredData.tsx`
BreadcrumbList JSON-LD is generated on all major pages (FAQ, contact, legal, dynamic pages) even though the visual breadcrumb component is currently disabled (see 1.3 below).

### ✅ ImageObject schema — implemented
`src/components/UI/UnifiedImage/UnifiedImage.tsx` lines 316–329
`generateSchema` prop triggers ImageObject JSON-LD per image. Used on gallery, blog, profile, and article images.

### 🟡 Medium — BlogPosting schema not differentiated from Article
`src/lib/structuredData.ts`
Blog posts use the generic `Article` schema type rather than the more specific `BlogPosting`. While not incorrect, Google gives additional signal from `BlogPosting` including `wordCount`, `commentCount`, and `keywords`. Implement a dedicated `BlogPosting` schema for blog content.

### 🟡 Medium — No Review / AggregateRating schema
`src/lib/structuredData.ts`
If the site displays testimonials or star ratings, there is no `Review` or `AggregateRating` schema to support rich result star snippets in search results. Add this if testimonial content is present.

### 🟡 Medium — No VideoObject schema
If embedded YouTube videos or Sanity-hosted video files are used on public content pages, they are missing `VideoObject` structured data. Add a `VideoObject` schema wrapper to the `YouTubeVideo` block component.

---

## 1.3 Navigation & Breadcrumbs

### 🟠 High — Visual breadcrumb component is completely disabled
`src/components/UI/Breadcrumb.tsx` line 8
The `Breadcrumb` component unconditionally returns `null`. The ARIA-compliant implementation is commented out at lines 17–43. Users receive no visual breadcrumb trail, and Google cannot see the breadcrumb navigation signal (though the BreadcrumbList schema is still rendered). Re-enable the component.

```tsx
// Current state — nothing renders:
const Breadcrumb = (...) => {
  return null;
  // ... code commented out
};
```

---

## 1.4 Metadata Quality

### 🟡 Medium — Default organisation name is a placeholder
`src/lib/organizationInfo.ts`
`DEFAULT_ORGANIZATION_NAME` is set to `"Temporary Company Name Ltd"`. If the Sanity CMS document for business contact info is not populated, this placeholder will appear in structured data and meta tags. Ensure the Sanity document is fully populated before launch.

### 🟡 Medium — Static sitemap entries missing `<lastmod>` timestamps
`src/app/sitemap.xml/route.ts` lines 29–34
The homepage, FAQ, apply, and contact static entries do not include `lastmod` dates. Dynamic Sanity pages include `_updatedAt`, which is correct. Add a static last-modified date (or the current build date) to static entries.

### 🟢 Low — Blog posts not in sitemap
`src/app/sitemap.xml/route.ts`
If blog/article content types exist in Sanity, they are not included in the sitemap. Add a `ALL_BLOG_POSTS_QUERY` and corresponding sitemap entries if blog content is live.

---

## 1.5 Analytics & Monitoring

### 🔴 Critical — No analytics tracking installed
`package.json`
No analytics library is present (no Google Analytics 4, no Vercel Analytics, no Plausible, no Clarity). Without analytics, there is no way to measure organic traffic, user behaviour, or conversion funnels. Install at minimum GA4 and Google Search Console.

---

## 1.6 Icons & PWA

### 🟠 High — Favicon not configured; PWA icon file missing
`src/app/manifest.ts` line 47
`public/` directory
The manifest references `/icon2.png` (192×192) which does not exist in the `public/` folder. There is also no `favicon.ico` in `public/`. The TODO comment at lines 52–59 in `manifest.ts` notes a 512×512 icon is also needed. The favicon will not appear in browser tabs, and PWA installation will fail.

**Required files to create:**
- `public/favicon.ico` (32×32)
- `public/icon2.png` (192×192) — referenced in manifest
- `public/icon-512.png` (512×512) — for PWA
- `public/apple-touch-icon.png` (180×180) — for iOS

---

## 1.7 Fonts

### ✅ Font loading — using next/font
`src/app/layout.tsx`
`Saira_Condensed` loaded via `next/font/google` with `display: 'swap'`. No render-blocking font requests.

---

## 1.8 Content Quality

### 🟡 Medium — Generic gallery image alt text
`src/components/_blocks/ImageGallery.tsx`
Gallery images fall back to `Gallery image ${index + 1}` when no alt text is provided by the editor. This is meaningless for SEO and accessibility. Enforce alt text as a required field in the Sanity image gallery schema, or improve the fallback to use surrounding page context.

---

---

# SECTION 2: SECURITY

---

## 2.1 HTTP Security Headers

### 🔴 Critical — No security headers configured
`next.config.ts`
No security headers are set anywhere in the codebase. All of the following are completely absent:

| Header | Risk |
|--------|------|
| `Content-Security-Policy` | XSS attacks can load arbitrary scripts |
| `Strict-Transport-Security` | Downgrade attacks possible if HTTP accessible |
| `X-Frame-Options` | Site can be embedded in iframes (clickjacking) |
| `X-Content-Type-Options` | MIME-type sniffing attacks |
| `Referrer-Policy` | Full URLs leaked in referrer headers |
| `Permissions-Policy` | No restriction on browser feature access |

**Recommended fix** — add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://cdn.sanity.io",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://cdn.sanity.io https://*.sanity.io",
            "frame-src https://www.youtube.com https://www.google.com",
            "frame-ancestors 'none'",
          ].join('; '),
        },
      ],
    },
  ];
},
```

Note: tighten the CSP progressively after verifying no violations using `Content-Security-Policy-Report-Only` first.

---

## 2.2 API Rate Limiting

### 🔴 Critical — Rate limiting disabled on all form endpoints
`src/app/api/contact/route.ts` line ~12
`src/app/api/application-submit/route.ts` line ~12

```typescript
// In both files:
const ENABLE_RATE_LIMITING = false;
```

Rate limiting code exists and is fully implemented, but the feature flag permanently disables it. Without rate limiting, both the contact form and application submission endpoint are open to spam, scraping, and abuse. Enable it immediately by setting `ENABLE_RATE_LIMITING = true`.

### 🟡 Medium — In-memory rate limiting won't work on Vercel multi-instance deployments
`src/app/api/contact/route.ts`
`src/app/api/application-submit/route.ts`
The rate limiting implementation stores request counts in memory. On Vercel (and any horizontally scaled deployment), each function instance maintains its own in-memory store, meaning the per-IP limits are not enforced across instances. Replace with a Redis-backed rate limiter (e.g. Upstash Redis with `@upstash/ratelimit`) for production effectiveness.

### 🟡 Medium — No rate limiting on PDF generation endpoint
`src/app/api/generate-application-pdf/route.ts`
The PDF generation endpoint has no rate limiting. PDF rendering via `@react-pdf/renderer` is CPU-intensive. Without limits, this endpoint can be abused to exhaust server resources. Add rate limiting here as well.

---

## 2.3 Input Sanitization

### 🟡 Medium — Sanitization removes only `<>` — insufficient for XSS prevention
`src/app/api/contact/route.ts`
`src/app/api/application-submit/route.ts`

```typescript
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim(); // Only removes < and >
}
```

This does not protect against:
- JavaScript event handler injection (e.g. `" onmouseover="alert(1)`)
- URL-based XSS (e.g. `javascript:alert(1)`)
- Encoding-based bypass attacks

Since these inputs are used to send emails (via Resend) and not rendered as HTML, the current risk is low, but it should be tightened. Install `sanitize-html` or use a well-tested library. At minimum, validate that fields contain only expected character sets.

---

## 2.4 Webhook Security

### 🟢 Low — Webhook returns 500 for missing secret (minor information leakage)
`src/app/api/revalidate/route.ts` lines 5–10

```typescript
if (!WEBHOOK_SECRET) {
  return NextResponse.json({ message: 'Missing SANITY_WEBHOOK_SECRET' }, { status: 500 });
}
```

Returning a 500 with a descriptive error message reveals server configuration details to the caller. Return 401 or 503 with a generic message instead.

### ✅ Webhook signature validation — correctly implemented
`src/app/api/revalidate/route.ts`
`parseBody` from `next-sanity` validates the HMAC signature before any processing occurs. Valid implementation.

---

## 2.5 Draft Mode

### 🟡 Medium — Draft mode enable endpoint has no explicit authentication check
`src/app/api/draft-mode/enable/route.ts`
The endpoint uses `defineEnableDraftMode` from `next-sanity` which provides redirect-origin validation (CSRF-like protection), but there is no explicit check that the requestor is an authenticated Sanity Studio user. While the `next-sanity` library mitigates the most obvious risks, an explicit origin/referrer check would add defence-in-depth.

---

## 2.6 Environment Variables & Secrets

### ✅ .env.local not in git history — confirmed safe
Verified via `git log -- .env.local` (no results) and `.gitignore` pattern `.env*`. Credentials are not exposed in version control.

### ✅ NEXT_PUBLIC_ variables — only non-sensitive values exposed
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_ENV`, `NEXT_PUBLIC_BASE_URL`, and `NEXT_PUBLIC_SANITY_STUDIO_URL` are all non-sensitive configuration values. No secrets are exposed to the browser.

### ✅ Server-side token isolation — correctly implemented
`src/sanity/lib/token.ts`
The Sanity read token is accessed server-side only and never passed to client components.

---

## 2.7 Code Patterns

### ✅ dangerouslySetInnerHTML — all uses are safe
All instances of `dangerouslySetInnerHTML` in the codebase are used exclusively for JSON-LD structured data scripts and inlined CSS styles. No user-controlled input is rendered via `dangerouslySetInnerHTML`.

### ✅ No SQL/NoSQL injection risk
The application uses Sanity CMS as a managed backend with GROQ queries. There is no raw SQL or custom NoSQL query layer exposed to user input.

### ✅ Honeypot anti-spam — correctly implemented
Both form API routes validate that the honeypot field is empty before processing, providing basic bot protection.

---

## 2.8 API Response Headers

### 🟢 Low — Error API responses missing `Cache-Control: no-store`
`src/app/api/contact/route.ts`
`src/app/api/application-submit/route.ts`
Error responses (400, 429, 500) do not include `Cache-Control: no-store`. A caching proxy could theoretically cache an error response and serve it to subsequent legitimate requests. Add `Cache-Control: no-store` to all API error responses.

---

---

# SECTION 3: PERFORMANCE

---

## 3.1 Bundle & Dependencies

### 🔴 Critical — No bundle analyser configured
`package.json` / `next.config.ts`
There is no `@next/bundle-analyzer` or equivalent setup. Bundle size growth is invisible — large dependencies can be added without any visibility into their client-side cost. Install `@next/bundle-analyzer` and run it as part of your release process.

```bash
npm install --save-dev @next/bundle-analyzer
```

### 🟡 Medium — `@react-pdf/renderer` (~200KB) imported in production bundle
`src/lib/utils/generateApplicationPDF.ts`
PDF generation is only used when a user downloads a PDF on the apply page. However, `@react-pdf/renderer` is a large dependency. If it is included in the client bundle (verify with the analyser), move it to an API route or use a dynamic import so it is never shipped to the browser.

### 🟡 Medium — `styled-components` in dependencies but potentially unused
`package.json`
`styled-components` (~150KB) is listed as a dependency. The codebase appears to use `styled-jsx` (included with Next.js) for component-scoped styles rather than `styled-components`. Verify with `grep -r "from 'styled-components'"` and remove if unused.

### 🟢 Low — `react-icons` may be shipping more icons than needed
`package.json`
`react-icons` bundles many icon sets. Ensure only the specific icons used are imported via named imports (e.g. `import { FaArrowRight } from 'react-icons/fa'`) rather than barrel imports, which can pull in the entire set.

---

## 3.2 Console Logging in Production

### 🔴 Critical — `HeroVideo` has extensive console.log statements that run in production
`src/components/HomeHero/HeroVideo.tsx` lines 15, 23–28, 37, 47, 61–63

```typescript
console.log('HeroVideo: Rendering with URL:', videoUrl);
console.log('HeroVideo: Video type detected:', videoType);
onCanPlay={() => console.log('HeroVideo: Can play')}
onLoadStart={() => console.log('HeroVideo: Load started')}
onLoadedMetadata={() => console.log('HeroVideo: Metadata loaded')}
```

`next.config.ts` sets `removeConsole: true` in production, but this only removes top-level calls, not those inside JSX event handlers or closures. These logs fire on every page load and video event in production. Remove them or wrap in `if (process.env.NODE_ENV === 'development')`.

---

## 3.3 Code Splitting & Dynamic Imports

### 🟡 Medium — Almost no dynamic imports used
Only the Sanity Studio page uses a dynamic import. All other components — including heavy ones — are statically imported and included in the initial bundle. Add `next/dynamic` lazy loading for:

- `src/components/Modals/ImageGalleryModal.tsx` — only shown on user interaction
- `src/components/Modals/ImageModal.tsx` — only shown on user interaction
- `src/components/_blocks/GoogleMap.tsx` — only on the contact page

```typescript
// Example:
const ImageGalleryModal = dynamic(() => import('@/components/Modals/ImageGalleryModal'), {
  ssr: false,
});
```

---

## 3.4 Hero & Media Components

### 🟡 Medium — Hero image carousel runs `setInterval` continuously even when off-screen
`src/components/HomeHero/HeroImages.tsx` lines ~39–52
The carousel interval fires every 4 seconds regardless of whether the hero section is in the viewport. This wastes CPU and battery when users scroll down. Add an `IntersectionObserver` to pause the interval when the component leaves the viewport.

### 🟡 Medium — Hero video preloads entire file on page load
`src/components/HomeHero/HeroVideo.tsx`

```typescript
preload='auto'
```

`preload='auto'` instructs the browser to download the entire video file before the user interacts with it. Change to `preload='metadata'` to only fetch the first few seconds needed to display the poster frame, significantly reducing initial page weight.

---

## 3.5 PageReadyTrigger Polling

### 🟡 Medium — `PageReadyTrigger` uses polling instead of `MutationObserver`
`src/components/PageReadyTrigger.tsx` line ~47

```typescript
setTimeout(checkAndTriggerReady, 100);
```

The component polls every 100ms to detect when the page is ready. This runs up to ~100 checks per navigation. Replace with a `MutationObserver` watching for DOM changes, or use `requestIdleCallback` to run the check when the browser is not busy.

---

## 3.6 Data Fetching & Caching

### ✅ Tag-based ISR with webhook revalidation — excellent
`src/sanity/lib/fetch.ts`
`staticSanityFetch` caches data indefinitely in production with tag-based invalidation triggered by Sanity webhooks. All parallel layout data is fetched with `Promise.all`. This is the correct architecture for a Sanity + Next.js project.

### 🟢 Low — No fallback revalidation time as safety net
`src/sanity/lib/fetch.ts`
`revalidate: false` means data is cached until a webhook fires. If the webhook is misconfigured or Sanity's delivery fails, stale content could be served indefinitely. Consider adding `revalidate: 86400` (24 hours) as a safety net alongside tag-based invalidation.

---

## 3.7 CSS

### 🟢 Low — Deprecated CSS block (71 lines) in globals.css
`src/app/globals.css` lines 432–484
A large commented-out block of old section background styles remains in the CSS file. Remove it to reduce file size and maintenance confusion.

### 🟢 Low — Audio/input range CSS may be unnecessary
`src/app/globals.css` lines 387–430
44 lines of CSS resets for `<input type="range">` (audio player styling). If no audio player is used on the site, this CSS is dead code. Verify and remove if unused.

---

## 3.8 Animations & Paint Performance

### 🟢 Low — Missing `will-change` hints on animated elements
`src/components/UI/LoadingOverlay.tsx`
`src/components/HomeHero/HeroImages.tsx`
Animated elements (loading spinner, hero image transitions) do not declare `will-change: transform` or `will-change: opacity`. Adding this hint allows the browser to promote these elements to their own compositing layer in advance, preventing layout repaints during animation.

---

## 3.9 Form Performance

### 🟢 Low — `localStorage` writes on every form change (no debounce)
`src/components/Forms/ApplicationForm/useFormPersistence.ts`
Form state is saved to `localStorage` on every field change. For complex multi-step forms, this can trigger many synchronous writes. Add a debounce of 300–500ms to batch writes.

---

## 3.10 PWA & Offline

### 🟢 Low — No Service Worker; PWA is manifest-only
`src/app/manifest.ts`
A web app manifest is present but there is no Service Worker, so the site has no offline capability and no asset pre-caching. Consider adding `next-pwa` if offline support is a goal.

---

## 3.11 Positive Performance Highlights

The following are well-implemented and should not be changed:

- ✅ **Passive scroll listeners** — `{ passive: true }` used correctly in Header
- ✅ **IntersectionObserver for AnimateIn** — no scroll listeners used
- ✅ **Server component architecture** — minimal client-side hydration for public visitors
- ✅ **Parallel data fetching** — `Promise.all()` used in all layouts
- ✅ **Font loading** — `next/font` with `display: 'swap'`
- ✅ **DNS prefetch + preconnect** for Sanity CDN
- ✅ **Critical CSS inlining** for above-the-fold styles
- ✅ **Console removal** configured for production builds
- ✅ **CSS optimisation** — `optimizeCss: true` and `cssChunking: 'strict'`
- ✅ **Zero overhead for public visitors** from draft-mode/SanityLive components

---

---

# SECTION 4: ACCESSIBILITY

---

## 4.1 Skip Navigation & Landmarks

### 🔴 Critical — Skip link target `#main-content` does not exist in the DOM
`src/components/UI/SkipLink.tsx`
`src/components/Layout/BaseLayout.tsx`

The skip link exists and is correctly implemented (visible on focus, correct class structure). However, the `href="#main-content"` target ID is never rendered anywhere in the layout. Screen reader and keyboard users who activate the skip link will not be taken anywhere.

**Fix:** Add `id="main-content"` to the main content wrapper in `BaseLayout.tsx`:

```tsx
<main id="main-content">
  {children}
</main>
```

---

## 4.2 Interactive Element Roles & Keyboard Support

### 🔴 Critical — `MoreInfoToggle` is a non-interactive `div` acting as a button
`src/components/UI/MoreInfoToggle.tsx`

```tsx
<div
  onClick={() => setIsExpanded(!isExpanded)}
  className="...cursor-pointer..."
  aria-expanded={isExpanded}
  aria-label={...}
>
```

This element:
- Cannot be focused by keyboard (no `tabIndex`)
- Has no `role="button"` (so screen readers do not announce it as interactive)
- Has no `onKeyDown` handler (Enter / Space will not activate it)
- Has no visible focus ring

**Fix:** Replace the `div` with a `<button>` element:

```tsx
<button
  onClick={() => setIsExpanded(!isExpanded)}
  className="...focus:outline-none focus:ring-2 focus:ring-brand-primary..."
  aria-expanded={isExpanded}
  aria-label={...}
>
```

---

## 4.3 Form Error Accessibility

### 🔴 Critical — Form fields are not programmatically associated with their error messages
`src/components/Forms/TextInput.tsx`
`src/components/Forms/TextArea.tsx`

`aria-invalid="true"` is correctly set on invalid inputs, but there is no `aria-describedby` linking the input to its error message element. Screen readers will not announce error text when the field receives focus.

**Fix:**

```tsx
<input
  id={id}
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={error ? `${id}-error` : undefined}
/>
{error && (
  <p id={`${id}-error`} className={formStyles.error.text} role="alert">
    {error.message as string}
  </p>
)}
```

---

## 4.4 Colour Contrast

### 🔴 Critical — `text-gray-400` on light/brand-offwhite backgrounds fails WCAG AA
`src/components/Forms/formStyles.ts`
`src/components/UI/CTA.tsx`

Gray-400 (`#9ca3af`) on brand-offwhite (`#fff0cd`) produces approximately **3.5:1 contrast ratio**. WCAG AA requires **4.5:1** for normal text.

Affected uses include optional field labels and secondary descriptive text. Replace `text-gray-400` with `text-gray-500` (`#6b7280`, ~4.8:1 on brand-offwhite) as a minimum. Preferably use `text-gray-600` for comfortable reading.

---

## 4.5 Navigation — Current Page Indication

### 🟠 High — No `aria-current="page"` on active navigation links
`src/components/Header/HorizontalNav.tsx`
`src/components/Header/VerticalNav/VerticalNav.tsx`

Neither navigation component marks the currently active page link with `aria-current="page"`. Screen reader users have no programmatic way to identify which page they are on from the navigation. Compare each link's `href` to the current `pathname` from `usePathname()` and add `aria-current="page"` to the matching link.

---

## 4.6 Breadcrumb Navigation

### 🟠 High — Breadcrumb component is completely disabled
`src/components/UI/Breadcrumb.tsx` line 8
The component returns `null`. The commented-out implementation already has proper ARIA structure (`<nav aria-label="Breadcrumb">`, `aria-hidden="true"` on separators). Re-enable it to provide location context for all users (WCAG 2.4.8 — Location).

---

## 4.7 Motion & Animation

### 🟠 High — No `prefers-reduced-motion` media query anywhere in the codebase
`src/app/globals.css`
All animation-using components (carousel, loading spinner, FAQ accordion, nav slide-in, AnimateIn) ignore the OS-level reduced motion preference. Users with vestibular disorders who have set "reduce motion" in their OS will still receive full animations.

**Fix** — add to `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For the hero carousel specifically, also disable the `setInterval` rotation when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true.

---

## 4.8 Image & Media Accessibility

### 🟡 Medium — YouTube `<iframe>` has a generic, non-descriptive title
`src/components/_blocks/YouTubeVideo.tsx`

```tsx
<iframe title='YouTube Video' ...>
```

Screen readers announce iframe titles to give users context. "YouTube Video" is not descriptive. Pull the video title from the Sanity schema field and use it as the title:

```tsx
<iframe title={videoTitle ? `Video: ${videoTitle}` : 'Embedded video'} ...>
```

### 🟡 Medium — Gallery `aria-describedby` references a non-existent DOM element
`src/components/_blocks/ImageGallery.tsx`

```tsx
<button aria-describedby={`gallery-image-${idx}`}>
```

The ID `gallery-image-${idx}` is never rendered in the DOM. The `aria-describedby` reference resolves to nothing, and the associated description is not announced. Either create an element with that ID or point `aria-describedby` at the `<figcaption>` element's ID.

---

## 4.9 Form & Alert Patterns

### 🟡 Medium — Form-level error messages not announced immediately to screen readers
`src/components/Forms/ContactForm/ContactForm.tsx`

The form-level error container (shown on submission failure) has no `role="alert"` or `aria-live` attribute. Screen readers will not automatically announce this message when it appears. Add `role="alert"` to the error container:

```tsx
{status === 'error' && (
  <div role="alert" className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
    <p className="text-body-base text-red-700">{errorMessage}</p>
  </div>
)}
```

---

## 4.10 Positive Accessibility Highlights

The following are well-implemented:

- ✅ `lang="en"` on `<html>` root element
- ✅ Skip link exists and is visible on focus (`SkipLink.tsx`)
- ✅ `<dialog>` element used for modals (native semantics)
- ✅ `aria-labelledby` and `aria-describedby` on modal dialogs
- ✅ Focus trap hook (`useFocusTrap.ts`) with proper cleanup and focus restoration
- ✅ `aria-expanded` and `aria-controls` on FAQ accordion buttons
- ✅ `aria-expanded`, `aria-controls`, and `aria-label` on mobile menu button
- ✅ `role="dialog"` and `aria-modal="true"` on vertical navigation overlay
- ✅ `aria-label` on vertical navigation menu landmark
- ✅ `aria-invalid` set correctly on form inputs
- ✅ Form labels associated to inputs via `htmlFor`/`id`
- ✅ Required field indicators present on forms
- ✅ Honeypot field hidden from keyboard users (`aria-hidden`, `tabIndex={-1}`)
- ✅ `<figure>` and `<figcaption>` used correctly in image gallery
- ✅ `role="dialog"` and `aria-label` on `LoadingOverlay`
- ✅ Screen-reader-only text used on `ImageModal` heading and description

---

---

# PRIORITY MATRIX

## 🔴 Critical — Fix Immediately

| # | Area | Issue | File |
|---|------|-------|------|
| C1 | Security | No security headers (CSP, HSTS, X-Frame-Options, etc.) | `next.config.ts` |
| C2 | Security | Rate limiting disabled on contact & application form APIs | `src/app/api/contact/route.ts`, `src/app/api/application-submit/route.ts` |
| C3 | SEO | No analytics tracking installed | — |
| C4 | Performance | `HeroVideo` console logs run in production | `src/components/HomeHero/HeroVideo.tsx` |
| C5 | Performance | No bundle analyser configured | `next.config.ts` |
| C6 | Accessibility | Skip link target `#main-content` ID missing from DOM | `src/components/Layout/BaseLayout.tsx` |
| C7 | Accessibility | `MoreInfoToggle` div is not keyboard accessible | `src/components/UI/MoreInfoToggle.tsx` |
| C8 | Accessibility | Form error messages not linked to fields via `aria-describedby` | `src/components/Forms/TextInput.tsx`, `TextArea.tsx` |
| C9 | Accessibility | `text-gray-400` fails WCAG AA contrast on brand-offwhite | `src/components/Forms/formStyles.ts` |

## 🟠 High — Fix Before Launch

| # | Area | Issue | File |
|---|------|-------|------|
| H1 | SEO | Visual breadcrumb component disabled (returns null) | `src/components/UI/Breadcrumb.tsx` |
| H2 | SEO | Favicon and PWA icon files missing | `public/` folder |
| H3 | Security | Rate limiting uses in-memory store (won't scale on Vercel) | Both API route files |
| H4 | Security | No rate limiting on PDF generation endpoint | `src/app/api/generate-application-pdf/route.ts` |
| H5 | Accessibility | No `aria-current="page"` on active navigation links | `HorizontalNav.tsx`, `VerticalNav.tsx` |
| H6 | Accessibility | Breadcrumb component disabled (no location context for users) | `src/components/UI/Breadcrumb.tsx` |
| H7 | Accessibility | No `prefers-reduced-motion` support anywhere | `src/app/globals.css` |

## 🟡 Medium — Fix Within Next Sprint

| # | Area | Issue | File |
|---|------|-------|------|
| M1 | SEO | `BlogPosting` schema not used for blog content | `src/lib/structuredData.ts` |
| M2 | SEO | Review/AggregateRating schema missing (if testimonials exist) | — |
| M3 | SEO | Static sitemap entries missing `lastmod` dates | `src/app/sitemap.xml/route.ts` |
| M4 | SEO | Default org name placeholder still in code | `src/lib/organizationInfo.ts` |
| M5 | Security | Input sanitization removes only `<>` — too weak | Both API route files |
| M6 | Security | Webhook returns 500 (not 401) for missing secret | `src/app/api/revalidate/route.ts` |
| M7 | Security | Draft mode enable has no explicit auth check | `src/app/api/draft-mode/enable/route.ts` |
| M8 | Performance | No dynamic imports for modals and GoogleMap | Multiple component files |
| M9 | Performance | Hero carousel `setInterval` runs off-screen | `src/components/HomeHero/HeroImages.tsx` |
| M10 | Performance | `video preload='auto'` downloads full video on load | `src/components/HomeHero/HeroVideo.tsx` |
| M11 | Performance | `PageReadyTrigger` polls every 100ms | `src/components/PageReadyTrigger.tsx` |
| M12 | Accessibility | YouTube iframe title is generic (`'YouTube Video'`) | `src/components/_blocks/YouTubeVideo.tsx` |
| M13 | Accessibility | Gallery `aria-describedby` references non-existent ID | `src/components/_blocks/ImageGallery.tsx` |
| M14 | Accessibility | Form-level error messages missing `role="alert"` | `src/components/Forms/ContactForm/ContactForm.tsx` |

## 🟢 Low — Address When Possible

| # | Area | Issue | File |
|---|------|-------|------|
| L1 | SEO | Blog posts not included in sitemap (if blog content exists) | `src/app/sitemap.xml/route.ts` |
| L2 | SEO | No VideoObject schema for embedded videos | `src/components/_blocks/YouTubeVideo.tsx` |
| L3 | SEO | Generic gallery image alt text fallback | `src/components/_blocks/ImageGallery.tsx` |
| L4 | Security | API error responses missing `Cache-Control: no-store` | API route files |
| L5 | Security | `styled-components` listed as dependency but may be unused | `package.json` |
| L6 | Performance | Deprecated CSS block (71 lines) in globals.css | `src/app/globals.css` lines 432–484 |
| L7 | Performance | No fallback `revalidate` time if webhook fails | `src/sanity/lib/fetch.ts` |
| L8 | Performance | No Service Worker for offline support | — |
| L9 | Performance | `localStorage` form writes not debounced | `useFormPersistence.ts` |
| L10 | Performance | Missing `will-change` hints on animated elements | `LoadingOverlay.tsx`, `HeroImages.tsx` |

---

---

# APPENDIX: CONFIRMED SAFE / NOT ISSUES

The following were investigated and found to be correctly implemented:

- `dangerouslySetInnerHTML` — used only for JSON-LD scripts and CSS (safe)
- `.env.local` git exposure — file is not and has never been committed to git
- `NEXT_PUBLIC_` variable exposure — only non-sensitive config values exposed
- SQL/NoSQL injection — using Sanity managed backend (no raw query layer)
- Honeypot spam protection — correctly implemented on all form endpoints
- Scroll event listeners — all use `{ passive: true }` option
- IntersectionObserver usage — correctly implemented in AnimateIn
- Font loading — using `next/font` with `display: 'swap'`
- Server/client component split — well-structured; minimal client hydration
- Parallel data fetching — `Promise.all()` used across all layouts
- Sanity webhook signature validation — HMAC verification correctly implemented
- `lang="en"` on `<html>` root — correct
- Focus trap in modals and vertical nav — correctly implemented with cleanup
- Modal uses native `<dialog>` element — best practice
- Sanity Studio singleton protection — implemented correctly

---

*Generated by automated codebase analysis — 2026-03-02*
