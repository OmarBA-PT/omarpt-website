// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType } from 'sanity';
import { FolderIcon } from '@sanity/icons';

export const projectListType = defineType({
  name: 'projectList',
  title: 'Project List',
  type: 'object',
  icon: FolderIcon,
  fields: [
    {
      name: 'placeholder',
      title: 'Project List',
      type: 'string',
      readOnly: true,
      initialValue:
        'This component displays all your projects in a grid format. You can close this window.',
      description: 'Project list will be automatically populated from the Projects content section',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Project List',
        subtitle: 'Displays all projects in a grid',
      };
    },
  },
});
