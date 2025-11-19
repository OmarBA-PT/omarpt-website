// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactFormSettingsType = defineType({
  name: 'contactFormSettings',
  title: 'Contact Form',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {
      name: 'formFields',
      title: 'Form Fields',
    },
    {
      name: 'successMessage',
      title: 'Success Message',
    },
    {
      name: 'confirmationEmail',
      title: 'Confirmation Email',
    },
  ],
  fields: [
    // Form Fields Group
    defineField({
      name: 'title',
      type: 'string',
      title: 'Form Title',
      description: 'Optional title displayed at the top of the contact form',
      group: 'formFields',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      title: 'Form Subtitle',
      description: 'Optional subtitle/description displayed below the title',
      rows: 2,
      group: 'formFields',
    }),
    defineField({
      name: 'messagePlaceholder',
      type: 'string',
      title: 'Message Field Placeholder',
      description: 'Placeholder text that appears in the message textarea field',
      initialValue: 'Tell us how we can help you...',
      validation: (Rule) => Rule.required(),
      group: 'formFields',
    }),

    // Success Message Group
    defineField({
      name: 'successHeading',
      type: 'string',
      title: 'Success Message Heading',
      description: 'Heading displayed after form submission is successful',
      initialValue: 'Thank you for your message!',
      validation: (Rule) => Rule.required(),
      group: 'successMessage',
    }),
    defineField({
      name: 'successMessage',
      type: 'text',
      title: 'Success Message Text',
      description: 'Message displayed after form submission is successful',
      rows: 3,
      initialValue:
        'We have received your message and will get back to you as soon as possible. You should also receive a confirmation email shortly.',
      validation: (Rule) => Rule.required(),
      group: 'successMessage',
    }),

    // Confirmation Email Group
    defineField({
      name: 'emailGreeting',
      type: 'string',
      title: 'Email Greeting',
      description: 'Greeting text at the start of the confirmation email (e.g., "Hi" or "Hello")',
      initialValue: 'Hi',
      validation: (Rule) => Rule.required().max(20),
      group: 'confirmationEmail',
    }),
    defineField({
      name: 'emailIntroMessage',
      type: 'text',
      title: 'Email Introduction Message',
      description: 'Introduction message in the confirmation email',
      rows: 2,
      initialValue:
        'We have successfully received your message and will aim to get back to you as soon as possible.',
      validation: (Rule) => Rule.required(),
      group: 'confirmationEmail',
    }),
    defineField({
      name: 'emailOutroMessage',
      type: 'text',
      title: 'Email Closing Message',
      description: 'Closing message in the confirmation email',
      rows: 2,
      initialValue: 'If you have any urgent questions, feel free to reach out to us directly.',
      validation: (Rule) => Rule.required(),
      group: 'confirmationEmail',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Form Settings',
      };
    },
  },
});
