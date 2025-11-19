import { defineArrayMember } from 'sanity';

/**
 * Centralized Block List Definitions
 *
 * This file provides the single source of truth for all block lists used throughout
 * the Sanity schema. This ensures consistency and makes maintenance easier.
 *
 * IMPORTANT: When adding or removing block types, update this file only.
 * All components that accept block lists will automatically inherit the changes.
 */

/**
 * STANDARD_BLOCK_LIST - The universal block list
 *
 * This is the default block list that includes ALL content and layout blocks.
 * Use this for any component that should accept any type of content block.
 *
 * Includes:
 * - Content blocks: richText, quote, divider, imageBlock, imageGallery, videos, widgets, CTAs, lists, forms
 * - Layout blocks: twoColumnLayout, gridLayout, card
 *
 * Does NOT include: Section blocks (pageSection, subSection, subSubSection)
 * - Sections have special nesting rules and are added separately where needed
 */
export const STANDARD_BLOCK_LIST = [
  // Content Blocks
  defineArrayMember({ type: 'richText' }),
  defineArrayMember({ type: 'quote' }),
  defineArrayMember({ type: 'divider' }),
  defineArrayMember({ type: 'imageBlock' }),
  defineArrayMember({ type: 'imageGallery' }),
  defineArrayMember({ type: 'youTubeVideo' }),
  defineArrayMember({ type: 'spotifyWidget' }),
  defineArrayMember({ type: 'bandcampWidget' }),
  defineArrayMember({ type: 'ctaButton' }),
  defineArrayMember({ type: 'ctaCalloutLink' }),
  defineArrayMember({ type: 'blockListWithStats' }),
  defineArrayMember({ type: 'checkList' }),
  defineArrayMember({ type: 'itemList' }),
  defineArrayMember({ type: 'contactForm' }),
  defineArrayMember({ type: 'companyLinksBlock' }),

  // Layout Blocks
  defineArrayMember({ type: 'twoColumnLayout' }),
  defineArrayMember({ type: 'gridLayout' }),
  defineArrayMember({ type: 'card' }),
];

/**
 * PAGE_CONTENT_BLOCK_LIST - For main page content areas
 *
 * This includes the standard block list PLUS top-level PageSections.
 * Use this for the main content field of pages.
 *
 * Includes:
 * - All standard blocks (via STANDARD_BLOCK_LIST)
 * - pageSection (top-level sections only)
 */
export const PAGE_CONTENT_BLOCK_LIST = [
  defineArrayMember({ type: 'pageSection' }),
  ...STANDARD_BLOCK_LIST,
];

/**
 * Helper function to create section content block lists with nesting rules
 *
 * This enforces the section nesting hierarchy:
 * - PageSection can contain SubSections
 * - SubSection can contain SubSubSections
 * - SubSubSection cannot contain any sections
 *
 * @param allowedChildSections - Array of child section type names (e.g., ['subSection'])
 * @returns Combined array of child sections + standard blocks
 */
export function createSectionBlockList(allowedChildSections?: string[]) {
  const childSections = allowedChildSections?.map((childType) =>
    defineArrayMember({ type: childType })
  ) || [];

  return [
    ...childSections,
    ...STANDARD_BLOCK_LIST,
  ];
}
