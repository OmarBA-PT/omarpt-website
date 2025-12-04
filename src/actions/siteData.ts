import { sanityFetch } from '@/sanity/lib/live';
import { HEADER_QUERY, FOOTER_QUERY, SITE_SETTINGS_QUERY, COMPANY_LINKS_QUERY, CONTACT_FORM_SETTINGS_QUERY, LEGAL_PAGES_VISIBILITY_QUERY, CONTACT_PAGE_QUERY, APPLY_PAGE_QUERY } from '@/sanity/lib/queries';
import type { FOOTER_QUERYResult, HEADER_QUERYResult, SITE_SETTINGS_QUERYResult, COMPANY_LINKS_QUERYResult, CONTACT_FORM_SETTINGS_QUERYResult, LEGAL_PAGES_VISIBILITY_QUERYResult, CONTACT_PAGE_QUERYResult, APPLY_PAGE_QUERYResult } from '@/sanity/types';

// Header actions
export async function getHeader(): Promise<HEADER_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: HEADER_QUERY,
  });

  return data;
}

// Footer actions
export async function getFooter(): Promise<FOOTER_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: FOOTER_QUERY,
  });

  return data;
}

// Site Settings actions
export async function getSiteSettings(): Promise<SITE_SETTINGS_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
  });

  return data;
}

// Company Links actions
export async function getCompanyLinks(): Promise<COMPANY_LINKS_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: COMPANY_LINKS_QUERY,
  });

  return data;
}

// Contact Form Settings actions
export async function getContactFormSettings(): Promise<CONTACT_FORM_SETTINGS_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: CONTACT_FORM_SETTINGS_QUERY,
  });

  return data;
}

// Legal Pages Visibility actions
export async function getLegalPagesVisibility(): Promise<LEGAL_PAGES_VISIBILITY_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: LEGAL_PAGES_VISIBILITY_QUERY,
  });

  return data;
}

// Contact Page actions
export async function getContactPage(): Promise<CONTACT_PAGE_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: CONTACT_PAGE_QUERY,
  });

  return data;
}

// Apply Page actions
export async function getApplyPage(): Promise<APPLY_PAGE_QUERYResult | null> {
  const { data } = await sanityFetch({
    query: APPLY_PAGE_QUERY,
  });

  return data;
}

// Unified PageBuilder data fetcher
// This fetches all global data needed by PageBuilder components in a single call
// When adding new global data (e.g., FAQ settings), add it here and to the return type
export interface PageBuilderData {
  siteSettings: SITE_SETTINGS_QUERYResult | null;
  companyLinks: COMPANY_LINKS_QUERYResult | null;
  contactFormSettings: CONTACT_FORM_SETTINGS_QUERYResult | null;
}

export async function getPageBuilderData(): Promise<PageBuilderData> {
  const [siteSettings, companyLinks, contactFormSettings] = await Promise.all([
    getSiteSettings(),
    getCompanyLinks(),
    getContactFormSettings(),
  ]);

  return {
    siteSettings,
    companyLinks,
    contactFormSettings,
  };
}
