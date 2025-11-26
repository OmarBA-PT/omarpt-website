// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { MenuIcon } from '@sanity/icons';
import { createIconFields } from '../shared/iconFieldConfig';

export const iconListType = defineType({
  name: 'iconList',
  title: 'Icon List',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Horizontal', value: 'horizontal' },
          { title: 'Vertical', value: 'vertical' },
        ],
        layout: 'radio',
      },
      initialValue: 'horizontal',
      validation: (Rule) => Rule.required(),
      description: 'Choose how to display the icon and description: horizontal (icon left, text right) or vertical (icon above text)',
    }),
    defineField({
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'iconListItem',
          title: 'Icon List Item',
          fields: [
            ...createIconFields({
              required: true,
              description: 'Choose to use an icon from the library or upload a custom image',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().min(1).max(500),
              description: 'Text description for this item',
            }),
          ],
          preview: {
            select: {
              iconType: 'iconType',
              icon: 'icon',
              customImage: 'customImage',
              description: 'description',
            },
            prepare({ iconType, icon, customImage, description }) {
              const title = description || 'Untitled Item';
              const isCustom = iconType === 'custom';
              const subtitle = isCustom
                ? (customImage ? 'Custom Image' : 'No custom image uploaded')
                : (icon ? `Icon: ${icon}` : 'No icon selected');

              return {
                title,
                subtitle,
                media: isCustom ? customImage : undefined,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(50),
      description: 'Add items to your icon list. Items can be reordered by dragging.',
    }),
  ],
  preview: {
    select: {
      items: 'items',
      layout: 'layout',
    },
    prepare({ items, layout }) {
      const itemCount = items?.length || 0;
      const layoutLabel = layout === 'vertical' ? 'Vertical' : 'Horizontal';
      return {
        title: `Icon List - ${layoutLabel} (${itemCount} items)`,
        subtitle: itemCount === 1 ? '1 item' : `${itemCount} items`,
        media: MenuIcon,
      };
    },
  },
});
