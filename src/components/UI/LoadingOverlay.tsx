'use client';

import React, { useEffect, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import UnifiedImage from '@/components/UI/UnifiedImage';

interface LoadingOverlayProps {
  isLoading?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useBodyScrollLock(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      // Small delay to ensure component is rendered, then start fade in
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      // Start fade out
      setIsVisible(false);
      // Wait for fade out animation to complete before removing from DOM
      setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match the CSS transition duration
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <>
      <div className='h-screen'>
        {/* <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] sm:w-[500px] sm:h-[500px]'>
          <UnifiedImage
            src='/images/logos/logo-only.png'
            alt='Taupiri Sound Logo'
            mode='fill'
            sizeContext='hero'
            objectFit='contain'
            fillContainer={true}
            sizes='(max-width: 640px) 75vw, 500px'
            className='drop-shadow-lg drop-shadow-black/40 opacity-30'
          />
        </div> */}
      </div>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        role='dialog'
        aria-modal='true'
        aria-label='Page loading'>
        {/* Black overlay with reduced opacity */}
        <div className='absolute inset-0 bg-black/70' />

        {/* Soundwave loader in center */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex items-center gap-2 h-40'>
            {/* 7 bars with alternating colors and staggered animations */}
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className='w-2 rounded-full'
                style={{
                  backgroundColor: i % 2 === 0 ? '#900000' : '#430c08', // Alternate brand-primary and brand-secondary
                  animation: `soundwave 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* CSS Animation for soundwave */}
        <style jsx>{`
          @keyframes soundwave {
            0%, 100% {
              height: 20%;
            }
            50% {
              height: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default LoadingOverlay;
