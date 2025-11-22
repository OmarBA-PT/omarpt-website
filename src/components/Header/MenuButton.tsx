'use client';

import React from 'react';

type ButtonVariant = 'hamburger' | 'close';

interface MenuButtonProps {
  variant: ButtonVariant;
  isMenuOpen?: boolean;
  onClick: () => void;
  className?: string;
  ariaControls?: string;
  showOnDesktop?: boolean;
}

const MenuButton = ({
  variant,
  isMenuOpen = false,
  onClick,
  className = '',
  ariaControls,
  showOnDesktop = true,
}: MenuButtonProps) => {
  if (variant === 'close') {
    return (
      <button
        onClick={onClick}
        className={`w-8 h-8 flex items-center justify-center cursor-pointer text-white focus:outline-none hover:text-brand-primary transition-colors ${className}`}
        aria-label='Close menu'>
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    );
  }

  // Hamburger variant
  // NOTE: Desktop visibility breakpoint - Uses 'lg:' breakpoint to determine mobile vs desktop behavior
  // If you need to change this breakpoint (e.g., to md: or xl:), update this class below
  const desktopHiddenClass = showOnDesktop ? '' : 'lg:hidden';

  return (
    <button
      onClick={onClick}
      className={`flex ${desktopHiddenClass} flex-col justify-center items-center w-8 h-8 cursor-pointer focus:outline-none group ${className}`}
      aria-label={`${isMenuOpen ? 'Close' : 'Open'} navigation menu`}
      aria-expanded={isMenuOpen}
      aria-controls={ariaControls}>
      <span
        className={`block w-6 h-0.5 bg-white group-hover:bg-brand-secondary transition-all duration-300 transform origin-center ${
          isMenuOpen ? 'rotate-45 translate-y-2' : ''
        }`}
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.8))' }}
      />
      <span
        className={`block w-6 h-0.5 bg-white group-hover:bg-brand-secondary transition-all duration-300 mt-1.5 ${
          isMenuOpen ? 'opacity-0' : ''
        }`}
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.8))' }}
      />
      <span
        className={`block w-6 h-0.5 bg-white group-hover:bg-brand-secondary transition-all duration-300 mt-1.5 transform origin-center ${
          isMenuOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.8))' }}
      />
    </button>
  );
};

export default MenuButton;
