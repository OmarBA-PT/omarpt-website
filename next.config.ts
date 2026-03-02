import type { NextConfig } from 'next';

// Security headers applied to all routes.
// CSP covers all known external sources: Sanity CDN, YouTube embeds, Google Maps iframes.
// Analytics sources (googletagmanager.com, etc.) are pre-included for when GA4 is added (C3).
// Tighten CSP progressively — use Content-Security-Policy-Report-Only in staging to catch violations first.
const securityHeaders = [
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
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Modern JavaScript - reduce polyfills for better performance
  transpilePackages: [],

  // CSS and JavaScript optimization
  experimental: {
    optimizeCss: true,
    cssChunking: 'strict',
  },

  // Turbopack configuration (required for Next.js 16+)
  // Empty config acknowledges Turbopack usage alongside webpack config
  turbopack: {},

  // Bundle optimization
  webpack: (config, { isServer }) => {
    // Optimize CSS chunking for better loading performance
    if (!isServer && config.optimization.splitChunks) {
      // Ensure splitChunks is an object, not false
      if (typeof config.optimization.splitChunks === 'object') {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
          },
        };
      }
    }

    return config;
  },
};

export default nextConfig;
