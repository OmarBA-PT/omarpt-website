'use client';

import React, { createContext, useContext } from 'react';
import Heading from '../Typography/Heading';
import Divider from '../UI/Divider';
import { stegaClean } from 'next-sanity';
import {
  createSanityDataAttribute,
  type SanityLiveEditingProps,
  getTextAlignClass,
  type TextAlignment,
} from '../../utils/sectionHelpers';
import { resolveAlignment } from '../_blocks/shared/alignmentUtils';
import {
  sectionTitleBottomSpacing,
  sectionDividerBottomSpacing,
  sectionBottomPadding,
  sectionCompactBottomPadding,
  anchorLinkScrollMarginTop,
} from '@/utils/spacingConstants';
import UnifiedImage from '../UI/UnifiedImage';

// Context to track if PageSection has a title (affects nested section heading levels)
const PageSectionContext = createContext<{ hasTitle: boolean }>({ hasTitle: false });

interface PageSectionProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  title: string; // Now required since titles are mandatory
  titleTranslation?: string; // Optional Te Reo Māori translation or alternative title
  subtitle?: string;
  topText?: string;
  anchorId?: string; // ID for anchor linking
  inheritAlignment?: 'left' | 'center' | 'right';
  textAlign?: string; // NOTE: This field is currently not set in the CMS, but has been left here for the future in case we want to allow for section level text alignment control in the CMS
  shouldApplyBottomPadding?: boolean; // Whether to apply bottom padding (omitted for last section if no orphaned content follows)
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  topTextPath?: string;
  titleTranslationPath?: string;
  hideGraphic?: boolean;
}

const PageSection = ({
  children,
  className = '',
  title,
  titleTranslation,
  subtitle,
  topText,
  anchorId,
  documentId,
  documentType,
  titlePath,
  titleTranslationPath,
  subtitlePath,
  topTextPath,
  inheritAlignment,
  textAlign = 'inherit',
  shouldApplyBottomPadding = true,
  useCompactGap = false,
  hideGraphic = false,
}: PageSectionProps) => {
  // Create data attributes for Sanity live editing
  const titleDataAttribute = createSanityDataAttribute(documentId, documentType, titlePath);
  const titleTranslationDataAttribute = createSanityDataAttribute(
    documentId,
    documentType,
    titleTranslationPath
  );
  const subtitleDataAttribute = createSanityDataAttribute(documentId, documentType, subtitlePath);
  const topTextDataAttribute = createSanityDataAttribute(documentId, documentType, topTextPath);

  // Resolve alignment using shared utility (same as other components)
  const cleanTextAlign = stegaClean(textAlign) || 'inherit';
  const resolved = resolveAlignment(cleanTextAlign, inheritAlignment);
  const effectiveTextAlign = (resolved || 'center') as TextAlignment;

  // Get margin class for subtitle based on alignment
  const getSubtitleMarginClass = (align: TextAlignment) => {
    switch (align) {
      case 'left':
        return 'mr-auto';
      case 'right':
        return 'ml-auto';
      default: // center
        return 'mx-auto';
    }
  };

  const hasTitle = Boolean(title);

  // Determine which bottom padding to use based on compact gap setting and shouldApplyBottomPadding
  const getBottomPaddingClass = () => {
    if (!shouldApplyBottomPadding) return '';
    return useCompactGap ? sectionCompactBottomPadding : sectionBottomPadding;
  };

  return (
    <PageSectionContext.Provider value={{ hasTitle }}>
      <section
        id={anchorId ? stegaClean(anchorId) : undefined}
        className={`${getBottomPaddingClass()} ${className} ${anchorLinkScrollMarginTop}`.trim()}>
        {/* Title is now always present since it's required */}
        <div className={getTextAlignClass(effectiveTextAlign)}>
          <div className={`inline-flex items-end gap-4 sm:gap-8 ${sectionTitleBottomSpacing}`}>
            <div className='text-left'>
              <Heading level='h2' showMargin={false} className='mb-0' {...titleDataAttribute}>
                <div>
                  {stegaClean(title)}
                  {titleTranslation && (
                    <p
                      className='text-[1.5rem] sm:text-[2rem] md:text-[3rem] text-subtle'
                      {...titleTranslationDataAttribute}>
                      {stegaClean(titleTranslation)}
                    </p>
                  )}
                </div>
              </Heading>
            </div>
          </div>
          {topText && (
            <p
              className={`text-body-sm text-brand-secondary font-bold max-w-4xl whitespace-pre-line ${sectionTitleBottomSpacing} ${getSubtitleMarginClass(effectiveTextAlign)}`}
              {...topTextDataAttribute}>
              {stegaClean(topText)}
            </p>
          )}
          {subtitle && (
            <p
              className={`text-body-xl max-w-4xl whitespace-pre-line ${sectionTitleBottomSpacing} ${getSubtitleMarginClass(effectiveTextAlign)}`}
              {...subtitleDataAttribute}>
              {subtitle}
            </p>
          )}
          <div className={sectionDividerBottomSpacing}>
            <Divider size='full' color='dark' />
          </div>
        </div>
        {children}
      </section>
    </PageSectionContext.Provider>
  );
};

// Hook to access PageSection context
export const usePageSectionContext = () => useContext(PageSectionContext);

export default PageSection;
