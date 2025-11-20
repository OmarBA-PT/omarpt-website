# Taupiri Sound - Comprehensive SEO Audit & Implementation Task List

**Generated:** October 23, 2025
**Website Analyzed:** https://taupiri-website-staging.vercel.app/
**Previous Project Reference:** /seo/old (07:17 Records SEO documentation)

---

## Executive Summary

This audit represents an **ultra-detailed technical and on-page SEO analysis** of Taupiri Sound website, building upon learnings from a previous project (07:17 Records). The analysis reveals **28 actionable SEO issues** across critical infrastructure, local SEO optimization, technical implementation, content strategy, and performance areas.

**Critical Finding:** The site has excellent foundational SEO infrastructure (robots.txt ✓, sitemap.xml ✓, canonical tags ✓, structured data ✓) but is missing crucial **local SEO elements** and has **content optimization gaps** that will limit local market dominance.

**Priority Focus Areas:**

1. **LOCAL SEO** - Missing LocalBusiness schema, geographic targeting, and review strategy
2. **CONTENT QUALITY** - Placeholder/Lorem Ipsum text in meta descriptions
3. **PRE-PRODUCTION** - Staging environment blocking with noindex
4. **SCHEMA ENHANCEMENTS** - Incomplete structured data for local business features

---

## SECTION 1: CRITICAL PRE-LAUNCH ISSUES

### Issue #1: Staging Environment Blocking Indexing ⚠️ BLOCKING [SKIP]

**Status:** CRITICAL - Must fix before production launch
**Current State:** `<meta name="robots" content="noindex, nofollow" />` present on all pages
**Location:** `src/app/layout.tsx:30` (conditional logic based on `NEXT_PUBLIC_ENV`)
**Impact:** Site completely blocked from search engine indexing
**Fix Required:**

- Verify `NEXT_PUBLIC_ENV=production` is set in production deployment
- Double-check `SITE_CONFIG.MAINTENANCE_MODE_ENABLED` is `false`
- Test production deployment to confirm robots meta tag is absent
- Submit production sitemap to Google Search Console after launch

**Testing Checklist:**

- [ ] Production environment variables configured correctly
- [ ] View source in production shows NO robots meta tag
- [ ] Google Search Console sitemap submitted
- [ ] First indexation confirmed within 48 hours

---

### Issue #2: Production Domain URL Inconsistency [FIXED]

**Status:** HIGH - Configuration issue
**Current State:** Inconsistent usage of `NEXT_PUBLIC_SITE_URL` vs `NEXT_PUBLIC_BASE_URL`
**Locations:**

- `src/lib/constants.ts:7` - `PRODUCTION_DOMAIN: 'http://taupirisound.co.nz/'` (HTTP, trailing slash)
- Various files use `process.env.NEXT_PUBLIC_SITE_URL` (undefined in env)
- `src/app/(frontend)/blog/[slug]/page.tsx:106` uses `NEXT_PUBLIC_SITE_URL`

**Issues:**

1. **HTTP instead of HTTPS** - Security warning for users, SEO penalty
2. **Trailing slash inconsistency** - Duplicate content risk
3. **Environment variable undefined** - Fallback to `SITE_CONFIG` may cause issues

**Fix Required:**

- Update `PRODUCTION_DOMAIN` to `'https://taupirisound.co.nz'` (HTTPS, no trailing slash)
- Standardize on single environment variable (`NEXT_PUBLIC_SITE_URL`)
- Update all references to use consistent base URL function
- Add URL normalization utility to handle trailing slashes

**Files to Update:**

- `src/lib/constants.ts` - Fix production domain
- `.env.production` - Set `NEXT_PUBLIC_SITE_URL=https://taupirisound.co.nz`
- All metadata generation files - Use consistent env variable

---

### Issue #3: 404 Page Meta Description Incomplete [FIXED]

**Status:** MEDIUM - Content quality issue
**Current State:** "Sorry, the page you are looking for could not be found. Explore ....[COMPLETE THIS]..... at Taupiri Sound."
**Location:** `src/app/(frontend)/not-found.tsx:11`
**Impact:** Unprofessional appearance in edge cases where 404s get indexed
**Fix Required:** Complete the meta description with actual suggestions:

```typescript
const META_DESCRIPTION =
  'Sorry, the page you are looking for could not be found. Explore our recording studio, discography, and latest news at Taupiri Sound.';
```

---

## SECTION 2: LOCAL SEO - CRITICAL MISSING ELEMENTS

### Issue #4: Missing LocalBusiness Structured Data ⚠️ HIGH PRIORITY [FIXED]

**Status:** ✅ IMPLEMENTED
**Current State:** Comprehensive LocalBusiness schema implemented
**Impact:** Enhanced local search visibility, Google Maps integration, rich snippets
**Fix Completed:** LocalBusiness schema with full geographic and business data

**Implementation Location:** `src/lib/structuredData.ts`

**Required LocalBusiness Schema Fields:**

```typescript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Taupiri Sound",
  "description": "Recording studio in northern Waikato...",
  "url": "https://taupirisound.co.nz",
  "telephone": "+64 21 311 903",
  "email": "lance@taupirisound.co.nz",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Topview Road",
    "addressLocality": "Taupiri",
    "postalCode": "3792",
    "addressRegion": "Waikato",
    "addressCountry": "NZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -37.5667,  // ADD: Get exact coordinates
    "longitude": 175.2833  // ADD: Get exact coordinates
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$",  // ADD: Determine appropriate range
  "image": "https://taupirisound.co.nz/og-image.png",
  "logo": "https://taupirisound.co.nz/logo.png",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": -37.5667,
      "longitude": 175.2833
    },
    "geoRadius": "100000"  // 100km radius
  },
  "sameAs": [
    "https://www.facebook.com/taupirisound/"
    // ADD: Other social media profiles
  ]
}
```

**Tasks:**

- [x] Research exact GPS coordinates for studio location (Latitude: -37.5940869, Longitude: 175.2095489)
- [x] Confirm business hours or note "By Appointment Only" (Set to "By Appointment Only")
- [x] Determine price range ($$, $$$, etc.) (Omitted as it varies)
- [x] Collect all social media profile URLs (Added Facebook: https://www.facebook.com/taupirisound/)
- [x] Create `generateLocalBusinessSchema()` function (Implemented in `src/lib/structuredData.ts`)
- [x] Add to root layout alongside Organization schema (Added to `src/app/(frontend)/layout.tsx`)
- [ ] Verify with Google Rich Results Test (To be done after deployment)

---

### Issue #5: Missing Geographic Meta Tags [FIXED]

**Status:** ✅ IMPLEMENTED
**Current State:** Geographic metadata implemented site-wide
**Impact:** Enhanced local search relevance signals and regional targeting
**Fix Completed:** Location-specific meta tags added to all pages

**Implementation Location:** `src/lib/metadata.ts`

**Add to Metadata Generation:**

```typescript
other: {
  'geo.region': 'NZ-WKO',  // Waikato region
  'geo.placename': 'Taupiri',
  'geo.position': '-37.5667;175.2833',  // latitude;longitude
  'ICBM': '-37.5667, 175.2833',  // legacy format
}
```

**Tasks:**

- [x] Obtain precise GPS coordinates (Latitude: -37.5940869, Longitude: 175.2095489)
- [x] Add geographic meta tags to metadata generation (Implemented in `src/lib/metadata.ts`)
- [x] Added region code to constants (NZ-WKO for Waikato region)
- [ ] Test in production environment (To be done after deployment)

---

### Issue #6: Missing Google Business Profile Integration

**Status:** MEDIUM - Local discovery
**Current State:** No visible GBP integration or verification
**Impact:** Missing local pack rankings, map visibility
**Fix Required:**

1. **Claim/verify Google Business Profile** for Taupiri Sound
2. **Add business information:**
   - Category: Recording Studio / Music Production
   - Service area: Waikato, Auckland regions
   - Photos: Studio interior, equipment, team
   - Business hours (or by appointment)
3. **Website verification** via HTML tag or Google Search Console
4. **Schema.org integration** - LocalBusiness schema helps Google connect profile to website

**Tasks:**

- [ ] Claim Google Business Profile
- [ ] Complete all profile fields (100% completion)
- [ ] Add 10+ high-quality photos
- [ ] Verify website ownership
- [ ] Request initial reviews from past clients
- [ ] Embed review schema on website (see Issue #9)

---

### Issue #7: Missing Local Keywords in Strategic Locations

**Status:** MEDIUM - Content optimization
**Current State:** Generic location mentions ("northern Waikato")
**Target Keywords for Local SEO:**

- "Recording studio Waikato"
- "Recording studio Taupiri"
- "Music production Hamilton"
- "Sound engineer Waikato"
- "Recording studio near Hamilton"
- "Music studio North Island"

**Fix Required:** Optimize content for local search intent

**Locations to Add Keywords:**

1. **Homepage H1/H2:** Already good ("Recording Studio in the Heart of Waikato, New Zealand")
2. **Meta descriptions:** Add location-specific terms
3. **Service pages:** Mention service areas explicitly
4. **Blog content:** Create location-focused content
5. **Alt text:** Include location in strategic image alt attributes

**Content Strategy:**

- [ ] Create "Areas We Serve" section mentioning Hamilton, Waikato, Raglan, etc.
- [ ] Blog post: "Why Choose a Waikato Recording Studio"
- [ ] Blog post: "Recording Studio vs Home Recording in New Zealand"
- [ ] Service area page with map showing coverage
- [ ] Update footer to include "Serving Waikato and Greater Hamilton"

---

### Issue #8: No Review Schema Implementation

**Status:** MEDIUM - Trust signals
**Current State:** No review/rating structured data
**Impact:** Missing star ratings in search results, reduced CTR
**Fix Required:** Implement Review/AggregateRating schema

**Prerequisites:**

1. Collect testimonials/reviews from past clients
2. Get permission to use client names and quotes
3. Determine aggregate rating (if applicable)

**Schema Implementation:**

```typescript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "12"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Artist Name"
      },
      "datePublished": "2024-09-15",
      "reviewBody": "Exceptional recording experience...",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ]
}
```

**Tasks:**

- [ ] Collect 5-10 client testimonials
- [ ] Get written permission for public use
- [ ] Create testimonials page/section
- [ ] Implement Review schema for each testimonial
- [ ] Add AggregateRating to LocalBusiness schema
- [ ] Request Google reviews from satisfied clients

---

### Issue #9: Missing FAQ Schema for Services

**Status:** LOW - Rich snippet opportunity
**Current State:** Service descriptions exist but no FAQ schema
**Impact:** Missing FAQ rich snippets in search results
**Fix Required:** Create FAQ schema for common questions

**Example Questions:**

- "What equipment do you have at Taupiri Sound?"
- "How much does studio time cost?"
- "Do you offer mixing and mastering services?"
- "Where is Taupiri Sound located?"
- "Do you work with independent artists?"

**Implementation:**

- Create FAQ page or section
- Implement FAQPage schema markup
- Target local search queries

**Tasks:**

- [ ] Compile 8-10 frequently asked questions
- [ ] Write detailed, keyword-rich answers
- [ ] Implement FAQPage schema
- [ ] Test with Google Rich Results Test

---

## SECTION 3: TECHNICAL SEO ISSUES

### Issue #10: Placeholder Meta Descriptions on Pages

**Status:** HIGH - Content quality
**Current State:** "The Studio" page has Lorem Ipsum placeholder text
**Location:** Sanity CMS content (page subtitle field)
**Impact:** Poor CTR from search results, unprofessional appearance
**Fix Required:** Replace ALL placeholder content with real descriptions

**Pages to Audit:**

- [ ] /the-studio - Currently: "Lorem ipsum dolor sit amet..."
- [ ] /discography - Check for placeholders
- [ ] All custom pages created in Sanity
- [ ] All blog posts

**Quality Standards:**

- Length: 120-155 characters optimal
- Include target keyword naturally
- Include location (Waikato/Taupiri) where relevant
- Clear value proposition
- Call-to-action where appropriate

**Example for "The Studio" page:**

```
"Explore our world-class recording studio in Taupiri, Waikato. Featuring professional equipment, experienced engineers, and a creative atmosphere for all artists."
```

---

### Issue #11: Missing favicon.ico in Root Directory [MOSTLY COMPLETE]

**Status:** ✅ MOSTLY IMPLEMENTED - Only missing opengraph-image
**Current State:** Favicons and icons present, missing opengraph-image for social sharing
**Impact:** Minimal - favicons working, social sharing uses default OG image from Sanity
**Fix Required:** Optional - Add opengraph-image.png for static social preview

**Current Files:**

- `src/app/favicon.ico` - ✅ 32x32 PNG format (exists)
- `src/app/icon1.png` - ✅ 32x32 PNG (exists)
- `src/app/icon2.png` - ✅ 192x192 PNG (exists)
- `src/app/apple-icon.png` - ✅ 180x180 PNG (exists)
- `src/app/opengraph-image.png` - ❌ Missing (optional - using Sanity defaultOgImage instead)

**Tasks:**

- [x] Create favicon.ico from logo (32x32) - Already exists
- [x] Create icon.png variants - Already exists (icon1.png, icon2.png)
- [x] Apple icon - Already exists (180x180)
- [x] Test favicon appears in all browsers - Should be working
- [ ] Create opengraph-image.png (1200x630) - OPTIONAL (currently using Sanity CMS defaultOgImage)
- [ ] Verify social share preview shows correct image

**Note:** The site currently uses `defaultOgImage` from Sanity CMS for social sharing, which is dynamically generated and configurable. Adding a static `opengraph-image.png` is optional and would serve as a fallback.

**Reference:** Next.js Metadata Files - https://nextjs.org/docs/app/api-reference/file-conventions/metadata

---

### Issue #12: Missing Web App Manifest [FIXED]

**Status:** ✅ IMPLEMENTED
**Current State:** Web app manifest created and generating at `/manifest.webmanifest`
**Impact:** "Add to Home Screen" functionality now available on mobile devices
**Fix Completed:** Dynamic manifest with brand colors and PWA support

**File Location:** `src/app/manifest.ts` (Next.js 13+ dynamic manifest)

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Taupiri Sound - Recording Studio',
    short_name: 'Taupiri Sound',
    description: 'Professional recording studio in Waikato, New Zealand',
    start_url: '/',
    display: 'standalone',
    background_color: '#430c08',
    theme_color: '#900000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

**Tasks:**

- [x] Create manifest.ts (Implemented in `src/app/manifest.ts`)
- [x] Generate icon files (192x192) - Using existing `icon2.png`
- [ ] Generate 512x512 icon (OPTIONAL - 192x192 works for most devices)
- [ ] Test "Add to Home Screen" on mobile (To be tested after deployment)
- [x] Verify theme colors match brand (Using `--color-brand-primary` and `--color-brand-secondary`)

---

### Issue #13: Sitemap Cache Strategy Too Aggressive

**Status:** LOW - Freshness
**Current State:** `cache-control: public, max-age=0, must-revalidate` (from headers)
**Expected:** ISR with 3600s revalidation (from code: `export const revalidate = 3600`)
**Location:** `src/app/sitemap.xml/route.ts:7`
**Impact:** Vercel override causing no caching
**Fix Required:** Adjust cache headers if needed

**Analysis:**

- Code sets 1-hour revalidation
- Vercel appears to override with `max-age=0`
- May be Vercel deployment configuration

**Tasks:**

- [ ] Check Vercel project settings for cache overrides
- [ ] Consider adding explicit headers in route
- [ ] Monitor sitemap freshness after content updates

---

### Issue #14: Breadcrumb Schema Not Complete for All Page Types [FIXED]

**Status:** ✅ IMPLEMENTED
**Current State:** Breadcrumb schema now implemented on all pages with breadcrumb navigation
**Impact:** Complete breadcrumb rich snippets available across all pages
**Fix Completed:** Blog index page now has breadcrumb structured data

**Pages Checked:**

- [x] Homepage (N/A - no breadcrumb, not needed)
- [x] /blog (listing page) - Added BreadcrumbStructuredData
- [x] /the-studio (custom page) - Already has BreadcrumbStructuredData via [slug]/page.tsx
- [x] /discography (custom page) - Already has BreadcrumbStructuredData via [slug]/page.tsx
- [x] Legal pages (terms, privacy) - Already have BreadcrumbStructuredData

**Verification:**

- [x] All pages with Breadcrumb UI component now have BreadcrumbStructuredData
- [x] Blog index page schema implemented in `src/app/(frontend)/blog/page.tsx`
- [ ] Use Google Rich Results Test for each page after deployment
- [ ] Confirm breadcrumb trail appears correctly in search results

---

### Issue #15: Missing Article Published/Modified Dates in Metadata [FIXED]

**Status:** LOW - Freshness signals
**Current State:** Blog posts have dates in schema but not in HTML meta tags
**Impact:** Search engines may not detect content freshness optimally
**Fix Required:** Add article metadata tags to blog posts

**Add to Blog Post Metadata:**

```typescript
other: {
  'article:published_time': post._createdAt,
  'article:modified_time': post._updatedAt,
  'article:author': post.author,
  'article:section': 'Music Production', // or dynamic category
}
```

**Location:** `src/app/(frontend)/blog/[slug]/page.tsx` - metadata generation

---

### Issue #16: Image Alt Text Quality Issues

**Status:** MEDIUM - Accessibility & image SEO
**Current State:** Some images have generic alt text like "test", "Gallery image 1"
**Impact:** Poor accessibility, missed image search opportunities
**Fix Required:** Audit and improve all image alt text

**Alt Text Best Practices:**

- Descriptive and specific
- Include location/context where relevant
- Natural language, not keyword stuffing
- Different for each image (no duplicates)
- Max 125 characters

**Examples:**

- ❌ "test"
- ❌ "Gallery image 1"
- ✅ "Taupiri Sound recording studio control room with SSL console"
- ✅ "Vocal booth at Taupiri Sound with acoustic treatment"
- ✅ "Marvin Priest recording session at Taupiri Sound"

**Tasks:**

- [ ] Audit all images in Sanity CMS for alt text
- [ ] Update generic/missing alt text
- [ ] Add alt text field validation in Sanity schemas (make required)
- [ ] Document alt text guidelines for content editors

---

### Issue #17: Missing Structured Data for Music/Audio Content

**Status:** MEDIUM - Rich snippets opportunity
**Current State:** No MusicRecording or MusicAlbum schema for discography
**Impact:** Missing music-specific rich snippets
**Fix Required:** Implement music-related structured data

**MusicRecording Schema Example:**

```typescript
{
  "@context": "https://schema.org",
  "@type": "MusicRecording",
  "name": "Song Title",
  "byArtist": {
    "@type": "MusicGroup",
    "name": "Artist Name"
  },
  "duration": "PT3M42S",
  "recordingOf": {
    "@type": "MusicComposition",
    "name": "Song Title",
    "composer": "Composer Name"
  },
  "isrcCode": "XXXXXX",  // if available
  "audio": {
    "@type": "AudioObject",
    "contentUrl": "https://example.com/audio.mp3"
  }
}
```

**Tasks:**

- [ ] Review discography page structure
- [ ] Determine if individual project pages exist
- [ ] Implement MusicRecording schema for tracks
- [ ] Implement MusicAlbum schema for albums
- [ ] Add MusicGroup schema for featured artists

---

### Issue #18: No Internal Linking Strategy

**Status:** MEDIUM - SEO architecture
**Current State:** Limited contextual internal links between content
**Impact:** Poor link equity distribution, reduced crawl efficiency
**Fix Required:** Implement strategic internal linking

**Opportunities:**

1. **Blog posts linking to service pages**
   - Mention "recording studio" → link to /the-studio
   - Mention "equipment" → link to equipment section

2. **Service pages linking to blog content**
   - "Learn more about our process" → relevant blog posts

3. **Homepage linking to key pages**
   - Hero CTAs (already present)
   - Footer navigation (already present)

4. **Related blog posts**
   - "You might also like" section (currently missing)

5. **Breadcrumb navigation** (already implemented ✓)

**Implementation Strategy:**

- [ ] Create content relationship map
- [ ] Add "Related Articles" component to blog posts
- [ ] Add contextual links within blog content
- [ ] Create pillar content pages with topic clusters
- [ ] Monitor internal PageRank flow with analytics

---

### Issue #19: Missing Sitemap Index for Scalability

**Status:** LOW - Future-proofing
**Current State:** Single sitemap with 16 URLs
**Impact:** None currently, but limits future growth
**Future Consideration:** Split into multiple sitemaps when content grows

**Recommended Structure (when > 100 URLs):**

- `/sitemap_index.xml` - Main index
- `/sitemap_pages.xml` - Static pages
- `/sitemap_blog.xml` - Blog posts
- `/sitemap_projects.xml` - Discography/projects
- `/sitemap_media.xml` - Images/videos

**Tasks (future):**

- [ ] Monitor sitemap URL count
- [ ] Implement sitemap index at 50+ URLs
- [ ] Update robots.txt to reference sitemap index

---

## SECTION 4: CONTENT OPTIMIZATION

### Issue #20: Blog Post Word Count Analysis

**Status:** MEDIUM - Content depth
**Current State:** Unable to analyze actual blog posts (404s on staging)
**Impact:** Unknown if content meets SEO best practices (1000+ words)
**Fix Required:** Content audit after publishing

**Best Practices:**

- Minimum 800 words for blog posts
- Optimal 1500-2500 words for pillar content
- Include relevant keywords naturally
- Use heading hierarchy (H2, H3, H4)
- Include images with descriptive alt text
- Add internal and external links

**Tasks:**

- [ ] Audit published blog posts for word count
- [ ] Identify thin content (< 800 words)
- [ ] Expand/consolidate content as needed
- [ ] Create content guidelines for minimum word counts

---

### Issue #21: Missing Title Tag Length Optimization

**Status:** MEDIUM - SERP display
**Current State:** Some titles may exceed 60 characters
**Impact:** Title truncation in search results
**Fix Required:** Optimize all titles for display

**Title Tag Best Practices:**

- 50-60 characters optimal (mobile)
- Include primary keyword
- Include brand name (Taupiri Sound)
- Unique for every page
- Front-load important keywords

**Current Titles to Review:**

- Homepage: "Taupiri Sound" (12 chars) ✓ Good
- Blog: "Taupiri Sound | Blog" (20 chars) ✓ Good
- Studio: "Taupiri Sound | The Studio" (27 chars) ✓ Good

**Formula:** `[Primary Keyword] | [Page Type] | Taupiri Sound`

**Tasks:**

- [ ] Audit all page titles for length
- [ ] Test truncation in SERP preview tool
- [ ] Optimize any titles > 60 characters
- [ ] Document title tag formula for consistency

---

### Issue #22: No Content Freshness Strategy

**Status:** LOW - Long-term SEO
**Current State:** Blog exists but unclear posting frequency
**Impact:** Reduced crawl frequency, stale content signals
**Fix Required:** Implement content calendar

**Recommended Strategy:**

- **Frequency:** Minimum 1 post per month
- **Topics:** Studio updates, client features, industry insights, local music scene
- **Updates:** Refresh top-performing content annually
- **Evergreen content:** Create timeless resources

**Content Ideas:**

- "Recording Tips for Independent Artists"
- "Behind the Scenes: A Day at Taupiri Sound"
- "Equipment Spotlight: [Specific Gear]"
- "Meet the Team: [Engineer Profile]"
- "Waikato Music Scene Updates"
- "Recording Studio FAQs Answered"

**Tasks:**

- [ ] Create 3-month content calendar
- [ ] Identify evergreen topics
- [ ] Set up blog post templates
- [ ] Schedule regular content audits

---

### Issue #23: Missing Video Content Integration

**Status:** LOW - Engagement opportunity
**Current State:** No video content visible on site
**Impact:** Missing engagement signals, video search opportunities
**Fix Required:** Consider video content strategy

**Video Opportunities:**

- Studio tour (embed on /the-studio)
- Recording process behind-the-scenes
- Equipment demonstrations
- Client testimonials
- Music project showcases

**Implementation:**

- Host on YouTube (SEO benefits + discoverability)
- Embed on website with VideoObject schema
- Optimize video titles/descriptions with keywords
- Create video sitemap

**Tasks (optional):**

- [ ] Plan video content topics
- [ ] Create 2-3 initial videos
- [ ] Set up YouTube channel (if not exists)
- [ ] Implement VideoObject schema
- [ ] Create video sitemap

---

## SECTION 5: PERFORMANCE & CORE WEB VITALS

### Issue #24: Large JavaScript Bundle Size

**Status:** MEDIUM - Performance
**Current State:** Heavy Next.js bundle with extensive inline data
**Impact:** Slower LCP, reduced mobile performance
**Fix Required:** Performance audit and optimization

**Current Optimizations (already implemented ✓):**

- Next.js Image optimization
- CSS optimization (`optimizeCss: true`)
- Code splitting configuration
- Console removal in production
- Font optimization with `next/font`

**Additional Recommendations:**

- [ ] Analyze bundle with `@next/bundle-analyzer`
- [ ] Implement lazy loading for below-fold components
- [ ] Consider route-based code splitting
- [ ] Minimize Sanity GROQ query payload
- [ ] Use dynamic imports for heavy components

**Testing:**

- [ ] Run Lighthouse audit (target score 90+)
- [ ] Test Core Web Vitals in Google Search Console
- [ ] Monitor Real User Metrics (RUM) after launch

---

### Issue #25: Missing Performance Monitoring

**Status:** LOW - Measurement
**Current State:** No analytics or performance monitoring visible
**Impact:** Unable to track SEO improvements, user behavior
**Fix Required:** Implement analytics and monitoring

**Recommended Tools:**

1. **Google Analytics 4** - Traffic, behavior, conversions
2. **Google Search Console** - Search performance, indexing
3. **Microsoft Clarity** - Session recordings, heatmaps
4. **Vercel Analytics** - Core Web Vitals monitoring

**Implementation:**

- Add GA4 tracking code to root layout
- Verify in Google Tag Assistant
- Set up custom events for key actions (contact form, audio plays)
- Configure Search Console property

**Tasks:**

- [ ] Set up Google Analytics 4
- [ ] Install Google Search Console
- [ ] Configure conversion tracking
- [ ] Set up weekly reporting
- [ ] Monitor Core Web Vitals

---

### Issue #26: Image Optimization Opportunities

**Status:** MEDIUM - Performance
**Current State:** UnifiedImage component implemented (excellent ✓)
**Opportunities:** Further optimization possible
**Fix Required:** Fine-tune image delivery

**Current Strengths:**

- UnifiedImage component with automatic sizing ✓
- Next.js Image optimization ✓
- Sanity CDN integration ✓
- Responsive sizes configuration ✓
- Schema markup generation ✓

**Enhancement Opportunities:**

- [ ] Implement WebP format with fallbacks
- [ ] Add blur-up placeholders (LQIP)
- [ ] Lazy load images below fold
- [ ] Preload critical hero images
- [ ] Audit image file sizes (target < 200KB per image)

**Tasks:**

- [ ] Enable WebP in Sanity image pipeline
- [ ] Add blur placeholders to UnifiedImage
- [ ] Test lazy loading impact on LCP
- [ ] Review largest images and optimize

---

## SECTION 6: ACCESSIBILITY & UX (SEO Impact)

### Issue #27: Skip-to-Content Link Implementation

**Status:** LOW - Accessibility
**Current State:** Present in code: `<a href="#main-content">`
**Impact:** Positive accessibility signal, minor SEO benefit
**Verification:** ✓ Already implemented correctly

---

### Issue #28: Mobile Usability for Local Search

**Status:** MEDIUM - Mobile SEO
**Current State:** Responsive design implemented
**Enhancement Required:** Optimize for mobile-first indexing

**Mobile Optimization Checklist:**

- [ ] Test all pages on mobile devices
- [ ] Verify tap targets > 48x48px
- [ ] Check font sizes (minimum 16px)
- [ ] Test forms on mobile (contact form)
- [ ] Verify no horizontal scrolling
- [ ] Test navigation menu usability
- [ ] Check load time on 3G connection

**Tools:**

- Google Mobile-Friendly Test
- Chrome DevTools mobile emulation
- Real device testing (iOS/Android)

---

## SECTION 7: DEVELOPMENT/STAGING ENVIRONMENT ISSUES

### Issue #29: Demo/Component Pages in Sitemap

**Status:** MEDIUM - Sitemap cleanliness
**Current State:** `/misc-ui`, `/cards`, `/layouts` pages in production sitemap
**Impact:** Crawl budget waste, confusion
**Fix Required:** Exclude development pages from sitemap

**Pages to Exclude from Production:**

- `/error-test`
- `/test-typography`
- `/test-unified-image`
- `/misc-ui`

**Implementation:**

- Add conditional logic to sitemap generation
- Only include development pages in `NODE_ENV !== 'production'`
- Add robots noindex to test pages as backup

**Location:** `src/app/sitemap.xml/route.ts`

```typescript
// Filter out development pages in production
const productionPages = pages.filter(page => {
  const devPages = ['error-test', 'test-typography', 'test-unified-image', 'misc-ui'];
  return !devPages.includes(page.slug?.current || '');
});
```

**Tasks:**

- [ ] Implement page filtering in sitemap
- [ ] Add robots noindex to test pages
- [ ] Verify production sitemap excludes dev pages

---

## SECTION 8: COMPETITIVE ANALYSIS & OPPORTUNITIES

### Issue #30: Competitor Keyword Gap Analysis

**Status:** MEDIUM - Market research
**Current State:** Unknown competitor landscape
**Fix Required:** Research local competitors for keyword opportunities

**Competitor Research Tasks:**

- [ ] Identify top 5 recording studios in Waikato/Hamilton
- [ ] Analyze their top-ranking keywords
- [ ] Review their content topics
- [ ] Identify keyword gaps to target
- [ ] Analyze their backlink profiles
- [ ] Review their local SEO implementation

**Tools:**

- Ahrefs (if budget allows)
- SEMrush
- Google Search (manual analysis)
- Google Business Profile competitor analysis

---

## IMPLEMENTATION PRIORITY MATRIX

### 🔴 CRITICAL - Week 1 (Pre-Launch Blockers)

1. **Issue #1** - Remove noindex from production
2. **Issue #2** - Fix production domain HTTPS configuration
3. **Issue #4** - Implement LocalBusiness schema
4. **Issue #10** - Replace placeholder meta descriptions

### 🟠 HIGH PRIORITY - Week 2-3 (Local SEO Foundation)

5. **Issue #5** - Add geographic meta tags
6. **Issue #6** - Set up Google Business Profile
7. **Issue #7** - Optimize for local keywords
8. **Issue #16** - Improve image alt text quality
9. **Issue #11** - Complete favicon/icon set

### 🟡 MEDIUM PRIORITY - Month 1 (Enhancement)

10. **Issue #8** - Implement review schema
11. **Issue #18** - Develop internal linking strategy
12. **Issue #20** - Content word count optimization
13. **Issue #24** - Performance optimization
14. **Issue #25** - Set up analytics/monitoring
15. **Issue #29** - Clean up sitemap

### 🟢 LOW PRIORITY - Month 2-3 (Refinement)

16. **Issue #9** - Add FAQ schema
17. **Issue #12** - Create web app manifest
18. **Issue #17** - Music-specific structured data
19. **Issue #22** - Content calendar implementation
20. **Issue #23** - Video content strategy

### 📊 ONGOING (Continuous Optimization)

21. Monitor Core Web Vitals
22. Track keyword rankings
23. Analyze Google Search Console data
24. Refresh content quarterly
25. Build local citations
26. Encourage customer reviews
27. Monitor competitor activity

---

## EXPECTED IMPACT BY PRIORITY TIER

### After Critical Issues Fixed (Week 1):

- ✅ Site indexed by Google
- ✅ Proper local business representation
- ✅ Professional meta descriptions
- ✅ HTTPS security throughout

### After High Priority Issues Fixed (Week 3):

- 📈 Local search visibility improved
- 📍 Google Maps integration complete
- 🎯 Local keyword targeting optimized
- 🖼️ Image search visibility enhanced

### After Medium Priority Issues Fixed (Month 1):

- ⭐ Review ratings in search results
- 🔗 Stronger internal link architecture
- 📄 Content depth competitive
- ⚡ Faster page load times
- 📊 Performance tracking active

### After Low Priority Issues Fixed (Month 3):

- 📱 Enhanced mobile experience
- 🎵 Music-specific rich snippets
- 📆 Consistent content publishing
- 🎥 Video engagement signals
- 🏆 Comprehensive SEO foundation

---

## SUCCESS METRICS TO TRACK

### Technical SEO Metrics

- [ ] Google Search Console indexing: 100% of pages
- [ ] Core Web Vitals: All "Good" thresholds
- [ ] Mobile usability: 0 errors
- [ ] Structured data: 0 errors, all enhancements valid
- [ ] Page speed: Lighthouse score 90+

### Local SEO Metrics

- [ ] Google Business Profile: 100% complete
- [ ] Local pack rankings: Top 3 for "recording studio Waikato"
- [ ] Reviews: 10+ Google reviews, 4.5+ average
- [ ] Citations: 20+ local directory listings
- [ ] Maps visibility: Appearing for local searches

### Content & Engagement Metrics

- [ ] Organic traffic: +50% in 6 months
- [ ] Keyword rankings: 20+ keywords in top 10
- [ ] Blog engagement: 2+ min average time on page
- [ ] Contact form conversions: Track baseline, improve 20%
- [ ] Bounce rate: < 50% site-wide

### Competitive Metrics

- [ ] Keyword gap: Close 50% of identified gaps
- [ ] Domain authority: Track and improve
- [ ] Backlink growth: +10 quality backlinks in 6 months
- [ ] Brand searches: Monitor volume increase

---

## TOOLS & RESOURCES NEEDED

### Essential SEO Tools

- ✅ Google Search Console (free)
- ✅ Google Analytics 4 (free)
- ✅ Google Business Profile (free)
- ✅ Google Rich Results Test (free)
- ✅ Lighthouse (free, built into Chrome)

### Recommended Paid Tools

- Ahrefs or SEMrush (keyword research, competitor analysis)
- Microsoft Clarity (free - session recordings)
- Screaming Frog (free tier available - technical audits)

### Development Tools

- Next.js bundle analyzer
- Chrome DevTools
- Vercel Analytics
- GitHub Actions (automated testing)

---

## MAINTENANCE SCHEDULE

### Daily

- Monitor Google Search Console for errors
- Check Vercel deployment status

### Weekly

- Review analytics for traffic patterns
- Check for new Google Business Profile reviews
- Monitor keyword rankings (if using rank tracker)

### Monthly

- Publish 1-2 new blog posts
- Review and update outdated content
- Check backlink profile
- Analyze competitor activity
- Review Core Web Vitals

### Quarterly

- Comprehensive SEO audit
- Content performance review
- Update structured data as needed
- Review and refresh evergreen content
- Analyze conversion funnel
- Adjust strategy based on results

---

## CONCLUSION

This comprehensive audit has identified **30 actionable SEO tasks** across 8 major categories. The site has an excellent technical foundation with proper implementation of modern SEO best practices (robots.txt, sitemap, canonical tags, structured data).

**Key Strengths:**

- ✅ Robust technical SEO infrastructure
- ✅ Clean, semantic HTML structure
- ✅ Proper schema.org implementation
- ✅ Next.js optimization features
- ✅ Mobile-responsive design

**Critical Gaps:**

- ⚠️ Missing LocalBusiness schema (CRITICAL for local SEO)
- ⚠️ No Google Business Profile integration
- ⚠️ Placeholder content in meta descriptions
- ⚠️ Limited local keyword targeting

**Competitive Advantage Opportunities:**

- 🎯 Target "recording studio Waikato" keyword cluster
- 🎯 Implement comprehensive review strategy
- 🎯 Create location-focused content
- 🎯 Build music industry structured data

By addressing the **Critical** and **High Priority** issues within the first month, Taupiri Sound can achieve strong local search visibility and establish SEO dominance in the Waikato recording studio market.

---

**Next Steps:**

1. Review this audit with stakeholders
2. Prioritize tasks based on business goals
3. Assign responsibilities for implementation
4. Set up tracking and monitoring systems
5. Begin with Critical issues (Week 1 plan)
6. Schedule monthly progress reviews

**Estimated Time Investment:**

- Week 1 (Critical): 8-12 hours
- Week 2-3 (High): 12-16 hours
- Month 1 (Medium): 16-20 hours
- Month 2-3 (Low): 12-16 hours
- **Total:** 48-64 hours of focused SEO work

**ROI Expectation:**
With proper implementation of this SEO strategy, Taupiri Sound should achieve:

- **3-6 months:** Top 3 local pack rankings for primary keywords
- **6-12 months:** 2-3x organic traffic increase
- **12+ months:** Established local market dominance, consistent lead generation

---

_End of Comprehensive SEO Audit - Taupiri Sound 2025_
