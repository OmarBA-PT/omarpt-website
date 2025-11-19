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
  useCdn: false,
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

// Blog post templates
const blogPosts = [
  // 1. Album Review
  {
    title: 'Album Review: "Neon Dreams" by Midnight Pulse',
    slug: 'album-review-neon-dreams-midnight-pulse',
    subtitle: 'An in-depth look at this emerging electronic artist\'s debut full-length album that blends synthwave nostalgia with modern production techniques.',
    author: 'Music Editor',
    content: [
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'First Impressions and Production Quality',
        anchorId: createAnchorId('First Impressions and Production Quality'),
        subtitle: 'How Midnight Pulse crafted a cohesive sonic journey',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Midnight Pulse\'s debut album "Neon Dreams" immediately grabs attention with its polished production and atmospheric depth. The opening track "Electric Sunset" sets the tone with lush synthesizer pads and crisp drum programming that feels both retro and contemporary. Producer Jake Martinez has clearly put significant effort into achieving the perfect balance between nostalgic warmth and modern clarity throughout the record.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('The album\'s sonic palette draws heavily from 80s synthwave while incorporating modern electronic elements. Each track features meticulously crafted soundscapes that transport listeners to neon-lit cityscapes. The production quality remains consistent throughout, with careful attention to dynamic range and spatial effects that create an immersive listening experience from start to finish.')
          },
          {
            _type: 'ctaCalloutLink',
            _key: uuidv4(),
            heading: 'Discover More Reviews',
            text: 'Check out more album reviews and music coverage on our site.',
            linkType: 'external',
            externalUrl: 'https://www.0717records.com/',
            openInNewTab: true
          }
        ]
      },
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Standout Tracks and Musical Highlights',
        anchorId: createAnchorId('Standout Tracks and Musical Highlights'),
        subtitle: 'Breaking down the album\'s most memorable moments',
        content: [
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-right',
            content: createRichText('Track four, "Digital Rain," serves as the album\'s emotional centerpiece with its haunting melody and introspective lyrics. The song builds gradually from minimal beginnings to a soaring chorus that showcases Midnight Pulse\'s ability to blend electronic textures with genuine emotion. The interplay between analog synthesizers and digital effects creates a compelling sonic narrative that keeps listeners engaged.')
          },
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('"Midnight Highway" delivers the album\'s most energetic moment with its driving bassline and infectious groove. The track demonstrates the artist\'s understanding of dancefloor dynamics while maintaining the album\'s overall aesthetic coherence. Meanwhile, closing track "Dawn Approaching" provides a satisfying conclusion with its gradual fade from synthetic to organic sounds, symbolizing the transition from night to day.'),
            textAlign: 'inherit'
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '3',
            images: [
              {
                _key: uuidv4(),
                caption: 'Album artwork detail'
              },
              {
                _key: uuidv4(),
                caption: 'Studio recording session'
              },
              {
                _key: uuidv4(),
                caption: 'Midnight Pulse live performance'
              }
            ]
          }
        ]
      }
    ],
    hasClosingCard: true,
    closingCard: {
      _type: 'card',
      _key: uuidv4(),
      cardStyle: 'feature',
      title: 'Share Your Thoughts',
      bodyText: 'What did you think of this album review? We\'d love to hear your perspective on "Neon Dreams" or any other music you\'ve been enjoying lately.',
      buttonType: 'email'
    }
  },

  // 2. Tour Review/Journal
  {
    title: 'Tour Diary: Star Control\'s New Zealand Adventure',
    slug: 'tour-diary-star-control-new-zealand',
    subtitle: 'A behind-the-scenes look at our incredible three-week tour across New Zealand with electronic duo Star Control, from Auckland to Christchurch.',
    author: 'Tour Manager',
    content: [
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Auckland and the North Island Experience',
        anchorId: createAnchorId('Auckland and the North Island Experience'),
        subtitle: 'Kicking off the tour in New Zealand\'s largest city',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Our New Zealand tour with Star Control began in Auckland at the iconic Powerstation venue. The energy from the local crowd was immediately apparent as fans packed the intimate space for two sold-out nights. The duo\'s signature blend of electronic beats and live instrumentation resonated perfectly with the Kiwi audience, creating an electric atmosphere that set the tone for the entire tour.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('Wellington\'s show at San Fran Bath House proved to be one of the tour highlights. The venue\'s unique architecture and excellent acoustics provided the perfect backdrop for Star Control\'s immersive live show. Between sets, we explored the city\'s vibrant café culture and street art scene, which provided inspiration for future creative projects and reminded us why New Zealand has such a thriving arts community.')
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '2',
            images: [
              {
                _key: uuidv4(),
                caption: 'Star Control performing in Auckland'
              },
              {
                _key: uuidv4(),
                caption: 'Wellington venue setup'
              }
            ]
          }
        ]
      },
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'South Island Adventures and Final Shows',
        anchorId: createAnchorId('South Island Adventures and Final Shows'),
        subtitle: 'Concluding the tour with unforgettable experiences',
        content: [
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-right',
            content: createRichText('The transition to the South Island brought new challenges and rewards. Christchurch\'s resilient music scene welcomed us with open arms, and the performance at The Foundry became an emotional high point of the entire tour. Local musicians joined Star Control for impromptu collaborations, creating magical moments that reminded us why live music builds such strong communities across cultural boundaries.')
          },
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Beyond the performances, this tour reinforced the importance of authentic connections between artists and audiences. From intimate acoustic sets in record stores to late-night conversations with fans about music\'s impact on their lives, every interaction contributed to a deeper understanding of how electronic music transcends geographical and cultural boundaries to create shared experiences.'),
            textAlign: 'inherit'
          },
          {
            _type: 'ctaCalloutLink',
            _key: uuidv4(),
            heading: 'Follow Star Control',
            text: 'Stay updated on Star Control\'s upcoming tours and releases.',
            linkType: 'external',
            externalUrl: 'https://www.0717records.com/',
            openInNewTab: true
          }
        ]
      }
    ],
    hasClosingCard: true,
    closingCard: {
      _type: 'card',
      _key: uuidv4(),
      cardStyle: 'feature',
      title: 'Tell Us About Your Concert Experiences',
      bodyText: 'Have you been to any memorable shows recently? We\'d love to hear about your favorite live music experiences and what made them special.',
      buttonType: 'email'
    }
  },

  // 3. How to Series: Starting a Band
  {
    title: 'How to Start a Band: From Bedroom Producer to Live Act',
    slug: 'how-to-start-a-band-bedroom-producer-to-live-act',
    subtitle: 'A comprehensive guide to transitioning from solo music creation to building a collaborative band that can perform live and create together.',
    author: 'Band Coach',
    content: [
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Finding the Right Collaborators',
        anchorId: createAnchorId('Finding the Right Collaborators'),
        subtitle: 'Building your core team of creative partners',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Starting a band begins with finding musicians who share your creative vision and work ethic. Look beyond technical skill to find people who communicate well and contribute to the group\'s overall chemistry. Local open mic nights, music schools, and online communities are excellent places to meet potential bandmates. Remember that the best bands balance individual strengths while maintaining collective focus on shared musical goals.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('Establish clear expectations early regarding commitment levels, financial arrangements, and creative input. Discuss everyone\'s availability for rehearsals, recording sessions, and potential performances. Having honest conversations about goals, both short-term and long-term, prevents conflicts and ensures all members are working toward the same objectives while respecting individual contributions and schedules.')
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '3',
            images: [
              {
                _key: uuidv4(),
                caption: 'Band auditions'
              },
              {
                _key: uuidv4(),
                caption: 'First rehearsal session'
              },
              {
                _key: uuidv4(),
                caption: 'Team building activities'
              }
            ]
          }
        ]
      },
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Developing Your Sound and Identity',
        anchorId: createAnchorId('Developing Your Sound and Identity'),
        subtitle: 'Creating a cohesive musical and visual brand',
        content: [
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-right',
            content: createRichText('Your band\'s identity extends far beyond just the music you create. Develop a consistent visual aesthetic, from logo design to stage presentation, that reflects your musical style and values. Consider how your band name, imagery, and online presence work together to tell a coherent story. This unified approach helps audiences understand and connect with your artistic vision more effectively.')
          },
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Spend time in rehearsals experimenting with different arrangements and allowing each member\'s musical personality to influence the collective sound. Document this process through regular recordings, even rough demos, to track your evolution and identify what works best. The goal is finding the sweet spot where individual creativity enhances rather than competes with the group\'s overall musical direction and live performance energy.'),
            textAlign: 'inherit'
          },
          {
            _type: 'ctaCalloutLink',
            _key: uuidv4(),
            heading: 'Get Professional Guidance',
            text: 'Learn more about band development and music industry insights.',
            linkType: 'external',
            externalUrl: 'https://www.0717records.com/',
            openInNewTab: true
          }
        ]
      }
    ],
    hasClosingCard: true,
    closingCard: {
      _type: 'card',
      _key: uuidv4(),
      cardStyle: 'feature',
      title: 'Share Your Band Journey',
      bodyText: 'Are you starting a band or have experience building musical collaborations? We\'d love to hear about your challenges and successes along the way.',
      buttonType: 'email'
    }
  },

  // 4. How to Series: Releasing an Album
  {
    title: 'How to Release an Album: From Recording to Distribution',
    slug: 'how-to-release-album-recording-to-distribution',
    subtitle: 'A step-by-step guide to releasing your music independently, covering everything from final recordings to marketing and distribution strategies.',
    author: 'Release Strategist',
    content: [
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Pre-Release Planning and Preparation',
        anchorId: createAnchorId('Pre-Release Planning and Preparation'),
        subtitle: 'Setting the foundation for a successful album launch',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Successful album releases require months of advance planning before your music reaches listeners. Begin by creating a comprehensive timeline that includes mastering deadlines, artwork completion, press kit preparation, and marketing campaign milestones. Consider seasonal factors, competing releases, and your audience\'s listening habits when selecting your release date. This strategic approach maximizes your album\'s impact and commercial potential.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('Invest time in professional mastering and high-quality artwork that reflects your musical vision. These elements significantly impact how your music is perceived and shared across digital platforms. Work with experienced professionals who understand current industry standards for streaming platforms and physical formats. Remember that first impressions matter greatly in today\'s competitive music landscape where visual presentation often influences listening decisions.')
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '2',
            images: [
              {
                _key: uuidv4(),
                caption: 'Album artwork design process'
              },
              {
                _key: uuidv4(),
                caption: 'Mastering session'
              }
            ]
          }
        ]
      },
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Distribution and Marketing Strategy',
        anchorId: createAnchorId('Distribution and Marketing Strategy'),
        subtitle: 'Getting your music heard by the right audiences',
        content: [
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-right',
            content: createRichText('Choose distribution platforms that align with your audience and budget. Services like DistroKid, CD Baby, and TuneCore each offer different features and pricing structures. Focus on building genuine relationships with playlist curators, music bloggers, and radio programmers rather than mass-messaging. Personalized outreach with compelling stories about your music creates stronger connections and better placement opportunities.')
          },
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Develop a multi-platform marketing strategy that includes social media content, email newsletters, and live performances. Create behind-the-scenes content that gives fans insight into your creative process and builds anticipation for the release. Remember that consistent, authentic engagement with your audience often proves more valuable than expensive advertising campaigns that lack personal connection and storytelling elements.'),
            textAlign: 'inherit'
          },
          {
            _type: 'ctaCalloutLink',
            _key: uuidv4(),
            heading: 'Release Support Services',
            text: 'Explore professional release and marketing support options.',
            linkType: 'external',
            externalUrl: 'https://www.0717records.com/',
            openInNewTab: true
          }
        ]
      }
    ],
    hasClosingCard: true,
    closingCard: {
      _type: 'card',
      _key: uuidv4(),
      cardStyle: 'feature',
      title: 'Questions About Your Release?',
      bodyText: 'Planning an album release or have questions about distribution and marketing? We\'d be happy to share more detailed advice and resources.',
      buttonType: 'email'
    }
  },

  // 5. How to Series: Playing Live and Booking Shows
  {
    title: 'How to Play Live: Booking Shows and Building an Audience',
    slug: 'how-to-play-live-booking-shows-building-audience',
    subtitle: 'Everything you need to know about transitioning from rehearsal room to stage, including venue outreach, performance preparation, and audience development.',
    author: 'Live Music Coordinator',
    content: [
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Preparing for Live Performance',
        anchorId: createAnchorId('Preparing for Live Performance'),
        subtitle: 'Getting stage-ready and performance-polished',
        content: [
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Live performance requires different skills than studio recording. Practice your songs until they become second nature, then focus on stage presence, audience interaction, and handling technical difficulties gracefully. Record your rehearsals to identify areas for improvement and develop a reliable setlist that flows well from song to song. Consider how lighting, sound levels, and stage movement will enhance your musical presentation.'),
            textAlign: 'inherit'
          },
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-left',
            content: createRichText('Invest in reliable equipment and learn basic troubleshooting for common technical issues. Create detailed stage plots and technical riders that communicate your needs clearly to sound engineers and venue staff. Professional preparation demonstrates respect for the venue and other performers while ensuring your show runs smoothly. Always carry backup cables, picks, sticks, and other essential items.')
          },
          {
            _type: 'imageGallery',
            _key: uuidv4(),
            columns: '4',
            images: [
              {
                _key: uuidv4(),
                caption: 'Live sound setup'
              },
              {
                _key: uuidv4(),
                caption: 'Stage performance'
              },
              {
                _key: uuidv4(),
                caption: 'Audience interaction'
              },
              {
                _key: uuidv4(),
                caption: 'Post-show networking'
              }
            ]
          }
        ]
      },
      {
        _type: 'pageSection',
        _key: uuidv4(),
        title: 'Booking Venues and Building Relationships',
        anchorId: createAnchorId('Booking Venues and Building Relationships'),
        subtitle: 'Creating opportunities and maintaining industry connections',
        content: [
          {
            _type: 'textImage',
            _key: uuidv4(),
            layout: 'text-right',
            content: createRichText('Start with smaller, local venues to build experience and prove your draw before approaching larger clubs and theaters. Research venues thoroughly, understand their audience and typical acts, then craft personalized booking inquiries that demonstrate your knowledge of their programming. Include professional photos, recent performance videos, and realistic attendance projections in your pitch materials.')
          },
          {
            _type: 'richText',
            _key: uuidv4(),
            isCallout: false,
            content: createRichText('Building lasting relationships with venue bookers, other musicians, and local music community members creates ongoing opportunities for future shows. Always be professional, arrive early for load-in, and help promote shows through your own networks. Follow up after performances with thank-you messages and photos from the show. These small gestures often lead to repeat bookings and referrals to other venues.'),
            textAlign: 'inherit'
          },
          {
            _type: 'ctaCalloutLink',
            _key: uuidv4(),
            heading: 'Performance Opportunities',
            text: 'Discover venues and booking resources in your area.',
            linkType: 'external',
            externalUrl: 'https://www.0717records.com/',
            openInNewTab: true
          }
        ]
      }
    ],
    hasClosingCard: true,
    closingCard: {
      _type: 'card',
      _key: uuidv4(),
      cardStyle: 'feature',
      title: 'Share Your Live Music Experiences',
      bodyText: 'Have questions about booking shows or stories from your live performances? We\'d love to connect and hear about your experiences on stage.',
      buttonType: 'email'
    }
  }
];

// Main script function
async function createMultipleBlogPosts() {
  try {
    console.log(`Creating ${blogPosts.length} blog posts...`);
    
    const results = [];
    
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      
      console.log(`\n--- Creating blog post ${i + 1}/${blogPosts.length} ---`);
      console.log(`Title: "${post.title}"`);
      
      // Check if post already exists
      const existingPost = await client.fetch(
        '*[_type == "blogPost" && slug.current == $slug][0]',
        { slug: post.slug }
      );
      
      if (existingPost) {
        console.log(`⚠️  Blog post with slug "${post.slug}" already exists. Skipping.`);
        continue;
      }
      
      // Create the blog post
      const blogPostData = {
        _type: 'blogPost',
        title: post.title,
        slug: {
          _type: 'slug',
          current: post.slug
        },
        subtitle: post.subtitle,
        author: post.author,
        content: post.content,
        hasClosingCard: post.hasClosingCard,
        closingCard: post.closingCard
      };
      
      try {
        const result = await client.create(blogPostData);
        results.push(result);
        
        console.log(`✅ Successfully created: ${result._id}`);
        console.log(`   Slug: ${result.slug.current}`);
        console.log(`   Created: ${result._createdAt}`);
        
      } catch (createError) {
        console.error(`❌ Failed to create "${post.title}":`, createError.message);
      }
      
      // Small delay between posts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n🎉 Blog post creation completed!`);
    console.log(`Successfully created: ${results.length} out of ${blogPosts.length} blog posts`);
    
    if (results.length > 0) {
      console.log(`\n📊 Summary:`);
      results.forEach((result, index) => {
        console.log(`${index + 1}. "${result.title}" (${result.slug.current})`);
      });
      
      console.log(`\n✨ Features included in each post:`);
      console.log(`- 2 main sections with 50-80 word content blocks`);
      console.log(`- Rich Text, Text & Image, Image Gallery, and CTA Callout Link components`);
      console.log(`- Closing cards with email buttons for reader engagement`);
      console.log(`- Proper anchor IDs and section structure`);
      console.log(`- CTA links pointing to https://www.0717records.com/`);
    }
    
  } catch (error) {
    console.error('Error creating blog posts:', error);
    process.exit(1);
  }
}

// Run the script
createMultipleBlogPosts();