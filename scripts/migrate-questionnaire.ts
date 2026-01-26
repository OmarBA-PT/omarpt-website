/**
 * Migration script: Populate the applyQuestionnaire document with data from applicationFormData.ts
 *
 * This script creates the questionnaire document in Sanity with all the questions
 * that were previously hardcoded in applicationFormData.ts.
 *
 * Usage:
 *   npx tsx scripts/migrate-questionnaire.ts
 *
 * Requirements:
 *   - SANITY_API_WRITE_TOKEN environment variable must be set in .env.local
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { applicationFormData, FormSection, FormQuestion, QuestionOption } from '../src/data/applicationFormData';
import crypto from 'crypto';

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

/**
 * Generate a Sanity-compatible key
 */
function generateKey(): string {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * Transform an option to Sanity format
 */
function transformOption(option: QuestionOption) {
  return {
    _type: 'questionOption',
    _key: generateKey(),
    label: option.label,
    value: option.value,
  };
}

/**
 * Transform a question to Sanity format
 */
function transformQuestion(question: FormQuestion, isSubQuestion: boolean = false) {
  const base: Record<string, unknown> = {
    _type: isSubQuestion ? 'subQuestion' : 'formQuestion',
    _key: generateKey(),
    id: question.id,
    question: question.question,
    type: question.type,
    required: question.required || false,
  };

  if (question.placeholder) {
    base.placeholder = question.placeholder;
  }

  if (question.helperText) {
    base.helperText = question.helperText;
  }

  if (question.options && question.options.length > 0) {
    base.options = question.options.map(transformOption);
  }

  if (question.conditionalOn) {
    base.conditionalOn = {
      questionId: question.conditionalOn.questionId,
      value: question.conditionalOn.value,
    };
  }

  // Only main questions can have subQuestions
  if (!isSubQuestion && question.subQuestions && question.subQuestions.length > 0) {
    base.subQuestions = question.subQuestions.map((sq) => transformQuestion(sq, true));
  }

  return base;
}

/**
 * Transform a question group to Sanity format
 */
function transformQuestionGroup(group: { id: string; title?: string; questions: FormQuestion[] }) {
  return {
    _type: 'questionGroup',
    _key: generateKey(),
    id: group.id,
    title: group.title || null,
    questions: group.questions.map((q) => transformQuestion(q)),
  };
}

/**
 * Transform a section to Sanity format
 */
function transformSection(section: FormSection) {
  return {
    _type: 'formSection',
    _key: generateKey(),
    id: section.id,
    title: section.title,
    description: section.description || null,
    questionGroups: section.questionGroups.map(transformQuestionGroup),
  };
}

async function migrateQuestionnaire() {
  console.log('Migrating questionnaire data to Sanity...');
  console.log(`Project: ${projectId}, Dataset: ${dataset}`);
  console.log(`Found ${applicationFormData.length} sections to migrate`);

  // Log summary of what we're migrating
  let totalQuestions = 0;
  let totalSubQuestions = 0;
  applicationFormData.forEach((section) => {
    section.questionGroups.forEach((group) => {
      totalQuestions += group.questions.length;
      group.questions.forEach((q) => {
        if (q.subQuestions) {
          totalSubQuestions += q.subQuestions.length;
        }
      });
    });
  });
  console.log(`Total questions: ${totalQuestions}`);
  console.log(`Total sub-questions: ${totalSubQuestions}`);
  console.log('');

  // Transform all sections
  const sections = applicationFormData.map(transformSection);

  // Create or replace the questionnaire document
  const result = await client.createOrReplace({
    _id: 'applyQuestionnaire',
    _type: 'applyQuestionnaire',
    sections,
  });

  console.log('✓ Questionnaire document created/updated successfully!');
  console.log(`Document ID: ${result._id}`);
  console.log('');
  console.log('Migrated sections:');
  applicationFormData.forEach((section, i) => {
    const groupCount = section.questionGroups.length;
    const questionCount = section.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);
    console.log(`  ${i + 1}. ${section.title} - ${groupCount} groups, ${questionCount} questions`);
  });
}

migrateQuestionnaire().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
