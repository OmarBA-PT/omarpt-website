'use client';

import React from 'react';
import {
  type SanityLiveEditingProps,
} from '../../utils/sectionHelpers';
import SectionContainer from './SectionContainer';

interface ContentWrapperProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  backgroundStyle?: string; // Background style identifier
}

const ContentWrapper = ({
  children,
  className = '',
  useCompactGap = false,
  backgroundStyle,
}: ContentWrapperProps) => {
  // Apply background style classes based on backgroundStyle prop
  const getBackgroundClass = () => {
    if (!backgroundStyle) return '';
    return `section-background section-background-${backgroundStyle}`;
  };

  return (
    <div className={`${getBackgroundClass()} ${className}`.trim()}>
      {/* SectionContainer provides internal padding while wrapper element has background */}
      <SectionContainer useCompactPadding={useCompactGap}>
        {children}
      </SectionContainer>
    </div>
  );
};

export default ContentWrapper;
