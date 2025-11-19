# Sanity Live Editing Implementation Guide

This guide ensures consistent implementation of Sanity Live editing for all CMS fields displayed on the frontend.

## Overview

When adding new CMS fields that are displayed on the frontend, always implement live editing support so content updates appear instantly in Sanity Studio's presentation view without page refreshes.

## Standard Implementation Pattern

### 1. Component Level Implementation

For any component that displays CMS content:

```tsx
import { createDataAttribute } from '@/sanity/lib/live'

interface ComponentProps {
  // Your existing props
  title?: string;
  description?: string;
  // Live editing props
  documentId?: string;
  documentType?: string;
  titlePath?: string;
  descriptionPath?: string;
}

const YourComponent = ({
  title,
  description,
  documentId,
  documentType,
  titlePath,
  descriptionPath
}: ComponentProps) => {
  const getTitleDataAttribute = () => {
    if (!documentId || !documentType || !titlePath) return {};
    return createDataAttribute({
      id: documentId,
      type: documentType,
      path: titlePath,
    }).data;
  };

  const getDescriptionDataAttribute = () => {
    if (!documentId || !documentType || !descriptionPath) return {};
    return createDataAttribute({
      id: documentId,
      type: documentType,
      path: descriptionPath,
    }).data;
  };

  return (
    <div>
      {title && (
        <h2 {...getTitleDataAttribute()}>
          {title}
        </h2>
      )}
      {description && (
        <p {...getDescriptionDataAttribute()}>
          {description}
        </p>
      )}
    </div>
  );
};
```

### 2. Parent Component Integration

In the parent component (like PageBuilder), pass the live editing props:

```tsx
<YourComponent
  title={block.title}
  description={block.description}
  documentId={documentId}
  documentType={documentType}
  titlePath={`${blockPath}.title`}
  descriptionPath={`${blockPath}.description`}
/>
```

## Field Path Construction Rules

### Basic Fields

- Simple field: `fieldName`
- Nested in block: `${blockPath}.fieldName`

### Array Fields

- Array item: `${blockPath}[${index}].fieldName`
- Nested array: `${blockPath}.arrayName[${index}].fieldName`

### Object Fields

- Object property: `${blockPath}.objectName.fieldName`
- Nested object: `${blockPath}.parentObject.childObject.fieldName`

### Portable Text

- Rich text content: `${blockPath}.content`
- Rich text in object: `${blockPath}.objectName.content`

## Common Field Types to Implement

### Text Fields

- `title` - Page/block titles
- `subtitle` - Secondary headings
- `description` - Descriptive text
- `caption` - Image captions
- `label` - Button/link labels

### Rich Text Fields

- `content` - Main content blocks
- `excerpt` - Short descriptions
- `bio` - Author biographies

### Image Fields

- `alt` - Alternative text
- `caption` - Image captions
- `credit` - Image credits

### Array Fields

- List items in features/FAQs
- Gallery images
- Navigation links
- Category tags

## Implementation Checklist

When adding new CMS fields:

- [ ] Import `createDataAttribute` from `@/sanity/lib/live`
- [ ] Add live editing props to component interface
- [ ] Create data attribute helper functions for each field
- [ ] Apply data attributes to editable elements
- [ ] Pass props from parent component with correct field paths
- [ ] Test in Sanity Studio presentation view
- [ ] Verify real-time updates work without page refresh

## Examples by Component Type

### Block Components (Hero, Features, etc.)

```tsx
// In PageBuilder.tsx
case 'hero':
  return (
    <Hero
      title={block.title}
      subtitle={block.subtitle}
      documentId={documentId}
      documentType={documentType}
      titlePath={`${blockPath}.title`}
      subtitlePath={`${blockPath}.subtitle`}
    />
  );
```

### Content Components (Post, Page, etc.)

```tsx
// In page.tsx
<Post
  title={post.title}
  content={post.content}
  documentId={post._id}
  documentType="post"
  titlePath="title"
  contentPath="content"
/>
```

### Nested Components (Author, Category, etc.)

```tsx
// In parent component
<Author
  name={post.author.name}
  bio={post.author.bio}
  documentId={post._id}
  documentType="post"
  namePath="author.name"
  bioPath="author.bio"
/>
```

## Best Practices

1. **Always include live editing props** when creating new components that display CMS content
2. **Use descriptive prop names** that match the field name (e.g., `titlePath`, `descriptionPath`)
3. **Check for required props** before creating data attributes to avoid errors
4. **Test in presentation view** after implementation to ensure live updates work
5. **Follow TypeScript patterns** with proper interfaces for live editing props
6. **Use consistent helper function names** (e.g., `getTitleDataAttribute`)

## Troubleshooting

### Live editing not working?

1. Check that data attributes are applied to the correct elements
2. Verify field paths match the Sanity schema structure
3. Ensure `documentId` and `documentType` are passed correctly
4. Check browser console for any Sanity Live errors

### Field path not updating?

1. Verify the path construction matches the schema structure exactly
2. Check for typos in field names
3. Ensure array indices are correct for array fields
4. Test with simpler field paths first

---

_This guide should be updated whenever new patterns or edge cases are discovered during development._
