import { sanityFetch } from '@/sanity/lib/live';
import { TERMS_AND_CONDITIONS_QUERY, PRIVACY_POLICY_QUERY } from '@/sanity/lib/queries';
import type { TERMS_AND_CONDITIONS_QUERYResult, PRIVACY_POLICY_QUERYResult } from '@/sanity/types';

export async function getTermsAndConditions(): Promise<TERMS_AND_CONDITIONS_QUERYResult> {
  const { data } = await sanityFetch({
    query: TERMS_AND_CONDITIONS_QUERY,
  });
  return data;
}

export async function getPrivacyPolicy(): Promise<PRIVACY_POLICY_QUERYResult> {
  const { data } = await sanityFetch({
    query: PRIVACY_POLICY_QUERY,
  });
  return data;
}