import { urlFor } from '@/sanity/lib/image';
import type { SITE_SETTINGS_QUERYResult } from '@/sanity/types';
import type { ImageObjectData } from '@/lib/imageUtils';
import { SITE_CONFIG } from '@/lib/constants';

export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
}

export interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string;
  priceRange?: string;
  image?: string;
  logo?: string;
  areaServed?: ReadonlyArray<{
    readonly type: string;
    readonly name: string;
  }>;
  sameAs?: readonly string[];
}

export interface WebSiteData {
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

export interface BlogPostData {
  headline: string;
  description?: string;
  image?: string | ImageObjectData;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    type?: string;
  };
  publisher: OrganizationData;
  url: string;
}

export interface ArticleData {
  headline: string;
  description?: string;
  image?: string | ImageObjectData;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    type?: string;
  };
  publisher: OrganizationData;
  url: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateImageObjectSchema(data: ImageObjectData) {
  return {
    '@type': 'ImageObject',
    url: data.url,
    ...(data.width && { width: data.width }),
    ...(data.height && { height: data.height }),
    ...(data.alt && { description: data.alt }),
    ...(data.caption && { caption: data.caption }),
  };
}

export function generateOrganizationSchema(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.email && { email: `mailto:${data.email}` }),
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.address && { address: data.address }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
}

export function generateLocalBusinessSchema(data: LocalBusinessData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    url: data.url,
    telephone: data.telephone,
    email: `mailto:${data.email}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      postalCode: data.address.postalCode,
      addressRegion: data.address.addressRegion,
      addressCountry: data.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    },
    ...(data.openingHours && { openingHours: data.openingHours }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.image && { image: data.image }),
    ...(data.logo && { logo: data.logo }),
    ...(data.areaServed &&
      data.areaServed.length > 0 && {
        areaServed: data.areaServed.map(area => ({
          '@type': area.type,
          name: area.name,
        })),
      }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
}

export function generateWebSiteSchema(data: WebSiteData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    ...(data.description && { description: data.description }),
    ...(data.potentialAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: data.potentialAction.target,
        'query-input': data.potentialAction.queryInput,
      },
    }),
  };
}

export function generateBlogPostSchema(data: BlogPostData) {
  const imageSchema = data.image
    ? typeof data.image === 'string'
      ? data.image
      : generateImageObjectSchema(data.image)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.headline,
    ...(data.description && { description: data.description }),
    ...(imageSchema && { image: imageSchema }),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': data.author.type || 'Person',
      name: data.author.name,
    },
    publisher: generateOrganizationSchema(data.publisher),
    url: data.url,
  };
}

export function generateArticleSchema(data: ArticleData) {
  const imageSchema = data.image
    ? typeof data.image === 'string'
      ? data.image
      : generateImageObjectSchema(data.image)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    ...(data.description && { description: data.description }),
    ...(imageSchema && { image: imageSchema }),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': data.author.type || 'Person',
      name: data.author.name,
    },
    publisher: generateOrganizationSchema(data.publisher),
    url: data.url,
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getOrganizationDataFromSiteSettings(
  siteSettings: SITE_SETTINGS_QUERYResult,
  baseUrl: string
): OrganizationData {
  return {
    name: siteSettings?.siteTitle || SITE_CONFIG.ORGANIZATION_NAME,
    url: baseUrl,
    email: SITE_CONFIG.ORGANIZATION_EMAIL.value,
    telephone: SITE_CONFIG.ORGANIZATION_PHONE.value,
    address: SITE_CONFIG.ORGANIZATION_ADDRESS.value,
    ...(siteSettings?.siteDescription && { description: siteSettings.siteDescription }),
    ...(siteSettings?.defaultOgImage && {
      logo: urlFor(siteSettings.defaultOgImage).width(512).height(512).url(),
    }),
  };
}

export function getWebSiteDataFromSiteSettings(
  siteSettings: SITE_SETTINGS_QUERYResult,
  baseUrl: string
): WebSiteData {
  return {
    name: siteSettings?.siteTitle || 'Taupiri Sound',
    url: baseUrl,
    ...(siteSettings?.siteDescription && { description: siteSettings.siteDescription }),
  };
}

/**
 * Generates LocalBusiness structured data from site settings and business constants.
 *
 * Business-specific data (location, hours, service areas, social media) is centralized
 * in SITE_CONFIG in constants.ts for easy maintenance. Update constants.ts to change
 * business information across the entire site.
 */
export function getLocalBusinessDataFromSiteSettings(
  siteSettings: SITE_SETTINGS_QUERYResult,
  baseUrl: string
): LocalBusinessData {
  return {
    name: siteSettings?.siteTitle || SITE_CONFIG.ORGANIZATION_NAME,
    description: siteSettings?.siteDescription || SITE_CONFIG.ORGANIZATION_DESCRIPTION,
    url: baseUrl,
    telephone: SITE_CONFIG.ORGANIZATION_PHONE.value,
    email: SITE_CONFIG.ORGANIZATION_EMAIL.value,
    address: {
      streetAddress: SITE_CONFIG.BUSINESS_LOCATION.streetAddress,
      addressLocality: SITE_CONFIG.BUSINESS_LOCATION.addressLocality,
      postalCode: SITE_CONFIG.BUSINESS_LOCATION.postalCode,
      addressRegion: SITE_CONFIG.BUSINESS_LOCATION.addressRegion,
      addressCountry: SITE_CONFIG.BUSINESS_LOCATION.addressCountry,
    },
    geo: {
      latitude: SITE_CONFIG.BUSINESS_LOCATION.latitude,
      longitude: SITE_CONFIG.BUSINESS_LOCATION.longitude,
    },
    openingHours: SITE_CONFIG.BUSINESS_HOURS,
    ...(SITE_CONFIG.PRICE_RANGE !== '' && { priceRange: SITE_CONFIG.PRICE_RANGE }),
    ...(siteSettings?.defaultOgImage && {
      image: urlFor(siteSettings.defaultOgImage).width(1200).height(630).url(),
    }),
    ...(siteSettings?.defaultOgImage && {
      logo: urlFor(siteSettings.defaultOgImage).width(512).height(512).url(),
    }),
    areaServed: SITE_CONFIG.SERVICE_AREAS,
    sameAs: SITE_CONFIG.SOCIAL_MEDIA_PROFILES,
  };
}

export function generateStructuredDataScript(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
