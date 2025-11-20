# Development Test Routes Guide

This guide explains how to create development/test-only routes that are automatically protected in production.

## Overview

The development test routes system allows you to create pages that are:
- ✅ Accessible in development environments
- ❌ Blocked (404) in production/staging environments
- ❌ Excluded from sitemap.xml
- ❌ Disallowed in robots.txt

This is perfect for test pages, debugging tools, and development utilities that you want to keep in the repository but prevent from being publicly accessible.

## How It Works

**Simple Convention**: Any route under `/dev-test/` is automatically treated as a development-only route.

No configuration files needed - just put your test pages inside the `/dev-test/` directory!

## Directory Structure

```
src/app/(frontend)/
├── dev-test/                 # Development test routes directory
│   ├── error/               # Test error pages
│   │   └── page.tsx
│   ├── typography/          # Test typography styles
│   │   └── page.tsx
│   ├── unified-image/       # Test image components
│   │   └── page.tsx
│   └── your-test/           # Add any test page here
│       └── page.tsx
```

**Routes accessible in development:**
- `http://localhost:3000/dev-test/error`
- `http://localhost:3000/dev-test/typography`
- `http://localhost:3000/dev-test/unified-image`
- `http://localhost:3000/dev-test/your-test`

## Architecture

The system uses pattern matching with three integration points:

1. **Middleware**: Blocks `/dev-test/*` routes in non-development environments
2. **Sitemap**: Excludes `/dev-test/*` routes from SEO indexing
3. **Robots.txt**: Disallows crawling of `/dev-test/*` routes

## Setup Verification

The system should already be configured. Here's how to verify each component:

### 1. Middleware - Blocks /dev-test/* Routes

Check that `src/middleware.ts` blocks routes starting with `/dev-test/`:

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block development/test routes (anything under /dev-test/) in non-development environments
  if (pathname.startsWith('/dev-test/') || pathname === '/dev-test') {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      return NextResponse.redirect(new URL('/404', request.url));
    }
  }

  // ... rest of middleware logic
}
```

**Environment Variable**: The middleware checks `process.env.NEXT_PUBLIC_ENV` for the environment.

### 2. Sitemap - Excludes /dev-test/* Routes

Check that `src/app/sitemap.xml/route.ts` filters out dev-test routes from dynamic pages:

```typescript
const dynamicUrls: SitemapUrl[] = [
  // Dynamic pages (exclude dev-test routes)
  ...(pages || [])
    .filter((page) => !page.slug?.current?.startsWith('dev-test'))
    .map((page) => ({
      url: `/${page.slug?.current}`,
      lastmod: page._updatedAt,
      changefreq: 'monthly',
      priority: '0.6'
    })),
];
```

### 3. Robots.txt - Disallows /dev-test/* Routes

Check that `src/app/robots.txt/route.ts` includes the disallow rule:

```typescript
const robotsText = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin/',
  'Disallow: /api/',
  'Disallow: /draft/',
  'Disallow: /studio/',
  'Disallow: /dev-test/',  // ← Blocks all routes under /dev-test/
  '',
  `Sitemap: ${baseUrl}/sitemap.xml`
].join('\n')
```

## Adding New Development/Test Pages

To add a new test page, simply create it inside the `/dev-test/` directory. **No configuration needed!**

### Step 1: Create the Page

Create your page inside the `dev-test` directory:

```bash
mkdir -p src/app/(frontend)/dev-test/your-feature
```

Create the page file:

```typescript
// src/app/(frontend)/dev-test/your-feature/page.tsx
export default function DevYourFeaturePage() {
  return (
    <div>
      <h1>Your Development Feature</h1>
      <p>This page is only accessible in development.</p>
    </div>
  );
}
```

**That's it!** The middleware, sitemap, and robots.txt will automatically handle it.

### Step 2: Access the Route

**In development:**
```
http://localhost:3000/dev-test/your-feature
```

**In production:**
```
Returns 404 - route is blocked
```

## Testing the Setup

### Development Environment

```bash
# Ensure environment is set to development
# In .env.local:
NEXT_PUBLIC_ENV=development

npm run dev
```

Visit `http://localhost:3000/dev-test/typography` - should work ✅

### Production Build

```bash
# Set environment to production
NEXT_PUBLIC_ENV=production
npm run build
npm start
```

Visit `http://localhost:3000/dev-test/typography` - should show 404 ❌

### Check Robots.txt

```bash
curl http://localhost:3000/robots.txt
```

Should include:
```
Disallow: /dev-test/
```

### Check Sitemap

```bash
curl http://localhost:3000/sitemap.xml
```

Should NOT include any `/dev-test/*` routes ❌

## Troubleshooting

### Test route is accessible in production

**Problem**: Test page can be accessed in production build.

**Solution**:
- Verify `NEXT_PUBLIC_ENV` is set to `production` in production environment
- Check that middleware is running (add console.log to test)
- Ensure the route is inside `/dev-test/` directory
- Clear `.next` cache and rebuild: `rm -rf .next && npm run build`

### Test route appears in sitemap

**Problem**: Test route shows up in sitemap.xml in production.

**Solution**:
- Verify the route is inside `dev-test/` directory
- Check the sitemap filtering logic in `src/app/sitemap.xml/route.ts`
- Ensure the slug doesn't start with `dev-test` in Sanity CMS
- Rebuild and check again

### Route returns 404 even in development

**Problem**: Test route shows 404 in development environment.

**Solution**:
- Verify `NEXT_PUBLIC_ENV=development` is set in `.env.local`
- Check that page is inside `src/app/(frontend)/dev-test/`
- Ensure `page.tsx` file exists in the route directory
- Restart dev server: `rm -rf .next && npm run dev`

### Middleware not blocking routes

**Problem**: Middleware doesn't seem to run.

**Solution**:
- Verify Next.js version supports middleware (12.2+)
- Check for TypeScript errors in middleware.ts
- Ensure `NEXT_PUBLIC_ENV` environment variable is set
- Check middleware matcher config includes your route

## Best Practices

1. **Organization**: Keep all test/dev pages under `/dev-test/`
2. **No Configuration**: Routes are auto-detected - no config files to maintain!
3. **Documentation**: Add comments in page files explaining what they test
4. **Cleanup**: Remove test routes that are no longer needed
5. **Security**: Never put sensitive data in test routes (they're in git!)
6. **Environment Variables**: Always set `NEXT_PUBLIC_ENV` in `.env.local`
7. **Descriptive Names**: Use clear route names like `error`, `typography`, `components`

## Example Use Cases

Current test routes in the project:
- `/dev-test/error` - Test error boundary and error pages
- `/dev-test/typography` - Preview all typography styles
- `/dev-test/unified-image` - Test image component variations

Additional examples you might add:
- `/dev-test/forms` - Test form validation and submission
- `/dev-test/api` - Debug API endpoints
- `/dev-test/auth` - Test authentication flows
- `/dev-test/components` - Component showcase and testing
- `/dev-test/performance` - Performance testing utilities
- `/dev-test/accessibility` - Accessibility testing tools

## Migration from Other Projects

If you're adding this system to a project that doesn't have it:

1. Create `src/app/(frontend)/dev-test/` directory
2. Update `src/middleware.ts` to block `/dev-test/` routes
3. Update `src/app/sitemap.xml/route.ts` to filter dev-test routes
4. Update `src/app/robots.txt/route.ts` to disallow `/dev-test/`
5. Move existing test pages into `/dev-test/` directory
6. Set `NEXT_PUBLIC_ENV=development` in `.env.local`
7. Test in both development and production builds

## Related Documentation

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Sitemap Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)

## Support

If you encounter issues with the dev-test routes system:

1. Check that all three files (middleware, sitemap, robots) are properly configured
2. Verify `NEXT_PUBLIC_ENV` environment variable is set correctly
3. Test with a fresh build: `rm -rf .next && npm run build`
4. Check Next.js version compatibility (requires 12.2+)
5. Verify the route is actually inside `src/app/(frontend)/dev-test/`
