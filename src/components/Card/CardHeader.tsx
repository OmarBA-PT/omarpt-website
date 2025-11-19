import React from 'react';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  visualStyle?: 'light' | 'dark';
}

const CardHeader = ({
  title,
  subtitle,
  documentId,
  documentType,
  fieldPathPrefix,
  visualStyle = 'light',
}: CardHeaderProps) => {
  // Get field path for live editing
  const getFieldPath = (field: string) => (fieldPathPrefix ? `${fieldPathPrefix}.${field}` : field);

  if (!title && !subtitle) return null;

  // Dark mode uses brand-primary for title and subtle for subtitle
  const titleColor = visualStyle === 'dark' ? 'text-brand-white' : '';
  const subtitleColor = visualStyle === 'dark' ? 'text-subtle' : 'text-subtle';

  return (
    <div className='mb-3'>
      {title && (
        <p
          className={`text-h5 ${titleColor}`}
          {...createSanityDataAttribute(documentId, documentType, getFieldPath('title'))}>
          {title}
        </p>
      )}
      {subtitle && (
        <p
          className={`text-body-lg ${subtitleColor}`}
          {...createSanityDataAttribute(documentId, documentType, getFieldPath('subtitle'))}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default CardHeader;
