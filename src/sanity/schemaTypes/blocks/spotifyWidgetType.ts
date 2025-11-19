// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export const spotifyWidgetType = defineType({
  name: 'spotifyWidget',
  title: 'Spotify Widget',
  type: 'object',
  icon: PlayIcon,
  description:
    'Embed Spotify tracks, albums, playlists, artists, shows, or episodes using embed code',
  fields: [
    defineField({
      name: 'embedCode',
      title: 'Spotify Embed Code',
      type: 'text',
      rows: 6,
      description:
        'Paste the Spotify embed code here. To get this: 1) Open Spotify Web Player (on desktop), 2) Find your content, 3) Click the three dots (...), 4) Select "Share" → "Embed playlist", 5) Adjust the settings as desired, 6) Click Copy to copy code and paste below',
      validation: (Rule) =>
        Rule.required().custom((embedCode) => {
          if (!embedCode) return 'Spotify embed code is required';

          // Validate that it's a proper iframe with Spotify embed URL
          const iframeRegex =
            /<iframe[^>]*src=["']([^"']*open\.spotify\.com\/embed\/[^"']*?)["'][^>]*>/i;

          if (!iframeRegex.test(embedCode.trim())) {
            return 'Please enter a valid Spotify embed code. It should be an iframe with a Spotify embed URL.';
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      embedCode: 'embedCode',
    },
    prepare({ embedCode }) {
      // Extract content type from embed code URL
      const iframeRegex =
        /<iframe[^>]*src=["']([^"']*open\.spotify\.com\/embed\/([^/"']+)\/[^"']*?)["'][^>]*>/i;
      const match = embedCode?.match(iframeRegex);
      const contentType = match ? match[2] : 'content';

      const contentTypeLabels: Record<string, string> = {
        track: 'Track',
        album: 'Album',
        playlist: 'Playlist',
        artist: 'Artist',
        show: 'Podcast Show',
        episode: 'Podcast Episode',
      };

      const label = contentTypeLabels[contentType] || 'Content';

      return {
        title: `Spotify ${label}`,
        subtitle: embedCode ? 'Embed code configured' : 'No embed code provided',
        media: PlayIcon,
      };
    },
  },
});
