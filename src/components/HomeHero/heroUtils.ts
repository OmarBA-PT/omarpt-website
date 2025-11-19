import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_QUERYResult } from '@/sanity/types';

export const getTextColorClasses = (heroTextColor: NonNullable<HOME_PAGE_QUERYResult>['heroTextColor']) => {
  const textColor = stegaClean(heroTextColor) || 'black';
  return textColor === 'white' ? 'text-white' : 'text-black';
};