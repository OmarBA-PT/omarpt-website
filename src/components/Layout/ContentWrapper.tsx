'use client';

import React from 'react';
import {
  type SanityLiveEditingProps,
} from '../../utils/sectionHelpers';
import SectionContainer from './SectionContainer';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface ContentWrapperProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  backgroundStyle?: string; // Background style identifier
  backgroundImage?: SanityImageSource; // Background image for 'image' style
}

const ContentWrapper = ({
  children,
  className = '',
  useCompactGap = false,
  backgroundStyle,
  backgroundImage,
}: ContentWrapperProps) => {
  // Get background image URL for smokey presets or custom images
  const getBackgroundImageUrl = () => {
    // Custom image uploaded by user
    if (backgroundStyle === 'image' && backgroundImage) {
      return urlFor(backgroundImage).width(3840).height(2160).quality(90).url();
    }

    // Smokey preset backgrounds (smokey-1 through smokey-8)
    if (backgroundStyle?.startsWith('smokey-')) {
      return `/images/backgrounds/${backgroundStyle}.jpg`;
    }

    return null;
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  // Apply base class for image backgrounds
  const getBackgroundClass = () => {
    if (backgroundImageUrl) {
      return 'background-image-wrapper';
    }
    return '';
  };

  // Build inline styles for backgrounds
  const getBackgroundStyles = (): React.CSSProperties => {
    // Radial gradient (no image)
    if (backgroundStyle === 'radial-gradient') {
      return {
        background: 'var(--background-image-brand-gradient-charcoal-radial)',
      };
    }
    return {};
  };

  return (
    <div
      className={`${getBackgroundClass()} ${className}`.trim()}
      style={getBackgroundStyles()}
    >
      {/* Background image layer with gradient fade */}
      {backgroundImageUrl && (
        <div
          className="background-image-layer"
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent 0%, transparent 75%, var(--color-brand-charcoal) 100%), url(${backgroundImageUrl})`,
          }}
        />
      )}

      {/* SectionContainer provides internal padding while wrapper element has background */}
      <SectionContainer useCompactPadding={useCompactGap}>
        {children}
      </SectionContainer>
    </div>
  );
};

export default ContentWrapper;
