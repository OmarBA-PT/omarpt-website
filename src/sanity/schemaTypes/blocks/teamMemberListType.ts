// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export const teamMemberListType = defineType({
  name: 'teamMemberList',
  title: 'Team Member List',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Team Category',
      type: 'string',
      description: 'Select which category of team members to display',
      options: {
        list: [
          { title: 'Primary (Leadership, Founders)', value: 'primary' },
          { title: 'Secondary (Assistants, Part-time)', value: 'secondary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Category is required'),
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      description: 'Choose how detailed the team member information should be',
      options: {
        list: [
          { title: 'Detailed (includes description)', value: 'detailed' },
          { title: 'Condensed (no description)', value: 'condensed' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Display style is required'),
    }),
  ],
  preview: {
    select: {
      category: 'category',
      displayStyle: 'displayStyle',
    },
    prepare(selection) {
      const { category, displayStyle } = selection;
      const categoryLabel = category === 'primary' ? 'Primary' : category === 'secondary' ? 'Secondary' : 'Not set';
      const styleLabel = displayStyle === 'detailed' ? 'Detailed' : displayStyle === 'condensed' ? 'Condensed' : 'Not set';
      return {
        title: 'Team Member List',
        subtitle: `${categoryLabel} team members - ${styleLabel} view`,
      };
    },
  },
});
