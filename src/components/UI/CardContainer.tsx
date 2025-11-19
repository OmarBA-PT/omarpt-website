import { maxCardWidth } from '@/utils/spacingConstants';
import React from 'react';

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  isGridChild?: boolean;
  noPadding?: boolean;
  noMaxWidth?: boolean;
  visualStyle?: 'light' | 'dark';
}

const CardContainer = ({
  children,
  className = '',
  isGridChild = false,
  noPadding = false,
  noMaxWidth = false,
  visualStyle = 'light',
}: CardContainerProps) => {
  // Dark mode uses brand-secondary background with light text
  const bgColor = visualStyle === 'dark' ? 'bg-brand-secondary' : 'bg-brand-white-dark';
  const textColor = visualStyle === 'dark' ? 'text-brand-white' : '';

  return (
    <div
      className={`
        w-full
        ${bgColor}
        ${textColor}
        shadow-sm
        rounded-lg
        ${noPadding ? '' : 'p-6'}
        flex
        flex-col
        items-center
        text-center
        ${noMaxWidth ? '' : maxCardWidth}
        ${!isGridChild && !noMaxWidth ? 'mx-auto' : ''}
        ${className}
      `.trim()}>
      {children}
    </div>
  );
};

export default CardContainer;
