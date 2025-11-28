import React, { useState } from 'react';
import { renderBlock } from '@/utils/blockRenderer';
import type { ExpandingContent as ExpandingContentType } from '@/sanity/types';
import type { SiteSettingsProps } from '@/types/shared';
import type { COMPANY_LINKS_QUERYResult, CONTACT_FORM_SETTINGS_QUERYResult } from '@/sanity/types';
import MoreInfoToggle from '../UI/MoreInfoToggle';

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
      <MoreInfoToggle
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        expandLabel={expandLabel}
        collapseLabel={collapseLabel}
      />
    </div>
  );
};

export default ExpandingContent;
