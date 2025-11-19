# Block Architecture

This document describes the simplified block rendering system that ensures consistency and ease of maintenance across the codebase.

## Overview

The block system consists of:
1. **Centralized Block Lists** - Single source of truth for all block types
2. **Shared Block Renderer** - Unified rendering logic for all standard content flows
3. **Layout-Specific Renderers** - Special handling for grid and column layouts

## Block Lists (`src/sanity/schemaTypes/shared/blockLists.ts`)

### STANDARD_BLOCK_LIST

The universal block list includes ALL content and layout blocks:

**Content Blocks:**
- `richText` - Rich text content with formatting
- `quote` - Styled quote blocks
- `divider` - Visual dividers
- `imageBlock` - Single images
- `imageGallery` - Image galleries
- `youTubeVideo` - Embedded YouTube videos
- `spotifyWidget` - Embedded Spotify players
- `bandcampWidget` - Embedded Bandcamp players
- `ctaButton` - Call-to-action buttons
- `ctaCalloutLink` - Callout-style CTA links
- `blockListWithStats` - Lists with statistics
- `checkList` - Checkbox lists
- `itemList` - Bullet point lists
- `contactForm` - Contact forms
- `companyLinksBlock` - Company/social links

**Layout Blocks:**
- `twoColumnLayout` - Two-column responsive layouts
- `gridLayout` - Multi-column grid layouts
- `card` - Card containers with various configurations

### PAGE_CONTENT_BLOCK_LIST

For main page content areas, includes:
- `pageSection` - Top-level sections (can contain SubSections)
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

### 2. Add to Centralized Block List

Update `src/sanity/schemaTypes/shared/blockLists.ts`:

```typescript
export const STANDARD_BLOCK_LIST = [
  // ... existing blocks
  defineArrayMember({ type: 'newBlock' }),
];
```

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
- TwoColumnLayout (left/right columns)
- Card (card content)
- GridLayout (delegates to blockRenderer for non-card items)

**Features:**
- Wraps blocks with Sanity live editing data attributes
- Handles alignment inheritance
- Passes through required props (documentId, siteSettings, etc.)
- TypeScript exhaustiveness checking (compile-time safety)

### Layout-Specific Rendering

#### GridLayout (`src/components/_blocks/GridLayout.tsx`)

- **Special handling**: Wraps items in divs with responsive column sizing classes
- **Card exception**: Cards receive `className` and `isGridChild` props
- **Other blocks**: Delegated to `blockRenderer` then wrapped in sizing div
- **Why separate**: Layout components need fine control over wrapper elements

#### TwoColumnLayout (`src/components/_blocks/TwoColumnLayout.tsx`)

- Uses `blockRenderer` directly for left/right column content
- No special wrapping needed

#### Card (`src/components/_blocks/Card.tsx`)

- Uses `blockRenderer` directly for card content
- Can render nested Cards (recursive)

## Component Responsibilities

### Where Blocks Can Appear

| Component         | Block List Used              | Special Behavior              |
|-------------------|------------------------------|------------------------------|
| PageBuilder       | PAGE_CONTENT_BLOCK_LIST      | Top-level page sections      |
| PageSection       | createSectionBlockList()     | Can contain SubSections      |
| SubSection        | createSectionBlockList()     | Can contain SubSubSections   |
| SubSubSection     | createSectionBlockList()     | No nested sections           |
| TwoColumnLayout   | STANDARD_BLOCK_LIST          | Left/right columns           |
| GridLayout        | STANDARD_BLOCK_LIST          | Responsive grid sizing       |
| Card              | STANDARD_BLOCK_LIST          | Card container               |

## Maintenance Guidelines

### DO ✅

- **Add new blocks to `STANDARD_BLOCK_LIST` in `blockLists.ts`** - This is the single source of truth
- **Use `blockRenderer` for standard content flow** - Consistency and maintainability
- **Add TypeScript exhaustiveness checks** - Compile-time safety for missing cases
- **Run `npm run typegen` after schema changes** - Keep types in sync
- **Run `npm run typecheck` before committing** - Catch type errors early

### DON'T ❌

- **Don't create separate block lists for each component** - Use centralized lists
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
