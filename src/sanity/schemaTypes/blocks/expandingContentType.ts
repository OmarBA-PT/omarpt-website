// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { ExpandIcon } from '@sanity/icons';
import { CONTENT_ONLY_BLOCKS } from '../shared/blockLists';

export const expandingContentType = defineType({
  name: 'expandingContent',
  title: 'Expanding Content',
  type: 'object',
  icon: ExpandIcon,
  description: 'Content that can expand/collapse on mobile with customizable labels. On desktop, can be shown expanded by default or with the same expand/collapse behavior.',
  fields: [
    defineField({
      name: 'showOnDesktop',
      title: 'Show Expand/Collapse on Desktop',
      type: 'boolean',
      description: 'When enabled, the expand/collapse functionality will also appear on desktop. When disabled, content is always fully expanded on desktop.',
      initialValue: false,
    }),
    defineField({
      name: 'headerContent',
      title: 'Header Content',
      type: 'array',
      description: 'Content that is always visible above the expandable section.',
      of: CONTENT_ONLY_BLOCKS,
    }),
    defineField({
      name: 'expandingContent',
      title: 'Expanding Content',
      type: 'array',
      description: 'Content that will be hidden/shown based on expand/collapse state.',
      of: CONTENT_ONLY_BLOCKS,
      validation: (Rule) =>
        Rule.required().min(1).error('Expanding content must contain at least one item'),
    }),
    defineField({
      name: 'expandLabel',
      title: 'Expand Label',
      type: 'string',
      description: 'Text displayed on the button when content is collapsed.',
      initialValue: 'Read More',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'collapseLabel',
      title: 'Collapse Label',
      type: 'string',
      description: 'Text displayed on the button when content is expanded.',
      initialValue: 'Read Less',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      headerContent: 'headerContent',
      expandingContent: 'expandingContent',
      showOnDesktop: 'showOnDesktop',
      expandLabel: 'expandLabel',
    },
    prepare({ headerContent, expandingContent, showOnDesktop, expandLabel }) {
      const headerCount = headerContent?.length || 0;
      const expandingCount = expandingContent?.length || 0;
      const desktopText = showOnDesktop ? ' • Desktop expand/collapse' : ' • Auto-expand on desktop';
      const title = 'Expanding Content';
      const subtitle = `Header: ${headerCount} • Expanding: ${expandingCount}${desktopText}`;

      return {
        title,
        subtitle,
        media: ExpandIcon,
      };
    },
  },
});
