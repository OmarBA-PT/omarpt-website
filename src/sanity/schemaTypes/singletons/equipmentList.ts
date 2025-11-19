// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const equipmentListSingletonType = defineType({
  name: 'equipmentListSingleton',
  title: 'Equipment List',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'categories',
      title: 'Equipment Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'equipmentCategory',
          title: 'Equipment Category',
          fields: [
            defineField({
              name: 'name',
              title: 'Category Name',
              type: 'string',
              description: 'Name of the equipment category (e.g., Recording Equipment, Microphones)',
              validation: (Rule) => Rule.required().min(1).max(100),
            }),
            defineField({
              name: 'icon',
              title: 'Category Icon',
              type: 'image',
              description: 'Icon to display for this category',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  description: 'Describes the icon for accessibility',
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Equipment Items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'equipmentItem',
                  title: 'Equipment Item',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Item Name',
                      type: 'string',
                      description: 'Name of the equipment item',
                      validation: (Rule) => Rule.required().min(1).max(200),
                    }),
                    defineField({
                      name: 'isTemporarilyUnavailable',
                      title: 'Temporarily Unavailable',
                      type: 'boolean',
                      description: 'Mark this item as temporarily unavailable',
                      initialValue: false,
                    }),
                    defineField({
                      name: 'unavailableReason',
                      title: 'Reason for Unavailability',
                      type: 'text',
                      description: 'Explain why this item is temporarily unavailable (e.g., "Currently on loan", "Under repair")',
                      hidden: ({ parent }) => !(parent as { isTemporarilyUnavailable?: boolean })?.isTemporarilyUnavailable,
                      validation: (Rule) =>
                        Rule.custom((value, context) => {
                          const parent = context.parent as { isTemporarilyUnavailable?: boolean };
                          if (parent?.isTemporarilyUnavailable && !value) {
                            return 'Please provide a reason for unavailability';
                          }
                          return true;
                        }),
                    }),
                  ],
                  preview: {
                    select: {
                      name: 'name',
                      isTemporarilyUnavailable: 'isTemporarilyUnavailable',
                    },
                    prepare({ name, isTemporarilyUnavailable }) {
                      const prefix = isTemporarilyUnavailable ? '⚠️ ' : '';
                      const suffix = isTemporarilyUnavailable ? ' (Unavailable)' : '';
                      return {
                        title: `${prefix}${name}${suffix}`,
                      };
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1).max(100),
              description: 'Add equipment items to this category. Items can be reordered by dragging.',
            }),
          ],
          preview: {
            select: {
              name: 'name',
              icon: 'icon',
              items: 'items',
            },
            prepare({ name, icon, items }) {
              const itemCount = items?.length || 0;
              return {
                title: name || 'Untitled Category',
                subtitle: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
                media: icon,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(50),
      description: 'Add equipment categories. Categories can be reordered by dragging.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Equipment List',
      };
    },
  },
});
