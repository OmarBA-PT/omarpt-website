import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

const ProgressBar = ({ currentStep, totalSteps, progress }: ProgressBarProps) => {
  return (
    <div className='mb-8'>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-body-sm font-medium'>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className='text-body-sm font-medium text-brand-primary'>
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full bg-brand-primary transition-all duration-500 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
