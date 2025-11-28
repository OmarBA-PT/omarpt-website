import { defineField, defineType } from 'sanity';
import { EarthGlobeIcon } from '@sanity/icons';

export const googleMapType = defineType({
  name: 'googleMap',
  title: 'Google Map',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'embedCode',
      title: 'Google Maps Embed Code',
      type: 'text',
      description: 'Go to Google Maps → Search for location → Click "Share" → Select "Embed a map" → Copy the entire iframe HTML code and paste it here. The map will automatically maintain a 4:3 aspect ratio.',
      validation: (Rule) =>
        Rule.required()
          .custom((embedCode) => {
            if (!embedCode) return 'Embed code is required';

            // Check if it contains an iframe with a Google Maps embed URL
            const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/i;
            const match = embedCode.match(iframeRegex);

            if (!match) {
              return 'Please paste the complete iframe embed code from Google Maps';
            }

            const srcUrl = match[1];
            if (!srcUrl.includes('google.com/maps/embed')) {
              return 'The iframe must contain a Google Maps embed URL';
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
      return {
        title: 'Google Map',
        subtitle: embedCode ? '4:3 aspect ratio' : 'No location set',
        media: EarthGlobeIcon,
      };
    },
  },
});
