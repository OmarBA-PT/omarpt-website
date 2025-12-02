'use client';

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { applicationFormData, shouldDisplayQuestion } from '@/data/applicationFormData';
import FormField from './FormField';
import ContactDetailsStep from '@/components/Forms/ContactDetailsStep';
import { MdError } from 'react-icons/md';

// Create a type for all form fields dynamically
type ApplicationFormData = Record<string, any>;

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ApplicationFormData>({
    mode: 'onTouched',
    defaultValues: {},
  });

  const formData = watch(); // Watch all form values

  // Total steps = 1 (Contact Details) + number of sections from data
  const totalSteps = 1 + applicationFormData.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Check if we're on the Contact Details step (first step)
  const isContactDetailsStep = currentStep === 0;

  // Get current section from applicationFormData (adjust index for Contact Details step)
  const currentSection = !isContactDetailsStep ? applicationFormData[currentStep - 1] : null;

  // Get all question IDs for the current section (including sub-questions)
  const getCurrentSectionQuestionIds = () => {
    const ids: string[] = [];

    // Contact Details step - hard-coded fields
    if (isContactDetailsStep) {
      ids.push('fullName', 'email', 'phone');
      return ids;
    }

    // Dynamic sections from applicationFormData
    if (currentSection) {
      currentSection.questions.forEach((question) => {
        if (shouldDisplayQuestion(question, formData)) {
          ids.push(question.id);
          // Add sub-question IDs
          question.subQuestions?.forEach((subQ) => {
            ids.push(subQ.id);
          });
        }
      });
    }
    return ids;
  };

  // Check if current section has any errors
  const currentSectionHasErrors = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.some((id) => errors[id]);
  };

  // Get error count for current section
  const getCurrentSectionErrorCount = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.filter((id) => errors[id]).length;
  };

  // Scroll to top of form
  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNext = async () => {
    // Validate all fields in current section
    const questionIds = getCurrentSectionQuestionIds();
    const isValid = await trigger(questionIds);

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
        scrollToTop();
      }
    } else {
      // Scroll to top to show error banner
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      scrollToTop();
    }
  };

  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/application-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: data,
          honeypot: '', // Empty honeypot field for bot detection
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error types
        setStatus('error');
        if (result.rateLimited) {
          setErrorMessage(
            'You have submitted too many applications recently. Please try again later.'
          );
        } else if (result.configError) {
          setErrorMessage(
            'The application form is currently unavailable. Please contact us directly via phone or email.'
          );
        } else {
          setErrorMessage(
            result.error ||
              'We encountered an issue submitting your application. Please try contacting us directly.'
          );
        }
        setIsSubmitting(false);
        scrollToTop();
        return;
      }

      // Success! Show success message
      setStatus('success');
      setIsSubmitting(false);
      scrollToTop();
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(
        'We encountered an issue submitting your application. Please check your internet connection and try again, or contact us directly via phone or email.'
      );
      setIsSubmitting(false);
      scrollToTop();
    }
  };

  // Custom validation function for required fields
  const getValidationRules = (required: boolean) => {
    if (!required) return {};

    return {
      required: 'This field is required',
    };
  };

  return (
    <div className='w-full max-w-4xl mx-auto' ref={formTopRef}>
      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-body-sm font-medium text-gray-700'>
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

      {/* Step Indicators */}
      <div className='mb-8 hidden md:flex justify-between'>
        {/* Contact Details Step */}
        <div className='flex flex-col items-center flex-1'>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
              0 < currentStep
                ? 'bg-brand-primary text-white'
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
            Contact Details
          </span>
        </div>

        {/* Dynamic Steps from applicationFormData */}
        {applicationFormData.map((section, index) => {
          const stepIndex = index + 1; // +1 because Contact Details is step 0
          return (
            <div key={section.id} className='flex flex-col items-center flex-1 ml-4'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                  stepIndex < currentStep
                    ? 'bg-brand-primary text-white'
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

      {/* Section Header */}
      <div className='mb-8 text-center'>
        <h2 className='text-h3 font-bold text-gray-900 mb-2'>
          {isContactDetailsStep ? 'Contact Details' : currentSection?.title}
        </h2>
        {isContactDetailsStep ? (
          <p className='text-body-base text-gray-600'>
            Let&apos;s start with some basic information about you
          </p>
        ) : (
          currentSection?.description && (
            <p className='text-body-base text-gray-600'>{currentSection.description}</p>
          )
        )}
      </div>

      {/* Success Message */}
      {status === 'success' && (
        <div className='mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg'>
          <div className='text-center'>
            <h3 className='text-h4 font-bold text-green-800 mb-2'>
              Thank you for your application!
            </h3>
            <p className='text-body-base text-green-700 mb-2'>
              We have received your submission and will get back to you as soon as possible.
            </p>
            <p className='text-body-sm text-green-600'>
              You should also receive a confirmation email shortly.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className='mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg'>
          <div className='flex items-start'>
            <MdError className='w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0' />
            <div>
              <h3 className='text-body-base font-semibold text-red-800 mb-1'>Submission Error</h3>
              <p className='text-body-sm text-red-700'>{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Summary Banner */}
      {status !== 'success' && currentSectionHasErrors() && (
        <div className='mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg'>
          <div className='flex items-start'>
            <MdError className='w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0' />
            <div>
              <h3 className='text-body-base font-semibold text-red-800 mb-1'>
                Fields Require Attention
              </h3>
              <p className='text-body-sm text-red-700'>
                {getCurrentSectionErrorCount()}{' '}
                {getCurrentSectionErrorCount() === 1 ? 'field requires' : 'fields require'} your
                attention. Please check the highlighted{' '}
                {getCurrentSectionErrorCount() === 1 ? 'field' : 'fields'} below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {status !== 'success' && (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-xl shadow-lg p-8'>
          <div className='space-y-6'>
            {/* Contact Details Step - Using ContactDetailsStep Component */}
            {isContactDetailsStep && <ContactDetailsStep register={register} errors={errors} />}

            {/* Dynamic Form Fields from applicationFormData */}
            {!isContactDetailsStep &&
              currentSection?.questions.map((question) => {
                // Check if question should be displayed based on conditional logic
                if (!shouldDisplayQuestion(question, formData)) {
                  return null;
                }

                return (
                  <FormField
                    key={question.id}
                    question={question}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    getValidationRules={getValidationRules}
                  />
                );
              })}
          </div>

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-8 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}>
              Previous
            </button>

            {/* Show Submit if on last step OR if Contact Details is the only step */}
            {currentStep < totalSteps - 1 ? (
              <button
                type='button'
                onClick={handleNext}
                className='px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-colors'>
                Next Step
              </button>
            ) : (
              <button
                type='submit'
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-lg'
                }`}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      )}

      {/* Mobile Step Indicator */}
      <div className='md:hidden mt-4 text-center'>
        <p className='text-body-sm text-gray-600'>
          <span className={0 === currentStep ? 'text-brand-primary font-medium' : ''}>
            Contact Details
          </span>
          {applicationFormData.map((section, index) => {
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
    </div>
  );
};

export default ApplicationForm;
