// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { EditIcon } from '@sanity/icons';

export const ctaBlogPostType = defineType({
  name: 'ctaBlogPost',
  title: 'CTA Blog Post',
  type: 'object',
  icon: EditIcon,
  fields: [
    defineField({
      name: 'blogPost',
      title: 'Select Blog Post',
      type: 'reference',
      to: [{ type: 'blogPost' }],
      description: 'Choose a blog post to display as a CTA card. The blog post link will be used for navigation.',
      validation: (Rule) => Rule.required().error('Please select a blog post'),
      options: {
        filter: () => {
          // This will show all blog posts, sorted by latest first
          return {
            filter: '_type == "blogPost"',
            params: {},
          };
        },
      },
    }),
  ],
  preview: {
    select: {
      postTitle: 'blogPost.title',
      postSubtitle: 'blogPost.subtitle',
      postAuthor: 'blogPost.author',
      postImage: 'blogPost.mainImage',
      postSlug: 'blogPost.slug.current',
    },
    prepare({ postTitle, postSubtitle, postAuthor, postImage, postSlug }) {
      const title = postTitle || 'Unknown Blog Post';
      
      let subtitle = 'No blog post selected';
      if (postTitle) {
        const parts = [
          postAuthor ? `By ${postAuthor}` : null,
          postSlug ? `/${postSlug}` : null,
        ].filter(Boolean);
        subtitle = parts.length > 0 ? parts.join(' • ') : postSubtitle || 'Blog post CTA';
      }

      return {
        title: `Blog Post: ${title}`,
        subtitle,
        media: postImage || EditIcon,
      };
    },
  },
});