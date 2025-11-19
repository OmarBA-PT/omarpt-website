/**
 * Script to populate Sanity CMS with pages from pages.json
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/pages/populate-pages.js
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Load environment variables from .env.local
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { createClient } = require('@sanity/client');
const fs = require('fs');

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // We want fresh data when writing
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // You'll need to set this environment variable
});

async function populatePages() {
  try {
    console.log('🚀 Starting page population...');

    // Read the pages.json file
    const pagesJsonPath = path.join(__dirname, 'pages.json');
    const pagesData = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));

    console.log(`📄 Found ${pagesData.length} pages in JSON file`);

    // Check if any pages already exist to avoid duplicates
    const existingPages = await client.fetch('*[_type == "page"]');
    console.log(`📋 Found ${existingPages.length} existing pages in CMS`);

    if (existingPages.length > 0) {
      console.log(
        '⚠️  Warning: There are already pages in the CMS. This script will add more pages.'
      );
      console.log('   If you want to start fresh, delete all pages in the CMS first.');
    }

    // Transform and create pages
    const results = [];
    for (let i = 0; i < pagesData.length; i++) {
      const page = pagesData[i];

      console.log(`📝 Creating page ${i + 1}/${pagesData.length}: "${page.title}"`);

      // Transform the JSON page to Sanity document format
      const sanityPage = {
        _type: 'page',
        title: page.title,
        slug: page.slug,
        subtitle: page.subtitle,
        content: page.content,
        hasClosingCard: page.hasClosingCard,
        closingCard: page.closingCard,
        // Omit heroImage as requested - will need manual upload/selection
      };

      try {
        const result = await client.create(sanityPage);
        results.push(result);
        console.log(`✅ Created: "${page.title}" (ID: ${result._id})`);
      } catch (error) {
        console.error(`❌ Failed to create "${page.title}":`, error.message);
      }
    }

    console.log('\n🎉 Page population completed!');
    console.log(`✅ Successfully created ${results.length} pages`);
    console.log(`❌ Failed to create ${pagesData.length - results.length} pages`);

    if (results.length > 0) {
      console.log('\n📋 Created page IDs:');
      results.forEach((result) => {
        console.log(`   - ${result.title}: ${result._id}`);
      });
    }

    console.log('\n📝 Next steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Content → Pages section');
    console.log('3. Add hero images to the pages that need them');
    console.log('4. Review the nested content structure and formatting');
    console.log('5. Test the various content blocks and components');
    console.log('6. Publish the pages when ready');
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
populatePages();