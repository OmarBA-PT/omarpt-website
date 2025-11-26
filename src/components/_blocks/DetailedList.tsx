import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { IconKey } from '@/lib/iconLibrary';
import type { DetailedList as DetailedListType } from '@/sanity/types';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import UnifiedImage from '@/components/UI/UnifiedImage';

interface DetailedListProps extends Omit<DetailedListType, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const DetailedList = ({
  items = [],
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: DetailedListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center w-full ${className}`.trim()}>
      <div className='space-y-8 mt-10 mb-12 w-full'>
        {items.map((item, index) => {
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.items[${index}]`
            : `items[${index}]`;

          // Check if using custom image or library icon
          const isCustomImage = (item as { iconType?: string }).iconType === 'custom';
          const customImage = (item as { customImage?: { alt?: string } }).customImage;
          const hasIcon = isCustomImage ? !!customImage : !!item.icon;

          return (
            <div key={item._key} className='w-full'>
              {/* Title */}
              <p
                className='text-h3 bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent mb-4'
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${itemPath}.title`)
                  : {})}>
                {item.title}
              </p>

              {/* Icon and Description Container */}
              <div className={`flex ${hasIcon ? 'gap-4' : ''} items-start`}>
                {/* Icon or Custom Image (if provided) */}
                {hasIcon && (
                  <div
                    className='shrink-0'
                    {...(documentId && documentType
                      ? createSanityDataAttribute(
                          documentId,
                          documentType,
                          isCustomImage ? `${itemPath}.customImage` : `${itemPath}.icon`
                        )
                      : {})}>
                    {isCustomImage && customImage ? (
                      <UnifiedImage
                        src={customImage}
                        alt={customImage.alt || item.title || 'Icon'}
                        mode='sized'
                        width={80}
                        height={80}
                        sizeContext='icon'
                        objectFit='contain'
                        className='w-12 h-12 md:w-16 md:h-16'
                      />
                    ) : (
                      <Icon
                        iconKey={item.icon as IconKey}
                        className='text-brand-secondary'
                        size={48}
                      />
                    )}
                  </div>
                )}

                {/* Description */}
                <div className='flex-1'>
                  <p
                    {...(documentId && documentType
                      ? createSanityDataAttribute(
                          documentId,
                          documentType,
                          `${itemPath}.description`
                        )
                      : {})}
                    className='whitespace-pre-line'>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Gradient Underline Border */}
              <div
                className='mt-4 h-[0.5px] bg-linear-to-r from-brand-primary to-brand-secondary'
                style={{ opacity: 0.2 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedList;
