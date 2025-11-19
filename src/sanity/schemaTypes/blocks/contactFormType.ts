// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactFormType = defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    {
      name: 'placeholder',
      title: 'Contact Form',
      type: 'string',
      readOnly: true,
      initialValue:
        'This component displays a contact form that allows visitors to send messages directly to your email. You can close this window.',
      description: 'Contact form submissions will be sent via Resend email service',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Form',
        subtitle: 'Allows visitors to send messages',
      };
    },
  },
});
