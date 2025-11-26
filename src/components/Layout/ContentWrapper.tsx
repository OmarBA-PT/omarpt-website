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
  // Apply background style classes based on backgroundStyle prop
  const getBackgroundClass = () => {
    if (!backgroundStyle) return '';
    if (backgroundStyle === 'radial-gradient') return '';
    if (backgroundStyle === 'image') return '';
    return `section-background section-background-${backgroundStyle}`;
  };

  // Get background image URL if style is 'image' and backgroundImage is provided
  const backgroundImageUrl = backgroundStyle === 'image' && backgroundImage
    ? urlFor(backgroundImage).width(3840).height(2160).quality(90).url()
    : null;

  // Build inline styles for radial gradient or image backgrounds
  const getBackgroundStyles = (): React.CSSProperties => {
    if (backgroundStyle === 'radial-gradient') {
      return {
        background: 'var(--background-image-brand-gradient-charcoal-radial)',
      };
    }
    if (backgroundStyle === 'image' && backgroundImageUrl) {
      return {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {};
  };

  return (
    <div
      className={`${getBackgroundClass()} ${className}`.trim()}
      style={getBackgroundStyles()}
    >
      {/* SectionContainer provides internal padding while wrapper element has background */}
      <SectionContainer useCompactPadding={useCompactGap}>
        {children}
      </SectionContainer>
    </div>
  );
};

export default ContentWrapper;
