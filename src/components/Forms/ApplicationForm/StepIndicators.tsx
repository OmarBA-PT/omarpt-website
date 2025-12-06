import React from 'react';

interface StepData {
  id: string;
  title: string;
}

interface StepIndicatorsProps {
  currentStep: number;
  sections: StepData[];
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicators = ({ currentStep, sections, onStepClick }: StepIndicatorsProps) => {
  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on visited steps (previous steps)
    if (stepIndex < currentStep && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <>
      {/* Desktop Step Indicators */}
      <div className='mb-16 hidden md:flex justify-between'>
        {sections.map((section, index) => {
          const stepIndex = index;
          const isVisited = stepIndex < currentStep;
          return (
            <div
              key={section.id}
              className={`flex flex-col items-center flex-1 ${index > 0 ? 'ml-4' : ''} ${
                isVisited ? 'cursor-pointer' : ''
              } group`}
              onClick={() => handleStepClick(index)}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                  stepIndex < currentStep
                    ? 'bg-brand-primary text-white group-hover:ring-4 group-hover:ring-brand-primary/30'
                    : stepIndex === currentStep
                      ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                {stepIndex + 1}
              </div>
              <span
                className={`text-body-xs text-center transition-all ${
                  stepIndex <= currentStep ? 'text-brand-primary' : ''
                } ${stepIndex < currentStep ? 'group-hover:text-brand-secondary' : ''} ${
                  stepIndex === currentStep ? 'font-medium' : ''
                }`}>
                {section.title}
                {stepIndex < currentStep && (
                  <span className='inline-block ml-1 text-brand-primary'>✓</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className='md:hidden mt-4 mb-10 text-center'>
        <p className='text-body-sm text-gray-600'>
          {sections.map((section, index) => (
            <span key={section.id}>
              <span
                className={`${index < currentStep ? 'hover:text-brand-secondary' : ''} ${index <= currentStep ? 'text-brand-primary cursor-pointer' : ''} ${
                  index === currentStep ? 'font-medium' : ''
                }`}
                onClick={() => handleStepClick(index)}>
                {section.title}
              </span>
              <span className='text-brand-white mx-2'>{index < sections.length - 1 && ' → '}</span>
            </span>
          ))}
        </p>
      </div>
    </>
  );
};

export default StepIndicators;
