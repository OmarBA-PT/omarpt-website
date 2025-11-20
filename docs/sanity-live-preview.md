# Sanity Live Preview and Stega Encoding

## Overview

Sanity's live preview/Presentation mode uses **stega encoding** - invisible Unicode characters embedded in string values to enable click-to-edit functionality. These invisible characters cause string equality comparisons to fail if not handled properly.

> **Note:** This guide focuses on handling stega-encoded strings in your code logic. For implementing live editing data attributes, see [sanity-live-editing-guide.md](./sanity-live-editing-guide.md).

## The Problem

When using Sanity's live preview/Presentation mode, string values contain invisible Unicode characters:

```typescript
// In draft/preview mode, these appear identical but are NOT equal:
"primary" === "primary​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​..."  // false ❌
```

### Symptoms

- Data appears in production but disappears in Presentation mode
- Filtering/comparison logic works outside draft mode but fails in draft mode
- Console logs show strange invisible characters in string values
- Category filtering, conditionals, or switch statements fail inconsistently

## The Solution

**Always use `stegaClean()` from `next-sanity` when comparing string values from Sanity.**

```typescript
import { stegaClean } from 'next-sanity';

// ❌ WRONG - Will fail in Presentation mode
const filtered = items.filter(item => item.category === selectedCategory);

// ✅ CORRECT - Works in both production and Presentation mode
const filtered = items.filter(item =>
  stegaClean(item.category) === stegaClean(selectedCategory)
);
```

## When to Use stegaClean

Use `stegaClean()` for:

- **String equality comparisons** (`===`, `==`)
- **Array includes/indexOf** operations with string values
- **Switch statements** on string values from Sanity
- **Object key lookups** using strings from Sanity
- **Any string matching logic** that compares Sanity data

### Example: Category Filtering

```typescript
import { stegaClean } from 'next-sanity';

const TeamMemberList = ({ members, selectedCategory }) => {
  const filtered = members.filter(member => {
    if (!selectedCategory) return true;
    return stegaClean(member.category) === stegaClean(selectedCategory);
  });

  return <div>{/* render filtered members */}</div>;
};
```

### Example: Switch Statement

```typescript
import { stegaClean } from 'next-sanity';

const renderBlock = (block) => {
  switch (stegaClean(block._type)) {
    case 'richText':
      return <RichText {...block} />;
    case 'imageBlock':
      return <ImageBlock {...block} />;
    default:
      return null;
  }
};
```

### Example: Conditional Rendering

```typescript
import { stegaClean } from 'next-sanity';

const Card = ({ visualStyle, children }) => {
  const isDark = stegaClean(visualStyle) === 'dark';

  return (
    <div className={isDark ? 'bg-dark text-light' : 'bg-light text-dark'}>
      {children}
    </div>
  );
};
```

## When NOT to Use stegaClean

You don't need `stegaClean()` for:

- **Display purposes** - The invisible characters don't appear in the UI
- **Numeric comparisons** - Numbers aren't affected by stega encoding
- **Boolean comparisons** - Booleans aren't affected
- **Null/undefined checks** - These work normally
- **Passing strings as props** - Only clean at the point of comparison

## Reference Implementation

See [TeamMemberList.tsx:28](../src/components/TeamMember/TeamMemberList.tsx#L28) for a working example of category filtering with `stegaClean()`.

## Common Mistakes

### ❌ Cleaning Too Early

```typescript
// Don't clean immediately after receiving data
const cleanedData = data.map(item => ({
  ...item,
  category: stegaClean(item.category) // ❌ Breaks live editing
}));
```

### ❌ Not Cleaning Both Sides

```typescript
// Clean BOTH values being compared
stegaClean(item.category) === selectedCategory // ❌ Still fails
stegaClean(item.category) === stegaClean(selectedCategory) // ✅ Works
```

### ✅ Clean at Point of Comparison

```typescript
// Keep original values, clean only when comparing
const filtered = items.filter(item =>
  stegaClean(item.category) === stegaClean(selectedCategory)
);
```

## Why This Matters

**This is a common source of bugs when developing components that filter or compare Sanity data.**

Without proper handling:
- Features work in production but break in Sanity Studio
- Developers spend hours debugging "invisible" characters
- Content editors have a poor preview experience
- Data validation and filtering becomes unreliable

**Always consider stega encoding when implementing string-based logic with Sanity data.**

## Related Documentation

- [Sanity Stega Documentation](https://www.sanity.io/docs/stega)
- [Next-Sanity Live Preview](https://github.com/sanity-io/next-sanity#live-preview)
