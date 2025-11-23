'use client';

import React, { useCallback, useRef } from 'react';

interface HeroVideoProps {
  videoUrl: string;
  onVideoLoaded?: () => void;
}

const HeroVideo = ({ videoUrl, onVideoLoaded }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Track when video loads
  const handleVideoLoad = useCallback(() => {
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  }, [onVideoLoaded]);

  // Don't render anything if no video URL
  if (!videoUrl) {
    return null;
  }

  return (
    <div className='absolute top-0 left-0 w-full h-full z-10 overflow-hidden'>
      <video
        ref={videoRef}
        className='absolute top-0 left-0 w-full h-full object-cover object-center opacity-80'
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoad}
        preload='auto'>
        <source src={videoUrl} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HeroVideo;
