'use client';

import React, { useEffect, useRef, useState } from 'react';

const DefaultHeroBackground = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let isScrolling = false;

    const calculateOpacity = () => {
      if (!backgroundRef.current) return;

      const heroSection = backgroundRef.current.closest('section');
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const heroHeight = heroRect.height;
      const heroTop = heroRect.top;

      // Calculate opacity based on scroll position
      let newOpacity = 1;

      if (heroTop <= 0) {
        // Scrolling down - hero top has passed viewport top, start fading immediately
        const fadeRange = heroHeight; // Fade over the entire hero height
        const fadeProgress = Math.abs(heroTop) / fadeRange;
        newOpacity = Math.max(0, 1 - fadeProgress);
      } else {
        // Hero is fully visible - opacity should be 1
        newOpacity = 1;
      }

      setOpacity(Math.max(0, Math.min(1, newOpacity)));
      isScrolling = false;
    };

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        animationFrameId = requestAnimationFrame(calculateOpacity);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateOpacity(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={backgroundRef}
      className='fixed inset-0 overflow-hidden transition-opacity duration-100 ease-linear'
      style={{ opacity }}>
      {/* Transparent background - allows body color to show through */}

      {/* Key decorative circles - minimal and strategic */}
      {/* Large left circle - positioned to peek from bottom-left - ~50vw diameter with min size */}
      <div className='absolute bottom-0 left-1/2 sm:left-0 w-[100vw] h-[100vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-gradient-to-tr from-[#ffea00]/20 to-[#ffea00]/10 transform -translate-x-1/2 translate-y-1/2 blur-xl' />
      <div className='absolute bottom-0 left-1/2 sm:left-0 w-[70vw] h-[70vw] sm:w-[35vw] sm:h-[35vw] rounded-full bg-gradient-to-tr from-[#ffea00]/10 to-[#ffea00]/05 transform -translate-x-1/2 translate-y-1/2 blur-sm' />

      {/* Central accent circle - subtly positioned behind content area - ~25vw diameter with min size */}
      {/* <div className='absolute top-1/2 left-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-[25vw] lg:h-[25vw] rounded-full bg-gradient-to-br from-[#ffea00]/20 to-[#ffea00]/10 transform -translate-y-1/2 -translate-x-1/2 blur-sm' />
      <div className='absolute top-1/2 left-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-[20vw] lg:h-[20vw] rounded-full bg-gradient-to-br from-[#ffea00]/40 to-[#ffea00]/20 transform -translate-y-1/2 -translate-x-1/2' /> */}

      {/* Large right circle - positioned to peek from top-right - ~50vw diameter with min size */}
      <div className='absolute hidden md:block md:right-0 top-0 right-1/2 w-[100vw] h-[100vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-gradient-to-bl from-[#ffea00]/30 to-[#f4a300]/20 transform translate-x-1/2 -translate-y-1/2 blur-xl' />
      <div className='absolute hidden md:block md:right-0 top-0 right-1/2 w-[70vw] h-[70vw] sm:w-[35vw] sm:h-[35vw] rounded-full bg-gradient-to-bl from-[#ffea00]/30 to-[#f4a300]/20 transform translate-x-1/2 -translate-y-1/2 blur-sm' />
    </div>
  );
};

export default DefaultHeroBackground;
