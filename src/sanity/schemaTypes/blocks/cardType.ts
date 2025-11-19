// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import { CONTENT_ONLY_BLOCKS } from '../shared/blockLists';

export const cardType = defineType({
  name: 'card',
  title: 'Card',
  type: 'object',
  icon: DocumentIcon,
  groups: [
    { name: 'header', title: 'Header' },
    { name: 'image', title: 'Image' },
    { name: 'layout', title: 'Layout' },
    { name: 'styling', title: 'Styling' },
    { name: 'content', title: 'Content' },
  ],
  fields: [
    defineField({
      name: 'visualStyle',
      title: 'Visual Style',
      type: 'string',
      group: 'styling',
      options: {
        list: [
          { title: 'Light (Default)', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      description:
        'Choose the visual style for this card:\n\n• Light: Light background with dark text (default)\n\n• Dark: Dark brand-secondary background with light text',
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      group: 'header',
      description: 'Optional title displayed at the top of the card',
    }),
    defineField({
      name: 'subtitle',
      title: 'Card Subtitle',
      type: 'string',
      group: 'header',
      description: 'Optional subtitle displayed below the title',
    }),
    defineField({
      name: 'imageType',
      title: 'Image Type',
      type: 'string',
      group: 'image',
      options: {
        list: [
          {
            title: 'No Image',
            value: 'none',
          },
          {
            title: 'Banner Image',
            value: 'banner',
          },
          {
            title: 'Icon',
            value: 'icon',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      description:
        'Choose the type of image for this card:\n\n• No Image: Card displays content only\n\n• Banner Image: Full-width image at the top of the card\n\n• Icon: Small circular icon image',
      validation: (Rule) => Rule.required(),
    }),
    // Layout Style for Icon and No Image
    defineField({
      name: 'iconNoImageLayoutStyle',
      title: 'Layout Style',
      type: 'string',
      group: 'image',
      options: {
        list: [
          { title: 'Stacked', value: 'stacked' },
          { title: 'Row', value: 'row' },
        ],
        layout: 'radio',
      },
      initialValue: 'stacked',
      description:
        'Choose how the card is arranged:\n\n• Stacked: Content arranged vertically\n\n• Row: Content arranged horizontally',
      hidden: ({ parent }) => {
        const imageType = (parent as { imageType?: string })?.imageType;
        return imageType !== 'icon' && imageType !== 'none';
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
      ],
      description: 'Upload the image for this card',
      hidden: ({ parent }) => parent?.imageType === 'none',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { imageType?: string };
          if (parent?.imageType && parent.imageType !== 'none' && !value) {
            return 'Image is required when an image type is selected';
          }
          return true;
        }),
    }),
    defineField({
      name: 'content',
      title: 'Card Content',
      type: 'array',
      group: 'content',
      description:
        'Add content blocks to your card. You can include text, images, buttons, quotes, and more. Note: Cards cannot contain nested cards or layout blocks.',
      of: CONTENT_ONLY_BLOCKS,
      validation: (Rule) => Rule.min(1).error('Card must have at least one content block'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      visualStyle: 'visualStyle',
      imageType: 'imageType',
      iconNoImageLayoutStyle: 'iconNoImageLayoutStyle',
      image: 'image',
      content: 'content',
    },
    prepare({ title, subtitle, visualStyle, imageType, iconNoImageLayoutStyle, image, content }) {
      const imageTypeLabel =
        imageType === 'banner'
          ? 'Banner'
          : imageType === 'icon'
            ? 'Icon'
            : 'No Image';

      // Determine layout label based on image type
      let layoutLabel = 'Stacked';
      if (imageType === 'icon' || imageType === 'none') {
        layoutLabel = iconNoImageLayoutStyle === 'row' ? 'Row' : 'Stacked';
      }

      const styleLabel = visualStyle === 'dark' ? 'Dark' : 'Light';
      const blockCount = Array.isArray(content) ? content.length : 0;

      const displayTitle = title || `Card: ${styleLabel} • ${imageTypeLabel} • ${layoutLabel}`;
      const displaySubtitle = title
        ? `${styleLabel} • ${imageTypeLabel} • ${layoutLabel} • ${blockCount} content block${blockCount !== 1 ? 's' : ''}`
        : `${blockCount} content block${blockCount !== 1 ? 's' : ''}`;

      return {
        title: displayTitle,
        subtitle: displaySubtitle,
        media: image || DocumentIcon,
      };
    },
  },
});