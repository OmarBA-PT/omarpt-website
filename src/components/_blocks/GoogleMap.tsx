'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { GoogleMap as GoogleMapType } from '@/sanity/types';
import { maxCardWidth } from '@/utils/spacingConstants';

interface GoogleMapProps extends GoogleMapType {
  className?: string;
}

/**
 * Extracts the src URL from a Google Maps iframe embed code
 */
const extractEmbedUrl = (embedCode: string): string | null => {
  const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = embedCode.match(iframeRegex);
  return match ? match[1] : null;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ embedCode, className = '' }) => {
  const cleanEmbedCode = stegaClean(embedCode);

  if (!cleanEmbedCode) {
    return null;
  }

  const embedUrl = extractEmbedUrl(cleanEmbedCode);

  if (!embedUrl) {
    return (
      <div className={`${className} p-4 border border-red-200 rounded-lg bg-red-50 ${maxCardWidth} mx-auto`}>
        <p className='text-red-600'>Invalid Google Maps embed code provided</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative ${maxCardWidth} mx-auto w-full aspect-4/3 overflow-hidden`}>
      <iframe
        className='absolute inset-0 w-full h-full rounded-2xl lg:rounded-[1.25rem] border-0'
        src={embedUrl}
        title='Google Map'
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        allowFullScreen
      />
    </div>
  );
};

export default GoogleMap;
