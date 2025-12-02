import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className='mb-8 text-center'>
      <h2 className='text-h3 font-bold text-gray-900 mb-2'>{title}</h2>
      {description && <p className='text-body-base text-gray-600'>{description}</p>}
    </div>
  );
};

export default SectionHeader;
