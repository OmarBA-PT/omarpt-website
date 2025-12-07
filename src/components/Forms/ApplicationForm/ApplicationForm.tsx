'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { shouldDisplayQuestion } from '@/data/applicationFormData';
import { combinedApplicationFormData } from '@/data/combinedApplicationFormData';
import FormField from './FormField';
import ProgressBar from './ProgressBar';
import StepIndicators from './StepIndicators';
import SectionHeader from './SectionHeader';
import StatusMessages from './StatusMessages';
import QuestionGroup from './QuestionGroup';
import FormNavigation from './FormNavigation';
import { useGroupState } from './useGroupState';
import { useFormValidation } from './useFormValidation';
import { ApplicationFormData, GroupRefs, FormStatus } from './types';

interface ApplicationFormProps {
  onScrollToBackButton?: () => void;
}

const ApplicationForm = ({ onScrollToBackButton }: ApplicationFormProps = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [attemptedValidation, setAttemptedValidation] = useState(false);
  const [userClickedSubmit, setUserClickedSubmit] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<GroupRefs>({});
  const [stepsVisitedForward, setStepsVisitedForward] = useState<Set<number>>(new Set());
  const [stepsCompletedForward, setStepsCompletedForward] = useState<Set<number>>(new Set());

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
  });

  const formData = watch();

  // Total steps = all sections in combined data
  const totalSteps = combinedApplicationFormData.length;

  // Progress calculation: Shows percentage of steps COMPLETED (not including current step)
  // When on step 0 of 4 total steps: 0/4 = 0% (starting, nothing completed yet)
  // When on step 1 of 4 total steps: 1/4 = 25% (step 0 completed)
  // When on step 2 of 4 total steps: 2/4 = 50% (steps 0-1 completed)
  // When on step 3 of 4 total steps: 3/4 = 75% (steps 0-2 completed)
  // After form submission: 100% (all steps completed)
  const progress = (currentStep / totalSteps) * 100;

  // Get current section from combined data
  const currentSection = combinedApplicationFormData[currentStep];

  // Get current question groups
  const questionGroups = currentSection?.questionGroups || [];

  // Use custom hooks
  const { groupState, setGroupState } = useGroupState({
    currentStep,
    questionGroups,
    stepsVisitedForward,
  });

  const {
    getCurrentSectionQuestionIds,
    currentSectionHasErrors,
    getCurrentSectionErrorCount,
    isGroupComplete,
    groupHasOnlyRadioButtonRequiredFields,
    lastRequiredFieldHasVisibleConditionalSubQuestions,
    groupHasAnyFilledFields,
    groupHasIncompleteMandatoryFields,
    getValidationRules,
  } = useFormValidation({
    currentSection,
    formData,
    errors,
    touchedFields,
    attemptedValidation,
  });

  // Reset attemptedValidation and clear errors when step changes
  useEffect(() => {
    setAttemptedValidation(false);
    setUserClickedSubmit(false);
    clearErrors();
  }, [currentStep, clearErrors]);

  // Auto-progress for radio button only groups
  useEffect(() => {
    // Don't run if group state hasn't been initialized for this step yet
    if (!groupState[currentStep]) return;

    // Don't auto-progress on steps we've already completed going forward
    if (stepsCompletedForward.has(currentStep)) return;

    // Check each group to see if it should auto-progress
    questionGroups.forEach((_, groupIndex) => {
      const currentGroupState = groupState[currentStep]?.[groupIndex];

      // Only check groups that are expanded and not the last group
      if (!currentGroupState?.isExpanded) return;
      if (groupIndex >= questionGroups.length - 1) return;

      // Check if next group is already visited (already auto-progressed or manually clicked)
      const nextGroupState = groupState[currentStep]?.[groupIndex + 1];
      if (nextGroupState?.isVisited) return;

      // Check if this group has only radio button required fields
      if (!groupHasOnlyRadioButtonRequiredFields(groupIndex)) return;

      // Don't auto-progress if the last required field has conditional subQuestions that are now visible
      if (lastRequiredFieldHasVisibleConditionalSubQuestions(groupIndex)) return;

      // Check if the group is complete
      if (isGroupComplete(groupIndex)) {
        handleNextQuestion(groupIndex);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, groupState]);

  // Scroll to top of form
  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll to back button (only for successful submissions)
  const scrollToBackButton = () => {
    if (onScrollToBackButton) {
      onScrollToBackButton();
    } else {
      // Fallback to scrollToTop if no callback provided
      scrollToTop();
    }
  };

  // Handle clicking on a group header
  const handleGroupHeaderClick = (groupIndex: number) => {
    const isSingleGroup = questionGroups.length === 1;
    if (isSingleGroup) return;

    const currentGroupState = groupState[currentStep]?.[groupIndex];
    if (!currentGroupState) return;

    // Check if we're on a previously visited step
    const isOnPreviouslyVisitedStep = stepsVisitedForward.has(currentStep);

    if (isOnPreviouslyVisitedStep) {
      // On previously visited steps, allow clicking any group to toggle
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
    } else {
      // On new steps, only allow expanding visited groups or the next unvisited group
      if (!currentGroupState.isExpanded && !currentGroupState.isVisited) {
        // Check if this is the next sequential unvisited group
        const isNextGroup = Object.entries(groupState[currentStep] || {}).every(([idx, state]) => {
          const index = parseInt(idx);
          return index >= groupIndex || state.isVisited;
        });
        if (!isNextGroup) return;
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
    }
  };

  // Check if the last group in the current section has been visited and completed
  const isLastGroupVisitedAndComplete = (): boolean => {
    if (questionGroups.length === 0) return false;

    const lastGroupIndex = questionGroups.length - 1;
    const lastGroupState = groupState[currentStep]?.[lastGroupIndex];

    // Check if last group is visited
    if (!lastGroupState?.isVisited) return false;

    // Check if last group is complete
    return isGroupComplete(lastGroupIndex);
  };

  // Handle clicking the "Next Question" button
  const handleNextQuestion = (groupIndex: number) => {
    if (groupIndex >= questionGroups.length - 1) return;

    const nextGroupIndex = groupIndex + 1;

    // Expand and mark next group as visited
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

    // Scroll to the next group
    setTimeout(() => {
      const nextGroupKey = `${currentStep}-${nextGroupIndex}`;
      const nextGroupElement = groupRefs.current[nextGroupKey];
      if (nextGroupElement) {
        nextGroupElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  const handleNext = async () => {
    // Validate all fields in current section
    const questionIds = getCurrentSectionQuestionIds();
    const isValid = await trigger(questionIds);

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        // Mark this step as completed forward before moving to next step
        setStepsCompletedForward((prev) => new Set(prev).add(currentStep));
        setStepsVisitedForward((prev) => new Set(prev).add(currentStep + 1));
        setCurrentStep((prev) => prev + 1);
        setTimeout(() => {
          scrollToTop();
        }, 50);
      }
    } else {
      setAttemptedValidation(true);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => {
        scrollToTop();
      }, 50);
    }
  };

  const handleStepIndicatorClick = (stepIndex: number) => {
    // Only allow clicking back to previous steps
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      setTimeout(() => {
        scrollToTop();
      }, 50);
    }
  };

  // Handle form validation errors
  const onError = () => {
    setAttemptedValidation(true);
    scrollToTop();
    setUserClickedSubmit(false);
  };

  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    // Prevent accidental submissions - only allow submission on the last step
    if (currentStep < totalSteps - 1) {
      console.warn('Form submission attempted before reaching last step');
      return;
    }

    // Only proceed if user explicitly clicked submit
    if (!userClickedSubmit) {
      console.warn('Form submission prevented - user did not click submit button');
      return;
    }

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
          honeypot: '',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus('error');
        if (result.rateLimited) {
          setErrorMessage(
            'You have submitted too many applications recently. Please try again later.'
          );
        } else if (result.configError) {
          setErrorMessage(
            'The application form is currently unavailable. Please contact me directly via phone or email.'
          );
        } else {
          setErrorMessage(
            result.error ||
              'I encountered an issue submitting your application. Please try contacting me directly.'
          );
        }
        setIsSubmitting(false);
        scrollToTop();
        return;
      }

      setStatus('success');
      setIsSubmitting(false);
      scrollToBackButton();
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(
        'I encountered an issue submitting your application. Please check your internet connection and try again, or contact me directly via phone or email.'
      );
      setIsSubmitting(false);
      scrollToTop();
    }
  };

  const setGroupRef = (key: string, el: HTMLDivElement | null) => {
    groupRefs.current[key] = el;
  };

  // Prevent Enter key from submitting the form unless on the last step
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;

      // Don't interfere with textarea Enter key
      if (target.tagName === 'TEXTAREA') {
        return;
      }

      // Prevent Enter on non-last steps
      if (currentStep < totalSteps - 1) {
        e.preventDefault();
        return;
      }

      // On last step, set the submit flag so Enter key can submit
      setUserClickedSubmit(true);
    }
  };

  // Handle explicit submit button click
  const handleSubmitClick = () => {
    setUserClickedSubmit(true);
  };

  // Handle PDF download when form submission fails
  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);

    try {
      // Get current form values (including any changes made after the error)
      const currentFormData = watch();

      // Call API to generate PDF with current form data
      const response = await fetch('/api/generate-application-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: currentFormData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename using applicant name
      const applicantName = currentFormData.fullName || 'Application';
      const sanitizedName = applicantName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      const date = new Date().toISOString().split('T')[0];
      link.download = `Application_${sanitizedName}_${date}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(
        'I encountered an issue generating the PDF. Please try again or contact me directly via phone or email.'
      );
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div className='w-full max-w-4xl mx-auto' ref={formTopRef}>
      {status !== 'success' && (
        <>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} progress={progress} />

          <StepIndicators
            currentStep={currentStep}
            sections={combinedApplicationFormData}
            onStepClick={handleStepIndicatorClick}
          />

          <SectionHeader
            title={currentSection?.title || ''}
            description={currentSection?.description}
          />
        </>
      )}

      <StatusMessages
        status={status}
        errorMessage={errorMessage}
        errorCount={getCurrentSectionErrorCount()}
        showValidationError={currentSectionHasErrors()}
        onDownloadPDF={handleDownloadPDF}
      />

      {status !== 'success' && (
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          onKeyDown={handleKeyDown}
          className='text-left'>
          <div className='space-y-6'>
            {questionGroups.map((group, groupIndex) => {
              const isSingleGroup = questionGroups.length === 1;
              const isLastGroup = groupIndex === questionGroups.length - 1;
              const groupComplete = isGroupComplete(groupIndex);
              const groupKey = `${currentStep}-${groupIndex}`;
              const hasOnlyRadioButtons = groupHasOnlyRadioButtonRequiredFields(groupIndex);
              const hasVisibleConditionals =
                lastRequiredFieldHasVisibleConditionalSubQuestions(groupIndex);
              const hasFilledFields = groupHasAnyFilledFields(groupIndex);
              const hasIncompleteMandatory = groupHasIncompleteMandatoryFields(groupIndex);

              return (
                <QuestionGroup
                  key={group.id}
                  groupIndex={groupIndex}
                  currentStep={currentStep}
                  groupState={groupState}
                  isSingleGroup={isSingleGroup}
                  isLastGroup={isLastGroup}
                  groupComplete={groupComplete}
                  groupKey={groupKey}
                  groupTitle={group.title}
                  hasOnlyRadioButtons={hasOnlyRadioButtons}
                  hasVisibleConditionals={hasVisibleConditionals}
                  hasFilledFields={hasFilledFields}
                  hasIncompleteMandatory={hasIncompleteMandatory}
                  onHeaderClick={handleGroupHeaderClick}
                  onNextQuestion={handleNextQuestion}
                  setGroupRef={setGroupRef}>
                  {group.questions.map((question) => {
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
                </QuestionGroup>
              );
            })}
          </div>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
            isLastGroupComplete={isLastGroupVisitedAndComplete()}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmitClick={handleSubmitClick}
          />
        </form>
      )}
    </div>
  );
};

export default ApplicationForm;
