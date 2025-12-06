import React from 'react';
import CTA from '@/components/UI/CTA';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isLastGroupComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmitClick?: () => void;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  isSubmitting,
  isLastGroupComplete,
  onPrevious,
  onNext,
  onSubmitClick,
}: FormNavigationProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= totalSteps - 1;

  return (
    <div
      className={`flex mt-8 pt-6 border-t border-gray-200 ${isFirstStep ? 'justify-end' : 'justify-between'}`}>
      {!isFirstStep && (
        <CTA as='button' type='button' onClick={onPrevious} variant='outline-light'>
          Previous
        </CTA>
      )}

      {isLastStep ? (
        <CTA
          as='button'
          type='submit'
          onClick={onSubmitClick}
          disabled={isSubmitting || !isLastGroupComplete}
          variant='filled'
          className='px-8'>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </CTA>
      ) : (
        <CTA
          as='button'
          type='button'
          onClick={onNext}
          disabled={!isLastGroupComplete}
          variant='filled'>
          Next Step
        </CTA>
      )}
    </div>
  );
};

export default FormNavigation;
