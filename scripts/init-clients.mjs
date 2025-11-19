/**
 * Script to initialize the Clients singleton document in Sanity
 * Run with: node scripts/init-clients.mjs
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function initializeClients() {
  try {
    console.log('Checking for existing clients document...');

    // Check if clients document already exists
    const existing = await client.fetch('*[_id == "clients"][0]');

    if (existing) {
      console.log('✅ Clients document already exists!');
      console.log('Document ID:', existing._id);
      console.log('Levels populated:');
      console.log('  Level 1:', existing.level1?.length || 0, 'clients');
      console.log('  Level 2:', existing.level2?.length || 0, 'clients');
      console.log('  Level 3:', existing.level3?.length || 0, 'clients');
      console.log('  Level 4:', existing.level4?.length || 0, 'clients');
      console.log('  Level 5:', existing.level5?.length || 0, 'clients');
      console.log('\nYou can edit it in Sanity Studio at: http://localhost:3000/studio/structure/clients');
      return;
    }

    console.log('Creating clients document...');

    // Create the clients document
    const result = await client.create({
      _id: 'clients',
      _type: 'clients',
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
    });

    console.log('✅ Successfully created clients document!');
    console.log('Document ID:', result._id);
    console.log('\n📝 Next steps:');
    console.log('1. Go to Sanity Studio: http://localhost:3000/studio/structure/clients');
    console.log('2. Add client names to the different levels');
    console.log('3. Click "Publish"');
    console.log('4. Refresh your frontend to see the clients appear');
  } catch (error) {
    console.error('❌ Error initializing clients:', error);
    if (error.message.includes('token')) {
      console.error('\n⚠️  Make sure SANITY_API_WRITE_TOKEN is set in your .env.local file');
      console.error('   You can create a token at: https://sanity.io/manage');
    }
    process.exit(1);
  }
}

initializeClients();
