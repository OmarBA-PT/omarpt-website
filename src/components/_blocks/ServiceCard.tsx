import React, { useState } from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import Icon from '@/lib/iconLibrary';
import type { ServiceCardBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { maxCardWidth } from '@/utils/spacingConstants';

interface ServiceCardProps extends Omit<ServiceCardBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  index?: number;
}

const ServiceCard = ({
  image,
  title,
  subtitle,
  description,
  list,
  pricingInfo,
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
  index = 0,
}: ServiceCardProps) => {
  // State for mobile expansion
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if image should be on left (odd index) or right (even index)
  const isImageOnLeft = index % 2 === 0;

  // Convert description text to preserve line breaks
  const formattedDescription = description?.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < description.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div
      className={`w-full mx-auto ${className}`.trim()}
      {...(documentId && documentType
        ? createSanityDataAttribute(documentId, documentType, fieldPathPrefix)
        : {})}>
      <div className='flex flex-col md:flex-row md:items-start gap-6 rounded-2xl bg-brand-white/8 backdrop-blur-[20px] p-6 md:p-8'>
        {/* Image Container - Desktop order changes based on index */}
        {image && (
          <div
            className={`relative w-full md:w-1/3 aspect-4/3 overflow-hidden rounded-xl shrink-0 ${
              isImageOnLeft ? 'md:order-1' : 'md:order-2'
            }`}>
            <UnifiedImage
              src={image}
              alt={image.alt || title || 'Service image'}
              mode='fill'
              sizeContext='full'
              objectFit='cover'
              documentId={documentId}
              documentType={documentType}
              fieldPath={fieldPathPrefix ? `${fieldPathPrefix}.image` : 'image'}
            />
          </div>
        )}

        {/* Content Container */}
        <div
          className={`flex flex-col text-center md:text-left gap-4 ${isImageOnLeft ? 'md:order-2' : 'md:order-1'}`}>
          {/* Title */}
          <p
            className='text-h3 text-gradient-primary font-bold'
            {...(documentId && documentType
              ? createSanityDataAttribute(documentId, documentType, `${fieldPathPrefix}.title`)
              : {})}>
            {title}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p
              className='text-body-xl text-brand-white/90'
              {...(documentId && documentType
                ? createSanityDataAttribute(documentId, documentType, `${fieldPathPrefix}.subtitle`)
                : {})}>
              {subtitle}
            </p>
          )}

          {/* Expandable Content Container (Mobile) / Always Visible (Desktop) */}
          <div
            className={`
              overflow-hidden transition-all duration-500 ease-in-out
              md:max-h-none! md:opacity-100!
              ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 md:opacity-100'}
            `}>
            {/* Description */}
            <p
              className='text-brand-white/80 mb-4'
              {...(documentId && documentType
                ? createSanityDataAttribute(
                    documentId,
                    documentType,
                    `${fieldPathPrefix}.description`
                  )
                : {})}>
              {formattedDescription}
            </p>

            {/* List */}
            {list && list.items && list.items.length > 0 && (
              <div className='space-y-2'>
                {/* List Title */}
                <p
                  className='font-semibold text-body-lg'
                  {...(documentId && documentType
                    ? createSanityDataAttribute(
                        documentId,
                        documentType,
                        `${fieldPathPrefix}.list.title`
                      )
                    : {})}>
                  {list.title}
                </p>

                {/* List Items */}
                <ul className='space-y-2'>
                  {list.items.map((item, idx) => (
                    <li
                      key={item._key || idx}
                      className='flex justify-center items-center md:justify-start md:items-start gap-3'
                      {...(documentId && documentType
                        ? createSanityDataAttribute(
                            documentId,
                            documentType,
                            `${fieldPathPrefix}.list.items[${idx}]`
                          )
                        : {})}>
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
            )}
          </div>

          {/* Pricing Info */}
          {pricingInfo && (
            <p
              className='text-body-2xl text-brand-secondary font-bold mt-2'
              {...(documentId && documentType
                ? createSanityDataAttribute(
                    documentId,
                    documentType,
                    `${fieldPathPrefix}.pricingInfo`
                  )
                : {})}>
              {pricingInfo}
            </p>
          )}

          {/* More Info Toggle (Mobile Only) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='md:hidden flex items-center justify-center gap-2 text-body-base font-semibold text-gradient-primary mt-2'
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Show less information' : 'Show more information'}>
            <span>{isExpanded ? 'Less Info' : 'More Info'}</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <path
                fillRule='evenodd'
                d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
