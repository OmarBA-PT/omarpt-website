import React from 'react';
import { stegaClean } from 'next-sanity';
import type { GridLayoutBlock, NestedBlock } from '@/types/blocks';
import { renderBlock } from '@/utils/blockRenderer';
import type { SiteSettingsProps } from '@/types/shared';
import type { COMPANY_LINKS_QUERYResult, CONTACT_FORM_SETTINGS_QUERYResult } from '@/sanity/types';
import Card from './Card';

interface GridLayoutProps extends GridLayoutBlock {
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  contactFormSettings?: CONTACT_FORM_SETTINGS_QUERYResult | null;
  alignment?: 'left' | 'center' | 'right';
}

const GridLayout = ({
  columns = '2',
  content,
  documentId,
  documentType,
  fieldPathPrefix,
  siteSettings,
  companyLinks,
  contactFormSettings,
  alignment = 'center',
}: GridLayoutProps) => {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  const cleanColumns = stegaClean(columns) || '2';
  const validColumns = ['2', '3', '4'].includes(cleanColumns) ? cleanColumns : '2';

  const getGridClasses = (cols: string) => {
    switch (cols) {
      case '2':
        return 'w-full md:w-[calc(50%-16px)]';
      case '3':
        return 'w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]';
      case '4':
        return 'w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)]';
      default:
        return 'w-full md:w-[calc(50%-16px)]';
    }
  };

  const itemClasses = getGridClasses(validColumns);

  const renderGridItem = (item: NestedBlock, idx: number) => {
    const key = item._key || idx;
    const blockPath = fieldPathPrefix
      ? `${fieldPathPrefix}.content[_key=="${item._key}"]`
      : `content[_key=="${item._key}"]`;

    // Special handling for cards - they accept className and isGridChild props
    if (item._type === 'card') {
      return (
        <Card
          key={key}
          {...item}
          documentId={documentId}
          documentType={documentType}
          fieldPathPrefix={blockPath}
          siteSettings={siteSettings}
          companyLinks={companyLinks}
          alignment={alignment}
          className={itemClasses}
          isGridChild
        />
      );
    }

    // For all other block types, render using shared blockRenderer and wrap in grid sizing div
    const renderedBlock = renderBlock(item, {
      documentId,
      documentType,
      blockPath,
      siteSettings,
      companyLinks,
      contactFormSettings,
      alignment,
      config: documentId && documentType
        ? {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          }
        : undefined,
    });

    return (
      <div key={key} className={itemClasses}>
        {renderedBlock}
      </div>
    );
  };

  return (
    <div className='w-full flex justify-center flex-wrap gap-4 md:gap-8'>
      {content.map((item, idx) => renderGridItem(item, idx))}
    </div>
  );
};

export default GridLayout;
