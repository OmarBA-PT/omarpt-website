import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SITE_CONFIG } from '@/lib/constants';

export function proxy(request: NextRequest) {
  // If maintenance mode is disabled, allow normal site operation
  if (!SITE_CONFIG.MAINTENANCE_MODE_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow access to Sanity Studio
  if (pathname.startsWith('/studio')) {
    return NextResponse.next();
  }

  // Allow access to the maintenance-mode page itself (to prevent rewrite loop)
  if (pathname === '/maintenance-mode') {
    return NextResponse.next();
  }

  // Allow access to static assets (images, fonts, etc.)
  // Note: We don't exclude /api routes - they should also show maintenance page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Rewrite all other requests to the maintenance-mode page
  // Using rewrite (not redirect) keeps the original URL in browser but serves maintenance content
  // This ensures the maintenance page metadata is used instead of the attempted route's metadata
  return NextResponse.rewrite(new URL('/maintenance-mode', request.url));
}

// Configure which routes the proxy runs on
export const config = {
  // Match all routes except static files and internal Next.js routes
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, apple-icon.png, icon1.png, icon2.png (favicons)
     */
    '/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon1.png|icon2.png).*)',
  ],
};
