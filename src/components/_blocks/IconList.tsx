import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { IconKey } from '@/lib/iconLibrary';
import type { IconListBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';

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

          return (
            <div
              key={item._key}
              className={`flex justify-center flex-col items-center gap-4 ${
                isHorizontal ? 'md:flex-row md:gap-6' : 'w-full'
              }`}>
              {/* Icon */}
              <div
                className={`flex justify-center items-center`}
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${itemPath}.icon`)
                  : {})}>
                <Icon
                  iconKey={item.icon as IconKey}
                  width={3}
                  colorClassName='text-gradient-firey'
                />
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
