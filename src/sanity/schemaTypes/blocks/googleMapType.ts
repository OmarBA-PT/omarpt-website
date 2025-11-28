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
      description: 'Go to Google Maps → Search for location → Click "Share" → Select "Embed a map" → Copy the entire iframe HTML code and paste it here',
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
    defineField({
      name: 'height',
      title: 'Map Height',
      type: 'string',
      options: {
        list: [
          { title: 'Small (300px)', value: '300' },
          { title: 'Medium (450px)', value: '450' },
          { title: 'Large (600px)', value: '600' },
        ],
      },
      initialValue: '450',
      description: 'Height of the map in pixels',
    }),
  ],
  preview: {
    select: {
      embedCode: 'embedCode',
      height: 'height',
    },
    prepare({ embedCode, height }) {
      const heightText = height === '300' ? 'Small' : height === '450' ? 'Medium' : 'Large';

      return {
        title: 'Google Map',
        subtitle: embedCode ? `${heightText} (${height}px)` : 'No location set',
        media: EarthGlobeIcon,
      };
    },
  },
});
