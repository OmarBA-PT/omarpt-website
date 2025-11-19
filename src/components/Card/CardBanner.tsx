'use client';

import React from 'react';
import CardContainer from '../UI/CardContainer';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import UnifiedImage from '../UI/UnifiedImage';
import { renderBlock } from '@/utils/blockRenderer';
import CardHeader from './CardHeader';
import type { BaseCardProps, CardImage } from './types';

interface CardBannerProps extends BaseCardProps {
  image: CardImage;
}

const CardBanner = (props: CardBannerProps) => {
  const {
    title,
    subtitle,
    image,
    content,
    className = '',
    visualStyle = 'light',
    isGridChild = false,
    documentId,
    documentType,
    fieldPathPrefix,
    siteSettings,
    companyLinks,
    alignment = 'center',
    createDataAttributeConfig,
  } = props;

  // Get field path for live editing
  const getFieldPath = (field: string) => (fieldPathPrefix ? `${fieldPathPrefix}.${field}` : field);

  // Render content blocks using shared block renderer
  const renderContent = () => {
    if (!content) return null;

    return content.map((block) => {
      const typedBlock = block as { _key: string };
      const blockPath = `${getFieldPath('content')}[_key=="${typedBlock._key}"]`;

      return renderBlock(block, {
        documentId,
        documentType,
        blockPath,
        siteSettings,
        companyLinks,
        alignment,
        config: createDataAttributeConfig,
      });
    });
  };

  return (
    <CardContainer className={`${className} overflow-hidden`} isGridChild={isGridChild} noPadding visualStyle={visualStyle}>
      {/* Banner Image - Full width at top */}
      <div
        className='relative w-full aspect-[16/9]'
        {...createSanityDataAttribute(documentId, documentType, getFieldPath('image'))}>
        <UnifiedImage
          src={image}
          alt={image.alt || 'Card banner image'}
          mode='fill'
          objectFit='cover'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw'
          sanityWidth={2400}
          quality={95}
          generateSchema
          schemaContext='article'
          documentId={documentId}
          documentType={documentType}
          fieldPath={getFieldPath('image')}
        />
      </div>

      {/* Content - Center aligned */}
      <div className='flex flex-col px-6 pt-4 pb-6 text-center items-center'>
        <CardHeader
          title={title}
          subtitle={subtitle}
          documentId={documentId}
          documentType={documentType}
          fieldPathPrefix={fieldPathPrefix}
          visualStyle={visualStyle}
        />
        <div className='flex flex-col gap-4 w-full'>{renderContent()}</div>
      </div>
    </CardContainer>
  );
};

export default CardBanner;
