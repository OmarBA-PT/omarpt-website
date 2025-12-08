/**
 * Script to create and populate Privacy Policy document in Sanity CMS
 * Tailored for Omania Training - Personal Training Services
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
  useCdn: false, // I want fresh data when writing
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // You'll need to set this environment variable
});

// Privacy Policy content structure
const termsAndConditionsData = {
  _type: 'termsAndConditions',
  _id: 'termsAndConditions',
  hide: false,
  title: 'Terms & Conditions',
  topText: `Last Updated: ${new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`,
  content: [
    {
      _type: 'pageSection',
      _key: 'acceptance-section',
      hideSection: false,
      title: 'Acceptance of Terms',
      anchorId: 'acceptance',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'acceptance-text',
        content: [
          {
            _type: 'block',
            _key: 'accept-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'By accessing or using Omania Training services, including my website and personal training programs, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use my services.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'services-section',
      hideSection: false,
      title: 'Services',
      anchorId: 'services',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'services-text',
        content: [
          {
            _type: 'block',
            _key: 'services-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Omania Training provides personal training, online coaching, nutrition coaching, and body transformation programs. All services are provided "as is" and I reserve the right to modify, suspend, or discontinue any aspect of my services at any time.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'services-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'You acknowledge that participation in physical exercise and training programs involves inherent risks, including but not limited to muscle strains, cardiovascular stress, and other injuries. You voluntarily assume all such risks.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'payment-section',
      hideSection: false,
      title: 'Payment & Booking',
      anchorId: 'payment',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'payment-text',
        content: [
          {
            _type: 'block',
            _key: 'payment-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Payment is due at the time of booking unless otherwise agreed. I accept various payment methods including bank transfer and credit/debit cards. All fees are in NZD and are non-refundable unless otherwise stated.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'payment-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Session packages expire 12 months from the date of purchase. Cancellations must be made at least 24 hours in advance to receive credit. Late cancellations or no-shows will result in forfeiture of the session.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'medical-section',
      hideSection: false,
      title: 'Health & Medical Clearance',
      anchorId: 'medical',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'medical-text',
        content: [
          {
            _type: 'block',
            _key: 'medical-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'You are required to complete a health history questionnaire and disclose any medical conditions, injuries, or health concerns. You may be required to obtain medical clearance from a physician before participating in training programs.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'medical-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'You are responsible for informing your trainer of any changes to your health status. I am not medical professionals and do not provide medical diagnosis or treatment.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'liability-section',
      hideSection: false,
      title: 'Limitation of Liability',
      anchorId: 'liability',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'liability-text',
        content: [
          {
            _type: 'block',
            _key: 'liability-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'To the fullest extent permitted by law, Omania Training shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of my services, including but not limited to injuries, lost profits, or data loss.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liability-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'My total liability for any claims arising from my services shall not exceed the amount paid by you for services in the 3 months preceding the claim.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'indemnification-section',
      hideSection: false,
      title: 'Indemnification',
      anchorId: 'indemnification',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'indemnification-text',
        content: [
          {
            _type: 'block',
            _key: 'indemnify-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'You agree to indemnify and hold harmless Omania Training from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of my services or violation of these terms.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'intellectual-property-section',
      hideSection: false,
      title: 'Intellectual Property',
      anchorId: 'intellectual-property',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'ip-text',
        content: [
          {
            _type: 'block',
            _key: 'ip-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'All content, training programs, materials, and branding provided by Omania Training are protected by intellectual property rights. You may not reproduce, distribute, or create derivative works without express written permission.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'termination-section',
      hideSection: false,
      title: 'Termination',
      anchorId: 'termination',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'termination-text',
        content: [
          {
            _type: 'block',
            _key: 'term-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'I may terminate or suspend access to my services immediately, without prior notice, for any reason including breach of these terms. You may also terminate services by providing written notice.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'changes-section',
      hideSection: false,
      title: 'Changes to Terms',
      anchorId: 'changes',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'changes-text',
        content: [
          {
            _type: 'block',
            _key: 'changes-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'I reserve the right to modify these Terms & Conditions at any time. Material changes will be communicated with 30 days notice. Continued use of my services constitutes acceptance of updated terms.',
              marks: []
            }]
          }
        ]
      }]
    },
    {
      _type: 'pageSection',
      _key: 'contact-section',
      hideSection: false,
      title: 'Contact Information',
      anchorId: 'contact',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'contact-text',
        content: [
          {
            _type: 'block',
            _key: 'contact-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'If you have questions about these Terms & Conditions, please contact me:',
              marks: []
            }]
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
                text: 'omar@omaniatraining.com',
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
                text: '+64 12 345 678',
                marks: ['strong']
              }
            ]
          }
        ]
      }]
    }
  ]
};

async function createAndPopulateTermsAndConditions() {
  try {
    console.log('📄 Creating Terms & Conditions document for Omania Training...');

    // Check if document already exists
    const existingDoc = await client.fetch('*[_id == "termsAndConditions"][0]');

    if (existingDoc) {
      console.log('⚠️  Terms & Conditions document already exists.');
      console.log('   Updating existing document...');

      const result = await client.createOrReplace(termsAndConditionsData);
      console.log('✅ Updated Terms & Conditions document');
      console.log(`   Document ID: ${result._id}`);
    } else {
      const result = await client.create(termsAndConditionsData);
      console.log('✅ Created Terms & Conditions document');
      console.log(`   Document ID: ${result._id}`);
    }

    console.log('\n📋 Next steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Site Management → Legal → Terms & Conditions');
    console.log('3. Review the content and make any necessary adjustments');
    console.log('4. Update contact information if needed');
    console.log('5. Publish the document when ready');
    console.log('6. The page will be available at /terms-and-conditions');
    console.log('\n💡 Remember to have this document reviewed by a legal professional before publishing!');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
createAndPopulateTermsAndConditions();
