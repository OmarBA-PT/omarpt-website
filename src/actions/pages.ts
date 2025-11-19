import { sanityFetch } from '@/sanity/lib/live';
import { HOME_PAGE_QUERY, PAGE_QUERY, ALL_PAGES_QUERY } from '@/sanity/lib/queries';
import type { HOME_PAGE_QUERYResult, PAGE_QUERYResult } from '@/sanity/types';

export async function getHomePage(): Promise<HOME_PAGE_QUERYResult | null> {
  const { data: page } = await sanityFetch({
    query: HOME_PAGE_QUERY,
  });

  return page;
}

export async function getPageBySlug(slug: string): Promise<PAGE_QUERYResult | null> {
  const { data: page } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });

  return page;
}

export async function getAllPages() {
  const { data: pages } = await sanityFetch({
    query: ALL_PAGES_QUERY,
  });

  return pages;
}
