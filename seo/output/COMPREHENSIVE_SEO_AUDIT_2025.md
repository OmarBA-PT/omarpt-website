# Omania Training - Comprehensive SEO Audit & Implementation Task List

**Generated:** January 22, 2025
**Website Analyzed:** https://omarpt-website-production.vercel.app
**Codebase Location:** /Users/viteshbava/Documents/CODE/omarpt-website

---

## Executive Summary

This audit represents an **ultra-detailed technical and on-page SEO analysis** of the Omania Training website. The analysis reveals **24 actionable SEO issues** across critical infrastructure, local SEO optimization, technical implementation, content strategy, and performance areas.

**Critical Finding:** The site has excellent foundational SEO infrastructure (robots.txt, sitemap.xml, canonical tags, structured data, LocalBusiness schema) but has **critical issues with icon files**, **incomplete sitemap coverage**, **disabled visual breadcrumbs**, and **missing local business data** that will limit local market dominance.

**Priority Focus Areas:**

1. **ICON FILES** - App icons have underscore prefixes and won't be served by Next.js
2. **SITEMAP GAPS** - FAQ, Apply, and Contact pages missing from sitemap
3. **LOCAL SEO DATA** - Incomplete business address and placeholder phone number
4. **VISUAL BREADCRUMBS** - Breadcrumb component is disabled (returns null)
5. **FAQ SCHEMA** - FAQ page missing FAQPage structured data

---

## SECTION 1: CRITICAL PRE-LAUNCH ISSUES

### Issue #1: App Icon Files Have Underscore Prefix - NOT SERVED

**Status:** CRITICAL - Icons not functioning
**Current State:** Icon files are prefixed with underscore: `_apple-icon.png`, `_icon1.png`, `_icon2.png`
**Location:** `src/app/`
**Impact:** Next.js ignores files with underscore prefixes - browser tabs, bookmarks, and PWA icons will be missing
**Fix Required:**

- Rename `_apple-icon.png` to `apple-icon.png`
- Rename `_icon1.png` to `icon.png` (or `icon1.png`)
- Rename `_icon2.png` to `icon2.png`
- Update references in `src/app/manifest.ts` if needed

**Files to Rename:**
```
src/app/_apple-icon.png → src/app/apple-icon.png
src/app/_icon1.png → src/app/icon.png
src/app/_icon2.png → src/app/icon2.png
```

**Reference:** Next.js Metadata Files - https://nextjs.org/docs/app/api-reference/file-conventions/metadata

**Tasks:**
- [ ] Rename icon files to remove underscore prefix
- [ ] Update `manifest.ts` icon references to match new filenames
- [ ] Test favicon appears in browser tabs
- [ ] Test "Add to Home Screen" on mobile devices
- [ ] Verify Apple touch icon appears on iOS

---

### Issue #2: Missing 512x512 PWA Icon

**Status:** HIGH - PWA functionality limited
**Current State:** manifest.ts references TODO for 512x512 icon
**Location:** `src/app/manifest.ts:29-36`
**Impact:** PWA installation may show lower quality icons on high-resolution devices
**Fix Required:**

- Create 512x512 PNG icon from logo
- Update manifest.ts to include the icon

**Current Code:**
```typescript
// TODO: Create 512x512 icon for better quality on high-res devices
// Once created, uncomment the following:
// {
//   src: '/icon-512.png',
//   sizes: '512x512',
//   type: 'image/png',
//   purpose: 'any',
// },
```

**Tasks:**
- [ ] Create 512x512 PNG icon (ideally from vector source)
- [ ] Save as `icon-512.png` in `src/app/` directory
- [ ] Uncomment the 512x512 icon entry in manifest.ts
- [ ] Test PWA installation on high-res devices

---

### Issue #3: Staging Environment Blocking Indexing

**Status:** CRITICAL - Verify before production launch
**Current State:** Conditional `noindex, nofollow` meta tag based on `NEXT_PUBLIC_ENV`
**Location:** `src/app/layout.tsx:24-25`
**Impact:** If environment not set correctly, site will be completely blocked from indexing
**Fix Required:**

- Verify `NEXT_PUBLIC_ENV=production` is set in production deployment
- Confirm `SITE_CONFIG.MAINTENANCE_MODE_ENABLED` is `false`

**Current Code:**
```typescript
const isProd = process.env.NEXT_PUBLIC_ENV === 'production';
const shouldHideFromRobots = !isProd || SITE_CONFIG.MAINTENANCE_MODE_ENABLED;
```

**Testing Checklist:**
- [ ] Production environment variables configured correctly
- [ ] View source in production shows NO robots meta tag
- [ ] Google Search Console sitemap submitted
- [ ] Request indexing for key pages after launch

---

## SECTION 2: SITEMAP & DISCOVERABILITY ISSUES

### Issue #4: FAQ Page Missing from Sitemap

**Status:** HIGH - Content not indexed
**Current State:** `/faq` page exists but not in sitemap.xml
**Location:** `src/app/sitemap.xml/route.ts`
**Impact:** FAQ page may not be discovered by search engines, missing potential featured snippets
**Fix Required:**

Add FAQ page to sitemap generation:

```typescript
// Add after legalPages in sitemap.xml/route.ts
const staticPages: SitemapUrl[] = [
  { url: '', changefreq: 'weekly', priority: '1.0' },
  { url: '/faq', changefreq: 'monthly', priority: '0.7' },  // ADD THIS
];
```

**Tasks:**
- [ ] Add `/faq` to sitemap with priority 0.7
- [ ] Rebuild and verify sitemap includes FAQ page
- [ ] Submit updated sitemap to Google Search Console

---

### Issue #5: Apply Page Missing from Sitemap

**Status:** HIGH - Conversion page not indexed
**Current State:** `/apply` page exists but not in sitemap.xml
**Location:** `src/app/sitemap.xml/route.ts`
**Impact:** Primary conversion page may not be discovered by search engines
**Fix Required:**

Add Apply page to sitemap:

```typescript
{ url: '/apply', changefreq: 'monthly', priority: '0.8' },  // High priority - conversion page
```

**Tasks:**
- [ ] Add `/apply` to sitemap with priority 0.8
- [ ] Verify sitemap includes Apply page after rebuild

---

### Issue #6: Contact Page Missing from Sitemap

**Status:** HIGH - Important page not indexed
**Current State:** `/contact` page exists but not in sitemap.xml
**Location:** `src/app/sitemap.xml/route.ts`
**Impact:** Contact page may not appear in search results
**Fix Required:**

Add Contact page to sitemap:

```typescript
{ url: '/contact', changefreq: 'monthly', priority: '0.8' },
```

**Tasks:**
- [ ] Add `/contact` to sitemap with priority 0.8
- [ ] Verify sitemap includes Contact page after rebuild

---

### Issue #7: Sitemap Missing lastmod for Static Pages

**Status:** MEDIUM - Freshness signals
**Current State:** Static pages (homepage, FAQ, Contact, Apply) don't have lastmod dates
**Location:** `src/app/sitemap.xml/route.ts:26-28`
**Impact:** Search engines can't determine content freshness for static pages
**Fix Required:**

Add lastmod dates to static pages or fetch from Sanity if available:

```typescript
const staticPages: SitemapUrl[] = [
  { url: '', changefreq: 'weekly', priority: '1.0', lastmod: new Date().toISOString() },
  { url: '/faq', changefreq: 'monthly', priority: '0.7', lastmod: faqData?._updatedAt },
  { url: '/apply', changefreq: 'monthly', priority: '0.8', lastmod: applyData?._updatedAt },
  { url: '/contact', changefreq: 'monthly', priority: '0.8', lastmod: contactData?._updatedAt },
];
```

**Tasks:**
- [ ] Fetch FAQ, Apply, Contact page data in sitemap route
- [ ] Add lastmod from `_updatedAt` fields
- [ ] Test sitemap shows accurate lastmod dates

---

## SECTION 3: LOCAL SEO - CRITICAL MISSING ELEMENTS

### Issue #8: Incomplete Business Address Information

**Status:** CRITICAL - LocalBusiness schema incomplete
**Current State:** `streetAddress` and `postalCode` are empty strings
**Location:** `src/lib/constants.ts:33-44`
**Impact:** LocalBusiness structured data is incomplete, reducing local search visibility
**Fix Required:**

Update BUSINESS_LOCATION with complete address:

```typescript
BUSINESS_LOCATION: {
  streetAddress: '[ACTUAL STREET ADDRESS]',  // REQUIRED: Add real street address
  addressLocality: 'Auckland',
  postalCode: '[ACTUAL POSTCODE]',  // REQUIRED: Add real postcode
  addressRegion: 'Auckland',
  addressCountry: 'NZ',
  latitude: -36.8323794,
  longitude: 174.396916,
  regionCode: 'NZ-AUK',
},
```

**Tasks:**
- [ ] Obtain complete business street address
- [ ] Add postcode for the business location
- [ ] Verify GPS coordinates are accurate for actual location
- [ ] Test LocalBusiness schema with Google Rich Results Test

---

### Issue #9: Placeholder Phone Number

**Status:** CRITICAL - Contact information incorrect
**Current State:** Phone number is `+64 12 345 678` (appears to be placeholder)
**Location:** `src/lib/constants.ts:25`
**Impact:** Customers cannot contact business, NAP (Name, Address, Phone) inconsistency
**Fix Required:**

Update with actual phone number:

```typescript
ORGANIZATION_PHONE: { value: '+64 XX XXX XXXX', link: 'tel:+64XXXXXXXX' },
```

**Tasks:**
- [ ] Replace placeholder with actual phone number
- [ ] Ensure phone link format is correct (tel:+64XXXXXXXX)
- [ ] Verify phone number consistency across all pages
- [ ] Update Google Business Profile with same number

---

### Issue #10: Empty Social Media Profiles Array

**Status:** MEDIUM - Missing social signals
**Current State:** `SOCIAL_MEDIA_PROFILES: []` is empty
**Location:** `src/lib/constants.ts:64`
**Impact:** Missing sameAs links in LocalBusiness schema, reduced social proof
**Fix Required:**

Add social media profile URLs:

```typescript
SOCIAL_MEDIA_PROFILES: [
  'https://www.instagram.com/omaniatraining/',
  'https://www.facebook.com/omaniatraining/',
  // Add other profiles as available
],
```

**Tasks:**
- [ ] Collect all active social media profile URLs
- [ ] Add to SOCIAL_MEDIA_PROFILES array
- [ ] Verify profiles appear in LocalBusiness schema
- [ ] Ensure social profiles link back to website

---

### Issue #11: Missing Google Business Profile Integration

**Status:** HIGH - Local discovery
**Current State:** No visible GBP integration or verification
**Impact:** Missing local pack rankings, map visibility
**Fix Required:**

1. **Claim/verify Google Business Profile** for Omania Training
2. **Add business information:**
   - Category: Personal Trainer / Fitness Coach
   - Service area: Auckland region
   - Photos: Training sessions, equipment, trainer
   - Business hours (or by appointment)
3. **Website verification** via HTML tag or Google Search Console
4. **Schema.org integration** - LocalBusiness schema helps Google connect profile to website

**Tasks:**
- [ ] Claim Google Business Profile
- [ ] Complete all profile fields (100% completion)
- [ ] Add 10+ high-quality photos
- [ ] Verify website ownership
- [ ] Request initial reviews from past clients
- [ ] Ensure NAP consistency between website and GBP

---

## SECTION 4: STRUCTURED DATA ISSUES

### Issue #12: FAQ Page Missing FAQPage Schema

**Status:** HIGH - Missing rich snippet opportunity
**Current State:** FAQ page uses Article schema instead of FAQPage schema
**Location:** `src/app/(frontend)/faq/page.tsx`
**Impact:** Missing FAQ rich snippets in search results
**Fix Required:**

Add FAQPage schema to structuredData.ts and implement on FAQ page:

```typescript
// In src/lib/structuredData.ts
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
```

**Tasks:**
- [ ] Add `generateFAQPageSchema` function to structuredData.ts
- [ ] Extract FAQ items from page content
- [ ] Add FAQPage schema to FAQ page alongside Article schema
- [ ] Test with Google Rich Results Test

---

### Issue #13: Organization Schema Missing Key Fields

**Status:** MEDIUM - Basic schema only
**Current State:** Organization schema in root layout is minimal
**Location:** `src/app/layout.tsx:27-33`
**Impact:** Missing rich organization details in search results
**Fix Required:**

Enhance Organization schema with additional fields:

```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_CONFIG.ORGANIZATION_NAME,
  url: baseUrl,
  description: SITE_CONFIG.ORGANIZATION_DESCRIPTION,
  logo: `${baseUrl}/images/logos/logo.png`,
  email: SITE_CONFIG.ORGANIZATION_EMAIL.value,
  telephone: SITE_CONFIG.ORGANIZATION_PHONE.value,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Auckland',
    addressCountry: 'NZ',
  },
  sameAs: SITE_CONFIG.SOCIAL_MEDIA_PROFILES,
};
```

**Tasks:**
- [ ] Add logo, email, telephone to Organization schema
- [ ] Add address object
- [ ] Add sameAs with social profiles
- [ ] Verify with Rich Results Test

---

### Issue #14: Contact Page Using Static Dates

**Status:** MEDIUM - Content freshness
**Current State:** Contact page uses `new Date().toISOString()` for datePublished/dateModified
**Location:** `src/app/(frontend)/contact/page.tsx:67-68`
**Impact:** Article schema shows today's date instead of actual content dates
**Fix Required:**

Fetch actual dates from Sanity contact page data:

```typescript
datePublished: contactPageData?._createdAt || new Date().toISOString(),
dateModified: contactPageData?._updatedAt || new Date().toISOString(),
```

**Tasks:**
- [ ] Ensure contact page query includes _createdAt and _updatedAt
- [ ] Use actual dates in Article schema
- [ ] Apply same fix to Apply page (similar issue)

---

## SECTION 5: CONTENT & NAVIGATION ISSUES

### Issue #15: Visual Breadcrumb Component Disabled

**Status:** HIGH - Navigation and SEO impact
**Current State:** Breadcrumb component returns `null` (entire component commented out)
**Location:** `src/components/UI/Breadcrumb.tsx:16`
**Impact:**
- Users lose navigation context
- Search engines can't use visual breadcrumbs for understanding site structure
- Inconsistent experience (structured data exists but no visual breadcrumb)

**Current Code:**
```typescript
const Breadcrumb = ({ pageTitle, pageTitleClickable = false, pageTitleHref }: BreadcrumbProps) => {
  return null;  // ENTIRE BREADCRUMB IS DISABLED
  // return (
  //   <nav ... />
  // );
};
```

**Fix Required:**

Re-enable the breadcrumb component:

```typescript
const Breadcrumb = ({ pageTitle, pageTitleClickable = false, pageTitleHref }: BreadcrumbProps) => {
  return (
    <nav
      className={`flex items-center gap-2 text-brand-secondary px-4 md:px-8 py-2 ${breadcrumbBottomSpacing}`}
      aria-label='Breadcrumb'>
      {/* ... existing breadcrumb JSX ... */}
    </nav>
  );
};
```

**Tasks:**
- [ ] Remove `return null;` line from Breadcrumb component
- [ ] Uncomment the breadcrumb JSX
- [ ] Test breadcrumb appears on all interior pages
- [ ] Verify visual breadcrumb matches structured data

---

### Issue #16: Homepage H1 Hidden from Visual UI

**Status:** LOW - Accessibility good, visual SEO consideration
**Current State:** H1 tag uses `sr-only` class (screen reader only)
**Location:** `src/components/HomeHero/HeroTitle.tsx:55`
**Impact:** Proper H1 exists for SEO/accessibility, but users don't see the primary heading

**Current Code:**
```typescript
{h1Title && <h1 className='sr-only'>{stegaClean(h1Title)}</h1>}
```

**Analysis:**
- This is a valid SEO technique when visual design requires different heading treatment
- H1 is present in DOM and accessible to search engines
- Visual title is displayed separately with mainTitle

**Recommendation:** This is acceptable if intentional design choice. Ensure the h1Title content is descriptive and keyword-rich.

**Tasks:**
- [ ] Verify h1Title field is populated with good content in Sanity
- [ ] Ensure h1Title includes primary keywords
- [ ] Consider if visual H1 display is desired for brand consistency

---

### Issue #17: Missing Internal Linking Strategy

**Status:** MEDIUM - SEO architecture
**Current State:** Limited contextual internal links between pages
**Impact:** Poor link equity distribution, reduced crawl efficiency
**Fix Required:**

**Opportunities:**

1. **Contact page → Apply page**: Already has CTA "Apply for Coaching"
2. **Apply page → Contact page**: Add "Or just want to chat? Contact me"
3. **FAQ page → Contact/Apply**: Add relevant CTAs based on FAQ content
4. **Footer quick links**: Ensure key pages are linked

**Tasks:**
- [ ] Review all page content for internal linking opportunities
- [ ] Add "Related Links" or CTAs between conversion pages
- [ ] Ensure footer includes links to all key pages
- [ ] Create content that naturally links between pages

---

## SECTION 6: TECHNICAL SEO ISSUES

### Issue #18: Missing opengraph-image.png in App Directory

**Status:** LOW - Using Sanity fallback
**Current State:** No `opengraph-image.png` in `src/app/` directory
**Location:** `src/app/` - file missing
**Impact:** Using Sanity defaultOgImage (functional but less reliable)
**Recommendation:**

Create static fallback OG image:

```
src/app/opengraph-image.png (1200x630)
```

**Tasks:**
- [ ] Create 1200x630 OG image with brand elements
- [ ] Save as `opengraph-image.png` in `src/app/`
- [ ] Test social share preview

---

### Issue #19: PWA Manifest Colors Missing Hash

**Status:** LOW - Minor configuration
**Current State:** Theme colors in manifest don't have `#` prefix
**Location:** `src/lib/constants.ts:74-75`
**Impact:** May cause color parsing issues in some browsers

**Current Code:**
```typescript
themeColor: 'ff6600',      // Missing #
backgroundColor: '282828', // Missing #
```

**Fix Required:**
```typescript
themeColor: '#ff6600',
backgroundColor: '#282828',
```

**Tasks:**
- [ ] Add `#` prefix to themeColor and backgroundColor
- [ ] Verify manifest colors display correctly

---

### Issue #20: Development Options Button in Header

**Status:** MEDIUM - Remove before production
**Current State:** "OPTS" button visible in production header
**Location:** `src/components/Header/Header.tsx:154-158`
**Impact:** Unprofessional appearance, confusing for users

**Current Code:**
```typescript
{/* TEMPORARY_DEV - Button to open modal of options  */}
<button
  onClick={() => setIsColorModalOpen(true)}
  className='cursor-pointer hover:font-bold text-body-sm'
  aria-label='Open options menu'>
  OPTS
</button>
```

**Fix Required:**

Remove or conditionally hide in production:

```typescript
{process.env.NODE_ENV === 'development' && (
  <button ... >OPTS</button>
)}
```

**Tasks:**
- [ ] Remove OPTS button from production
- [ ] Remove ColorSwitchModal import if not needed
- [ ] Clean up TEMPORARY_DEV comments

---

## SECTION 7: PERFORMANCE & CORE WEB VITALS

### Issue #21: Image Optimization Opportunities

**Status:** LOW - Already well implemented
**Current State:** UnifiedImage component with automatic sizing and blur placeholders
**Location:** `src/components/UI/UnifiedImage/UnifiedImage.tsx`
**Positive:**
- Auto DPI multiplier
- Blur-up placeholders
- Schema generation
- Context-based sizing

**Enhancement Opportunities:**
- [ ] Audit hero images for optimal dimensions (currently requesting 3840x2160)
- [ ] Review if all images have meaningful alt text in Sanity
- [ ] Consider adding AVIF format support when Next.js fully supports it

---

### Issue #22: Large JavaScript Bundle Analysis

**Status:** LOW - Requires profiling
**Current State:** Multiple providers wrapping the app may increase bundle
**Location:** `src/app/(frontend)/layout.tsx:78-126`
**Impact:** Potential LCP and TTI impact

**Current Providers:**
- ColorProvider (TEMPORARY_DEV)
- HeroStyleProvider (TEMPORARY_DEV)
- PageLoadProvider
- HeaderProvider

**Tasks:**
- [ ] Run bundle analysis with `@next/bundle-analyzer`
- [ ] Remove TEMPORARY_DEV providers before production
- [ ] Consider lazy loading non-critical components
- [ ] Monitor Core Web Vitals after launch

---

## SECTION 8: POSITIVE SEO IMPLEMENTATIONS

The following elements are **correctly implemented**:

- **robots.txt** - Properly configured with sitemap reference
- **sitemap.xml** - Dynamic generation from Sanity (needs more pages added)
- **Canonical URLs** - Implemented via `generateCanonicalUrl()` function
- **Geographic Meta Tags** - geo.region, geo.placename, geo.position, ICBM all present
- **LocalBusiness Schema** - Comprehensive implementation (needs address data)
- **Organization Schema** - Present in root layout
- **WebSite Schema** - Present in frontend layout
- **Breadcrumb Structured Data** - Implemented on all interior pages
- **Article Schema** - Present on content pages
- **Skip-to-Content Link** - Properly implemented for accessibility
- **Viewport Meta Tag** - Present in root layout
- **Font Optimization** - Using `next/font` for Saira Condensed
- **Image Optimization** - Next.js Image component via UnifiedImage
- **CSS Optimization** - `optimizeCss: true` in next.config
- **PWA Manifest** - Properly configured (needs icon fixes)
- **Open Graph Tags** - Full implementation with images
- **Twitter Cards** - summary_large_image cards configured
- **Meta Keywords** - Passed through from Sanity siteSettings
- **Draft Mode Handling** - Proper noindex for drafts
- **Sanity Live Preview** - stegaClean() used appropriately

---

## IMPLEMENTATION PRIORITY MATRIX

### CRITICAL - Fix Immediately (Pre-Launch)

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 1 | Rename icon files (remove underscore) | CRITICAL | 5 min |
| 3 | Verify production environment config | CRITICAL | 10 min |
| 8 | Add complete business address | CRITICAL | 10 min |
| 9 | Replace placeholder phone number | CRITICAL | 5 min |
| 20 | Remove OPTS dev button | CRITICAL | 5 min |

### HIGH - Week 1 (Post-Launch)

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 2 | Create 512x512 PWA icon | HIGH | 15 min |
| 4 | Add FAQ to sitemap | HIGH | 10 min |
| 5 | Add Apply to sitemap | HIGH | 5 min |
| 6 | Add Contact to sitemap | HIGH | 5 min |
| 11 | Google Business Profile setup | HIGH | 1 hour |
| 12 | FAQ Page schema | HIGH | 30 min |
| 15 | Re-enable visual breadcrumbs | HIGH | 10 min |

### MEDIUM - Week 2-3

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 7 | Sitemap lastmod dates | MEDIUM | 20 min |
| 10 | Add social media profiles | MEDIUM | 15 min |
| 13 | Enhance Organization schema | MEDIUM | 15 min |
| 14 | Fix Contact page dates | MEDIUM | 10 min |
| 17 | Internal linking strategy | MEDIUM | 2 hours |
| 19 | Fix manifest color format | MEDIUM | 5 min |
| 22 | Bundle analysis & cleanup | MEDIUM | 1 hour |

### LOW - Month 1

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 16 | Review H1 implementation | LOW | 15 min |
| 18 | Create static OG image | LOW | 20 min |
| 21 | Image optimization audit | LOW | 30 min |

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
- [ ] Local pack rankings: Top 3 for "personal trainer Auckland"
- [ ] Reviews: 10+ Google reviews, 4.5+ average
- [ ] NAP consistency: 100% across web

### Content & Engagement Metrics
- [ ] Organic traffic: Track baseline and growth
- [ ] Keyword rankings: 20+ keywords in top 10
- [ ] Contact form submissions: Track conversion rate
- [ ] Bounce rate: < 50% site-wide

---

## TESTING CHECKLIST

### Before Launch
- [ ] `/robots.txt` loads and shows correct content
- [ ] `/sitemap.xml` includes all public pages
- [ ] Favicon appears in browser tabs
- [ ] PWA "Add to Home Screen" works on mobile
- [ ] All pages have unique title tags
- [ ] All pages have meta descriptions
- [ ] Open Graph images render correctly in social shares
- [ ] No `noindex` meta tag in production
- [ ] Phone number is correct and clickable
- [ ] Email link works correctly
- [ ] Google Rich Results Test passes for all schema types

### After Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for key pages
- [ ] Monitor for crawl errors
- [ ] Verify Google Business Profile is connected
- [ ] Check mobile-friendliness report
- [ ] Monitor Core Web Vitals

---

## TOOLS & RESOURCES

### Essential SEO Tools
- Google Search Console (free)
- Google Analytics 4 (free)
- Google Business Profile (free)
- Google Rich Results Test (free)
- Lighthouse (free, built into Chrome)

### Testing Tools
- Facebook Sharing Debugger
- Twitter Card Validator
- Schema.org Validator
- Mobile-Friendly Test

---

## CONCLUSION

This comprehensive audit identified **24 SEO issues** across 8 categories. The site has a **strong technical foundation** with proper implementation of modern SEO best practices.

**Key Strengths:**
- Robust structured data implementation
- Clean Next.js 14+ architecture
- Proper metadata generation system
- Strong image optimization
- Good accessibility features

**Critical Gaps Requiring Immediate Attention:**
- Icon files not functioning (underscore prefix)
- Incomplete business address data
- Placeholder phone number
- Pages missing from sitemap
- Visual breadcrumbs disabled
- Development artifacts in production

By addressing the **Critical** and **High** priority issues before launch, Omania Training can achieve strong local search visibility and establish SEO dominance in the Auckland personal training market.

---

**Next Steps:**

1. Fix all CRITICAL issues (30-40 minutes total)
2. Deploy to production with correct environment variables
3. Set up Google Business Profile
4. Submit sitemap to Google Search Console
5. Begin HIGH priority fixes in week 1
6. Schedule monthly SEO check-ins

---

_End of Comprehensive SEO Audit - Omania Training 2025_
