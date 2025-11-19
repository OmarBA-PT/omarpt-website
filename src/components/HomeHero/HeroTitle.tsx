import React from 'react';
import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_QUERYResult } from '@/sanity/types';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import { getTextColorClasses } from './heroUtils';
import { createHeroRichTextComponents } from './heroRichTextComponents';
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';

interface HeroTitleProps {
  h1Title: NonNullable<HOME_PAGE_QUERYResult>['h1Title'];
  heroTitle: NonNullable<HOME_PAGE_QUERYResult>['heroTitle'];
  heroTextColor: NonNullable<HOME_PAGE_QUERYResult>['heroTextColor'];
  documentId: string;
  documentType: string;
  textAlignment?: string;
}

const HeroTitle = ({
  h1Title,
  heroTitle,
  heroTextColor,
  documentId,
  documentType,
  textAlignment = 'center',
}: HeroTitleProps) => {
  if (!heroTitle || !Array.isArray(heroTitle)) {
    return (
      <>
        {/* SEO and Screen Reader H1 - Hidden from visual UI */}
        {h1Title && <h1 className='sr-only'>{stegaClean(h1Title)}</h1>}
      </>
    );
  }

  // Use Hero-specific Rich Text components with dynamic alignment
  const components = createHeroRichTextComponents(textAlignment);

  // Get responsive text alignment class based on the alignment prop
  const getTextAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'text-center md:text-left'; // center on mobile, left on desktop
      case 'right':
        return 'text-center md:text-right'; // center on mobile, right on desktop
      case 'center':
      default:
        return 'text-center';
    }
  };

  return (
    <>
      {/* SEO and Screen Reader H1 - Hidden from visual UI */}
      {h1Title && <h1 className='sr-only'>{stegaClean(h1Title)}</h1>}

      {/* Visual Hero Title - Rich Text with alignment */}
      <PortableTextWrapper
        value={heroTitle}
        components={components}
        className={`
          prose prose-slate max-w-none
          ${getTextColorClasses(heroTextColor)}
          overflow-hidden
          ${getTextAlignmentClass(textAlignment)}
        `}
        dataAttributes={createSanityDataAttribute(documentId, documentType, 'heroTitle')}
      />
    </>
  );
};

export default HeroTitle;
