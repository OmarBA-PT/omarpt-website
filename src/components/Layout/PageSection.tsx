'use client';

import React, { createContext, useContext } from 'react';
import Heading from '../Typography/Heading';
import { stegaClean } from 'next-sanity';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import { resolveAlignment } from '../_blocks/shared/alignmentUtils';
import { anchorLinkScrollMarginTop, pageTitleBottomSpacing } from '@/utils/spacingConstants';
import SectionContainer from './SectionContainer';
import { parseColoredText } from '@/utils/textHelpers';

// Context to track if PageSection has a title (affects nested section heading levels)
const PageSectionContext = createContext<{ hasTitle: boolean }>({ hasTitle: false });

interface PageSectionProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  title: string; // Now required since titles are mandatory
  subtitle?: string;
  topText?: string;
  anchorId?: string; // ID for anchor linking
  inheritAlignment?: 'left' | 'center' | 'right';
  textAlign?: string; // NOTE: This field is currently not set in the CMS, but has been left here for the future in case we want to allow for section level text alignment control in the CMS
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  topTextPath?: string;
  hideGraphic?: boolean;
  backgroundStyle?: string; // Background style identifier
}

const PageSection = ({
  children,
  className = '',
  title,
  subtitle,
  topText,
  anchorId,
  documentId,
  documentType,
  titlePath,
  subtitlePath,
  topTextPath,
  inheritAlignment,
  textAlign = 'inherit',
  useCompactGap = false,
  backgroundStyle,
}: PageSectionProps) => {
  // Create data attributes for Sanity live editing
  const titleDataAttribute = createSanityDataAttribute(documentId, documentType, titlePath);
  const subtitleDataAttribute = createSanityDataAttribute(documentId, documentType, subtitlePath);
  const topTextDataAttribute = createSanityDataAttribute(documentId, documentType, topTextPath);

  // Resolve alignment using shared utility (same as other components)
  const cleanTextAlign = stegaClean(textAlign) || 'inherit';
  const resolved = resolveAlignment(cleanTextAlign, inheritAlignment);

  const hasTitle = Boolean(title);

  // Apply background style classes based on backgroundStyle prop
  const getBackgroundClass = () => {
    if (!backgroundStyle) return '';
    return `section-background section-background-${backgroundStyle}`;
  };

  return (
    <PageSectionContext.Provider value={{ hasTitle }}>
      <section
        id={anchorId ? stegaClean(anchorId) : undefined}
        className={`${getBackgroundClass()} ${className} ${anchorLinkScrollMarginTop}`.trim()}>
        {/* SectionContainer provides internal padding while section element has background */}
        <SectionContainer useCompactPadding={useCompactGap}>
          {/* Title is now always present since it's required */}
          <div
            className={`relative pb-4 md:pb-8 text-center
              md:pl-4 md:text-left
              after:content-[""] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-1/2 after:h-[0.5] after:bg-linear-to-r after:from-brand-primary after:to-brand-secondary
              md:after:hidden
              md:before:content-[""] md:before:absolute md:before:left-0 md:before:top-0 md:before:bottom-0 md:before:w-[0.5] md:before:bg-linear-to-b md:before:from-brand-primary md:before:to-brand-secondary ${pageTitleBottomSpacing}`}>
            <div className={`inline-flex items-end gap-4 sm:gap-8`}>
              <div className='text-left'>
                <Heading level='h2' showMargin={false} className='mb-0' {...titleDataAttribute}>
                  {parseColoredText(stegaClean(title))}
                </Heading>
              </div>
            </div>
            {topText && (
              <p
                className={`text-body-sm text-brand-secondary font-bold max-w-4xl whitespace-pre-line`}
                {...topTextDataAttribute}>
                {stegaClean(topText)}
              </p>
            )}
            {subtitle && (
              <p
                className={`text-body-xl max-w-4xl whitespace-pre-line mt-2`}
                {...subtitleDataAttribute}>
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </SectionContainer>
      </section>
    </PageSectionContext.Provider>
  );
};

// Hook to access PageSection context
export const usePageSectionContext = () => useContext(PageSectionContext);

export default PageSection;
