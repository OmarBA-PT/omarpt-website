# Block Architecture

This document describes the simplified block rendering system that ensures consistency and ease of maintenance across the codebase.

## Overview

The block system consists of:
1. **Centralized Block Lists** - Single source of truth for all block types
2. **Shared Block Renderer** - Unified rendering logic for all standard content flows
3. **Layout-Specific Renderers** - Special handling for grid and column layouts

## Block Lists (`src/sanity/schemaTypes/shared/blockLists.ts`)

### CRITICAL: Nesting Restrictions

**To prevent GROQ query depth issues and infinite recursion, we enforce strict nesting rules:**

- **Top-level content**: Can contain all layout blocks and content blocks
- **Layout blocks**: Can contain cards and content blocks, but NOT nested layout blocks
- **Cards**: Can contain content blocks only - NO layouts or nested cards

**This ensures all internal link references are properly dereferenced in GROQ queries without hitting recursion limits.**

### CONTENT_ONLY_BLOCKS

Pure content blocks without any layout components. These can be safely nested at any depth without causing GROQ issues. Used inside cards and other deeply nested contexts.

**Includes:**
- All non-layout blocks (richText, images, videos, widgets, CTAs, lists, forms, etc.)
- **See** `src/sanity/schemaTypes/shared/blockLists.ts` for the complete current list

### LAYOUT_CHILD_BLOCKS

Blocks allowed inside layout components (grid/twoColumn). Allows cards but NOT nested layout blocks to prevent deep nesting.

**Includes:**
- All blocks from `CONTENT_ONLY_BLOCKS`
- Card containers (but cards themselves can only contain `CONTENT_ONLY_BLOCKS`)

### STANDARD_BLOCK_LIST

The universal block list for top-level content. Includes ALL content and layout blocks.

**Includes:**
- All blocks from `CONTENT_ONLY_BLOCKS`
- All layout blocks (defined in `blockLists.ts`)

### PAGE_CONTENT_BLOCK_LIST

For main page content areas.

**Includes:**
- Top-level sections (pageSection)
- All blocks from `STANDARD_BLOCK_LIST`

### Section Nesting Rules

Sections enforce hierarchical nesting:
- **PageSection** (h2) → can contain SubSections + standard blocks
- **SubSection** (h3) → can contain SubSubSections + standard blocks
- **SubSubSection** (h4) → can contain standard blocks only (no nested sections)

Created via `createSectionBlockList(allowedChildSections)` function.

## Adding New Block Types

When creating a new block type:

### 1. Create the Schema (`src/sanity/schemaTypes/blocks/`)

```typescript
import { defineType, defineField } from 'sanity';
import { YourIcon } from '@sanity/icons';

export const newBlockType = defineType({
  name: 'newBlock',
  title: 'New Block',
  type: 'object',
  icon: YourIcon,
  fields: [
    // Your fields here
  ],
  preview: {
    // Preview configuration
  }
});
```

### 2. Add to Appropriate Block List

Update `src/sanity/schemaTypes/shared/blockLists.ts`:

**For content blocks (most common)** - Add to `CONTENT_ONLY_BLOCKS`:

```typescript
export const CONTENT_ONLY_BLOCKS = [
  // ... existing blocks
  defineArrayMember({ type: 'newBlock' }),
];
```

**For layout blocks** - Add to `STANDARD_BLOCK_LIST` directly (after CONTENT_ONLY_BLOCKS spread):

```typescript
export const STANDARD_BLOCK_LIST = [
  ...CONTENT_ONLY_BLOCKS,
  // Layout Blocks - only allowed at top level
  defineArrayMember({ type: 'existingLayoutBlock1' }),
  defineArrayMember({ type: 'existingLayoutBlock2' }),
  defineArrayMember({ type: 'newLayoutBlock' }), // Add new layout blocks here
];
```

**IMPORTANT**: Adding to `CONTENT_ONLY_BLOCKS` automatically makes it available in:
- `LAYOUT_CHILD_BLOCKS` (inside layout blocks)
- `STANDARD_BLOCK_LIST` (top-level content)
- `PAGE_CONTENT_BLOCK_LIST` (page content)

This maintains DRY principles - content blocks only need to be added once!

### 3. Register Schema

Add to `src/sanity/schemaTypes/index.ts`:

```typescript
import { newBlockType } from './blocks/newBlockType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // ... existing types
    newBlockType,
  ],
};
```

### 4. Regenerate Types

```bash
npm run typegen
```

### 5. Create Component (`src/components/_blocks/`)

```typescript
import React from 'react';
import type { NewBlock as NewBlockType } from '@/sanity/types';

interface NewBlockProps extends NewBlockType {
  documentId?: string;
  documentType?: string;
  pathPrefix?: string;
  // Other props as needed
}

const NewBlock = ({ ...props }: NewBlockProps) => {
  // Component implementation
  return <div>...</div>;
};

export default NewBlock;
```

### 6. Add to Block Renderer

Update `src/utils/blockRenderer.tsx`:

```typescript
// 1. Import type
import type { NewBlock as NewBlockType } from '@/sanity/types';

// 2. Import component
import NewBlockComponent from '@/components/_blocks/NewBlock';

// 3. Add to BlockType union
type BlockType =
  | WithKey<RichTextType>
  // ... existing types
  | WithKey<NewBlockType>;

// 4. Add switch case
case 'newBlock': {
  const newBlock = typedBlock as WithKey<NewBlockType>;
  return (
    <BlockWrapper key={newBlock._key}>
      <NewBlockComponent
        {...newBlock}
        documentId={documentId}
        documentType={documentType}
        pathPrefix={blockPath}
        // Pass other required props
      />
    </BlockWrapper>
  );
}
```

### 7. Add Type Definitions

Update `src/types/blocks.ts`:

```typescript
// Import
import type { NewBlock } from '@/sanity/types';

// Type definition
export type NewBlockType = NewBlock & { _key: string };

// Add to NestedBlock union
export type NestedBlock =
  | PageSectionBlock
  // ... existing types
  | NewBlockType;

// Type guard
export const isNewBlock = (block: NestedBlock): block is NewBlockType => {
  return block._type === 'newBlock';
};
```

### 8. Run Typecheck

```bash
npm run typecheck
```

**That's it!** The new block will now:
- ✅ Appear in ALL block lists automatically (PageBuilder, Cards, TwoColumnLayout, GridLayout)
- ✅ Be rendered consistently across all contexts
- ✅ Support Sanity live editing
- ✅ Be type-safe

## Block Rendering Architecture

### Standard Content Flow (blockRenderer.tsx)

Used by:
- PageBuilder (main page content)
- Layout blocks (column/container content)
- Card blocks (card content)

**Features:**
- Wraps blocks with Sanity live editing data attributes
- Handles alignment inheritance
- Passes through required props (documentId, siteSettings, etc.)
- TypeScript exhaustiveness checking (compile-time safety)

### Layout-Specific Rendering

Some layout blocks may need special handling beyond the standard `blockRenderer`:

- **Grid layouts**: May wrap items in divs with responsive sizing classes
- **Column layouts**: May use `blockRenderer` directly without special wrapping
- **Card blocks**: Use `blockRenderer` for nested content

Each layout component determines how it renders its children while delegating actual block rendering to `blockRenderer` for consistency.

## Component Responsibilities

### Where Blocks Can Appear

| Component Type    | Block List Used              | Special Behavior                           |
|-------------------|------------------------------|--------------------------------------------|
| PageBuilder       | PAGE_CONTENT_BLOCK_LIST      | Top-level page sections                    |
| Sections (h2-h4)  | createSectionBlockList()     | Hierarchical nesting (h2→h3→h4)            |
| Layout Blocks     | LAYOUT_CHILD_BLOCKS          | Cards + content, NO nested layouts         |
| Card Blocks       | CONTENT_ONLY_BLOCKS          | Content only, NO cards or layouts          |

## Why Nesting Restrictions Matter

### The GROQ Recursion Problem

Without nesting restrictions, you could create infinitely deep structures:

```
Layout → Card → Layout → Card → Layout → Card → ...
```

**Problems this causes:**

1. **GROQ queries can't handle infinite recursion** - They need explicit depth limits
2. **Internal link dereferencing breaks** - CTAs deep in the structure won't get their references populated
3. **Performance issues** - Deeply nested queries are slow and resource-intensive
4. **Unpredictable behavior** - Some content appears, some doesn't, depending on depth

### How Our Solution Works

**Schema enforcement** prevents invalid nesting at the CMS level:
- Cards use `CONTENT_ONLY_BLOCKS` → Can't add nested cards or layouts
- Layouts use `LAYOUT_CHILD_BLOCKS` → Can't add nested layouts

**GROQ queries match the schema** with explicit projections:
- `cardContentProjection` → Handles CTAs and content inside cards
- `contentProjection` → Handles layouts with cards, but cards are final nesting level
- No recursive loops, all internal links are properly dereferenced

**Maximum safe depth:**
- **Level 1**: Top-level → Layout blocks
- **Level 2**: Layout blocks → Cards
- **Level 3**: Cards → CTAs with internal links ✅ (Properly dereferenced!)

This controlled depth ensures **ALL internal link references work correctly** without hitting GROQ limits.

## Maintenance Guidelines

### DO ✅

- **Add new content blocks to `CONTENT_ONLY_BLOCKS`** - They'll automatically appear everywhere safely
- **Add new layout blocks to `STANDARD_BLOCK_LIST`** - But update GROQ queries if they contain CTAs
- **Use `blockRenderer` for standard content flow** - Consistency and maintainability
- **Add TypeScript exhaustiveness checks** - Compile-time safety for missing cases
- **Run `npm run typegen` after schema changes** - Keep types in sync
- **Run `npm run typecheck` before committing** - Catch type errors early
- **Respect nesting restrictions** - Don't try to circumvent the block list system

### DON'T ❌

- **Don't allow cards in `CONTENT_ONLY_BLOCKS`** - Breaks nesting restrictions
- **Don't allow layouts in `LAYOUT_CHILD_BLOCKS`** - Breaks nesting restrictions
- **Don't add deeply nested layout blocks to GROQ queries** - Causes infinite recursion
- **Don't duplicate rendering logic** - Use shared `blockRenderer`
- **Don't hardcode block type lists** - They'll get out of sync
- **Don't forget to add blocks to `blockRenderer.tsx`** - Blocks won't render
- **Don't use `any` type** - ESLint will catch this

## Troubleshooting

### Block doesn't appear in Sanity Studio
- ✅ Check block is in `STANDARD_BLOCK_LIST` or `PAGE_CONTENT_BLOCK_LIST`
- ✅ Check schema is exported in `index.ts`
- ✅ Restart Sanity Studio dev server

### Block doesn't render on frontend
- ✅ Check block has switch case in `blockRenderer.tsx`
- ✅ Check component is imported in `blockRenderer.tsx`
- ✅ Check block is in `BlockType` union in `blockRenderer.tsx`
- ✅ Run `npm run typecheck` to find missing cases

### TypeScript errors after adding block
- ✅ Run `npm run typegen` to regenerate Sanity types
- ✅ Add block type to `BlockType` union in `blockRenderer.tsx`
- ✅ Add block type to `NestedBlock` union in `types/blocks.ts`
- ✅ Check exhaustiveness check in `blockRenderer.tsx` default case

### Block appears in wrong places
- ✅ Check which block list it's added to (`STANDARD_BLOCK_LIST` = everywhere)
- ✅ For sections only: Use `createSectionBlockList()` with appropriate nesting
- ✅ For page-level only: Add to `PAGE_CONTENT_BLOCK_LIST` but not `STANDARD_BLOCK_LIST`

## Benefits of This Architecture

1. **Single Source of Truth** - One place to add/remove blocks
2. **Automatic Propagation** - New blocks appear everywhere automatically
3. **Type Safety** - Compile-time checking prevents missing implementations
4. **Consistency** - All blocks render the same way across contexts
5. **Maintainability** - Changes in one place update entire system
6. **Developer Experience** - Clear patterns for adding new blocks
7. **Reduced Duplication** - Shared rendering logic

## Migration Notes

This architecture was implemented to solve:
- **Duplication**: Block lists repeated in 6+ files
- **Inconsistency**: Different components allowed different blocks for no clear reason
- **Maintenance burden**: Adding a block required updating 5-6 files manually
- **Error-prone**: Easy to forget updating a file, causing inconsistent behavior

The new system reduces this to 2-3 file updates with compile-time safety checks.
