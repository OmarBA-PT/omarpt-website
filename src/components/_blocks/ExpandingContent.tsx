import React, { useState } from 'react';
import { renderBlock } from '@/utils/blockRenderer';
import type { ExpandingContent as ExpandingContentType } from '@/sanity/types';
import type { SiteSettingsProps } from '@/types/shared';
import type { COMPANY_LINKS_QUERYResult, CONTACT_FORM_SETTINGS_QUERYResult } from '@/sanity/types';

interface ExpandingContentProps extends Omit<ExpandingContentType, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  pathPrefix?: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  contactFormSettings?: CONTACT_FORM_SETTINGS_QUERYResult | null;
  alignment?: 'left' | 'center' | 'right';
}

const ExpandingContent = ({
  showOnDesktop = false,
  expandingContent,
  expandLabel = 'Read More',
  collapseLabel = 'Read Less',
  className = '',
  documentId,
  documentType,
  pathPrefix = '',
  siteSettings,
  companyLinks,
  contactFormSettings,
  alignment = 'center',
}: ExpandingContentProps) => {
  // State for expansion
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine the conditional class based on showOnDesktop
  // If showOnDesktop is false, hide expand/collapse on desktop (lg breakpoint) and show content expanded
  // If showOnDesktop is true, show expand/collapse on all screen sizes
  const expandableClass = showOnDesktop
    ? // Show expand/collapse on all screen sizes
      `${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`
    : // Hide expand/collapse on desktop (lg+), show content expanded
      `${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} lg:max-h-none! lg:opacity-100!`;

  const toggleClass = showOnDesktop
    ? // Show toggle on all screen sizes
      'flex'
    : // Hide toggle on desktop (lg+)
      'lg:hidden flex';

  return (
    <div className={`w-full mx-auto ${className}`.trim()}>
      {/* Expandable Content Container */}
      <div
        className={`
          overflow-hidden ${isExpanded ? 'mb-4' : ''} transition-all duration-500 ease-in-out
          ${expandableClass}
        `}>
        {expandingContent && expandingContent.length > 0 && (
          <div>
            {expandingContent.map((block, index) =>
              renderBlock(block, {
                documentId,
                documentType,
                blockPath: pathPrefix
                  ? `${pathPrefix}.expandingContent[${index}]`
                  : `expandingContent[${index}]`,
                siteSettings,
                companyLinks,
                contactFormSettings,
                alignment,
                config:
                  documentId && documentType
                    ? {
                        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
                      }
                    : undefined,
              })
            )}
          </div>
        )}
      </div>

      {/* Expand/Collapse Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${toggleClass} justify-center md:justify-start items-center gap-2 hover:font-semibold cursor-pointer`}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? `Show less: ${collapseLabel}` : `Show more: ${expandLabel}`}>
        <span className='inline-block text-gradient-primary'>
          {isExpanded ? collapseLabel : expandLabel}
        </span>
        <span className='text-brand-primary inline-flex items-center'>
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
        </span>
      </div>
    </div>
  );
};

export default ExpandingContent;
