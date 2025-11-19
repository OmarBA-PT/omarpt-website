// Load environment variables from .env.local
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { createClient } = require('@sanity/client');
const { v4: uuidv4 } = require('uuid');

console.log('Environment variables:');
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('Has Write Token:', !!process.env.SANITY_API_WRITE_TOKEN);

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // We want fresh data when writing
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true
});

// Helper function to generate rich text content
function createRichText(text) {
  return [
    {
      _type: 'block',
      _key: uuidv4().slice(0, 8),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: uuidv4().slice(0, 8),
          text: text,
          marks: []
        }
      ]
    }
  ];
}

// Helper function to create anchor ID from title
function createAnchorId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Main script function
async function updateSynthwaveBlogPost() {
  try {
    // Search for existing blog post with title "The Evolution of Synthwave: From Retro to Future"
    let targetBlogPost = await client.fetch(
      '*[_type == "blogPost" && title == "The Evolution of Synthwave: From Retro to Future"][0]'
    );

    if (!targetBlogPost) {
      console.error('No blog post found with title "The Evolution of Synthwave: From Retro to Future"');
      console.log('Please make sure there is a blog post with exactly this title in Sanity');
      process.exit(1);
    }

    console.log('Found blog post to update:', targetBlogPost._id);
    console.log('Current title:', targetBlogPost.title);
    console.log('Updating with synthwave content...');

    // Prepare the updated content (only updating content, keeping existing title, slug, etc.)
    const newContent = [
      // Section 1: Origins and Early Development
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'The Birth of Synthwave: 1980s Nostalgia Meets Modern Production',
        anchorId: createAnchorId('The Birth of Synthwave: 1980s Nostalgia Meets Modern Production'),
        subtitle: 'How a retro-futuristic aesthetic became a defining sound of the 2000s',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Synthwave emerged in the early 2000s as artists began revisiting the synthesizer-heavy soundscapes of 1980s film scores and video game music. Pioneers like Kavinsky and College laid the groundwork with their nostalgic approach to analog synthesizers, drum machines, and vintage production techniques. This movement represented more than just musical revival - it embodied a longing for an idealized retrofuturistic aesthetic that never quite existed.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('The genre\'s visual identity became inseparable from its sound, featuring neon grids, sunset gradients, and chrome sports cars. Artists like Perturbator and Dance With The Dead expanded the template, incorporating darker horror movie influences alongside the bright Miami Vice aesthetics. This duality between light and dark synthwave continues to define the genre\'s evolution today.')
          },
          {
            _type: 'youTubeVideo',
            _key: uuidv4(),
            url: 'https://www.youtube.com/watch?v=pP9MGrx547I&t=6s'
          }
        ]
      },

      // Section 2: Modern Evolution and Subgenres
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Contemporary Synthwave: From Retrowave to Cyberpunk',
        anchorId: createAnchorId('Contemporary Synthwave: From Retrowave to Cyberpunk'),
        subtitle: 'Exploring the diverse branches of modern synthwave music',
        content: [
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-right',
            content: createRichText('Today\'s synthwave encompasses numerous subgenres, from the aggressive darksynth of Dan Terminus to the dreamy chillwave influences of FM-84. Artists like The Midnight have successfully bridged synthwave with pop sensibilities, while acts like Power Trip maintain the genre\'s underground electronic dance roots. This diversification has allowed synthwave to reach broader audiences while preserving its core aesthetic.')
          },
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('The integration of modern production techniques with vintage synthesizer sounds has created new possibilities for artistic expression. Contemporary artists often blend synthwave with elements of trap, house, and ambient music, creating hybrid genres that push beyond traditional boundaries. This evolution demonstrates how nostalgic movements can become launching points for genuinely innovative musical directions.'),
            textAlign: 'inherit'
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '3',
            images: [
              {
                _key: uuidv4(),
                caption: 'Modern synthwave production setup'
              },
              {
                _key: uuidv4(),
                caption: 'Vintage synthesizer collection'
              },
              {
                _key: uuidv4(),
                caption: 'Synthwave live performance'
              }
            ]
          }
        ]
      },

      // Section 3: Cultural Impact and Future Directions
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Beyond Nostalgia: Synthwave\'s Cultural Legacy',
        anchorId: createAnchorId('Beyond Nostalgia: Synthwave\'s Cultural Legacy'),
        subtitle: 'How synthwave influenced mainstream media and contemporary music',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Synthwave\'s influence extends far beyond electronic music, impacting film soundtracks, video game scores, and fashion. Movies like "Drive" and "Blade Runner 2049" brought synthwave aesthetics to mainstream audiences, while video games like "Hotline Miami" demonstrated the genre\'s perfect synergy with interactive media. This cross-media pollination has ensured synthwave\'s continued relevance and evolution.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('The genre\'s future lies in its ability to continue evolving while maintaining its distinctive identity. Younger artists are incorporating synthwave elements into hip-hop, indie rock, and ambient music, creating new hybrid forms that honor the past while embracing contemporary production techniques. This ongoing evolution suggests that synthwave\'s influence will continue growing and diversifying.')
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '2',
            images: [
              {
                _key: uuidv4(),
                caption: 'Synthwave in film soundtracks'
              },
              {
                _key: uuidv4(),
                caption: 'Video game synthwave integration'
              }
            ]
          },
          {
            _type: 'ctaCalloutLink',
            _key: uuidv4(),
            heading: 'Explore Synthwave Artists',
            text: 'Discover more synthwave and electronic music on our platform.',
            linkType: 'external',
            externalUrl: 'https://www.0717records.com/',
            openInNewTab: true
          }
        ]
      }
    ];

    // Update only the content of the blog post
    const result = await client.patch(targetBlogPost._id).set({ content: newContent }).commit();
    
    console.log('✅ Successfully updated blog post content!');
    console.log('Blog Post ID:', result._id);
    console.log('Title:', result.title);
    console.log('Updated at:', result._updatedAt);
    
    // Calculate total components
    let totalComponents = 0;
    newContent.forEach(section => {
      totalComponents += section.content.length;
    });
    
    console.log(`\n📊 Content Summary:`);
    console.log(`- ${newContent.length} main sections`);
    console.log(`- ${totalComponents} total content components`);
    console.log(`- Components include: Rich Text, Text & Image, Image Gallery, YouTube Video, and CTA Callout Link`);
    console.log(`- YouTube video included: https://www.youtube.com/watch?v=pP9MGrx547I&t=6s`);
    console.log(`- Each text block contains 50-80 words about synthwave topics`);
    console.log(`- CTA links point to https://www.0717records.com/`);

  } catch (error) {
    console.error('Error updating blog post:', error);
    process.exit(1);
  }
}

// Run the script
updateSynthwaveBlogPost();