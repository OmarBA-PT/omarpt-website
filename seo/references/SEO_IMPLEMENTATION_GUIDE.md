# SEO Infrastructure Implementation Guide
*For Issues #1, #2, #3 from SEO Analysis Report*

## Overview
This guide explains how to implement robots.txt, sitemap.xml, and canonical tags for a Next.js + Sanity CMS setup where content is dynamically generated and automatically updated when content editors make changes.

---

## **#1 - Robots.txt Implementation**

**Approach**: Create a dynamic `robots.txt` route that pulls sitemap URL from environment/config.

### File Location: `src/app/robots.txt/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://0717records.com';

  const robotsContent = `User-agent: *
Allow: /

# Block admin areas
Disallow: /studio
Disallow: /api/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
```

**Updates automatically**: When you change base URL or add new restricted areas.

---

## **#2 - Dynamic Sitemap.xml**

**Approach**: Create a sitemap route that queries all your Sanity content and generates XML.

### File Location: `src/app/sitemap.xml/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getAllPages, getAllBlogPosts, getAllEvents, getAllCollabs } from '@/actions';

// ISR: Cache for 1 hour, but allow immediate updates via webhook
export const revalidate = 3600;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://0717records.com';

  // Fetch all content from Sanity
  const [pages, blogPosts, events, collabs] = await Promise.all([
    getAllPages(), // You'd need to create this action
    getAllBlogPosts(), // Similar to existing blog queries
    getAllEvents(),
    getAllCollabs(),
  ]);

  const staticPages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/events', changefreq: 'weekly', priority: '0.8' },
    { url: '/collabs', changefreq: 'weekly', priority: '0.8' },
  ];

  const dynamicUrls = [
    // Blog posts
    ...blogPosts.map(post => ({
      url: `/blog/${post.slug?.current}`,
      lastmod: post._updatedAt,
      changefreq: 'monthly',
      priority: '0.7'
    })),
    // Dynamic pages
    ...pages.map(page => ({
      url: `/${page.slug?.current}`,
      lastmod: page._updatedAt,
      changefreq: 'monthly',
      priority: '0.6'
    })),
    // Events (if they have individual pages)
    // Collabs (if they have individual pages)
  ];

  const allUrls = [...staticPages, ...dynamicUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
```

**Updates automatically**:
- **ISR**: Sitemap cached for 1 hour, then refreshes automatically
- **Simple & reliable**: No manual configuration needed
- **Performance optimized**: Fast responses with regular content updates

---

## **#3 - Canonical Tags**

**Approach**: Update your metadata generation to include canonical URLs.

### Update Existing File: `src/lib/metadata.ts`

```typescript
// src/lib/metadata.ts - Update your existing function
export function generateMetadata({
  title,
  description,
  image,
  siteSettings,
  canonicalUrl, // Add this parameter
}: MetadataConfig & { canonicalUrl?: string }): Metadata {
  const siteTitle = siteSettings?.siteTitle || '07:17 Records';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://0717records.com';

  // ... existing code ...

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    keywords: seoKeywords || undefined,
    // Add canonical URL
    alternates: {
      canonical: canonicalUrl || baseUrl, // Use provided canonical or default to base
    },
    // ... rest of existing metadata
  };

  return metadata;
}
```

### Example Implementation in Pages:

```typescript
// src/app/(frontend)/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  const siteSettings = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://0717records.com';

  return generatePageMetadata({
    title: post?.title,
    description: post?.excerpt,
    image: post?.heroImage,
    siteSettings,
    canonicalUrl: `${baseUrl}/blog/${params.slug}`, // Explicit canonical
  });
}
```

---

## **Auto-Updates Strategy**

**ISR (Incremental Static Regeneration)** handles automatic updates:
- Sitemap refreshes every hour automatically
- No manual configuration required
- Leverages existing `SanityLive` for real-time preview updates
- Perfect balance of performance and freshness for SEO needs

---

## **Implementation Order**

### Phase 1: Foundation
1. **Start with #1 (robots.txt)** - Simplest, no Sanity queries needed
   - Create `src/app/robots.txt/route.ts`
   - Test at `/robots.txt`

### Phase 2: Metadata Enhancement
2. **Then #3 (canonical tags)** - Update existing metadata system
   - Modify `src/lib/metadata.ts`
   - Update page components to pass canonical URLs
   - Test with view-source on various pages

### Phase 3: Content Discovery
3. **Finally #2 (sitemap)** - Most complex, requires querying all content types
   - Create `getAllPages()` action if needed
   - Create `src/app/sitemap.xml/route.ts`
   - Test sitemap generation and content accuracy


---

## **Key Benefits**

This approach ensures:
- ✅ **Dynamic generation** based on actual Sanity content
- ✅ **Automatic updates** when editors change content
- ✅ **No manual maintenance** of SEO infrastructure
- ✅ **Real-time accuracy** of robots.txt, sitemap, and canonicals
- ✅ **Performance optimized** with Next.js caching strategies

---

## **Testing Checklist**

After implementation:
- [ ] `/robots.txt` loads and shows correct content
- [ ] `/sitemap.xml` loads and includes all pages/posts
- [ ] Canonical tags appear in page source
- [ ] Sitemap updates when content is published/changed
- [ ] URLs in sitemap are accessible and correct

---

*This implementation will provide a robust, automatically-updating SEO foundation that scales with your content growth.*