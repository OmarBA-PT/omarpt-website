import React, { useState } from 'react';
import { FaqBlock } from '@/sanity/types';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface FAQBlockProps extends Omit<FaqBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const FAQBlock = ({
  faqItems = [],
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: FAQBlockProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`.trim()}>
      <div className='space-y-4'>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.faqItems[${index}]`
            : `faqItems[${index}]`;

          return (
            <div
              key={item._key}
              className='border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200'>
              {/* Question Header - Clickable */}
              <button
                onClick={() => toggleItem(index)}
                className='w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200'
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}>
                <span
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.question`)
                    : {})}
                  className='text-body-lg font-semibold text-gray-900 pr-4'>
                  {item.question}
                </span>
                <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary-500 text-white transition-transform duration-300'>
                  {isOpen ? (
                    <FaMinus className='w-4 h-4' />
                  ) : (
                    <FaPlus className='w-4 h-4' />
                  )}
                </div>
              </button>

              {/* Answer Content - Expandable */}
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.answer`)
                    : {})}
                  className='px-6 pb-6 text-body-base text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQBlock;
