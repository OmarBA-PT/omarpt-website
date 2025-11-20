import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Web App Manifest - Enables "Add to Home Screen" functionality
 *
 * This manifest allows users to install the website as a Progressive Web App (PWA)
 * on mobile devices, providing an app-like experience.
 *
 * PWA settings (name, colors, description) are centralized in SITE_CONFIG.PWA_MANIFEST
 * in constants.ts for easy maintenance. Update constants.ts to change PWA configuration.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.PWA_MANIFEST.name,
    short_name: SITE_CONFIG.PWA_MANIFEST.shortName,
    description: SITE_CONFIG.PWA_MANIFEST.description,
    start_url: '/',
    display: 'standalone',
    background_color: SITE_CONFIG.PWA_MANIFEST.backgroundColor,
    theme_color: SITE_CONFIG.PWA_MANIFEST.themeColor,
    icons: [
      {
        src: '/icon2.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      // TODO: Create 512x512 icon for better quality on high-res devices
      // Once created, uncomment the following:
      // {
      //   src: '/icon-512.png',
      //   sizes: '512x512',
      //   type: 'image/png',
      //   purpose: 'any',
      // },
    ],
  };
}
