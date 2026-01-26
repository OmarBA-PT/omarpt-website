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
    // Placeholder field - will be replaced with actual PDF settings fields
    defineField({
      name: 'placeholder',
      type: 'string',
      title: 'Coming Soon',
      description: 'PDF settings will be added here in a future update.',
      readOnly: true,
      initialValue: 'PDF settings coming soon...',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Apply - PDF Settings',
        subtitle: 'PDF generation settings (coming soon)',
      };
    },
  },
});
