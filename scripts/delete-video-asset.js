/**
 * Script to delete a video asset from Sanity database
 * Run with: node scripts/delete-video-asset.js <asset-id>
 *
 * IMPORTANT: This will permanently delete the asset!
 * Use list-video-assets.js first to find the asset ID
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for deletions
});

async function deleteVideoAsset(assetId) {
  try {
    // First, verify the asset exists and is a video
    const asset = await client.fetch(
      `*[_type == "sanity.fileAsset" && _id == $assetId][0]`,
      { assetId }
    );

    if (!asset) {
      console.error(`❌ Asset not found: ${assetId}`);
      return;
    }

    if (!asset.mimeType?.startsWith('video/')) {
      console.error(`❌ Asset is not a video: ${asset.mimeType}`);
      console.log('Use the appropriate deletion method for this asset type.');
      return;
    }

    // Show asset details
    console.log('\n📹 Asset to be deleted:');
    console.log(`   Filename: ${asset.originalFilename || 'Unnamed'}`);
    console.log(`   Type: ${asset.mimeType}`);
    console.log(`   Size: ${(asset.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   ID: ${asset._id}`);
    console.log(`   URL: ${asset.url}`);

    // Check if asset is being used
    const usage = await client.fetch(
      `*[references($assetId)]`,
      { assetId }
    );

    if (usage.length > 0) {
      console.log(`\n⚠️  WARNING: This asset is referenced in ${usage.length} document(s):`);
      usage.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc._type}: ${doc.title || doc.name || doc._id}`);
      });
      console.log('\n   Deleting this asset may break these documents!');
    } else {
      console.log('\n✅ This asset is not referenced by any documents (safe to delete)');
    }

    // Confirm deletion
    console.log('\n⚠️  Are you sure you want to delete this asset?');
    console.log('   This action cannot be undone!');
    console.log('\n   To proceed, run:');
    console.log(`   node scripts/delete-video-asset.js ${assetId} --confirm\n`);

  } catch (error) {
    console.error('Error checking asset:', error);
  }
}

async function confirmAndDelete(assetId) {
  try {
    console.log(`\n🗑️  Deleting asset: ${assetId}...`);

    await client.delete(assetId);

    console.log('✅ Asset deleted successfully!\n');
  } catch (error) {
    console.error('❌ Error deleting asset:', error);
  }
}

// Main execution
const args = process.argv.slice(2);
const assetId = args[0];
const confirm = args.includes('--confirm');

if (!assetId) {
  console.error('\n❌ Please provide an asset ID');
  console.log('Usage: node scripts/delete-video-asset.js <asset-id>');
  console.log('Example: node scripts/delete-video-asset.js file-abc123xyz\n');
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('\n❌ SANITY_API_TOKEN is required for deletions');
  console.log('Make sure it\'s set in your .env.local file\n');
  process.exit(1);
}

if (confirm) {
  confirmAndDelete(assetId);
} else {
  deleteVideoAsset(assetId);
}
