// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const equipmentListType = defineType({
  name: 'equipmentList',
  title: 'Equipment List',
  type: 'object',
  icon: CogIcon,
  fields: [
    {
      name: 'placeholder',
      title: 'Equipment List',
      type: 'string',
      readOnly: true,
      initialValue:
        'This component displays your equipment list with categories. You can close this window.',
      description: 'Equipment list will be automatically populated from the Equipment List content section',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Equipment List',
        subtitle: 'Displays equipment in accordion format',
      };
    },
  },
});
