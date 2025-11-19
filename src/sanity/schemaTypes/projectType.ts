// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { FolderIcon } from '@sanity/icons';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the project',
      validation: (Rule) => Rule.required().error('Name is required'),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Project image (will be displayed in a square aspect ratio)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Image is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the project',
      rows: 3,
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link Label',
      type: 'string',
      description: 'Custom label for the link button (defaults to "More info" if not provided)',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'External URL for more information about the project',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Control the order in which projects appear (lower numbers appear first)',
      validation: (Rule) => Rule.required().integer().min(0).error('Order must be a positive integer'),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      order: 'order',
      media: 'image',
    },
    prepare(selection) {
      const { name, order, media } = selection;
      return {
        title: name || 'Untitled Project',
        subtitle: `Order: ${order ?? 0}`,
        media,
      };
    },
  },
});
