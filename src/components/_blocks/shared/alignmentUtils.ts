import { stegaClean } from 'next-sanity';

export const deriveAlignmentClasses = (alignment: 'left' | 'center' | 'right' | undefined) => {
  switch (alignment) {
    case 'left':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    default:
      return '';
  }
};

export const resolveAlignment = (
  alignment: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
): 'left' | 'center' | 'right' | undefined => {
  const cleanAlignment = stegaClean(alignment);
  return cleanAlignment === 'inherit' ? inheritAlignment : cleanAlignment as 'left' | 'center' | 'right' | undefined;
};

export const getAlignmentClasses = (
  alignment: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
) => {
  const resolvedAlignment = resolveAlignment(alignment, inheritAlignment);
  return deriveAlignmentClasses(resolvedAlignment);
};

/**
 * Resolves responsive alignment based on mode
 * Returns both desktop and mobile alignments
 */
export const resolveResponsiveAlignment = (
  alignmentMode: string | undefined,
  desktopAlignment: string | undefined,
  mobileAlignment: string | undefined,
  legacyTextAlign: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
): {
  desktop: 'left' | 'center' | 'right';
  mobile: 'left' | 'center' | 'right';
} => {
  const cleanMode = stegaClean(alignmentMode);
  const cleanDesktop = stegaClean(desktopAlignment);
  const cleanMobile = stegaClean(mobileAlignment);
  const cleanLegacy = stegaClean(legacyTextAlign);

  // Handle legacy textAlign field for backwards compatibility
  if (!cleanMode && cleanLegacy) {
    const resolved = cleanLegacy === 'inherit' ? inheritAlignment : cleanLegacy as 'left' | 'center' | 'right' | undefined;
    const finalAlignment = resolved || 'center';
    return {
      desktop: finalAlignment,
      mobile: finalAlignment,
    };
  }

  // If mode is inherit, use inheritAlignment for both
  if (cleanMode === 'inherit' || !cleanMode) {
    const finalAlignment = inheritAlignment || 'center';
    return {
      desktop: finalAlignment,
      mobile: finalAlignment,
    };
  }

  // If mode is override, use the specified alignments
  return {
    desktop: (cleanDesktop as 'left' | 'center' | 'right') || 'center',
    mobile: (cleanMobile as 'left' | 'center' | 'right') || 'center',
  };
};