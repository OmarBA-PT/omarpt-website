import { sanityFetch } from '@/sanity/lib/live';
import { FAQ_PAGE_QUERY } from '@/sanity/lib/queries';
import type { FAQ_PAGE_QUERYResult } from '@/sanity/types';

export async function getFaqPage(): Promise<FAQ_PAGE_QUERYResult> {
  const { data } = await sanityFetch({
    query: FAQ_PAGE_QUERY,
  });
  return data;
}
