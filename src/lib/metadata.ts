import { Metadata } from 'next';
import { urlFor } from '@/sanity/lib/image';
import type { SEO_META_DATA_QUERYResult } from '@/sanity/types';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Get the base URL for the site
 * Priority: NEXT_PUBLIC_BASE_URL env var > SITE_CONFIG.PRODUCTION_DOMAIN > localhost fallback
 * Always returns URL without trailing slash for consistency
 */
export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fallbackUrl = SITE_CONFIG.PRODUCTION_DOMAIN;
  const localhostUrl = 'http://localhost:3000';

  // Use env var if set, otherwise use production domain, finally localhost for dev
  const baseUrl = envUrl || fallbackUrl || localhostUrl;

  // Remove trailing slash if present
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with / and remove any trailing slashes except for root
  const cleanPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `${baseUrl}${cleanPath}`;
}

export interface MetadataConfig {
  title?: string;
  description?: string;
  image?: {
    asset?: { _ref: string } | null;
    alt?: string | null;
  } | null;
  canonicalUrl?: string;
  seoMetaData: SEO_META_DATA_QUERYResult;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description,
  image,
  canonicalUrl,
  seoMetaData,
  publishedTime,
  modifiedTime,
}: MetadataConfig): Metadata {
  const siteTitle = seoMetaData?.siteTitle || SITE_CONFIG.ORGANIZATION_NAME;
  const siteTagline = seoMetaData?.siteTagline ? ` | ${seoMetaData.siteTagline}` : '';
  const siteDescription = seoMetaData?.siteDescription || '';
  const seoKeywords = seoMetaData?.seoKeywords || '';

  // Generate page title
  const pageTitle = title ? `${siteTitle} | ${title}` : `${siteTitle}${siteTagline}`;

  // Generate description
  const pageDescription = description || siteDescription;

  // Generate OG image URL
  let ogImageUrl: string | undefined;
  let ogImageAlt: string | undefined;

  if (image?.asset?._ref) {
    // Use provided image
    ogImageUrl = urlFor(image).width(1200).height(630).url();
    ogImageAlt = image.alt || `${siteTitle} - ${title || siteTagline}`;
  } else if (seoMetaData?.defaultOgImage?.asset?._ref) {
    // Fall back to site default image
    ogImageUrl = urlFor(seoMetaData.defaultOgImage).width(1200).height(630).url();
    ogImageAlt = seoMetaData.defaultOgImage.alt || `${siteTitle} - ${title || siteTagline}`;
  }

  const metadata: Metadata = {
    metadataBase: new URL(getBaseUrl()),
    title: pageTitle,
    description: pageDescription,
    keywords: seoKeywords || undefined,
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    // Geographic meta tags for local SEO
    other: {
      'geo.region': SITE_CONFIG.BUSINESS_LOCATION.regionCode,
      'geo.placename': SITE_CONFIG.BUSINESS_LOCATION.addressLocality,
      'geo.position': `${SITE_CONFIG.BUSINESS_LOCATION.latitude};${SITE_CONFIG.BUSINESS_LOCATION.longitude}`,
      ICBM: `${SITE_CONFIG.BUSINESS_LOCATION.latitude}, ${SITE_CONFIG.BUSINESS_LOCATION.longitude}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: publishedTime ? 'article' : 'website',
      ...(canonicalUrl && { url: canonicalUrl }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogImageAlt || `${siteTitle} - ${title || siteTagline}`,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            alt: ogImageAlt || `${siteTitle} - ${title || siteTagline}`,
          },
        ],
      }),
    },
  };

  return metadata;
}
