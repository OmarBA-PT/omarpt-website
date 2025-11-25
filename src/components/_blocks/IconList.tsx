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
      <div className='space-y-6 w-full'>
        {items.map((item, index) => {
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.items[${index}]`
            : `items[${index}]`;

          return (
            <div
              key={item._key}
              className={`flex justify-center ${
                isHorizontal ? 'flex-row items-center gap-4' : 'flex-col items-center gap-2'
              } ${isHorizontal ? '' : 'w-full'}`}>
              {/* Icon */}
              <div
                className={`shrink-0 ${isHorizontal ? '' : 'text-center'}`}
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${itemPath}.icon`)
                  : {})}>
                <Icon
                  iconKey={item.icon as IconKey}
                  className='bg-brand-gradient-firey'
                  size={48}
                />
              </div>

              {/* Description */}
              <div className={`${isHorizontal ? '' : 'flex-1 text-center'}`}>
                <p
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.description`)
                    : {})}
                  className='text-body-3xl font-bold'>
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
