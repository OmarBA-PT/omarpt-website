# Blog Posts Population Script

This script populates your Sanity CMS with blog posts from the `blogPosts.json` file.

## Prerequisites

1. **Sanity API Token**: You need a Sanity API token with write permissions.
   - Go to https://sanity.io/manage
   - Select your project
   - Go to Settings → API → Tokens
   - Create a new token with "Editor" permissions
   - Copy the token

2. **Environment Variables**: Set up your environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=your_dataset_name
   SANITY_API_WRITE_TOKEN=your_write_token_here
   ```

## Running the Script

1. Make sure you're in the project root directory
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the population script:
   ```bash
   node scripts/blogPosts/populate-blogPosts.js
   ```

## What the Script Does

- ✅ Reads all blog posts from `blogPosts.json`
- ✅ Transforms them to match the Sanity blogPost schema
- ✅ Creates new blog post documents in your CMS with complex nested content
- ❌ **Omits hero image fields** (you'll need to upload/select images manually)
- ✅ Preserves all content structure including nested sections and sub-sections
- ✅ Includes various content blocks: rich text, quotes, widgets, CTAs, etc.
- ✅ Provides detailed logging and error handling
- ✅ Checks for existing blog posts to warn about duplicates

## Test Data Features

The generated blog posts include:

### **Content Variety**:
- 6 different record label-related topics
- Mix of electronic music production, marketing, and industry insights
- Nested section structure (PageSection → SubSection → SubSubSection)
- Various content blocks: rich text, quotes, item lists, CTAs, widgets

### **Field Variations** (as requested):
- **Blog Post #3**: No closing card (`hasClosingCard: false`)
- **Blog Posts #2 & #5**: No subtitle (`subtitle: null`)
- **Blog Posts #3 & #6**: No author (`author: null`)
- Mix of override dates and default timestamps
- Various closing card styles (feature/statement cards)

### **Content Blocks Used**:
- Rich text with formatted content
- Item lists with headings
- Quotes with attributions
- CTA buttons (various styles and alignments)
- CTA callout links
- CTA email buttons
- Spotify widgets
- Bandcamp widgets
- YouTube videos
- Dividers
- Nested sections up to 3 levels deep

### **External Links Included**:
- **Bandcamp**: `https://starcontrol1.bandcamp.com/album/mark-i`
- **Spotify**: `https://open.spotify.com/album/5TFo10agMIibzbwDz6xhaD?si=ixbM5DJjR5OC9kPcKcIysw`
- Various placeholder external URLs for demonstration

## After Running

1. Go to your Sanity Studio
2. Navigate to **Blog → Blog Posts** section
3. Review the imported content structure
4. Add hero images to blog posts that need them
5. Test the nested section navigation
6. Verify all widgets and CTAs work correctly
7. Publish the blog posts when ready

## Schema Alignment

The JSON schema perfectly matches the Sanity blogPost schema:
- All field names are identical
- All data types are compatible
- Complex nested content structures are preserved
- All validation rules are respected
- Closing card integration works seamlessly

## Error Handling

The script will:
- Continue processing even if individual blog posts fail
- Show detailed error messages for failed blog posts
- Provide a summary of successes and failures
- Not crash if there are network issues or validation errors

## Testing Content Structure

The blog posts are designed to test various aspects of the CMS:
- **Nested sections**: Proper heading hierarchy (h2 → h3 → h4)
- **Content blocks**: All available block types without image requirements
- **Widgets**: Spotify and Bandcamp embeds with real URLs
- **CTAs**: Different button styles and link types
- **Text alignment**: Various alignment options across sections
- **Optional fields**: Testing null/undefined handling