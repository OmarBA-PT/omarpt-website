import React from 'react';
import { Saira_Condensed } from 'next/font/google';
import '@/app/globals.css';
import { SITE_CONFIG } from '@/lib/constants';

const sairaCondensed = Saira_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isProd = process.env.NEXT_PUBLIC_ENV === 'production';
  // Use consistent baseUrl - will use NEXT_PUBLIC_BASE_URL if set, otherwise SITE_CONFIG.PRODUCTION_DOMAIN
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_CONFIG.PRODUCTION_DOMAIN;

  // Only show robots meta tag if:
  // 1. NOT in production (always hide), OR
  // 2. In production AND maintenance mode is OFF
  const shouldHideFromRobots = !isProd || SITE_CONFIG.MAINTENANCE_MODE_ENABLED;

  // Basic organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.ORGANIZATION_NAME,
    url: baseUrl,
    description: SITE_CONFIG.ORGANIZATION_DESCRIPTION,
  };

  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {shouldHideFromRobots && <meta name='robots' content='noindex, nofollow' />}

        {/* Resource hints for performance */}
        <link rel='dns-prefetch' href='//cdn.sanity.io' />
        <link rel='preconnect' href='https://cdn.sanity.io' crossOrigin='anonymous' />

        {/* Critical CSS inline for faster LCP - Simplified for maintainability */}
        {/*
          ⚠️  IMPORTANT: Only essential layout styles are duplicated from src/app/globals.css
          ⚠️  When changing these critical values, update BOTH:
          ⚠️  1. This inline critical CSS (for performance)
          ⚠️  2. The corresponding styles in src/app/globals.css (for consistency)
          ⚠️
          ⚠️  DUPLICATED STYLES: header positioning, main padding, scroll padding, brand colors
        */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical layout-only styles - KEEP IN SYNC with globals.css */
            html {
              scroll-padding-top: 5rem; 
            }

            @media (min-width: 768px) {
              html {
                scroll-padding-top: 6rem; 
              }
            }

            body { margin: 0; padding: 0; }

            /* Essential brand colors for immediate render */
            :root {
              --color-brand-primary: #ffb200;
              --color-brand-secondary: #ff8400;
            }
          `,
          }}
        />

        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`${sairaCondensed.className} text-body-base text-white bg-brand-charcoal`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
