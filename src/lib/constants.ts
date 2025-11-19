// Site configuration constants
// This file centralizes all site-specific configuration values
// Update these values when setting up a new project

export const SITE_CONFIG = {
  // Production domain - update this for your new project
  // IMPORTANT: Always use HTTPS (not HTTP) and no trailing slash for SEO consistency
  PRODUCTION_DOMAIN: 'https://taupirisound.co.nz',

  // Maintenance Mode - Enable to show placeholder page instead of full site
  // When true: All routes redirect to maintenance page (except /studio)
  // When false: Site operates normally
  MAINTENANCE_MODE_ENABLED: false,

  // Organization information
  ORGANIZATION_NAME: 'Taupiri Sound',
  ORGANIZATION_DESCRIPTION:
    "Taupiri Sound is a recording studio based in the countryside of northern Waikato. For over a decade we have worked on countless projects from educational resources to some of Aotearoa's best artists.",

  // Contact information - single source of truth for all company contact details
  ORGANIZATION_EMAIL: {
    value: 'lance@taupirisound.co.nz',
    link: 'mailto:lance@taupirisound.co.nz',
  },
  ORGANIZATION_PHONE: { value: '+64 21 311 903', link: 'tel:+6421311903' },
  ORGANIZATION_ADDRESS: {
    value: 'Topview Road, Taupiri 3792, New Zealand',
    link: 'https://maps.app.goo.gl/AXFyaZad32c1c2sx6',
  },

  // Business Location Details - Used for LocalBusiness structured data (SEO)
  // Update these values if the studio relocates or business details change
  BUSINESS_LOCATION: {
    streetAddress: 'Topview Road',
    addressLocality: 'Taupiri',
    postalCode: '3792',
    addressRegion: 'Waikato',
    addressCountry: 'NZ',
    // GPS coordinates from Google Maps - used for local SEO and map integration
    latitude: -37.5940869,
    longitude: 175.2095489,
    // ISO 3166-2 region code for Waikato, New Zealand
    regionCode: 'NZ-WKO',
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
    { type: 'State', name: 'Waikato' },
    { type: 'City', name: 'Hamilton' },
    { type: 'City', name: 'Auckland' },
  ],

  // Social Media Profiles - Used for LocalBusiness structured data
  // Add additional social media URLs as they become available
  SOCIAL_MEDIA_PROFILES: ['https://www.facebook.com/taupirisound/'],

  // PWA Manifest Settings - Used for Progressive Web App configuration
  // Update these values to customize the "Add to Home Screen" experience
  PWA_MANIFEST: {
    name: 'Taupiri Sound - Recording Studio',
    shortName: 'Taupiri Sound',
    description:
      'Professional recording studio in Waikato, New Zealand. Over a decade of experience working with artists and educational projects.',
    // Theme colors should match brand colors in globals.css
    themeColor: '#900000', // --color-brand-primary
    backgroundColor: '#430c08', // --color-brand-secondary
  },
} as const;

// Type-safe access to configuration values
export type SiteConfig = typeof SITE_CONFIG;
