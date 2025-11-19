// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import React from 'react';
import { EditIcon } from '@sanity/icons';
import { defineField, defineType, defineArrayMember } from 'sanity';
import { useFormValue } from 'sanity';
import { commonContentBlocks } from './shared/sectionFactory';

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  icon: EditIcon,
  groups: [
    {
      name: 'header',
      title: 'Article Header',
    },
    {
      name: 'meta',
      title: 'Article Metadata',
    },
    {
      name: 'content',
      title: 'Article Content',
    },
    {
      name: 'closingCard',
      title: 'Closing Card',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Article Title',
      description: 'The main title (H1) for the blog article',
      validation: (Rule) => Rule.required().error('Article title is required'),
      group: 'header',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL Slug',
      description: 'The URL path for this blog article',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required().error('URL slug is required'),
      group: 'header',
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Main Image',
      description: 'Optional main image for the blog article. This image will be used on the blog index page as the card image, displayed on the blog post page between the author/date section and the main content, and as the Open Graph image for social media sharing.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Helps explain what the image is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something.',
        },
      ],
      group: 'header',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      title: 'Article Subtitle',
      description: 'Optional subtitle that appears below the article title. This text will also be used for SEO meta tags (the description that appears in search engine results and when sharing on social media).',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      group: 'header',
    }),
    defineField({
      name: 'author',
      type: 'string',
      title: 'Author',
      description: 'Author of the blog article (optional)',
      validation: (Rule) => Rule.max(100),
      group: 'meta',
    }),
    defineField({
      name: 'currentPublicationDate',
      type: 'string',
      title: '📅 Current Publication Date',
      description: 'This shows what publication date will be displayed on the frontend',
      readOnly: true,
      group: 'meta',
      components: {
        input: function PublicationDateDisplay() {
          // Use Sanity's useFormValue hook to get current form data
          const createdAt = useFormValue(['_createdAt']);
          const hasOverride = useFormValue(['hasOverrideDate']);
          const overrideDate = useFormValue(['overrideDate']);

          let displayDate = 'Document not saved yet';

          if (createdAt && typeof createdAt === 'string') {
            const baseDate = new Date(createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            if (hasOverride && overrideDate && typeof overrideDate === 'string') {
              const customDate = new Date(overrideDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              displayDate = `${customDate} (Custom override of ${baseDate})`;
            } else {
              displayDate = `${baseDate} (Document creation date)`;
            }
          }

          return React.createElement('div', {
            style: {
              padding: '12px',
              backgroundColor: '#e8f5e8',
              border: '2px solid #4caf50',
              borderRadius: '8px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2e7d32',
              marginBottom: '16px'
            }
          }, [
            React.createElement('strong', { key: 'label' }, 'Publication Date: '),
            displayDate
          ]);
        }
      }
    }),
    defineField({
      name: 'hasOverrideDate',
      title: 'Override Publication Date',
      type: 'boolean',
      description: 'Check this box to set a custom publication date instead of using the document creation date',
      initialValue: false,
      group: 'meta',
    }),
    defineField({
      name: 'overrideDate',
      type: 'datetime',
      title: 'Custom Publication Date',
      description: 'Select your preferred publication date. This will be used instead of the document creation date.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { hasOverrideDate?: boolean };
          if (parent?.hasOverrideDate && !value) {
            return 'Custom publication date is required when override is enabled';
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.hasOverrideDate,
      initialValue: ({ document }) => document?._createdAt || new Date().toISOString(),
      group: 'meta',
    }),
    defineField({
      name: 'content',
      title: 'Article Content',
      type: 'array',
      description: 'Build your article content using page sections and content blocks',
      of: [
        defineArrayMember({
          type: 'pageSection',
        }),
        ...commonContentBlocks,
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'list',
            },
          ],
        },
        // Improve the modal experience
        modal: { type: 'dialog' },
      },
      group: 'content',
    }),
    defineField({
      name: 'hasClosingCard',
      title: 'Show Closing Card',
      type: 'boolean',
      group: 'closingCard',
      description: 'Display a closing card at the bottom of the article',
      initialValue: false,
    }),
    defineField({
      name: 'closingCard',
      title: 'Closing Card',
      type: 'card',
      group: 'closingCard',
      description: 'Card displayed at the bottom of the article with optional call-to-action',
      hidden: ({ parent }) => !parent?.hasClosingCard,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      subtitle: 'subtitle',
      author: 'author',
      media: 'mainImage',
      publishedAt: '_createdAt',
      overrideDate: 'overrideDate',
      hasOverrideDate: 'hasOverrideDate',
    },
    prepare({ title, author, media, publishedAt, overrideDate, hasOverrideDate }) {
      const displayDate =
        hasOverrideDate && overrideDate
          ? new Date(overrideDate).toLocaleDateString()
          : publishedAt
            ? new Date(publishedAt).toLocaleDateString()
            : '';

      const subtitleParts = [displayDate ? `Original published: ${displayDate}` : null].filter(Boolean);

      return {
        title: title || 'Untitled Blog Post',
        subtitle: subtitleParts.join(' • '),
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Title Z-A',
      name: 'titleDesc',
      by: [{ field: 'title', direction: 'desc' }],
    },
  ],
  initialValue: {
    hasOverrideDate: false,
  },
});
