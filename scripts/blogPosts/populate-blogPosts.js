/**
 * Script to populate Sanity CMS with blog posts from blogPosts.json
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/blogPosts/populate-blogPosts.js
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

async function populateBlogPosts() {
  try {
    console.log('🚀 Starting blog post population...');

    // Read the blogPosts.json file
    const blogPostsJsonPath = path.join(__dirname, 'blogPosts.json');
    const blogPostsData = JSON.parse(fs.readFileSync(blogPostsJsonPath, 'utf8'));

    console.log(`📖 Found ${blogPostsData.length} blog posts in JSON file`);

    // Check if any blog posts already exist to avoid duplicates
    const existingBlogPosts = await client.fetch('*[_type == "blogPost"]');
    console.log(`📋 Found ${existingBlogPosts.length} existing blog posts in CMS`);

    if (existingBlogPosts.length > 0) {
      console.log(
        '⚠️  Warning: There are already blog posts in the CMS. This script will add more blog posts.'
      );
      console.log('   If you want to start fresh, delete all blog posts in the CMS first.');
    }

    // Transform and create blog posts
    const results = [];
    for (let i = 0; i < blogPostsData.length; i++) {
      const blogPost = blogPostsData[i];

      console.log(`📝 Creating blog post ${i + 1}/${blogPostsData.length}: "${blogPost.title}"`);

      // Transform the JSON blog post to Sanity document format
      const sanityBlogPost = {
        _type: 'blogPost',
        title: blogPost.title,
        subtitle: blogPost.subtitle,
        author: blogPost.author,
        hasOverrideDate: blogPost.hasOverrideDate,
        overrideDate: blogPost.overrideDate,
        content: blogPost.content,
        hasClosingCard: blogPost.hasClosingCard,
        closingCard: blogPost.closingCard,
        // Omit heroImage as requested - will need manual upload/selection
      };

      try {
        const result = await client.create(sanityBlogPost);
        results.push(result);
        console.log(`✅ Created: "${blogPost.title}" (ID: ${result._id})`);
      } catch (error) {
        console.error(`❌ Failed to create "${blogPost.title}":`, error.message);
      }
    }

    console.log('\n🎉 Blog post population completed!');
    console.log(`✅ Successfully created ${results.length} blog posts`);
    console.log(`❌ Failed to create ${blogPostsData.length - results.length} blog posts`);

    if (results.length > 0) {
      console.log('\n📋 Created blog post IDs:');
      results.forEach((result) => {
        console.log(`   - ${result.title}: ${result._id}`);
      });
    }

    console.log('\n📝 Next steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Blog → Blog Posts section');
    console.log('3. Add hero images to the blog posts that need them');
    console.log('4. Review the nested content structure and formatting');
    console.log('5. Test the various content blocks and widgets');
    console.log('6. Publish the blog posts when ready');
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
populateBlogPosts();