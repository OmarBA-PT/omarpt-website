import { defineField, defineType } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export const audioSamplePlayerType = defineType({
  name: 'audioSamplePlayer',
  title: 'Audio Sample Player',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'audioSamples',
      title: 'Audio Samples',
      type: 'array',
      description: 'Add one or more audio samples. Drag to reorder. Single sample shows compact player, multiple samples show playlist view.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'audioSample' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Please add at least one audio sample'),
    }),
  ],
  preview: {
    select: {
      samples: 'audioSamples',
    },
    prepare({ samples }) {
      const count = samples?.length || 0;

      if (count === 0) {
        return {
          title: 'Audio Sample Player',
          subtitle: 'No audio samples',
          media: PlayIcon,
        };
      }

      return {
        title: count === 1 ? 'Audio Sample Player' : `Audio Sample Player (${count} tracks)`,
        subtitle: `${count} audio ${count === 1 ? 'sample' : 'samples'}`,
        media: PlayIcon,
      };
    },
  },
});
