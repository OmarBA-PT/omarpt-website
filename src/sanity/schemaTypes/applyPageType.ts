// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';
import { createLinkFieldSet } from './shared/linkSystem';

export const applyPageType = defineType({
  name: 'applyPage',
  title: 'Apply Page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {
      name: 'header',
      title: 'Page Header',
    },
    {
      name: 'applyOnline',
      title: 'Apply Online Section',
    },
    {
      name: 'downloadPdf',
      title: 'Download PDF Section',
    },
    {
      name: 'closingCard',
      title: 'Closing Card',
    },
  ],
  fields: [
    // Page Header Group
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'The main title (H1) of the apply page',
      validation: (Rule) => Rule.required().error('Page title is required'),
      group: 'header',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      title: 'Page Subtitle',
      description:
        'Optional subtitle that appears below the page title. This text will also be used for SEO meta tags (the description that appears in search engine results and when sharing on social media).',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      group: 'header',
    }),
    defineField({
      name: 'introduction',
      type: 'text',
      title: 'Introduction Text',
      description: 'Introduction text shown below the hero section (e.g., "Ready to start your fitness journey? Choose how you\'d like to apply below.")',
      rows: 2,
      initialValue: "Ready to start your fitness journey? Choose how you'd like to apply below.",
      validation: (Rule) => Rule.max(300),
      group: 'header',
    }),

    // Apply Online Section Group
    defineField({
      name: 'applyOnlineTitle',
      type: 'string',
      title: 'Apply Online Title',
      description: 'Title for the online application card (e.g., "Submit online")',
      initialValue: 'Submit online',
      validation: (Rule) => Rule.max(50),
      group: 'applyOnline',
    }),
    defineField({
      name: 'applyOnlineSubtitle',
      type: 'text',
      title: 'Apply Online Subtitle',
      description: 'Description text for the online application card',
      rows: 2,
      initialValue: 'Submit your application using my online form.',
      validation: (Rule) => Rule.max(200),
      group: 'applyOnline',
    }),

    // Download PDF Section Group
    defineField({
      name: 'downloadPdfTitle',
      type: 'string',
      title: 'Download PDF Title',
      description: 'Title for the PDF download card',
      initialValue: 'Download PDF',
      validation: (Rule) => Rule.max(50),
      group: 'downloadPdf',
    }),
    defineField({
      name: 'downloadPdfSubtitle',
      type: 'text',
      title: 'Download PDF Subtitle',
      description: 'Description text for the PDF download card',
      rows: 2,
      initialValue: 'If you prefer, you can apply via PDF and email back to me.',
      validation: (Rule) => Rule.max(200),
      group: 'downloadPdf',
    }),

    // Closing Card Group
    defineField({
      name: 'closingCardTitle',
      type: 'string',
      title: 'Card Title',
      description: 'The main heading of the closing call-to-action card',
      initialValue: 'Just enquiring?',
      validation: (Rule) => Rule.max(100),
      group: 'closingCard',
    }),
    defineField({
      name: 'closingCardBody',
      type: 'text',
      title: 'Card Body Text',
      description: 'The main content text of the closing card',
      rows: 3,
      initialValue:
        'Not ready to apply yet? No problem! Get in contact to ask any questions you might have about my coaching services.',
      validation: (Rule) => Rule.max(500),
      group: 'closingCard',
    }),
    defineField({
      name: 'closingCardCtaText',
      type: 'string',
      title: 'CTA Button Text',
      description: 'Text displayed on the call-to-action button',
      initialValue: 'Contact Me',
      validation: (Rule) => Rule.max(50),
      group: 'closingCard',
    }),
    ...createLinkFieldSet({ group: 'closingCard' }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Apply - General Content',
        subtitle: 'Page header, sections, and closing card',
      };
    },
  },
});
