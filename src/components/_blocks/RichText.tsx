import React from 'react';
import { stegaClean } from 'next-sanity';
import { createComponents } from '@/sanity/portableTextComponents';
import type { RichTextBlock } from '@/types/blocks';
import { getTextAlignClass, type TextAlignment } from '../../utils/sectionHelpers';
import { resolveAlignment } from './shared/alignmentUtils';
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';
import { maxCardWidth } from '@/utils/spacingConstants';

type RichTextProps = RichTextBlock & {
  inheritAlignment?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
};

const RichText = ({
  content,
  textAlign = 'inherit',
  isCallout = false,
  inheritAlignment,
  fullWidth = false,
}: RichTextProps) => {
  // Clean the values to remove Sanity's stega encoding
  const cleanTextAlign = stegaClean(textAlign) || 'inherit';
  const cleanIsCallout = stegaClean(isCallout) || false;

  // Determine the effective text alignment
  // Resolve alignment for both callouts and regular text
  const resolved = resolveAlignment(cleanTextAlign, inheritAlignment);
  const effectiveTextAlign: TextAlignment = resolved || 'center';
  if (!content) {
    return null;
  }

  // The portable text components now handle alignment directly

  // Create components with alignment context
  const alignedComponents = createComponents(effectiveTextAlign);

  // Get container positioning classes based on alignment
  const getContainerAlignClass = (align: TextAlignment) => {
    switch (align) {
      case 'left':
        return 'mr-auto'; // Push container to the left
      case 'right':
        return 'ml-auto'; // Push container to the right
      case 'center':
        return 'mx-auto'; // Center the container
      default:
        return 'mx-auto'; // Default to center
    }
  };

  const proseContent = (
    <PortableTextWrapper
      value={content}
      components={alignedComponents}
      className={`prose prose-slate ${fullWidth ? 'max-w-full' : maxCardWidth} ${getTextAlignClass(effectiveTextAlign)} ${getContainerAlignClass(effectiveTextAlign)}`}
    />
  );

  // If it's a callout, wrap in Card-style container
  if (cleanIsCallout) {
    return (
      <div
        className={`bg-brand-white-dark rounded-tr-lg rounded-br-lg px-6 py-4 ${fullWidth ? 'max-w-full' : maxCardWidth} border-l-4 border-brand-primary shadow-sm ${getTextAlignClass(effectiveTextAlign)} ${getContainerAlignClass(effectiveTextAlign)}`}>
        {proseContent}
      </div>
    );
  }

  return proseContent;
};

export default RichText;
