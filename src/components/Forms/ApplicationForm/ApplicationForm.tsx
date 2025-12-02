'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { applicationFormData, shouldDisplayQuestion } from '@/data/applicationFormData';
import { contactDetailsStepData } from './contactDetailsStepData';
import FormField from './FormField';
import { MdError, MdExpandMore, MdCheckCircle } from 'react-icons/md';

// Create a type for all form fields dynamically
type ApplicationFormData = Record<string, any>;

// Track which question groups are expanded and visited
interface GroupState {
  [sectionIndex: number]: {
    [groupIndex: number]: {
      isExpanded: boolean;
      isVisited: boolean;
    };
  };
}

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [attemptedValidation, setAttemptedValidation] = useState(false);
  const [isActuallySubmitting, setIsActuallySubmitting] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [groupState, setGroupState] = useState<GroupState>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields },
    trigger,
    clearErrors,
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

  // Initialize group state when step changes
  useEffect(() => {
    const initializeGroupState = () => {
      const questionGroups = isContactDetailsStep
        ? contactDetailsStepData.questionGroups
        : currentSection?.questionGroups || [];

      const newState: GroupState[number] = {};
      const isSingleGroup = questionGroups.length === 1;

      questionGroups.forEach((_, groupIndex) => {
        if (isSingleGroup) {
          // Single group: expanded and non-collapsible
          newState[groupIndex] = { isExpanded: true, isVisited: true };
        } else if (groupIndex === 0) {
          // Multiple groups: first one expanded and visited
          newState[groupIndex] = { isExpanded: true, isVisited: true };
        } else {
          // Rest collapsed and unvisited
          newState[groupIndex] = { isExpanded: false, isVisited: false };
        }
      });

      setGroupState((prev) => ({ ...prev, [currentStep]: newState }));
    };

    initializeGroupState();
  }, [currentStep, isContactDetailsStep, currentSection]);

  // Reset attemptedValidation and clear errors when step changes
  useEffect(() => {
    setAttemptedValidation(false);
    clearErrors();
  }, [currentStep, clearErrors]);

  // Get all question IDs for the current section (including sub-questions)
  const getCurrentSectionQuestionIds = () => {
    const ids: string[] = [];

    // Contact Details step - read question IDs from contactDetailsStepData
    if (isContactDetailsStep) {
      contactDetailsStepData.questionGroups.forEach((group) => {
        group.questions.forEach((question) => {
          ids.push(question.id);
        });
      });
      return ids;
    }

    // Dynamic sections from applicationFormData
    if (currentSection) {
      currentSection.questionGroups.forEach((group) => {
        group.questions.forEach((question) => {
          if (shouldDisplayQuestion(question, formData)) {
            ids.push(question.id);
            // Add sub-question IDs
            question.subQuestions?.forEach((subQ) => {
              ids.push(subQ.id);
            });
          }
        });
      });
    }
    return ids;
  };

  // Check if current section has any errors (only for touched fields or after validation attempt)
  const currentSectionHasErrors = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.some((id) => errors[id] && (touchedFields[id] || attemptedValidation));
  };

  // Get error count for current section (only for touched fields or after validation attempt)
  const getCurrentSectionErrorCount = () => {
    const questionIds = getCurrentSectionQuestionIds();
    return questionIds.filter((id) => errors[id] && (touchedFields[id] || attemptedValidation))
      .length;
  };

  // Scroll to top of form
  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Get question IDs for a specific group
  const getGroupQuestionIds = (groupIndex: number) => {
    const ids: string[] = [];
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    const group = questionGroups[groupIndex];
    if (!group) return ids;

    group.questions.forEach((question) => {
      if (isContactDetailsStep || shouldDisplayQuestion(question, formData)) {
        ids.push(question.id);
        // Add sub-question IDs
        question.subQuestions?.forEach((subQ) => {
          ids.push(subQ.id);
        });
      }
    });

    return ids;
  };

  // Check if all required fields in a group are filled
  const isGroupComplete = (groupIndex: number): boolean => {
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    const group = questionGroups[groupIndex];
    if (!group) return true;

    // Check all questions in the group
    for (const question of group.questions) {
      // Skip questions that shouldn't be displayed
      if (!isContactDetailsStep && !shouldDisplayQuestion(question, formData)) {
        continue;
      }

      // Check if required field is filled
      if (question.required) {
        const value = formData[question.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return false;
        }
      }

      // Check sub-questions
      if (question.subQuestions) {
        for (const subQ of question.subQuestions) {
          if (subQ.required) {
            const subValue = formData[subQ.id];
            if (!subValue || (typeof subValue === 'string' && subValue.trim() === '')) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  // Handle clicking on a group header
  const handleGroupHeaderClick = (groupIndex: number) => {
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    const isSingleGroup = questionGroups.length === 1;
    if (isSingleGroup) return; // Don't allow toggling for single groups

    const currentGroupState = groupState[currentStep]?.[groupIndex];
    if (!currentGroupState) return;

    // Only allow expanding visited groups or the next unvisited group
    if (!currentGroupState.isExpanded && !currentGroupState.isVisited) {
      // Check if this is the next sequential unvisited group
      const isNextGroup = Object.entries(groupState[currentStep] || {}).every(
        ([idx, state]) => {
          const index = parseInt(idx);
          return index >= groupIndex || state.isVisited;
        }
      );
      if (!isNextGroup) return; // Don't allow skipping groups
    }

    // Toggle the expanded state
    setGroupState((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        [groupIndex]: {
          ...currentGroupState,
          isExpanded: !currentGroupState.isExpanded,
        },
      },
    }));
  };

  // Handle clicking the "Next Question" button
  const handleNextQuestion = (groupIndex: number) => {
    const questionGroups = isContactDetailsStep
      ? contactDetailsStepData.questionGroups
      : currentSection?.questionGroups || [];

    if (groupIndex >= questionGroups.length - 1) return; // Last group, no next

    // Collapse current group
    setGroupState((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        [groupIndex]: {
          ...prev[currentStep][groupIndex],
          isExpanded: false,
        },
      },
    }));

    // Expand and mark next group as visited
    const nextGroupIndex = groupIndex + 1;
    setGroupState((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        [nextGroupIndex]: {
          isExpanded: true,
          isVisited: true,
        },
      },
    }));
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
      // Mark that validation was attempted so errors show even for untouched fields
      setAttemptedValidation(true);
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

  // Handle form validation errors
  const onError = () => {
    // Only set attemptedValidation if this is an actual form submission (not just RHF validating on step change)
    if (isActuallySubmitting) {
      setAttemptedValidation(true);
      scrollToTop();
    }

    // Reset the flag
    setIsActuallySubmitting(false);
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
            {contactDetailsStepData.title}
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
          {isContactDetailsStep ? contactDetailsStepData.title : currentSection?.title}
        </h2>
        {isContactDetailsStep ? (
          <p className='text-body-base text-gray-600'>{contactDetailsStepData.description}</p>
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
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className='bg-black/20 rounded-xl shadow-lg p-8 text-left'>
          <div className='space-y-6'>
            {/* Contact Details Step - With Collapsible Groups */}
            {isContactDetailsStep &&
              contactDetailsStepData.questionGroups.map((group, groupIndex) => {
                const questionGroups = contactDetailsStepData.questionGroups;
                const isSingleGroup = questionGroups.length === 1;
                const isLastGroup = groupIndex === questionGroups.length - 1;
                const currentGroupState = groupState[currentStep]?.[groupIndex];
                const isExpanded = currentGroupState?.isExpanded ?? false;
                const isVisited = currentGroupState?.isVisited ?? false;
                const groupComplete = isGroupComplete(groupIndex);
                const groupKey = `${currentStep}-${groupIndex}`;

                return (
                  <div key={group.id}>
                    <div
                      ref={(el) => {
                        groupRefs.current[groupKey] = el;
                      }}
                      className={`rounded-lg border transition-all ${
                        isVisited
                          ? 'bg-white/40 border-gray-200'
                          : 'bg-gray-50/40 border-gray-300 border-dashed'
                      }`}>
                      {/* Group Header */}
                      <div
                        className={`p-6 flex items-center justify-between ${
                          !isSingleGroup && isVisited ? 'cursor-pointer hover:bg-white/60' : ''
                        } transition-colors`}
                        onClick={() => !isSingleGroup && handleGroupHeaderClick(groupIndex)}>
                        <div className='flex items-center gap-3 flex-1'>
                          {group.title && (
                            <h3
                              className={`text-body-lg font-semibold ${
                                isVisited ? 'text-brand-secondary' : 'text-gray-500'
                              }`}>
                              {group.title}
                            </h3>
                          )}
                          {isVisited && groupComplete && !isExpanded && (
                            <MdCheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {!isSingleGroup && (
                          <MdExpandMore
                            className={`w-6 h-6 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            } ${isVisited ? 'text-brand-secondary' : 'text-gray-400'}`}
                          />
                        )}
                      </div>

                      {/* Group Content */}
                      {isExpanded && (
                        <div className='px-6 pb-6 space-y-4 border-t border-gray-200 pt-6'>
                          {group.questions.map((question) => {
                            // Determine input type and validation based on the question
                            let inputType: 'text' | 'email' | 'tel' = 'text';
                            let validation: any = {};

                            if (question.required) {
                              validation.required = 'This field is required';
                            }

                            // Special handling for email field
                            if (question.id === 'email') {
                              inputType = 'email';
                              validation.pattern = {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address',
                              };
                            }

                            // Special handling for phone field
                            if (question.id === 'phone') {
                              inputType = 'tel';
                            }

                            return (
                              <div key={question.id}>
                                <label
                                  htmlFor={question.id}
                                  className='block text-body-sm font-medium text-gray-700 mb-2'>
                                  {question.question}
                                  {question.required && (
                                    <span className='text-red-500 ml-1'>*</span>
                                  )}
                                </label>
                                <input
                                  id={question.id}
                                  type={inputType}
                                  placeholder={question.placeholder}
                                  {...register(question.id, validation)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                    (touchedFields as any)[question.id] || attemptedValidation
                                      ? (errors as any)[question.id]
                                        ? 'border-red-500 focus:ring-red-500/20'
                                        : 'border-green-500 focus:ring-green-500/20'
                                      : 'border-gray-300 focus:ring-brand-primary/20'
                                  }`}
                                />
                                {((touchedFields as any)[question.id] || attemptedValidation) &&
                                  (errors as any)[question.id] && (
                                    <p className='mt-2 text-body-sm text-red-600'>
                                      {(errors as any)[question.id]?.message}
                                    </p>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Next Question Button */}
                    {!isLastGroup && isExpanded && (
                      <div className='flex justify-center my-6'>
                        <button
                          type='button'
                          onClick={() => handleNextQuestion(groupIndex)}
                          disabled={!groupComplete}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            groupComplete
                              ? 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-md'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}>
                          Next Question
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Dynamic Form Fields from applicationFormData */}
            {!isContactDetailsStep &&
              currentSection?.questionGroups.map((group, groupIndex) => {
                const questionGroups = currentSection.questionGroups;
                const isSingleGroup = questionGroups.length === 1;
                const isLastGroup = groupIndex === questionGroups.length - 1;
                const currentGroupState = groupState[currentStep]?.[groupIndex];
                const isExpanded = currentGroupState?.isExpanded ?? false;
                const isVisited = currentGroupState?.isVisited ?? false;
                const groupComplete = isGroupComplete(groupIndex);
                const groupKey = `${currentStep}-${groupIndex}`;

                return (
                  <div key={group.id}>
                    <div
                      ref={(el) => {
                        groupRefs.current[groupKey] = el;
                      }}
                      className={`rounded-lg border transition-all ${
                        isVisited
                          ? 'bg-white/40 border-gray-200'
                          : 'bg-gray-50/40 border-gray-300 border-dashed'
                      }`}>
                      {/* Group Header */}
                      <div
                        className={`p-6 flex items-center justify-between ${
                          !isSingleGroup && isVisited ? 'cursor-pointer hover:bg-white/60' : ''
                        } transition-colors`}
                        onClick={() => !isSingleGroup && handleGroupHeaderClick(groupIndex)}>
                        <div className='flex items-center gap-3 flex-1'>
                          {group.title && (
                            <h3
                              className={`text-body-lg font-semibold ${
                                isVisited ? 'text-brand-secondary' : 'text-gray-500'
                              }`}>
                              {group.title}
                            </h3>
                          )}
                          {isVisited && groupComplete && !isExpanded && (
                            <MdCheckCircle className='w-5 h-5 text-green-500' />
                          )}
                        </div>
                        {!isSingleGroup && (
                          <MdExpandMore
                            className={`w-6 h-6 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            } ${isVisited ? 'text-brand-secondary' : 'text-gray-400'}`}
                          />
                        )}
                      </div>

                      {/* Group Content */}
                      {isExpanded && (
                        <div className='px-6 pb-6 space-y-4 border-t border-gray-200 pt-6'>
                          {group.questions.map((question) => {
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
                                touchedFields={touchedFields}
                                attemptedValidation={attemptedValidation}
                                watch={watch}
                                setValue={setValue}
                                getValidationRules={getValidationRules}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Next Question Button */}
                    {!isLastGroup && isExpanded && (
                      <div className='flex justify-center my-6'>
                        <button
                          type='button'
                          onClick={() => handleNextQuestion(groupIndex)}
                          disabled={!groupComplete}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            groupComplete
                              ? 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-md'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}>
                          Next Question
                        </button>
                      </div>
                    )}
                  </div>
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
                onClick={() => setIsActuallySubmitting(true)}
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
            {contactDetailsStepData.title}
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
