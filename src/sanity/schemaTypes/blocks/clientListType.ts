// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export const clientListType = defineType({
  name: 'clientList',
  title: 'Client List',
  type: 'object',
  icon: UsersIcon,
  fields: [
    {
      name: 'placeholder',
      title: 'Client List',
      type: 'string',
      readOnly: true,
      initialValue:
        'This component displays your clients in a festival-style format. You can close this window.',
      description: 'Client list will be automatically populated from the Clients content section',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Client List',
        subtitle: 'Displays clients in lineup-style format',
      };
    },
  },
});
