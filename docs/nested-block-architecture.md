# Nested Block Architecture Documentation

## Overview

This project implements a sophisticated nested block architecture that supports unlimited nesting of content blocks while maintaining strict organizational rules. The architecture is designed to be scalable, type-safe, and editor-friendly.

## Key Principles

### 1. Sections are Root-Level Only

- **Sections** can only be added at the page level
- **Sections** cannot be nested within other blocks
- **Sections** provide semantic HTML structure and consistent spacing
- **Sections** can have optional titles with gradient underlines
- This ensures proper page hierarchy and accessibility

### 2. Blocks Can Be Nested Infinitely

- **Blocks** (like Hero, Feature, SplitImage) can be nested within sections
- **Blocks** can also be nested within other blocks
- This allows for complex, flexible content structures
- Each block type defines which other blocks it can contain

### 4. Gradient Underline System

- **All headings** (h2-h6) automatically get gradient underlines
- **h1 headings** never get underlines (excluded by design)
- **Underline thickness** scales responsively with heading level
- **Developer control** available via `showUnderline` prop
- **Hero content** automatically has underlines disabled

### 5. Universal Rendering System

- The `BlockRenderer` component handles any block type at any nesting level
- New block types are automatically supported without changing the renderer
- Proper Sanity Live editing is maintained at all nesting levels

## Architecture Components

### Type System (`src/types/blocks.ts`)

Defines TypeScript interfaces for all block types:

```typescript
// Base interface all blocks must implement
export interface BaseBlock {
  _key: string;
  _type: string;
}

// Example block that can contain nested content
export interface HeroBlock extends BaseBlock {
  _type: 'hero';
  content?: NestedBlock[];  // Can contain other blocks
}

// Example block that doesn't contain nested content
export interface SplitImageBlock extends BaseBlock {
  _type: 'splitImage';
  // No content property - this block is a leaf node
}
```

### Universal Renderer (`src/components/PageBuilder.tsx`)

The `BlockRenderer` component:

- Handles any block type recursively
- Maintains proper Sanity Live editing paths
- Automatically renders nested content for blocks that support it
- Uses a simple switch statement that's easy to extend

### Schema Architecture

#### Page Builder Schema (`src/sanity/schemaTypes/pageBuilderType.ts`)

- Only accepts sections at the root level
- Enforces the "sections first" rule

#### Section Schema (`src/sanity/schemaTypes/sectionType.ts`)

- Accepts any block type except other sections
- Provides semantic HTML structure

#### Block Schemas (`src/sanity/schemaTypes/blocks/`)

Each block type defines:

- Its own fields and properties
- Which other blocks it can contain (if any)
- Preview configuration for the Sanity Studio

## Example Nesting Scenarios

### Simple Structure

```
Page
├── Section
    ├── Hero Block
    └── SplitImage Block
```

### Complex Nested Structure

```
Page
├── Section 1
│   ├── Hero Block
│   │   ├── Feature Block
│   │   │   └── SplitImage Block
│   │   └── Feature Block
│   └── SplitImage Block
└── Section 2
    └── Feature Block
        ├── Hero Block
        │   └── Feature Block
        └── SplitImage Block
```

## Adding New Block Types

### 1. Define the TypeScript Interface

Add to `src/types/blocks.ts`:

```typescript
export interface NewBlockType extends BaseBlock {
  _type: 'newBlock';
  content?: NestedBlock[];  // Include this if the block can contain other blocks
}

// Add to the union type
export type NestedBlock =
  | SectionBlock
  | SplitImageBlock
  | HeroBlock
  | FeatureBlock
  | NewBlockType;  // Add your new type here
```

### 2. Create the Sanity Schema

Create `src/sanity/schemaTypes/blocks/newBlockType.ts`:

```typescript
import { defineType, defineField } from 'sanity';

export const newBlockType = defineType({
  name: 'newBlock',
  title: 'New Block',
  type: 'object',
  fields: [
    // Your block's specific fields
    defineField({
      name: 'content',
      title: 'Nested Content',
      type: 'array',
      of: [
        { type: 'splitImage' },
        { type: 'hero' },
        { type: 'feature' },
        // Choose which blocks this block can contain
      ],
    }),
  ],
});
```

### 3. Add to Schema Index

Update `src/sanity/schemaTypes/index.ts`:

```typescript
import { newBlockType } from './blocks/newBlockType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // ...existing types
    newBlockType,
  ],
};
```

### 4. Create the React Component

Create `src/components/blocks/NewBlock.tsx`:

```typescript
import React from 'react';

const NewBlock = ({ children, ...props }: any) => {
  return (
    <div className="new-block">
      {/* Your block's JSX */}
      {children}  {/* This renders nested content */}
    </div>
  );
};

export default NewBlock;
```

### 5. Add to the Renderer

Update the switch statement in `src/components/PageBuilder.tsx`:

```typescript
case 'newBlock':
  return (
    <BlockWrapper key={block._key}>
      <NewBlock {...block}>
        {renderNestedContent(block.content)}
      </NewBlock>
    </BlockWrapper>
  );
```

### 6. Allow in Other Blocks

Update any block schemas that should be able to contain your new block:

```typescript
// In sectionType.ts, heroType.ts, etc.
of: [
  // ...existing blocks
  { type: 'newBlock' },
],
```

## Best Practices

### 1. Block Design

- Keep blocks focused on a single purpose
- Use consistent naming conventions
- Always include proper TypeScript types
- Add meaningful preview configurations

### 2. Nesting Strategy

- Consider the content hierarchy when designing which blocks can contain others
- Avoid circular dependencies (Block A contains Block B which contains Block A)
- Think about the editor experience - too many nesting options can be overwhelming

### 3. Performance

- The recursive rendering is efficient for reasonable nesting depths
- Consider pagination or lazy loading for blocks with many nested items
- Use React.memo for block components if needed

### 4. Accessibility

- Sections provide semantic `<section>` elements
- Ensure nested blocks maintain proper heading hierarchy
- Test with screen readers when adding complex nesting

## Sanity Studio Benefits

### Visual Block Management

- Blocks show preview images in the insert menu
- Nested content is clearly visualized in the Studio
- Live editing works at all nesting levels

### Content Organization

- Sections provide clear page structure
- Nested blocks allow for sophisticated layouts
- Reusable blocks can be composed in multiple ways

### Editor Experience

- Intuitive drag-and-drop for all nesting levels
- Clear hierarchy visualization
- Easy reordering and reorganization

## Technical Details

### Sanity Live Editing

- Each block gets proper `data-sanity` attributes
- Paths are calculated recursively (e.g., `content[_key="123"].content[_key="456"]`)
- Live editing works seamlessly at any nesting depth

### Type Safety

- Full TypeScript support throughout the architecture
- Compile-time checking for block compatibility
- IntelliSense support for all block properties

### Error Handling

- Graceful handling of unknown block types
- Null safety for optional nested content
- Clear error messages for missing components

This architecture provides a solid foundation for building complex, nested content structures while maintaining clean, maintainable code.
