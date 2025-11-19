'use client';

import React, { useState } from 'react';
import type { EQUIPMENT_LIST_QUERYResult } from '@/sanity/types';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { maxCardWidth } from '@/utils/spacingConstants';
import UnifiedImage from '@/components/UI/UnifiedImage';
import { ChevronDownIcon } from '@sanity/icons';

interface EquipmentListProps {
  className?: string;
  equipmentListData?: EQUIPMENT_LIST_QUERYResult | null;
}

const EquipmentList = ({ className = '', equipmentListData }: EquipmentListProps) => {
  const documentId = equipmentListData?._id || 'equipmentListSingleton';
  const documentType = 'equipmentListSingleton';
  const categories = equipmentListData?.categories || [];
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [hoveredItemKey, setHoveredItemKey] = useState<string | null>(null);

  if (!categories || categories.length === 0) {
    return null;
  }

  const toggleCategory = (index: number) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  if (!equipmentListData) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {categories.map((category, categoryIndex) => {
        const categoryPath = `categories[${categoryIndex}]`;
        const isOpen = openCategoryIndex === categoryIndex;

        return (
          <div
            key={category._key}
            className={`mx-auto w-full ${maxCardWidth} rounded-lg overflow-hidden shadow-sm bg-brand-white-dark`}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(categoryIndex)}
              className='w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-brand-primary/5 transition-colors duration-200 cursor-pointer'
              aria-expanded={isOpen}
              aria-controls={`category-content-${category._key}`}>
              {/* Icon */}
              <div className='flex-shrink-0 w-8 h-8'>
                <UnifiedImage
                  src={category.icon}
                  alt={category.icon?.alt || `${category.name} icon`}
                  mode='sized'
                  width={32}
                  height={32}
                  sizeContext='icon'
                  objectFit='contain'
                  className='w-full h-auto'
                  documentId={documentId}
                  documentType={documentType}
                  fieldPath={`${categoryPath}.icon`}
                />
              </div>

              {/* Category Name */}
              <p
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${categoryPath}.name`)
                  : {})}
                className='flex-1 text-h6 font-semibold text-brand-primary'>
                {category.name}
              </p>

              {/* Chevron */}
              <div
                className={`flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}>
                <ChevronDownIcon className='w-10 h-10 text-brand-primary' />
              </div>
            </button>

            {/* Category Items */}
            <div
              id={`category-content-${category._key}`}
              className={`grid grid-cols-1 md:grid-cols-2 gap-3 px-6 transition-[max-height,padding,opacity] duration-300 ease-in-out ${
                isOpen
                  ? 'max-h-[2000px] py-4 opacity-100 overflow-visible'
                  : 'max-h-0 py-0 opacity-0 overflow-hidden'
              }`}
              style={{
                transitionProperty: 'max-height, padding, opacity',
                transitionTimingFunction: 'ease-in-out',
                transitionDuration: '300ms',
              }}
              aria-hidden={!isOpen}>
              {category.items?.map((item, itemIndex) => {
                const itemPath = `${categoryPath}.items[${itemIndex}]`;
                const isHovered = hoveredItemKey === item._key;

                return (
                  <div
                    key={item._key}
                    className='relative'
                    onMouseEnter={() =>
                      item.isTemporarilyUnavailable && setHoveredItemKey(item._key)
                    }
                    onMouseLeave={() => setHoveredItemKey(null)}
                    onTouchStart={() =>
                      item.isTemporarilyUnavailable && setHoveredItemKey(item._key)
                    }>
                    <div className='flex items-center'>
                      {/* Bullet point */}
                      <div className='flex-shrink-0 w-2 h-2 rounded-full bg-subtle mr-3' />

                      {/* Item Name */}
                      <p
                        {...(documentId && documentType
                          ? createSanityDataAttribute(documentId, documentType, `${itemPath}.name`)
                          : {})}
                        className={`text-body-base ${
                          item.isTemporarilyUnavailable
                            ? 'line-through text-subtle cursor-help'
                            : ''
                        }`}>
                        {item.name}
                      </p>
                    </div>

                    {/* Tooltip for unavailable items */}
                    {item.isTemporarilyUnavailable && item.unavailableReason && isHovered && (
                      <div className='absolute z-50 left-0 bottom-full mb-2 px-3 py-2 bg-brand-secondary text-brand-white text-body-sm rounded-md shadow-xl max-w-xs whitespace-normal pointer-events-none text-left'>
                        <div className='relative'>
                          {/* Tooltip arrow pointing down */}
                          <div className='absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800' />
                          <p
                            {...(documentId && documentType
                              ? createSanityDataAttribute(
                                  documentId,
                                  documentType,
                                  `${itemPath}.unavailableReason`
                                )
                              : {})}>
                            {item.unavailableReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentList;
