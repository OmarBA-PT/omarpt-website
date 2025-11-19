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