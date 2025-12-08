/**
 * Script to convert legal documents from first person plural to first person singular
 */

const fs = require('fs');
const path = require('path');

// Replacement patterns - order matters!
const replacements = [
  // Start with most specific patterns first to avoid partial replacements

  // "We are" -> "I am"
  { pattern: /\bWe are\b/g, replacement: 'I am' },
  { pattern: /\bwe are\b/g, replacement: 'I am' },

  // "We have" -> "I have"
  { pattern: /\bWe have\b/g, replacement: 'I have' },
  { pattern: /\bwe have\b/g, replacement: 'I have' },

  // "We will" -> "I will"
  { pattern: /\bWe will\b/g, replacement: 'I will' },
  { pattern: /\bwe will\b/g, replacement: 'I will' },

  // "We may" -> "I may"
  { pattern: /\bWe may\b/g, replacement: 'I may' },
  { pattern: /\bwe may\b/g, replacement: 'I may' },

  // "We do not" -> "I do not"
  { pattern: /\bWe do not\b/g, replacement: 'I do not' },
  { pattern: /\bwe do not\b/g, replacement: 'I do not' },

  // "We don't" -> "I don't"
  { pattern: /\bWe don't\b/g, replacement: "I don't" },
  { pattern: /\bwe don't\b/g, replacement: "I don't" },

  // "We can" -> "I can"
  { pattern: /\bWe can\b/g, replacement: 'I can' },
  { pattern: /\bwe can\b/g, replacement: 'I can' },

  // "We must" -> "I must"
  { pattern: /\bWe must\b/g, replacement: 'I must' },
  { pattern: /\bwe must\b/g, replacement: 'I must' },

  // "We want" -> "I want"
  { pattern: /\bWe want\b/g, replacement: 'I want' },
  { pattern: /\bwe want\b/g, replacement: 'I want' },

  // "We use" -> "I use"
  { pattern: /\bWe use\b/g, replacement: 'I use' },
  { pattern: /\bwe use\b/g, replacement: 'I use' },

  // "We collect" -> "I collect"
  { pattern: /\bWe collect\b/g, replacement: 'I collect' },
  { pattern: /\bwe collect\b/g, replacement: 'I collect' },

  // "We store" -> "I store"
  { pattern: /\bWe store\b/g, replacement: 'I store' },
  { pattern: /\bwe store\b/g, replacement: 'I store' },

  // "We take" -> "I take"
  { pattern: /\bWe take\b/g, replacement: 'I take' },
  { pattern: /\bwe take\b/g, replacement: 'I take' },

  // "We understand" -> "I understand"
  { pattern: /\bWe understand\b/g, replacement: 'I understand' },
  { pattern: /\bwe understand\b/g, replacement: 'I understand' },

  // "We reserve" -> "I reserve"
  { pattern: /\bWe reserve\b/g, replacement: 'I reserve' },
  { pattern: /\bwe reserve\b/g, replacement: 'I reserve' },

  // "We accept" -> "I accept"
  { pattern: /\bWe accept\b/g, replacement: 'I accept' },
  { pattern: /\bwe accept\b/g, replacement: 'I accept' },

  // Generic "We" at start of sentence -> "I"
  { pattern: /\bWe\b/g, replacement: 'I' },
  { pattern: /\bwe\b/g, replacement: 'I' },

  // Possessive "our" -> "my"
  { pattern: /\bOur\b/g, replacement: 'My' },
  { pattern: /\bour\b/g, replacement: 'my' },

  // Objective "us" -> "me" (but be careful with "contact us", "let us")
  { pattern: /\bcontact us\b/g, replacement: 'contact me' },
  { pattern: /\bContact us\b/g, replacement: 'Contact me' },
  { pattern: /\bwith us\b/g, replacement: 'with me' },
  { pattern: /\bto us\b/g, replacement: 'to me' },
  { pattern: /\bfrom us\b/g, replacement: 'from me' },
  { pattern: /\babout us\b/g, replacement: 'about me' },
];

function convertFile(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;

  replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(pattern, replacement);
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`✅ Made ${changeCount} replacements`);
  return changeCount;
}

// Process both files
const ppPath = path.join(__dirname, 'create-and-populate-pp.js');
const tcsPath = path.join(__dirname, 'create-and-populate-tcs.js');

console.log('🔄 Converting legal documents from plural to singular first person...');

const ppChanges = convertFile(ppPath);
const tcsChanges = convertFile(tcsPath);

console.log(`\n📊 Total replacements: ${ppChanges + tcsChanges}`);
console.log('✨ Conversion complete!');
