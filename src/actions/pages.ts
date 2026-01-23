import { sanityFetch } from '@/sanity/lib/live';
import { HOME_PAGE_HERO_QUERY, HOME_PAGE_SECTIONS_QUERY, PAGE_QUERY, ALL_PAGES_QUERY } from '@/sanity/lib/queries';
import type { HOME_PAGE_HERO_QUERYResult, HOME_PAGE_SECTIONS_QUERYResult, PAGE_QUERYResult } from '@/sanity/types';

export async function getHomePageHero(): Promise<HOME_PAGE_HERO_QUERYResult | null> {
  const { data: hero } = await sanityFetch({
    query: HOME_PAGE_HERO_QUERY,
  });

  return hero;
}

export async function getHomePageSections(): Promise<HOME_PAGE_SECTIONS_QUERYResult | null> {
  const { data: sections } = await sanityFetch({
    query: HOME_PAGE_SECTIONS_QUERY,
  });

  return sections;
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
