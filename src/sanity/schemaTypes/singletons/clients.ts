// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineArrayMember, defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export const clientsType = defineType({
  name: 'clients',
  title: 'Clients',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'level1',
      title: 'Level 1 Clients',
      type: 'array',
      description: 'Top-tier clients displayed with the largest text size',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'level2',
      title: 'Level 2 Clients',
      type: 'array',
      description: 'Second-tier clients displayed with large text size',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'level3',
      title: 'Level 3 Clients',
      type: 'array',
      description: 'Third-tier clients displayed with medium text size',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'level4',
      title: 'Level 4 Clients',
      type: 'array',
      description: 'Fourth-tier clients displayed with smaller text size',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'level5',
      title: 'Level 5 Clients',
      type: 'array',
      description: 'Fifth-tier clients displayed with the smallest text size',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Clients',
      };
    },
  },
});
