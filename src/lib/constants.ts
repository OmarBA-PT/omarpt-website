// Site configuration constants
// This file centralizes all site-specific configuration values
// Update these values when setting up a new project

// NOTE: Organization name and description are managed in @/lib/organizationInfo.ts
// Import DEFAULT_ORGANIZATION_NAME, DEFAULT_ORGANIZATION_DESCRIPTION, or use the helper functions from there

export const SITE_CONFIG = {
  // Production domain - update this for your new project
  // IMPORTANT: Always use HTTPS (not HTTP) and no trailing slash for SEO consistency
  PRODUCTION_DOMAIN: 'https://omarpt-website-production.vercel.app',

  // Maintenance Mode - Enable to show placeholder page instead of full site
  // When true: All routes redirect to maintenance page (except /studio)
  // When false: Site operates normally
  MAINTENANCE_MODE_ENABLED: false,

  // NOTE: Contact information (email, phone, address) and business details are now managed in Sanity CMS
  // Go to: Site Management → Business & Contact Info
  // This includes: Business Location, Business Hours, Price Range, Service Areas
  // Access in code via helper functions from @/lib/organizationInfo:
  //   - getOrganizationEmail(), getOrganizationPhone(), getOrganizationAddress()
  //   - getBusinessLocation(), getBusinessHours(), getPriceRange(), getServiceAreas()

  // Social Media Profiles - Managed in Sanity CMS under "Company Links > Social Links"
  // Social links are fetched from Sanity and used for LocalBusiness structured data (sameAs)
  // To add/edit social profiles, use the Sanity Studio: Company Links section

  // PWA Manifest Settings - Used for Progressive Web App configuration
  // Update these values to customize the "Add to Home Screen" experience
  PWA_MANIFEST: {
    name: 'Omania Training - Personal Trainer',
    shortName: 'Omania Training',
    description:
      'Professional personal training service in Auckland, New Zealand. Over a decade of experience helping clients achieve their fitness goals.',
    // Theme colors should match brand colors in globals.css
    themeColor: 'ff6600', // --color-brand-primary
    backgroundColor: '282828', // --color-brand-secondary
  },
} as const;

// Type-safe access to configuration values
export type SiteConfig = typeof SITE_CONFIG;
