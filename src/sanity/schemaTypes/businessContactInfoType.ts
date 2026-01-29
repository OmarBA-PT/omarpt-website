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
    defineField({
      name: 'organizationEmail',
      title: 'Organisation Email',
      type: 'string',
      description: 'Primary contact email address (e.g., "info@example.com")',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email', invert: false }).error(
          'Please enter a valid email address',
        ),
    }),
    defineField({
      name: 'organizationPhone',
      title: 'Organisation Phone',
      type: 'string',
      description: 'Primary contact phone number (e.g., "+64 210 503 128")',
    }),
    defineField({
      name: 'organizationAddress',
      title: 'Organisation Address',
      type: 'string',
      description: 'Business address for display (e.g., "Auckland, New Zealand")',
    }),
    defineField({
      name: 'googleMapsLink',
      title: 'Google Maps Link',
      type: 'url',
      description: 'Link to your Google Maps location (e.g., "https://maps.app.goo.gl/...")',
    }),
    defineField({
      name: 'googleMapsEmbedCode',
      title: 'Google Maps Embed Code',
      type: 'text',
      description:
        'Go to Google Maps → Search for location → Click "Share" → Select "Embed a map" → Copy the entire iframe HTML code and paste it here. The map will automatically maintain a 4:3 aspect ratio.',
      validation: (Rule) =>
        Rule.custom((embedCode) => {
          if (!embedCode) return true;
          const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/i;
          const match = embedCode.match(iframeRegex);
          if (!match) return 'Please paste the complete iframe embed code from Google Maps';
          if (!match[1].includes('google.com/maps/embed')) {
            return 'The iframe must contain a Google Maps embed URL';
          }
          return true;
        }),
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
