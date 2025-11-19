import { createDataAttribute } from 'next-sanity';

export type TextAlignment = 'left' | 'center' | 'right';
export type TextAlignmentWithInherit = 'inherit' | TextAlignment;

export interface SanityLiveEditingProps {
  documentId?: string;
  documentType?: string;
  titlePath?: string;
  subtitlePath?: string;
}

/**
 * Creates a data attribute object for Sanity live editing
 */
export const createSanityDataAttribute = (
  documentId?: string,
  documentType?: string,
  path?: string
): Record<string, string> => {
  if (!documentId || !documentType || !path) return {};

  try {
    return {
      'data-sanity': createDataAttribute({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
        baseUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '',
        id: documentId,
        type: documentType,
        path: path,
      }).toString(),
    };
  } catch {
    return {};
  }
};

/**
 * Converts text alignment value to corresponding Tailwind CSS class
 */
export const getTextAlignClass = (align: TextAlignment): string => {
  switch (align) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
};

