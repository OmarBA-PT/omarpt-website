// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the team member',
      validation: (Rule) => Rule.required().error('Name is required'),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title or role within the organization',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Primary: Leadership, founders, etc. | Secondary: Assistants, part-time workers, etc.',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Category is required'),
    }),
    defineField({
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'image',
      description: 'Profile photo for the team member (will be displayed in a square aspect ratio)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Control the order in which team members appear (lower numbers appear first)',
      validation: (Rule) => Rule.required().integer().min(0).error('Display order must be a positive integer'),
      initialValue: 0,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Rich text description about the team member',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Body XS', value: 'body-xs' },
            { title: 'Body SM', value: 'body-sm' },
            { title: 'Body LG', value: 'body-lg' },
            { title: 'Body XL', value: 'body-xl' },
            { title: 'Body 2XL', value: 'body-2xl' },
            { title: 'Body 3XL', value: 'body-3xl' },
            { title: 'Standout', value: 'standout' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      name: 'name',
      role: 'role',
      category: 'category',
      media: 'profilePicture',
    },
    prepare(selection) {
      const { name, role, category, media } = selection;
      const categoryLabel = category === 'primary' ? 'Primary' : 'Secondary';
      return {
        title: name || 'Untitled Team Member',
        subtitle: role ? `${role} (${categoryLabel})` : categoryLabel,
        media,
      };
    },
  },
});
