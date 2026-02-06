import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SITE_CONFIG } from '@/lib/constants';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Dev-test route blocking (production only) ---
  // This runs BEFORE maintenance mode check to ensure dev-test routes are always protected
  if (pathname.startsWith('/dev-test/') || pathname === '/dev-test') {
    if (process.env.NEXT_PUBLIC_ENV === 'production') {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  // --- Maintenance mode ---
  if (SITE_CONFIG.MAINTENANCE_MODE_ENABLED) {
    // Allow access to Sanity Studio
    if (pathname.startsWith('/studio')) {
      return NextResponse.next();
    }

    // Allow access to the maintenance-mode page itself
    if (pathname === '/maintenance-mode') {
      return NextResponse.next();
    }

    // Allow access to static assets
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/fonts') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff|woff2|ttf|eot)$/)
    ) {
      return NextResponse.next();
    }

    // Rewrite all other requests to the maintenance-mode page
    return NextResponse.rewrite(new URL('/maintenance-mode', request.url));
  }

  // --- Draft mode routing ---
  // Check for the Next.js draft mode bypass cookie (set when entering Sanity Live Preview)
  const isDraftMode = request.cookies.has('__prerender_bypass');

  if (isDraftMode) {
    // Rewrite to the _draft route group (internal — URL stays the same in browser)
    const url = request.nextUrl.clone();
    url.pathname = `/_draft${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Configure which routes the proxy runs on
export const config = {
  matcher: [
    // Match all routes except static files, Next.js internals, Studio, and API routes
    '/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon1.png|icon2.png|studio|api/).*)',
  ],
};
