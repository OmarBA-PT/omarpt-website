'use client';

import React from 'react';
import CardContainer from '../UI/CardContainer';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import UnifiedImage from '../UI/UnifiedImage';
import { renderBlock } from '@/utils/blockRenderer';
import CardHeader from './CardHeader';
import type { BaseCardProps, CardImage, CardLayoutStyle } from './types';

interface CardIconProps extends BaseCardProps {
  image: CardImage;
  layoutStyle: CardLayoutStyle;
}

const CardIcon = (props: CardIconProps) => {
  const {
    title,
    subtitle,
    image,
    content,
    layoutStyle,
    className = '',
    visualStyle = 'light',
    isGridChild = false,
    documentId,
    documentType,
    fieldPathPrefix,
    siteSettings,
    companyLinks,
    createDataAttributeConfig,
  } = props;

  // Get field path for live editing
  const getFieldPath = (field: string) => (fieldPathPrefix ? `${fieldPathPrefix}.${field}` : field);

  // Layout configuration
  // Stacked: Mobile is row (horizontal), Desktop is column (vertical, centered)
  // Row: Always row (horizontal) for all screen sizes
  const isStacked = layoutStyle === 'stacked';
  const flexDirection = isStacked ? 'flex-row md:flex-col' : 'flex-row';
  const textAlignment = isStacked ? 'text-left md:text-center' : 'text-left';
  const itemsAlignment = isStacked ? 'items-start md:items-center' : 'items-start';

  // Render content blocks using shared block renderer
  // Note: We render content twice (mobile and desktop) for stacked to handle different alignments
  const renderContent = (alignment: 'left' | 'center' | 'right') => {
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
    <CardContainer
      className={`${className} flex ${flexDirection} gap-y-2 gap-x-4 ${itemsAlignment}`}
      isGridChild={isGridChild}
      visualStyle={visualStyle}>
      {/* Icon */}
      <div
        className='flex-shrink-0'
        {...createSanityDataAttribute(documentId, documentType, getFieldPath('image'))}>
        <UnifiedImage
          src={image}
          alt={image.alt || 'Icon'}
          mode='sized'
          width={100}
          height={100}
          sizeContext='profile'
          objectFit='contain'
          className='w-10 h-10'
          documentId={documentId}
          documentType={documentType}
          fieldPath={getFieldPath('image')}
        />
      </div>

      {/* Header and Content */}
      <div className={`flex-1 flex flex-col ${textAlignment}`}>
        <CardHeader
          title={title}
          subtitle={subtitle}
          documentId={documentId}
          documentType={documentType}
          fieldPathPrefix={fieldPathPrefix}
          visualStyle={visualStyle}
        />
        {/* Render content with responsive alignment for stacked, or always left for row */}
        {isStacked ? (
          <>
            {/* Mobile: left-aligned */}
            <div className='flex flex-col items-start gap-4 w-full md:hidden'>
              {renderContent('left')}
            </div>
            {/* Desktop: center-aligned */}
            <div className='hidden md:flex md:flex-col md:items-center gap-4 w-full'>
              {renderContent('center')}
            </div>
          </>
        ) : (
          <div className='flex flex-col items-start gap-4 w-full'>{renderContent('left')}</div>
        )}
      </div>
    </CardContainer>
  );
};

export default CardIcon;
