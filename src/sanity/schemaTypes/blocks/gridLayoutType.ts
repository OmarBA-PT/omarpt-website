// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType, defineArrayMember } from 'sanity';
import { ComponentIcon } from '@sanity/icons';

export const gridLayoutType = defineType({
  name: 'gridLayout',
  title: 'Grid Layout',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Number of Columns',
      type: 'string',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
          { title: '4 Columns', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Grid Content',
      type: 'array',
      description: 'Grid content items. Note: 2 Column Layout cannot be added inside Grid Layout.',
      of: [
        defineArrayMember({
          type: 'richText',
          title: 'Rich Text',
        }),
        defineArrayMember({
          type: 'equipmentList',
          title: 'Equipment List',
        }),
        defineArrayMember({
          type: 'projectList',
          title: 'Project List',
        }),
        defineArrayMember({
          type: 'featuredProjects',
          title: 'Featured Projects',
        }),
        defineArrayMember({
          type: 'card',
          title: 'Card',
        }),
        defineArrayMember({
          type: 'imageBlock',
          title: 'Image Block',
        }),
        defineArrayMember({
          type: 'youTubeVideo',
          title: 'YouTube Video',
        }),
        defineArrayMember({
          type: 'spotifyWidget',
          title: 'Spotify Widget',
        }),
        defineArrayMember({
          type: 'bandcampWidget',
          title: 'Bandcamp Widget',
        }),
        defineArrayMember({
          type: 'audioSamplePlayer',
          title: 'Audio Sample Player',
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).error('Grid layout must contain at least one item'),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      content: 'content',
    },
    prepare({ columns, content }) {
      const itemCount = content?.length || 0;
      const title = `Grid Layout (${columns} columns)`;
      const subtitle = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;

      return {
        title,
        subtitle,
        media: ComponentIcon,
      };
    },
  },
});
