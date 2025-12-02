import React from 'react';

interface StepData {
  id: string;
  title: string;
}

interface StepIndicatorsProps {
  currentStep: number;
  contactDetailsTitle: string;
  sections: StepData[];
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicators = ({ currentStep, contactDetailsTitle, sections, onStepClick }: StepIndicatorsProps) => {
  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on visited steps (previous steps)
    if (stepIndex < currentStep && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <>
      {/* Desktop Step Indicators */}
      <div className='mb-8 hidden md:flex justify-between'>
        {/* Contact Details Step */}
        <div
          className={`flex flex-col items-center flex-1 ${
            0 < currentStep ? 'cursor-pointer' : ''
          }`}
          onClick={() => handleStepClick(0)}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
              0 < currentStep
                ? 'bg-brand-primary text-white hover:ring-4 hover:ring-brand-primary/30'
                : 0 === currentStep
                  ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
                  : 'bg-gray-200 text-gray-500'
            }`}>
            {0 < currentStep ? '✓' : 1}
          </div>
          <span
            className={`text-body-xs text-center ${
              0 === currentStep ? 'text-brand-primary font-medium' : 'text-gray-500'
            }`}>
            {contactDetailsTitle}
          </span>
        </div>

        {/* Dynamic Steps */}
        {sections.map((section, index) => {
          const stepIndex = index + 1;
          const isVisited = stepIndex < currentStep;
          return (
            <div
              key={section.id}
              className={`flex flex-col items-center flex-1 ml-4 ${
                isVisited ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleStepClick(stepIndex)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                  stepIndex < currentStep
                    ? 'bg-brand-primary text-white hover:ring-4 hover:ring-brand-primary/30'
                    : stepIndex === currentStep
                      ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                {stepIndex < currentStep ? '✓' : stepIndex + 1}
              </div>
              <span
                className={`text-body-xs text-center ${
                  stepIndex === currentStep ? 'text-brand-primary font-medium' : 'text-gray-500'
                }`}>
                {section.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className='md:hidden mt-4 text-center'>
        <p className='text-body-sm text-gray-600'>
          <span className={0 === currentStep ? 'text-brand-primary font-medium' : ''}>
            {contactDetailsTitle}
          </span>
          {sections.map((section, index) => {
            const stepIndex = index + 1;
            return (
              <span
                key={section.id}
                className={stepIndex === currentStep ? 'text-brand-primary font-medium' : ''}>
                {' → '}
                {section.title}
              </span>
            );
          })}
        </p>
      </div>
    </>
  );
};

export default StepIndicators;
