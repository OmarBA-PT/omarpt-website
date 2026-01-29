// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const applyConfirmationEmailType = defineType({
  name: 'applyConfirmationEmail',
  title: 'Confirmation Email',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'emailGreeting',
      type: 'string',
      title: 'Email Greeting',
      description:
        'Greeting text at the start of the confirmation email (e.g., "Hi" or "Hello"). Leave empty to omit.',
    }),
    defineField({
      name: 'emailIntroMessage',
      type: 'text',
      title: 'Email Introduction Message',
      description:
        'Introduction message in the confirmation email, shown after the greeting. Leave empty to omit.',
      rows: 3,
    }),
    defineField({
      name: 'emailClosingMessage',
      type: 'text',
      title: 'Email Closing Message',
      description:
        'Closing message in the confirmation email, shown after the application details. Leave empty to omit.',
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Apply - Confirmation Email',
        subtitle: 'Email content sent to users after application form submission',
      };
    },
  },
});
