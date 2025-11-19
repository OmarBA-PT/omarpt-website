import { defineType } from 'sanity';
import { PAGE_CONTENT_BLOCK_LIST } from './shared/blockLists';

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page Builder',
  type: 'array',
  of: PAGE_CONTENT_BLOCK_LIST,
  options: {
    insertMenu: {
      views: [
        {
          name: 'list',
        },
      ],
    },
    // Improve the modal experience
    modal: { type: 'dialog' },
  },
  // Clear description for editors
  description:
    'Build your page by adding page sections and content blocks. Page sections provide structure and can contain nested sub-sections and content.',
});
