'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { SpotifyWidget as SpotifyWidgetType } from '@/sanity/types';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import { maxCardWidth } from '@/utils/spacingConstants';

interface SpotifyWidgetProps
  extends SpotifyWidgetType,
    Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  className?: string;
  pathPrefix?: string;
}

interface EmbedAttributes {
  src: string;
  width?: string;
  height?: string;
}

const extractEmbedAttributes = (embedCode: string): EmbedAttributes | null => {
  // Extract attributes from iframe embed code
  const iframeRegex = /<iframe[^>]*src=["']([^"']*?)["'][^>]*>/i;
  const srcMatch = embedCode.match(iframeRegex);

  if (!srcMatch) return null;

  const src = srcMatch[1];

  // Extract width attribute (supports both pixels and percentages)
  const widthRegex = /width=["']?(\d+%?)["']?/i;
  const widthMatch = embedCode.match(widthRegex);
  const width = widthMatch ? widthMatch[1] : undefined;

  // Extract height attribute
  const heightRegex = /height=["']?(\d+)["']?/i;
  const heightMatch = embedCode.match(heightRegex);
  const height = heightMatch ? heightMatch[1] : undefined;

  return { src, width, height };
};

const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({
  embedCode,
  className = '',
  documentId,
  documentType,
  pathPrefix,
}) => {
  const cleanEmbedCode = stegaClean(embedCode);

  if (!cleanEmbedCode) {
    return null;
  }

  const embedAttributes = extractEmbedAttributes(cleanEmbedCode);

  if (!embedAttributes) {
    return (
      <div className={`${className} p-4 border border-red-200 rounded-lg bg-red-50`}>
        <p className='text-red-600'>
          Invalid Spotify embed code provided. Please paste a valid Spotify iframe embed code.
        </p>
      </div>
    );
  }

  const { src, width, height } = embedAttributes;

  // Create data attribute for the widget container if Sanity props are provided
  const widgetDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, pathPrefix)
    : {};

  const iframeStyle = {
    width: width ? (width.includes('%') ? width : `${width}%`) : '100%',
    height: height ? `${height}px` : '352px', // Default to 352px if no height specified
  };

  return (
    <div className={`${className} ${maxCardWidth} mx-auto`} {...widgetDataAttribute}>
      <iframe
        src={src}
        className='hidden md:block mx-auto rounded-xl border-0'
        style={iframeStyle}
        allowFullScreen
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        loading='lazy'
        title='Spotify Player'
      />
      <iframe
        src={src}
        className='md:hidden w-full mx-auto rounded-xl border-0'
        style={iframeStyle}
        allowFullScreen
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        loading='lazy'
        title='Spotify Player'
      />
    </div>
  );
};

export default SpotifyWidget;
