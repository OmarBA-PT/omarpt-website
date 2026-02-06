# Implementation Plan: Static Generation with On-Demand Revalidation

## Overview

Split the app into **static** (public visitors) and **dynamic** (draft preview) rendering paths using middleware routing, with on-demand revalidation via Sanity webhooks.

```
Request → Middleware
  ├─ No draft cookie → (frontend)/ routes [STATIC]
  │   - Uses staticSanityFetch (no draftMode() call)
  │   - Tag-based caching with next: { revalidate: false }
  │   - Full Route Cache → served from CDN, no loading spinner
  │
  └─ Has draft cookie → /_draft/ routes [DYNAMIC]
      - Uses defineLive's sanityFetch (calls draftMode())
      - SanityLive provides real-time content updates
      - Full live preview experience preserved
```

## Why This Architecture

The fundamental constraint is that `draftMode()` is a dynamic function in Next.js — any call to it forces the entire route out of the Full Route Cache. Both `defineLive`'s `sanityFetch` AND `SanityLive` call `draftMode()` internally, so they cannot be used on the static path.

The middleware approach cleanly separates concerns:
- Public visitors never trigger `draftMode()` → pages are truly static
- Editors using the Presentation Tool have the draft cookie → middleware routes them to a dynamic path with full live preview

---

## Step-by-Step Implementation

### Step 1: Create `staticSanityFetch` function

**New file: `src/sanity/lib/fetch.ts`**

A fetch function that uses the plain Sanity client with tag-based caching. Critically, it does NOT call `draftMode()` or `cookies()`, making pages that use it eligible for the Full Route Cache.

```typescript
import { client } from './client';
import { token } from './token';

const authenticatedClient = client.withConfig({ token, useCdn: false });

export type SanityFetchParams = Record<string, unknown>;

export interface StaticFetchOptions {
  query: string;
  params?: SanityFetchParams | Promise<SanityFetchParams>;
  tags?: string[];
}

/**
 * Static-friendly Sanity fetch function.
 * Does NOT call draftMode() or cookies(), so pages using this
 * are eligible for Next.js Full Route Cache (truly static).
 *
 * Returns { data } to match defineLive's sanityFetch interface,
 * allowing action functions to accept either fetch function.
 */
export async function staticSanityFetch<T = unknown>(
  options: StaticFetchOptions
): Promise<{ data: T }> {
  const { query, params = {}, tags = ['sanity'] } = options;

  const data = await authenticatedClient.fetch<T>(query, await params, {
    next: {
      tags,
      revalidate: false, // Cache indefinitely, revalidate only via webhook
    },
  });

  return { data };
}
```

Key details:
- Returns `{ data }` to match `defineLive`'s `sanityFetch` return shape
- Uses `revalidate: false` — cached indefinitely until a webhook triggers `revalidateTag()`
- Uses `useCdn: false` — required for tag-based revalidation to work correctly
- Tags default to `['sanity']` for catch-all revalidation

### Step 2: Update Sanity client config

**Modify: `src/sanity/lib/client.ts`**

Change `useCdn: true` to `useCdn: false`. The existing comment in the file already notes this:
> "Set to false if statically generating pages, using ISR or tag-based revalidation"

Tag-based revalidation requires `useCdn: false` because CDN responses may be stale and don't participate in Next.js cache tag tracking.

### Step 3: Update action functions (parameterized fetch)

**Modify: `src/actions/siteData.ts`, `src/actions/pages.ts`, `src/actions/faq.ts`, `src/actions/legal.ts`**

Each action function gets:
1. An optional `fetchFn` parameter that defaults to `staticSanityFetch`
2. A `tags` array passed to the fetch call, based on the Sanity document `_type`

Example transformation for `getFaqPage()`:

```typescript
// BEFORE
import { sanityFetch } from '@/sanity/lib/live';

export async function getFaqPage(): Promise<FAQ_PAGE_QUERYResult> {
  const { data } = await sanityFetch({ query: FAQ_PAGE_QUERY });
  return data;
}

// AFTER
import { staticSanityFetch, type StaticFetchOptions } from '@/sanity/lib/fetch';

type FetchFn = (options: StaticFetchOptions) => Promise<{ data: unknown }>;

export async function getFaqPage(
  fetchFn: FetchFn = staticSanityFetch
): Promise<FAQ_PAGE_QUERYResult> {
  const { data } = await fetchFn({
    query: FAQ_PAGE_QUERY,
    tags: ['sanity', 'faqPage'],
  });
  return data as FAQ_PAGE_QUERYResult;
}
```

The `FetchFn` type is compatible with both `staticSanityFetch` and `defineLive`'s `sanityFetch` (both accept `{ query, params?, tags? }` and return `{ data }`).

**Tag mapping for ALL action functions:**

| Action Function | Tags |
|---|---|
| `getHeader()` | `['sanity', 'header']` |
| `getFooter()` | `['sanity', 'footer']` |
| `getSeoMetaData()` | `['sanity', 'seoMetaData']` |
| `getBusinessContactInfo()` | `['sanity', 'businessContactInfo']` |
| `getCompanyLinks()` | `['sanity', 'companyLinks']` |
| `getContactFormSettings()` | `['sanity', 'contactFormSettings']` |
| `getLegalPagesVisibility()` | `['sanity', 'termsAndConditions', 'privacyPolicy']` |
| `getHomePageHero()` | `['sanity', 'homePageHero']` |
| `getHomePageSections()` | `['sanity', 'homePageSections']` |
| `getPageBySlug(slug)` | `['sanity', 'page']` |
| `getAllPages()` | `['sanity', 'page']` |
| `getFaqPage()` | `['sanity', 'faqPage']` |
| `getTermsAndConditions()` | `['sanity', 'termsAndConditions']` |
| `getPrivacyPolicy()` | `['sanity', 'privacyPolicy']` |
| `getContactGeneralContent()` | `['sanity', 'contactGeneralContent']` |
| `getContactConfirmationEmail()` | `['sanity', 'contactConfirmationEmail']` |
| `getApplyPage()` | `['sanity', 'applyPage']` |
| `getApplyPrivacyStatement()` | `['sanity', 'applyPrivacyStatement']` |
| `getApplyPdfSettings()` | `['sanity', 'applyPdfSettings']` |
| `getApplyQuestionnaire()` | `['sanity', 'applyQuestionnaire']` |
| `getApplyConfirmationEmail()` | `['sanity', 'applyConfirmationEmail']` |

The `FetchFn` type should be defined once in `src/sanity/lib/fetch.ts` and exported for reuse across all action files.

`getPageBuilderData()` doesn't need changes — it composes other action functions that already handle their own tags. But it DOES need to accept and pass through a `fetchFn` parameter so the draft route can override.

### Step 4: Extract shared layout into BaseLayout component

**New file: `src/components/Layout/BaseLayout.tsx`**

Extract the rendering logic from `(frontend)/layout.tsx` into a shared component that accepts data as props. Both the static and draft layouts will use this.

```typescript
// Accepts all layout data as props, renders Header, Footer, structured data, providers
const BaseLayout = ({
  children,
  headerData,
  footerData,
  seoMetaDataResult,
  businessContactInfoData,
  companyLinksData,
  legalPagesVisibilityData,
  draftModeSlot, // Optional slot for SanityLive + VisualEditing + DisableDraftMode
}: BaseLayoutProps) => {
  // ... all the existing rendering logic from (frontend)/layout.tsx
  // ... providers, structured data, Header, Footer, etc.
  // ... {draftModeSlot} rendered where the draft mode components currently go
};
```

### Step 5: Update (frontend) layout

**Modify: `src/app/(frontend)/layout.tsx`**

1. Remove the `draftMode()` import and call (line 143)
2. Remove `SanityLive`, `VisualEditingProvider`, `DisableDraftMode` imports and rendering
3. Replace the inline rendering with `<BaseLayout>` using data from static action functions
4. Action function calls now use the default `staticSanityFetch` (no changes needed since actions default to it)

The `generateMetadata` function also calls actions — these now use `staticSanityFetch` by default, which is correct.

### Step 6: Create middleware

**New file: `src/middleware.ts`**

Routes draft mode requests to the `/_draft/` path (internal rewrite — URL stays the same in the browser).

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Maintenance mode logic (from existing proxy.ts) ---
  // Block /dev-test/ routes in production
  // Handle maintenance mode redirects
  // (integrate existing proxy.ts logic here)

  // --- Draft mode routing ---
  const isDraftMode = request.cookies.has('__prerender_bypass');

  if (isDraftMode) {
    // Rewrite to the _draft route group (internal — URL stays the same)
    const url = request.nextUrl.clone();
    url.pathname = `/_draft${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all frontend routes, exclude system/API paths
    '/((?!_next/static|_next/image|favicon.ico|studio|api/).*)',
  ],
};
```

Key details:
- Checks for `__prerender_bypass` cookie (this is the cookie Next.js sets when draft mode is enabled)
- Rewrites `/faq` → `/_draft/faq` internally (browser URL stays `/faq`)
- Excludes: `/_next/`, `/studio`, `/api/`, static files
- Integrates existing proxy.ts maintenance mode / dev-test blocking logic

### Step 7: Create `_draft` route group

**New file: `src/app/_draft/layout.tsx`**

The draft layout mirrors the frontend layout but:
- Uses `defineLive`'s `sanityFetch` (via passing `liveSanityFetch` to actions)
- Calls `draftMode()` and renders `SanityLive`, `VisualEditingProvider`, `DisableDraftMode`
- Uses the shared `BaseLayout` component for rendering

```typescript
import { draftMode } from 'next/headers';
import { SanityLive } from '@/sanity/lib/live';
import { sanityFetch as liveSanityFetch } from '@/sanity/lib/live';
import BaseLayout from '@/components/Layout/BaseLayout';
import DisableDraftMode from '@/components/DisableDraftMode';
import { VisualEditingProvider } from '@/components/VisualEditingProvider';
import { getHeader, getFooter, getSeoMetaData, /* etc. */ } from '@/actions';

const DraftLayout = async ({ children }) => {
  // Fetch data using live (defineLive's) sanityFetch
  const [headerData, footerData, /* etc. */] = await Promise.all([
    getHeader(liveSanityFetch),
    getFooter(liveSanityFetch),
    // ... other data fetches with liveSanityFetch
  ]);

  const draftModeSlot = (await draftMode()).isEnabled ? (
    <>
      <SanityLive />
      <VisualEditingProvider />
      <DisableDraftMode />
    </>
  ) : null;

  return (
    <BaseLayout
      headerData={headerData}
      footerData={footerData}
      /* ... other props */
      draftModeSlot={draftModeSlot}
    >
      {children}
    </BaseLayout>
  );
};

export default DraftLayout;
```

**New file: `src/app/_draft/loading.tsx`**

Same as the existing `(frontend)/loading.tsx` — shows `LoadingOverlay` during draft page loads.

**New file: `src/app/_draft/[[...path]]/page.tsx`**

A catch-all page that handles ALL draft routes, avoiding duplication of individual page files.

```typescript
import { sanityFetch as liveSanityFetch } from '@/sanity/lib/live';
import { notFound } from 'next/navigation';
// Import all action functions and shared page content components
import { getFaqPage, getPageBuilderData, getHomePageHero, /* etc. */ } from '@/actions';

export default async function DraftCatchAllPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const route = '/' + (path?.join('/') || '');

  switch (route) {
    case '/': {
      const [hero, sections, pbd] = await Promise.all([
        getHomePageHero(liveSanityFetch),
        getHomePageSections(liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      return <HomePageContent hero={hero} sections={sections} pageBuilderData={pbd} />;
    }

    case '/faq': {
      const [faqData, pbd] = await Promise.all([
        getFaqPage(liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      if (!faqData) notFound();
      return <FaqPageContent faqData={faqData} pageBuilderData={pbd} />;
    }

    case '/contact': { /* similar pattern */ }
    case '/apply': { /* similar pattern */ }
    case '/privacy-policy': { /* similar pattern */ }
    case '/terms-and-conditions': { /* similar pattern */ }

    default: {
      // Dynamic slug pages
      const slug = path?.[0];
      if (!slug) notFound();
      const [page, pbd] = await Promise.all([
        getPageBySlug(slug, liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      if (!page) notFound();
      return <SlugPageContent page={page} pageBuilderData={pbd} />;
    }
  }
}
```

Note: This catch-all does NOT export `generateMetadata` — metadata isn't relevant for the preview experience. This keeps the file simple.

### Step 8: Extract shared page content components

**New directory: `src/components/pages/`**

To avoid duplicating page rendering logic between `(frontend)` and `_draft`, extract the *rendering* portion of each page into shared components. The `(frontend)` page files keep their `generateMetadata` exports and data fetching, but delegate rendering to these shared components.

Files to create:
- `src/components/pages/HomePageContent.tsx`
- `src/components/pages/FaqPageContent.tsx`
- `src/components/pages/ContactPageContent.tsx`
- `src/components/pages/ApplyPageContent.tsx`
- `src/components/pages/LegalPageContent.tsx` (shared by privacy-policy and terms-and-conditions)
- `src/components/pages/SlugPageContent.tsx`

Each component accepts data as props and renders the page content (structured data scripts, hero, breadcrumbs, PageBuilder, etc.).

The existing `(frontend)` page files become thin wrappers:
```typescript
// src/app/(frontend)/faq/page.tsx
export async function generateMetadata() { /* unchanged */ }

const FAQPage = async () => {
  const [faqData, pageBuilderData] = await Promise.all([
    getFaqPage(),       // defaults to staticSanityFetch
    getPageBuilderData(), // defaults to staticSanityFetch
  ]);
  if (!faqData) notFound();
  return <FaqPageContent faqData={faqData} pageBuilderData={pageBuilderData} />;
};
```

### Step 9: Add `generateStaticParams` to dynamic route

**Modify: `src/app/(frontend)/[...slug]/page.tsx`**

Add `generateStaticParams` to pre-render all known pages at build time:

```typescript
export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .filter(page => page.slug?.current)
    .map(page => ({
      slug: [page.slug!.current!],
    }));
}
```

Pages not covered by `generateStaticParams` (newly created after build) will be generated on-demand on first request and then cached.

### Step 10: Create webhook endpoint

**New file: `src/app/api/revalidate/route.ts`**

Receives Sanity webhook notifications and invalidates the appropriate cache tags.

```typescript
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: 'Missing SANITY_WEBHOOK_SECRET' },
      { status: 500 }
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      _id: string;
      slug?: { current?: string };
    }>(req, WEBHOOK_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'No document type in body' },
        { status: 400 }
      );
    }

    // Revalidate by document type
    revalidateTag(body._type);

    // Also revalidate the catch-all 'sanity' tag for good measure
    // (This is optional — the type-specific tag should be sufficient)

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error processing webhook', error: String(err) },
      { status: 500 }
    );
  }
}
```

### Step 11: Environment variable

**Add to `.env.local` (and Vercel environment variables):**

```
SANITY_WEBHOOK_SECRET=your-secret-here
```

Generate a strong random secret (e.g., `openssl rand -hex 32`) and use the same value in both:
1. Your `.env.local` / Vercel environment variables
2. The Sanity webhook configuration (Step 12)

### Step 12: Sanity webhook configuration (MANUAL — not code)

In the Sanity dashboard (manage.sanity.io):

1. Go to your project → API → Webhooks → Create webhook
2. Configure:
   - **Name**: "Revalidate Next.js"
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: Leave empty (triggers for all document types)
   - **Projection**: `{_type, _id, "slug": slug.current}`
   - **Secret**: The same secret from Step 11
   - **HTTP method**: POST
   - **API version**: Latest
   - **Enabled**: Yes

### Step 13: Update API routes and manifest (low priority)

**Modify: `src/app/api/application-submit/route.ts`** and **`src/app/manifest.ts`**

These directly call `sanityFetch` from `defineLive`. Since API routes are always server-side (dynamic), this doesn't affect static generation. But for consistency, update them to use `staticSanityFetch`.

---

## Summary of All File Changes

### New Files (7)
1. `src/sanity/lib/fetch.ts` — static fetch function + FetchFn type export
2. `src/middleware.ts` — draft mode routing + proxy.ts integration
3. `src/app/api/revalidate/route.ts` — webhook handler
4. `src/app/_draft/layout.tsx` — dynamic layout with SanityLive
5. `src/app/_draft/loading.tsx` — loading state for draft pages
6. `src/app/_draft/[[...path]]/page.tsx` — catch-all draft page
7. `src/components/Layout/BaseLayout.tsx` — shared layout rendering component

### New Files (6 page content components)
8. `src/components/pages/HomePageContent.tsx`
9. `src/components/pages/FaqPageContent.tsx`
10. `src/components/pages/ContactPageContent.tsx`
11. `src/components/pages/ApplyPageContent.tsx`
12. `src/components/pages/LegalPageContent.tsx`
13. `src/components/pages/SlugPageContent.tsx`

### Modified Files (9)
1. `src/sanity/lib/client.ts` — `useCdn: false`
2. `src/actions/siteData.ts` — parameterized fetchFn + tags
3. `src/actions/pages.ts` — parameterized fetchFn + tags
4. `src/actions/faq.ts` — parameterized fetchFn + tags
5. `src/actions/legal.ts` — parameterized fetchFn + tags
6. `src/app/(frontend)/layout.tsx` — use BaseLayout, remove draftMode
7. `src/app/(frontend)/[...slug]/page.tsx` — add generateStaticParams
8. `src/app/(frontend)/*.tsx` pages — use shared content components
9. `src/app/manifest.ts` — use staticSanityFetch (optional)

---

## Verification Steps

1. **Build check**: Run `npm run build` — verify pages show as "Static" (○) not "Dynamic" (ƒ) in the build output
2. **Local test (public)**: Visit pages without draft mode — should load instantly, no loading spinner
3. **Local test (draft)**: Enable draft mode via Presentation Tool — should see loading spinner + live preview
4. **Deploy to Vercel**: Verify CDN-served pages (check response headers for `x-vercel-cache: HIT`)
5. **Webhook test**: Publish content in Sanity → verify page updates within seconds
6. **Navigation test**: Client-side navigation between pages — should be fast, no/minimal loading flash
7. **TypeScript**: Run `npm run typecheck` to ensure no type errors

## Important Notes

- The `defineLive` config in `src/sanity/lib/live.ts` is kept **unchanged** — it's still used by the `_draft` route
- The `'sanity'` tag on every fetch serves as a catch-all — calling `revalidateTag('sanity')` would revalidate everything
- The `__prerender_bypass` cookie is automatically set/cleared by Next.js draft mode API (`draftMode().enable()` / `draftMode().disable()`)
- Pages not pre-rendered at build time (newly created) will be generated on-demand and then cached (ISR behavior)

---

## CLAUDE.md Updates

After implementation, add the following section to `CLAUDE.md` so this architecture is maintained going forward.

### New Section: "Static Generation & Revalidation Architecture"

Add this after an appropriate existing section (e.g., after the "Sanity CMS Schema Development" section):

```markdown
## Static Generation & Revalidation Architecture

**CRITICAL: This project uses a dual-route architecture for static pages + live preview. Follow these rules to avoid breaking static generation.**

### Architecture Overview

Public visitors receive truly static pages served from the CDN. Editors using Sanity's Presentation Tool (draft mode) are routed via middleware to a separate dynamic route group with full live preview.

```
Request → Middleware (src/middleware.ts)
  ├─ No draft cookie → (frontend)/ routes [STATIC]
  │   - Uses staticSanityFetch (src/sanity/lib/fetch.ts)
  │   - No draftMode() calls anywhere in the render path
  │   - Pages are in the Full Route Cache (CDN)
  │
  └─ Has draft cookie → /_draft/ routes [DYNAMIC]
      - Uses defineLive's sanityFetch (src/sanity/lib/live.ts)
      - SanityLive provides real-time content updates
      - draftMode() is called → forces dynamic rendering (expected)
```

### The Golden Rule

**NEVER call `draftMode()`, `cookies()`, or `headers()` in any file under `src/app/(frontend)/`.** These are Next.js dynamic functions — a single call anywhere in the render path (layout, page, or any server component they import) will force the ENTIRE route out of the Full Route Cache, making it dynamically rendered on every request.

The only place these functions are allowed is in the `src/app/_draft/` route group, which is intentionally dynamic.

### Data Fetching Rules

- **Action functions** (`src/actions/*.ts`) accept an optional `fetchFn` parameter
- They default to `staticSanityFetch` — this is what `(frontend)` pages use
- The `_draft` catch-all passes `liveSanityFetch` (from `defineLive`) to get live data
- **NEVER** import directly from `@/sanity/lib/live` in `(frontend)` pages or layout

### When Adding a New Action Function

1. Create the action in `src/actions/` with the standard pattern:
   ```typescript
   import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';

   export async function getNewData(
     fetchFn: FetchFn = staticSanityFetch
   ): Promise<NEW_QUERYResult> {
     const { data } = await fetchFn({
       query: NEW_QUERY,
       tags: ['sanity', 'newDocumentType'], // Tag with the Sanity _type
     });
     return data as NEW_QUERYResult;
   }
   ```
2. **Always include tags**: `['sanity', '<documentType>']` — the document type tag enables targeted revalidation via webhook, and `'sanity'` is the catch-all tag
3. The webhook endpoint (`src/app/api/revalidate/route.ts`) automatically handles new document types — no changes needed there

### When Adding a New Page

1. **Create the page** in `src/app/(frontend)/your-page/page.tsx`
   - Fetch data using action functions (they default to `staticSanityFetch`)
   - Delegate rendering to a shared content component
   - **Do NOT** import from `@/sanity/lib/live`
   - **Do NOT** call `draftMode()`, `cookies()`, or `headers()`

2. **Create a shared content component** in `src/components/pages/YourPageContent.tsx`
   - Accepts data as props, handles all rendering (structured data, hero, breadcrumbs, PageBuilder, etc.)
   - Used by both `(frontend)` page and `_draft` catch-all

3. **Add the route to the draft catch-all** in `src/app/_draft/[[...path]]/page.tsx`
   - Add a new `case` in the switch statement for your route
   - Fetch data using action functions with `liveSanityFetch`
   - Render using the same shared content component

4. **Verify static generation**: Run `npm run build` and confirm your new page shows as Static (○) in the build output

### When Adding a New Sanity Document Type

1. Follow the existing schema creation process
2. Create action function(s) with proper tags (see above)
3. The webhook automatically picks up new document types — when content of that type is published, `revalidateTag('<documentType>')` is called, invalidating all cached fetches with that tag

### Revalidation & Caching

- **Static pages** use `revalidate: false` — cached indefinitely until explicitly revalidated
- **Revalidation** is triggered by a Sanity webhook → `POST /api/revalidate` → `revalidateTag(documentType)`
- **Tag strategy**: Every fetch is tagged with `['sanity', '<documentType>']`
  - `revalidateTag('faqPage')` — invalidates only FAQ-related data
  - `revalidateTag('sanity')` — invalidates ALL Sanity data (nuclear option)
- **New pages** created after build are generated on-demand on first visit, then cached

### Key Files

| File | Purpose |
|---|---|
| `src/sanity/lib/fetch.ts` | Static fetch function (`staticSanityFetch`) + `FetchFn` type |
| `src/sanity/lib/live.ts` | Live fetch function (from `defineLive`) — only used by `_draft` route |
| `src/middleware.ts` | Routes draft mode requests to `_draft/` |
| `src/app/api/revalidate/route.ts` | Webhook endpoint for on-demand revalidation |
| `src/app/(frontend)/` | Static route group — **no dynamic functions allowed** |
| `src/app/_draft/` | Dynamic route group — full live preview with SanityLive |
| `src/components/pages/` | Shared page content components (used by both routes) |
| `src/components/Layout/BaseLayout.tsx` | Shared layout rendering (used by both layouts) |

### Common Mistakes to Avoid

- **Importing from `@/sanity/lib/live` in `(frontend)` pages** — this pulls in `defineLive`'s `sanityFetch` which calls `draftMode()`, breaking static generation
- **Calling `draftMode()` in shared components** — if a component is used by `(frontend)` pages, it must not use dynamic functions
- **Forgetting tags on new action functions** — without tags, the webhook can't invalidate the cached data
- **Forgetting to add new pages to the `_draft` catch-all** — editors won't be able to preview that page in Presentation Tool
- **Using `revalidate: 0` or `no-store`** — this disables caching entirely; use `revalidate: false` with tag-based revalidation instead

### Debugging

- **Page showing as Dynamic (ƒ) in build output?** — Search for `draftMode`, `cookies`, or `headers` calls in the render path. Use `grep -r "draftMode\|cookies()\|headers()" src/app/\(frontend\)/` to find offending code.
- **Content not updating after publish?** — Check the webhook is configured correctly in Sanity dashboard, verify `SANITY_WEBHOOK_SECRET` matches, and check `/api/revalidate` logs in Vercel.
- **Draft preview not working?** — Verify middleware is rewriting to `_draft/`, check the `__prerender_bypass` cookie exists, and verify `SanityLive` is rendering in the `_draft` layout.
```
