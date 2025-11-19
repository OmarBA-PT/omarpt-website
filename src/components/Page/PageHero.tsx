import React from 'react';
import Heading from '../Typography/Heading';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { headerHeight } from '@/utils/spacingConstants';

interface PageHeroProps {
  title?: string | null;
  titleTeReo?: string | null;
  subtTitle?: string | null;
  documentId?: string;
  documentType?: string;
}

const PageHero = ({
  title = null,
  titleTeReo = null,
  subtTitle = null,
  documentId,
  documentType,
}: PageHeroProps) => {
  return (
    <div {...createSanityDataAttribute(documentId, documentType, 'heroImage')}>
      <section data-hero className='bg-brand-secondary text-center overflow-hidden px-5 pb-12'>
        {/* Header spacer */}
        <div className={`${headerHeight}`}></div>
        {title && (
          <Heading
            showMargin={!subtTitle}
            level='h1'
            className='text-h1 font-bold text-brand-white mt-6'>
            {title}
          </Heading>
        )}
        {titleTeReo && <p className='text-h3 text-subtle mt-1'>{titleTeReo}</p>}
        {subtTitle && (
          <p className='text-body-2xl text-brand-white mt-4 max-w-4xl mx-auto'>{subtTitle}</p>
        )}
      </section>
    </div>
  );
};

export default PageHero;
