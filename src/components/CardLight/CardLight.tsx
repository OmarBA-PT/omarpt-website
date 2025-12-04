import React from 'react';
import { IconType } from 'react-icons';

interface CardLightProps {
  title?: string;
  children: React.ReactNode;
  icon?: IconType;
  className?: string;
}

const CardLight = ({ title = '', children, icon: Icon, className = '' }: CardLightProps) => {
  return (
    <div className={`bg-brand-charcoal-light rounded-lg p-6 text-left ${className}`}>
      <div className='flex gap-4'>
        {Icon ? <Icon className='w-8 h-8 text-brand-secondary mb-3' /> : null}
        <div className='grow'>
          <h3 className='text-h6 text-brand-primary mb-2'>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardLight;
