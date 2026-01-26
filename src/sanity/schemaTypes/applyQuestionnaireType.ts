// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { ClipboardIcon } from '@sanity/icons';

export const applyQuestionnaireType = defineType({
  name: 'applyQuestionnaire',
  title: 'Apply Questionnaire',
  type: 'document',
  icon: ClipboardIcon,
  fields: [
    // Placeholder field - will be replaced with actual questionnaire fields
    defineField({
      name: 'placeholder',
      type: 'string',
      title: 'Coming Soon',
      description: 'Questionnaire settings will be added here in a future update.',
      readOnly: true,
      initialValue: 'Questionnaire settings coming soon...',
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Apply - Questionnaire',
        subtitle: 'Application form questions (coming soon)',
      };
    },
  },
});
