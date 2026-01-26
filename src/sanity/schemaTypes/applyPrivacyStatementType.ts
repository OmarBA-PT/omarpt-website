// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { LockIcon } from '@sanity/icons';

export const applyPrivacyStatementType = defineType({
  name: 'applyPrivacyStatement',
  title: 'Apply Privacy Statement',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description:
        'Title for the privacy statement section. Used in both the online form and the PDF.',
      initialValue: 'Your Privacy Matters',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Body',
      description:
        'The privacy statement text. Use blank lines to separate paragraphs. Used in both the online form and the PDF.',
      rows: 6,
      initialValue: `I take your privacy seriously. All information you provide will be used solely for processing your coaching application and creating your personalised fitness plan.

I will never share your personal information with third parties, and it will only be retained for as long as necessary to provide my coaching services to you.`,
      validation: (Rule) => Rule.required().max(1000),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Apply - Privacy Statement',
        subtitle: 'Privacy notice for application form',
      };
    },
  },
});
