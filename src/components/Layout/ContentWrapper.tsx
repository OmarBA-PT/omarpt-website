'use client';

import React from 'react';
import {
  type SanityLiveEditingProps,
} from '../../utils/sectionHelpers';
import {
  sectionBottomPadding,
  sectionCompactBottomPadding,
} from '@/utils/spacingConstants';

interface ContentWrapperProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  shouldApplyBottomPadding?: boolean; // Whether to apply bottom padding (omitted for last wrapper if no content follows)
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  backgroundStyle?: string; // Background style identifier (not yet implemented)
}

const ContentWrapper = ({
  children,
  className = '',
  shouldApplyBottomPadding = true,
  useCompactGap = false,
  backgroundStyle,
}: ContentWrapperProps) => {
  // Determine which bottom padding to use based on compact gap setting and shouldApplyBottomPadding
  const getBottomPaddingClass = () => {
    if (!shouldApplyBottomPadding) return '';
    return useCompactGap ? sectionCompactBottomPadding : sectionBottomPadding;
  };

  // TODO: Implement background styling based on backgroundStyle prop
  // For now, backgroundStyle is accepted but not used
  // When implemented, add conditional className based on backgroundStyle value

  return (
    <div
      className={`${getBottomPaddingClass()} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ContentWrapper;
