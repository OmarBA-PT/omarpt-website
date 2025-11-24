'use client';

import React, { useState, useEffect } from 'react';
import HeroImages from './HeroImages';
import HeroVideo from './HeroVideo';
import RegularHeroLayout from './RegularHeroLayout';
import DefaultHeroLayout from './DefaultHeroLayout';
import ScrollIndicator from './ScrollIndicator';
import type { HOME_PAGE_QUERYResult } from '@/sanity/types';
import { urlFor } from '@/sanity/lib/image';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import { stegaClean } from 'next-sanity';
import { homeHeroBottomSpacing } from '@/utils/spacingConstants';
import { useHeader } from '@/contexts/HeaderContext';

interface HeroProps {
  heroStyle: NonNullable<HOME_PAGE_QUERYResult>['heroStyle'];
  heroTextColor: NonNullable<HOME_PAGE_QUERYResult>['heroTextColor'];
  heroImages: NonNullable<HOME_PAGE_QUERYResult>['heroImages'];
  heroVideo: NonNullable<HOME_PAGE_QUERYResult>['heroVideo'];
  heroImageTransitionDuration: NonNullable<HOME_PAGE_QUERYResult>['heroImageTransitionDuration'];
  h1Title: NonNullable<HOME_PAGE_QUERYResult>['h1Title'];
  heroTitle: NonNullable<HOME_PAGE_QUERYResult>['heroTitle'];
  heroCallToActionList: NonNullable<HOME_PAGE_QUERYResult>['heroCallToActionList'];
  hideScrollIndicator: NonNullable<HOME_PAGE_QUERYResult>['hideScrollIndicator'];
  heroDefaultContentPosition: NonNullable<HOME_PAGE_QUERYResult>['heroDefaultContentPosition'];
  heroImageFrameShape: NonNullable<HOME_PAGE_QUERYResult>['heroImageFrameShape'];
  heroContentPosition: NonNullable<HOME_PAGE_QUERYResult>['heroContentPosition'];
  documentId: string;
  documentType: string;
}

const Hero = ({
  heroStyle,
  heroTextColor,
  heroImages,
  heroVideo,
  heroImageTransitionDuration,
  h1Title,
  heroTitle,
  heroCallToActionList,
  hideScrollIndicator,
  heroDefaultContentPosition,
  heroImageFrameShape,
  heroContentPosition,
  documentId,
  documentType,
}: HeroProps) => {
  const { setEnableOpacityFade } = useHeader();
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [shouldUseGradientTransition, setShouldUseGradientTransition] = useState(true);

  // Enable header opacity fade when Hero is mounted
  useEffect(() => {
    setEnableOpacityFade(true);

    // Disable it when component unmounts
    return () => {
      setEnableOpacityFade(false);
    };
  }, [setEnableOpacityFade]);

  const handleFirstImageLoaded = () => {
    setFirstImageLoaded(true);
    // Always use gradient transition since we're always fading in
    setShouldUseGradientTransition(true);
  };

  // Convert Sanity image array to HeroImages component format and filter valid images
  const validImages = heroImages?.filter((image) => image && image.asset && image.asset._ref) || [];

  // Request 2x size for high-DPI displays (3840x2160 for crisp 4K rendering)
  const images = validImages.map((image, index) => ({
    imageUrl: urlFor(image).width(3840).height(2160).quality(90).url(),
    altText: image.alt || `Hero image ${index + 1}`,
  }));

  // Get video URL from Sanity
  const videoUrl = heroVideo?.asset?._ref
    ? `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${heroVideo.asset._ref.replace('file-', '').replace('-mp4', '.mp4').replace('-webm', '.webm')}`
    : null;

  // Determine hero style - default to 'default' if not provided, clean any stega characters
  const currentHeroStyle = stegaClean(heroStyle) || 'default';

  // Get background color based on text color for better contrast (for background-images and video styles)
  const heroBackgroundColor = stegaClean(heroTextColor) === 'white' ? 'bg-black' : 'bg-white';

  // For Default style, allow height to exceed viewport on mobile only
  // For background-images and video, always constrain to viewport height
  const heightClass =
    currentHeroStyle === 'default' ? 'min-h-screen md:h-screen' : 'h-screen';

  // Hide scroll indicator for Default style on mobile
  const shouldShowScrollIndicator =
    !stegaClean(hideScrollIndicator) &&
    !(currentHeroStyle === 'default' && typeof window !== 'undefined' && window.innerWidth < 768);

  return (
    <section
      id='home'
      data-hero
      className={`relative ${heightClass} flex flex-col ${homeHeroBottomSpacing} ${
        currentHeroStyle === 'background-images' || currentHeroStyle === 'video'
          ? heroBackgroundColor
          : ''
      }`}>
      {/* Z-index hierarchy: Background (z-10) → Gradient (z-20) → Content (z-[25]) → Header (z-30) → Mobile menu (z-40) */}

      {/* Hero Style Click-to-Edit Wrapper */}
      <div
        {...createSanityDataAttribute(documentId, documentType, 'heroStyle')}
        className='absolute inset-0 pointer-events-none z-0'
      />

      {/* Text Color Click-to-Edit Wrapper */}
      <div
        {...createSanityDataAttribute(documentId, documentType, 'heroTextColor')}
        className='absolute inset-0 pointer-events-none z-0'
      />

      {/* Background Images Hero Style */}
      {currentHeroStyle === 'background-images' && (
        <>
          {images.length > 0 && (
            <HeroImages
              images={images}
              duration={(heroImageTransitionDuration || 4) * 1000}
              onFirstImageLoaded={handleFirstImageLoaded}
            />
          )}
          <div
            className={`absolute inset-0 bg-linear-to-t from-black from-20% to-transparent z-20 ${
              shouldUseGradientTransition ? 'transition-opacity duration-1000 ease-in-out' : ''
            } ${firstImageLoaded || images.length === 0 ? 'opacity-90' : 'opacity-0'}`}
          />
        </>
      )}

      {/* Video Hero Style */}
      {currentHeroStyle === 'video' && (
        <>
          {videoUrl && <HeroVideo videoUrl={videoUrl} onVideoLoaded={handleFirstImageLoaded} />}
          <div
            className={`absolute inset-0 bg-linear-to-t from-black from-20% to-transparent z-20 ${
              shouldUseGradientTransition ? 'transition-opacity duration-1000 ease-in-out' : ''
            } ${firstImageLoaded || !videoUrl ? 'opacity-90' : 'opacity-0'}`}
          />
        </>
      )}

      {/* Default Hero Style - Charcoal Radial Gradient Background */}
      {currentHeroStyle === 'default' && (
        <>
          <div
            className='absolute inset-0 z-10'
            style={{ background: 'var(--background-image-brand-gradient-charcoal-radial)' }}
          />
          <div className='shrink-0 h-16 md:h-24 lg:h-32' />
        </>
      )}

      {/* Main content area - grows to fill available space */}
      {/* flex-col always applied - needed for default style to distribute space, and for regular layout positioning */}
      <div className='flex-1 flex flex-col relative z-25'>
        {currentHeroStyle === 'default' ? (
          <DefaultHeroLayout
            heroTextColor={heroTextColor}
            h1Title={h1Title}
            heroTitle={heroTitle}
            heroCallToActionList={heroCallToActionList}
            heroContentPosition={heroDefaultContentPosition}
            heroImageFrameShape={heroImageFrameShape}
            images={images}
            imageDuration={(heroImageTransitionDuration || 4) * 1000}
            documentId={documentId}
            documentType={documentType}
          />
        ) : (
          <RegularHeroLayout
            heroTextColor={heroTextColor}
            h1Title={h1Title}
            heroTitle={heroTitle}
            heroCallToActionList={heroCallToActionList}
            heroContentPosition={heroContentPosition}
            documentId={documentId}
            documentType={documentType}
          />
        )}
      </div>

      {/* Bottom padding with scroll indicator */}
      {shouldShowScrollIndicator && (
        <div className='shrink-0 flex flex-col items-center justify-end h-24 relative z-30 mb-4'>
          <div className='block'>
            <ScrollIndicator />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
