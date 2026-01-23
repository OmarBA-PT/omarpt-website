/**
 * Migration script: Split homePage into homePageHero and homePageSections
 *
 * This script migrates data from the old homePage document to the new
 * homePageHero and homePageSections documents.
 *
 * Usage:
 *   npx tsx scripts/migrate-homepage.ts
 *
 * Requirements:
 *   - SANITY_API_WRITE_TOKEN environment variable must be set
 *   - Run this script ONCE to migrate the data
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
  apiVersion: '2025-07-29',
  useCdn: false,
});

interface HomePageDocument {
  _id: string;
  _type: string;
  heroStyle?: string;
  heroImages?: Array<{
    _key: string;
    _type: string;
    asset: { _ref: string; _type: string };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  }>;
  heroVideo?: {
    asset: { _ref: string; _type: string };
  };
  heroImageTransitionDuration?: number;
  heroDefaultContentPosition?: string;
  heroContentPosition?: string;
  h1Title?: string;
  mainTitle?: string;
  subTitle?: string;
  heroCallToActionList?: Array<unknown>;
  hideScrollIndicator?: boolean;
  content?: Array<unknown>;
}

async function migrateHomePage() {
  console.log('Starting homePage migration...');
  console.log(`Project: ${projectId}, Dataset: ${dataset}`);

  // Step 1: Fetch the existing homePage document
  console.log('\n1. Fetching existing homePage document...');
  const homePage = await client.fetch<HomePageDocument | null>(
    `*[_id == "homePage"][0]`
  );

  if (!homePage) {
    console.log('No existing homePage document found.');
    console.log('Creating empty homePageHero and homePageSections documents...');

    // Create empty documents
    const transaction = client.transaction();

    transaction.createOrReplace({
      _id: 'homePageHero',
      _type: 'homePageHero',
      heroStyle: 'default',
      heroImageTransitionDuration: 4,
      heroDefaultContentPosition: 'center-left',
      heroContentPosition: 'center-center',
      hideScrollIndicator: false,
    });

    transaction.createOrReplace({
      _id: 'homePageSections',
      _type: 'homePageSections',
    });

    await transaction.commit();
    console.log('Empty documents created successfully.');
    return;
  }

  console.log('Found homePage document with the following fields:');
  console.log(`  - heroStyle: ${homePage.heroStyle || 'not set'}`);
  console.log(`  - heroImages: ${homePage.heroImages?.length || 0} images`);
  console.log(`  - heroVideo: ${homePage.heroVideo ? 'present' : 'not set'}`);
  console.log(`  - h1Title: ${homePage.h1Title || 'not set'}`);
  console.log(`  - mainTitle: ${homePage.mainTitle || 'not set'}`);
  console.log(`  - content sections: ${homePage.content?.length || 0} sections`);

  // Step 2: Create the homePageHero document
  console.log('\n2. Creating homePageHero document...');
  const heroDocument = {
    _id: 'homePageHero',
    _type: 'homePageHero',
    heroStyle: homePage.heroStyle,
    heroImages: homePage.heroImages,
    heroVideo: homePage.heroVideo,
    heroImageTransitionDuration: homePage.heroImageTransitionDuration,
    heroDefaultContentPosition: homePage.heroDefaultContentPosition,
    heroContentPosition: homePage.heroContentPosition,
    h1Title: homePage.h1Title,
    mainTitle: homePage.mainTitle,
    subTitle: homePage.subTitle,
    heroCallToActionList: homePage.heroCallToActionList,
    hideScrollIndicator: homePage.hideScrollIndicator,
  };

  // Remove undefined values while preserving required properties
  const cleanHeroDocument = {
    ...Object.fromEntries(
      Object.entries(heroDocument).filter(([, v]) => v !== undefined)
    ),
    _id: heroDocument._id,
    _type: heroDocument._type,
  };

  // Step 3: Create the homePageSections document
  console.log('3. Creating homePageSections document...');
  const sectionsDocument = {
    _id: 'homePageSections' as const,
    _type: 'homePageSections' as const,
    content: homePage.content,
  };

  // Remove undefined values while preserving required properties
  const cleanSectionsDocument = {
    ...Object.fromEntries(
      Object.entries(sectionsDocument).filter(([, v]) => v !== undefined)
    ),
    _id: sectionsDocument._id,
    _type: sectionsDocument._type,
  };

  // Step 4: Execute the transaction
  console.log('\n4. Executing migration transaction...');
  const transaction = client.transaction();

  transaction.createOrReplace(cleanHeroDocument as typeof heroDocument);
  transaction.createOrReplace(cleanSectionsDocument as typeof sectionsDocument);

  const result = await transaction.commit();

  console.log('\nMigration completed successfully!');
  console.log(`Transaction ID: ${result.transactionId}`);
  console.log(`Documents created/updated: ${result.documentIds.length}`);

  // Step 5: Verify the migration
  console.log('\n5. Verifying migration...');
  const [newHero, newSections] = await Promise.all([
    client.fetch(`*[_id == "homePageHero"][0]`),
    client.fetch(`*[_id == "homePageSections"][0]`),
  ]);

  if (newHero && newSections) {
    console.log('Verification successful! New documents exist:');
    console.log(`  - homePageHero: ${newHero._id}`);
    console.log(`  - homePageSections: ${newSections._id}`);
  } else {
    console.error('Verification failed! Some documents are missing.');
  }

  console.log('\n==============================================');
  console.log('IMPORTANT: The old homePage document still exists.');
  console.log('After verifying everything works correctly,');
  console.log('you can remove the old schema and document.');
  console.log('==============================================');
}

migrateHomePage().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
