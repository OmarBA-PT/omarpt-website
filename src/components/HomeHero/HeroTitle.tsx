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
  isDefault?: boolean;
}

const HeroTitle = ({
  h1Title,
  heroTitle,
  heroTextColor,
  documentId,
  documentType,
  textAlignment = 'center',
  isDefault = false,
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

  // Get container alignment class based on the alignment prop
  const getContainerAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'mx-auto md:mx-0 md:mr-auto'; // center on mobile, left on desktop
      case 'right':
        return 'mx-auto md:mx md:ml-auto'; // center on mobile, right on desktop
      case 'center':
      default:
        return 'mx-auto';
    }
  };

  return (
    <>
      {/* SEO and Screen Reader H1 - Hidden from visual UI */}
      {h1Title && <h1 className='sr-only'>{stegaClean(h1Title)}</h1>}

      {/* Visual Hero Title - Rich Text with alignment and fixed width on desktop */}
      <div
        className={`w-full ${isDefault ? '' : 'md:w-[33vw]'} ${getContainerAlignmentClass(textAlignment)}`}>
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
      </div>
    </>
  );
};

export default HeroTitle;
