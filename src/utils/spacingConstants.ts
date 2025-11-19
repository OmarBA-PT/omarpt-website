// AI Helper: This file contains all spacing constants used across the website for consistent spacing management.
// All spacing values are defined as Tailwind CSS classes with mobile-first responsive design.
// These constants should be imported and used instead of hardcoded spacing classes.

/**
 * Space under breadcrumb navigation before page content
 */
export const breadcrumbBottomSpacing = 'mb-8 md:mb-14';

/**
 * Space under home hero section before the next content
 */
export const homeHeroBottomSpacing = 'mb-14 md:mb-24';

/**
 * Space under page subtitles (non-blog pages)
 */
export const pageSubtitleBottomSpacing = 'mb-6 md:mb-8';

/**
 * Space above PageSections that come after orphaned content blocks
 */
export const pageSectionTopSpacing = 'mt-24';

/**
 * Space under blog header sections (title, subtitle, author, date, horizontal line group)
 */
export const blogHeaderBottomSpacing = 'mb-10 md:mb-14';

/**
 * Space after PageSection titles and subtitles
 */
export const sectionTitleBottomSpacing = 'mb-6';

/**
 * Space after PageSection dividers
 */
export const sectionDividerBottomSpacing = 'mb-6 md:mb-8';

/**
 * Bottom padding for PageSections (after the last piece of content in that section)
 */
export const sectionBottomPadding = 'pb-24 md:pb-36';

/**
 * Compact bottom padding for PageSections when useCompactGap is enabled
 * Provides smaller spacing between sections for better visual flow
 */
export const sectionCompactBottomPadding = 'pb-12 md:pb-16';

/**
 * Space after most content blocks (with exceptions defined in implementation)
 */
export const contentBlockBottomSpacing = 'mb-6 md:mb-8';

/**
 * Space above SubSection/SubSubSection when they have a sibling before them
 */
export const subSectionTopSpacing = 'mt-10 md:mt-14';

/**
 * Space after SubSection and SubSubSection titles
 */
export const subSectionTitleBottomSpacing = 'mb-4 md:mb-6';

/**
 * Space above and below closing cards on all pages
 */
export const closingCardSpacing = 'mt-16 md:mt-24';

/**
 * Max width for card like components (e.g. Cards, CTA Blog Posts etc)
 */
export const maxCardWidth = 'max-w-[650px]';

/**
 * Header height (must match Header.tsx and VerticalNav.tsx)
 * Mobile: 72px (18 * 4), Desktop: 80px (20 * 4)
 */
export const headerHeight = 'h-18 md:h-20';

/**
 * Header height in CSS calc format for use in max-height calculations
 * Uses small viewport height (svh) units to account for mobile browser UI
 */
export const headerHeightCalc = 'calc(80svh - 5rem)'; // 80svh minus 80px (desktop header)
export const maxHeightViewport = {
  // Max height of 80svh - 5rem (header height)
  maxHeight: 'calc(80svh - 5rem)',
  maxWidth: 'calc(80svh - 5rem)',
};

/**
 *  * Scroll margin top for anchor links to account for fixed header
 */
export const anchorLinkScrollMarginTop = 'scroll-mt-8 md:scroll-mt-12';
