import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { ItemListBlock } from '@/types/blocks';

interface ItemListProps extends Omit<ItemListBlock, '_type' | '_key'> {
  className?: string;
}

const ItemList = ({ title, items = [], className = '' }: ItemListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {/* List Title */}
      <p className='font-semibold text-body-lg'>{title}</p>

      {/* List Items */}
      <ul className='space-y-2'>
        {items.map((item, idx) => (
          <li key={item._key || idx} className='flex justify-center items-center md:justify-start md:items-start gap-3'>
            {/* Dumbbell Icon Bullet */}
            <div className='shrink-0 mt-1'>
              <Icon iconKey='dumbell' width={2} colorClassName='text-gradient-primary' />
            </div>

            {/* List Item Text */}
            <span className='text-brand-white/80'>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
