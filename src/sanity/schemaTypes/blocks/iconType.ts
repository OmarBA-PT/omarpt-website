// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export const iconType = defineType({
  name: 'icon',
  title: 'Icon',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'showIcon',
      title: 'Show Icon',
      type: 'boolean',
      description: 'Toggle to show or hide an icon for this card',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Icon Image (Optional)',
      type: 'image',
      description: 'Upload a custom icon image. If not provided, the company logo will be used by default. For best results, use a black image with transparent background and no empty space around the edges.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text (Optional)',
          description: 'Helps explain what the custom icon is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something. If no custom image is provided, the company logo alt text will be used automatically.',
        },
      ],
      hidden: ({ parent }) => !parent?.showIcon,
    }),
  ],
  preview: {
    select: {
      showIcon: 'showIcon',
      media: 'image',
      alt: 'image.alt',
    },
    prepare({ showIcon, media, alt }) {
      return {
        title: 'Icon',
        subtitle: showIcon 
          ? (alt || (media ? 'Custom image' : 'Company logo')) 
          : 'No icon',
        media: showIcon ? (media || ImageIcon) : undefined,
      };
    },
  },
});
