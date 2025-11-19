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
  token: process.env.SANITY_API_WRITE_TOKEN, // You'll need to set this environment variable
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
async function createAndPopulateAlignmentTest() {
  try {
    // Search for existing Alignment Test page
    let alignmentTestPage = await client.fetch(
      '*[_type == "page" && title == "Alignment Test"][0]'
    );

    if (alignmentTestPage) {
      console.log('Found existing Alignment Test page:', alignmentTestPage._id);
      
      // Check for references to this page
      const references = await client.fetch('*[references($id)]', { id: alignmentTestPage._id });
      
      if (references.length > 0) {
        console.error(`Cannot delete page: it is referenced by ${references.length} other document(s)`);
        console.error('Referenced by:', references.map(ref => `${ref._type}: ${ref.title || ref.name || ref._id}`));
        console.error('Please remove these references first, then run the script again.');
        process.exit(1);
      }
      
      console.log('Deleting existing page...');
      await client.delete(alignmentTestPage._id);
      console.log('Existing page deleted successfully');
    }

    console.log('Creating new Alignment Test page...');
    
    // Create the page
    alignmentTestPage = await client.create({
      _type: 'page',
      title: 'Alignment Test',
      slug: {
        _type: 'slug',
        current: 'alignment-test'
      },
      subtitle: 'This page is used to test component alignment and layout functionality across all available components.',
      content: [] // Start with empty content
    });
    
    console.log('Created Alignment Test page:', alignmentTestPage._id);

    // Find some existing events and blog posts for CTAs
    const events = await client.fetch('*[_type == "event"][0...2]');
    const blogPosts = await client.fetch('*[_type == "blogPost"][0...2]');

    console.log('Found events:', events.length);
    console.log('Found blog posts:', blogPosts.length);

    // Create the comprehensive content structure
    const pageContent = [];

    // Root page level components
    pageContent.push({
      _type: 'richText',
      _key: uuidv4(),
      isCallout: false,
      content: createRichText('This is root level rich text with inherit alignment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
      textAlign: 'inherit'
    });

    pageContent.push({
      _type: 'quote',
      _key: uuidv4(),
      text: 'This is a root level quote with inherit alignment. Lorem ipsum dolor sit amet consectetur.',
      attribution: 'Test Author',
      textAlign: 'inherit'
    });

    pageContent.push({
      _type: 'ctaButton',
      _key: uuidv4(),
      text: 'Root Level CTA Button',
      variant: 'filled',
      linkType: 'external',
      externalUrl: 'https://example.com',
      openInNewTab: true,
      alignment: 'inherit'
    });

    pageContent.push({
      _type: 'ctaEmailButton',
      _key: uuidv4(),
      alignment: 'inherit'
    });

    // First Page Section with Text & Image components
    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'Text and Image Section',
      anchorId: createAnchorId('Text and Image Section'),
      subtitle: 'This section demonstrates text and image layouts',
      textAlign: 'inherit',
      content: [
        {
          _type: 'textImage',
          _key: uuidv4(),
          layout: 'text-left',
          content: createRichText('This is a text and image block with text on the left. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'),
          image: {
            alt: 'Text Left Layout Example'
          }
        },
        {
          _type: 'textImage',
          _key: uuidv4(),
          layout: 'text-right',
          content: createRichText('This is a text and image block with text on the right. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'),
          image: {
            alt: 'Text Right Layout Example'
          }
        }
      ]
    });

    // Second Page Section with Cards in Sub Sections
    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'Card Examples Section',
      anchorId: createAnchorId('Card Examples Section'),
      subtitle: 'This section demonstrates different card types and styles',
      textAlign: 'inherit',
      content: [
        {
          _type: 'subSection',
          _key: uuidv4(),
          title: 'Feature Cards Subsection',
          anchorId: createAnchorId('Feature Cards Subsection'),
          alignment: 'inherit',
          content: [
            {
              _type: 'card',
              _key: uuidv4(),
              cardStyle: 'feature',
              title: 'Feature Card with Link Button',
              bodyText: 'This is a feature card with a link button. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
              buttonType: 'link',
              text: 'Learn More',
              variant: 'filled',
              linkType: 'external',
              externalUrl: 'https://example.com',
              openInNewTab: true
            },
            {
              _type: 'card',
              _key: uuidv4(),
              cardStyle: 'feature',
              title: 'Feature Card with Email Button',
              bodyText: 'This is a feature card with an email button. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
              buttonType: 'email'
            }
          ]
        },
        {
          _type: 'subSection',
          _key: uuidv4(),
          title: 'Statement Cards Subsection',
          anchorId: createAnchorId('Statement Cards Subsection'),
          alignment: 'inherit',
          content: [
            {
              _type: 'card',
              _key: uuidv4(),
              cardStyle: 'statement',
              title: 'Statement Card with Link Button',
              bodyText: 'This is a statement card with a link button. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
              buttonType: 'link',
              text: 'Get Started',
              variant: 'outline',
              linkType: 'external',
              externalUrl: 'https://example.com',
              openInNewTab: true
            },
            {
              _type: 'card',
              _key: uuidv4(),
              cardStyle: 'statement',
              title: 'Statement Card with Email Button',
              bodyText: 'This is a statement card with an email button. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
              buttonType: 'email'
            }
          ]
        }
      ]
    });

    // Third Page Section with CTA components
    const ctaContent = [];
    
    ctaContent.push({
      _type: 'ctaCalloutLink',
      _key: uuidv4(),
      heading: 'CTA Callout Link',
      text: 'This is a CTA callout link component for highlighting important actions.',
      linkType: 'external',
      externalUrl: 'https://example.com',
      openInNewTab: true
    });

    if (events.length > 0) {
      ctaContent.push({
        _type: 'ctaEvent',
        _key: uuidv4(),
        event: {
          _type: 'reference',
          _ref: events[0]._id
        }
      });
    }

    if (blogPosts.length > 0) {
      ctaContent.push({
        _type: 'ctaBlogPost',
        _key: uuidv4(),
        blogPost: {
          _type: 'reference',
          _ref: blogPosts[0]._id
        }
      });
    }

    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'CTA Components Section',
      anchorId: createAnchorId('CTA Components Section'),
      subtitle: 'This section demonstrates different CTA component types',
      textAlign: 'inherit',
      content: ctaContent
    });

    // Fourth Page Section with Card Grids
    const cardData = [
      {
        _type: 'card',
        _key: uuidv4(),
        cardStyle: 'feature',
        title: 'Grid Card 1',
        bodyText: 'This is the first card in the grid layout.',
        buttonType: 'link',
        text: 'View More',
        variant: 'filled',
        linkType: 'external',
        externalUrl: 'https://example.com',
        openInNewTab: true
      },
      {
        _type: 'card',
        _key: uuidv4(),
        cardStyle: 'feature',
        title: 'Grid Card 2',
        bodyText: 'This is the second card in the grid layout.',
        buttonType: 'email'
      },
      {
        _type: 'card',
        _key: uuidv4(),
        cardStyle: 'statement',
        title: 'Grid Card 3',
        bodyText: 'This is the third card in the grid layout.',
        buttonType: 'link',
        text: 'Learn More',
        variant: 'outline',
        linkType: 'external',
        externalUrl: 'https://example.com',
        openInNewTab: true
      },
      {
        _type: 'card',
        _key: uuidv4(),
        cardStyle: 'statement',
        title: 'Grid Card 4',
        bodyText: 'This is the fourth card in the grid layout.',
        buttonType: 'email'
      }
    ];

    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'Card Grid Section',
      anchorId: createAnchorId('Card Grid Section'),
      subtitle: 'This section demonstrates card grids with different column layouts',
      textAlign: 'inherit',
      content: [
        {
          _type: 'cardGrid',
          _key: uuidv4(),
          columns: '2',
          cards: [...cardData]
        },
        {
          _type: 'cardGrid',
          _key: uuidv4(),
          columns: '3',
          cards: [...cardData]
        },
        {
          _type: 'cardGrid',
          _key: uuidv4(),
          columns: '4',
          cards: [...cardData]
        }
      ]
    });

    // Fifth Page Section with Images and Media
    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'Images and Media Section',
      anchorId: createAnchorId('Images and Media Section'),
      subtitle: 'This section demonstrates icons, image blocks, and image galleries',
      textAlign: 'inherit',
      content: [
        {
          _type: 'icon',
          _key: uuidv4(),
          name: 'star'
        },
        {
          _type: 'subSection',
          _key: uuidv4(),
          title: 'Image Blocks Subsection',
          anchorId: createAnchorId('Image Blocks Subsection'),
          alignment: 'inherit',
          content: [
            {
              _type: 'imageBlock',
              _key: uuidv4(),
              size: 'full-width',
              caption: 'Full width image block'
            },
            {
              _type: 'imageBlock',
              _key: uuidv4(),
              size: 'small',
              caption: 'Small image block'
            }
          ]
        },
        {
          _type: 'subSection',
          _key: uuidv4(),
          title: 'Image Galleries Subsection',
          anchorId: createAnchorId('Image Galleries Subsection'),
          alignment: 'inherit',
          content: [
            {
              _type: 'imageGallery',
              _key: uuidv4(),
              columns: '2',
              images: [
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 1'
                  },
                  caption: 'Sample gallery image 1'
                },
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 2'
                  },
                  caption: 'Sample gallery image 2'
                }
              ]
            },
            {
              _type: 'imageGallery',
              _key: uuidv4(),
              columns: '3',
              images: [
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 1'
                  },
                  caption: 'Sample gallery image 1'
                },
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 2'
                  },
                  caption: 'Sample gallery image 2'
                },
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 3'
                  },
                  caption: 'Sample gallery image 3'
                }
              ]
            },
            {
              _type: 'imageGallery',
              _key: uuidv4(),
              columns: '4',
              images: [
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 1'
                  },
                  caption: 'Sample gallery image 1'
                },
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 2'
                  },
                  caption: 'Sample gallery image 2'
                },
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 3'
                  },
                  caption: 'Sample gallery image 3'
                },
                {
                  _key: uuidv4(),
                  image: {
                    alt: 'Gallery Image 4'
                  },
                  caption: 'Sample gallery image 4'
                }
              ]
            }
          ]
        }
      ]
    });

    // Sixth Page Section with Media Widgets
    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'Media Widgets Section',
      anchorId: createAnchorId('Media Widgets Section'),
      subtitle: 'This section demonstrates video and music widgets',
      textAlign: 'inherit',
      content: [
        {
          _type: 'youTubeVideo',
          _key: uuidv4(),
          url: 'https://youtu.be/7LkrD0Qo0p0?si=5wcM9HdS0JAV03G0'
        },
        {
          _type: 'bandcampWidget',
          _key: uuidv4(),
          embedCode: '<iframe style="border: 0; width: 400px; height: 406px;" src="https://bandcamp.com/EmbeddedPlayer/album=1036249858/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/" seamless><a href="https://starcontrol1.bandcamp.com/album/mark-i">Mark I by Star Control</a></iframe>'
        },
        {
          _type: 'spotifyWidget',
          _key: uuidv4(),
          playerHeight: 'compact',
          url: 'https://open.spotify.com/track/1cgdlbLqEGwucpd0Rq3jAU?si=9788b131eab94848'
        },
        {
          _type: 'spotifyWidget',
          _key: uuidv4(),
          playerHeight: 'normal',
          url: 'https://open.spotify.com/playlist/64L9pRZcsJV8nW6s3qL26J?si=d52cf957eb1b4e2a'
        }
      ]
    });

    // Seventh Page Section with comprehensive Alignment Testing
    const alignmentTestContent = [
      // Inherit alignment components
      {
        _type: 'richText',
        _key: uuidv4(),
        isCallout: false,
        content: createRichText('Rich text with inherit alignment. Lorem ipsum dolor sit amet consectetur.'),
        textAlign: 'inherit'
      },
      {
        _type: 'quote',
        _key: uuidv4(),
        text: 'Quote with inherit alignment. Lorem ipsum dolor sit amet consectetur.',
        attribution: 'Test Author',
        textAlign: 'inherit'
      },
      {
        _type: 'ctaButton',
        _key: uuidv4(),
        text: 'CTA Button Inherit',
        variant: 'filled',
        linkType: 'external',
        externalUrl: 'https://example.com',
        openInNewTab: true,
        alignment: 'inherit'
      },
      {
        _type: 'ctaEmailButton',
        _key: uuidv4(),
        alignment: 'inherit'
      },
      {
        _type: 'divider',
        _key: uuidv4()
      },
      // Left alignment components
      {
        _type: 'richText',
        _key: uuidv4(),
        isCallout: false,
        content: createRichText('Rich text with left alignment. Lorem ipsum dolor sit amet consectetur.'),
        textAlign: 'left'
      },
      {
        _type: 'quote',
        _key: uuidv4(),
        text: 'Quote with left alignment. Lorem ipsum dolor sit amet consectetur.',
        attribution: 'Test Author',
        textAlign: 'left'
      },
      {
        _type: 'ctaButton',
        _key: uuidv4(),
        text: 'CTA Button Left',
        variant: 'filled',
        linkType: 'external',
        externalUrl: 'https://example.com',
        openInNewTab: true,
        alignment: 'left'
      },
      {
        _type: 'ctaEmailButton',
        _key: uuidv4(),
        alignment: 'left'
      },
      {
        _type: 'divider',
        _key: uuidv4()
      },
      // Center alignment components
      {
        _type: 'richText',
        _key: uuidv4(),
        isCallout: false,
        content: createRichText('Rich text with center alignment. Lorem ipsum dolor sit amet consectetur.'),
        textAlign: 'center'
      },
      {
        _type: 'quote',
        _key: uuidv4(),
        text: 'Quote with center alignment. Lorem ipsum dolor sit amet consectetur.',
        attribution: 'Test Author',
        textAlign: 'center'
      },
      {
        _type: 'ctaButton',
        _key: uuidv4(),
        text: 'CTA Button Center',
        variant: 'filled',
        linkType: 'external',
        externalUrl: 'https://example.com',
        openInNewTab: true,
        alignment: 'center'
      },
      {
        _type: 'ctaEmailButton',
        _key: uuidv4(),
        alignment: 'center'
      },
      {
        _type: 'divider',
        _key: uuidv4()
      },
      // Right alignment components
      {
        _type: 'richText',
        _key: uuidv4(),
        isCallout: false,
        content: createRichText('Rich text with right alignment. Lorem ipsum dolor sit amet consectetur.'),
        textAlign: 'right'
      },
      {
        _type: 'quote',
        _key: uuidv4(),
        text: 'Quote with right alignment. Lorem ipsum dolor sit amet consectetur.',
        attribution: 'Test Author',
        textAlign: 'right'
      },
      {
        _type: 'ctaButton',
        _key: uuidv4(),
        text: 'CTA Button Right',
        variant: 'filled',
        linkType: 'external',
        externalUrl: 'https://example.com',
        openInNewTab: true,
        alignment: 'right'
      },
      {
        _type: 'ctaEmailButton',
        _key: uuidv4(),
        alignment: 'right'
      },
      {
        _type: 'divider',
        _key: uuidv4()
      }
    ];

    // Add Sub Section with nested alignment testing
    alignmentTestContent.push({
      _type: 'subSection',
      _key: uuidv4(),
      title: 'Sub Section Alignment Tests',
      anchorId: createAnchorId('Sub Section Alignment Tests'),
      textAlign: 'inherit',
      content: [
        // Inherit alignment in subsection
        {
          _type: 'richText',
          _key: uuidv4(),
          isCallout: false,
          content: createRichText('Sub section rich text with inherit alignment.'),
          textAlign: 'inherit'
        },
        {
          _type: 'quote',
          _key: uuidv4(),
          text: 'Sub section quote with inherit alignment.',
          attribution: 'Sub Author',
          textAlign: 'inherit'
        },
        {
          _type: 'ctaButton',
          _key: uuidv4(),
          text: 'Sub CTA Inherit',
          variant: 'outline',
          linkType: 'external',
          externalUrl: 'https://example.com',
          openInNewTab: true,
          alignment: 'inherit'
        },
        {
          _type: 'ctaEmailButton',
          _key: uuidv4(),
          alignment: 'inherit'
        },
        {
          _type: 'divider',
          _key: uuidv4()
        },
        // Left alignment in subsection
        {
          _type: 'richText',
          _key: uuidv4(),
          isCallout: false,
          content: createRichText('Sub section rich text with left alignment.'),
          textAlign: 'left'
        },
        {
          _type: 'quote',
          _key: uuidv4(),
          text: 'Sub section quote with left alignment.',
          attribution: 'Sub Author',
          textAlign: 'left'
        },
        {
          _type: 'ctaButton',
          _key: uuidv4(),
          text: 'Sub CTA Left',
          variant: 'outline',
          linkType: 'external',
          externalUrl: 'https://example.com',
          openInNewTab: true,
          alignment: 'left'
        },
        {
          _type: 'ctaEmailButton',
          _key: uuidv4(),
          alignment: 'left'
        },
        {
          _type: 'divider',
          _key: uuidv4()
        },
        // Center alignment in subsection
        {
          _type: 'richText',
          _key: uuidv4(),
          isCallout: false,
          content: createRichText('Sub section rich text with center alignment.'),
          textAlign: 'center'
        },
        {
          _type: 'quote',
          _key: uuidv4(),
          text: 'Sub section quote with center alignment.',
          attribution: 'Sub Author',
          textAlign: 'center'
        },
        {
          _type: 'ctaButton',
          _key: uuidv4(),
          text: 'Sub CTA Center',
          variant: 'outline',
          linkType: 'external',
          externalUrl: 'https://example.com',
          openInNewTab: true,
          alignment: 'center'
        },
        {
          _type: 'ctaEmailButton',
          _key: uuidv4(),
          alignment: 'center'
        },
        {
          _type: 'divider',
          _key: uuidv4()
        },
        // Right alignment in subsection
        {
          _type: 'richText',
          _key: uuidv4(),
          isCallout: false,
          content: createRichText('Sub section rich text with right alignment.'),
          textAlign: 'right'
        },
        {
          _type: 'quote',
          _key: uuidv4(),
          text: 'Sub section quote with right alignment.',
          attribution: 'Sub Author',
          textAlign: 'right'
        },
        {
          _type: 'ctaButton',
          _key: uuidv4(),
          text: 'Sub CTA Right',
          variant: 'outline',
          linkType: 'external',
          externalUrl: 'https://example.com',
          openInNewTab: true,
          alignment: 'right'
        },
        {
          _type: 'ctaEmailButton',
          _key: uuidv4(),
          alignment: 'right'
        },

        // Sub Sub Sections for deeper nesting
        {
          _type: 'subSubSection',
          _key: uuidv4(),
          title: 'Sub Sub Section Inherit',
          anchorId: createAnchorId('Sub Sub Section Inherit'),
          alignment: 'inherit',
          content: [
            {
              _type: 'richText',
              _key: uuidv4(),
              isCallout: false,
              content: createRichText('Sub sub section rich text with inherit alignment.'),
              textAlign: 'inherit'
            },
            {
              _type: 'quote',
              _key: uuidv4(),
              text: 'Sub sub section quote with inherit alignment.',
              attribution: 'Sub Sub Author',
              textAlign: 'inherit'
            },
            {
              _type: 'ctaButton',
              _key: uuidv4(),
              text: 'Sub Sub Inherit',
              variant: 'filled',
              linkType: 'external',
              externalUrl: 'https://example.com',
              openInNewTab: true,
              alignment: 'inherit'
            },
            {
              _type: 'ctaEmailButton',
              _key: uuidv4(),
              alignment: 'inherit'
            }
          ]
        },
        {
          _type: 'subSubSection',
          _key: uuidv4(),
          title: 'Sub Sub Section Left',
          anchorId: createAnchorId('Sub Sub Section Left'),
          alignment: 'inherit',
          content: [
            {
              _type: 'richText',
              _key: uuidv4(),
              isCallout: false,
              content: createRichText('Sub sub section rich text with left alignment.'),
              textAlign: 'left'
            },
            {
              _type: 'quote',
              _key: uuidv4(),
              text: 'Sub sub section quote with left alignment.',
              attribution: 'Sub Sub Author',
              textAlign: 'left'
            },
            {
              _type: 'ctaButton',
              _key: uuidv4(),
              text: 'Sub Sub Left',
              variant: 'filled',
              linkType: 'external',
              externalUrl: 'https://example.com',
              openInNewTab: true,
              alignment: 'left'
            },
            {
              _type: 'ctaEmailButton',
              _key: uuidv4(),
              alignment: 'left'
            }
          ]
        },
        {
          _type: 'subSubSection',
          _key: uuidv4(),
          title: 'Sub Sub Section Center',
          anchorId: createAnchorId('Sub Sub Section Center'),
          alignment: 'inherit',
          content: [
            {
              _type: 'richText',
              _key: uuidv4(),
              isCallout: false,
              content: createRichText('Sub sub section rich text with center alignment.'),
              textAlign: 'center'
            },
            {
              _type: 'quote',
              _key: uuidv4(),
              text: 'Sub sub section quote with center alignment.',
              attribution: 'Sub Sub Author',
              textAlign: 'center'
            },
            {
              _type: 'ctaButton',
              _key: uuidv4(),
              text: 'Sub Sub Center',
              variant: 'filled',
              linkType: 'external',
              externalUrl: 'https://example.com',
              openInNewTab: true,
              alignment: 'center'
            },
            {
              _type: 'ctaEmailButton',
              _key: uuidv4(),
              alignment: 'center'
            }
          ]
        },
        {
          _type: 'subSubSection',
          _key: uuidv4(),
          title: 'Sub Sub Section Right',
          anchorId: createAnchorId('Sub Sub Section Right'),
          alignment: 'inherit',
          content: [
            {
              _type: 'richText',
              _key: uuidv4(),
              isCallout: false,
              content: createRichText('Sub sub section rich text with right alignment.'),
              textAlign: 'right'
            },
            {
              _type: 'quote',
              _key: uuidv4(),
              text: 'Sub sub section quote with right alignment.',
              attribution: 'Sub Sub Author',
              textAlign: 'right'
            },
            {
              _type: 'ctaButton',
              _key: uuidv4(),
              text: 'Sub Sub Right',
              variant: 'filled',
              linkType: 'external',
              externalUrl: 'https://example.com',
              openInNewTab: true,
              alignment: 'right'
            },
            {
              _type: 'ctaEmailButton',
              _key: uuidv4(),
              alignment: 'right'
            }
          ]
        }
      ]
    });

    pageContent.push({
      _type: 'pageSection',
      _key: uuidv4(),
      title: 'Alignment Testing Section',
      anchorId: createAnchorId('Alignment Testing Section'),
      subtitle: 'This section demonstrates all alignment options across different components',
      textAlign: 'inherit',
      content: alignmentTestContent
    });

    // Update the page with the new content
    const result = await client.patch(alignmentTestPage._id).set({
      content: pageContent
    }).commit();

    console.log('Successfully updated Alignment Test page!');
    console.log(`Added ${pageContent.length} root-level components`);
    console.log('Page ID:', result._id);
    console.log('Updated at:', result._updatedAt);

    // Calculate total components
    let totalComponents = pageContent.length;
    
    function countNestedComponents(content) {
      let count = 0;
      if (Array.isArray(content)) {
        for (const item of content) {
          count++;
          if (item.content) {
            count += countNestedComponents(item.content);
          }
          if (item.cards && Array.isArray(item.cards)) {
            count += item.cards.length;
          }
        }
      }
      return count;
    }

    totalComponents += countNestedComponents(pageContent);
    console.log(`Total components added (including nested): ${totalComponents}`);

  } catch (error) {
    console.error('Error creating/populating alignment test:', error);
    process.exit(1);
  }
}

// Run the script
createAndPopulateAlignmentTest();