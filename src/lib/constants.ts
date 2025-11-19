// Site configuration constants
// This file centralizes all site-specific configuration values
// Update these values when setting up a new project

export const SITE_CONFIG = {
  // Production domain - update this for your new project
  // IMPORTANT: Always use HTTPS (not HTTP) and no trailing slash for SEO consistency
  PRODUCTION_DOMAIN: 'https://omarpt-website-production.vercel.app',

  // Maintenance Mode - Enable to show placeholder page instead of full site
  // When true: All routes redirect to maintenance page (except /studio)
  // When false: Site operates normally
  MAINTENANCE_MODE_ENABLED: false,

  // Organization information
  ORGANIZATION_NAME: 'Omania Training',
  ORGANIZATION_DESCRIPTION:
    'Omania Training is a personal training service based in Auckland, New Zealand.',

  // Contact information - single source of truth for all company contact details
  ORGANIZATION_EMAIL: {
    value: 'vitesh.bava@gmail.com',
    link: 'mailto:vitesh.bava@gmail.com',
  },
  ORGANIZATION_PHONE: { value: '+64 12 345 678', link: 'tel:+6412345678' },
  ORGANIZATION_ADDRESS: {
    value: 'Auckland, New Zealand',
    link: 'https://maps.app.goo.gl/XsK8iEYiBCjBAAZb8',
  },

  // Business Location Details - Used for LocalBusiness structured data (SEO)
  // Update these values if the studio relocates or business details change
  BUSINESS_LOCATION: {
    streetAddress: '',
    addressLocality: 'Auckland',
    postalCode: '',
    addressRegion: 'Auckland',
    addressCountry: 'NZ',
    // GPS coordinates from Google Maps - used for local SEO and map integration
    latitude: -36.8323794,
    longitude: 174.396916,
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

  // Social Media Profiles - Used for LocalBusiness structured data
  // Add additional social media URLs as they become available
  SOCIAL_MEDIA_PROFILES: [],

  // PWA Manifest Settings - Used for Progressive Web App configuration
  // Update these values to customize the "Add to Home Screen" experience
  PWA_MANIFEST: {
    name: 'Omania Training - Personal Trainer',
    shortName: 'Omania Training',
    description:
      'Professional personal training service in Auckland, New Zealand. Over a decade of experience helping clients achieve their fitness goals.',
    // Theme colors should match brand colors in globals.css
    themeColor: '', // --color-brand-primary
    backgroundColor: '', // --color-brand-secondary
  },
} as const;

// Type-safe access to configuration values
export type SiteConfig = typeof SITE_CONFIG;
