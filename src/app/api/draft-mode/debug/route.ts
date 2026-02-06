/**
 * Debug endpoint to check draft mode configuration
 * DELETE THIS FILE after debugging is complete
 */

import { client } from '@/sanity/lib/client';
import { token } from '@/sanity/lib/token';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  // Check if token is set
  const hasToken = !!token;

  // Try to query the sanity.previewUrlSecret documents (this is what defineEnableDraftMode does)
  let secretsCount = 0;
  let queryError: string | null = null;

  try {
    const authenticatedClient = client.withConfig({ token });
    const secrets = await authenticatedClient.fetch(
      `count(*[_type == "sanity.previewUrlSecret"])`
    );
    secretsCount = secrets;
  } catch (err) {
    queryError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    debug: {
      hasToken,
      tokenLength: token?.length ?? 0,
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
      searchParams,
      secretsCount,
      queryError,
    },
  });
}
