/**
 * Script to list all video assets in Sanity database
 * Run with: node scripts/list-video-assets.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Optional: only needed for private datasets
});

async function listVideoAssets() {
  try {
    const query = `*[_type == "sanity.fileAsset" && mimeType match "video/*"] {
      _id,
      _createdAt,
      _updatedAt,
      url,
      originalFilename,
      size,
      mimeType,
      extension,
      "sizeInMB": round(size / 1024 / 1024, 2),
      "sizeInGB": round(size / 1024 / 1024 / 1024, 3)
    } | order(_createdAt desc)`;

    const videos = await client.fetch(query);

    console.log(`\n📹 Found ${videos.length} video asset(s):\n`);

    if (videos.length === 0) {
      console.log('No video assets found in the database.');
      return;
    }

    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.originalFilename || 'Unnamed'}`);
      console.log(`   ID: ${video._id}`);
      console.log(`   Type: ${video.mimeType} (${video.extension})`);
      console.log(`   Size: ${video.sizeInMB} MB`);
      console.log(`   Created: ${new Date(video._createdAt).toLocaleString()}`);
      console.log(`   URL: ${video.url}`);
      console.log('');
    });

    const totalSizeMB = videos.reduce((sum, v) => sum + v.size / 1024 / 1024, 0);
    console.log(
      `📊 Total size: ${totalSizeMB.toFixed(2)} MB (${(totalSizeMB / 1024).toFixed(3)} GB)\n`
    );
  } catch (error) {
    console.error('Error fetching video assets:', error);
  }
}

listVideoAssets();
