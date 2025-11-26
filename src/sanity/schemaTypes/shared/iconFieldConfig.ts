// AI Helper: This is a reusable icon field configuration for Sanity schemas.
// Use this to add icon selection functionality (library or custom image) to any schema.

import { defineField } from 'sanity';
import IconSelector from '@/sanity/components/IconSelector';

/**
 * Creates a reusable icon field configuration that allows choosing between:
 * - Icon Library: Select from predefined icons
 * - Custom Image: Upload a custom icon/image
 *
 * @param options - Configuration options
 * @param options.required - Whether the icon is required (default: false)
 * @param options.description - Custom description for the icon field
 * @returns Array of field definitions for iconType, icon, and customImage
 */
export function createIconFields(options: {
  required?: boolean;
  description?: string;
} = {}) {
  const { required = false, description = 'Choose to use an icon from the library or upload a custom image' } = options;

  return [
    defineField({
      name: 'iconType',
      title: 'Icon Type',
      type: 'string',
      options: {
        list: [
          { title: 'Icon Library', value: 'library' },
          { title: 'Custom Image', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'library',
      validation: (Rule) => required ? Rule.required() : Rule,
      description,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      components: {
        input: IconSelector,
      },
      hidden: ({ parent }) => parent?.iconType !== 'library',
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { iconType?: string };
        if (required && parent?.iconType === 'library' && !value) {
          return 'Icon is required when using Icon Library';
        }
        return true;
      }),
      description: 'Select an icon from the library',
    }),
    defineField({
      name: 'customImage',
      title: 'Custom Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO. Describe what the icon represents.',
          validation: (Rule) => Rule.required().max(100),
        },
      ],
      hidden: ({ parent }) => parent?.iconType !== 'custom',
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { iconType?: string };
        if (required && parent?.iconType === 'custom' && !value) {
          return 'Custom image is required when using Custom Image type';
        }
        return true;
      }),
      description: 'Upload your own custom icon/image (SVG recommended for best quality)',
    }),
  ];
}
