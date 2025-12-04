// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'The main title (H1) of the contact page',
      validation: (Rule) => Rule.required().error('Page title is required'),
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      title: 'Page Subtitle',
      description:
        'Optional subtitle that appears below the page title. This text will also be used for SEO meta tags (the description that appears in search engine results and when sharing on social media).',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
        subtitle: 'Contact form and information',
      };
    },
  },
});
