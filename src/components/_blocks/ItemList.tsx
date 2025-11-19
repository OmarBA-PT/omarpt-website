import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import type { ItemListBlock } from '@/types/blocks';
import { getAlignmentClasses } from './shared/alignmentUtils';

interface ItemListProps extends Omit<ItemListBlock, '_type' | '_key'> {
  className?: string;
  inheritAlignment?: 'left' | 'center' | 'right';
}

const ItemList = ({ items = [], alignment, className = '', inheritAlignment }: ItemListProps) => {
  // Use the shared alignment utilities that properly handle inherit
  const alignmentClasses = getAlignmentClasses(alignment, inheritAlignment);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`.trim()}>
      <div className={`flex flex-wrap gap-2 md:gap-3 ${alignmentClasses}`}>
        {items.map((item) => (
          <div
            key={item._key}
            className='group flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-white-dark shadow-sm'>
            {item.icon && item.icon.asset ? (
              <div className='relative w-6 h-6 flex-shrink-0'>
                <UnifiedImage
                  src={item.icon}
                  alt={item.icon.alt || 'List item icon'}
                  mode='fill'
                  sizeContext='icon'
                  objectFit='contain'
                  sizes='24px'
                />
              </div>
            ) : item.icon && !item.icon.asset ? (
              <div className='w-6 h-6 flex-shrink-0 bg-gray-100 border border-gray-200 rounded flex items-center justify-center'>
                <div className='w-3 h-3 bg-gray-300 rounded animate-pulse'></div>
              </div>
            ) : null}
            <span className='font-medium whitespace-nowrap'>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
