import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { IconKey } from '@/lib/iconLibrary';
import type { IconListBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import UnifiedImage from '@/components/UI/UnifiedImage';

interface IconListProps extends Omit<IconListBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const IconList = ({
  items = [],
  layout = 'horizontal',
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: IconListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`flex flex-col items-center w-full ${className}`.trim()}>
      <div className='space-y-12 mt-10 mb-12 w-full'>
        {items.map((item, index) => {
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.items[${index}]`
            : `items[${index}]`;

          // Check if using custom image or library icon
          const isCustomImage = (item as { iconType?: string }).iconType === 'custom';
          const customImage = (item as { customImage?: { alt?: string } }).customImage;

          return (
            <div
              key={item._key}
              className={`flex justify-center flex-col items-center gap-4 ${
                isHorizontal ? 'md:flex-row md:gap-8' : 'w-full'
              }`}>
              {/* Icon or Custom Image */}
              <div
                className={`shrink-0 ${isHorizontal ? '' : 'text-center'}`}
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
                    alt={customImage.alt || item.description || 'Icon'}
                    mode='sized'
                    width={120}
                    height={120}
                    sizeContext='logo'
                    objectFit='contain'
                    className='w-12 h-12 md:w-16 md:h-16'
                  />
                ) : (
                  <Icon iconKey={item.icon as IconKey} className='text-brand-secondary' size={48} />
                )}
              </div>

              {/* Description */}
              <div className={`${isHorizontal ? '' : 'flex-1'}`}>
                <p
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.description`)
                    : {})}
                  className='text-body-3xl font-bold text-center'>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconList;
