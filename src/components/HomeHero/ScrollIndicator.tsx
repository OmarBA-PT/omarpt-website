import React from 'react';

interface ScrollIndicatorProps {
  className?: string;
}

const ScrollIndicator = ({ className = '' }: ScrollIndicatorProps) => {
  const handleScrollDown = () => {
    // Scroll to the next section after the hero
    const heroElement = document.querySelector('[data-hero]') as HTMLElement;
    if (heroElement) {
      const nextElement = heroElement.nextElementSibling as HTMLElement;
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll by viewport height
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }
  };

  return (
    <button
      onClick={handleScrollDown}
      className={`
        group flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out
        text-brand-primary hover:text-brand-white 
        cursor-pointer
        ${className}
      `}
      aria-label='Scroll down to content'>
      {/* Stacked chevron arrows */}
      <div className='relative z-40 flex flex-col -gap-2'>
        {/* First chevron */}
        <svg
          width='30'
          height='20'
          viewBox='0 0 30 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='
            w-8 h-4
            animate-bounce
            transition-all duration-300
            group-hover:translate-y-1
          '>
          <path
            d='M2 2 L16 16 L30 2'
            stroke='currentColor'
            strokeWidth='8'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        </svg>

        {/* Second chevron */}
        <svg
          width='30'
          height='20'
          viewBox='0 0 30 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='
            w-8 h-4
            animate-bounce
            transition-all duration-300
            group-hover:translate-y-1
          '
          style={{ animationDelay: '0.1s' }}>
          <path
            d='M2 2 L16 16 L30 2'
            stroke='currentColor'
            strokeWidth='8'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        </svg>
      </div>
    </button>
  );
};

export default ScrollIndicator;
