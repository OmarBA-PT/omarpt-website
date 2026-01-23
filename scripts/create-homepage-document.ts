/**
 * Migration script: Create the homePage document
 *
 * This script creates the lightweight homePage document that serves as the
 * linkable entity for the home page. This document is used in the internal
 * linking system and resolves to "/".
 *
 * Usage:
 *   npx tsx scripts/create-homepage-document.ts
 *
 * Requirements:
 *   - SANITY_API_WRITE_TOKEN environment variable must be set
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET');
  process.exit(1);
}

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN environment variable');
  console.error('Please add a write token to your .env.local file');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-01-23',
  useCdn: false,
});

async function createHomePageDocument() {
  console.log('Creating homePage document...');
  console.log(`Project: ${projectId}, Dataset: ${dataset}`);

  // Check if the document already exists
  const existingDoc = await client.fetch(`*[_id == "homePage"][0]`);

  if (existingDoc) {
    console.log('homePage document already exists. No action needed.');
    return;
  }

  // Create the homePage document
  const result = await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
  });

  console.log('homePage document created successfully!');
  console.log(`Document ID: ${result._id}`);
}

createHomePageDocument().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
