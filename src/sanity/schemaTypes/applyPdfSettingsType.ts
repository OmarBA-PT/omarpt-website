// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentPdfIcon } from '@sanity/icons';

export const applyPdfSettingsType = defineType({
  name: 'applyPdfSettings',
  title: 'Apply PDF Settings',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'pdfTitle',
      type: 'string',
      title: 'PDF Title',
      description: 'The main title that appears at the top of the PDF form (e.g., "Coaching Application Form")',
      initialValue: 'Coaching Application Form',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'pdfSubtitle',
      type: 'string',
      title: 'PDF Subtitle',
      description: 'The subtitle that appears below the PDF title (e.g., "Please complete the form below as thoroughly as possible.")',
      initialValue: 'Please complete the form below as thoroughly as possible.',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Apply - PDF Settings',
        subtitle: 'PDF title, subtitle, and generation settings',
      };
    },
  },
});
