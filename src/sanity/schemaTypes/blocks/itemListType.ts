import { defineField, defineType } from 'sanity';
import { UlistIcon } from '@sanity/icons';

export const itemListType = defineType({
  name: 'itemList',
  title: 'Item List',
  type: 'object',
  icon: UlistIcon,
  fields: [
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Inherit', value: 'inherit' },
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'inherit',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'listItem',
          title: 'List Item',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (Rule) => Rule.required().min(1).max(100),
            }),
            defineField({
              name: 'icon',
              title: 'Icon (Optional)',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  description: 'Helps explain what the image is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something.',
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'text',
              media: 'icon',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
  ],
  preview: {
    select: {
      items: 'items',
      alignment: 'alignment',
    },
    prepare({ items, alignment }) {
      const itemCount = items?.length || 0;
      const alignmentText =
        alignment === 'inherit'
          ? 'inherit alignment'
          : alignment === 'center'
            ? 'centered'
            : alignment === 'right'
              ? 'right-aligned'
              : 'left-aligned';
      return {
        title: `Item List (${itemCount} items)`,
        subtitle: `${alignmentText}`,
      };
    },
  },
});
