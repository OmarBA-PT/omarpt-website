import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_QUERYResult } from '@/sanity/types';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import { SITE_CONFIG } from '@/lib/constants';

interface HeroLogoProps {
  heroLogoDisplay: NonNullable<HOME_PAGE_QUERYResult>['heroLogoDisplay'];
  heroTextColor: NonNullable<HOME_PAGE_QUERYResult>['heroTextColor'];
  documentId: string;
  documentType: string;
}

const HeroLogo = ({ heroLogoDisplay, heroTextColor, documentId, documentType }: HeroLogoProps) => {
  const cleanLogoDisplay = stegaClean(heroLogoDisplay) || 'with-text';

  // Don't render anything if 'none' is selected
  if (cleanLogoDisplay === 'none') return null;

  // Enhanced responsive logo sizing with better mobile scaling
  const logoSize = 'w-[90%] max-w-70n md:max-w-none md:w-110px';

  // Determine logo source based on logo display type and text color
  const getLogoSrc = () => {
    const textColor = stegaClean(heroTextColor);

    if (cleanLogoDisplay === 'logo-only') {
      // Logo only version - currently same file for both colors
      // Future: Could be '/images/logos/logo-only-white.png' or '/images/logos/logo-only-black.png'
      return '/images/logos/logo-only.png';
    }

    // Logo with text version
    return textColor === 'white' ? '/images/logos/logo-white.png' : '/images/logos/logo-black.png';
  };

  const logoSrc = getLogoSrc();

  return (
    <div
      className='flex justify-center items-center relative'
      {...createSanityDataAttribute(documentId, documentType, 'heroLogoDisplay')}>
      <UnifiedImage
        src={logoSrc}
        alt={`${SITE_CONFIG.ORGANIZATION_NAME} Logo`}
        mode='sized'
        width={500}
        height={500}
        sizeContext='hero'
        objectFit='contain'
        className={`${logoSize} h-auto object-contain relative z-10 drop-shadow-lg drop-shadow-black/40`}
        priority
        sizes='(max-width: 768px) 320px, (max-width: 1024px) 384px, 512px'
      />
    </div>
  );
};

export default HeroLogo;
