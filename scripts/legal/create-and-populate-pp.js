/**
 * Script to create and populate Privacy Policy document in Sanity CMS
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/legal/create-and-populate-pp.js
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

// Privacy Policy content structure
const privacyPolicyData = {
  _type: 'privacyPolicy',
  _id: 'privacyPolicy',
  hide: false,
  title: 'Privacy Policy',
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
                  text: 'At Taupiri Sound, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website. Please note that any privacy considerations relating to recording studio services or use of our facilities are subject to separate agreements that will be established directly between the studio and the client.',
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
      _key: 'info-collection-section',
      hideSection: false,
      title: 'Information We Collect',
      anchorId: 'information-we-collect',
      useCompactGap: true,
      content: [
        {
          _type: 'subSection',
          _key: 'personal-info',
          hideSection: false,
          title: 'Personal Information',
          anchorId: 'personal-information',
          content: [
            {
              _type: 'richText',
              _key: 'personal-info-text',
              content: [
                {
                  _type: 'block',
                  _key: 'personal-intro',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'When you interact with our website, we may collect the following personal information:',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'personal-1',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Email address when you submit our contact form',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'personal-2',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Phone number (optional) when provided through our contact form',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'personal-3',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Any other information you choose to provide when contacting us',
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
          _key: 'usage-data',
          hideSection: false,
          title: 'Usage Data',
          anchorId: 'usage-data',
          content: [
            {
              _type: 'richText',
              _key: 'usage-data-text',
              content: [
                {
                  _type: 'block',
                  _key: 'usage-intro',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'We may automatically collect certain information when you visit our website:',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'usage-1',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'IP address and browser information',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'usage-2',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Pages visited and time spent on our website',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'usage-3',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Referring website and search terms used',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'usage-4',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Device and operating system information',
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
      _key: 'cookies-section',
      hideSection: false,
      title: 'Cookies and Tracking Technologies',
      anchorId: 'cookies-tracking',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'cookies-text',
          content: [
            {
              _type: 'block',
              _key: 'cookies-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Our website and embedded third-party services may use cookies and similar tracking technologies. Cookies are small text files stored on your device that help improve your browsing experience:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookies-spotify',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Spotify widgets may set cookies for music streaming functionality and playback preferences',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookies-bandcamp',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Bandcamp widgets may use cookies for audio playback and user preferences',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookies-youtube',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'YouTube embedded videos may set cookies for video playback, quality settings, and analytics',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookies-control',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'You can control cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing cookies. However, disabling cookies may affect the functionality of embedded audio and video players on our website.',
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
      _key: 'info-use-section',
      hideSection: false,
      title: 'How We Use Your Information',
      anchorId: 'how-we-use-information',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'info-use-text',
          content: [
            {
              _type: 'block',
              _key: 'use-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We use the information we collect for the following purposes:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'To respond to inquiries submitted through our contact form',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'To communicate with you about your inquiries',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'To improve our website based on usage patterns and feedback',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'To send occasional updates or information about our services (with your consent)',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-6',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'To comply with legal obligations and protect our rights',
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
      _key: 'info-sharing-section',
      hideSection: false,
      title: 'Information Sharing and Disclosure',
      anchorId: 'information-sharing',
      content: [
        {
          _type: 'richText',
          _key: 'sharing-text',
          content: [
            {
              _type: 'block',
              _key: 'sharing-policy',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sharing-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'With your explicit consent for promotional purposes',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sharing-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'With service providers who assist in our operations (under confidentiality agreements)',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sharing-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'When required by law or to protect legal rights',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sharing-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'In connection with business transfers or reorganization',
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
      _key: 'third-party-section',
      hideSection: false,
      useCompactGap: true,
      title: 'Third-Party Services',
      anchorId: 'third-party-services',
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
                  text: 'Our website integrates with various third-party services to showcase our work. These services have their own privacy policies and may collect data independently:',
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
                  text: 'Spotify: Audio streaming widgets for sample playback',
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
                  text: 'Bandcamp: Music playback widgets',
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
                  text: 'YouTube: Video content embedding for studio tours and project showcases',
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
                  text: 'We encourage you to review the privacy policies of these third-party services. We are not responsible for their data collection practices or privacy policies. These services may set cookies and collect information as described in their respective privacy policies.',
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
      _key: 'data-security-section',
      hideSection: false,
      useCompactGap: true,
      title: 'Data Security',
      anchorId: 'data-security',
      content: [
        {
          _type: 'richText',
          _key: 'security-text',
          content: [
            {
              _type: 'block',
              _key: 'security-measures',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We implement reasonable security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'security-notice',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'In the event of a data breach that affects personal information, we will take appropriate steps in accordance with applicable law.',
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
      _key: 'data-retention-section',
      hideSection: false,
      useCompactGap: true,
      title: 'Data Retention',
      anchorId: 'data-retention',
      content: [
        {
          _type: 'richText',
          _key: 'retention-text',
          content: [
            {
              _type: 'block',
              _key: 'retention-policy',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We may retain personal information for various periods depending on the nature of the information and our operational needs. Retention periods may vary based on legal requirements, business purposes, and the type of data collected.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'retention-period',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'While we aim to manage data responsibly, we do not guarantee specific retention or deletion timeframes. Information may be retained for as long as reasonably necessary for legitimate business purposes or as required by applicable law.',
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
      _key: 'your-rights-section',
      hideSection: false,
      useCompactGap: true,
      title: 'Your Rights',
      anchorId: 'your-rights',
      content: [
        {
          _type: 'richText',
          _key: 'rights-text',
          content: [
            {
              _type: 'block',
              _key: 'rights-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Depending on applicable law and our capabilities, you may have certain rights regarding your personal information. Where feasible and appropriate, we may be able to:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Provide access to personal information we hold about you',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Correct inaccurate information upon request',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Delete personal information when appropriate and feasible',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Provide data in a portable format where technically possible',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-disclaimer',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We will consider requests regarding personal information on a case-by-case basis. Our ability to fulfill such requests may be limited by technical constraints, legal requirements, or operational considerations. To make a request, please contact us using the information provided below.',
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
      useCompactGap: true,
      title: 'Contact Information',
      anchorId: 'contact',
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
                  text: 'If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:',
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
            },
            {
              _type: 'block',
              _key: 'contact-response',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We aim to respond to inquiries as soon as possible, though response times may vary.',
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
      _key: 'changes-section',
      hideSection: false,
      useCompactGap: true,
      title: 'Changes to This Privacy Policy',
      anchorId: 'changes',
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
                  text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date below.',
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

async function createAndPopulatePrivacyPolicy() {
  try {
    console.log('=� Creating Privacy Policy document...');

    // Check if document already exists
    const existingDoc = await client.fetch('*[_id == "privacyPolicy"][0]');

    if (existingDoc) {
      console.log('�  Privacy Policy document already exists.');
      console.log('   Updating existing document...');

      const result = await client.createOrReplace(privacyPolicyData);
      console.log(' Updated Privacy Policy document');
      console.log(`   Document ID: ${result._id}`);
    } else {
      const result = await client.create(privacyPolicyData);
      console.log(' Created Privacy Policy document');
      console.log(`   Document ID: ${result._id}`);
    }

    console.log('\n=� Next steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Site Management � Legal � Privacy Policy');
    console.log('3. Review the content and make any necessary adjustments');
    console.log('4. Publish the document when ready');
    console.log('5. The page will be available at /privacy-policy');
  } catch (error) {
    console.error('=� Script failed:', error);
    process.exit(1);
  }
}

// Run the script
createAndPopulatePrivacyPolicy();