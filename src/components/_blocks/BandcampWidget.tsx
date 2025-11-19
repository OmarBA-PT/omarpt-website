'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { BandcampWidget as BandcampWidgetType } from '@/sanity/types';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';

interface BandcampWidgetProps
  extends BandcampWidgetType,
    Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  className?: string;
  pathPrefix?: string;
}

const BandcampWidget: React.FC<BandcampWidgetProps> = ({
  embedCode,
  documentId,
  documentType,
  pathPrefix,
}) => {
  const cleanEmbedCode = stegaClean(embedCode);

  if (!cleanEmbedCode) {
    return null;
  }

  // Extract iframe src and dimensions from embed code
  const iframeSrcMatch = cleanEmbedCode.match(/src="([^"]+)"/);
  const embedUrl = iframeSrcMatch ? iframeSrcMatch[1] : null;

  // Extract width and height from either attributes or inline styles
  const widthAttrMatch = cleanEmbedCode.match(/width="(\d+)"/);
  const heightAttrMatch = cleanEmbedCode.match(/height="(\d+)"/);
  const widthStyleMatch = cleanEmbedCode.match(/width:\s*(\d+)px/);
  const heightStyleMatch = cleanEmbedCode.match(/height:\s*(\d+)px/);

  const embedWidth = widthAttrMatch?.[1] || widthStyleMatch?.[1];
  const embedHeight = heightAttrMatch?.[1] || heightStyleMatch?.[1];

  if (!embedUrl) {
    return (
      <div className={`p-4 border border-red-200 rounded-lg bg-red-50`}>
        <p className='text-red-600'>
          Invalid Bandcamp embed code provided. Please paste the complete iframe embed code from
          Bandcamp.
        </p>
      </div>
    );
  }

  // Create data attribute for the widget container if Sanity props are provided
  const widgetDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, pathPrefix)
    : {};

  // Parse URL parameters to determine widget type
  const sizeMatch = embedUrl.match(/size=([^&/]+)(?:[&/]|$)/);
  const tracklistMatch = embedUrl.match(/tracklist=([^&/]+)(?:[&/]|$)/);
  const artworkMatch = embedUrl.match(/artwork=([^&/]+)(?:[&/]|$)/);
  const minimalMatch = embedUrl.match(/minimal=([^&/]+)(?:[&/]|$)/);

  const size = sizeMatch ? sizeMatch[1] : null;
  const tracklist = tracklistMatch ? tracklistMatch[1] : null;
  const artwork = artworkMatch ? artworkMatch[1] : null;
  const minimal = minimalMatch ? minimalMatch[1] : null;

  // Helper function to get height with fallback
  const getHeight = (fallback: number) => (embedHeight ? parseInt(embedHeight) : fallback);

  // Determine max width - use embedWidth if available, otherwise default to 700px
  const maxWidth = embedWidth ? parseInt(embedWidth) : 700;

  const style: React.CSSProperties = {
    width: `${maxWidth}px`,
  };

  // Determine widget type and apply appropriate styles
  if (size === 'small') {
    // SLIM: Small size with no artwork
    style.height = '42px';
  } else if (minimal === 'true') {
    // ARTWORK ONLY: Square aspect ratio
    style.aspectRatio = '1';
  } else if ((artwork === 'none' || artwork === 'small') && tracklist === 'false') {
    // SMALL PLAYER: Small/no artwork with no tracklist
    style.height = '120px';
  } else if (artwork === 'none' || artwork === 'small') {
    // SMALL PLAYER WITH TRACKLIST: Small/no artwork with tracklist
    style.height = `${getHeight(406)}px`;
  } else {
    // BIG ARTWORK: Use aspect ratio based on dimensions
    style.aspectRatio = `${maxWidth} / ${getHeight(500)}`;
  }

  return (
    <div className='w-full rounded-2xl flex justify-center'>
      <iframe
        {...widgetDataAttribute}
        style={style}
        src={embedUrl}
        title='Bandcamp Player'
        seamless
      />
    </div>
  );
};

export default BandcampWidget;
