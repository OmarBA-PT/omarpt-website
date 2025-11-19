import { pageSubtitleBottomSpacing } from '@/utils/spacingConstants';
import React from 'react';

interface PageSubtitleProps {
  children: React.ReactNode;
  alignment?: 'text-left' | 'text-center' | 'text-right';
  className?: string;
  omitBottomSpacing?: boolean; // If true, omits the default bottom spacing
}

const PageSubtitle = ({
  children,
  alignment = 'text-center',
  omitBottomSpacing = false,
  className = '',
}: PageSubtitleProps) => {
  return (
    <p
      className={`${className} text-body-lg md:text-body-xl max-w-3xl mx-auto whitespace-pre-line ${alignment} ${!omitBottomSpacing ? pageSubtitleBottomSpacing : ''}`}>
      {children}
    </p>
  );
};

export default PageSubtitle;
