// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { StarIcon } from '@sanity/icons';

export const featuredProjectsType = defineType({
  name: 'featuredProjects',
  title: 'Featured Projects',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      description: 'Select and reorder featured projects',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('At least one project is required'),
    }),
  ],
  preview: {
    select: {
      projects: 'projects',
    },
    prepare(selection) {
      const { projects } = selection;
      const count = projects?.length ?? 0;
      return {
        title: 'Featured Projects',
        subtitle: `${count} project${count !== 1 ? 's' : ''} selected`,
      };
    },
  },
});
