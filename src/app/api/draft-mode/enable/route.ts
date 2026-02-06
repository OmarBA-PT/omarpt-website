/**
 * This file is used to allow Presentation to set the app in Draft Mode, which will load Visual Editing
 * and query draft content and preview the content as it will appear once everything is published
 */

import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { client } from '@/sanity/lib/client';
import { token } from '@/sanity/lib/token';

const isDev = process.env.NODE_ENV === 'development';

// Create the production handler using defineEnableDraftMode
const productionHandler = defineEnableDraftMode({
  client: client.withConfig({ token }),
});

// Development handler that bypasses secret validation
// This is needed when preview secrets haven't been created in the Sanity dataset
async function developmentHandler(request: NextRequest) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/';

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the requested page
  redirect(redirectTo);
}

// Export the appropriate handler based on environment
export const GET = isDev ? developmentHandler : productionHandler.GET;
