// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { PlayIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const audioSampleType = defineType({
  name: 'audioSample',
  title: 'Audio Sample',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      description: 'Optional image for this audio sample (e.g., album art, artist photo)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the image for accessibility and SEO',
        },
      ],
    }),
    defineField({
      name: 'songName',
      type: 'string',
      title: 'Song/Piece Name',
      description: 'The name of the song or musical piece',
      validation: (Rule) => Rule.required().error('Song/piece name is required'),
    }),
    defineField({
      name: 'artistName',
      type: 'string',
      title: 'Artist/Group Name',
      description: 'The name of the artist or musical group',
      validation: (Rule) => Rule.required().error('Artist/group name is required'),
    }),
    defineField({
      name: 'services',
      type: 'array',
      title: 'Services Provided',
      description: 'The services provided for this work (e.g., mixing, production, recording)',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.min(1).error('At least one service must be provided'),
    }),
    defineField({
      name: 'audioFile',
      type: 'file',
      title: 'Audio File',
      description: 'Upload your audio file. Free tier limit: Files should be under 100MB. Supported formats: MP3, WAV, AAC, OGG, FLAC',
      options: {
        accept: 'audio/*',
      },
      validation: (Rule) =>
        Rule.required()
          .error('Audio file is required')
          .custom((file) => {
            if (!file) return true; // Let required() handle missing files

            // Check if file has asset property
            const fileWithAsset = file as { asset?: { size?: number; mimeType?: string } };
            const asset = fileWithAsset?.asset;
            if (!asset) return true;

            // Check file size (100MB = 104857600 bytes)
            const size = asset?.size;
            if (size && size > 104857600) {
              return 'File size must be under 100MB to stay within Sanity free tier limits';
            }

            // Check file type
            const mimeType = asset?.mimeType;
            const validTypes = [
              'audio/mpeg',
              'audio/wav',
              'audio/wave',
              'audio/x-wav',
              'audio/aac',
              'audio/ogg',
              'audio/flac',
            ];

            if (mimeType && !validTypes.includes(mimeType)) {
              return 'Invalid file type. Please upload an audio file (MP3, WAV, AAC, OGG, or FLAC)';
            }

            return true;
          }),
    }),
  ],
  preview: {
    select: {
      title: 'songName',
      artist: 'artistName',
      media: 'image',
      services: 'services',
    },
    prepare({ title, artist, media, services }) {
      const servicesList = services && services.length > 0
        ? services.join(', ')
        : 'No services listed';

      return {
        title: title || 'Untitled Audio Sample',
        subtitle: `${artist || 'Unknown Artist'} • ${servicesList}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Song Name A-Z',
      name: 'songNameAsc',
      by: [{ field: 'songName', direction: 'asc' }],
    },
    {
      title: 'Song Name Z-A',
      name: 'songNameDesc',
      by: [{ field: 'songName', direction: 'desc' }],
    },
    {
      title: 'Artist Name A-Z',
      name: 'artistNameAsc',
      by: [{ field: 'artistName', direction: 'asc' }],
    },
    {
      title: 'Artist Name Z-A',
      name: 'artistNameDesc',
      by: [{ field: 'artistName', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First',
      name: 'oldestFirst',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
  ],
});
