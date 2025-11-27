import React from 'react';
import { stegaClean } from 'next-sanity';
import { createComponents } from '@/sanity/portableTextComponents';
import type { RichTextBlock } from '@/types/blocks';
import {
  getResponsiveTextAlignClass,
  getResponsiveContainerAlignClass,
  type TextAlignment,
} from '../../utils/sectionHelpers';
import { resolveResponsiveAlignment } from './shared/alignmentUtils';
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';
import { maxCardWidth } from '@/utils/spacingConstants';

type RichTextProps = RichTextBlock & {
  inheritAlignment?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
};

const RichText = ({
  content,
  alignmentMode,
  desktopAlignment,
  mobileAlignment,
  textAlign, // Legacy field for backwards compatibility
  isCallout = false,
  inheritAlignment,
  fullWidth = false,
}: RichTextProps) => {
  // Clean the values to remove Sanity's stega encoding
  const cleanIsCallout = stegaClean(isCallout) || false;

  if (!content) {
    return null;
  }

  // Resolve responsive alignments
  const { desktop, mobile } = resolveResponsiveAlignment(
    alignmentMode,
    desktopAlignment,
    mobileAlignment,
    textAlign,
    inheritAlignment
  );

  // Create components with desktop alignment context (for portable text styling)
  // The desktop alignment is used as the base for portable text components
  const alignedComponents = createComponents(desktop);

  // Get responsive classes
  const textAlignClasses = getResponsiveTextAlignClass(mobile, desktop);
  const containerAlignClasses = getResponsiveContainerAlignClass(mobile, desktop);

  const proseContent = (
    <PortableTextWrapper
      value={content}
      components={alignedComponents}
      className={`prose prose-slate ${fullWidth ? 'max-w-full' : maxCardWidth} ${textAlignClasses} ${containerAlignClasses}`}
    />
  );

  // If it's a callout, wrap in Card-style container
  if (cleanIsCallout) {
    return (
      <div
        className={`${fullWidth ? 'max-w-full' : maxCardWidth} pb-2 relative text-brand-secondary ${textAlignClasses} ${containerAlignClasses} after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-brand-secondary/50`}>
        {proseContent}
      </div>
    );
  }

  return proseContent;
};

export default RichText;
