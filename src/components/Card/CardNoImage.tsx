'use client';

import React from 'react';
import CardContainer from '../UI/CardContainer';
import { renderBlock } from '@/utils/blockRenderer';
import CardHeader from './CardHeader';
import type { BaseCardProps, CardLayoutStyle } from './types';

interface CardNoImageProps extends BaseCardProps {
  layoutStyle: CardLayoutStyle;
}

const CardNoImage = (props: CardNoImageProps) => {
  const {
    title,
    subtitle,
    content,
    layoutStyle,
    className = '',
    isGridChild = false,
    visualStyle = 'light',
    documentId,
    documentType,
    fieldPathPrefix,
    siteSettings,
    companyLinks,
    createDataAttributeConfig,
  } = props;

  // Get field path for live editing
  const getFieldPath = (field: string) => (fieldPathPrefix ? `${fieldPathPrefix}.${field}` : field);

  // Determine alignment based on layout style
  // Note: rowLarge and rowSmall are treated as 'row' for No Image cards
  const cardAlignment = layoutStyle === 'stacked' ? 'center' : 'left';

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
        alignment: cardAlignment,
        config: createDataAttributeConfig,
      });
    });
  };

  // Stacked layout
  if (layoutStyle === 'stacked') {
    return (
      <CardContainer
        className={`${className} flex flex-col text-center items-center`}
        isGridChild={isGridChild}
        visualStyle={visualStyle}>
        <CardHeader
          title={title}
          subtitle={subtitle}
          documentId={documentId}
          documentType={documentType}
          fieldPathPrefix={fieldPathPrefix}
          visualStyle={visualStyle}
        />
        <div className='flex flex-col gap-4 w-full'>{renderContent()}</div>
      </CardContainer>
    );
  }

  // Row layout
  return (
    <CardContainer
      className={`${className} flex flex-col items-start text-left`}
      isGridChild={isGridChild}
      visualStyle={visualStyle}>
      <CardHeader
        title={title}
        subtitle={subtitle}
        documentId={documentId}
        documentType={documentType}
        fieldPathPrefix={fieldPathPrefix}
        visualStyle={visualStyle}
      />
      <div className='flex flex-col items-start gap-4 w-full'>{renderContent()}</div>
    </CardContainer>
  );
};

export default CardNoImage;
