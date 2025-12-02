import React from 'react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isLastGroupComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  isSubmitting,
  isLastGroupComplete,
  onPrevious,
  onNext,
}: FormNavigationProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= totalSteps - 1;

  return (
    <div className='flex justify-between mt-8 pt-6 border-t border-gray-200'>
      <button
        type='button'
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}>
        Previous
      </button>

      {isLastStep ? (
        <button
          type='submit'
          disabled={isSubmitting || !isLastGroupComplete}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            isSubmitting || !isLastGroupComplete
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-lg'
          }`}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      ) : (
        <button
          type='button'
          onClick={onNext}
          disabled={!isLastGroupComplete}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isLastGroupComplete
              ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}>
          Next Step
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
