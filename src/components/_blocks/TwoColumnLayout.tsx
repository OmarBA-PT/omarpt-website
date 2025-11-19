'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { NestedBlock } from '@/types/blocks';
import type { SiteSettingsProps } from '@/types/shared';
import type { COMPANY_LINKS_QUERYResult, CLIENTS_QUERYResult, EQUIPMENT_LIST_QUERYResult, TEAM_MEMBERS_QUERYResult, ALL_PROJECTS_QUERYResult, CONTACT_FORM_SETTINGS_QUERYResult } from '@/sanity/types';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import { contentBlockBottomSpacing } from '@/utils/spacingConstants';
import { renderBlock } from '@/utils/blockRenderer';
import { client } from '@/sanity/lib/client';

const { projectId, dataset, stega } = client.config();
const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : '',
};

interface TwoColumnLayoutProps extends Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  leftColumn?: NestedBlock[];
  rightColumn?: NestedBlock[];
  verticallyCenter?: boolean;
  className?: string;
  pathPrefix?: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  clientsData?: CLIENTS_QUERYResult | null;
  equipmentListData?: EQUIPMENT_LIST_QUERYResult | null;
  teamMembersData?: TEAM_MEMBERS_QUERYResult | null;
  allProjectsData?: ALL_PROJECTS_QUERYResult | null;
  contactFormSettings?: CONTACT_FORM_SETTINGS_QUERYResult | null;
  alignment?: 'left' | 'center' | 'right';
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftColumn = [],
  rightColumn = [],
  verticallyCenter = false,
  className = '',
  documentId,
  documentType,
  pathPrefix,
  siteSettings,
  companyLinks,
  clientsData,
  equipmentListData,
  teamMembersData,
  allProjectsData,
  contactFormSettings,
  alignment = 'center',
}) => {
  // Don't render if both columns are empty
  if (!leftColumn?.length && !rightColumn?.length) {
    return null;
  }

  // Clean the value to remove Sanity's stega encoding
  const cleanVerticallyCenter = stegaClean(verticallyCenter);

  // Render a single block within a column using shared renderBlock utility
  const renderColumnBlock = (block: NestedBlock, columnPath: string, isLastInColumn: boolean) => {
    const blockPath = `${columnPath}[_key=="${block._key}"]`;
    const marginClass = !isLastInColumn ? contentBlockBottomSpacing : '';

    const blockElement = renderBlock(block, {
      documentId,
      documentType,
      blockPath,
      siteSettings,
      companyLinks,
      clientsData,
      equipmentListData,
      teamMembersData,
      allProjectsData,
      contactFormSettings,
      alignment,
      config: createDataAttributeConfig,
    });

    if (!blockElement) return null;

    return (
      <div
        key={block._key}
        className={marginClass}>
        {blockElement}
      </div>
    );
  };

  // Create data attributes for Sanity live editing
  const leftColumnDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, `${pathPrefix}.leftColumn`)
    : {};
  const rightColumnDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, `${pathPrefix}.rightColumn`)
    : {};

  // Determine column alignment classes
  const columnAlignmentClass = cleanVerticallyCenter ? 'flex flex-col justify-center' : '';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${className}`.trim()}>
      {/* Left Column */}
      <div className={columnAlignmentClass} {...leftColumnDataAttribute}>
        {leftColumn.map((block, index) =>
          renderColumnBlock(block, `${pathPrefix}.leftColumn`, index === leftColumn.length - 1)
        )}
      </div>

      {/* Right Column */}
      <div className={columnAlignmentClass} {...rightColumnDataAttribute}>
        {rightColumn.map((block, index) =>
          renderColumnBlock(block, `${pathPrefix}.rightColumn`, index === rightColumn.length - 1)
        )}
      </div>
    </div>
  );
};

export default TwoColumnLayout;
