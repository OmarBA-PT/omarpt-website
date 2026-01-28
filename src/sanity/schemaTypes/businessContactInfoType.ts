// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const businessContactInfoType = defineType({
  name: 'businessContactInfo',
  title: 'Business & Contact Info',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organisation Name',
      type: 'string',
      description: 'The official name of your business or organisation (e.g., "Omania Training")',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'organizationDescription',
      title: 'Organisation Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of your business or organisation',
      validation: (Rule) => Rule.required().max(500),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Business & Contact Info',
        subtitle: 'Organisation details and contact information',
      };
    },
  },
});
