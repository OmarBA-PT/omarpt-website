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

  // Contact information - single source of truth for all company contact details
  ORGANIZATION_EMAIL: {
    value: 'omar@omaniatraining.com',
    link: 'mailto:omar@omaniatraining.com',
  },
  ORGANIZATION_PHONE: { value: '+64 210 503 128', link: 'tel:+64210503128' },
  ORGANIZATION_ADDRESS: {
    value: 'Auckland, New Zealand',
    link: 'https://maps.app.goo.gl/LQrGoawnfvgoi25m9',
  },

  // Business Location Details - Used for LocalBusiness structured data (SEO)
  // Update these values if the studio relocates or business details change
  BUSINESS_LOCATION: {
    streetAddress: '',
    addressLocality: 'Auckland',
    postalCode: '1021',
    addressRegion: 'Auckland',
    addressCountry: 'NZ',
    // GPS coordinates from Google Maps - used for local SEO and map integration
    latitude: -36.859063,
    longitude: 174.748266,
    // ISO 3166-2 region code for Auckland, New Zealand
    regionCode: 'NZ-AUK',
  },

  // Business Hours - Used for LocalBusiness structured data
  BUSINESS_HOURS: 'By Appointment Only',

  // Price Range - Used for LocalBusiness structured data
  // Leave as empty string ('') to omit from schema if pricing varies
  // Valid values: '$', '$$', '$$$', '$$$$' or descriptive text
  PRICE_RANGE: '',

  // Service Areas - Geographic areas served by the business
  // Used for LocalBusiness structured data to improve local/regional SEO
  // Add or remove cities/regions as needed
  SERVICE_AREAS: [
    { type: 'Country', name: 'New Zealand' },
    { type: 'City', name: 'Auckland' },
  ],

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
