'use client';

import React from 'react';
import type {
  PAGE_QUERYResult,
  COMPANY_LINKS_QUERYResult,
  CONTACT_FORM_SETTINGS_QUERYResult,
} from '@/sanity/types';
import type { NestedBlock } from '@/types/blocks';
import type { SiteSettingsProps } from '@/types/shared';
import { client } from '@/sanity/lib/client';
import { createDataAttribute } from 'next-sanity';
import { useOptimistic } from 'react';
import {
  pageSectionTopSpacing,
  contentBlockBottomSpacing,
  subSectionTopSpacing,
} from '@/utils/spacingConstants';
import PageSection from './Layout/PageSection';
import SubSection from './Layout/SubSection';
import SubSubSection from './Layout/SubSubSection';
import Card from './_blocks/Card';
import GridLayout from './_blocks/GridLayout';
import { renderBlock } from '@/utils/blockRenderer';

// Shared interface for common props used across PageBuilder components
interface SharedPageBuilderProps {
  documentId: string;
  documentType: string;
  siteSettings?: SiteSettingsProps;
  companyLinks?: COMPANY_LINKS_QUERYResult;
  contactFormSettings?: CONTACT_FORM_SETTINGS_QUERYResult | null;
  alignment?: 'left' | 'center' | 'right';
}

type PageBuilderProps = SharedPageBuilderProps & {
  content: NonNullable<PAGE_QUERYResult>['content'];
  pathPrefix?: string;
};

type BlockRendererProps = SharedPageBuilderProps & {
  blocks: NestedBlock[];
  pathPrefix: string;
  nestingLevel?: number;
};

const { projectId, dataset, stega } = client.config();
export const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : '',
};

// Universal block renderer that can handle any block type at any nesting level
const BlockRenderer = ({
  blocks,
  documentId,
  documentType,
  pathPrefix,
  nestingLevel = 1,
  siteSettings,
  companyLinks,
  contactFormSettings,
  alignment = 'center',
}: BlockRendererProps) => {
  if (!Array.isArray(blocks)) {
    return null;
  }

  // Filter out hidden sections for spacing calculations
  const visibleBlocks = blocks.filter((block) => {
    if (
      block._type === 'pageSection' ||
      block._type === 'subSection' ||
      block._type === 'subSubSection'
    ) {
      const sectionBlock = block as { hideSection?: boolean };
      return !sectionBlock.hideSection;
    }
    return true;
  });

  return (
    <>
      {blocks.map((block) => {
        // Check if this section should be hidden from frontend but preserve for click-to-edit
        const isHiddenSection =
          (block._type === 'pageSection' ||
            block._type === 'subSection' ||
            block._type === 'subSubSection') &&
          (block as { hideSection?: boolean }).hideSection;

        // If hidden, render an invisible div that maintains click-to-edit functionality
        // but excludes content from screen readers, SEO crawlers, and page inspection
        if (isHiddenSection) {
          const blockPath = `${pathPrefix}[_key=="${block._key}"]`;
          return (
            <div
              key={block._key}
              className='hidden'
              aria-hidden='true'
              role='presentation'
              style={{ display: 'none' }}
              data-noindex='true'
              data-sanity={createDataAttribute({
                ...createDataAttributeConfig,
                id: documentId,
                type: documentType,
                path: blockPath,
              }).toString()}>
              {/* Hidden section - completely excluded from accessibility tree and SEO */}
            </div>
          );
        }

        // Find position in visible blocks for spacing calculations
        const visibleIndex = visibleBlocks.findIndex((b) => b._key === block._key);
        const blockPath = `${pathPrefix}[_key=="${block._key}"]`;

        const BlockWrapper = ({ children }: { children: React.ReactNode }) => {
          const isLastBlock = visibleIndex === visibleBlocks.length - 1;
          const hasSiblingBefore = visibleIndex > 0;

          let marginClass = '';

          if (block._type === 'pageSection') {
            // SPACE_B: PageSection that comes after orphaned content blocks
            const previousBlock = hasSiblingBefore ? visibleBlocks[visibleIndex - 1] : null;
            const hasOrphanedContentBefore =
              previousBlock &&
              previousBlock._type !== 'pageSection' &&
              previousBlock._type !== 'subSection' &&
              previousBlock._type !== 'subSubSection';

            if (hasOrphanedContentBefore) {
              marginClass = pageSectionTopSpacing;
            }
          } else if (block._type === 'subSection' || block._type === 'subSubSection') {
            // SPACE_H: SubSection/SubSubSection with sibling before it (top spacing)
            if (hasSiblingBefore) {
              marginClass = subSectionTopSpacing;
            }

            // Add bottom spacing if the next block is a content block (not a section)
            if (!isLastBlock) {
              const nextBlock = visibleBlocks[visibleIndex + 1];
              const nextBlockIsContentBlock =
                nextBlock &&
                nextBlock._type !== 'pageSection' &&
                nextBlock._type !== 'subSection' &&
                nextBlock._type !== 'subSubSection';

              if (nextBlockIsContentBlock) {
                marginClass = marginClass
                  ? `${marginClass} ${contentBlockBottomSpacing}`
                  : contentBlockBottomSpacing;
              }
            }
          } else {
            // SPACE_G: Content blocks that aren't sections
            // Don't add spacing if this is the last block (PageSection bottom padding handles it)
            if (!isLastBlock) {
              marginClass = contentBlockBottomSpacing;
            }
          }

          return (
            <div
              className={marginClass}
              data-sanity={createDataAttribute({
                ...createDataAttributeConfig,
                id: documentId,
                type: documentType,
                path: blockPath,
              }).toString()}>
              {children}
            </div>
          );
        };

        // Handle nested content for blocks that support it
        const renderNestedContent = (nestedBlocks?: unknown[]) => {
          if (!nestedBlocks || !Array.isArray(nestedBlocks)) {
            return null;
          }
          return (
            <BlockRenderer
              blocks={nestedBlocks as NestedBlock[]}
              documentId={documentId}
              documentType={documentType}
              pathPrefix={`${blockPath}.content`}
              nestingLevel={nestingLevel + 1}
              siteSettings={siteSettings}
              companyLinks={companyLinks}
              contactFormSettings={contactFormSettings}
              alignment={alignment}
            />
          );
        };

        // Determine if this PageSection should have bottom padding
        const shouldApplyBottomPadding = (() => {
          if (block._type !== 'pageSection') return true;

          const isLastVisibleBlock = visibleIndex === visibleBlocks.length - 1;
          if (!isLastVisibleBlock) return true;

          // This is the last visible PageSection, check if there are orphaned content blocks after it
          const hasOrphanedContentAfter = visibleBlocks
            .slice(visibleIndex + 1)
            .some(
              (afterBlock) =>
                afterBlock._type !== 'pageSection' &&
                afterBlock._type !== 'subSection' &&
                afterBlock._type !== 'subSubSection'
            );

          // Apply padding if there are orphaned content blocks after this section
          return hasOrphanedContentAfter;
        })();

        // IMPORTANT: All block types should be wrapped in BlockWrapper to enable Sanity Live Editing.
        // BlockWrapper provides the necessary data-sanity attributes for visual editing in Sanity Studio.
        // Only skip BlockWrapper if the block component handles its own Sanity data attributes internally.

        // Handle PageBuilder-specific blocks (sections and layouts)
        switch (block._type) {
          case 'pageSection':
            return (
              <BlockWrapper key={block._key}>
                <PageSection
                  title={block.title!} // Required field
                  titleTranslation={(block as { titleTranslation?: string }).titleTranslation}
                  subtitle={block.subtitle}
                  topText={(block as { topText?: string }).topText}
                  anchorId={block.anchorId}
                  documentId={documentId}
                  documentType={documentType}
                  titlePath={`${blockPath}.title`}
                  titleTranslationPath={`${blockPath}.titleTranslation`}
                  subtitlePath={`${blockPath}.subtitle`}
                  topTextPath={`${blockPath}.topText`}
                  inheritAlignment={alignment}
                  textAlign={(block as { textAlign?: string }).textAlign}
                  shouldApplyBottomPadding={shouldApplyBottomPadding}
                  hideGraphic={
                    documentType === 'blogPost' ||
                    documentType === 'termsAndConditions' ||
                    documentType === 'privacyPolicy'
                  }
                  useCompactGap={(block as { useCompactGap?: boolean }).useCompactGap}>
                  {renderNestedContent(block.content)}
                </PageSection>
              </BlockWrapper>
            );

          case 'subSection':
            return (
              <BlockWrapper key={block._key}>
                <SubSection
                  title={block.title!} // Required field
                  anchorId={block.anchorId}
                  documentId={documentId}
                  documentType={documentType}
                  titlePath={`${blockPath}.title`}
                  inheritAlignment={alignment}
                  textAlign={(block as { textAlign?: string }).textAlign}>
                  {renderNestedContent(block.content)}
                </SubSection>
              </BlockWrapper>
            );

          case 'subSubSection':
            return (
              <BlockWrapper key={block._key}>
                <SubSubSection
                  title={block.title!} // Required field
                  anchorId={block.anchorId}
                  documentId={documentId}
                  documentType={documentType}
                  titlePath={`${blockPath}.title`}
                  inheritAlignment={alignment}
                  textAlign={(block as { textAlign?: string }).textAlign}>
                  {renderNestedContent(block.content)}
                </SubSubSection>
              </BlockWrapper>
            );

          case 'card':
            return (
              <BlockWrapper key={block._key}>
                <Card
                  {...block}
                  documentId={documentId}
                  documentType={documentType}
                  fieldPathPrefix={blockPath}
                  siteSettings={siteSettings}
                  companyLinks={companyLinks}
                  alignment={alignment}
                />
              </BlockWrapper>
            );

          case 'gridLayout':
            return (
              <BlockWrapper key={block._key}>
                <GridLayout
                  {...block}
                  documentId={documentId}
                  documentType={documentType}
                  fieldPathPrefix={blockPath}
                />
              </BlockWrapper>
            );

          default:
            // Use shared block renderer for all other block types
            return (
              <BlockWrapper key={block._key}>
                {renderBlock(block, {
                  documentId,
                  documentType,
                  blockPath,
                  siteSettings,
                  companyLinks,
                  contactFormSettings,
                  alignment,
                  config: createDataAttributeConfig,
                })}
              </BlockWrapper>
            );
        }
      })}
    </>
  );
};

const PageBuilder = ({
  content,
  documentId,
  documentType,
  pathPrefix = 'content',
  siteSettings,
  companyLinks,
  contactFormSettings,
  alignment = 'center',
}: PageBuilderProps) => {
  const [sections] = useOptimistic<NonNullable<PAGE_QUERYResult>['content']>(content);

  if (!Array.isArray(sections)) {
    return null;
  }

  return (
    <div
      data-page-builder
      data-sanity={createDataAttribute({
        ...createDataAttributeConfig,
        id: documentId,
        type: documentType,
        path: pathPrefix,
      }).toString()}>
      <BlockRenderer
        blocks={sections as NestedBlock[]}
        documentId={documentId}
        documentType={documentType}
        pathPrefix={pathPrefix}
        siteSettings={siteSettings}
        companyLinks={companyLinks}
        contactFormSettings={contactFormSettings}
        alignment={alignment}
      />
    </div>
  );
};

export default PageBuilder;
