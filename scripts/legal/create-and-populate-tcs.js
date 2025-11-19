/**
 * Script to create and populate Terms & Conditions document in Sanity CMS
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/legal/create-and-populate-tcs.js
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Load environment variables from .env.local
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // We want fresh data when writing
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // You'll need to set this environment variable
});

// Terms & Conditions content structure
const termsAndConditionsData = {
  _type: 'termsAndConditions',
  _id: 'termsAndConditions',
  hide: false,
  title: 'Terms & Conditions',
  content: [
    {
      _type: 'pageSection',
      _key: 'intro-section',
      hideSection: false,
      title: 'Introduction',
      anchorId: 'introduction',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'intro-text',
          content: [
            {
              _type: 'block',
              _key: 'intro-block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Welcome to Taupiri Sound. These Terms & Conditions govern your use of our website only. By accessing or using our website, you agree to be bound by these terms. Please note that any agreements relating to recording studio services, bookings, or use of our facilities are subject to separate terms and conditions that will be established directly between the studio and the client.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'definitions-section',
      hideSection: false,
      title: 'Definitions',
      anchorId: 'definitions',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'definitions-text',
          content: [
            {
              _type: 'block',
              _key: 'definitions-list',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'In these Terms & Conditions:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'def-company',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '"Studio", "we", "us", or "our" refers to Taupiri Sound',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'def-website',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '"Website" refers to taupirisound.co.nz and all associated pages',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'def-user',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '"User", "you", or "your" refers to any individual or entity accessing our website',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'def-content',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: '"Content" refers to all information, text, graphics, images, audio samples, videos, and other materials displayed on our website',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'website-use-section',
      hideSection: false,
      title: 'Website Use',
      anchorId: 'website-use',
      useCompactGap: true,
      content: [
        {
          _type: 'subSection',
          _key: 'permitted-use',
          hideSection: false,
          title: 'Permitted Use',
          anchorId: 'permitted-use',
          content: [
            {
              _type: 'richText',
              _key: 'permitted-use-text',
              content: [
                {
                  _type: 'block',
                  _key: 'permitted-intro',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'You may use our website for:',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'permitted-1',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Learning about our recording studio services and facilities',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'permitted-2',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Listening to audio samples and viewing project examples',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'permitted-3',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Reading blog posts and articles about recording techniques',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'permitted-4',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Contacting us via the website contact form for inquiries',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          _type: 'subSection',
          _key: 'prohibited-use',
          hideSection: false,
          title: 'Prohibited Use',
          anchorId: 'prohibited-use',
          content: [
            {
              _type: 'richText',
              _key: 'prohibited-use-text',
              content: [
                {
                  _type: 'block',
                  _key: 'prohibited-intro',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'You must not:',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'prohibited-1',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Use our website for any unlawful purpose',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'prohibited-2',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Attempt to gain unauthorized access to our systems',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'prohibited-3',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Download, copy, or distribute audio samples without permission',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'prohibited-4',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Infringe on intellectual property rights',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'prohibited-5',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Spam or send unsolicited communications',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'intellectual-property-section',
      hideSection: false,
      title: 'Intellectual Property and Website Content',
      anchorId: 'intellectual-property',
      useCompactGap: true,
      content: [
        {
          _type: 'subSection',
          _key: 'portfolio-use',
          hideSection: false,
          title: 'Portfolio and Promotional Use',
          anchorId: 'portfolio-use',
          content: [
            {
              _type: 'richText',
              _key: 'portfolio-text',
              content: [
                {
                  _type: 'block',
                  _key: 'portfolio-1',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'We may request permission to use excerpts of recordings for promotional purposes, portfolio examples, or website content. Any such use will be discussed and agreed upon with the relevant parties.',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          _type: 'subSection',
          _key: 'website-content',
          hideSection: false,
          title: 'Website Content',
          anchorId: 'website-content',
          content: [
            {
              _type: 'richText',
              _key: 'website-content-text',
              content: [
                {
                  _type: 'block',
                  _key: 'web-content-1',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'All content on this website, including text, graphics, logos, photographs, audio samples, videos, and design elements, is either owned by Taupiri Sound or used with permission from the respective rights holders. Unauthorized reproduction or distribution is prohibited.',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'third-party-section',
      hideSection: false,
      title: 'Third-Party Services and Embedded Content',
      anchorId: 'third-party-services',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'third-party-text',
          content: [
            {
              _type: 'block',
              _key: 'third-party-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Our website currently integrates with, or may in the future integrate with, various third-party services to showcase our work and provide enhanced functionality. These services may include, but are not limited to:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'third-party-spotify',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Spotify widgets for streaming audio samples',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'third-party-bandcamp',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Bandcamp widgets for music playback',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'third-party-youtube',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'YouTube videos for video content and studio tours',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'third-party-social',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Social media platforms for connectivity and updates',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'third-party-changes',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We may introduce additional third-party integrations or discontinue existing ones at any time without prior notice.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'third-party-disclaimer',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'These third-party services have their own terms of service and privacy policies. We are not responsible for their practices or content. Please refer to our Privacy Policy for information about cookies and data collection.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'disclaimer-section',
      hideSection: false,
      title: 'Disclaimers and Limitation of Liability',
      anchorId: 'disclaimers',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'disclaimer-text',
          content: [
            {
              _type: 'block',
              _key: 'disclaimer-warranty',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Our website is provided "as is" without any warranties, express or implied. We do not guarantee that our website will be uninterrupted, error-free, or free from harmful components.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'disclaimer-liability',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'To the fullest extent permitted by law, Taupiri Sound shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'contact-section',
      hideSection: false,
      title: 'Contact Information',
      anchorId: 'contact',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'contact-text',
          content: [
            {
              _type: 'block',
              _key: 'contact-info',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'If you have any questions about these Terms & Conditions, please contact us:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'contact-email',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Email: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: 'lance@taupirisound.co.nz',
                  marks: ['strong']
                }
              ]
            },
            {
              _type: 'block',
              _key: 'contact-phone',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Phone: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: '+64 21 311 903',
                  marks: ['strong']
                }
              ]
            },
            {
              _type: 'block',
              _key: 'contact-address',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Address: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: 'Topview Road, Taupiri 3792, New Zealand',
                  marks: ['strong']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _type: 'pageSection',
      _key: 'changes-section',
      hideSection: false,
      title: 'Changes to Terms',
      anchorId: 'changes',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'changes-text',
          content: [
            {
              _type: 'block',
              _key: 'changes-notice',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on this website. Your continued use of our website or services constitutes acceptance of any changes.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'changes-effective',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Last updated: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: new Date().toLocaleDateString('en-NZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  marks: ['strong']
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

async function createAndPopulateTermsAndConditions() {
  try {
    console.log('=� Creating Terms & Conditions document...');

    // Check if document already exists
    const existingDoc = await client.fetch('*[_id == "termsAndConditions"][0]');

    if (existingDoc) {
      console.log('�  Terms & Conditions document already exists.');
      console.log('   Updating existing document...');

      const result = await client.createOrReplace(termsAndConditionsData);
      console.log(' Updated Terms & Conditions document');
      console.log(`   Document ID: ${result._id}`);
    } else {
      const result = await client.create(termsAndConditionsData);
      console.log(' Created Terms & Conditions document');
      console.log(`   Document ID: ${result._id}`);
    }

    console.log('\n=� Next steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Site Management � Legal � Terms & Conditions');
    console.log('3. Review the content and make any necessary adjustments');
    console.log('4. Publish the document when ready');
    console.log('5. The page will be available at /terms-and-conditions');
  } catch (error) {
    console.error('=� Script failed:', error);
    process.exit(1);
  }
}

// Run the script
createAndPopulateTermsAndConditions();